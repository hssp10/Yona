import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatUnlockDate } from '../utils/dateHelper';

const detailLocal = {
  ko: {
    delivered: '전달 완료',
    sender: '송신인',
    recipientEmail: '수신 이메일',
    unspecified: '미지정',
    sealNames: {
      'classic-cognac': '황금 왁스 인장',
      'royal-navy': '로열 블루 엠블럼',
      'emerald-seal': '에메랄드 인장',
      'amber-gold': '코냑 앰버 크라운'
    },
    lockTitle: '양자 타임락으로 밀봉된 상태입니다',
    lockDesc: (date) => `개봉 예정시각인 ${date} 에 수신자 이메일로 자동 전송됩니다.`,
    linkCopied: '링크 복사됨 ✓',
    copyLink: '보관 링크 복사',
    close: '닫기'
  },
  ja: {
    delivered: '配信完了',
    sender: '送信人',
    recipientEmail: '受信メール',
    unspecified: '未登録',
    sealNames: {
      'classic-cognac': '黄金ワックスシール',
      'royal-navy': 'ロイヤルブルーエンブレム',
      'emerald-seal': 'エメラルドシール',
      'amber-gold': 'コニャックアンバークラウン'
    },
    lockTitle: '量子タイムロックで封印された状態です',
    lockDesc: (date) => `開封予定時刻の ${date} に受取人のメールへ自動送信されます。`,
    linkCopied: 'リンクがコピーされました ✓',
    copyLink: '保管リンクをコピー',
    close: '閉じる'
  },
  en: {
    delivered: 'Delivered',
    sender: 'Sender',
    recipientEmail: 'Recipient Email',
    unspecified: 'Unspecified',
    sealNames: {
      'classic-cognac': 'Classic Cognac Wax Seal',
      'royal-navy': 'Royal Navy Emblem',
      'emerald-seal': 'Emerald Wax Seal',
      'amber-gold': 'Amber Gold Crown'
    },
    lockTitle: 'This capsule is sealed by Quantum Time-lock',
    lockDesc: (date) => `It will be auto-delivered to the recipient's email at ${date}.`,
    linkCopied: 'Link Copied ✓',
    copyLink: 'Copy Archive Link',
    close: 'Close'
  },
  zh: {
    delivered: '已送达',
    sender: '发件人',
    recipientEmail: '收件人邮箱',
    unspecified: '未填写',
    sealNames: {
      'classic-cognac': '金色火漆印章',
      'royal-navy': '皇家蓝徽章',
      'emerald-seal': '祖母绿火漆印章',
      'amber-gold': '琥珀金皇冠'
    },
    lockTitle: '此时光胶囊已被量子时间锁封存',
    lockDesc: (date) => `它将在指定的开封时间 ${date} 自动发送至收件人邮箱。`,
    linkCopied: '链接已复制 ✓',
    copyLink: '复制归档链接',
    close: '关闭'
  }
};

const sealColorMap = {
  'classic-cognac': { bg: 'bg-[#D4AF37]' },
  'royal-navy':     { bg: 'bg-[#1E40AF]' },
  'emerald-seal':   { bg: 'bg-[#047857]' },
  'amber-gold':     { bg: 'bg-[#D97706]' },
};

export const LetterDetailModal = ({ letter, onClose }) => {
  const { t, lang, user } = useApp();
  const [copied, setCopied] = useState(false);

  if (!letter) return null;

  const now = new Date();
  let unlockTime;
  if (letter.unlockDate && (letter.unlockDate.includes('T') || letter.unlockDate.includes('Z'))) {
    unlockTime = new Date(letter.unlockDate);
  } else if (letter.unlockDate && letter.unlockDate.includes(' ')) {
    unlockTime = new Date(letter.unlockDate.replace(' ', 'T'));
  } else if (letter.unlockDate) {
    unlockTime = new Date(`${letter.unlockDate}T00:00:00`);
  } else {
    unlockTime = new Date();
  }

  const canUnlock = letter.status === 'delivered' || unlockTime <= now;

  const loc = detailLocal[lang] || detailLocal.en;

  // Calculate D-Day using date-only comparison
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const unlockMidnight = new Date(unlockTime.getFullYear(), unlockTime.getMonth(), unlockTime.getDate());
  const diffDays = Math.round((unlockMidnight - todayMidnight) / (1000 * 60 * 60 * 24));
  const dDayText = letter.status === 'delivered' || canUnlock ? loc.delivered
    : diffDays > 0 ? `D-${diffDays}`
    : diffDays === 0 ? 'D-Day'
    : loc.delivered;

  const sealInfo = sealColorMap[letter.sealType] || sealColorMap['classic-cognac'];
  const sealName = loc.sealNames[letter.sealType] || letter.sealName || loc.sealNames['classic-cognac'];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `?capsuleId=${letter.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-xl max-h-[85vh] flex flex-col rounded-xl border border-neutral-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50 shrink-0">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${sealInfo.bg}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              {canUnlock ? t.statusDelivered : t.statusLocked}
            </span>
            <span className="text-[10px] font-extrabold bg-neutral-200 px-2 py-0.5 rounded text-neutral-800 tracking-wider">
              {dDayText}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Scrollable Letter Document */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Header Info with Seal Color */}
          <div className="flex items-center justify-between bg-neutral-50 p-4 rounded-lg border border-neutral-200 text-xs">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${sealInfo.bg} text-white flex items-center justify-center shadow animate-wax`}>
                <span className="material-symbols-outlined text-xl">verified</span>
              </div>
              <div>
                <p className="font-bold text-neutral-900">{sealName}</p>
                <p className="text-neutral-500 font-mono text-[11px]">ID: {letter.id}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-neutral-400 font-semibold">{t.unlockDate}</p>
              <p className="font-bold text-neutral-900 text-sm">{formatUnlockDate(letter.unlockDate, user.timezone)}</p>
            </div>
          </div>

          {/* Title & Metadata */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between text-[11px] text-neutral-500 gap-2">
              <span>{loc.sender}: <strong className="text-neutral-900">{letter.sender || letter.recipient || ''}</strong></span>
              <span>{loc.recipientEmail}: <strong className="text-neutral-900">{letter.recipientContact || loc.unspecified}</strong></span>
            </div>
            <h3 className="text-2xl font-light text-neutral-900 leading-snug">{letter.title}</h3>
          </div>

          <div className="h-[1px] bg-neutral-200" />

          {/* Letter Body or Lock Guard */}
          {canUnlock ? (
            <div className="p-6 bg-neutral-50 rounded-lg border border-neutral-200 whitespace-pre-wrap text-sm leading-relaxed text-neutral-800 font-normal">
              {letter.content}
            </div>
          ) : (
            <div className="p-8 bg-neutral-50 border border-dashed border-neutral-300 rounded-lg text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-2xl">lock</span>
              </div>
              <h4 className="font-bold text-neutral-800 text-sm">{loc.lockTitle}</h4>
              <p className="text-xs text-neutral-500 leading-relaxed max-w-xs mx-auto">
                {t.lockNotice}<br />
                {loc.lockDesc(formatUnlockDate(letter.unlockDate, user.timezone))}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex justify-between items-center text-[10px] text-neutral-400 shrink-0">
          <button
            onClick={handleCopyLink}
            className="text-neutral-700 hover:text-black font-bold uppercase tracking-wider flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">link</span>
            {copied ? loc.linkCopied : loc.copyLink}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded"
          >
            {loc.close}
          </button>
        </div>
      </div>
    </div>
  );
};
