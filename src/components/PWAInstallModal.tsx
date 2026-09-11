import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Share, 
  PlusSquare, 
  CheckCircle2, 
  Sparkles, 
  X, 
  ShieldCheck, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { BrandLogo } from './BrandLogo';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  
  // Default tab based on user's device, fallback to android/ios toggle
  const [activeTab, setActiveTab] = useState<'ios' | 'android'>(isIOS ? 'ios' : 'android');
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white dark:bg-[#18181C] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden text-neutral-900 dark:text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with App Brand */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-[#7B2FFF]/10 via-[#7B2FFF]/5 to-transparent border-b border-neutral-100 dark:border-neutral-800/80">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <BrandLogo variant="symbol" theme="purple" size="custom" className="w-12 h-12 rounded-xl shadow-md shadow-[#7B2FFF]/20 shrink-0" />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold">Instalar o Qindica</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#7B2FFF]/15 text-[#7B2FFF] dark:text-[#9D5CFF]">
                  PWA Oficial
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Acesse direto da tela inicial do seu celular
              </p>
            </div>
          </div>

          {/* OS Selector Tabs */}
          <div className="flex gap-2 mt-4 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl">
            <button
              onClick={() => setActiveTab('android')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'android'
                  ? 'bg-white dark:bg-neutral-700 text-[#7B2FFF] dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Android / Chrome
            </button>
            <button
              onClick={() => setActiveTab('ios')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'ios'
                  ? 'bg-white dark:bg-neutral-700 text-[#7B2FFF] dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              iPhone / iOS
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {isInstalled ? (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                Qindica já está instalado!
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                Você já está utilizando a versão de aplicativo no seu dispositivo.
              </p>
            </div>
          ) : installSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                Aplicativo adicionado com sucesso!
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                O ícone do Qindica já foi adicionado à sua tela inicial.
              </p>
            </div>
          ) : activeTab === 'android' ? (
            /* Android Instructions */
            <div className="space-y-4">
              {isInstallable ? (
                <div className="space-y-3">
                  <p className="text-xs text-neutral-600 dark:text-neutral-300">
                    Clique no botão abaixo para adicionar o aplicativo direto na sua tela inicial em 1 segundo:
                  </p>
                  <button
                    onClick={handleInstallClick}
                    className="w-full py-3 px-4 rounded-xl bg-[#7B2FFF] hover:bg-[#6A24E3] active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-[#7B2FFF]/25 flex items-center justify-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Instalar Qindica no Celular
                  </button>
                </div>
              ) : (
                <div className="space-y-3 text-xs text-neutral-600 dark:text-neutral-300">
                  <p className="font-medium text-neutral-800 dark:text-neutral-200">
                    Instale pelo navegador em 2 passos rápidos:
                  </p>
                  <ol className="space-y-2.5">
                    <li className="flex items-start gap-2.5 p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                      <span className="w-5 h-5 rounded-full bg-[#7B2FFF]/15 text-[#7B2FFF] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        Toque no menu de <strong>três pontinhos (⋮)</strong> no canto superior do Google Chrome.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5 p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                      <span className="w-5 h-5 rounded-full bg-[#7B2FFF]/15 text-[#7B2FFF] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
                      </span>
                    </li>
                  </ol>
                </div>
              )}
            </div>
          ) : (
            /* iOS Safari Instructions */
            <div className="space-y-3">
              <p className="text-xs text-neutral-600 dark:text-neutral-300">
                No iPhone (Safari), você adiciona o Qindica à sua tela inicial sem precisar de App Store:
              </p>
              <ol className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-200">
                <li className="flex items-start gap-2.5 p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                  <div className="w-6 h-6 rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Share className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="block text-neutral-900 dark:text-white">1. Toque em Compartilhar</strong>
                    Toque no botão de compartilhar (ícone de quadrado com seta para cima) na barra inferior do Safari.
                  </div>
                </li>
                <li className="flex items-start gap-2.5 p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                  <div className="w-6 h-6 rounded-md bg-[#7B2FFF]/15 text-[#7B2FFF] dark:text-[#9D5CFF] flex items-center justify-center shrink-0 mt-0.5">
                    <PlusSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="block text-neutral-900 dark:text-white">2. Adicionar à Tela de Início</strong>
                    Role as opções para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>.
                  </div>
                </li>
                <li className="flex items-start gap-2.5 p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="block text-neutral-900 dark:text-white">3. Confirmar</strong>
                    Toque em <strong>"Adicionar"</strong> no canto superior direito. Pronto! O app aparecerá no seu celular.
                  </div>
                </li>
              </ol>
            </div>
          )}

          {/* Advantages Micro-Banner */}
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/40">
                <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                <span className="block text-[10px] font-bold text-neutral-700 dark:text-neutral-300">Ultra Leve</span>
                <span className="text-[9px] text-neutral-400">&lt; 1 MB</span>
              </div>
              <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/40">
                <Sparkles className="w-4 h-4 text-[#7B2FFF] mx-auto mb-1" />
                <span className="block text-[10px] font-bold text-neutral-700 dark:text-neutral-300">Tela Cheia</span>
                <span className="text-[9px] text-neutral-400">Sem barra de URL</span>
              </div>
              <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/40">
                <ShieldCheck className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                <span className="block text-[10px] font-bold text-neutral-700 dark:text-neutral-300">Atualizado</span>
                <span className="text-[9px] text-neutral-400">Sempre no ar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-neutral-50 dark:bg-neutral-800/40 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
          >
            Entendi, fechar
          </button>
        </div>
      </div>
    </div>
  );
};
