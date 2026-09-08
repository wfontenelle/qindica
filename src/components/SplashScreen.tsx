import React from 'react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  message?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ message = 'Carregando rede de confiança...' }) => {
  return (
    <motion.div
      id="qindica-splash-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F4F4F6] dark:bg-[#0E0E11] text-neutral-900 dark:text-neutral-100 select-none"
    >
      <div className="flex flex-col items-center text-center max-w-xs px-6">
        {/* Animated Brand Badge */}
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-[#8B42FF] to-[#6716EE] flex items-center justify-center shadow-xl shadow-[#7B2FFF]/30 mb-5 relative"
        >
          <svg viewBox="0 0 512 512" className="w-11 h-11 sm:w-14 sm:h-14" fill="none">
            {/* Q Ring */}
            <circle cx="248" cy="238" r="118" stroke="#FFFFFF" strokeWidth="50" strokeLinecap="round" />
            {/* Q Tail */}
            <path d="M 290 280 L 366 356" stroke="#FFFFFF" strokeWidth="50" strokeLinecap="round" />
            {/* Star */}
            <polygon points="370,105 382,130 410,134 389,153 395,180 370,166 345,180 351,153 330,134 358,130" fill="#FBBF24" />
          </svg>
        </motion.div>

        {/* Brand Name */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
          Qindica
        </h1>

        {/* Tagline */}
        <p className="mt-1 text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400">
          Rede de indicações de confiança
        </p>

        {/* Indeterminate loader bar */}
        <div className="mt-6 w-36 h-1 bg-neutral-200/80 dark:bg-neutral-800 rounded-full overflow-hidden relative">
          <motion.div
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-[#7B2FFF] to-[#A36BFF] rounded-full"
            animate={{ left: ['-50%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          />
        </div>

        {/* Status text */}
        <p className="mt-3 text-[11px] font-semibold text-neutral-400 dark:text-neutral-500">
          {message}
        </p>
      </div>
    </motion.div>
  );
};
