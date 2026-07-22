import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const LoginScreen = () => {
  const { t, login, setCurrentView } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('유효한 이메일 주소를 입력해 주세요.');
      return;
    }
    if (!password) {
      setErrorMessage('비밀번호를 입력해 주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const data = await res.json();
      setIsLoading(false);

      if (data.ok && data.user) {
        // Redirect directly to home screen upon login!
        login(data.user.email, data.user.name, data.user.timezone);
      } else {
        setErrorMessage(data.message || '로그인에 실패했습니다.');
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('서버와 통신하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <main className="max-w-[400px] mx-auto px-6 py-16 md:py-24 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-light tracking-tight text-neutral-900">로그인</h2>
        <p className="text-xs text-neutral-500 max-w-xs mx-auto">
          Yona 영구 보관소 계정으로 로그인합니다.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-red-50 text-red-700 rounded-xl text-xs font-semibold border border-red-100 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block" htmlFor="login-email">
            이메일 주소
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@domain.com"
            className="w-full h-11 px-4 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black transition-all"
            required
            autoFocus
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block" htmlFor="login-password">
            비밀번호
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 px-4 pr-10 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
            >
              <span className="material-symbols-outlined text-lg">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>로그인</span>
          )}
        </button>
      </form>

      <div className="pt-4 text-center border-t border-neutral-200 text-xs text-neutral-500">
        계정이 없으신가요?{' '}
        <button
          type="button"
          onClick={() => setCurrentView('register')}
          className="font-bold text-black hover:underline"
        >
          회원가입
        </button>
      </div>
    </main>
  );
};
