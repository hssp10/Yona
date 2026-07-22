import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getUtcDateInTimezone } from '../utils/dateHelper';

const writerLocal = {
  ko: {
    subtitle: '지정한 날짜와 시각에 수신인에게 완벽하게 자동 발송됩니다.',
    senderNameLabel: '송신인 성함 *',
    senderNamePlaceholder: '보내는 사람 성함',
    recipientEmailLabel: '수신 이메일 주소 *',
    unlockNotice: '지정한 일자와 시각에 이메일로 자동 해봉 발송됩니다.',
    charCount: (len) => `${len}자 · 약 ${Math.ceil(len / 200 || 1)}분 읽기`,
    audioTitle: '음악/오디오 첨부하기 (선택)',
    audioSubtitle: '편지와 함께 전달될 멜로디나 음성 메시지를 실어보세요.',
    removeAudio: '제거',
    uploadFile: '음악 파일 업로드',
    webAudioUrl: '웹 오디오 URL 주소',
    attachedFile: '첨부된 파일:',
    urlPlaceholder: 'https://example.com/audio.mp3 또는 YouTube 링크',
    previewBtn: '미리보기',
    previewTitle: '서신 미리보기 (Pre-seal Preview)',
    previewSender: '송신인:',
    previewUnlock: '개봉 예정:',
    previewEmail: '수신이메일:',
    closeBtn: '닫기',
    goToPaymentBtn: '결제 페이지로 이동',
    errTitle: '편지 제목을 입력해 주세요.',
    errSender: '송신인 성함을 입력해 주세요.',
    errEmail: '수신인 이메일 주소를 입력해 주세요.',
    errContent: '편지 본문을 작성해 주세요.',
    sealNames: {
      'classic-cognac': '황금 왁스 인장',
      'royal-navy': '로열 블루 엠블럼',
      'emerald-seal': '에메랄드 인장',
      'amber-gold': '코냑 앰버 크라운'
    }
  },
  ja: {
    subtitle: '指定した日時と時刻に受取人へ自動送信されます。',
    senderNameLabel: '送信人のお名前 *',
    senderNamePlaceholder: '差出人の名前',
    recipientEmailLabel: '受信メールアドレス *',
    unlockNotice: '指定された日時と時間にメールで自動開封送信されます。',
    charCount: (len) => `${len}文字 · 約${Math.ceil(len / 200 || 1)}分で読めます`,
    audioTitle: '音楽/オーディオの添付（任意）',
    audioSubtitle: '手紙と共に届けたいメロディや音声メッセージを載せましょう。',
    removeAudio: '削除',
    uploadFile: '音楽ファイルをアップロード',
    webAudioUrl: 'ウェブオーディオURLアドレス',
    attachedFile: '添付ファイル:',
    urlPlaceholder: 'https://example.com/audio.mp3 または YouTubeリンク',
    previewBtn: 'プレビュー',
    previewTitle: '手紙のプレビュー (Pre-seal Preview)',
    previewSender: '送信人:',
    previewUnlock: '開封予定:',
    previewEmail: '受信メール:',
    closeBtn: '閉じる',
    goToPaymentBtn: '決済ページへ移動',
    errTitle: '手紙のタイトルを入力してください。',
    errSender: '送信人のお名前を入力してください。',
    errEmail: '受信メールアドレスを入力してください。',
    errContent: '手紙の本文を入力してください。',
    sealNames: {
      'classic-cognac': '黄金ワックスシール',
      'royal-navy': 'ロイヤルブルーエンブレム',
      'emerald-seal': 'エメラルドシール',
      'amber-gold': 'コニャックアンバークラウン'
    }
  },
  en: {
    subtitle: 'Automated delivery to the recipient on your designated date & time.',
    senderNameLabel: 'Sender Name *',
    senderNamePlaceholder: 'Sender Full Name',
    recipientEmailLabel: 'Recipient Email Address *',
    unlockNotice: 'Automated email release at the designated date & time.',
    charCount: (len) => `${len} chars · ~${Math.ceil(len / 200 || 1)} min read`,
    audioTitle: 'Attach Music / Audio (Optional)',
    audioSubtitle: 'Include a melody or voice message to be delivered with your letter.',
    removeAudio: 'Remove',
    uploadFile: 'Upload Music File',
    webAudioUrl: 'Web Audio URL Address',
    attachedFile: 'Attached File:',
    urlPlaceholder: 'https://example.com/audio.mp3 or YouTube Link',
    previewBtn: 'Preview',
    previewTitle: 'Pre-seal Letter Preview',
    previewSender: 'Sender:',
    previewUnlock: 'Unlock Expected:',
    previewEmail: 'Recipient Email:',
    closeBtn: 'Close',
    goToPaymentBtn: 'Proceed to Payment',
    errTitle: 'Please enter a letter title.',
    errSender: 'Please enter the sender name.',
    errEmail: 'Please enter recipient email address.',
    errContent: 'Please write the letter content.',
    sealNames: {
      'classic-cognac': 'Classic Cognac Wax Seal',
      'royal-navy': 'Royal Navy Emblem',
      'emerald-seal': 'Emerald Wax Seal',
      'amber-gold': 'Amber Gold Crown'
    }
  },
  zh: {
    subtitle: '将在您指定的日期和时间自动发送给收件人。',
    senderNameLabel: '发件人姓名 *',
    senderNamePlaceholder: '发件人姓名',
    recipientEmailLabel: '收件人邮箱地址 *',
    unlockNotice: '将在指定日期和时间自动发送开封邮件。',
    charCount: (len) => `${len} 字 · 约 ${Math.ceil(len / 200 || 1)} 分钟阅读`,
    audioTitle: '添加音乐/音频（可选）',
    audioSubtitle: '附上将与您的信件一同送达的旋律或语音消息。',
    removeAudio: '移除',
    uploadFile: '上传音频文件',
    webAudioUrl: '网络音频 URL 地址',
    attachedFile: '已附加文件:',
    urlPlaceholder: 'https://example.com/audio.mp3 或 YouTube 链接',
    previewBtn: '预览',
    previewTitle: '信件预览 (Pre-seal Preview)',
    previewSender: '发件人:',
    previewUnlock: '预计开封:',
    previewEmail: '收件人邮箱:',
    closeBtn: '关闭',
    goToPaymentBtn: '前往支付页面',
    errTitle: '请输入信件标题。',
    errSender: '请输入发件人姓名。',
    errEmail: '请输入收件人邮箱地址。',
    errContent: '请输入信件正文。',
    sealNames: {
      'classic-cognac': '金色火漆印章',
      'royal-navy': '皇家蓝徽章',
      'emerald-seal': '祖母绿火漆印章',
      'amber-gold': '琥珀金皇冠'
    }
  }
};

const sealColorMap = {
  'classic-cognac': { id: 'classic-cognac', color: 'bg-[#D4AF37]', activeBorder: 'border-[#D4AF37]', activeBg: 'bg-[#D4AF37]/10' },
  'royal-navy':     { id: 'royal-navy',     color: 'bg-[#1E40AF]', activeBorder: 'border-[#1E40AF]', activeBg: 'bg-[#1E40AF]/10' },
  'emerald-seal':   { id: 'emerald-seal',   color: 'bg-[#047857]', activeBorder: 'border-[#047857]', activeBg: 'bg-[#047857]/10' },
  'amber-gold':     { id: 'amber-gold',     color: 'bg-[#D97706]', activeBorder: 'border-[#D97706]', activeBg: 'bg-[#D97706]/10' },
};

export const LetterWriter = () => {
  const { t, lang, pendingLetter, setPendingLetter, setCurrentView, user } = useApp();

  const [title, setTitle] = useState('');
  const [senderName, setSenderName] = useState('');
  const [recipientContact, setContact] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [unlockTime, setUnlockTime] = useState('12:00');
  const [sealType, setSealType] = useState('classic-cognac');
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Preview Modal state
  const [showPreview, setShowPreview] = useState(false);

  // Music state
  const [musicMode, setMusicMode] = useState('none');
  const [musicFile, setMusicFile] = useState(null);
  const [musicFileName, setMusicFileName] = useState('');
  const [musicUrl, setMusicUrl] = useState('');
  const [musicPreviewSrc, setMusicPreviewSrc] = useState('');
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  const loc = writerLocal[lang] || writerLocal.en;

  // Auto-restore form data if returning from PaymentScreen via Back Button
  useEffect(() => {
    if (pendingLetter) {
      if (pendingLetter.title) setTitle(pendingLetter.title);
      if (pendingLetter.sender || pendingLetter.recipient) setSenderName(pendingLetter.sender || pendingLetter.recipient);
      if (pendingLetter.recipientContact) setContact(pendingLetter.recipientContact);
      if (pendingLetter.content) setContent(pendingLetter.content);
      if (pendingLetter.sealType) setSealType(pendingLetter.sealType);
      if (pendingLetter.unlockDate) {
        const dateObj = new Date(pendingLetter.unlockDate);
        if (!isNaN(dateObj.getTime()) && (pendingLetter.unlockDate.includes('T') || pendingLetter.unlockDate.includes('Z'))) {
          const tz = user.timezone || 'Asia/Seoul';
          const offsets = {
            'Asia/Seoul': 9,
            'Asia/Tokyo': 9,
            'Asia/Kolkata': 5.5,
            'Asia/Shanghai': 8,
            'Europe/London': 1,
            'America/New_York': -4,
            'America/Los_Angeles': -7
          };
          const offsetHours = offsets[tz] !== undefined ? offsets[tz] : 9;
          const targetTime = new Date(dateObj.getTime() + (offsetHours * 60 * 60 * 1000));
          
          const year = targetTime.getUTCFullYear();
          const month = String(targetTime.getUTCMonth() + 1).padStart(2, '0');
          const day = String(targetTime.getUTCDate()).padStart(2, '0');
          const hours = String(targetTime.getUTCHours()).padStart(2, '0');
          const minutes = String(targetTime.getUTCMinutes()).padStart(2, '0');
          setUnlockDate(`${year}-${month}-${day}`);
          setUnlockTime(`${hours}:${minutes}`);
        } else {
          const parts = pendingLetter.unlockDate.split(' ');
          if (parts[0]) setUnlockDate(parts[0]);
          if (parts[1]) setUnlockTime(parts[1]);
        }
      }
      if (pendingLetter.musicUrl) {
        setMusicUrl(pendingLetter.musicUrl);
        setMusicMode('url');
      }
    } else {
      const today = new Date().toISOString().split('T')[0];
      setUnlockDate(today);

      const now = new Date();
      const hours = String(now.getHours() + 1).padStart(2, '0');
      setUnlockTime(`${hours}:00`);
    }
  }, [pendingLetter]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('File size limit is 15MB.');
      return;
    }
    setMusicFile(file);
    setMusicFileName(file.name);
    setMusicPreviewSrc(URL.createObjectURL(file));
  };

  const clearMusic = () => {
    setMusicFile(null);
    setMusicFileName('');
    setMusicUrl('');
    setMusicPreviewSrc('');
    setMusicMode('none');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (audioRef.current) audioRef.current.pause();
  };

  const validateForm = () => {
    setErrorMessage('');
    if (!title.trim()) { setErrorMessage(loc.errTitle); return false; }
    if (!senderName.trim()) { setErrorMessage(loc.errSender); return false; }
    if (!recipientContact.trim()) { setErrorMessage(loc.errEmail); return false; }
    if (!content.trim()) { setErrorMessage(loc.errContent); return false; }
    return true;
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const sealName = loc.sealNames[sealType] || loc.sealNames['classic-cognac'];
    const resolvedMusicUrl = musicMode === 'url' ? musicUrl.trim() : musicMode === 'file' ? musicPreviewSrc : '';
    
    // Convert local inputs to UTC ISO string using timezone-aware date helper
    const fullUnlockTimestamp = getUtcDateInTimezone(unlockDate, unlockTime, user.timezone || 'Asia/Seoul');

    const draft = {
      title,
      recipient: senderName,
      sender: senderName,
      recipientContact,
      unlockDate: fullUnlockTimestamp,
      sealType,
      sealName,
      content,
      musicUrl: resolvedMusicUrl,
      musicFileName: musicMode === 'file' ? musicFileName : '',
    };

    setPendingLetter(draft);
    setCurrentView('payment');
  };

  const selectedSealObj = sealColorMap[sealType] || sealColorMap['classic-cognac'];

  return (
    <main className="max-w-[800px] mx-auto px-6 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-neutral-100 text-neutral-800 text-[10px] font-bold uppercase tracking-widest">
          Time Capsule Studio
        </div>
        <h2 className="text-3xl font-light tracking-tight text-neutral-900">{t.writeHeader}</h2>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
          {loc.subtitle}
        </p>
      </div>

      {/* Card Form */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 md:p-8 space-y-6">
        <form onSubmit={handleProceedToPayment} className="space-y-6">

          {errorMessage && (
            <div className="p-3.5 bg-red-50 text-red-700 rounded-lg text-xs font-semibold border border-red-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">{t.letterTitleLabel} *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={t.letterTitlePlaceholder}
              className="w-full h-11 px-4 border border-neutral-200 rounded-lg text-xs outline-none focus:border-black transition-all"
              required
            />
          </div>

          {/* Sender & Recipient Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">{loc.senderNameLabel}</label>
              <input
                value={senderName}
                onChange={e => setSenderName(e.target.value)}
                placeholder={loc.senderNamePlaceholder}
                className="w-full h-11 px-4 border border-neutral-200 rounded-lg text-xs outline-none focus:border-black transition-all"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">{loc.recipientEmailLabel}</label>
              <input
                type="email"
                value={recipientContact}
                onChange={e => setContact(e.target.value)}
                placeholder="recipient@domain.com"
                className="w-full h-11 px-4 border border-neutral-200 rounded-lg text-xs outline-none focus:border-black transition-all"
                required
              />
            </div>
          </div>

          {/* Unlock Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">{t.unlockDateLabel} *</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={unlockDate}
                  min={new Date().toISOString().split('T')[0]}
                  max="2126-12-31"
                  onChange={e => setUnlockDate(e.target.value)}
                  className="flex-1 h-11 px-3 border border-neutral-200 rounded-lg text-xs outline-none focus:border-black"
                  required
                />
                <input
                  type="time"
                  value={unlockTime}
                  onChange={e => setUnlockTime(e.target.value)}
                  className="w-24 h-11 px-3 border border-neutral-200 rounded-lg text-xs outline-none focus:border-black"
                  required
                />
              </div>
              <p className="text-[10px] text-neutral-400">{loc.unlockNotice}</p>
            </div>

            {/* Seal Emblems with Custom Colors */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">{t.sealChoiceLabel}</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(sealColorMap).map((sealKey) => {
                  const seal = sealColorMap[sealKey];
                  const isSelected = sealType === sealKey;
                  const name = loc.sealNames[sealKey];
                  return (
                    <button
                      type="button"
                      key={sealKey}
                      onClick={() => setSealType(sealKey)}
                      className={`py-2.5 px-3 rounded border text-[11px] font-bold transition-all flex items-center gap-2 ${
                        isSelected
                          ? `${seal.activeBorder} ${seal.activeBg} ring-1 ${seal.activeBorder} text-neutral-900 shadow-sm`
                          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${seal.color} shrink-0 shadow-sm`} />
                      <span className="truncate">{name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">{t.contentLabel} *</label>
              <span className="text-[10px] text-neutral-400 font-medium">
                {loc.charCount(content.length)}
              </span>
            </div>
            <textarea
              rows={9}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={t.contentPlaceholder}
              className="w-full p-4 border border-neutral-200 rounded-lg text-xs leading-relaxed outline-none focus:border-black resize-none"
              required
            />
          </div>

          {/* Audio Attachment */}
          <div className="space-y-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-neutral-800">{loc.audioTitle}</p>
                <p className="text-[10px] text-neutral-500">{loc.audioSubtitle}</p>
              </div>
              {musicMode !== 'none' && (
                <button type="button" onClick={clearMusic} className="text-xs text-neutral-500 hover:text-black font-bold">
                  {loc.removeAudio}
                </button>
              )}
            </div>

            {musicMode === 'none' && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => { setMusicMode('file'); setTimeout(() => fileInputRef.current?.click(), 50); }}
                  className="flex-1 py-2.5 bg-white border border-neutral-200 text-neutral-700 hover:border-black rounded text-xs font-bold uppercase tracking-wider transition-all"
                >
                  {loc.uploadFile}
                </button>
                <button
                  type="button"
                  onClick={() => setMusicMode('url')}
                  className="flex-1 py-2.5 bg-white border border-neutral-200 text-neutral-700 hover:border-black rounded text-xs font-bold uppercase tracking-wider transition-all"
                >
                  {loc.webAudioUrl}
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {musicMode === 'file' && musicPreviewSrc && (
              <div className="space-y-2">
                <p className="text-xs text-neutral-800 font-bold truncate">{loc.attachedFile} {musicFileName}</p>
                <audio ref={audioRef} src={musicPreviewSrc} controls className="w-full h-8" />
              </div>
            )}

            {musicMode === 'url' && (
              <div className="space-y-2">
                <input
                  type="url"
                  value={musicUrl}
                  onChange={e => setMusicUrl(e.target.value)}
                  placeholder={loc.urlPlaceholder}
                  className="w-full h-9 px-3 border border-neutral-200 rounded text-xs outline-none focus:border-black"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                if (validateForm()) setShowPreview(true);
              }}
              className="py-3.5 px-5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">visibility</span>
              {loc.previewBtn}
            </button>
            <button
              type="submit"
              className="flex-grow py-3.5 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">payment</span>
              <span>{t.proceedToPayment}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Letter Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-lg w-full rounded-xl border border-neutral-200 shadow-2xl p-6 space-y-6 overflow-hidden">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${selectedSealObj.color}`} />
                <h3 className="font-bold text-sm text-neutral-900">{loc.previewTitle}</h3>
              </div>
              <button onClick={() => setShowPreview(false)} className="text-neutral-400 hover:text-black">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
                <div className="flex justify-between text-neutral-500">
                  <span>{loc.previewSender} <strong className="text-neutral-900">{senderName}</strong></span>
                  <span>{loc.previewUnlock} <strong className="text-neutral-900">{unlockDate} {unlockTime}</strong></span>
                </div>
                <div className="text-neutral-500">
                  <span>{loc.previewEmail} <strong className="text-neutral-900">{recipientContact}</strong></span>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-light text-neutral-900">{title}</h4>
              </div>

              <div className="p-4 bg-white border border-neutral-200 rounded-lg min-h-[120px] whitespace-pre-wrap leading-relaxed text-neutral-800">
                {content}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase rounded"
              >
                {loc.closeBtn}
              </button>
              <button
                onClick={(e) => { setShowPreview(false); handleProceedToPayment(e); }}
                className="flex-1 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase rounded"
              >
                {loc.goToPaymentBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
