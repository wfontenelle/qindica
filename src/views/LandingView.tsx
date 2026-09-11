import React, { useState } from 'react';
import { 
  Star, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  Smartphone, 
  Download, 
  Share, 
  PlusSquare, 
  Zap, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  Layers, 
  Palette,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserCard } from '../components/UserCard';
import { PWAInstallModal } from '../components/PWAInstallModal';
import { BrandLogo } from '../components/BrandLogo';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const LandingView: React.FC = () => {
  const { navigate, openAuthModal, users, isDarkMode, toggleDarkMode, currentUser } = useApp();
  const { isInstallable, install, isInstalled, isIOS } = usePWAInstall();

  const [pwaModalOpen, setPwaModalOpen] = useState(false);
  const [activePwaTab, setActivePwaTab] = useState<'android' | 'ios'>(isIOS ? 'ios' : 'android');
  const [demoQuery, setDemoQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Diarista', 'Eletricista', 'Babá', 'Manicure', 'Pintor', 'Advogado'];

  // Filter preview users
  const filteredUsers = users.filter((u) => {
    const matchesCategory =
      activeCategory === 'Todos' ||
      u.tags.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase()));
    const matchesQuery =
      !demoQuery ||
      u.name.toLowerCase().includes(demoQuery.toLowerCase()) ||
      u.bio.toLowerCase().includes(demoQuery.toLowerCase()) ||
      u.tags.some((t) => t.toLowerCase().includes(demoQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  }).slice(0, 4);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full min-h-screen text-neutral-900 dark:text-neutral-100 bg-white dark:bg-[#0E0E11] transition-colors duration-200 overflow-x-hidden">
      
      {/* 1. TOP NAVIGATION */}
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0E0E11]/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 px-6 sm:px-8 lg:px-12 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div 
            onClick={() => scrollToSection('hero')}
            className="flex items-center cursor-pointer group select-none shrink-0"
            aria-label="Qindica"
          >
            <BrandLogo variant="full" theme="auto" size="custom" className="h-7 sm:h-8 w-auto" />
          </div>

          <nav className="hidden lg:flex items-center gap-4 xl:gap-5 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            <button 
              onClick={() => scrollToSection('problema')} 
              className="hover:text-[#7B2FFF] dark:hover:text-[#9D5CFF] transition-colors cursor-pointer"
            >
              Problema
            </button>
            <button 
              onClick={() => scrollToSection('como-funciona')} 
              className="hover:text-[#7B2FFF] dark:hover:text-[#9D5CFF] transition-colors cursor-pointer"
            >
              Como
            </button>
            <button 
              onClick={() => scrollToSection('graus')} 
              className="hover:text-[#7B2FFF] dark:hover:text-[#9D5CFF] transition-colors cursor-pointer"
            >
              Graus
            </button>
            <button 
              onClick={() => scrollToSection('diferenciais')} 
              className="hover:text-[#7B2FFF] dark:hover:text-[#9D5CFF] transition-colors cursor-pointer"
            >
              Diferenciais
            </button>
            <button 
              onClick={() => scrollToSection('pwa-download')} 
              className="hover:text-[#7B2FFF] dark:hover:text-[#9D5CFF] transition-colors cursor-pointer flex items-center gap-1"
            >
              <Smartphone size={13} className="text-[#7B2FFF]" />
              App
            </button>
            <button 
              onClick={() => navigate({ name: 'design-system' })} 
              className="hover:text-[#7B2FFF] dark:hover:text-[#9D5CFF] transition-colors cursor-pointer flex items-center gap-1 text-[#7B2FFF] dark:text-[#9D5CFF]"
            >
              <Palette size={13} />
              Brand
            </button>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Toggle Button */}
            <button
              id="landing-theme-toggle-btn"
              onClick={toggleDarkMode}
              className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 flex items-center justify-center transition-all cursor-pointer active:scale-95 border border-neutral-200/80 dark:border-neutral-700/80 shrink-0"
              aria-label={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
              title={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              {isDarkMode ? (
                <Sun size={15} className="text-amber-400" />
              ) : (
                <Moon size={15} className="text-neutral-600" />
              )}
            </button>

            <button
              id="landing-nav-explore-btn"
              onClick={() => navigate({ name: 'home' })}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer shrink-0"
            >
              Explorar
            </button>
            <button
              id="landing-nav-register-btn"
              onClick={() => openAuthModal('register')}
              className="px-3 sm:px-3.5 py-1.5 rounded-lg bg-[#7B2FFF] hover:bg-[#6A24E3] active:scale-95 text-white text-xs font-bold shadow-sm shadow-[#7B2FFF]/30 transition-all cursor-pointer shrink-0"
            >
              Criar Conta
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="hero" className="relative pt-8 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 px-6 sm:px-8 lg:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7B2FFF]/10 dark:bg-[#7B2FFF]/20 border border-[#7B2FFF]/20 text-[#7B2FFF] dark:text-[#a068ff] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#7B2FFF] animate-pulse" />
              Rede de indicações de confiança
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-[3.15rem] font-extrabold tracking-tight leading-[1.18]">
              Onde as indicações do grupo de WhatsApp{' '}
              <span className="text-[#7B2FFF] dark:text-[#9D5CFF]">têm um endereço</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-neutral-600 dark:text-neutral-300 max-w-xl leading-relaxed">
              Encontre diaristas, eletricistas, babás e qualquer serviço por quem você já conhece.
              Sem algoritmos cobrando por lead. Não por quem pagou pra aparecer.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
              <button
                onClick={() => openAuthModal('register')}
                className="px-6 py-3.5 rounded-xl bg-[#7B2FFF] hover:bg-[#6A24E3] text-white font-bold text-sm shadow-lg shadow-[#7B2FFF]/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <span>Criar conta grátis</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => navigate({ name: 'home' })}
                className="px-5 py-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100 font-semibold text-sm transition-all cursor-pointer text-center"
              >
                Ver profissionais na rede
              </button>

              <button
                onClick={() => scrollToSection('pwa-download')}
                className="px-4 py-3 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-[#7B2FFF] font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Smartphone size={15} />
                Baixar App (PWA)
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="pt-4 flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-6 text-xs text-neutral-500 dark:text-neutral-400 border-t border-neutral-200/60 dark:border-neutral-800/60">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                <span>100% gratuito para profissionais</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                <span>WhatsApp direto sem intermediário</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                <span>Grau de conexão transparente</span>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Connected Trust Graph Illustration */}
          <div className="lg:col-span-5 flex items-center justify-center w-full">
            <div className="relative w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-3xl bg-gradient-to-b from-[#7B2FFF]/5 via-transparent to-neutral-100/50 dark:to-neutral-900/50 border border-[#7B2FFF]/15 dark:border-neutral-800 shadow-xl">
              
              <div className="text-center mb-2 sm:mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B2FFF] dark:text-[#9D5CFF]">
                  Seu Grafo de Conexões Reais
                </span>
              </div>

              {/* Connected Network SVG with full responsive width scaling */}
              <div className="relative flex justify-center items-center py-1 sm:py-2">
                <svg viewBox="0 0 380 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[320px] sm:max-w-[360px] h-auto">
                  {/* Connection lines */}
                  <line x1="190" y1="110" x2="90" y2="200" stroke="#7B2FFF" strokeOpacity="0.4" strokeWidth="2.5" strokeDasharray="3 3" />
                  <line x1="190" y1="110" x2="290" y2="200" stroke="#7B2FFF" strokeOpacity="0.4" strokeWidth="2.5" strokeDasharray="3 3" />
                  <line x1="190" y1="110" x2="190" y2="230" stroke="#7B2FFF" strokeOpacity="0.4" strokeWidth="2.5" strokeDasharray="3 3" />
                  <line x1="90" y1="200" x2="50" y2="290" stroke="#DDD0FA" strokeWidth="1.5" />
                  <line x1="90" y1="200" x2="140" y2="295" stroke="#DDD0FA" strokeWidth="1.5" />
                  <line x1="290" y1="200" x2="245" y2="295" stroke="#DDD0FA" strokeWidth="1.5" />
                  <line x1="290" y1="200" x2="335" y2="290" stroke="#DDD0FA" strokeWidth="1.5" />
                  <line x1="190" y1="230" x2="190" y2="300" stroke="#DDD0FA" strokeWidth="1.5" />

                  {/* Central Node - Você */}
                  <circle cx="190" cy="90" r="38" fill="#7B2FFF" fillOpacity="0.15" />
                  <circle cx="190" cy="90" r="28" fill="#7B2FFF" />
                  <circle cx="190" cy="82" r="10" fill="white" opacity="0.95" />
                  <ellipse cx="190" cy="104" rx="14" ry="9" fill="white" opacity="0.95" />
                  <text x="214" y="74" fontSize="16" fill="#F59E0B">★</text>
                  <text x="172" y="136" fontSize="12" fill="#7B2FFF" fontWeight="800" fontFamily="sans-serif">Você</text>

                  {/* 1st Degree Left (Conexão Direta) */}
                  <circle cx="90" cy="200" r="26" fill="#9F6FF0" />
                  <circle cx="90" cy="193" r="8" fill="white" opacity="0.85" />
                  <ellipse cx="90" cy="212" rx="11" ry="7" fill="white" opacity="0.85" />
                  <rect x="73" y="165" width="34" height="18" rx="9" fill="#7B2FFF" />
                  <text x="83" y="178" fontSize="10" fill="white" fontWeight="800" fontFamily="sans-serif">1º</text>
                  <text x="65" y="238" fontSize="10" fill="#666" fontWeight="600" fontFamily="sans-serif">Diarista</text>

                  {/* 1st Degree Right (Conexão Direta) */}
                  <circle cx="290" cy="200" r="26" fill="#9F6FF0" />
                  <circle cx="290" cy="193" r="8" fill="white" opacity="0.85" />
                  <ellipse cx="290" cy="212" rx="11" ry="7" fill="white" opacity="0.85" />
                  <rect x="273" y="165" width="34" height="18" rx="9" fill="#7B2FFF" />
                  <text x="283" y="178" fontSize="10" fill="white" fontWeight="800" fontFamily="sans-serif">1º</text>
                  <text x="265" y="238" fontSize="10" fill="#666" fontWeight="600" fontFamily="sans-serif">Eletricista</text>

                  {/* 1st Degree Center */}
                  <circle cx="190" cy="245" r="22" fill="#9F6FF0" />
                  <circle cx="190" cy="239" r="7" fill="white" opacity="0.85" />
                  <ellipse cx="190" cy="255" rx="10" ry="6" fill="white" opacity="0.85" />

                  {/* 2nd Degree Nodes */}
                  <circle cx="50" cy="295" r="16" fill="#C4ACEE" />
                  <circle cx="140" cy="300" r="16" fill="#C4ACEE" />
                  <circle cx="245" cy="300" r="16" fill="#C4ACEE" />
                  <circle cx="335" cy="295" r="16" fill="#C4ACEE" />
                  <text x="43" y="278" fontSize="9" fill="#7B2FFF" fontWeight="700" fontFamily="sans-serif">2º</text>
                  <text x="328" y="278" fontSize="9" fill="#7B2FFF" fontWeight="700" fontFamily="sans-serif">2º</text>

                  {/* 3rd Degree Outer */}
                  <circle cx="190" cy="315" r="14" fill="#EDE8FF" stroke="#DDD0FA" strokeWidth="1.5" />
                  <text x="184" y="320" fontSize="9" fill="#7B2FFF" fontWeight="700" fontFamily="sans-serif">3º</text>
                </svg>
              </div>

              {/* Caption pill below */}
              <div className="mt-3 p-2.5 rounded-xl bg-white dark:bg-neutral-800/80 border border-neutral-200/60 dark:border-neutral-700/60 text-center">
                <p className="text-[11px] text-neutral-600 dark:text-neutral-300">
                  <strong className="text-neutral-900 dark:text-white">Quanto mais perto no grafo, mais confiável:</strong> resultados ordenados por laços reais e não por leilão de anúncios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LIVE SHOWCASE (Cards do App Trazidos para Fora) */}
      <section className="py-12 sm:py-16 px-6 sm:px-8 lg:px-12 bg-neutral-50 dark:bg-[#121216] border-y border-neutral-200/70 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#7B2FFF] dark:text-[#9D5CFF]">
                Experimente ao Vivo
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
                Profissionais reais cadastrados na rede
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Veja como a comunidade avalia, recomenda e se conecta por proximidade.
              </p>
            </div>

            {/* Quick Category Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#7B2FFF] text-white'
                      : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar simulation */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={demoQuery}
              onChange={(e) => setDemoQuery(e.target.value)}
              placeholder="Digite um serviço ou nome (ex: Diarista, Eletricista)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#7B2FFF]"
            />
          </div>

          {/* Cards Grid: 1 col on mobile for spacious layout, 2 on tablet, 4 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {filteredUsers.map((u) => (
              <UserCard key={u.id} user={u} />
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => navigate({ name: 'home' })}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-[#7B2FFF] text-xs font-bold text-[#7B2FFF] dark:text-[#a068ff] transition shadow-2xs cursor-pointer"
            >
              <span>Ver todos os {users.length} profissionais na rede completa</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. O PROBLEMA */}
      <section id="problema" className="py-14 sm:py-20 px-6 sm:px-8 lg:px-12 max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-[#7B2FFF] dark:text-[#9D5CFF]">
            O Problema
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
            "Preciso de uma diarista nova.<br />Por onde começo?"
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mt-2 italic">
            "A minha saiu. As opções de mercado são todas frustrantes."
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-8">
          {/* Opção Ruim 1 */}
          <div className="p-4 sm:p-5 rounded-xl bg-red-50/70 dark:bg-red-950/20 border border-red-200/80 dark:border-red-900/40">
            <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs mb-3">
              ✕
            </div>
            <h3 className="text-sm font-bold text-red-800 dark:text-red-300">
              Apps e Marketplaces
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
              Cobram créditos caros por lead do profissional. Qualquer um se cadastra e a plataforma se isenta se der problema.
            </p>
          </div>

          {/* Opção Ruim 2 */}
          <div className="p-4 sm:p-5 rounded-xl bg-red-50/70 dark:bg-red-950/20 border border-red-200/80 dark:border-red-900/40">
            <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs mb-3">
              ✕
            </div>
            <h3 className="text-sm font-bold text-red-800 dark:text-red-300">
              Busca no Google
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
              Estranhos completos sem contexto, sem laços mútuos e sem ninguém para responder pela reputação real.
            </p>
          </div>

          {/* Opção Ruim 3 */}
          <div className="p-4 sm:p-5 rounded-xl bg-red-50/70 dark:bg-red-950/20 border border-red-200/80 dark:border-red-900/40">
            <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs mb-3">
              ✕
            </div>
            <h3 className="text-sm font-bold text-red-800 dark:text-red-300">
              Grupo de Condomínio
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
              Caótico, sem histórico pesquisável e desorganizado. Toda semana alguém faz a mesma pergunta no WhatsApp.
            </p>
          </div>

          {/* Opção Ruim 4 */}
          <div className="p-4 sm:p-5 rounded-xl bg-red-50/70 dark:bg-red-950/20 border border-red-200/80 dark:border-red-900/40">
            <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs mb-3">
              ✕
            </div>
            <h3 className="text-sm font-bold text-red-800 dark:text-red-300">
              Pedir no Privado
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
              Funciona, mas é lento, constrangedor e nem sempre você tem a quem recorrer na hora em que o cano estoura.
            </p>
          </div>

          {/* Opção Boa: Qindica */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#7B2FFF]/10 dark:bg-[#7B2FFF]/15 border-2 border-[#7B2FFF]/40 dark:border-[#7B2FFF]/50 flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-full bg-[#7B2FFF] text-white flex items-center justify-center font-bold text-xs mb-3 shadow-xs">
                ★
              </div>
              <h3 className="text-sm font-bold text-[#7B2FFF] dark:text-[#a068ff]">
                Qindica
              </h3>
              <p className="text-xs text-neutral-700 dark:text-neutral-300 mt-1.5 leading-relaxed">
                O boca a boca que sempre funcionou — agora com estrutura, histórico, CEP e endereço fixo.
              </p>
            </div>
            <span className="inline-block mt-3 text-[10px] font-bold text-[#7B2FFF] uppercase tracking-wider">
              A resposta certa
            </span>
          </div>
        </div>
      </section>

      {/* 5. COMO FUNCIONA */}
      <section id="como-funciona" className="py-14 sm:py-20 px-6 sm:px-8 lg:px-12 bg-neutral-50 dark:bg-[#121216] border-y border-neutral-200/70 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
            <p className="text-xs font-bold uppercase tracking-wider text-[#7B2FFF] dark:text-[#9D5CFF]">
              Como Funciona
            </p>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
              Três passos e você está na rede
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              Simples, sem formulários infinitos e focado no que importa: reputação autêntica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/80 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#7B2FFF]/10 text-[#7B2FFF] flex items-center justify-center font-black text-lg">
                01
              </div>
              <h3 className="text-base sm:text-lg font-bold">Crie seu perfil em 2 min</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Cadastre-se com e-mail ou Google. Coloque suas áreas de atuação (ex: <em>Diarista</em>, <em>Eletricista</em>, <em>Manicure</em>) e seu CEP para atender clientes próximos.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/80 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#7B2FFF]/10 text-[#7B2FFF] flex items-center justify-center font-black text-lg">
                02
              </div>
              <h3 className="text-base sm:text-lg font-bold">Conecte quem você confia</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Dê uma estrela (⭐) em quem fez um bom trabalho. Cada recomendação cria um elo no grafo e faz o profissional aparecer para os amigos dos seus amigos.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/80 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#7B2FFF]/10 text-[#7B2FFF] flex items-center justify-center font-black text-lg">
                03
              </div>
              <h3 className="text-base sm:text-lg font-bold">Encontre por serviço e proximidade</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Precisa de alguém? Digite o serviço. O Qindica prioriza quem está mais perto da sua rede e a quantos quilômetros de você ele atende.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. A LÓGICA DOS GRAUS */}
      <section id="graus" className="py-14 sm:py-20 px-6 sm:px-8 lg:px-12 max-w-6xl mx-auto">
        <div className="max-w-2xl mb-8 sm:mb-10">
          <p className="text-xs font-bold uppercase tracking-wider text-[#7B2FFF] dark:text-[#9D5CFF]">
            A Lógica dos Graus
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
            Quanto mais perto, mais confiável
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-2">
            Um amigo do amigo já vale infinitamente mais que qualquer desconhecido na internet. A ordem das buscas reflete isso matematicamente.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#7B2FFF] text-white flex items-center justify-center text-sm font-extrabold mx-auto shadow-md">
              Você
            </div>
            <h4 className="text-sm font-bold">Ponto de Partida</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              O centro da sua rede. Todas as recomendações se conectam a partir de você.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#9F6FF0] text-white flex items-center justify-center text-sm font-extrabold mx-auto shadow-md">
              1º Grau
            </div>
            <h4 className="text-sm font-bold">Conexão Direta</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Profissionais que você indicou ou que te indicaram pessoalmente. Confiança máxima.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#C4ACEE] text-[#7B2FFF] dark:text-neutral-900 flex items-center justify-center text-sm font-extrabold mx-auto shadow-md">
              2º Grau
            </div>
            <h4 className="text-sm font-bold">Amigo do Amigo</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Recomendado por alguém da sua confiança. Você sabe exatamente quem botou a mão no fogo.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-white dark:bg-neutral-700 text-[#7B2FFF] dark:text-[#a068ff] border-2 border-[#7B2FFF]/30 flex items-center justify-center text-sm font-extrabold mx-auto">
              3º Grau+
            </div>
            <h4 className="text-sm font-bold">Rede Estendida</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              A comunidade mais ampla, filtrada pelas estrelas recebidas e proximidade geográfica.
            </p>
          </div>
        </div>
      </section>

      {/* 7. DIFERENCIAIS (Tabela Comparativa Responsiva) */}
      <section id="diferenciais" className="py-14 sm:py-20 px-6 sm:px-8 lg:px-12 bg-neutral-50 dark:bg-[#121216] border-y border-neutral-200/70 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-[#7B2FFF] dark:text-[#9D5CFF]">
              O Diferencial
            </p>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
              Por que o Qindica é diferente
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/80 shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="p-3.5 sm:p-4 font-semibold text-neutral-500 dark:text-neutral-400">Critério</th>
                  <th className="p-3.5 sm:p-4 font-semibold text-neutral-500 dark:text-neutral-400">Marketplaces Comuns</th>
                  <th className="p-3.5 sm:p-4 font-extrabold text-[#7B2FFF] dark:text-[#a068ff] bg-[#7B2FFF]/10 dark:bg-[#7B2FFF]/20">
                    Qindica
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700/60">
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold">Quem entra</td>
                  <td className="p-3.5 sm:p-4 text-neutral-600 dark:text-neutral-300">Qualquer um que se cadastra</td>
                  <td className="p-3.5 sm:p-4 font-bold text-[#7B2FFF] dark:text-[#a068ff] bg-[#7B2FFF]/5 dark:bg-[#7B2FFF]/10">
                    Quem é conectado por alguém da rede
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold">Responsabilidade</td>
                  <td className="p-3.5 sm:p-4 text-neutral-600 dark:text-neutral-300">Plataforma se isenta</td>
                  <td className="p-3.5 sm:p-4 font-bold text-[#7B2FFF] dark:text-[#a068ff] bg-[#7B2FFF]/5 dark:bg-[#7B2FFF]/10">
                    Quem indicou aparece com foto e nome
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold">Confiança</td>
                  <td className="p-3.5 sm:p-4 text-neutral-600 dark:text-neutral-300">Avaliações fakes ou anônimas</td>
                  <td className="p-3.5 sm:p-4 font-bold text-[#7B2FFF] dark:text-[#a068ff] bg-[#7B2FFF]/5 dark:bg-[#7B2FFF]/10">
                    Rede real de pessoas reais e verificadas
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold">Ordenação</td>
                  <td className="p-3.5 sm:p-4 text-neutral-600 dark:text-neutral-300">Quem pagou mais pelo anúncio</td>
                  <td className="p-3.5 sm:p-4 font-bold text-[#7B2FFF] dark:text-[#a068ff] bg-[#7B2FFF]/5 dark:bg-[#7B2FFF]/10">
                    Quem está mais perto da sua rede e da sua casa
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold">Custo para o Profissional</td>
                  <td className="p-3.5 sm:p-4 text-neutral-600 dark:text-neutral-300">Paga R$ 30 a R$ 60 por lead sem garantia</td>
                  <td className="p-3.5 sm:p-4 font-bold text-[#7B2FFF] dark:text-[#a068ff] bg-[#7B2FFF]/5 dark:bg-[#7B2FFF]/10">
                    100% gratuito, sem leilão e sem pedágio
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 text-center mt-2 sm:hidden">
            Arraste para o lado para ver a comparação completa →
          </p>
        </div>
      </section>

      {/* 8. GIG ECONOMY & STORYTELLING MANIFESTO */}
      <section className="py-14 sm:py-20 px-6 sm:px-8 lg:px-12 max-w-5xl mx-auto">
        <div className="p-6 sm:p-10 md:p-12 rounded-3xl bg-gradient-to-b from-[#7B2FFF]/5 via-white to-neutral-100/60 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 text-neutral-900 dark:text-white border border-[#7B2FFF]/15 dark:border-neutral-800 shadow-xl relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#7B2FFF]/10 dark:bg-[#7B2FFF]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-3xl">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-extrabold bg-[#7B2FFF] text-white uppercase tracking-wider mb-3 shadow-xs">
              A Gig Economy Real · Manifesto
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mt-3 text-neutral-900 dark:text-white">
              O "QI" corporativo sempre foi injusto.<br />
              Nós transformamos em poder para quem trabalha.
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              <p>
                No mundo corporativo tradicional, o termo <strong>"Q.I." (Quem Indica)</strong> carrega uma história amarga: vagas fechadas para amigos de chefes, processos seletivos teatrais e talentos descartados pela falta de um padrinho.
              </p>
              <p>
                Mas quando olhamos para a <strong>economia informal brasileira</strong> — as diaristas que cuidam das nossas casas, os eletricistas que consertam emergências na chuva, as babás a quem confiamos nossos filhos —, a palavra <em>indicação</em> não é privilégio: <strong>é sobrevivência e segurança mútua</strong>.
              </p>
              <p className="text-neutral-900 dark:text-white font-medium">
                O Qindica nasceu para dar a esse boca a boca a infraestrutura digital que ele merecia: sem cobrar mensalidade de quem acorda às 5h da manhã, sem algoritmos opacos e sem taxa por telefone trocado.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-neutral-200/80 dark:border-neutral-700/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#7B2FFF]/10 dark:bg-[#7B2FFF]/30 border border-[#7B2FFF]/30 dark:border-[#7B2FFF] text-[#7B2FFF] dark:text-[#a068ff] flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-900 dark:text-white">Movimento Qindica</p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Iniciativa aberta por relações de confiança sem pedágio</p>
                </div>
              </div>

              <button
                onClick={() => navigate({ name: 'design-system' })}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/20 text-neutral-800 dark:text-white text-xs font-bold border border-neutral-200 dark:border-white/20 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Palette size={14} />
                Ver Brand & Design System
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. MINI TUTORIAL DE INSTALAÇÃO PWA */}
      <section id="pwa-download" className="py-14 sm:py-20 px-6 sm:px-8 lg:px-12 bg-neutral-50 dark:bg-[#121216] border-y border-neutral-200/70 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-[#7B2FFF] dark:text-[#9D5CFF]">
              Instalação Instantânea
            </p>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
              Instale no celular em 10 segundos
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              Zero burocracia de App Store ou Play Store. Pesa menos de 1 MB, abre em tela cheia e funciona como app nativo.
            </p>
          </div>

          {/* OS Switcher & Tutorial Box */}
          <div className="p-5 sm:p-8 rounded-3xl bg-white dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 shadow-sm space-y-6">
            
            {/* Tabs */}
            <div className="flex gap-2 p-1.5 bg-neutral-100 dark:bg-neutral-900 rounded-xl max-w-sm mx-auto">
              <button
                onClick={() => setActivePwaTab('android')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  activePwaTab === 'android'
                    ? 'bg-white dark:bg-neutral-800 text-[#7B2FFF] dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <Smartphone size={14} />
                Android / Chrome
              </button>
              <button
                onClick={() => setActivePwaTab('ios')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  activePwaTab === 'ios'
                    ? 'bg-white dark:bg-neutral-800 text-[#7B2FFF] dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <Smartphone size={14} />
                iPhone / Safari
              </button>
            </div>

            {/* Android Steps */}
            {activePwaTab === 'android' ? (
              <div className="space-y-4 max-w-xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
                    <span className="w-6 h-6 rounded-full bg-[#7B2FFF]/15 text-[#7B2FFF] text-xs font-black flex items-center justify-center mb-2">
                      1
                    </span>
                    <p className="text-xs text-neutral-700 dark:text-neutral-200">
                      Toque nos <strong>três pontinhos (⋮)</strong> no canto superior do Google Chrome.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
                    <span className="w-6 h-6 rounded-full bg-[#7B2FFF]/15 text-[#7B2FFF] text-xs font-black flex items-center justify-center mb-2">
                      2
                    </span>
                    <p className="text-xs text-neutral-700 dark:text-neutral-200">
                      Escolha <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
                    </p>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={() => setPwaModalOpen(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#7B2FFF] hover:bg-[#6A24E3] text-white font-bold text-xs shadow-md shadow-[#7B2FFF]/20 inline-flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Download size={15} />
                    Instalar Agora no Celular
                  </button>
                </div>
              </div>
            ) : (
              /* iOS Safari Steps */
              <div className="space-y-4 max-w-xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
                    <div className="w-6 h-6 rounded-md bg-blue-500/15 text-blue-600 flex items-center justify-center mb-2">
                      <Share size={14} />
                    </div>
                    <strong className="block text-xs font-bold mb-1">1. Compartilhar</strong>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Toque no ícone de quadrado com seta para cima na barra inferior do Safari.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
                    <div className="w-6 h-6 rounded-md bg-[#7B2FFF]/15 text-[#7B2FFF] flex items-center justify-center mb-2">
                      <PlusSquare size={14} />
                    </div>
                    <strong className="block text-xs font-bold mb-1">2. Tela de Início</strong>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Role o menu para baixo e toque em "Adicionar à Tela de Início".
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
                    <div className="w-6 h-6 rounded-md bg-emerald-500/15 text-emerald-600 flex items-center justify-center mb-2">
                      <CheckCircle2 size={14} />
                    </div>
                    <strong className="block text-xs font-bold mb-1">3. Confirmar</strong>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Toque em "Adicionar" no topo direito. O ícone aparecerá na sua tela.
                    </p>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={() => setPwaModalOpen(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#7B2FFF] hover:bg-[#6A24E3] text-white font-bold text-xs shadow-md shadow-[#7B2FFF]/20 inline-flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Smartphone size={15} />
                    Ver Guia Ilustrado para iPhone
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 10. FRASE MARCADA */}
      <section className="py-14 sm:py-20 px-6 sm:px-8 lg:px-12 text-center max-w-4xl mx-auto">
        <blockquote className="text-lg sm:text-2xl lg:text-3xl font-medium tracking-tight text-neutral-800 dark:text-neutral-100 italic leading-relaxed [text-wrap:balance]">
          "O boca a boca é o melhor sistema de confiança que existe. O&nbsp;Qindica é a <strong className="font-extrabold text-[#7B2FFF] not-italic">infraestrutura que&nbsp;ele&nbsp;nunca&nbsp;teve</strong>."
        </blockquote>
      </section>

      {/* 11. CTA FINAL */}
      <section className="py-14 sm:py-20 px-6 sm:px-8 lg:px-12 bg-[#7B2FFF] text-white text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Sua rede já existe.<br />Agora ela trabalha pra você.
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-white/80 max-w-lg mx-auto">
            Crie seu perfil, dê estrelas para quem você confia e seja encontrado por clientes recomendados sem pagar nada.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2 max-w-sm sm:max-w-none mx-auto">
            <button
              onClick={() => openAuthModal('register')}
              className="px-8 py-3.5 sm:py-4 rounded-xl bg-white text-[#7B2FFF] hover:bg-neutral-100 font-extrabold text-sm shadow-xl transition-all cursor-pointer active:scale-95 text-center"
            >
              Criar conta grátis
            </button>
            <button
              onClick={() => navigate({ name: 'home' })}
              className="px-6 py-3.5 sm:py-4 rounded-xl bg-black/20 hover:bg-black/30 text-white font-bold text-sm border border-white/20 transition-all cursor-pointer text-center"
            >
              Acessar Aplicativo
            </button>
          </div>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="py-10 sm:py-12 px-6 sm:px-8 lg:px-12 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 whitespace-nowrap">
            <BrandLogo variant="full" theme="auto" size="custom" className="h-6 w-auto" />
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <span className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400">A rede de recomendações autênticas</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-medium">
            <button 
              onClick={() => navigate({ name: 'home' })}
              className="hover:text-neutral-900 dark:hover:text-neutral-200 transition cursor-pointer"
            >
              Explorar App
            </button>
            <button 
              onClick={() => navigate({ name: 'design-system' })}
              className="hover:text-[#7B2FFF] dark:hover:text-[#a068ff] transition font-bold cursor-pointer"
            >
              Brand & Design System
            </button>
            <button 
              onClick={() => setPwaModalOpen(true)}
              className="hover:text-neutral-900 dark:hover:text-neutral-200 transition cursor-pointer"
            >
              Instalar PWA
            </button>
            <button 
              onClick={() => scrollToSection('hero')}
              className="hover:text-neutral-900 dark:hover:text-neutral-200 transition cursor-pointer"
            >
              Voltar ao topo ↑
            </button>
          </div>

          <p className="text-[11px] text-neutral-400 text-center md:text-right whitespace-nowrap">
            © 2026 Qindica · Todos os direitos reservados
          </p>
        </div>
      </footer>

      {/* PWA Modal */}
      <PWAInstallModal
        isOpen={pwaModalOpen}
        onClose={() => setPwaModalOpen(false)}
      />
    </div>
  );
};
