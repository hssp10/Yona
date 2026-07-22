import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatUnlockDate } from '../utils/dateHelper';

const paymentLocal = {
  ko: {
    noLetterTitle: '결제 대기 중인 편지가 없습니다',
    noLetterDesc: '편지 작성기에서 먼저 편지를 완성해 주세요.',
    noLetterBtn: '편지 쓰러 가기',
    backBtn: '이전 단계로 (편지 내용 수정)',
    step1: '1. 작성',
    step2: '2. 결제 & 봉인',
    headerTitle: '보관 플랜 선택',
    headerSubtitle: '당신의 소중한 편지를 보존할 플랜을 선택하고 봉인 결제를 진행하세요.',
    chooseBtn: '선택',
    chosenBtn: '선택됨 ✓',
    orderSummary: '보관 신청 내역 요약',
    editSmall: '글 수정하기',
    letterTitle: '편지 제목:',
    sender: '송신인 성함:',
    recipientEmail: '수신인 이메일:',
    unlockTime: '타임락 개봉 시각:',
    waxSeal: '밀봉 인장:',
    finalPrice: '최종 결제 금액:',
    modifyBtn: '편지 내용 다시 수정하기',
    payMethodTitle: '결제 수단 선택',
    paySubmitBtn: '결제하고 봉인 완료',
    successTitle: '결제 및 밀봉 완료',
    successDesc: '보관료 결제가 완료되었으며 편지가 양자 분산 보관 서버에 영구 밀봉되었습니다.',
    successBtn: '내 보관함 페이지로 이동',
    paymentErr: '결제 처리 중 통신 오류가 발생했습니다.',
    noLetterErr: '결제할 편지 초안이 존재하지 않습니다.',
    plans: {
      single: { title: '1개 보관', desc: '단 한 번의 소중한 순간을 보존.' },
      plan5: { title: '5개 패키지', desc: '가족들을 위한 작은 보관 공간.' },
      plan10: { title: '10개 패키지', desc: '인생의 핵심 여정을 기록하고 보존.' },
      plan15: { title: '15개 패키지', desc: '기록을 남기고자 하는 소장가 전용.' },
      features: ['양자 보안 암호화', '평생 보관 보장', '지정일 이메일 발송']
    },
    methods: {
      kakaopay: '카카오페이',
      tosspay: '토스페이',
      card: '신용/체크카드',
      applepay: 'Apple Pay'
    },
    sealNames: {
      'classic-cognac': '황금 왁스 인장',
      'royal-navy': '로열 블루 엠블럼',
      'emerald-seal': '에메랄드 인장',
      'amber-gold': '코냑 앰버 크라운'
    }
  },
  ja: {
    noLetterTitle: '決済待機中の手紙がありません',
    noLetterDesc: '手紙作成画面で先に手紙を完成させてください。',
    noLetterBtn: '手紙を書きに行く',
    backBtn: '前の段階へ (手紙内容の修正)',
    step1: '1. 作成',
    step2: '2. 決済 & 封印',
    headerTitle: '保管プランの選択',
    headerSubtitle: 'あなたの大切な手紙を保存するプランを選択し、封印決済を進めてください。',
    chooseBtn: '選択',
    chosenBtn: '選択済み ✓',
    orderSummary: '保管申請内容の概要',
    editSmall: '文章を修正する',
    letterTitle: '手紙のタイトル:',
    sender: '送信人のお名前:',
    recipientEmail: '受信メール:',
    unlockTime: 'タイムロック開封時刻:',
    waxSeal: '封印ワックス:',
    finalPrice: '最終決済金額:',
    modifyBtn: '手紙の内容をもう一度修正する',
    payMethodTitle: '決済手段の選択',
    paySubmitBtn: '決済して封印完了',
    successTitle: '決済および封印完了',
    successDesc: '保管料の決済が完了し、手紙が量子分散保管サーバーに永久封印されました。',
    successBtn: 'マイ保管箱ページへ移動',
    paymentErr: '決済処理中に通信エラーが発生しました。',
    noLetterErr: '決済する手紙の下書きが存在しません。',
    plans: {
      single: { title: '1通保管', desc: 'たった一度の大切な瞬間を保存。' },
      plan5: { title: '5通パッケージ', desc: '家族のための小さな保管スペース。' },
      plan10: { title: '10通パッケージ', desc: '人生の核心となる旅路を記録し保存。' },
      plan15: { title: '15通パッケージ', desc: '記録を残したいコレクター専用。' },
      features: ['量子セキュリティ暗号化', '生涯保管保証', '指定日メール送信']
    },
    methods: {
      kakaopay: '카카오ペイ',
      tosspay: 'トスペイ',
      card: 'クレジットカード/デビットカード',
      applepay: 'Apple Pay'
    },
    sealNames: {
      'classic-cognac': '黄金ワックスシール',
      'royal-navy': 'ロイヤルブルーエンブレム',
      'emerald-seal': 'エメラルドシール',
      'amber-gold': 'コニャックアンバークラウン'
    }
  },
  en: {
    noLetterTitle: 'No letter pending payment',
    noLetterDesc: 'Please write and complete your letter first.',
    noLetterBtn: 'Go to Compose',
    backBtn: 'Back to Compose (Edit Content)',
    step1: '1. Compose',
    step2: '2. Pay & Seal',
    headerTitle: 'Select Archival Plan',
    headerSubtitle: 'Select a plan to preserve your precious letter and proceed with payment.',
    chooseBtn: 'Select',
    chosenBtn: 'Selected ✓',
    orderSummary: 'Order Details Summary',
    editSmall: 'Edit Content',
    letterTitle: 'Letter Title:',
    sender: 'Sender Name:',
    recipientEmail: 'Recipient Email:',
    unlockTime: 'Time-lock Unlock Time:',
    waxSeal: 'Wax Seal:',
    finalPrice: 'Final Price:',
    modifyBtn: 'Modify Letter Content Again',
    payMethodTitle: 'Select Payment Method',
    paySubmitBtn: 'Pay and Complete Sealing',
    successTitle: 'Payment & Sealing Completed',
    successDesc: 'Payment confirmed. Your letter has been permanently sealed in our quantum-resistant servers.',
    successBtn: 'Go to My Vault',
    paymentErr: 'A network communication error occurred during payment processing.',
    noLetterErr: 'No letter draft exists for payment.',
    plans: {
      single: { title: 'Single Vault', desc: 'Preserve a single precious moment.' },
      plan5: { title: '5-Letter Package', desc: 'A small archival space for your family.' },
      plan10: { title: '10-Letter Package', desc: 'Record and preserve life\'s key journeys.' },
      plan15: { title: '15-Letter Package', desc: 'Dedicated storage for legacy collectors.' },
      features: ['Quantum Security Encryption', 'Lifetime Archival Guarantee', 'Designated Date Email Delivery']
    },
    methods: {
      kakaopay: 'KakaoPay',
      tosspay: 'TossPay',
      card: 'Credit/Debit Card',
      applepay: 'Apple Pay'
    },
    sealNames: {
      'classic-cognac': 'Classic Cognac Wax Seal',
      'royal-navy': 'Royal Navy Emblem',
      'emerald-seal': 'Emerald Wax Seal',
      'amber-gold': 'Amber Gold Crown'
    }
  },
  zh: {
    noLetterTitle: '没有等待支付的信件',
    noLetterDesc: '请先在信件撰写页面完成信件。',
    noLetterBtn: '去写信',
    backBtn: '返回上一步（修改信件内容）',
    step1: '1. 撰写',
    step2: '2. 支付与封存',
    headerTitle: '选择保管方案',
    headerSubtitle: '选择保存您珍贵信件的方案并进行支付封存。',
    chooseBtn: '选择',
    chosenBtn: '已选择 ✓',
    orderSummary: '保管申请明细摘要',
    editSmall: '修改信件',
    letterTitle: '信件标题:',
    sender: '发件人姓名:',
    recipientEmail: '收件人邮箱:',
    unlockTime: '时间锁开封时间:',
    waxSeal: '封印火漆:',
    finalPrice: '最终支付金额:',
    modifyBtn: '再次修改信件内容',
    payMethodTitle: '选择支付方式',
    paySubmitBtn: '支付并完成封存',
    successTitle: '支付与封存已完成',
    successDesc: '保管费用支付已完成，信件已永久封存于量子分布式保管服务器中。',
    successBtn: '前往我的保险库页面',
    paymentErr: '支付处理过程中发生通信错误。',
    noLetterErr: '不存在待支付的信件草稿。',
    plans: {
      single: { title: '单封保管', desc: '仅保存一次珍贵瞬间。' },
      plan5: { title: '5 封礼包', desc: '适合家人的小型保管空间。' },
      plan10: { title: '10 封礼包', desc: '记录并保存人生的核心旅程。' },
      plan15: { title: '15 封礼包', desc: '专为希望留下记录的收藏家准备。' },
      features: ['量子安全加密', '终身保管保障', '指定日期邮件发送']
    },
    methods: {
      kakaopay: 'KakaoPay',
      tosspay: 'TossPay',
      card: '信用卡/借记卡',
      applepay: 'Apple Pay'
    },
    sealNames: {
      'classic-cognac': '金色火漆印章',
      'royal-navy': '皇家蓝徽章',
      'emerald-seal': '祖母绿火漆印章',
      'amber-gold': '琥珀金皇冠'
    }
  }
};

export const PaymentScreen = () => {
  const { t, lang, finalizePaymentAndVault, setCurrentView, user } = useApp();

  const [activeLetter, setActiveLetter] = useState(() => {
    const saved = localStorage.getItem('hl_pending_letter');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedPlanId, setSelectedPlanId] = useState('plan_10');
  const [paymentMethod, setPaymentMethod] = useState('kakaopay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('hl_pending_letter');
    if (saved) {
      setActiveLetter(JSON.parse(saved));
    }
  }, []);

  const loc = paymentLocal[lang] || paymentLocal.en;

  const plans = [
    {
      id: 'plan_single',
      title: loc.plans.single.title,
      price: '500 KRW',
      priceNum: 500,
      desc: loc.plans.single.desc,
      tag: null,
      features: loc.plans.features
    },
    {
      id: 'plan_5',
      title: loc.plans.plan5.title,
      price: '2,250 KRW',
      priceNum: 2250,
      originalPrice: '2,500 KRW',
      desc: loc.plans.plan5.desc,
      tag: '10% OFF',
      features: loc.plans.features
    },
    {
      id: 'plan_10',
      title: loc.plans.plan10.title,
      price: '4,000 KRW',
      priceNum: 4000,
      originalPrice: '5,000 KRW',
      desc: loc.plans.plan10.desc,
      tag: 'POPULAR',
      isPopular: true,
      features: loc.plans.features
    },
    {
      id: 'plan_15',
      title: loc.plans.plan15.title,
      price: '5,250 KRW',
      priceNum: 5250,
      originalPrice: '7,500 KRW',
      desc: loc.plans.plan15.desc,
      tag: 'BEST VALUE',
      features: loc.plans.features
    }
  ];

  const currentPlan = plans.find(p => p.id === selectedPlanId) || plans[2];

  const handlePay = async (e) => {
    e.preventDefault();
    if (!activeLetter) {
      alert(loc.noLetterErr);
      setCurrentView('write');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      await finalizePaymentAndVault(currentPlan, paymentMethod);
      localStorage.removeItem('hl_pending_letter');
      setIsProcessing(false);
      setShowSuccessModal(true);
    } catch (err) {
      setIsProcessing(false);
      setErrorMessage(err.message || loc.paymentErr);
    }
  };

  if (!activeLetter) {
    return (
      <main className="max-w-[400px] mx-auto px-6 py-20 text-center space-y-6">
        <h2 className="text-xl font-bold text-neutral-900">{loc.noLetterTitle}</h2>
        <p className="text-xs text-neutral-500">{loc.noLetterDesc}</p>
        <button
          onClick={() => setCurrentView('write')}
          className="w-full py-3 bg-black hover:bg-neutral-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all"
        >
          {loc.noLetterBtn}
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-[1000px] mx-auto px-6 py-12 space-y-10">
      
      {/* Top Navigation & Step Indicator */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        {/* Back Button to Edit Letter */}
        <button
          onClick={() => setCurrentView('write')}
          className="text-xs font-bold text-neutral-700 hover:text-black flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-black transition-all bg-white shadow-sm"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>{loc.backBtn}</span>
        </button>

        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full border border-neutral-200 text-[10px] uppercase font-bold tracking-widest">
          <span className="text-neutral-400 cursor-pointer" onClick={() => setCurrentView('write')}>{loc.step1}</span>
          <span className="text-neutral-300">/</span>
          <span className="text-black font-extrabold underline decoration-2 underline-offset-4">{loc.step2}</span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2 max-w-md mx-auto">
        <h2 className="text-3xl font-light tracking-tight text-neutral-900">{loc.headerTitle}</h2>
        <p className="text-xs text-neutral-500">{loc.headerSubtitle}</p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {plans.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`bg-white border rounded-xl p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-black ring-1 ring-black shadow-sm'
                  : 'border-neutral-200 hover:border-neutral-400'
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-neutral-900">{plan.title}</h3>
                  {plan.tag && (
                    <span className="text-[9px] font-extrabold uppercase bg-neutral-100 px-2 py-0.5 rounded text-neutral-700 tracking-wider">
                      {plan.tag}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-neutral-500 leading-normal min-h-[32px]">{plan.desc}</p>

                <div className="space-y-1">
                  <div className="text-2xl font-light text-neutral-950">{plan.price}</div>
                  {plan.originalPrice && (
                    <div className="text-[10px] text-neutral-400 line-through">{plan.originalPrice}</div>
                  )}
                </div>

                <div className="h-[1px] bg-neutral-100" />

                <ul className="space-y-2 text-[10px] text-neutral-500">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span>✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className={`w-full py-2.5 mt-6 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                  isSelected
                    ? 'bg-black text-white'
                    : 'bg-white text-neutral-800 border border-neutral-200 hover:border-black'
                }`}
              >
                {isSelected ? loc.chosenBtn : loc.chooseBtn}
              </button>
            </div>
          );
        })}
      </div>

      {/* Summary & Payment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Order Details */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900">
                {loc.orderSummary}
              </h3>
              <button
                onClick={() => setCurrentView('write')}
                className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:text-black underline"
              >
                {loc.editSmall}
              </button>
            </div>

            <div className="space-y-3 text-xs text-neutral-600">
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span>{loc.letterTitle}</span>
                <span className="font-bold text-neutral-900 truncate max-w-[200px]">{activeLetter.title}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span>{loc.sender}</span>
                <span className="font-bold text-neutral-900">{activeLetter.sender || activeLetter.recipient}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span>{loc.recipientEmail}</span>
                <span className="font-bold text-neutral-950">{activeLetter.recipientContact}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span>{loc.unlockTime}</span>
                <span className="font-bold text-neutral-955">{formatUnlockDate(activeLetter.unlockDate, user.timezone)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span>{loc.waxSeal}</span>
                <span className="font-bold text-neutral-950">{loc.sealNames[activeLetter.sealType] || activeLetter.sealName || loc.sealNames['classic-cognac']}</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-bold text-neutral-955 font-mono">
                <span>{loc.finalPrice}</span>
                <span className="text-lg text-black font-extrabold">{currentPlan.price}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('write')}
            className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            {loc.modifyBtn}
          </button>
        </div>

        {/* Payment Methods */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-100 pb-3">
              {loc.payMethodTitle}
            </h3>

            {errorMessage && (
              <div className="p-3.5 bg-red-50 text-red-700 border border-red-100 text-xs font-semibold rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3.5 text-xs">
              {/* KakaoPay */}
              <button
                type="button"
                onClick={() => setPaymentMethod('kakaopay')}
                className={`relative py-4 px-3 rounded-xl font-bold transition-all duration-200 border text-left flex flex-col justify-between min-h-[72px] group ${
                  paymentMethod === 'kakaopay'
                    ? 'bg-[#FEE500] text-[#191919] border-[#FEE500] ring-2 ring-[#FEE500]/40 shadow-md scale-[1.02]'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="font-black text-sm tracking-tight">KakaoPay</span>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    paymentMethod === 'kakaopay' ? 'bg-[#191919] text-[#FEE500]' : 'border border-neutral-300 text-transparent'
                  }`}>✓</span>
                </div>
                <span className="text-[9px] opacity-75 font-medium">카카오 간편결제</span>
              </button>

              {/* TossPay */}
              <button
                type="button"
                onClick={() => setPaymentMethod('tosspay')}
                className={`relative py-4 px-3 rounded-xl font-bold transition-all duration-200 border text-left flex flex-col justify-between min-h-[72px] group ${
                  paymentMethod === 'tosspay'
                    ? 'bg-[#0064FF] text-white border-[#0064FF] ring-2 ring-[#0064FF]/40 shadow-md scale-[1.02]'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="font-black text-sm tracking-tight">TossPay</span>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    paymentMethod === 'tosspay' ? 'bg-white text-[#0064FF]' : 'border border-neutral-300 text-transparent'
                  }`}>✓</span>
                </div>
                <span className="text-[9px] opacity-80 font-medium">토스 원클릭 결제</span>
              </button>

              {/* Credit/Debit Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`relative py-4 px-3 rounded-xl font-bold transition-all duration-200 border text-left flex flex-col justify-between min-h-[72px] group ${
                  paymentMethod === 'card'
                    ? 'bg-neutral-900 text-white border-neutral-900 ring-2 ring-black/40 shadow-md scale-[1.02]'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">credit_card</span>
                    <span className="font-bold text-xs">{loc.methods.card}</span>
                  </div>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    paymentMethod === 'card' ? 'bg-white text-black' : 'border border-neutral-300 text-transparent'
                  }`}>✓</span>
                </div>
                <span className="text-[9px] opacity-70 font-medium">Visa / MasterCard / AMEX</span>
              </button>

              {/* Apple Pay */}
              <button
                type="button"
                onClick={() => setPaymentMethod('applepay')}
                className={`relative py-4 px-3 rounded-xl font-bold transition-all duration-200 border text-left flex flex-col justify-between min-h-[72px] group ${
                  paymentMethod === 'applepay'
                    ? 'bg-black text-white border-black ring-2 ring-black/40 shadow-md scale-[1.02]'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.16-1.9-14.49-6.09-3.26-2.63-7.14-7.27-11.64-13.9-6.3-9.28-11.16-19.8-14.58-31.55-3.42-11.75-5.13-23.01-5.13-33.78 0-14.42 3.69-26.24 11.08-35.46 7.39-9.22 16.59-13.9 27.6-14.04 4.58 0 9.77 1.12 15.58 3.35 5.81 2.23 9.72 3.35 11.74 3.35 1.74 0 5.76-1.19 12.06-3.56 6.3-2.38 11.45-3.46 15.45-3.25 12.18.66 21.73 5.09 28.66 13.3-10.88 6.53-16.19 15.57-15.93 27.12.26 8.94 3.74 16.4 10.44 22.38 6.7 5.98 14.61 9.4 23.73 10.25-2.22 6.67-5.21 13.62-8.97 20.85zm-25.04-106.6c0 6.65-2.38 13.12-7.14 18.42-5.46 6.1-12.22 9.76-20.28 10.98-.39-1.05-.59-2.18-.59-3.39 0-6.65 2.58-13.3 7.74-18.6 2.58-2.65 5.75-4.82 9.51-6.51 3.76-1.69 7.42-2.61 10.98-2.76.13 1.05.2 2.05.2 2.99z"/>
                    </svg>
                    <span className="font-extrabold text-xs tracking-tight">Pay</span>
                  </div>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    paymentMethod === 'applepay' ? 'bg-white text-black' : 'border border-neutral-300 text-transparent'
                  }`}>✓</span>
                </div>
                <span className="text-[9px] opacity-70 font-medium">Touch / Face ID 결제</span>
              </button>

              {/* PayPal */}
              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`relative py-4 px-3 rounded-xl font-bold transition-all duration-200 border text-left flex flex-col justify-between min-h-[72px] group ${
                  paymentMethod === 'paypal'
                    ? 'bg-[#003087] text-white border-[#003087] ring-2 ring-[#003087]/40 shadow-md scale-[1.02]'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="font-black text-sm italic tracking-tighter">
                    <span className="text-[#0079C1]">Pay</span><span className="text-[#00457C]">Pal</span>
                  </span>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    paymentMethod === 'paypal' ? 'bg-[#00c6ff] text-[#003087]' : 'border border-neutral-300 text-transparent'
                  }`}>✓</span>
                </div>
                <span className="text-[9px] opacity-80 font-medium">Global Express Checkout</span>
              </button>

              {/* Google Pay */}
              <button
                type="button"
                onClick={() => setPaymentMethod('googlepay')}
                className={`relative py-4 px-3 rounded-xl font-bold transition-all duration-200 border text-left flex flex-col justify-between min-h-[72px] group ${
                  paymentMethod === 'googlepay'
                    ? 'bg-neutral-900 text-white border-neutral-900 ring-2 ring-black/40 shadow-md scale-[1.02]'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <div className="flex items-center gap-1 font-bold text-xs tracking-tight">
                    <span className="text-[#4285F4]">G</span>
                    <span className="text-[#EA4335]">o</span>
                    <span className="text-[#FBBC05]">o</span>
                    <span className="text-[#4285F4]">g</span>
                    <span className="text-[#34A853]">l</span>
                    <span className="text-[#EA4335]">e</span>
                    <span className="ml-0.5">Pay</span>
                  </div>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    paymentMethod === 'googlepay' ? 'bg-white text-black' : 'border border-neutral-300 text-transparent'
                  }`}>✓</span>
                </div>
                <span className="text-[9px] opacity-70 font-medium">Google 계정 간편결제</span>
              </button>
            </div>

            {/* Quantum SSL Guarantee Security Banner */}
            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 font-medium">
              <span className="material-symbols-outlined text-sm text-emerald-600">verified_user</span>
              <span>256-bit 양자 보안 암호화 결제 시스템 적용</span>
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>{currentPlan.price} {loc.paySubmitBtn}</span>
            )}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white p-8 rounded-xl max-w-sm w-full border border-neutral-200 shadow-2xl text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto shadow animate-wax">
              <span className="material-symbols-outlined text-2xl">verified</span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-neutral-900">{loc.successTitle}</h3>
              <p className="text-xs text-neutral-500">
                {loc.successDesc}
              </p>
            </div>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                setCurrentView('archive');
              }}
              className="w-full py-3 bg-black hover:bg-neutral-800 text-white font-bold rounded text-xs uppercase tracking-wider transition-all"
            >
              {loc.successBtn}
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
