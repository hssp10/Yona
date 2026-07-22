import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const RegisterScreen = () => {
  const { setCurrentView } = useApp();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [timezone, setTimezone] = useState('Asia/Seoul');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const timezoneOptions = [
    // ─── Asia / Pacific ───────────────────────────────────────────
    { value: 'Asia/Seoul',         label: '🇰🇷  South Korea — Seoul (KST, UTC+9)' },
    { value: 'Asia/Tokyo',         label: '🇯🇵  Japan — Tokyo (JST, UTC+9)' },
    { value: 'Asia/Shanghai',      label: '🇨🇳  China — Beijing / Shanghai (CST, UTC+8)' },
    { value: 'Asia/Hong_Kong',     label: '🇭🇰  Hong Kong (HKT, UTC+8)' },
    { value: 'Asia/Taipei',        label: '🇹🇼  Taiwan — Taipei (CST, UTC+8)' },
    { value: 'Asia/Singapore',     label: '🇸🇬  Singapore (SGT, UTC+8)' },
    { value: 'Asia/Kuala_Lumpur',  label: '🇲🇾  Malaysia — Kuala Lumpur (MYT, UTC+8)' },
    { value: 'Asia/Manila',        label: '🇵🇭  Philippines — Manila (PHT, UTC+8)' },
    { value: 'Asia/Bangkok',       label: '🇹🇭  Thailand — Bangkok (ICT, UTC+7)' },
    { value: 'Asia/Jakarta',       label: '🇮🇩  Indonesia — Jakarta (WIB, UTC+7)' },
    { value: 'Asia/Ho_Chi_Minh',   label: '🇻🇳  Vietnam — Ho Chi Minh (ICT, UTC+7)' },
    { value: 'Asia/Kolkata',       label: '🇮🇳  India — Mumbai / Delhi (IST, UTC+5:30)' },
    { value: 'Asia/Karachi',       label: '🇵🇰  Pakistan — Karachi (PKT, UTC+5)' },
    { value: 'Asia/Dhaka',         label: '🇧🇩  Bangladesh — Dhaka (BST, UTC+6)' },
    { value: 'Asia/Colombo',       label: '🇱🇰  Sri Lanka — Colombo (SLST, UTC+5:30)' },
    { value: 'Asia/Riyadh',        label: '🇸🇦  Saudi Arabia — Riyadh (AST, UTC+3)' },
    { value: 'Asia/Dubai',         label: '🇦🇪  UAE — Dubai (GST, UTC+4)' },
    { value: 'Asia/Tehran',        label: '🇮🇷  Iran — Tehran (IRST, UTC+3:30)' },
    { value: 'Asia/Istanbul',      label: '🇹🇷  Turkey — Istanbul (TRT, UTC+3)' },
    { value: 'Pacific/Auckland',   label: '🇳🇿  New Zealand — Auckland (NZST, UTC+12)' },
    { value: 'Australia/Sydney',   label: '🇦🇺  Australia — Sydney (AEST, UTC+10/11)' },
    { value: 'Australia/Adelaide', label: '🇦🇺  Australia — Adelaide (ACST, UTC+9:30)' },
    { value: 'Australia/Perth',    label: '🇦🇺  Australia — Perth (AWST, UTC+8)' },
    // ─── Europe ──────────────────────────────────────────────────
    { value: 'Europe/London',      label: '🇬🇧  United Kingdom — London (GMT/BST, UTC+0/+1)' },
    { value: 'Europe/Paris',       label: '🇫🇷  France — Paris (CET/CEST, UTC+1/+2)' },
    { value: 'Europe/Berlin',      label: '🇩🇪  Germany — Berlin (CET/CEST, UTC+1/+2)' },
    { value: 'Europe/Rome',        label: '🇮🇹  Italy — Rome (CET/CEST, UTC+1/+2)' },
    { value: 'Europe/Madrid',      label: '🇪🇸  Spain — Madrid (CET/CEST, UTC+1/+2)' },
    { value: 'Europe/Amsterdam',   label: '🇳🇱  Netherlands — Amsterdam (CET/CEST, UTC+1/+2)' },
    { value: 'Europe/Stockholm',   label: '🇸🇪  Sweden — Stockholm (CET/CEST, UTC+1/+2)' },
    { value: 'Europe/Zurich',      label: '🇨🇭  Switzerland — Zurich (CET/CEST, UTC+1/+2)' },
    { value: 'Europe/Warsaw',      label: '🇵🇱  Poland — Warsaw (CET/CEST, UTC+1/+2)' },
    { value: 'Europe/Moscow',      label: '🇷🇺  Russia — Moscow (MSK, UTC+3)' },
    { value: 'Europe/Helsinki',    label: '🇫🇮  Finland — Helsinki (EET/EEST, UTC+2/+3)' },
    { value: 'Europe/Athens',      label: '🇬🇷  Greece — Athens (EET/EEST, UTC+2/+3)' },
    { value: 'Europe/Lisbon',      label: '🇵🇹  Portugal — Lisbon (WET/WEST, UTC+0/+1)' },
    // ─── Americas ─────────────────────────────────────────────────
    { value: 'America/New_York',    label: '🇺🇸  United States — New York (EST/EDT, UTC-5/-4)' },
    { value: 'America/Chicago',     label: '🇺🇸  United States — Chicago (CST/CDT, UTC-6/-5)' },
    { value: 'America/Denver',      label: '🇺🇸  United States — Denver (MST/MDT, UTC-7/-6)' },
    { value: 'America/Los_Angeles', label: '🇺🇸  United States — Los Angeles (PST/PDT, UTC-8/-7)' },
    { value: 'America/Anchorage',   label: '🇺🇸  United States — Anchorage (AKST/AKDT, UTC-9/-8)' },
    { value: 'Pacific/Honolulu',    label: '🇺🇸  United States — Hawaii (HST, UTC-10)' },
    { value: 'America/Toronto',     label: '🇨🇦  Canada — Toronto (EST/EDT, UTC-5/-4)' },
    { value: 'America/Vancouver',   label: '🇨🇦  Canada — Vancouver (PST/PDT, UTC-8/-7)' },
    { value: 'America/Mexico_City', label: '🇲🇽  Mexico — Mexico City (CST/CDT, UTC-6/-5)' },
    { value: 'America/Sao_Paulo',   label: '🇧🇷  Brazil — São Paulo (BRT, UTC-3)' },
    { value: 'America/Argentina/Buenos_Aires', label: '🇦🇷  Argentina — Buenos Aires (ART, UTC-3)' },
    { value: 'America/Bogota',      label: '🇨🇴  Colombia — Bogotá (COT, UTC-5)' },
    { value: 'America/Lima',        label: '🇵🇪  Peru — Lima (PET, UTC-5)' },
    { value: 'America/Santiago',    label: '🇨🇱  Chile — Santiago (CLT/CLST, UTC-4/-3)' },
    // ─── Africa ───────────────────────────────────────────────────
    { value: 'Africa/Cairo',        label: '🇪🇬  Egypt — Cairo (EET, UTC+2)' },
    { value: 'Africa/Johannesburg', label: '🇿🇦  South Africa — Johannesburg (SAST, UTC+2)' },
    { value: 'Africa/Lagos',        label: '🇳🇬  Nigeria — Lagos (WAT, UTC+1)' },
    { value: 'Africa/Nairobi',      label: '🇰🇪  Kenya — Nairobi (EAT, UTC+3)' },
    { value: 'Africa/Casablanca',   label: '🇲🇦  Morocco — Casablanca (WET/WEST, UTC+0/+1)' },
  ];

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!name.trim()) {
      setErrorMessage('성함을 입력해 주세요.');
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorMessage('유효한 이메일 주소를 입력해 주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });
      const data = await res.json();
      setIsLoading(false);

      if (data.ok) {
        setStep(2);
        setSuccessMessage(`${email} (으)로 6자리 보안 인증번호가 발송되었습니다.`);
      } else {
        setErrorMessage(data.message || '인증번호 발송 실패');
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('서버와 통신하는 중 오류가 발생했습니다.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (otpCode.length !== 6) {
      setErrorMessage('6자리 숫자 인증번호를 입력해 주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: otpCode.trim() })
      });
      const data = await res.json();
      setIsLoading(false);

      if (data.ok) {
        setStep(3);
        setSuccessMessage('이메일 인증 성공! 사용할 비밀번호(최소 8자)를 설정해 주세요.');
      } else {
        setErrorMessage(data.message || '인증번호가 일치하지 않습니다.');
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('서버 통신 오류가 발생했습니다.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 8) {
      setErrorMessage('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim(), password, timezone })
      });
      const data = await res.json();
      setIsLoading(false);

      if (data.ok) {
        alert('회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.');
        setCurrentView('login');
      } else {
        setErrorMessage(data.message || '회원가입 실패');
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('회원가입 중 서버 오류가 발생했습니다.');
    }
  };

  return (
    <main className="max-w-[400px] mx-auto px-6 py-16 md:py-24 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-light tracking-tight text-neutral-900">회원가입</h2>
        <p className="text-xs text-neutral-500">Heritage Ledger 보안 계정을 만듭니다.</p>
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-red-50 text-red-700 rounded-xl text-xs font-semibold border border-red-100 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-green-50 text-green-800 rounded-xl text-xs font-semibold border border-green-100 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Step 1: Info & OTP Request */}
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">성함</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="홍길동"
              className="w-full h-11 px-4 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black transition-all"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">이메일 주소</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="yourname@domain.com"
              className="w-full h-11 px-4 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black transition-all"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">거주 국가 / 시간대 선택 (Timezone)</label>
            <select
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-neutral-200 rounded-lg text-xs outline-none focus:border-black transition-all cursor-pointer text-neutral-800"
              required
            >
              {timezoneOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.value} — {opt.label}</option>
              ))}
            </select>
          </div>
          <p className="text-[11px] text-neutral-500 leading-relaxed bg-neutral-50 p-3 rounded-lg border border-neutral-200">
            💡 <strong>인증 발송 팁:</strong> 메일 전송 환경 변수가 지정되어 있지 않은 경우, 개발자 콘솔/로그 창에 임의 생성된 번호가 표시됩니다. 화면 가이드라인 번호 또는 시뮬레이션용 번호를 넣어 즉시 통과 가능합니다.
          </p>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? '전송 중...' : '인증 코드 요청'}
          </button>
        </form>
      )}

      {/* Step 2: Verify OTP */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">인증번호 입력</label>
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={e => setOtpCode(e.target.value)}
              placeholder="6자리 숫자 입력"
              className="w-full h-11 px-4 text-center tracking-[0.2em] border border-neutral-200 rounded-lg text-lg font-bold outline-none focus:border-black transition-all"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98]"
          >
            {isLoading ? '확인 중...' : '인증번호 확인'}
          </button>
        </form>
      )}

      {/* Step 3: Setup Password */}
      {step === 3 && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">비밀번호 설정 (최소 8자)</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="8자 이상의 비밀번호"
              className="w-full h-11 px-4 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black transition-all"
              required
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">비밀번호 확인</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="비밀번호 재입력"
              className="w-full h-11 px-4 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black transition-all"
              required
            />
          </div>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-xs text-neutral-500 hover:text-black font-semibold flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
            비밀번호 표시
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98]"
          >
            {isLoading ? '등록 중...' : '가입 완료하기'}
          </button>
        </form>
      )}

      <div className="pt-4 text-center border-t border-neutral-200 text-xs text-neutral-500">
        이미 계정이 있으신가요?{' '}
        <button
          type="button"
          onClick={() => setCurrentView('login')}
          className="font-bold text-black hover:underline"
        >
          로그인
        </button>
      </div>
    </main>
  );
};
