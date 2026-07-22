import React from 'react';

export const DeleteConfirmModal = ({ letter, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-sm p-6 rounded-xl border border-neutral-200 shadow-xl space-y-6 text-center">
        {/* Warning Icon */}
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-2xl">delete_forever</span>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h3 className="font-semibold text-base text-neutral-900">
            편지를 삭제하시겠습니까?
          </h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            아래 타임캡슐 편지를 영구적으로 삭제합니다.<br />
            이 작업은 복구할 수 없습니다.
          </p>
        </div>

        {/* Info Preview */}
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 text-left text-xs space-y-1">
          <p className="font-bold text-neutral-950 truncate">{letter.title}</p>
          <p className="text-neutral-500">수신인: {letter.recipient}</p>
          <p className="text-neutral-500">개봉일: {letter.unlockDate}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-wider rounded"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded shadow-sm"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};
