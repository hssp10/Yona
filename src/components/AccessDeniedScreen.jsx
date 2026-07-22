import React from 'react';
import { useApp } from '../context/AppContext';

export const AccessDeniedScreen = () => {
  const { t, setCurrentView } = useApp();

  return (
    <main className="max-w-[400px] mx-auto px-6 py-20 text-center space-y-8">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-neutral-100 text-neutral-800 rounded-full flex items-center justify-center border border-neutral-200 animate-float">
          <span className="material-symbols-outlined text-3xl">lock</span>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-3">
        <h2 className="text-2xl font-light tracking-tight text-neutral-900">
          {t.accessTitle}
        </h2>
        <p className="text-xs text-neutral-500 leading-relaxed">
          요청하신 페이지는 보안 보관소 구역으로,<br />
          <span className="font-bold text-neutral-900">계정 로그인이 필요한 서비스</span>입니다.
        </p>
      </div>

      {/* Button */}
      <button
        onClick={() => setCurrentView('login')}
        className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-base">login</span>
        <span>{t.backToLogin}</span>
      </button>

      <div className="text-[10px] text-neutral-400">
        {t.needHelp}{' '}
        <button
          onClick={() => alert('Heritage Ledger 24시간 양자 보관 고객 센터: 1588-1004')}
          className="underline hover:text-black font-bold ml-1"
        >
          {t.supportCenter}
        </button>
      </div>
    </main>
  );
};
