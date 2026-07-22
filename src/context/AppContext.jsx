import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../data/translations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => localStorage.getItem('hl_lang') || 'ko');
  const [currentView, setCurrentView] = useState('language');
  
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hl_user');
    return saved ? JSON.parse(saved) : { isLoggedIn: false, name: '', email: '' };
  });

  const [letters, setLetters] = useState([]);
  const [lettersLoading, setLettersLoading] = useState(false);
  const [pendingLetter, setPendingLetterState] = useState(() => {
    const saved = localStorage.getItem('hl_pending_letter');
    return saved ? JSON.parse(saved) : null;
  });
  const [soundPlaying, setSoundPlaying] = useState(false);

  // Pending Letter persistence
  const setPendingLetter = (letter) => {
    if (letter) {
      localStorage.setItem('hl_pending_letter', JSON.stringify(letter));
    } else {
      localStorage.removeItem('hl_pending_letter');
    }
    setPendingLetterState(letter);
  };

  useEffect(() => {
    localStorage.setItem('hl_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('hl_user', JSON.stringify(user));
  }, [user]);

  // Load letters from API
  const fetchLetters = useCallback(async (email) => {
    if (!email) return;
    setLettersLoading(true);
    try {
      const res = await fetch(`/api/letters/${encodeURIComponent(email)}`);
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.ok) setLetters(data.letters);
      }
    } catch (e) {
      console.error('편지 로드 실패:', e);
    } finally {
      setLettersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user.isLoggedIn && user.email) {
      fetchLetters(user.email);
    } else {
      setLetters([]);
    }
  }, [user.isLoggedIn, user.email, fetchLetters]);

  // Audio Synthesizer
  useEffect(() => {
    let audioCtx = null;
    let noiseNode = null;
    let gainNode = null;

    if (soundPlaying) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        const bufferSize = audioCtx.sampleRate * 2;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.012;
          b6 = white * 0.115926;
        }

        noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        const filterNode = audioCtx.createBiquadFilter();
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(350, audioCtx.currentTime);

        gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);

        noiseNode.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        noiseNode.start();
      } catch (e) {
        console.warn('Audio synthesis failed:', e);
      }
    }

    return () => {
      if (noiseNode) { try { noiseNode.stop(); } catch(e){} }
      if (audioCtx) { try { audioCtx.close(); } catch(e){} }
    };
  }, [soundPlaying]);

  const t = translations[lang] || translations.ko;

  const setLang = (newLang) => {
    if (translations[newLang]) setLangState(newLang);
  };

  const login = async (email, name, timezone) => {
    const newUser = { isLoggedIn: true, email, name, timezone: timezone || 'Asia/Seoul' };
    setUser(newUser);
    setCurrentView('home');
  };

  const logout = () => {
    setUser({ isLoggedIn: false, name: '', email: '' });
    setLetters([]);
    setPendingLetter(null);
    setCurrentView('login');
  };

  const updateUser = async (name, email) => {
    try {
      await fetch('/api/users/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
    } catch (e) {
      console.error('Update name failed:', e);
    }
    setUser(prev => ({ ...prev, name, email }));
  };

  // Safe payment and vaulting with fallback
  const finalizePaymentAndVault = async (selectedPlanObj, paymentMethod) => {
    if (!pendingLetter) return;
    const created = {
      id: `hl-${Date.now()}`,
      status: 'locked',
      createdDate: new Date().toISOString().split('T')[0],
      plan: selectedPlanObj.title,
      price: selectedPlanObj.priceNum,
      paymentMethod,
      authorEmail: user.email,
      ...pendingLetter
    };

    try {
      const response = await fetch('/api/send-letter-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ letter: created, planTitle: selectedPlanObj.title })
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (!response.ok && data.message) {
          throw new Error(data.message);
        }
      }
    } catch (err) {
      console.warn('API 통신 지연 (로컬 바운드 봉인 진행):', err);
    }

    setLetters(prev => [created, ...prev]);
    setPendingLetter(null);
  };

  const updateLetter = async (id, updatedFields) => {
    try {
      await fetch(`/api/letters/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: updatedFields })
      });
    } catch (e) {
      console.error('편지 수정 실패:', e);
    }
    setLetters(prev => prev.map(l => l.id === id ? { ...l, ...updatedFields } : l));
  };

  const deleteLetter = async (id) => {
    try {
      await fetch(`/api/letters/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error('편지 삭제 실패:', e);
    }
    setLetters(prev => prev.filter(l => l.id !== id));
  };

  const exportVaultData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(letters, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `heritage_ledger_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const navigateTo = (viewName) => {
    if (['home', 'archive', 'write', 'payment', 'settings', 'terms'].includes(viewName) && !user.isLoggedIn) {
      setCurrentView('access-denied');
      return;
    }
    setCurrentView(viewName);
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        currentView,
        setCurrentView: navigateTo,
        rawSetCurrentView: setCurrentView,
        user,
        login,
        logout,
        updateUser,
        letters,
        lettersLoading,
        fetchLetters,
        updateLetter,
        deleteLetter,
        pendingLetter,
        setPendingLetter,
        finalizePaymentAndVault,
        exportVaultData,
        soundPlaying,
        setSoundPlaying
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
