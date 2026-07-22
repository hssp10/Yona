import React from 'react';
import { useApp } from '../context/AppContext';

const footerLocal = {
  ko: { privacyPolicy: '개인정보처리방침' },
  ja: { privacyPolicy: '個人情報処理方針' },
  en: { privacyPolicy: 'Privacy Policy' },
  zh: { privacyPolicy: '隐私政策' },
  it: { privacyPolicy: 'Informativa sulla Privacy' },
  es: { privacyPolicy: 'Política de Privacidad' },
  hi: { privacyPolicy: 'गोपनीयता नीति' },
  fr: { privacyPolicy: 'Politique de Confidentialité' },
  de: { privacyPolicy: 'Datenschutzerklärung' }
};

export const Footer = () => {
  const { t, lang, setCurrentView } = useApp();

  const loc = footerLocal[lang] || footerLocal.en;

  return (
    <footer className="w-full max-w-[1120px] mx-auto px-6 py-12 border-t border-neutral-200/60 mt-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
      <p>{t.copyright}</p>
      <div className="flex gap-6 font-semibold">
        <button onClick={() => setCurrentView('terms')} className="hover:text-black transition-all">
          {t.termsLink}
        </button>
        <button onClick={() => setCurrentView('terms')} className="hover:text-black transition-all">
          {loc.privacyPolicy}
        </button>
        <button onClick={() => setCurrentView('access-denied')} className="hover:text-black transition-all">
          {t.supportCenter}
        </button>
      </div>
    </footer>
  );
};
