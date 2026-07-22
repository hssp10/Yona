import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LetterDetailModal } from './LetterDetailModal';
import { EditLetterModal } from './EditLetterModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { formatUnlockDate } from '../utils/dateHelper';

const archiveLocal = {
  ko: {
    noLetters: '보관된 편지가 없습니다.',
    deletedToast: '편지가 영구 삭제되었습니다.',
    all: '전체',
    delivered: '전달 완료',
    sender: '송신인',
    recipientEmail: '수신 이메일',
    unspecified: '미기재',
    unlockDate: '개봉일자',
    view: '열람',
    edit: '수정',
    delete: '삭제',
    sealNames: {
      'classic-cognac': '황금 왁스 인장',
      'royal-navy': '로열 블루 엠블럼',
      'emerald-seal': '에메랄드 인장',
      'amber-gold': '코냑 앰버 크라운'
    }
  },
  ja: {
    noLetters: '保管された手紙がありません。',
    deletedToast: '手紙が永久に削除されました。',
    all: '全体',
    delivered: '配信完了',
    sender: '送信人',
    recipientEmail: '受信メール',
    unspecified: '未登録',
    unlockDate: '開封予定日',
    view: '閲覧',
    edit: '編集',
    delete: '削除',
    sealNames: {
      'classic-cognac': '黄金ワックスシール',
      'royal-navy': 'ロイヤルブルーエンブレム',
      'emerald-seal': 'エメラルドシール',
      'amber-gold': 'コニャックアンバークラウン'
    }
  },
  en: {
    noLetters: 'No letters in vault.',
    deletedToast: 'Letter has been permanently deleted.',
    all: 'All',
    delivered: 'Delivered',
    sender: 'Sender',
    recipientEmail: 'Recipient Email',
    unspecified: 'Unspecified',
    unlockDate: 'Unlock Date',
    view: 'Inspect',
    edit: 'Edit',
    delete: 'Delete',
    sealNames: {
      'classic-cognac': 'Classic Cognac Wax Seal',
      'royal-navy': 'Royal Navy Emblem',
      'emerald-seal': 'Emerald Wax Seal',
      'amber-gold': 'Amber Gold Crown'
    }
  },
  zh: {
    noLetters: '暂无存档信件。',
    deletedToast: '信件已被永久删除。',
    all: '全部',
    delivered: '已送达',
    sender: '发件人',
    recipientEmail: '收件人邮箱',
    unspecified: '未填写',
    unlockDate: '开封日期',
    view: '查看',
    edit: '编辑',
    delete: '删除',
    sealNames: {
      'classic-cognac': '金色火漆印章',
      'royal-navy': '皇家蓝徽章',
      'emerald-seal': '祖母绿火漆印章',
      'amber-gold': '琥珀金皇冠'
    }
  }
};

const sealColorMap = {
  'classic-cognac': { bg: 'bg-[#D4AF37]' },
  'royal-navy':     { bg: 'bg-[#1E40AF]' },
  'emerald-seal':   { bg: 'bg-[#047857]' },
  'amber-gold':     { bg: 'bg-[#D97706]' },
};

export const ArchivePage = () => {
  const { t, lang, letters, deleteLetter, setCurrentView, user } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filter, setFilter] = useState('all'); // 'all' | 'locked' | 'delivered'

  const [viewLetter, setViewLetter] = useState(null);
  const [editLetter, setEditLetter] = useState(null);
  const [deletingLetter, setDeletingLetter] = useState(null);
  const [deletedToast, setDeletedToast] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const loc = archiveLocal[lang] || archiveLocal.en;

  const handleDeleteConfirm = async () => {
    if (!deletingLetter) return;
    try {
      await deleteLetter(deletingLetter.id);
      setDeletingLetter(null);
      setDeletedToast(true);
      setTimeout(() => setDeletedToast(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredLetters = letters
    .filter(l => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = 
        l.title?.toLowerCase().includes(q) || 
        l.recipient?.toLowerCase().includes(q) ||
        (l.sender && l.sender.toLowerCase().includes(q)) ||
        (l.recipientContact && l.recipientContact.toLowerCase().includes(q));

      const isLocked = l.unlockDate > today && l.status !== 'delivered';

      if (filter === 'locked') return matchesSearch && isLocked;
      if (filter === 'delivered') return matchesSearch && !isLocked;
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdDate || 0) - new Date(a.createdDate || 0);
      if (sortBy === 'unlockNear') return new Date(a.unlockDate || 0) - new Date(b.unlockDate || 0);
      return 0;
    });

  return (
    <main className="max-w-[1000px] mx-auto px-6 py-12 space-y-8">
      {/* Toast */}
      {deletedToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[70] px-5 py-2.5 bg-black text-white rounded shadow-xl font-bold text-xs uppercase tracking-wider animate-in slide-in-from-top-3">
          {loc.deletedToast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-200 pb-6">
        <div>
          <h2 className="text-3xl font-light tracking-tight text-neutral-900">{t.archivePageTitle}</h2>
          <p className="text-xs text-neutral-500 mt-1">{t.archivePageDesc}</p>
        </div>
        <button
          onClick={() => setCurrentView('write')}
          className="px-5 py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-sm"
        >
          {t.writeNewLetter}
        </button>
      </div>

      {/* Controls Bar */}
      <div className="bg-white border border-neutral-200 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full h-10 px-4 border border-neutral-200 rounded-lg text-xs outline-none focus:border-black transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg text-xs font-semibold">
            {[['all', loc.all], ['locked', t.statusLocked], ['delivered', t.statusDelivered]].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={`px-3 py-1.5 rounded transition-all ${
                  filter === val ? 'bg-white text-black shadow-sm font-bold' : 'text-neutral-500 hover:text-black'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="h-10 px-3 bg-white border border-neutral-200 rounded-lg text-xs outline-none cursor-pointer text-neutral-800"
          >
            <option value="newest">{t.sortNewest}</option>
            <option value="unlockNear">{t.sortUnlockNear}</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filteredLetters.length === 0 ? (
        <div className="bg-white border border-neutral-200 p-12 rounded-xl text-center">
          <p className="text-xs text-neutral-400">{loc.noLetters}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLetters.map(letter => {
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

            const isLocked = letter.status !== 'delivered' && unlockTime > now;
            const sealInfo = sealColorMap[letter.sealType] || sealColorMap['classic-cognac'];
            const sealName = loc.sealNames[letter.sealType] || letter.sealName || loc.sealNames['classic-cognac'];

            // D-Day calculation: compare date-only (strip time) to avoid Math.ceil rounding today -> D-1
            const todayMidnight = new Date(today); // midnight of today
            const unlockDateOnly = new Date(unlockTime.getFullYear(), unlockTime.getMonth(), unlockTime.getDate());
            const diffDays = Math.round((unlockDateOnly - todayMidnight) / (1000 * 60 * 60 * 24));
            const dDayText = letter.status === 'delivered' || !isLocked ? loc.delivered
              : diffDays > 0 ? `D-${diffDays}`
              : diffDays === 0 ? 'D-Day'
              : loc.delivered;

            return (
              <div
                key={letter.id}
                className="bg-white border border-neutral-200 p-5 rounded-xl flex flex-col justify-between space-y-4 hover:border-black transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${sealInfo.bg}`} />
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 uppercase">
                        {sealName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-extrabold bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-700">
                        {dDayText}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                        isLocked ? 'bg-white text-neutral-600 border-neutral-200' : 'bg-black text-white border-black'
                      }`}>
                        {isLocked ? t.statusLocked : t.statusDelivered}
                      </span>
                    </div>
                  </div>

                  <h4
                    onClick={() => setViewLetter(letter)}
                    className="text-base font-bold text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-1 cursor-pointer"
                  >
                    {letter.title}
                  </h4>

                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {letter.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 space-y-1 text-xs text-neutral-500">
                  <div className="flex justify-between">
                    <span>{loc.sender}:</span>
                    <span className="font-semibold text-neutral-950">{letter.sender || letter.recipient || ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{loc.recipientEmail}:</span>
                    <span className="font-semibold text-neutral-950 truncate max-w-[120px]">{letter.recipientContact || loc.unspecified}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{loc.unlockDate}:</span>
                    <span className="font-semibold text-neutral-955">{formatUnlockDate(letter.unlockDate, user.timezone)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-neutral-100">
                  <button
                    onClick={() => setViewLetter(letter)}
                    className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-neutral-50 hover:bg-neutral-100 text-neutral-800 rounded transition-all"
                  >
                    {loc.view}
                  </button>
                  <button
                    onClick={() => setEditLetter(letter)}
                    className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-neutral-50 hover:bg-neutral-100 text-neutral-800 rounded transition-all"
                  >
                    {loc.edit}
                  </button>
                  <button
                    onClick={() => setDeletingLetter(letter)}
                    className="px-3 py-1.5 text-[10px] font-bold bg-neutral-50 hover:bg-red-50 hover:text-red-600 rounded transition-all"
                  >
                    {loc.delete}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {viewLetter && <LetterDetailModal letter={viewLetter} onClose={() => setViewLetter(null)} />}
      {editLetter && <EditLetterModal letter={editLetter} onClose={() => setEditLetter(null)} />}
      {deletingLetter && (
        <DeleteConfirmModal
          letter={deletingLetter}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingLetter(null)}
        />
      )}
    </main>
  );
};
