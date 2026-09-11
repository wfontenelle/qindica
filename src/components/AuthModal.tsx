import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2, Phone, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    openAuthModal,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    resetPassword,
    currentRoute,
    navigate,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const navigateToAppIfOnLanding = () => {
    if (currentRoute.name === 'landing' || currentRoute.name === 'auth') {
      navigate({ name: 'home' });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      await loginWithGoogle();
      navigateToAppIfOnLanding();
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMessage('Não foi possível entrar com o Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (authModalMode === 'register') {
      if (!name.trim()) {
        setErrorMessage('Por favor, informe seu nome completo.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('A senha deve conter no mínimo 6 caracteres.');
        return;
      }

      try {
        setIsLoading(true);
        await registerWithEmail(name, email, password, phone, whatsapp);
        navigateToAppIfOnLanding();
      } catch (err: any) {
        setErrorMessage(err.message || 'Erro ao realizar cadastro.');
      } finally {
        setIsLoading(false);
      }
    } else if (authModalMode === 'login') {
      try {
        setIsLoading(true);
        await loginWithEmail(email, password);
        navigateToAppIfOnLanding();
      } catch (err: any) {
        setErrorMessage('E-mail ou senha incorretos.');
      } finally {
        setIsLoading(false);
      }
    } else if (authModalMode === 'forgot') {
      if (!email.trim()) {
        setErrorMessage('Informe seu e-mail para recuperar a senha.');
        return;
      }
      try {
        setIsLoading(true);
        await resetPassword(email);
        setSuccessMessage('E-mail de recuperação enviado com sucesso!');
      } catch (err: any) {
        setErrorMessage('Não foi possível enviar o e-mail de recuperação.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        {/* Backdrop Click Dismiss */}
        <div
          className="absolute inset-0"
          onClick={closeAuthModal}
          aria-hidden="true"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-white dark:bg-[#18181C] rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-10 transition-colors"
        >
          {/* Top Banner & Close */}
          <div className="p-6 pb-4 flex items-start justify-between border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/60">
            <div className="flex items-center gap-2.5">
              <BrandLogo variant="symbol" theme="purple" size="custom" className="w-10 h-10 rounded-lg shadow-sm" />
              <div>
                <h2 className="text-lg font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
                  {authModalMode === 'login' && 'Entrar no Qindica'}
                  {authModalMode === 'register' && 'Criar Conta no Qindica'}
                  {authModalMode === 'forgot' && 'Recuperar Senha'}
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  {authModalMode === 'login' && 'Acesse sua rede de indicações'}
                  {authModalMode === 'register' && 'Seja indicado e recomende talentos'}
                  {authModalMode === 'forgot' && 'Insira seu e-mail cadastrado'}
                </p>
              </div>
            </div>

            <button
              id="close-auth-modal-btn"
              onClick={closeAuthModal}
              className="w-8 h-8 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Fechar modal"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-6">
            {/* Google Fast Sign-In */}
            {authModalMode !== 'forgot' && (
              <div className="mb-5">
                <button
                  type="button"
                  id="google-signin-btn"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-md bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 active:scale-[0.99] text-neutral-800 dark:text-neutral-100 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-xs hover:bg-neutral-50 dark:hover:bg-neutral-700/80 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>
                    {authModalMode === 'login'
                      ? 'Continuar com o Google'
                      : 'Cadastrar com o Google'}
                  </span>
                </button>

                {/* Divider */}
                <div className="relative my-4 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
                  </div>
                  <span className="relative bg-white dark:bg-[#18181C] px-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    ou com e-mail
                  </span>
                </div>
              </div>
            )}

            {/* Error & Success Alerts */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs font-semibold leading-relaxed">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              {/* Name (Only in Register mode) */}
              {authModalMode === 'register' && (
                <div>
                  <label
                    htmlFor="auth-name-input"
                    className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1"
                  >
                    Nome Completo
                  </label>
                  <div className="relative flex items-center">
                    <UserIcon
                      size={16}
                      className="absolute left-3.5 text-neutral-400 dark:text-neutral-500 pointer-events-none"
                    />
                    <input
                      id="auth-name-input"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Carlos Eduardo"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-md bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#7B2FFF] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="auth-email-input"
                  className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  E-mail
                </label>
                <div className="relative flex items-center">
                  <Mail
                    size={16}
                    className="absolute left-3.5 text-neutral-400 dark:text-neutral-500 pointer-events-none"
                  />
                  <input
                    id="auth-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-md bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#7B2FFF] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Telefone & Checkbox WhatsApp (apenas no cadastro) */}
              {authModalMode === 'register' && (
                <>
                  <div>
                    <label
                      htmlFor="auth-phone-input"
                      className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1"
                    >
                      Telefone / Celular <span className="text-neutral-400 dark:text-neutral-500 font-normal">(opcional)</span>
                    </label>
                    <div className="relative flex items-center">
                      <Phone
                        size={16}
                        className="absolute left-3.5 text-neutral-400 dark:text-neutral-500 pointer-events-none"
                      />
                      <input
                        id="auth-phone-input"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ex: (11) 98765-4321"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-md bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#7B2FFF] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div
                    onClick={() => setWhatsapp(!whatsapp)}
                    className="flex items-start gap-2.5 p-2.5 rounded-md bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200/80 dark:border-neutral-700/60 cursor-pointer hover:bg-neutral-100/70 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <input
                      id="auth-whatsapp-checkbox"
                      type="checkbox"
                      checked={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-0.5 w-4 h-4 rounded text-[#25D366] focus:ring-[#25D366] accent-[#25D366] cursor-pointer"
                    />
                    <label
                      htmlFor="auth-whatsapp-checkbox"
                      className="text-xs text-neutral-700 dark:text-neutral-300 font-medium cursor-pointer leading-tight"
                    >
                      <span className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                        <MessageCircle size={14} className="text-[#25D366]" />
                        Este número é WhatsApp
                      </span>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-0.5">
                        Permite que interessados cliquem no botão verde do seu perfil para iniciar conversa direta.
                      </span>
                    </label>
                  </div>
                </>
              )}

              {/* Password */}
              {authModalMode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="auth-password-input"
                      className="block text-xs font-bold text-neutral-700 dark:text-neutral-300"
                    >
                      Senha
                    </label>
                    {authModalMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => openAuthModal('forgot')}
                        className="text-[11px] font-bold text-[#7B2FFF] dark:text-[#a068ff] hover:underline cursor-pointer"
                      >
                        Esqueceu a senha?
                      </button>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <Lock
                      size={16}
                      className="absolute left-3.5 text-neutral-400 dark:text-neutral-500 pointer-events-none"
                    />
                    <input
                      id="auth-password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={
                        authModalMode === 'register'
                          ? 'Mínimo de 6 caracteres'
                          : 'Sua senha'
                      }
                      className="w-full pl-10 pr-10 py-2.5 rounded-md bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#7B2FFF] focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                id="auth-submit-btn"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-5 rounded-md bg-[#7B2FFF] hover:bg-[#6A23E3] active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#7B2FFF]/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {authModalMode === 'login' && 'Entrar na Conta'}
                      {authModalMode === 'register' && 'Concluir Cadastro'}
                      {authModalMode === 'forgot' && 'Enviar Link de Redefinição'}
                    </span>
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </>
                )}
              </button>

              {authModalMode === 'register' && (
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 text-center mt-2.5 px-2 leading-relaxed">
                  🔒 Seus dados têm finalidade estritamente profissional e são protegidos contra spam.
                </p>
              )}
            </form>

            {/* Bottom Switch Mode Links */}
            <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              {authModalMode === 'login' && (
                <p>
                  Ainda não tem conta?{' '}
                  <button
                    type="button"
                    onClick={() => openAuthModal('register')}
                    className="font-bold text-[#7B2FFF] dark:text-[#a068ff] hover:underline ml-1 cursor-pointer"
                  >
                    Cadastre-se grátis
                  </button>
                </p>
              )}

              {authModalMode === 'register' && (
                <p>
                  Já possui cadastro?{' '}
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="font-bold text-[#7B2FFF] dark:text-[#a068ff] hover:underline ml-1 cursor-pointer"
                  >
                    Fazer login
                  </button>
                </p>
              )}

              {authModalMode === 'forgot' && (
                <p>
                  Lembrou sua senha?{' '}
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="font-bold text-[#7B2FFF] dark:text-[#a068ff] hover:underline ml-1 cursor-pointer"
                  >
                    Voltar para o login
                  </button>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
