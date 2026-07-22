import React from 'react';
import { useApp } from '../context/AppContext';

export const MobileNav = () => {
  const { t, currentView, setCurrentView, user } = useApp();

  if (!user.isLoggedIn) return null;

  const navItems = [
    { id: 'home', label: t.navHome, icon: 'home' },
    { id: 'write', label: t.navWrite, icon: 'edit_note' },
    { id: 'archive', label: t.navArchive, icon: 'inventory_2' },
    { id: 'settings', label: t.navProfile, icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-16 md:hidden bg-white/90 backdrop-blur-md border-t border-neutral-200/80 z-40">
      {navItems.map((item) => {
        const active = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              active ? 'text-black' : 'text-neutral-400'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {item.icon}
            </span>
            <span className="text-[9px] font-bold mt-0.5 tracking-tight uppercase">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
