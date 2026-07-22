import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getUtcDateInTimezone } from '../utils/dateHelper';

const sealOptions = [
  { id: 'classic-cognac', name: '황금 왁스 인장', color: 'bg-[#D4AF37]', activeBorder: 'border-[#D4AF37]', activeBg: 'bg-[#D4AF37]/10' },
  { id: 'royal-navy',     name: '로열 블루 엠블럼', color: 'bg-[#1E40AF]', activeBorder: 'border-[#1E40AF]', activeBg: 'bg-[#1E40AF]/10' },
  { id: 'emerald-seal',   name: '에메랄드 인장',   color: 'bg-[#047857]', activeBorder: 'border-[#047857]', activeBg: 'bg-[#047857]/10' },
  { id: 'amber-gold',     name: '코냑 앰버 크라운', color: 'bg-[#D97706]', activeBorder: 'border-[#D97706]', activeBg: 'bg-[#D97706]/10' },
];

export const EditLetterModal = ({ letter, onClose }) => {
  const { updateLetter, user } = useApp();

  // Parse existing unlockDate using user timezone offset
  const parseInitialDateTime = () => {
    if (!letter.unlockDate) {
      return { date: new Date().toISOString().split('T')[0], time: '12:00' };
    }
    if (letter.unlockDate.includes('T') || letter.unlockDate.includes('Z')) {
      const dateObj = new Date(letter.unlockDate);
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
      return { date: `${year}-${month}-${day}`, time: `${hours}:${minutes}` };
    } else {
      const parts = letter.unlockDate.split(' ');
      return { date: parts[0] || '', time: parts[1] || '12:00' };
    }
  };

  const initialVal = parseInitialDateTime();

  const [title, setTitle]                   = useState(letter.title || '');
  const [senderName, setSenderName]         = useState(letter.sender || letter.recipient || '');
  const [recipientContact, setContact]      = useState(letter.recipientContact || '');
  const [unlockDate, setUnlockDate]         = useState(initialVal.date);
  const [unlockTime, setUnlockTime]         = useState(initialVal.time);
  const [sealType, setSealType]             = useState(letter.sealType || 'classic-cognac');
  const [content, setContent]               = useState(letter.content || '');
  const [errorMsg, setErrorMsg]             = useState('');
  const [saving, setSaving]                 = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim())           { setErrorMsg('편지 제목을 입력해 주세요.'); return; }
    if (!senderName.trim())       { setErrorMsg('송신인 성함을 입력해 주세요.'); return; }
    if (!recipientContact.trim()) { setErrorMsg('수신인 이메일 주소는 필수입니다.'); return; }
    if (!content.trim())         { setErrorMsg('편지 내용을 입력해 주세요.'); return; }

    setSaving(true);
    setTimeout(async () => {
      try {
        const selectedSeal = sealOptions.find(s => s.id === sealType);
        const fullUnlockDate = getUtcDateInTimezone(unlockDate, unlockTime, user.timezone || 'Asia/Seoul');

        await updateLetter(letter.id, {
          title,
          recipient: senderName, // 송신인 성함
          sender: senderName,
          recipientContact,
          unlockDate: fullUnlockDate,
          sealType,
          sealName: selectedSeal?.name || letter.sealName,
          content,
        });
        setSaving(false);
        onClose();
      } catch (err) {
        setErrorMsg('수정사항 저장 실패');
        setSaving(false);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl border border-neutral-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50 shrink-0">
          <h3 className="font-semibold text-sm text-neutral-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">edit_note</span>
            타임캡슐 편지 수정
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black transition-colors">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg font-bold border border-red-100">
              {errorMsg}
            </div>
          )}

          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-500 leading-relaxed">
            ⚠️ 수정 저장 시 지정한 색상의 왁스 인장이 재봉인됩니다. 작성일은 최초 날짜가 유지됩니다.
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-neutral-700 uppercase tracking-wider block">편지 제목 *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full h-10 px-3 border border-neutral-200 rounded-lg outline-none focus:border-black transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-neutral-700 uppercase tracking-wider block">송신인 성함 *</label>
              <input
                value={senderName}
                onChange={e => setSenderName(e.target.value)}
                placeholder="보내는 사람 성함"
                className="w-full h-10 px-3 border border-neutral-200 rounded-lg outline-none focus:border-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-neutral-700 uppercase tracking-wider block">수신 이메일 주소 *</label>
              <input
                value={recipientContact}
                onChange={e => setContact(e.target.value)}
                placeholder="recipient@domain.com"
                className="w-full h-10 px-3 border border-neutral-200 rounded-lg outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Date AND Time Editing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-neutral-700 uppercase tracking-wider block">개봉 시점 (날짜 및 시간 수정) *</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={unlockDate}
                  min={new Date().toISOString().split('T')[0]}
                  max="2126-12-31"
                  onChange={e => setUnlockDate(e.target.value)}
                  className="flex-1 h-10 px-3 border border-neutral-200 rounded-lg outline-none focus:border-black"
                />
                <input
                  type="time"
                  value={unlockTime}
                  onChange={e => setUnlockTime(e.target.value)}
                  className="w-28 h-10 px-2.5 border border-neutral-200 rounded-lg outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Custom Colored Wax Seal Selector */}
            <div className="space-y-1.5">
              <label className="font-bold text-neutral-700 uppercase tracking-wider block">밀봉 왁스 인장 선택</label>
              <div className="grid grid-cols-2 gap-2">
                {sealOptions.map(seal => {
                  const isSelected = sealType === seal.id;
                  return (
                    <button
                      type="button"
                      key={seal.id}
                      onClick={() => setSealType(seal.id)}
                      className={`py-2 px-2.5 rounded border text-[11px] font-bold transition-all flex items-center gap-2 ${
                        isSelected
                          ? `${seal.activeBorder} ${seal.activeBg} ring-1 ${seal.activeBorder} text-neutral-900 shadow-sm`
                          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${seal.color} shrink-0 shadow-sm`} />
                      <span className="truncate">{seal.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-bold text-neutral-700 uppercase tracking-wider block">편지 내용 *</label>
              <span className="text-neutral-400">{content.length}자</span>
            </div>
            <textarea
              rows={6}
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full p-3 border border-neutral-200 rounded-lg outline-none focus:border-black resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase rounded"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase rounded shadow-sm flex items-center justify-center gap-2"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>저장하기</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
