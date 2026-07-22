import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const settingsLocal = {
  ko: {
    title: '계정 및 보안 설정',
    desc: '사용자 프로필 및 양자 암호화 보안을 관리합니다.',
    userInfo: '기본 프로필 정보',
    name: '이름',
    email: '이메일 주소',
    timezone: '지역 / 시간대',
    save: '저장하기',
    updated: '✓ 업데이트됨',
    securityStatus: '보안 상태',
    securityActive: 'Quantum 4096-bit Encryption Active & Safe',
    backupTitle: '데이터 백업',
    backupDesc: '작성된 모든 편지와 암호화 기록을 JSON 파일로 백업합니다.',
    backupBtn: 'JSON 백업 다운로드',
    dangerZone: '위험 구역',
    dangerDesc: '계정을 삭제하면 모든 타임캡슐 서신이 영구 삭제되며 복원할 수 없습니다.',
    deleteAccountBtn: '계정 영구 삭제',
    confirmDeleteTitle: '계정을 정말 삭제하시겠습니까?',
    confirmDeleteDesc: '비밀번호를 입력하시면 모든 편지가 영구히 파괴됩니다.',
    passwordPlaceholder: '비밀번호',
    cancel: '취소',
    deleteBtn: '영구 삭제',
    deleting: '삭제 중...',
    successDeleteMsg: '계정과 보관 데이터가 삭제되었습니다.',
    failDeleteMsg: '계정 삭제 처리에 실패했습니다.',
    errPassword: '비밀번호를 입력해 주세요.',
    errNetwork: '서버 통신 오류가 발생했습니다.'
  },
  ja: {
    title: 'アカウント・セキュリティ設定',
    desc: 'ユーザープロファイルおよび量子暗号化セキュリティを管理します。',
    userInfo: '基本プロファイル情報',
    name: '名前',
    email: 'メールアドレス',
    timezone: '地域 / タイムゾーン',
    save: '保存する',
    updated: '✓ 更新されました',
    securityStatus: 'セキュリティ状態',
    securityActive: 'Quantum 4096-bit Encryption Active & Safe (量子暗号化アクティブ)',
    backupTitle: 'データバックアップ',
    backupDesc: '作成されたすべての手紙と暗号化記録をJSONファイルとしてバックアップします。',
    backupBtn: 'JSONバックアップのダウンロード',
    dangerZone: '危険エリア',
    dangerDesc: 'アカウントを削除すると、すべてのタイムカプセル手紙が永久に削除され、復元できなくなります。',
    deleteAccountBtn: 'アカウントを永久削除',
    confirmDeleteTitle: '本当にアカウントを削除しますか？',
    confirmDeleteDesc: 'パスワードを入力すると、すべての手紙が永久に破棄されます。',
    passwordPlaceholder: 'パスワード',
    cancel: 'キャンセル',
    deleteBtn: '永久削除',
    deleting: '削除中...',
    successDeleteMsg: 'アカウントと保管データが削除されました。',
    failDeleteMsg: 'アカウント削除処理に失敗しました。',
    errPassword: 'パスワードを入力してください。',
    errNetwork: 'サーバー通信エラーが発生しました。'
  },
  en: {
    title: 'Account & Security Settings',
    desc: 'Manage your profile and quantum encryption security keys.',
    userInfo: 'Basic Profile Info',
    name: 'Name',
    email: 'Email Address',
    timezone: 'Region / Timezone',
    save: 'Save Changes',
    updated: '✓ Updated',
    securityStatus: 'Security Status',
    securityActive: 'Quantum 4096-bit Encryption Active & Safe',
    backupTitle: 'Data Backup',
    backupDesc: 'Backup all written letters and encryption records as a JSON file.',
    backupBtn: 'Download JSON Backup',
    dangerZone: 'Danger Zone',
    dangerDesc: 'Deleting your account permanently erases all time capsule letters and cannot be recovered.',
    deleteAccountBtn: 'Delete Account Permanently',
    confirmDeleteTitle: 'Are you sure you want to delete your account?',
    confirmDeleteDesc: 'Enter your password to permanently destroy all of your letters.',
    passwordPlaceholder: 'Password',
    cancel: 'Cancel',
    deleteBtn: 'Delete Permanently',
    deleting: 'Deleting...',
    successDeleteMsg: 'Your account and vaulted data have been deleted.',
    failDeleteMsg: 'Failed to delete account.',
    errPassword: 'Please enter your password.',
    errNetwork: 'A server communication error occurred.'
  },
  zh: {
    title: '账户与安全设置',
    desc: '管理您的个人信息和量子加密安全密钥。',
    userInfo: '基本个人信息',
    name: '姓名',
    email: '电子邮箱地址',
    timezone: '地区 / 时区',
    save: '保存修改',
    updated: '✓ 已更新',
    securityStatus: '安全状态',
    securityActive: 'Quantum 4096-bit Encryption Active & Safe (量子加密运行正常)',
    backupTitle: '数据备份',
    backupDesc: '将所有已撰写的信件和加密记录备份为 JSON 文件。',
    backupBtn: '下载 JSON 备份',
    dangerZone: '危险区域',
    dangerDesc: '注销账户将永久删除所有时光胶囊信件，且无法恢复。',
    deleteAccountBtn: '永久注销账户',
    confirmDeleteTitle: '您确定要注销账户吗？',
    confirmDeleteDesc: '输入密码后，您的所有信件将被永久销毁。',
    passwordPlaceholder: '密码',
    cancel: '取消',
    deleteBtn: '永久注销',
    deleting: '正在注销...',
    successDeleteMsg: '您的账户和保管的数据已成功注销并删除。',
    failDeleteMsg: '注销账户处理失败。',
    errPassword: '请输入密码。',
    errNetwork: '服务器通信发生错误。'
  },
  es: {
    title: 'Configuración de Cuenta y Seguridad',
    desc: 'Administre su información de perfil y claves de seguridad de cifrado cuántico.',
    userInfo: 'Información Básica de Perfil',
    name: 'Nombre',
    email: 'Dirección de Correo Electrónico',
    timezone: 'Región / Zona Horaria',
    save: 'Guardar Cambios',
    updated: '✓ Actualizado',
    securityStatus: 'Estado de Seguridad',
    securityActive: 'Post-Quantum 4096-bit Encryption Active & Safe',
    backupTitle: 'Copia de Seguridad de Datos',
    backupDesc: 'Copia de seguridad de todas las cartas escritas y registros cifrados en un archivo JSON.',
    backupBtn: 'Descargar Copia de Seguridad JSON',
    dangerZone: 'Zona de Peligro',
    dangerDesc: 'Eliminar su cuenta borrará permanentemente todas las cartas de la cápsula del tiempo y no se podrán recuperar.',
    deleteAccountBtn: 'Eliminar Cuenta Permanentemente',
    confirmDeleteTitle: '¿Está seguro de que desea eliminar su cuenta?',
    confirmDeleteDesc: 'Ingrese su contraseña para destruir permanentemente todas sus cartas.',
    passwordPlaceholder: 'Contraseña',
    cancel: 'Cancelar',
    deleteBtn: 'Eliminar Permanentemente',
    deleting: 'Eliminando...',
    successDeleteMsg: 'Su cuenta y datos archivados han sido eliminados.',
    failDeleteMsg: 'Error al eliminar la cuenta.',
    errPassword: 'Por favor, ingrese su contraseña.',
    errNetwork: 'Ocurrió un error de comunicación con el servidor.'
  }
};

export const SettingsPage = () => {
  const { user, updateUser, letters, logout, setCurrentView, lang } = useApp();
  const [name, setName] = useState(user.name || '');
  const [saved, setSaved] = useState(false);

  // Account deletion states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const loc = settingsLocal[lang] || settingsLocal.en;

  const handleSave = (e) => {
    e.preventDefault();
    updateUser(name, user.email);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ user, letters }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `heritage_vault_backup_${user.email}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError('');

    if (!deletePassword) {
      setDeleteError(loc.errPassword);
      return;
    }

    setDeleteLoading(true);
    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          password: deletePassword
        })
      });

      const data = await res.json();
      setDeleteLoading(false);

      if (data.ok) {
        alert(loc.successDeleteMsg);
        logout();
        setCurrentView('login');
      } else {
        setDeleteError(data.message || loc.failDeleteMsg);
      }
    } catch {
      setDeleteLoading(false);
      setDeleteError(loc.errNetwork);
    }
  };

  return (
    <main className="max-w-[700px] mx-auto px-6 py-12 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-neutral-100 text-neutral-800 text-[10px] font-bold uppercase tracking-widest">
          Settings
        </div>
        <h2 className="text-3xl font-light tracking-tight text-neutral-900">{loc.title}</h2>
        <p className="text-xs text-neutral-500">{loc.desc}</p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-6 md:p-8 space-y-8">
        
        {/* User Info Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-100 pb-3">
            {loc.userInfo}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-neutral-700 uppercase tracking-wider block">{loc.name}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full h-10 px-3 border border-neutral-200 rounded-lg outline-none focus:border-black transition-all"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-neutral-700 uppercase tracking-wider block">{loc.email}</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full h-10 px-3 border border-neutral-100 bg-neutral-50 rounded-lg text-neutral-400 cursor-not-allowed"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-neutral-700 uppercase tracking-wider block">{loc.timezone}</label>
              <input
                type="text"
                value={user.timezone || 'Asia/Seoul'}
                disabled
                className="w-full h-10 px-3 border border-neutral-100 bg-neutral-50 rounded-lg text-neutral-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded transition-all"
            >
              {loc.save}
            </button>
            {saved && <span className="text-xs text-black font-bold animate-in fade-in">{loc.updated}</span>}
          </div>
        </form>

        {/* Security Info */}
        <div className="space-y-3 pt-4 border-t border-neutral-100 text-xs">
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900">
            {loc.securityStatus}
          </h3>
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded text-neutral-600 font-medium">
            {loc.securityActive}
          </div>
        </div>

        {/* Export Data */}
        <div className="space-y-3 pt-4 border-t border-neutral-100 text-xs">
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900">
            {loc.backupTitle}
          </h3>
          <p className="text-neutral-500 leading-relaxed">
            {loc.backupDesc}
          </p>
          <button
            onClick={handleExportData}
            className="px-5 py-2.5 bg-white border border-neutral-200 text-neutral-800 hover:border-black rounded text-xs font-bold uppercase tracking-wider transition-all"
          >
            {loc.backupBtn}
          </button>
        </div>

        {/* Danger Zone */}
        <div className="space-y-3 pt-4 border-t border-red-100 text-xs">
          <h3 className="text-sm font-bold uppercase tracking-widest text-red-600">
            {loc.dangerZone}
          </h3>
          <p className="text-neutral-500 leading-relaxed">
            {loc.dangerDesc}
          </p>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-5 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded text-xs font-bold uppercase tracking-wider transition-all"
          >
            {loc.deleteAccountBtn}
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white p-6 rounded-xl max-w-sm w-full space-y-6 border border-neutral-200 shadow-2xl text-center">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-red-600">{loc.confirmDeleteTitle}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {loc.confirmDeleteDesc}
              </p>
            </div>

            {deleteError && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-100 text-xs font-semibold rounded-lg">
                {deleteError}
              </div>
            )}

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <input
                type="password"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
                placeholder={loc.passwordPlaceholder}
                className="w-full h-10 px-3 border border-neutral-200 rounded text-xs outline-none focus:border-black"
                required
                autoFocus
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowDeleteModal(false); setDeletePassword(''); setDeleteError(''); }}
                  className="flex-grow py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase rounded"
                >
                  {loc.cancel}
                </button>
                <button
                  type="submit"
                  disabled={deleteLoading || !deletePassword}
                  className="flex-grow py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase rounded"
                >
                  {deleteLoading ? loc.deleting : loc.deleteBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
