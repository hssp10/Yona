import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TermsModal } from './TermsModal';

export const TermsScreen = () => {
  const { t, setCurrentView } = useApp();
  const [agreements, setAgreements] = useState({
    term1: false,
    term2: false,
    term3: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const allChecked = agreements.term1 && agreements.term2 && agreements.term3;

  const handleAllToggle = (e) => {
    const checked = e.target.checked;
    setAgreements({
      term1: checked,
      term2: checked,
      term3: checked
    });
  };

  const handleSingleToggle = (key) => {
    setAgreements(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!allChecked) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setCurrentView('home');
    }, 1000);
  };

  const renderFormattedBody = (rawText = '') => {
    return rawText.split('\n\n').map((paragraph, idx) => {
      const lines = paragraph.split('\n');
      return (
        <p key={idx} className="mb-3 text-xs leading-relaxed text-neutral-600">
          {lines.map((line, lIdx) => (
            <React.Fragment key={lIdx}>
              {line}
              {lIdx < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      );
    });
  };

  const modalContents = {
    term1: {
      title: t.term1Title,
      body: renderFormattedBody(t.term1Body)
    },
    term2: {
      title: t.term2Title,
      body: renderFormattedBody(t.term2Body)
    },
    term3: {
      title: t.term3Title,
      body: renderFormattedBody(t.term3Body)
    }
  };

  return (
    <main className="max-w-[480px] mx-auto px-6 py-16 md:py-24 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-light tracking-tight text-neutral-900">
          {t.termsHeaderTitle}
        </h2>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
          {t.termsHeaderDesc}
        </p>
      </div>

      {/* Card */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Total Agreement Option */}
          <div
            className="flex items-center p-4 bg-neutral-50 rounded-xl border border-neutral-200 transition-all hover:bg-neutral-100 cursor-pointer"
            onClick={() => handleAllToggle({ target: { checked: !allChecked } })}
          >
            <input
              id="all-terms"
              type="checkbox"
              checked={allChecked}
              onChange={handleAllToggle}
              className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black cursor-pointer transition-all"
              onClick={(e) => e.stopPropagation()}
            />
            <label htmlFor="all-terms" className="ml-3 text-sm text-neutral-900 font-bold cursor-pointer">
              {t.agreeAll}
            </label>
          </div>

          <div className="h-[1px] bg-neutral-200" />

          {/* Checklist */}
          <div className="space-y-4">
            {['term1', 'term2', 'term3'].map((key) => {
              const title = t[`${key}Title`];
              const tag = t[`${key}Tag`];
              const desc = t[`${key}Desc`];

              return (
                <div key={key} className="flex items-start justify-between gap-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={agreements[key]}
                      onChange={() => handleSingleToggle(key)}
                      className="w-4 h-4 mt-0.5 rounded border-neutral-300 text-black focus:ring-black cursor-pointer transition-all"
                    />
                    <div className="ml-3">
                      <label
                        className="text-xs font-bold text-neutral-900 block cursor-pointer"
                        onClick={() => handleSingleToggle(key)}
                      >
                        {title} <span className="text-neutral-500 font-normal text-[10px] ml-1">{tag}</span>
                      </label>
                      <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed font-normal">{desc}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModal(key)}
                    className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:text-black shrink-0 underline underline-offset-2 mt-0.5"
                  >
                    보기
                  </button>
                </div>
              );
            })}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!allChecked || submitting}
            className="w-full bg-black hover:bg-neutral-800 text-white py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t.enteringVault}</span>
              </>
            ) : (
              <span>{t.agreeAndStart}</span>
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-[10px] text-neutral-400 leading-relaxed max-w-xs mx-auto">
        {t.promiseText}
      </p>

      {/* Modal */}
      {activeModal && (
        <TermsModal
          title={modalContents[activeModal].title}
          content={modalContents[activeModal].body}
          onClose={() => setActiveModal(null)}
        />
      )}
    </main>
  );
};
