import React from 'react';
import { useApp } from '../context/AppContext';
import { formatUnlockDate } from '../utils/dateHelper';

// Localized helper dictionaries
const dashboardLocal = {
  ko: {
    vaultActive: '보관함 활성화됨',
    vaultTitle: (name) => `${name} 님의 보관함`,
    vaultDesc: '양자 내성 4096-bit 암호화 서버에 당신의 소중한 서신들이 보관되고 있습니다.',
    viewAll: '전체보기',
    unitLetters: '통',
    unitSeals: '개',
    unitDelivered: '건',
    sender: '송신인',
    unlockExpected: '해봉 예정',
    sealNames: {
      'classic-cognac': '황금 왁스 인장',
      'royal-navy': '로열 블루 엠블럼',
      'emerald-seal': '에메랄드 인장',
      'amber-gold': '코냑 앰버 크라운'
    }
  },
  ja: {
    vaultActive: '保管庫アクティブ',
    vaultTitle: (name) => `${name} 様의 保管庫`,
    vaultDesc: '耐量子4096-bit暗号化サーバーにあなたの大切な手紙が保管されています。',
    viewAll: 'すべて見る',
    unitLetters: '通',
    unitSeals: '個',
    unitDelivered: '件',
    sender: '送信人',
    unlockExpected: '開封予定',
    sealNames: {
      'classic-cognac': '黄金ワックスシール',
      'royal-navy': 'ロイヤルブルーエンブレム',
      'emerald-seal': 'エメラルドシール',
      'amber-gold': 'コニャックアンバークラウン'
    }
  },
  en: {
    vaultActive: 'Vault Active',
    vaultTitle: (name) => `${name}'s Legacy Vault`,
    vaultDesc: 'Your precious letters are securely stored in our quantum-resistant 4096-bit encryption server.',
    viewAll: 'View All',
    unitLetters: ' letters',
    unitSeals: ' capsules',
    unitDelivered: ' legacies',
    sender: 'Sender',
    unlockExpected: 'Unlock Expected',
    sealNames: {
      'classic-cognac': 'Classic Cognac Wax Seal',
      'royal-navy': 'Royal Navy Emblem',
      'emerald-seal': 'Emerald Wax Seal',
      'amber-gold': 'Amber Gold Crown'
    }
  },
  zh: {
    vaultActive: '保险库已激活',
    vaultTitle: (name) => `${name} 的保险库`,
    vaultDesc: '您的珍贵信件安全地保存在我们的防量子4096位加密服务器中。',
    viewAll: '查看全部',
    unitLetters: ' 封',
    unitSeals: ' 个',
    unitDelivered: ' 件',
    sender: '发件人',
    unlockExpected: '预计开封',
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

export const HomeDashboard = () => {
  const { user, letters, setCurrentView, t, lang } = useApp();

  const lockedCount = letters.filter(l => l.status === 'locked').length;
  const deliveredCount = letters.filter(l => l.status === 'delivered').length;

  // Fallback to English if the selected language dictionary is missing
  const loc = dashboardLocal[lang] || dashboardLocal.en;

  return (
    <main className="max-w-[1000px] mx-auto px-6 py-12 space-y-12">
      {/* Hero Welcome Panel */}
      <section className="bg-white border border-neutral-200 rounded-xl p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-neutral-100 text-neutral-800 text-[10px] font-bold uppercase tracking-widest">
            {loc.vaultActive}
          </div>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-neutral-900 leading-tight">
            {loc.vaultTitle(user.name)}
          </h2>
          <p className="text-xs text-neutral-500 max-w-lg leading-relaxed">
            {loc.vaultDesc}
          </p>
        </div>

        <button
          onClick={() => setCurrentView('write')}
          className="px-6 py-3.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-sm transition-all active:scale-95 shrink-0"
        >
          {t.writeNewLetter}
        </button>
      </section>

      {/* Grid Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-neutral-200 p-6 rounded-xl space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{t.totalLetters}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-light text-neutral-900">{letters.length}</span>
            <span className="text-xs text-neutral-400">{loc.unitLetters}</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 p-6 rounded-xl space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{t.timeLockedCapsules}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-light text-neutral-900">{lockedCount}</span>
            <span className="text-xs text-neutral-400">{loc.unitSeals}</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 p-6 rounded-xl space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{t.deliveredLegacies}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-light text-neutral-900">{deliveredCount}</span>
            <span className="text-xs text-neutral-400">{loc.unitDelivered}</span>
          </div>
        </div>
      </section>

      {/* Time Capsules List Preview */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <h3 className="text-lg font-semibold tracking-tight text-neutral-900">
            {t.activeCapsulesTitle}
          </h3>
          <button
            onClick={() => setCurrentView('archive')}
            className="text-xs font-bold text-neutral-600 hover:text-black uppercase tracking-wider underline underline-offset-4"
          >
            {loc.viewAll}
          </button>
        </div>

        {letters.length === 0 ? (
          <div className="bg-white border border-neutral-200 border-dashed p-12 rounded-xl text-center space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-neutral-800">{t.noLettersTitle}</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                {t.noLettersDesc}
              </p>
            </div>
            <button
              onClick={() => setCurrentView('write')}
              className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest rounded transition-all"
            >
              {t.writeNewLetter}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {letters.map((letter) => {
              const sealInfo = sealColorMap[letter.sealType] || sealColorMap['classic-cognac'];
              const isDelivered = letter.status === 'delivered';
              const sealName = loc.sealNames[letter.sealType] || letter.sealName || loc.sealNames['classic-cognac'];
              
              return (
                <div
                  key={letter.id}
                  onClick={() => setCurrentView('archive')}
                  className="bg-white border border-neutral-200 p-6 rounded-xl space-y-4 flex flex-col justify-between hover:border-black cursor-pointer transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${sealInfo.bg}`} />
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 uppercase">
                          {sealName}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isDelivered
                          ? 'bg-neutral-900 text-white border-black'
                          : 'bg-white text-neutral-600 border-neutral-200'
                      }`}>
                        {isDelivered ? t.statusDelivered : t.statusLocked}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-neutral-900 line-clamp-1">
                      {letter.title}
                    </h4>

                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed font-normal">
                      {letter.content}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 space-y-1.5 text-xs text-neutral-500">
                    <div className="flex justify-between items-center">
                      <span>{loc.sender}:</span>
                      <span className="font-semibold text-neutral-900">{letter.sender || letter.recipient || ''}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{loc.unlockExpected}:</span>
                      <span className="font-semibold text-neutral-900">{formatUnlockDate(letter.unlockDate, user.timezone)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};
