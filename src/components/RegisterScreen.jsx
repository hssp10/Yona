import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const localTranslations = {
  ko: {
    title: '회원가입',
    subtitle: 'Heritage Ledger 보안 계정을 만듭니다.',
    nameLabel: '성함',
    namePlaceholder: '홍길동',
    emailLabel: '이메일 주소',
    emailPlaceholder: 'yourname@domain.com',
    timezoneLabel: '거주 국가 / 시간대 선택 (Timezone)',
    tipTitle: '인증 발송 팁:',
    tipDesc: '메일 전송 환경 변수가 지정되어 있지 않은 경우, 개발자 콘솔/로그 창에 임의 생성된 번호가 표시됩니다. 화면 가이드라인 번호 또는 시뮬레이션용 번호를 넣어 즉시 통과 가능합니다.',
    requestOtpBtn: '인증 코드 요청',
    sendingBtn: '전송 중...',
    otpInputLabel: '인증번호 입력',
    otpPlaceholder: '6자리 숫자 입력',
    verifyBtn: '인증번호 확인',
    verifyingBtn: '확인 중...',
    passwordLabel: '비밀번호 설정 (최소 8자)',
    passwordPlaceholder: '8자 이상의 비밀번호',
    confirmPasswordLabel: '비밀번호 확인',
    confirmPasswordPlaceholder: '비밀번호 재입력',
    showPasswordBtn: '비밀번호 표시',
    completeBtn: '가입 완료하기',
    completingBtn: '등록 중...',
    hasAccount: '이미 계정이 있으신가요?',
    loginLink: '로그인',
    errName: '성함을 입력해 주세요.',
    errEmail: '유효한 이메일 주소를 입력해 주세요.',
    errOtpLength: '6자리 숫자 인증번호를 입력해 주세요.',
    errPasswordLength: '비밀번호는 최소 8자 이상이어야 합니다.',
    errPasswordMatch: '비밀번호 확인이 일치하지 않습니다.',
    errServer: '서버와 통신하는 중 오류가 발생했습니다.',
    errSendFail: '인증번호 발송 실패',
    errVerifyFail: '인증번호가 일치하지 않습니다.',
    errRegisterFail: '회원가입 실패',
    successSend: ' (으)로 6자리 보안 인증번호가 발송되었습니다.',
    successVerify: '이메일 인증 성공! 사용할 비밀번호(최소 8자)를 설정해 주세요.',
    alertSuccess: '회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.'
  },
  en: {
    title: 'Sign Up',
    subtitle: 'Create your Heritage Ledger secure account.',
    nameLabel: 'Full Name',
    namePlaceholder: 'John Doe',
    emailLabel: 'Email Address',
    emailPlaceholder: 'yourname@domain.com',
    timezoneLabel: 'Country / Timezone',
    tipTitle: 'OTP Tip:',
    tipDesc: 'If SMTP variables are not set, the OTP is printed in the developer log. You can proceed using the demo/simulation code.',
    requestOtpBtn: 'Request Code',
    sendingBtn: 'Sending...',
    otpInputLabel: 'Verification Code',
    otpPlaceholder: 'Enter 6-digit code',
    verifyBtn: 'Verify Code',
    verifyingBtn: 'Verifying...',
    passwordLabel: 'Set Password (min 8 chars)',
    passwordPlaceholder: 'Password (min 8 chars)',
    confirmPasswordLabel: 'Confirm Password',
    confirmPasswordPlaceholder: 'Re-enter password',
    showPasswordBtn: 'Show Password',
    completeBtn: 'Complete Registration',
    completingBtn: 'Registering...',
    hasAccount: 'Already have an account?',
    loginLink: 'Sign In',
    errName: 'Please enter your name.',
    errEmail: 'Please enter a valid email address.',
    errOtpLength: 'Please enter a 6-digit verification code.',
    errPasswordLength: 'Password must be at least 8 characters long.',
    errPasswordMatch: 'Passwords do not match.',
    errServer: 'An error occurred while communicating with the server.',
    errSendFail: 'Failed to send verification code.',
    errVerifyFail: 'Verification code does not match.',
    errRegisterFail: 'Registration failed.',
    successSend: '6-digit security code has been sent to ',
    successVerify: 'Email verified! Set a password (min 8 chars).',
    alertSuccess: 'Registration complete. Redirecting to sign in.'
  },
  ja: {
    title: '新規登録',
    subtitle: 'Heritage Ledger セキュリティアカウントを作成します。',
    nameLabel: 'お名前',
    namePlaceholder: '山田太郎',
    emailLabel: 'メールアドレス',
    emailPlaceholder: 'yourname@domain.com',
    timezoneLabel: '居住国 / タイムゾーン (Timezone)',
    tipTitle: '認証のヒント:',
    tipDesc: 'SMTP環境変数が設定されていない場合、デベロッパーログにOTPが出力されます。デモコードを入力してそのまま通過できます。',
    requestOtpBtn: '認証コードをリクエスト',
    sendingBtn: '送信中...',
    otpInputLabel: '認証番号入力',
    otpPlaceholder: '6桁の番号を入力',
    verifyBtn: '認証番号を確認',
    verifyingBtn: '確認中...',
    passwordLabel: 'パスワード設定 (最低8文字)',
    passwordPlaceholder: '最低8文字のパスワード',
    confirmPasswordLabel: 'パスワード再確認',
    confirmPasswordPlaceholder: 'パスワードを再入力',
    showPasswordBtn: 'パスワードを表示',
    completeBtn: '登録完了',
    completingBtn: '登録中...',
    hasAccount: 'アカウントをお持ちですか？',
    loginLink: 'ログイン',
    errName: 'お名前を入力してください。',
    errEmail: '有効なメールアドレスを入力してください。',
    errOtpLength: '6桁の数字認証番号を入力してください。',
    errPasswordLength: 'パスワードは最低8文字以上である必要があります。',
    errPasswordMatch: 'パスワードの再入力が一致しません。',
    errServer: 'サーバーとの通信中にエラーが発生しました。',
    errSendFail: '認証番号の送信に失敗しました。',
    errVerifyFail: '認証番号が一致しません。',
    errRegisterFail: '会員登録に失敗しました。',
    successSend: '宛てに6桁のセキュリティ認証番号が送信されました。',
    successVerify: 'メール認証成功！使用するパスワード（最低8文字）を設定してください。',
    alertSuccess: '会員登録が完了しました。ログイン画面に移動します。'
  },
  zh: {
    title: '注册',
    subtitle: '创建您的 Heritage Ledger 安全账户。',
    nameLabel: '姓名',
    namePlaceholder: '张三',
    emailLabel: '电子邮箱地址',
    emailPlaceholder: 'yourname@domain.com',
    timezoneLabel: '居住国家 / 时区 (Timezone)',
    tipTitle: '发送提示:',
    tipDesc: '如果未配置SMTP环境变量，验证码将输出在开发日志中。您可以使用演示代码通过。',
    requestOtpBtn: '请求验证码',
    sendingBtn: '发送中...',
    otpInputLabel: '输入验证码',
    otpPlaceholder: '输入6位验证码',
    verifyBtn: '验证验证码',
    verifyingBtn: '验证中...',
    passwordLabel: '设置密码 (最少8位)',
    passwordPlaceholder: '最少8位密码',
    confirmPasswordLabel: '确认密码',
    confirmPasswordPlaceholder: '再次输入密码',
    showPasswordBtn: '显示密码',
    completeBtn: '完成注册',
    completingBtn: '注册中...',
    hasAccount: '已有账户？',
    loginLink: '登录',
    errName: '请输入您的姓名。',
    errEmail: '请输入有效的电子邮件地址。',
    errOtpLength: '请输入6位数字验证码。',
    errPasswordLength: '密码长度至少为 8 个字符。',
    errPasswordMatch: '两次输入的密码不一致。',
    errServer: '与服务器通信时发生错误。',
    errSendFail: '发送验证码失败。',
    errVerifyFail: '验证码不匹配。',
    errRegisterFail: '注册失败。',
    successSend: '6位安全验证码已发送至 ',
    successVerify: '邮箱验证成功！请设置密码（最少8位）。',
    alertSuccess: '注册成功。正在跳转至登录页面。'
  },
  it: {
    title: 'Registrati',
    subtitle: 'Crea il tuo account sicuro Heritage Ledger.',
    nameLabel: 'Nome Completo',
    namePlaceholder: 'Mario Rossi',
    emailLabel: 'Indirizzo E-mail',
    emailPlaceholder: 'yourname@domain.com',
    timezoneLabel: 'Paese / Fuso orario',
    tipTitle: 'Suggerimento OTP:',
    tipDesc: 'Se le variabili SMTP non sono configurate, l\'OTP viene mostrato nel log. Puoi procedere usando il codice demo.',
    requestOtpBtn: 'Richiedi Codice',
    sendingBtn: 'Invio in corso...',
    otpInputLabel: 'Codice di Verifica',
    otpPlaceholder: 'Inserisci codice a 6 cifre',
    verifyBtn: 'Verifica Codice',
    verifyingBtn: 'Verifica...',
    passwordLabel: 'Imposta Password (min 8 caratteri)',
    passwordPlaceholder: 'Almeno 8 caratteri',
    confirmPasswordLabel: 'Conferma Password',
    confirmPasswordPlaceholder: 'Re-inserisci password',
    showPasswordBtn: 'Mostra Password',
    completeBtn: 'Completa Registrazione',
    completingBtn: 'Registrazione...',
    hasAccount: 'Hai già un account?',
    loginLink: 'Accedi',
    errName: 'Inserisci il tuo nome.',
    errEmail: 'Inserisci un indirizzo e-mail valido.',
    errOtpLength: 'Inserisci un codice di verifica a 6 cifre.',
    errPasswordLength: 'La password deve contenere almeno 8 caratteri.',
    errPasswordMatch: 'Le password non coincidono.',
    errServer: 'Si è verificato un errore durante la comunicazione con il server.',
    errSendFail: 'Invio codice di verifica fallito.',
    errVerifyFail: 'Il codice di verifica non coincide.',
    errRegisterFail: 'Registrazione fallita.',
    successSend: 'Il codice di verifica a 6 cifre è stato inviato a ',
    successVerify: 'E-mail verificata! Imposta una password (min 8 caratteri).',
    alertSuccess: 'Registrazione completata. Verrai reindirizzato all\'accesso.'
  },
  es: {
    title: 'Registrarse',
    subtitle: 'Cree su cuenta segura de Heritage Ledger.',
    nameLabel: 'Nombre Completo',
    namePlaceholder: 'Juan Pérez',
    emailLabel: 'Correo Electrónico',
    emailPlaceholder: 'yourname@domain.com',
    timezoneLabel: 'País / Zona horaria',
    tipTitle: 'Consejo OTP:',
    tipDesc: 'Si las variables SMTP no están configuradas, la OTP se imprime en el registro de desarrollo. Puede continuar usando el código de simulación.',
    requestOtpBtn: 'Solicitar Código',
    sendingBtn: 'Enviando...',
    otpInputLabel: 'Código de Verificación',
    otpPlaceholder: 'Ingrese código de 6 dígitos',
    verifyBtn: 'Verificar Código',
    verifyingBtn: 'Verificando...',
    passwordLabel: 'Establecer Contraseña (mínimo 8 caracteres)',
    passwordPlaceholder: 'Mínimo 8 caracteres',
    confirmPasswordLabel: 'Confirmar Contraseña',
    confirmPasswordPlaceholder: 'Reingrese contraseña',
    showPasswordBtn: 'Mostrar Contraseña',
    completeBtn: 'Completar Registro',
    completingBtn: 'Registrando...',
    hasAccount: '¿Ya tiene una cuenta?',
    loginLink: 'Iniciar sesión',
    errName: 'Por favor, introduce tu nombre.',
    errEmail: 'Por favor, introduce una dirección de correo electrónico válida.',
    errOtpLength: 'Por favor, introduce el código de verificación de 6 dígitos.',
    errPasswordLength: 'La contraseña debe tener al menos 8 caracteres.',
    errPasswordMatch: 'Las contraseñas no coinciden.',
    errServer: 'Ocurrió un error al comunicarse con el servidor.',
    errSendFail: 'Error al enviar el código de verificación.',
    errVerifyFail: 'El código de verificación no coincide.',
    errRegisterFail: 'Error al registrarse.',
    successSend: 'Se ha enviado un código de seguridad de 6 dígitos a ',
    successVerify: '¡Correo verificado! Establezca una contraseña (mínimo 8 caracteres).',
    alertSuccess: 'Registro completado. Redirigiendo a inicio de sesión.'
  },
  hi: {
    title: 'साइन अप करें',
    subtitle: 'अपना Heritage Ledger सुरक्षित खाता बनाएं।',
    nameLabel: 'पूरा नाम',
    namePlaceholder: 'राम कुमार',
    emailLabel: 'ईमेल पता',
    emailPlaceholder: 'yourname@domain.com',
    timezoneLabel: 'देश / समय क्षेत्र',
    tipTitle: 'OTP सुझाव:',
    tipDesc: 'यदि SMTP वेरिएबल सेट नहीं हैं, तो OTP डेवलपर लॉग में प्रिंट होता है। आप डेमो कोड का उपयोग करके आगे बढ़ सकते हैं।',
    requestOtpBtn: 'कोड का अनुरोध करें',
    sendingBtn: 'भेजा जा रहा है...',
    otpInputLabel: 'सत्यापन कोड',
    otpPlaceholder: '6 अंकों का कोड दर्ज करें',
    verifyBtn: 'कोड सत्यापित करें',
    verifyingBtn: 'सत्यापित किया जा रहा है...',
    passwordLabel: 'पासवर्ड सेट करें (कम से कम 8 वर्ण)',
    passwordPlaceholder: 'कम से कम 8 वर्ण',
    confirmPasswordLabel: 'पासवर्ड की पुष्टि करें',
    confirmPasswordPlaceholder: 'पासवर्ड पुन: दर्ज करें',
    showPasswordBtn: 'पासवर्ड दिखाएं',
    completeBtn: 'पंजीकरण पूरा करें',
    completingBtn: 'पंजीकरण हो रहा है...',
    hasAccount: 'क्या पहले से ही एक खाता है?',
    loginLink: 'लॉगिन करें',
    errName: 'कृपया अपना नाम दर्ज करें।',
    errEmail: 'कृपया एक मान्य ईमेल पता दर्ज करें।',
    errOtpLength: 'कृपया 6 अंकों का सत्यापन कोड दर्ज करें।',
    errPasswordLength: 'पासवर्ड कम से कम 8 वर्णों का होना चाहिए।',
    errPasswordMatch: 'पासवर्ड मेल नहीं खाते।',
    errServer: 'सर्वर के साथ संचार करते समय एक त्रुटि हुई।',
    errSendFail: 'सत्यापन कोड भेजने में विफल।',
    errVerifyFail: 'सत्यापन कोड मेल नहीं खाता।',
    errRegisterFail: 'पंजीकरण विफल रहा।',
    successSend: '6 अंकों का सुरक्षा कोड भेजा गया है ',
    successVerify: 'ईमेल सत्यापित! पासवर्ड सेट करें (न्यूनतम 8 वर्ण)।',
    alertSuccess: 'पंजीकरण पूरा हुआ। लॉगिन पर रीडायरेक्ट किया जा रहा है।'
  },
  fr: {
    title: "S'inscrire",
    subtitle: 'Créez votre compte sécurisé Heritage Ledger.',
    nameLabel: 'Nom complet',
    namePlaceholder: 'Jean Dupont',
    emailLabel: 'Adresse e-mail',
    emailPlaceholder: 'yourname@domain.com',
    timezoneLabel: 'Pays / Fuseau horaire',
    tipTitle: 'Astuce OTP:',
    tipDesc: 'Si les variables SMTP ne sont pas définies, l\'OTP s\'affiche dans le journal de développement. Vous pouvez continuer en utilisant le code de démo.',
    requestOtpBtn: 'Demander le code',
    sendingBtn: 'Envoi...',
    otpInputLabel: 'Code de vérification',
    otpPlaceholder: 'Saisir le code à 6 chiffres',
    verifyBtn: 'Vérifier le code',
    verifyingBtn: 'Vérification...',
    passwordLabel: 'Définir le mot de passe (min 8 chars)',
    passwordPlaceholder: 'Mot de passe (min 8 chars)',
    confirmPasswordLabel: 'Confirmer le mot de passe',
    confirmPasswordPlaceholder: 'Saisir de nouveau le mot de passe',
    showPasswordBtn: 'Afficher le mot de passe',
    completeBtn: 'Compléter l\'inscription',
    completingBtn: 'Inscription...',
    hasAccount: 'Vous avez déjà un compte ?',
    loginLink: 'Se connecter',
    errName: 'Veuillez saisir votre nom.',
    errEmail: 'Veuillez saisir une adresse e-mail valide.',
    errOtpLength: 'Veuillez saisir un code de vérification à 6 chiffres.',
    errPasswordLength: 'Le mot de passe doit comporter au moins 8 caractères.',
    errPasswordMatch: 'Les mots de passe ne correspondent pas.',
    errServer: 'Une erreur est survenue lors de la communication avec le serveur.',
    errSendFail: 'Échec de l\'envoi du code de vérification.',
    errVerifyFail: 'Le code de vérification ne correspond pas.',
    errRegisterFail: "Échec de l'inscription.",
    successSend: 'Un code de sécurité à 6 chiffres a été envoyé à ',
    successVerify: 'E-mail vérifié ! Définissez un mot de passe (min 8 caractères).',
    alertSuccess: "Inscription complétée. Redirection vers l'écran de connexion."
  },
  de: {
    title: 'Registrieren',
    subtitle: 'Erstellen Sie Ihr sicheres Heritage Ledger-Konto.',
    nameLabel: 'Vollständiger Name',
    namePlaceholder: 'Max Mustermann',
    emailLabel: 'E-Mail-Adresse',
    emailPlaceholder: 'yourname@domain.com',
    timezoneLabel: 'Land / Zeitzone',
    tipTitle: 'OTP-Tipp:',
    tipDesc: 'Wenn keine SMTP-Variablen gesetzt sind, wird das OTP im Entwicklerprotokoll ausgegeben. Sie können den Demo-Code verwenden.',
    requestOtpBtn: 'Code anfordern',
    sendingBtn: 'Senden...',
    otpInputLabel: 'Verifizierungscode',
    otpPlaceholder: '6-stelligen Code eingeben',
    verifyBtn: 'Code überprüfen',
    verifyingBtn: 'Überprüfen...',
    passwordLabel: 'Passwort festlegen (mind. 8 Zeichen)',
    passwordPlaceholder: 'Mindestens 8 Zeichen',
    confirmPasswordLabel: 'Passwort bestätigen',
    confirmPasswordPlaceholder: 'Passwort erneut eingeben',
    showPasswordBtn: 'Passwort anzeigen',
    completeBtn: 'Registrierung abschließen',
    completingBtn: 'Registrieren...',
    hasAccount: 'Haben Sie bereits ein Konto?',
    loginLink: 'Anmelden',
    errName: 'Bitte geben Sie Ihren Namen ein.',
    errEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    errOtpLength: 'Bitte geben Sie den 6-stelligen Verifizierungscode ein.',
    errPasswordLength: 'Das Passwort muss mindestens 8 Zeichen lang sein.',
    errPasswordMatch: 'Die Passwörter stimmen nicht überein.',
    errServer: 'Bei der Kommunikation mit dem Server ist ein Fehler aufgetreten.',
    errSendFail: 'Senden des Verifizierungscodes fehlgeschlagen.',
    errVerifyFail: 'Der Verifizierungscode stimmt nicht überein.',
    errRegisterFail: 'Registrierung fehlgeschlagen.',
    successSend: 'Ein 6-stelliger Sicherheitscode wurde gesendet an ',
    successVerify: 'E-Mail verifiziert! Legen Sie ein Passwort fest (mind. 8 Zeichen).',
    alertSuccess: 'Registrierung abgeschlossen. Weiterleitung zur Anmeldung.'
  }
};

export const RegisterScreen = () => {
  const { lang, setCurrentView } = useApp();
  const localT = localTranslations[lang] || localTranslations.ko;

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
      setErrorMessage(localT.errName);
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorMessage(localT.errEmail);
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
        setSuccessMessage(`${email}${localT.successSend}`);
      } else {
        setErrorMessage(data.message || localT.errSendFail);
      }
    } catch {
      setIsLoading(false);
      setErrorMessage(localT.errServer);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (otpCode.length !== 6) {
      setErrorMessage(localT.errOtpLength);
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
        setSuccessMessage(localT.successVerify);
      } else {
        setErrorMessage(data.message || localT.errVerifyFail);
      }
    } catch {
      setIsLoading(false);
      setErrorMessage(localT.errServer);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 8) {
      setErrorMessage(localT.errPasswordLength);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage(localT.errPasswordMatch);
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
        alert(localT.alertSuccess);
        setCurrentView('login');
      } else {
        setErrorMessage(data.message || localT.errRegisterFail);
      }
    } catch {
      setIsLoading(false);
      setErrorMessage(localT.errServer);
    }
  };

  return (
    <main className="max-w-[400px] mx-auto px-6 py-16 md:py-24 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-light tracking-tight text-neutral-900">{localT.title}</h2>
        <p className="text-xs text-neutral-500">{localT.subtitle}</p>
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
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">{localT.nameLabel}</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={localT.namePlaceholder}
              className="w-full h-11 px-4 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black transition-all"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">{localT.emailLabel}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={localT.emailPlaceholder}
              className="w-full h-11 px-4 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black transition-all"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">{localT.timezoneLabel}</label>
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
            💡 <strong>{localT.tipTitle}</strong> {localT.tipDesc}
          </p>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? localT.sendingBtn : localT.requestOtpBtn}
          </button>
        </form>
      )}

      {/* Step 2: Verify OTP */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">{localT.otpInputLabel}</label>
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={e => setOtpCode(e.target.value)}
              placeholder={localT.otpPlaceholder}
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
            {isLoading ? localT.verifyingBtn : localT.verifyBtn}
          </button>
        </form>
      )}

      {/* Step 3: Setup Password */}
      {step === 3 && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">{localT.passwordLabel}</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={localT.passwordPlaceholder}
              className="w-full h-11 px-4 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black transition-all"
              required
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">{localT.confirmPasswordLabel}</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder={localT.confirmPasswordPlaceholder}
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
            {localT.showPasswordBtn}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98]"
          >
            {isLoading ? localT.completingBtn : localT.completeBtn}
          </button>
        </form>
      )}

      <div className="pt-4 text-center border-t border-neutral-200 text-xs text-neutral-500">
        {localT.hasAccount}{' '}
        <button
          type="button"
          onClick={() => setCurrentView('login')}
          className="font-bold text-black hover:underline"
        >
          {localT.loginLink}
        </button>
      </div>
    </main>
  );
};
