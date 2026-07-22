# 🕊️ Yona — 타임캡슐 편지 서비스

> **Yona** (비둘기)는 미래의 나 혹은 소중한 사람에게 시간을 넘어 편지를 전하는 타임캡슐 서비스입니다.

## ✨ 주요 기능

- 📝 **편지 작성** — 왁스 인장 테마, 음악 첨부, 감정 선택
- ⏰ **예약 발송** — 지정한 날짜·시간에 자동으로 이메일 발송
- 🔐 **보안 보관** — AES-256-CBC 암호화, OTP 인증
- 🌍 **다국어 지원** — 한국어, 영어, 일본어, 중국어
- 💳 **결제 플로우** — PayPal, Stripe, Kakao Pay, 토스 UI

## 🛠️ 기술 스택

| 레이어 | 기술 |
|---|---|
| Frontend | React 18, Vite, TailwindCSS |
| Backend | Node.js, Express 5 |
| Database | SQLite (better-sqlite3) |
| Email | Nodemailer (SMTP) |
| Deploy | Railway |

## 🚀 로컬 실행

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.example .env
# .env 파일을 열어 SMTP 정보 입력

# 3. 개발 서버 실행 (프론트 + 백엔드 동시)
npm run dev
```

## 🔑 환경변수

`.env.example` 파일을 복사해서 `.env`를 만들고 아래 값을 채워주세요:

| 변수명 | 설명 |
|---|---|
| `SMTP_HOST` | SMTP 서버 주소 (예: `smtp.gmail.com`) |
| `SMTP_PORT` | SMTP 포트 (Gmail: `465`) |
| `SMTP_SECURE` | SSL 사용 여부 (`true`/`false`) |
| `SMTP_USER` | 발신 이메일 주소 |
| `SMTP_PASS` | 앱 비밀번호 (Gmail 앱 비밀번호) |
| `SMTP_FROM` | 발신자 표시명 (예: `"Yona <noreply@yona.app>"`) |
| `ENCRYPT_KEY` | 비밀번호 암호화 키 (32자리 임의 문자열) |

### Gmail 앱 비밀번호 발급 방법
1. Google 계정 → 보안 → 2단계 인증 활성화
2. 앱 비밀번호 → 앱 선택: "메일" → 기기: "기타" → Yona 입력
3. 생성된 16자리 비밀번호를 `SMTP_PASS`에 입력

## 📦 프로덕션 빌드

```bash
npm run build   # Vite 번들링
npm start       # 프로덕션 서버 실행
```

## 🗂️ 프로젝트 구조

```
yona/
├── src/
│   ├── components/      # React 페이지/컴포넌트
│   ├── context/         # AppContext (전역 상태)
│   ├── data/            # 정적 데이터 (플랜, 왁스 인장 등)
│   └── utils/           # 유틸리티 함수
├── server.js            # Express 백엔드 + 스케줄러
├── railway.json         # Railway 배포 설정
└── .env.example         # 환경변수 예시
```

## 📄 라이선스

Private — All rights reserved.
