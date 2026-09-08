import React from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnimatePresence, motion } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-full max-w-[370px] px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            id={`toast-${toast.id}`}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="pointer-events-auto w-full flex items-center justify-between gap-3 bg-neutral-900/95 text-white px-4 py-2.5 rounded-full shadow-lg border border-neutral-700/60 backdrop-blur-md"
          >
            <span className="text-xs sm:text-sm font-medium tracking-tight">
              {toast.text}
            </span>
            <button
              id={`toast-dismiss-${toast.id}`}
              onClick={() => dismissToast(toast.id)}
              className="text-neutral-400 hover:text-white p-0.5 rounded-full hover:bg-neutral-800 transition-colors"
              aria-label="Fechar notificação"
            >
              <X size={15} strokeWidth={2.5} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
