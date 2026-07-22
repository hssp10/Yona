import React from 'react';

export const TermsModal = ({ title, content, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-xl max-h-[80vh] flex flex-col rounded-xl border border-neutral-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50 shrink-0">
          <h3 className="font-semibold text-sm text-neutral-900">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-4 font-sans text-xs text-neutral-600 leading-relaxed">
          {content}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-neutral-100 bg-neutral-50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded transition-all"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
