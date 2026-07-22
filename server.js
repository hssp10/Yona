import express from 'express';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import nodemailer from 'nodemailer';
import Database from 'better-sqlite3';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || process.env.API_PORT || 3002);
const isProd = process.env.NODE_ENV === 'production';

const IP_REGEX = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
async function resolveHostToIPv4(host) {
  if (!host || IP_REGEX.test(host)) {
    return host;
  }
  try {
    const result = await dns.promises.lookup(host, { family: 4 });
    return result.address;
  } catch (e) {
    console.warn(`[DNS lookup failed for ${host}, fallback to original host]:`, e);
    return host;
  }
}

app.use(express.json({ limit: '2mb' }));

if (isProd) {
  const distPath = join(__dirname, 'dist');
  if (existsSync(distPath)) {
    app.use(express.static(distPath));
    console.log(`📦 Serving static files from ${distPath}`);
  }
}

import net from 'net';

app.get('/api/test-ports', async (req, res) => {
  const host = 'smtp.gmail.com';
  const ports = [25, 80, 443, 465, 587];
  const results = [];

  for (const port of ports) {
    const status = await new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(2500);
      socket.connect(port, host, () => {
        socket.destroy();
        resolve({ port, status: 'open' });
      });
      socket.on('error', (err) => {
        socket.destroy();
        resolve({ port, status: 'closed', error: err.message });
      });
      socket.on('timeout', () => {
        socket.destroy();
        resolve({ port, status: 'timeout' });
      });
    });
    results.push(status);
  }

  res.json({ ok: true, results });
});

// ─── SQLite 초기화 ─────────────────────────────────────────────────────────
// Railway 볼륨은 /data 경로로 마운트됨. DB_PATH 환경변수로 오버라이드 가능.
const dbPath = process.env.DB_PATH || join(__dirname, 'yona.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// 마이그레이션 및 칼럼 검증을 위한 구조 강제 마이그레이션
try {
  const tableInfo = db.prepare("PRAGMA table_info(users)").all();
  const hasPassword = tableInfo.some(col => col.name === 'password');
  if (tableInfo.length > 0 && !hasPassword) {
    console.log('⚠️ 비밀번호 기능 도입: users 테이블 구조를 업데이트합니다.');
    db.exec(`
      DROP TABLE IF EXISTS letters;
      DROP TABLE IF EXISTS users;
    `);
  }
  
  // Add timezone column if missing
  const hasTimezone = tableInfo.some(col => col.name === 'timezone');
  if (tableInfo.length > 0 && !hasTimezone) {
    db.exec("ALTER TABLE users ADD COLUMN timezone TEXT DEFAULT 'Asia/Seoul'");
    console.log('✅ Added timezone column to users table');
  }
} catch (e) {
  console.warn('DB 검증 오류, 테이블을 신규 생성합니다:', e);
}

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    name  TEXT NOT NULL,
    password TEXT NOT NULL,
    timezone TEXT DEFAULT 'Asia/Seoul',
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
  );

  CREATE TABLE IF NOT EXISTS letters (
    id              TEXT PRIMARY KEY,
    author_email    TEXT NOT NULL,
    title           TEXT,
    recipient       TEXT,
    recipient_contact TEXT,
    content         TEXT,
    unlock_date     TEXT,
    mood            TEXT,
    status          TEXT DEFAULT 'locked',
    plan            TEXT,
    price           INTEGER,
    payment_method  TEXT,
    created_date    TEXT,
    created_at      TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (author_email) REFERENCES users(email)
  );

  -- ─── 인덱스 (자주 쿼리되는 컬럼에 복합/단일 인덱스 설정) ───────────────
  -- 특정 유저의 편지 목록 조회
  CREATE INDEX IF NOT EXISTS idx_letters_author_email
    ON letters (author_email);

  -- 스케줄러: status='locked' 필터링 (매 1분 폴링)
  CREATE INDEX IF NOT EXISTS idx_letters_status
    ON letters (status);

  -- 스케줄러 + 복합 조건 (status + unlock_date 순서 조회)
  CREATE INDEX IF NOT EXISTS idx_letters_status_unlock
    ON letters (status, unlock_date);

  -- 생성일 기반 정렬
  CREATE INDEX IF NOT EXISTS idx_letters_created_at
    ON letters (created_at DESC);
`);

console.log('✅ SQLite DB 초기화 완료 (heritage-ledger.db)');

// ─── 양방향 암호화 (AES-256-CBC) ──────────────────────────
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'yona_secret_32_bytes_capsule_key_auth'; // Must be 32 bytes
const IV_LENGTH = 16;

function encrypt(text) {
  if (!text) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.substring(0, 32)), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  if (!text) return '';
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.substring(0, 32)), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function verifyPassword(inputPassword, storedPassword) {
  if (!storedPassword) return false;
  if (!storedPassword.includes(':')) {
    // 호환성을 위한 평문 비교
    return inputPassword === storedPassword;
  }
  try {
    const decrypted = decrypt(storedPassword);
    return inputPassword === decrypted;
  } catch (e) {
    // 복호화 실패 시 평문 비교 예외 처리
    return inputPassword === storedPassword;
  }
}

// ─── 기존 평문 비밀번호 암호화 마이그레이션 ──────────────────────────
try {
  const plainUsers = db.prepare("SELECT * FROM users WHERE password NOT LIKE '%:%'").all();
  if (plainUsers.length > 0) {
    console.log(`🔒 [Migration] ${plainUsers.length}명의 기존 평문 비밀번호 유저를 감지하여 암호화 처리를 진행합니다.`);
    const updateStmt = db.prepare("UPDATE users SET password = ? WHERE email = ?");
    for (const u of plainUsers) {
      const encrypted = encrypt(u.password);
      updateStmt.run(encrypted, u.email);
    }
    console.log("✅ [Migration] 모든 평문 비밀번호 암호화 완료");
  }
} catch (e) {
  console.warn("⚠️ [Migration] 기존 비밀번호 암호화 마이그레이션 실패:", e);
}

// In-Memory OTP Store
const otpStore = new Map(); // email -> { otp, expiresAt }

const extractEmail = (value = '') => {
  const match = value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match?.[0] || '';
};

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatUnlockDateInTimezone = (dateStr, tzName = 'Asia/Seoul') => {
  if (!dateStr) return '';
  
  const parsedStr = dateStr.includes(' ') && !dateStr.includes('T') && !dateStr.includes('Z')
    ? dateStr.replace(' ', 'T')
    : dateStr;
    
  const dateObj = new Date(parsedStr);
  if (isNaN(dateObj.getTime())) return dateStr;
  
  const offsets = {
    'Asia/Seoul': 9, 'Asia/Tokyo': 9,
    'Asia/Shanghai': 8, 'Asia/Hong_Kong': 8, 'Asia/Taipei': 8,
    'Asia/Singapore': 8, 'Asia/Kuala_Lumpur': 8, 'Asia/Manila': 8,
    'Asia/Bangkok': 7, 'Asia/Jakarta': 7, 'Asia/Ho_Chi_Minh': 7,
    'Asia/Kolkata': 5.5, 'Asia/Colombo': 5.5,
    'Asia/Dhaka': 6, 'Asia/Karachi': 5,
    'Asia/Dubai': 4, 'Asia/Tehran': 3.5, 'Asia/Riyadh': 3, 'Asia/Istanbul': 3,
    'Pacific/Auckland': 12, 'Pacific/Honolulu': -10,
    'Australia/Sydney': 10, 'Australia/Adelaide': 9.5, 'Australia/Perth': 8,
    'Europe/London': 1, 'Europe/Lisbon': 1,
    'Europe/Paris': 2, 'Europe/Berlin': 2, 'Europe/Rome': 2, 'Europe/Madrid': 2,
    'Europe/Amsterdam': 2, 'Europe/Stockholm': 2, 'Europe/Zurich': 2,
    'Europe/Warsaw': 2, 'Europe/Helsinki': 3, 'Europe/Athens': 3,
    'Europe/Moscow': 3,
    'America/New_York': -4, 'America/Toronto': -4,
    'America/Chicago': -5, 'America/Mexico_City': -5, 'America/Bogota': -5, 'America/Lima': -5,
    'America/Denver': -6,
    'America/Los_Angeles': -7, 'America/Vancouver': -7,
    'America/Anchorage': -8,
    'America/Sao_Paulo': -3, 'America/Argentina/Buenos_Aires': -3, 'America/Santiago': -3,
    'Africa/Cairo': 2, 'Africa/Johannesburg': 2, 'Africa/Nairobi': 3,
    'Africa/Lagos': 1, 'Africa/Casablanca': 1,
  };
  const offsetHours = offsets[tzName] !== undefined ? offsets[tzName] : 9;
  const targetTime = new Date(dateObj.getTime() + (offsetHours * 60 * 60 * 1000));
  
  const year = targetTime.getUTCFullYear();
  const month = String(targetTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(targetTime.getUTCDate()).padStart(2, '0');
  const hours = String(targetTime.getUTCHours()).padStart(2, '0');
  const minutes = String(targetTime.getUTCMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes} (${tzName})`;
};

const rowToLetter = (row) => ({
  id: row.id,
  authorEmail: row.author_email,
  title: row.title,
  recipient: row.recipient,
  recipientContact: row.recipient_contact,
  content: row.content,
  unlockDate: row.unlock_date,
  sealType: row.mood,
  mood: row.mood,
  status: row.status,
  plan: row.plan,
  price: row.price,
  paymentMethod: row.payment_method,
  createdDate: row.created_date,
});

// ─── 헬스 체크 ──────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: 'sqlite' });
});

// ─── 이메일 OTP 전송 API ───────────────────────────────────────────
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body || {};
  if (!email || !email.includes('@')) {
    return res.status(400).json({ ok: false, message: '올바른 이메일 주소를 입력해주세요.' });
  }

  // 6자리 무작위 OTP 생성
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5분 만료
  otpStore.set(email, { otp, expiresAt });

  console.log(`[OTP GENERATED] ${email} -> ${otp}`);

  // 이메일 발송 시도
  const missing = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'].filter(k => !process.env[k]);
  if (missing.length > 0) {
    // 개발 편의를 위해 환경변수가 없을 경우 로그로만 OTP를 출력하고 응답 성공 처리
    return res.json({
      ok: true,
      simulation: true,
      message: `이메일 발송 환경변수 누락 (${missing.join(', ')}). 화면의 데모 안내를 참고하세요.`
    });
  }

  try {
    const smtpHost = await resolveHostToIPv4(process.env.SMTP_HOST);
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 5000,
      socketTimeout: 5000,
      greetingTimeout: 5000,
      tls: {
        servername: process.env.SMTP_HOST
      }
    });

    const sender = process.env.SMTP_FROM || process.env.SMTP_USER;
    await transporter.sendMail({
      from: sender,
      to: email,
      subject: '[Yona] 이메일 인증번호 안내',
      html: `<!DOCTYPE html>
<html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Yona 인증</title></head>
<body style="margin:0;padding:0;background-color:#1A1714;font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Malgun Gothic',Georgia,serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#1A1714;padding:48px 16px;">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">

  <!-- Wordmark -->
  <tr><td style="padding-bottom:32px;text-align:center;">
    <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.35em;color:#8A7A60;text-transform:uppercase;">🕊 &nbsp; Y O N A</p>
  </td></tr>

  <!-- Card -->
  <tr><td style="background:#F7F3ED;border-radius:3px;overflow:hidden;box-shadow:0 0 0 1px rgba(255,255,255,0.04),0 32px 64px rgba(0,0,0,0.6);">

    <!-- Top border stripe -->
    <div style="height:4px;background:linear-gradient(90deg,#8B6914 0%,#C9973A 40%,#D4AF37 60%,#8B6914 100%);"></div>

    <!-- Header area -->
    <div style="padding:40px 44px 32px;background:#F7F3ED;border-bottom:1px solid #E5DDD0;">
      <p style="margin:0 0 10px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:#B8975A;">VERIFICATION CODE</p>
      <h1 style="margin:0;font-size:26px;font-weight:300;color:#1C1814;letter-spacing:-0.02em;line-height:1.2;">인증번호를 <strong style="font-weight:700;">확인</strong>하세요</h1>
    </div>

    <!-- Body -->
    <div style="padding:36px 44px;background:url('') #FDFAF6;">

      <!-- Subtle ruled lines feel -->
      <p style="margin:0 0 28px;font-size:14px;color:#6B5E4C;line-height:1.85;">안녕하세요.<br>Yona 서비스 이용을 위한 이메일 인증번호입니다.</p>

      <!-- OTP box -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr><td style="background:#1A1714;border-radius:3px;padding:28px 20px;text-align:center;">
          <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:9px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:#8A7A60;">ONE-TIME PASSWORD</p>
          <span style="font-size:40px;font-weight:700;letter-spacing:14px;color:#D4AF37;font-family:'Courier New',Courier,monospace;">${otp}</span>
        </td></tr>
      </table>

      <p style="margin:0;font-size:11.5px;color:#9C8E7E;line-height:1.8;">본 인증번호는 발급 후 <strong style="color:#6B5E4C;">5분간 유효</strong>합니다.<br>본인이 요청하지 않은 경우 이 이메일을 무시하세요.</p>
    </div>

    <!-- Footer -->
    <div style="padding:18px 44px;background:#F0EAE0;border-top:1px solid #E0D6C6;text-align:center;">
      <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:9px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#B8975A;">Yona &copy; Eternal Archive &nbsp;&middot;&nbsp; Time-Sealed Delivery</p>
    </div>

  </td></tr>

</table>
</td></tr>
</table>
</body></html>`
    });
    res.json({ ok: true, message: '인증 메일이 발송되었습니다.' });
  } catch (error) {
    console.error('SMTP OTP 전송 실패:', error);
    res.status(500).json({ ok: false, message: '이메일 전송에 실패했습니다. 입력한 메일 주소를 확인하세요.' });
  }
});

// ─── AUTH: OTP 검증 ──────────────────────────────────────────
app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body || {};
  if (!email || !otp) {
    return res.status(400).json({ ok: false, message: '이메일과 인증번호를 모두 입력하세요.' });
  }

  const record = otpStore.get(email);
  if (!record) {
    return res.status(400).json({ ok: false, message: '발급된 인증번호가 없습니다. 다시 요청해 주세요.' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ ok: false, message: '만료된 인증번호입니다. 새로 요청해 주세요.' });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ ok: false, message: '인증번호가 일치하지 않습니다.' });
  }

  res.json({ ok: true, message: '이메일 인증이 완료되었습니다. 비밀번호를 설정해 주세요.' });
});

// ─── AUTH: 회원가입 (이메일 + 이름 + 비밀번호 8자 이상) ─────────────
app.post('/api/auth/register', (req, res) => {
  const { email, name, password, timezone } = req.body || {};
  if (!email || !name || !password) {
    return res.status(400).json({ ok: false, message: '이메일, 이름, 비밀번호를 모두 입력해 주세요.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ ok: false, message: '비밀번호는 최소 8자 이상이어야 합니다.' });
  }

  const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (existingUser) {
    return res.status(400).json({ ok: false, message: '이미 가입된 이메일 주소입니다. 로그인 화면에서 로그인해 주세요.' });
  }

  try {
    const encryptedPassword = encrypt(password);
    db.prepare('INSERT INTO users (email, name, password, timezone) VALUES (?, ?, ?, ?)').run(email.trim(), name.trim(), encryptedPassword, timezone || 'Asia/Seoul');
    otpStore.delete(email);
    res.json({ ok: true, message: '회원가입이 성공적으로 완료되었습니다! 이제 로그인해 주세요.' });
  } catch (err) {
    console.error('회원가입 DB 저장 오류:', err);
    res.status(500).json({ ok: false, message: '회원가입 처리 중 오류가 발생했습니다.' });
  }
});

// ─── AUTH: 로그인 (이메일 + 비밀번호) ──────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ ok: false, message: '이메일과 비밀번호를 모두 입력해 주세요.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim());
  if (!user) {
    return res.status(400).json({ ok: false, message: '등록되지 않은 이메일 주소입니다. 먼저 회원가입을 진행해 주세요.' });
  }

  if (!verifyPassword(password, user.password)) {
    return res.status(400).json({ ok: false, message: '비밀번호가 일치하지 않습니다. 다시 확인해 주세요.' });
  }

  res.json({
    ok: true,
    user: { email: user.email, name: user.name, timezone: user.timezone }
  });
});

// ─── AUTH: 계정 삭제 (회원 탈퇴) ──────────────────────────────────
app.post('/api/auth/delete-account', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ ok: false, message: '이메일과 확인 비밀번호를 모두 입력해 주세요.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim());
  if (!user) {
    return res.status(404).json({ ok: false, message: '사용자를 찾을 수 없습니다.' });
  }

  if (!verifyPassword(password, user.password)) {
    return res.status(400).json({ ok: false, message: '비밀번호가 일치하지 않아 계정을 삭제할 수 없습니다.' });
  }

  try {
    // 사용자의 타임캡슐 서신 삭제
    db.prepare('DELETE FROM letters WHERE author_email = ?').run(email.trim());
    // 사용자 삭제
    db.prepare('DELETE FROM users WHERE email = ?').run(email.trim());

    res.json({ ok: true, message: '계정 및 관련된 모든 타임캡슐 보관 데이터가 성공적으로 삭제되었습니다.' });
  } catch (err) {
    console.error('계정 삭제 오류:', err);
    res.status(500).json({ ok: false, message: '계정 삭제 처리 중 오류가 발생했습니다.' });
  }
});

// ─── 사용자 API ─────────────────────────────────────────────────
app.get('/api/users/:email', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(req.params.email);
  if (!user) return res.status(404).json({ ok: false, message: '사용자를 찾을 수 없습니다.' });
  res.json({ ok: true, user: { email: user.email, name: user.name, timezone: user.timezone } });
});

app.put('/api/users/update-profile', (req, res) => {
  const { name, email } = req.body || {};
  if (!email || !name) {
    return res.status(400).json({ ok: false, message: '이름과 이메일을 모두 제공해야 합니다.' });
  }
  try {
    db.prepare('UPDATE users SET name = ? WHERE email = ?').run(name.trim(), email.trim());
    res.json({ ok: true, message: '프로필 정보가 업데이트되었습니다.' });
  } catch (err) {
    console.error('프로필 업데이트 오류:', err);
    res.status(500).json({ ok: false, message: '프로필 업데이트 중 오류가 발생했습니다.' });
  }
});

// ─── 편지 API ───────────────────────────────────────────────────

app.get('/api/letters/:email', (req, res) => {
  const rows = db.prepare(
    'SELECT * FROM letters WHERE author_email = ? ORDER BY created_at DESC'
  ).all(req.params.email);
  res.json({ ok: true, letters: rows.map(rowToLetter) });
});

app.post('/api/letters', (req, res) => {
  const { letter } = req.body || {};
  if (!letter?.id || !letter?.authorEmail) {
    return res.status(400).json({ ok: false, message: '편지 데이터가 올바르지 않습니다.' });
  }
  db.prepare(`
    INSERT OR REPLACE INTO letters
      (id, author_email, title, recipient, recipient_contact, content,
       unlock_date, mood, status, plan, price, payment_method, created_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    letter.id, letter.authorEmail, letter.title, letter.recipient,
    letter.recipientContact, letter.content, letter.unlockDate,
    letter.sealType || letter.mood, letter.status || 'locked', letter.plan,
    letter.price, letter.paymentMethod, letter.createdDate
  );
  res.json({ ok: true, letter: rowToLetter(
    db.prepare('SELECT * FROM letters WHERE id = ?').get(letter.id)
  )});
});

app.put('/api/letters/:id', (req, res) => {
  const { fields } = req.body || {};
  const existing = db.prepare('SELECT * FROM letters WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ ok: false, message: '편지를 찾을 수 없습니다.' });

  const merged = { ...rowToLetter(existing), ...fields };
  db.prepare(`
    UPDATE letters SET
      title = ?, recipient = ?, recipient_contact = ?, content = ?,
      unlock_date = ?, mood = ?, status = ?
    WHERE id = ?
  `).run(
    merged.title, merged.recipient, merged.recipientContact, merged.content,
    merged.unlockDate, merged.sealType || merged.mood, merged.status, req.params.id
  );
  res.json({ ok: true, letter: rowToLetter(
    db.prepare('SELECT * FROM letters WHERE id = ?').get(req.params.id)
  )});
});

app.delete('/api/letters/:id', (req, res) => {
  const info = db.prepare('DELETE FROM letters WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ ok: false, message: '편지를 찾을 수 없습니다.' });
  res.json({ ok: true });
});

// ─── 이메일 발송 + 편지 저장 통합 ─────────────────────────────────
app.post('/api/send-letter-email', async (req, res) => {
  const { letter, planTitle } = req.body || {};

  const now = new Date();
  let unlockTime = null;
  if (letter?.unlockDate) {
    if (letter.unlockDate.includes('T') || letter.unlockDate.includes('Z')) {
      unlockTime = new Date(letter.unlockDate);
    } else {
      const author = db.prepare('SELECT * FROM users WHERE email = ?').get(letter.authorEmail || '');
      const tz = author ? author.timezone : 'Asia/Seoul';
      const offsets = {
        // Asia / Pacific
        'Asia/Seoul': 9, 'Asia/Tokyo': 9,
        'Asia/Shanghai': 8, 'Asia/Hong_Kong': 8, 'Asia/Taipei': 8,
        'Asia/Singapore': 8, 'Asia/Kuala_Lumpur': 8, 'Asia/Manila': 8,
        'Asia/Bangkok': 7, 'Asia/Jakarta': 7, 'Asia/Ho_Chi_Minh': 7,
        'Asia/Kolkata': 5.5, 'Asia/Colombo': 5.5,
        'Asia/Dhaka': 6, 'Asia/Karachi': 5,
        'Asia/Dubai': 4, 'Asia/Tehran': 3.5, 'Asia/Riyadh': 3, 'Asia/Istanbul': 3,
        'Pacific/Auckland': 12, 'Pacific/Honolulu': -10,
        'Australia/Sydney': 10, 'Australia/Adelaide': 9.5, 'Australia/Perth': 8,
        // Europe
        'Europe/London': 1, 'Europe/Lisbon': 1,
        'Europe/Paris': 2, 'Europe/Berlin': 2, 'Europe/Rome': 2, 'Europe/Madrid': 2,
        'Europe/Amsterdam': 2, 'Europe/Stockholm': 2, 'Europe/Zurich': 2,
        'Europe/Warsaw': 2, 'Europe/Helsinki': 3, 'Europe/Athens': 3,
        'Europe/Moscow': 3,
        // Americas
        'America/New_York': -4, 'America/Toronto': -4,
        'America/Chicago': -5, 'America/Mexico_City': -5, 'America/Bogota': -5, 'America/Lima': -5,
        'America/Denver': -6,
        'America/Los_Angeles': -7, 'America/Vancouver': -7,
        'America/Anchorage': -8,
        'America/Sao_Paulo': -3, 'America/Argentina/Buenos_Aires': -3, 'America/Santiago': -3,
        // Africa
        'Africa/Cairo': 2, 'Africa/Johannesburg': 2, 'Africa/Nairobi': 3,
        'Africa/Lagos': 1, 'Africa/Casablanca': 1,
      };
      const offsetHours = offsets[tz] !== undefined ? offsets[tz] : 9;
      const kstStr = letter.unlockDate.includes(' ')
        ? letter.unlockDate.replace(' ', 'T') + (offsetHours >= 0 ? `+${String(offsetHours).padStart(2, '0')}:00` : `-${String(Math.abs(offsetHours)).padStart(2, '0')}:00`)
        : letter.unlockDate + 'T00:00:00+09:00';
      unlockTime = new Date(kstStr);
    }
  }

  const isFuture = unlockTime && !isNaN(unlockTime.getTime()) && unlockTime > now;
  const letterStatus = letter?.status || (isFuture ? 'locked' : 'delivered');

  // DB 저장
  if (letter?.id && letter?.authorEmail) {
    db.prepare(`
      INSERT OR REPLACE INTO letters
        (id, author_email, title, recipient, recipient_contact, content,
         unlock_date, mood, status, plan, price, payment_method, created_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      letter.id, letter.authorEmail, letter.title, letter.recipient,
      letter.recipientContact, letter.content, letter.unlockDate,
      letter.sealType || letter.mood, letterStatus, letter.plan,
      letter.price, letter.paymentMethod, letter.createdDate
    );
  }

  const recipientEmail = extractEmail(letter?.recipientContact || '');
  if (!recipientEmail) {
    return res.json({
      ok: true,
      emailSent: false,
      message: '편지가 성공적으로 저장되었습니다. (수신 메일 주소 생략)'
    });
  }

  // If the letter is locked (time-locked), do not send email on checkout.
  // The background scheduler daemon will send it when the unlock time is reached.
  if (letterStatus === 'locked') {
    return res.json({
      ok: true,
      emailSent: false,
      message: '편지가 성공적으로 아카이브에 봉인되었습니다.'
    });
  }

  const missing = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'].filter(k => !process.env[k]);
  if (missing.length > 0) {
    return res.json({
      ok: true,
      emailSent: false,
      message: `편지가 저장되었습니다. (발송 설정 미비: ${missing.join(', ')})`
    });
  }

  const author = db.prepare('SELECT * FROM users WHERE email = ?').get(letter?.authorEmail || '');
  const timezone = author ? author.timezone : 'Asia/Seoul';
  const formattedUnlockDate = formatUnlockDateInTimezone(letter?.unlockDate, timezone);

  const smtpHost = await resolveHostToIPv4(process.env.SMTP_HOST);
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 5000,
    socketTimeout: 5000,
    greetingTimeout: 5000,
    tls: {
      servername: process.env.SMTP_HOST
    }
  });

  // 왁스 인장 색상 매핑
  const sealColors = {
    'classic-cognac': { main: '#C9973A', light: '#FBF4E6', border: '#E8D5A3', name: '황금 왁스 인장', dot: '#D4AF37' },
    'royal-navy':     { main: '#1E40AF', light: '#EEF2FF', border: '#BFDBFE', name: '로열 블루 엠블럼', dot: '#2563EB' },
    'emerald-seal':   { main: '#047857', light: '#ECFDF5', border: '#A7F3D0', name: '에메랄드 인장',   dot: '#10B981' },
    'amber-gold':     { main: '#B45309', light: '#FFFBEB', border: '#FDE68A', name: '코냑 앰버 크라운', dot: '#D97706' },
  };
  const seal = sealColors[letter?.sealType] || sealColors['classic-cognac'];

  // 음악 URL 섹션
  const musicUrl = letter?.musicUrl || '';
  const musicSection = musicUrl ? `
    <div style="margin-top: 24px; padding: 16px 20px; background: ${seal.light}; border: 1px solid ${seal.border}; border-radius: 12px;">
      <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: ${seal.main};">🎵 함께 보내는 음악</p>
      <a href="${escapeHtml(musicUrl)}" style="color: ${seal.main}; font-size: 13px; font-weight: 600; word-break: break-all;">${escapeHtml(musicUrl)}</a>
    </div>` : '';

  const sender = process.env.SMTP_FROM || process.env.SMTP_USER;
  const subject = `[Yona] ${letter?.title || '보관된 편지'} — 타임캡슐이 도착했습니다`;

  const html = `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background-color:#F5F4F2; font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', 'Segoe UI', sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F4F2; padding: 40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

        <!-- Top Brand Bar -->
        <tr>
          <td style="padding-bottom: 24px; text-align: center;">
            <div style="display:inline-block; background: ${seal.light}; border: 1px solid ${seal.border}; border-radius: 99px; padding: 8px 20px;">
              <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${seal.dot}; vertical-align:middle; margin-right:8px;"></span>
              <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.25em; color: ${seal.main}; text-transform: uppercase; vertical-align:middle;">Yona &middot; ${escapeHtml(seal.name)}</span>
            </div>
          </td>
        </tr>

        <!-- Main Card -->
        <tr>
          <td>
            <div style="background:#ffffff; border-radius: 20px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">

              <!-- Seal Color Header Bar -->
              <div style="background: linear-gradient(135deg, ${seal.main}, ${seal.dot}); padding: 28px 36px 24px;">
                <p style="margin:0 0 6px 0; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.75);">Time Capsule &middot; Unsealed</p>
                <h1 style="margin:0; font-size: 26px; font-weight: 700; color: #ffffff; line-height: 1.3;">${escapeHtml(letter?.title || 'Yona Message')}</h1>
              </div>

              <!-- Body -->
              <div style="padding: 32px 36px;">

                <!-- Metadata -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px; background: ${seal.light}; border-radius: 12px; border: 1px solid ${seal.border};">
                  <tr>
                    <td style="padding: 16px 20px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 5px 0; font-size: 12px; font-weight: 600; color: #9C8F7E; width: 90px;">송신인</td>
                          <td style="padding: 5px 0; font-size: 13px; font-weight: 700; color: #1C1917;">${escapeHtml(letter?.sender || letter?.recipient || '')}</td>
                        </tr>
                        <tr>
                          <td style="padding: 5px 0; font-size: 12px; font-weight: 600; color: #9C8F7E;">봉인 인장</td>
                          <td style="padding: 5px 0; font-size: 13px; font-weight: 700; color: ${seal.main};">${escapeHtml(letter?.sealName || seal.name)}</td>
                        </tr>
                        <tr>
                          <td style="padding: 5px 0; font-size: 12px; font-weight: 600; color: #9C8F7E;">개봉 시각</td>
                          <td style="padding: 5px 0; font-size: 13px; font-weight: 700; color: #1C1917;">${escapeHtml(formattedUnlockDate)}</td>
                        </tr>
                        <tr>
                          <td style="padding: 5px 0; font-size: 12px; font-weight: 600; color: #9C8F7E;">보관 플랜</td>
                          <td style="padding: 5px 0; font-size: 13px; font-weight: 700; color: #1C1917;">${escapeHtml(planTitle || letter?.plan || '')}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Divider -->
                <div style="width: 40px; height: 3px; background: ${seal.dot}; border-radius: 2px; margin-bottom: 24px;"></div>

                <!-- Letter Content -->
                <div style="font-size: 15px; line-height: 1.85; color: #2C2825; white-space: pre-wrap; background: #FAFAF9; padding: 24px; border-radius: 12px; border: 1px solid #EEEBE6; min-height: 100px;">${escapeHtml(letter?.content || '')}</div>

                ${musicSection}

                <!-- Footer -->
                <div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid #EEEBE6; text-align: center;">
                  <p style="margin:0; font-size: 11px; color: #A09587; line-height: 1.6;">
                    이 편지는 <strong style="color:${seal.main}">Yona</strong> 양자 보호 아카이브 시스템에 의해<br>
                    지정된 시각에 자동으로 해봉 전송되었습니다.
                  </p>
                </div>

              </div>
            </div>
          </td>
        </tr>

        <!-- Bottom notice -->
        <tr>
          <td style="padding-top: 20px; text-align: center;">
            <p style="margin:0; font-size: 10px; color: #B8AFA6;">Yona &copy; Eternal Archive &middot; Time-Sealed Delivery</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;

  try {
    await transporter.sendMail({
      from: sender, to: recipientEmail, subject, text: letter?.content || '', html
    });
    res.json({ ok: true, emailSent: true, recipientEmail });
  } catch (error) {
    console.error('Email send failed:', error);
    res.json({
      ok: true,
      emailSent: false,
      message: '편지는 성공적으로 저장되었으나 이메일 전송에 일시적 지연이 발생했습니다.'
    });
  }
});

// ─── 타임락 자동 해봉 및 수신인 이메일 발송 스케줄러 ──────────────────
async function processTimeLockedLetters() {
  const now = new Date();

  try {
    const lockedLetters = db.prepare("SELECT * FROM letters WHERE status = 'locked'").all();
    if (lockedLetters.length === 0) return;

    const overdueLetters = lockedLetters.filter(letter => {
      if (!letter.unlock_date) return false;
      let unlockTime;
      if (letter.unlock_date.includes('T') || letter.unlock_date.includes('Z')) {
        unlockTime = new Date(letter.unlock_date);
      } else {
        const kstStr = letter.unlock_date.includes(' ') 
          ? letter.unlock_date.replace(' ', 'T') + '+09:00'
          : letter.unlock_date + 'T00:00:00+09:00';
        unlockTime = new Date(kstStr);
      }
      return !isNaN(unlockTime.getTime()) && unlockTime <= now;
    });

    if (overdueLetters.length === 0) return;

    console.log(`⏰ [Scheduler] ${overdueLetters.length}개의 해봉 대상 타임캡슐 감지. (기준시각 UTC: ${now.toISOString()})`);

    const missing = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'].filter(k => !process.env[k]);

    for (const letter of overdueLetters) {
      const recipientEmail = extractEmail(letter.recipient_contact);
      const author = db.prepare('SELECT * FROM users WHERE email = ?').get(letter.author_email);
      const timezone = author ? author.timezone : 'Asia/Seoul';
      const formattedUnlockDate = formatUnlockDateInTimezone(letter.unlock_date, timezone);

      if (missing.length === 0 && recipientEmail) {
        try {
          const smtpHost = await resolveHostToIPv4(process.env.SMTP_HOST);
          const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true',
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
            connectionTimeout: 5000,
            socketTimeout: 5000,
            greetingTimeout: 5000,
            tls: {
              servername: process.env.SMTP_HOST
            }
          });

          const sender = process.env.SMTP_FROM || process.env.SMTP_USER;
          const subject = `[Yona] ${letter.title || '소중한 타임캡슐 편지'} — 타임캡슐이 도착했습니다`;

          // 왁스 인장 색상 매핑
          const sealColorsMap = {
            'classic-cognac': { main: '#C9973A', light: '#FBF4E6', border: '#E8D5A3', name: '황금 왁스 인장', dot: '#D4AF37' },
            'royal-navy':     { main: '#1E40AF', light: '#EEF2FF', border: '#BFDBFE', name: '로열 블루 엠블럼', dot: '#2563EB' },
            'emerald-seal':   { main: '#047857', light: '#ECFDF5', border: '#A7F3D0', name: '에메랄드 인장',   dot: '#10B981' },
            'amber-gold':     { main: '#B45309', light: '#FFFBEB', border: '#FDE68A', name: '코냑 앰버 크라운', dot: '#D97706' },
          };
          const seal = sealColorsMap[letter.mood] || sealColorsMap['classic-cognac'];

          // 음악 URL 섹션
          const musicSection = letter.music_url ? `
            <tr><td style="padding: 0 0 24px 0;">
              <div style="padding: 14px 18px; background: ${seal.light}; border: 1px solid ${seal.border}; border-radius: 10px; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: ${seal.main}; display: block; margin-bottom: 6px;">🎵 함께 보내는 음악</span>
                <a href="${escapeHtml(letter.music_url)}" style="color: ${seal.main}; font-size: 13px; font-weight: 600; word-break: break-all; display: block;">${escapeHtml(letter.music_url)}</a>
              </div>
            </td></tr>` : '';

          const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Yona — 타임캡슐 편지</title>
</head>
<body style="margin:0;padding:0;background-color:#141210;font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Malgun Gothic',Georgia,serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#141210;padding:52px 16px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

  <!-- Wordmark row -->
  <tr><td style="padding-bottom:36px;text-align:center;">
    <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.42em;color:#6B5C40;text-transform:uppercase;">🕊&nbsp;&nbsp;Y O N A</p>
  </td></tr>

  <!-- Main envelope card -->
  <tr><td style="border-radius:2px;overflow:hidden;box-shadow:0 2px 0 ${seal.main}44,0 40px 80px rgba(0,0,0,0.7);">

    <!-- Gold stripe top -->
    <div style="height:3px;background:linear-gradient(90deg,transparent 0%,${seal.main} 20%,${seal.dot} 50%,${seal.main} 80%,transparent 100%);"></div>

    <!-- Dark envelope header -->
    <div style="background:#1E1A16;padding:36px 48px 32px;border-bottom:1px solid #2E2820;">

      <!-- Seal badge -->
      <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td style="background:#2A2218;border:1px solid ${seal.main}55;border-radius:3px;padding:5px 14px;">
            <span style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:9px;font-weight:700;letter-spacing:0.32em;text-transform:uppercase;color:${seal.dot};">TIME CAPSULE &nbsp;&middot;&nbsp; ${escapeHtml(seal.name)}</span>
          </td>
        </tr>
      </table>

      <h1 style="margin:0 0 12px;font-size:30px;font-weight:300;color:#F0EAD8;line-height:1.2;letter-spacing:-0.02em;">${escapeHtml(letter.title || 'Yona Message')}</h1>
      <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:11px;color:#7A6A4A;letter-spacing:0.08em;">개봉 시각 &nbsp;·&nbsp; ${escapeHtml(formattedUnlockDate)}</p>
    </div>

    <!-- Parchment paper letter body (light) -->
    <div style="background:#F9F5EE;background-image:repeating-linear-gradient(transparent,transparent 29px,#EAE3D3 30px);border-left:4px solid ${seal.main};padding:40px 48px 36px;">

      <!-- To line -->
      <p style="margin:0 0 8px;font-size:13px;color:#8A7860;font-style:italic;">${escapeHtml(letter.recipient || '')} 님께,</p>

      <!-- Decorative line -->
      <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr>
          <td style="width:28px;height:1px;background:${seal.dot};"></td>
          <td style="width:8px;height:1px;background:transparent;"></td>
          <td style="width:8px;height:1px;background:${seal.dot}55;"></td>
        </tr>
      </table>

      <!-- Content -->
      <div style="font-size:15.5px;line-height:2.1;color:#2A2218;white-space:pre-wrap;word-break:break-word;margin-bottom:36px;">${escapeHtml(letter.content || '')}</div>

      ${letter.music_url ? `<!-- Music link -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr><td style="background:#1E1A16;border-radius:3px;padding:14px 18px;">
          <p style="margin:0 0 6px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:9px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:${seal.dot};">🎵 &nbsp;함께 보내는 음악</p>
          <a href="${escapeHtml(letter.music_url)}" style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:${seal.dot};font-size:12px;font-weight:600;word-break:break-all;text-decoration:none;">${escapeHtml(letter.music_url)}</a>
        </td></tr>
      </table>` : ''}

      <!-- Closing -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="border-top:1px dashed #D4C9B0;padding-top:22px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right:14px;vertical-align:middle;">
                  <!-- Wax seal circle -->
                  <table cellpadding="0" cellspacing="0">
                    <tr><td style="width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 38% 38%,${seal.dot},${seal.main});box-shadow:0 2px 10px ${seal.main}66;text-align:center;line-height:44px;font-size:19px;">🕊️</td></tr>
                  </table>
                </td>
                <td style="vertical-align:middle;">
                  <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${seal.main};">${escapeHtml(seal.name)}</p>
                  <p style="margin:4px 0 0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:9px;color:#9C8E7A;letter-spacing:0.06em;">Yona Certified Archive &nbsp;&middot;&nbsp; ${escapeHtml(formattedUnlockDate)}</p>
                </td>
                <td style="text-align:right;vertical-align:middle;">
                  <p style="margin:0;font-size:12px;color:#8A7860;font-style:italic;">— 시간을 넘어온 편지</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

    </div>

    <!-- Dark footer -->
    <div style="background:#1E1A16;border-top:1px solid #2E2820;padding:16px 48px;text-align:center;">
      <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:9px;font-weight:700;letter-spacing:0.26em;text-transform:uppercase;color:#5A4E38;">Yona &copy; Eternal Archive &nbsp;&middot;&nbsp; Time-Sealed Delivery</p>
    </div>

  </td></tr>

</table>
</td></tr>
</table>

</body>
</html>`;

          await transporter.sendMail({
            from: sender,
            to: recipientEmail,
            subject,
            text: `${letter.title || 'Yona 타임캡슐 편지'}\n\n${letter.recipient || ''} 님께,\n\n${letter.content || ''}\n\n개봉 시각: ${formattedUnlockDate}\n\n— Yona Time Capsule Archive`,
            html
          });
          console.log(`✅ [Scheduler] 이메일 발송 완료: ID ${letter.id} -> ${recipientEmail}`);
        } catch (mailErr) {
          console.error(`❌ [Scheduler] 이메일 발송 오류 (ID: ${letter.id}):`, mailErr);
        }
      }

      db.prepare("UPDATE letters SET status = 'delivered' WHERE id = ?").run(letter.id);
      console.log(`🔓 [Scheduler] 타임락 해봉 완료: ID ${letter.id} (개봉시각: ${letter.unlock_date})`);
    }
  } catch (err) {
    console.error('❌ [Scheduler Error] 타임락 자동 해봉 처리 도중 오류:', err);
  }
}

// 매 1분마다 타임캡슐 감지 데몬 구동
setInterval(processTimeLockedLetters, 60000);
// 서버 시작 직후 즉시 1회 체크 가동
setTimeout(processTimeLockedLetters, 5000);

if (isProd) {
  const distPath = join(__dirname, 'dist');
  app.get(/.*/, (req, res) => {
    const indexPath = join(distPath, 'index.html');
    if (existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Build not found. Run: npm run build');
    }
  });
}

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🕊️  Yona ${isProd ? 'PRODUCTION' : 'DEV'} → http://0.0.0.0:${port}`);
  if (isProd) console.log(`   DB path: ${dbPath}`);
});

// ─── Graceful Shutdown (Railway / 컨테이너 환경 대응) ────────────────────────
const shutdown = (signal) => {
  console.log(`\n🛑 ${signal} received. Closing server gracefully...`);
  server.close(() => {
    db.close();
    console.log('✅ Server and DB closed. Exiting.');
    process.exit(0);
  });
  // 강제 종료 타임아웃 (10초)
  setTimeout(() => process.exit(1), 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
