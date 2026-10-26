import React from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success' || !toast.type;
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-elevated flex items-start justify-between gap-3 bg-[#1D2430] ${
              isSuccess
                ? 'border-[#22C997]/50 text-[#F5F6FA]'
                : isError
                ? 'border-[#EF4444]/50 text-[#F5F6FA]'
                : isWarning
                ? 'border-[#F59E0B]/50 text-[#F5F6FA]'
                : 'border-[#8CB8FF]/50 text-[#F5F6FA]'
            } animate-fadeIn`}
          >
            <div className="flex items-start gap-2.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#22C997] flex-shrink-0 mt-0.5" />}
              {isError && <XCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />}
              {isWarning && <AlertCircle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />}
              {!isSuccess && !isError && !isWarning && (
                <Info className="w-4 h-4 text-[#8CB8FF] flex-shrink-0 mt-0.5" />
              )}

              <div>
                <h5 className="font-semibold text-xs text-[#F5F6FA]">{toast.title}</h5>
                {toast.description && (
                  <p className="text-[11px] text-[#A7B0C0] mt-0.5 leading-snug">
                    {toast.description}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded text-[#6E798E] hover:text-[#F5F6FA]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
