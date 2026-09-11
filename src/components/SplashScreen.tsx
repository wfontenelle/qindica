import React from 'react';
import { motion } from 'motion/react';
import { BrandLogo } from './BrandLogo';

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
        {/* Animated Brand Symbol Badge */}
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="mb-5 relative drop-shadow-xl"
        >
          <BrandLogo variant="symbol" theme="purple" size="xl" className="w-20 h-20 rounded-2xl shadow-xl shadow-[#7B2FFF]/30" />
        </motion.div>

        {/* Brand Full Logo */}
        <BrandLogo variant="full" theme="auto" size="lg" className="h-8 sm:h-9 w-auto mb-1" />

        {/* Tagline */}
        <p className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400">
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
