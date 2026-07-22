import React from 'react';
import { useApp } from '../context/AppContext';
import { languages } from '../data/translations';

export const LanguageSelection = () => {
  const { lang, setLang, t, setCurrentView, user } = useApp();

  const handleSelect = (code) => {
    setLang(code);
  };

  const handleContinue = () => {
    if (user.isLoggedIn) {
      setCurrentView('home');
    } else {
      setCurrentView('login');
    }
  };

  return (
    <main className="max-w-[800px] mx-auto px-6 py-16 md:py-24 space-y-12">
      {/* Title */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 leading-tight">
          {t.selectLanguageTitle}
        </h2>
        <p className="text-neutral-500 text-sm max-w-md mx-auto leading-relaxed">
          {t.selectLanguageDesc}
        </p>
      </div>

      {/* Language Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {languages.map((item) => {
          const isSelected = lang === item.code;
          return (
            <button
              key={item.code}
              onClick={() => handleSelect(item.code)}
              className={`p-6 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-3 ${
                isSelected
                  ? 'border-black bg-white ring-1 ring-black shadow-sm'
                  : 'border-neutral-200 bg-white hover:border-neutral-400'
              }`}
            >
              <img
                src={item.flag}
                alt={item.name}
                className="w-10 h-7 object-cover rounded-md shadow-sm border border-neutral-100"
              />
              <span className="font-semibold text-sm text-neutral-900">{item.name}</span>
              {isSelected && (
                <span className="text-[10px] uppercase font-bold tracking-widest text-black flex items-center gap-0.5">
                  ✓ {t.selected}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Button */}
      <div className="max-w-xs mx-auto space-y-4">
        <button
          onClick={handleContinue}
          className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98]"
        >
          {t.continue}
        </button>
        <p className="text-center text-neutral-400 text-[10px] uppercase tracking-wider">
          {t.langNote}
        </p>
      </div>
    </main>
  );
};
