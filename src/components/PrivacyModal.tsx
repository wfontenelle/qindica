import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Lock, Eye, Trash2, CheckCircle2 } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-white dark:bg-[#18181C] rounded-xl p-6 sm:p-7 shadow-2xl border border-neutral-200/80 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-5 right-5 p-2 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
                Privacidade & Segurança
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Como protegemos você e seus dados no Qindica
              </p>
            </div>
          </div>

          {/* Core Pillars */}
          <div className="flex flex-col gap-3 my-5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
            {/* Pillar 1: Finalidade */}
            <div className="p-3.5 rounded-md bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/60 flex items-start gap-3">
              <Eye size={18} className="text-[#7B2FFF] dark:text-[#a068ff] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-neutral-900 dark:text-white font-bold mb-0.5">
                  Finalidade Estritamente Profissional
                </strong>
                Seus dados (nome, profissão, bio e tags) funcionam como seu cartão de visitas digital para que clientes e sua rede encontrem e contratem seus serviços.
              </div>
            </div>

            {/* Pillar 2: Anti-Spam */}
            <div className="p-3.5 rounded-md bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/60 flex items-start gap-3">
              <Lock size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-neutral-900 dark:text-white font-bold mb-0.5">
                  Proteção Ativa contra Robôs e Spam
                </strong>
                Seu telefone não é distribuído a listas de telemarketing e não é exposto como texto puro para indexação por robôs. O contato no WhatsApp só acontece quando um humano clica no botão oficial.
              </div>
            </div>

            {/* Pillar 3: Autonomia */}
            <div className="p-3.5 rounded-md bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/60 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-neutral-900 dark:text-white font-bold mb-0.5">
                  Controle Total e Modo Pausa
                </strong>
                Você pode editar qualquer informação, desativar o botão de WhatsApp quando estiver com agenda cheia ou reativar sempre que quiser.
              </div>
            </div>

            {/* Pillar 4: LGPD */}
            <div className="p-3.5 rounded-md bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/60 flex items-start gap-3">
              <Trash2 size={18} className="text-neutral-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-neutral-900 dark:text-white font-bold mb-0.5">
                  Conformidade com a LGPD (Lei 13.709/2018)
                </strong>
                Você é o titular soberano dos seus dados. A qualquer momento, você pode solicitar a remoção ou exclusão completa de todas as suas informações da nossa base.
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={onClose}
            className="w-full py-3 px-5 rounded-md bg-[#7B2FFF] hover:bg-[#6A23E3] text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer active:scale-95"
          >
            Entendido, continuar no Qindica
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
