import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AuthMode } from '../types';
import { BrandLogo } from '../components/BrandLogo';

interface AuthViewProps {
  initialMode?: AuthMode;
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'login' }) => {
  const {
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    resetPassword,
    navigate,
  } = useApp();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      await loginWithGoogle();
      navigate({ name: 'home' });
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

    if (mode === 'register') {
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
        await registerWithEmail(name, email, password);
        navigate({ name: 'home' });
      } catch (err: any) {
        setErrorMessage(err.message || 'Erro ao realizar cadastro.');
      } finally {
        setIsLoading(false);
      }
    } else if (mode === 'login') {
      try {
        setIsLoading(true);
        await loginWithEmail(email, password);
        navigate({ name: 'home' });
      } catch (err: any) {
        setErrorMessage('E-mail ou senha incorretos.');
      } finally {
        setIsLoading(false);
      }
    } else if (mode === 'forgot') {
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
    <div className="flex flex-col min-h-full pb-10 justify-center items-center">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch my-auto">
        {/* Left Side: Brand Promo / Trust network explainer */}
        <div className="md:col-span-5 bg-[#7B2FFF] text-white rounded-xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-xl bg-white p-2.5 shadow-md mb-5 flex items-center justify-center">
              <BrandLogo variant="symbol" theme="light" size="custom" className="w-full h-full" />
            </div>
            <BrandLogo variant="full" theme="purple" size="custom" className="h-8 w-auto mb-3" />
            <p className="text-sm text-purple-100 mt-2 leading-relaxed">
              A rede de confiança onde profissionais autênticos são indicados e reconhecidos por quem realmente conhece o seu trabalho.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-xs px-3.5 py-2.5 rounded-md border border-white/10">
                <Star size={16} className="text-amber-300 fill-amber-300 shrink-0" />
                <span className="text-xs font-semibold">Indicações e avaliações reais</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-xs px-3.5 py-2.5 rounded-md border border-white/10">
                <ShieldCheck size={16} className="text-white shrink-0" />
                <span className="text-xs font-semibold">Reputação e Ranks transparentes</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-white/15 text-xs text-purple-200">
            Crie seu perfil profissional em menos de 1 minuto.
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="md:col-span-7 bg-white dark:bg-[#18181C] rounded-xl p-6 sm:p-8 shadow-xs border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-center transition-colors">
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              {mode === 'login' && 'Entrar na sua conta'}
              {mode === 'register' && 'Criar sua conta no Qindica'}
              {mode === 'forgot' && 'Recuperar sua senha'}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {mode === 'login' && 'Acesse seus contatos, indicações e perfil.'}
              {mode === 'register' && 'Cadastre-se para recomendar e receber indicações.'}
              {mode === 'forgot' && 'Enviaremos as instruções de recuperação para seu e-mail.'}
            </p>
          </div>

          {/* Google Button */}
          {mode !== 'forgot' && (
            <div className="mb-5">
              <button
                type="button"
                id="auth-view-google-btn"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-md bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 active:scale-[0.99] text-neutral-800 dark:text-neutral-100 font-bold text-sm flex items-center justify-center gap-3 shadow-xs hover:bg-neutral-50 dark:hover:bg-neutral-700/80 transition-all disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                <span>Continuar com o Google</span>
              </button>

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

          {/* Error & Success Messages */}
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <div>
                <label
                  htmlFor="auth-view-name"
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
                    id="auth-view-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-md bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#7B2FFF] focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="auth-view-email"
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
                  id="auth-view-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-md bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#7B2FFF] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="auth-view-password"
                    className="block text-xs font-bold text-neutral-700 dark:text-neutral-300"
                  >
                    Senha
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs font-bold text-[#7B2FFF] dark:text-[#a068ff] hover:underline cursor-pointer"
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
                    id="auth-view-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      mode === 'register'
                        ? 'Mínimo de 6 caracteres'
                        : 'Sua senha'
                    }
                    className="w-full pl-10 pr-10 py-2.5 rounded-md bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#7B2FFF] focus:border-transparent transition-all"
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

            <button
              type="submit"
              id="auth-view-submit-btn"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-5 rounded-md bg-[#7B2FFF] hover:bg-[#6A23E3] active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#7B2FFF]/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Entrar na Conta'}
                    {mode === 'register' && 'Cadastrar Agora'}
                    {mode === 'forgot' && 'Enviar E-mail de Recuperação'}
                  </span>
                  <ArrowRight size={16} strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium">
            {mode === 'login' && (
              <p>
                Ainda não tem conta no Qindica?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-[#7B2FFF] dark:text-[#a068ff] hover:underline ml-1 cursor-pointer"
                >
                  Cadastre-se gratuitamente
                </button>
              </p>
            )}

            {mode === 'register' && (
              <p>
                Já possui conta?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-[#7B2FFF] dark:text-[#a068ff] hover:underline ml-1 cursor-pointer"
                >
                  Fazer login
                </button>
              </p>
            )}

            {mode === 'forgot' && (
              <p>
                Lembrou sua senha?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-[#7B2FFF] dark:text-[#a068ff] hover:underline ml-1 cursor-pointer"
                >
                  Voltar para login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
