import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { languages } from '../data/translations';

export const Header = () => {
  const { lang, setLang, t, currentView, setCurrentView, user, logout, soundPlaying, setSoundPlaying } = useApp();
  const [langOpen, setLangOpen] = useState(false);

  const isMinimal = currentView === 'access-denied';

  const navItems = [
    { id: 'home', label: t.navHome },
    { id: 'write', label: t.navWrite },
    { id: 'archive', label: t.navArchive },
    { id: 'settings', label: t.navProfile },
  ];

  return (
    <header className="w-full max-w-[1120px] mx-auto px-6 py-6 border-b border-neutral-200/80 bg-transparent">
      <div className="flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => setCurrentView(user.isLoggedIn ? 'home' : 'language')}
          className="flex items-center gap-2.5 text-black hover:opacity-80 transition-all text-left"
        >
          <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L15 22L11 13L2 9L22 2Z"/>
            <path d="M9 15V21L12 17"/>
          </svg>
          <span className="text-lg font-bold tracking-tight uppercase font-sans">{t.appName}</span>
        </button>

        {/* Right Actions */}
        {!isMinimal && (
          <div className="flex items-center gap-6">
            {/* Desktop Navigation for Logged-In Users */}
            {user.isLoggedIn && (
              <nav className="hidden md:flex items-center gap-6">
                {navItems.map((item) => {
                  const active = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id)}
                      className={`text-sm font-semibold tracking-tight transition-all ${
                        active ? 'text-black underline underline-offset-4' : 'text-neutral-500 hover:text-black'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            )}

            {/* Ambient Sound Toggle */}
            <button
              onClick={() => setSoundPlaying(!soundPlaying)}
              className={`text-xs font-bold tracking-tight uppercase flex items-center gap-1 transition-all ${
                soundPlaying ? 'text-black' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {soundPlaying ? 'volume_up' : 'volume_off'}
              </span>
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-xs font-bold uppercase tracking-tight text-neutral-600 hover:text-black"
              >
                <span>{lang}</span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-neutral-200 rounded-lg p-1 shadow-lg z-50">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs font-semibold hover:bg-neutral-50 transition-colors ${
                        lang === l.code ? 'text-black bg-neutral-100' : 'text-neutral-600'
                      }`}
                    >
                      {l.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Session Action */}
            {user.isLoggedIn ? (
              <button
                onClick={logout}
                className="text-xs font-bold uppercase tracking-tight text-neutral-400 hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            ) : (
              currentView !== 'login' && currentView !== 'language' && currentView !== 'register' && (
                <button
                  onClick={() => setCurrentView('login')}
                  className="text-xs font-bold uppercase tracking-tight text-black hover:underline"
                >
                  Login
                </button>
              )
            )}
          </div>
        )}
      </div>
    </header>
  );
};
