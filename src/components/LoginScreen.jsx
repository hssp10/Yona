import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const localTranslations = {
  ko: {
    title: '로그인',
    desc: 'Yona 영구 보관소 계정으로 로그인합니다.',
    email: '이메일 주소',
    password: '비밀번호',
    loginBtn: '로그인',
    noAccount: '계정이 없으신가요?',
    signupLink: '회원가입',
    errValidEmail: '유효한 이메일 주소를 입력해 주세요.',
    errEnterPassword: '비밀번호를 입력해 주세요.',
    errServer: '서버와 통신하는 중 오류가 발생했습니다.',
    errFail: '로그인에 실패했습니다.'
  },
  en: {
    title: 'Sign In',
    desc: 'Sign in to your Yona Eternal Post account.',
    email: 'Email Address',
    password: 'Password',
    loginBtn: 'Sign In',
    noAccount: "Don't have an account?",
    signupLink: 'Sign Up',
    errValidEmail: 'Please enter a valid email address.',
    errEnterPassword: 'Please enter your password.',
    errServer: 'An error occurred while communicating with the server.',
    errFail: 'Failed to sign in.'
  },
  ja: {
    title: 'ログイン',
    desc: 'Yona永久保管庫アカウントにログインします。',
    email: 'メールアドレス',
    password: 'パスワード',
    loginBtn: 'ログイン',
    noAccount: 'アカウントをお持ちではありませんか？',
    signupLink: '新規登録',
    errValidEmail: '有効なメールアドレスを入力してください。',
    errEnterPassword: 'パスワードを入力してください。',
    errServer: 'サーバーとの通信中にエラーが発生しました。',
    errFail: 'ログインに失敗しました。'
  },
  zh: {
    title: '登录',
    desc: '登录到您的 Yona 永久保管库账户。',
    email: '电子邮箱地址',
    password: '密码',
    loginBtn: '登录',
    noAccount: '还没有账户？',
    signupLink: '注册',
    errValidEmail: '请输入有效的电子邮件地址。',
    errEnterPassword: '请输入密码。',
    errServer: '与服务器通信时发生错误。',
    errFail: '登录失败。'
  },
  it: {
    title: 'Accedi',
    desc: 'Accedi al tuo account Yona Eternal Post.',
    email: 'Indirizzo E-mail',
    password: 'Password',
    loginBtn: 'Accedi',
    noAccount: 'Non hai un account?',
    signupLink: 'Registrati',
    errValidEmail: 'Inserisci un indirizzo e-mail valido.',
    errEnterPassword: 'Inserisci la tua password.',
    errServer: 'Si è verificato un errore durante la comunicazione con il server.',
    errFail: 'Accesso fallito.'
  },
  es: {
    title: 'Iniciar Sesión',
    desc: 'Inicie sesión en su cuenta de Yona Eternal Post.',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    loginBtn: 'Iniciar Sesión',
    noAccount: '¿No tiene una cuenta?',
    signupLink: 'Registrarse',
    errValidEmail: 'Por favor, introduce una dirección de correo electrónico válida.',
    errEnterPassword: 'Por favor, introduce tu contraseña.',
    errServer: 'Ocurrió un error al comunicarse con el servidor.',
    errFail: 'Error al iniciar sesión.'
  },
  hi: {
    title: 'लॉगिन करें',
    desc: 'अपने Yona एटरनल पोस्ट खाते में लॉगिन करें।',
    email: 'ईमेल पता',
    password: 'पासवर्ड',
    loginBtn: 'लॉगिन',
    noAccount: 'क्या आपके पास खाता नहीं है?',
    signupLink: 'साइन अप करें',
    errValidEmail: 'कृपया एक मान्य ईमेल पता दर्ज करें।',
    errEnterPassword: 'कृपया अपना पासवर्ड दर्ज करें।',
    errServer: 'सर्वर के साथ संचार करते समय एक त्रुटि हुई।',
    errFail: 'लॉगिन विफल रहा।'
  },
  fr: {
    title: 'Connexion',
    desc: 'Connectez-vous à votre compte Yona Eternal Post.',
    email: 'Adresse E-mail',
    password: 'Mot de passe',
    loginBtn: 'Se connecter',
    noAccount: "Vous n'avez pas de compte ?",
    signupLink: "S'inscrire",
    errValidEmail: 'Veuillez saisir une adresse e-mail valide.',
    errEnterPassword: 'Veuillez saisir votre mot de passe.',
    errServer: 'Une erreur est survenue lors de la communication avec le serveur.',
    errFail: 'Échec de la connexion.'
  },
  de: {
    title: 'Anmelden',
    desc: 'Melden Sie sich bei Ihrem Yona Eternal Post-Konto an.',
    email: 'E-Mail-Adresse',
    password: 'Passwort',
    loginBtn: 'Anmelden',
    noAccount: 'Haben Sie noch kein Konto?',
    signupLink: 'Registrieren',
    errValidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    errEnterPassword: 'Bitte geben Sie Ihr Passwort ein.',
    errServer: 'Bei der Kommunikation mit dem Server ist ein Fehler aufgetreten.',
    errFail: 'Anmeldung fehlgeschlagen.'
  }
};

export const LoginScreen = () => {
  const { lang, login, setCurrentView } = useApp();
  const localT = localTranslations[lang] || localTranslations.ko;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage(localT.errValidEmail);
      return;
    }
    if (!password) {
      setErrorMessage(localT.errEnterPassword);
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
        login(data.user.email, data.user.name, data.user.timezone);
      } else {
        setErrorMessage(data.message || localT.errFail);
      }
    } catch {
      setIsLoading(false);
      setErrorMessage(localT.errServer);
    }
  };

  return (
    <main className="max-w-[400px] mx-auto px-6 py-16 md:py-24 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-light tracking-tight text-neutral-900">{localT.title}</h2>
        <p className="text-xs text-neutral-500 max-w-xs mx-auto">
          {localT.desc}
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
            {localT.email}
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
            {localT.password}
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
            <span>{localT.loginBtn}</span>
          )}
        </button>
      </form>

      <div className="pt-4 text-center border-t border-neutral-200 text-xs text-neutral-500">
        {localT.noAccount}{' '}
        <button
          type="button"
          onClick={() => setCurrentView('register')}
          className="font-bold text-black hover:underline"
        >
          {localT.signupLink}
        </button>
      </div>
    </main>
  );
};
