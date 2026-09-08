import React, { useState } from 'react';
import { 
  Palette, 
  Layers, 
  Type, 
  Star, 
  Sparkles, 
  ArrowLeft, 
  Copy, 
  Check, 
  MapPin, 
  Phone, 
  Smartphone, 
  ShieldCheck, 
  Users, 
  FileText, 
  Compass, 
  HeartHandshake,
  CheckCircle2,
  Share2,
  Sun,
  Moon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserCard } from '../components/UserCard';

interface ColorToken {
  name: string;
  variable: string;
  hex: string;
  role: string;
  textColor: string;
}

export const DesignSystemView: React.FC = () => {
  const { navigate, users, isDarkMode, toggleDarkMode } = useApp();
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'brand' | 'colors' | 'typography' | 'components' | 'voice'>('brand');

  const copyToClipboard = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const primaryColors: ColorToken[] = [
    { name: 'Brand Primary', variable: '--qindica-purple', hex: '#7B2FFF', role: 'Cor mestre da marca, botões de ação e nós centrais', textColor: '#FFFFFF' },
    { name: 'Purple Deep', variable: '--qindica-purple-deep', hex: '#6916EE', role: 'Estados de hover, gradientes e bordas de destaque', textColor: '#FFFFFF' },
    { name: 'Purple Light', variable: '--qindica-purple-light', hex: '#F4F0FF', role: 'Fundos sutis em light mode, badges e chips ativos', textColor: '#7B2FFF' },
    { name: 'Trust Gold', variable: '--qindica-gold', hex: '#F59E0B', role: 'Estrelas de indicação, reputação e destaque de mérito', textColor: '#FFFFFF' },
    { name: 'WhatsApp Green', variable: '--qindica-green', hex: '#25D366', role: 'Ação de contato direto via WhatsApp seguro', textColor: '#FFFFFF' },
  ];

  const neutralColors: ColorToken[] = [
    { name: 'Dark Canvas', variable: '--qindica-dark-bg', hex: '#0E0E11', role: 'Fundo principal no tema escuro', textColor: '#FFFFFF' },
    { name: 'Dark Surface', variable: '--qindica-dark-surface', hex: '#18181C', role: 'Cards e superfícies elevadas no tema escuro', textColor: '#FFFFFF' },
    { name: 'Dark Border', variable: '--qindica-dark-border', hex: '#2A2A32', role: 'Linhas divisórias e contornos no dark mode', textColor: '#FFFFFF' },
    { name: 'Light Canvas', variable: '--qindica-light-bg', hex: '#F4F4F6', role: 'Fundo principal no tema claro', textColor: '#0E0E11' },
    { name: 'Light Surface', variable: '--qindica-light-surface', hex: '#FFFFFF', role: 'Cards e contêineres no tema claro', textColor: '#0E0E11' },
  ];

  const sampleUser = users[0] || {
    id: 'sample',
    name: 'Ana Ribeiro',
    title: 'Diarista & Passadeira',
    bio: 'Experiência de 8 anos em apartamentos residenciais na Zona Sul. Pontualidade e capricho garantidos.',
    tags: ['Diarista', 'Passadeira', 'Organização'],
    city: 'Rio de Janeiro',
    neighborhood: 'Copacabana',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    indicationCount: 14,
    phone: '21988887777',
    whatsapp: true,
  };

  return (
    <div className="w-full min-h-screen text-neutral-900 dark:text-neutral-100 bg-white dark:bg-[#0E0E11] transition-colors duration-200 overflow-x-hidden">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0E0E11]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-8 lg:px-12 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => navigate({ name: 'landing' })}
              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition cursor-pointer shrink-0"
              title="Voltar para a Landing Page"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2 truncate">
              <span className="text-lg font-black tracking-tight shrink-0">
                <span className="text-[#7B2FFF]">Qi</span>ndica
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-[#7B2FFF]/10 text-[#7B2FFF] dark:text-[#a068ff] font-bold shrink-0">
                <span className="inline sm:hidden">BDS</span>
                <span className="hidden sm:inline">BDS · Brand & Design System</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Theme Toggle Button */}
            <button
              id="bds-theme-toggle-btn"
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
              id="bds-nav-lp-btn"
              onClick={() => navigate({ name: 'landing' })}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold sm:font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer shrink-0"
              title="Ir para a Landing Page"
            >
              <span className="inline sm:hidden">LP</span>
              <span className="hidden sm:inline">Ver Landing Page</span>
            </button>
            <button
              id="bds-nav-app-btn"
              onClick={() => navigate({ name: 'home' })}
              className="px-3 sm:px-3.5 py-1.5 rounded-lg bg-[#7B2FFF] hover:bg-[#6916EE] text-white text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95 shrink-0"
              title="Acessar o Aplicativo"
            >
              <span className="inline sm:hidden">App</span>
              <span className="hidden sm:inline">Acessar App</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section of Design System */}
      <section className="py-12 sm:py-16 px-6 sm:px-8 lg:px-12 max-w-6xl mx-auto border-b border-neutral-200 dark:border-neutral-800">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7B2FFF]/10 text-[#7B2FFF] dark:text-[#a068ff] text-xs font-bold">
            <Sparkles size={13} />
            Design Spec & Concept Document
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Identidade de marca & <span className="text-[#7B2FFF]">design system</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Uma linguagem de produto desenhada para a <strong>gig economy e o trabalho informal brasileiro</strong>. 
            Sem ruídos corporativos, com máxima clareza em celulares populares e respeitando a dinâmica orgânica de quem vive de recomendação.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2 py-1 px-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Design System & UX Spec v1.0
            </div>
            <div className="flex items-center gap-2 py-1 px-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 font-medium">
              <Smartphone size={13} className="text-[#7B2FFF]" />
              PWA First (<span className="text-emerald-600 font-bold">&lt; 1MB</span>)
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          {[
            { id: 'brand', label: '1. Conceito & Naming', icon: Compass },
            { id: 'colors', label: '2. Cores & Tokens', icon: Palette },
            { id: 'typography', label: '3. Tipografia & Escala', icon: Type },
            { id: 'components', label: '4. Componentes Chave', icon: Layers },
            { id: 'voice', label: '5. Tom de Voz', icon: HeartHandshake },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#7B2FFF] text-white shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Content Areas based on Active Tab */}
      <main className="py-12 px-6 sm:px-8 lg:px-12 max-w-6xl mx-auto space-y-16">

        {/* TAB 1: BRAND CONCEPT & STORYTELLING */}
        {activeTab === 'brand' && (
          <section className="space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#7B2FFF]">Fundamentos de Marca</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold">O Conceito do "QI" Recontextualizado</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center font-black">
                  QI
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  O "QI" do privilégio corporativo (O passado)
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  No mercado formal tradicional de escritórios, o "Quem Indica" sempre representou a antítese da meritocracia: nepotismo, vagas decididas a portas fechadas e exclusão de talentos periféricos que não frequentam certos círculos sociais.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#7B2FFF]/10 dark:bg-[#7B2FFF]/15 border-2 border-[#7B2FFF]/30 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#7B2FFF] text-white flex items-center justify-center font-black">
                  ★
                </div>
                <h3 className="text-base font-bold text-[#7B2FFF] dark:text-[#a068ff]">
                  O "Qindica" da confiança real (A solução)
                </h3>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  No trabalho autônomo e de serviços (diaristas, pedreiros, babás, eletricistas), a indicação é o inverso do nepotismo: é a <strong>garantia de segurança física e respeito mútuo</strong>. Ninguém bota um desconhecido dentro de casa para cuidar dos filhos sem a palavra de alguém de confiança.
                </p>
              </div>
            </div>

            {/* Core Product Pillars */}
            <div className="p-8 rounded-3xl bg-neutral-900 text-white space-y-6">
              <h3 className="text-xl font-bold">Os Três Pilares de UX do Qindica</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#7B2FFF] text-white flex items-center justify-center text-xs font-bold">
                    01
                  </div>
                  <h4 className="text-sm font-bold">Confiança Explícita</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Você sempre sabe <strong>quem</strong> indicou o profissional. Sem avaliações anônimas de 5 estrelas compradas em massa.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#7B2FFF] text-white flex items-center justify-center text-xs font-bold">
                    02
                  </div>
                  <h4 className="text-sm font-bold">Zero Taxa sobre o Trabalho</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Nenhum profissional paga para receber contatos. Não cobramos R$ 40 por telefone de cliente como fazem os marketplaces tradicionais.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#7B2FFF] text-white flex items-center justify-center text-xs font-bold">
                    03
                  </div>
                  <h4 className="text-sm font-bold">Leveza e Inclusão</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Funciona perfeitamente em aparelhos Android de entrada com pouca memória. Abre direto no navegador e se instala como PWA sem ocupar espaço.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: COLORS & DESIGN TOKENS */}
        {activeTab === 'colors' && (
          <section className="space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#7B2FFF]">Tokens Visuais</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold">Paleta de Cores e Semântica</h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Cores com contraste validado pela norma WCAG AA, garantindo legibilidade tanto sob o sol quanto no quarto à noite.
              </p>
            </div>

            {/* Primary Swatches */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Cores Primárias e de Destaque</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {primaryColors.map((color) => (
                  <div 
                    key={color.hex}
                    onClick={() => copyToClipboard(color.hex)}
                    className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-between gap-3 hover:border-[#7B2FFF] dark:hover:border-[#7B2FFF] transition cursor-pointer bg-white dark:bg-neutral-800/70 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div 
                        className="w-12 h-12 rounded-xl shadow-xs flex-shrink-0 border border-black/10 dark:border-white/10"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="min-w-0 space-y-1">
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">{color.name}</h4>
                        <div className="flex items-center gap-1.5">
                          <code className="text-[11px] font-mono font-bold text-[#7B2FFF] dark:text-[#a068ff] bg-[#7B2FFF]/10 dark:bg-[#7B2FFF]/20 px-1.5 py-0.5 rounded tracking-wide">
                            {color.hex}
                          </code>
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 leading-tight">{color.role}</p>
                      </div>
                    </div>
                    <div className="text-neutral-400 group-hover:text-[#7B2FFF] dark:group-hover:text-[#a068ff] transition-colors flex-shrink-0 p-1">
                      {copiedHex === color.hex ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <Check size={14} />
                          Copiado
                        </span>
                      ) : (
                        <Copy size={15} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Neutrals Swatches */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Neutros de Alta Fidelidade (Dark & Light)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {neutralColors.map((color) => (
                  <div 
                    key={color.hex}
                    onClick={() => copyToClipboard(color.hex)}
                    className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-between gap-3 hover:border-[#7B2FFF] dark:hover:border-[#7B2FFF] transition cursor-pointer bg-white dark:bg-neutral-800/70 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div 
                        className="w-12 h-12 rounded-xl shadow-xs flex-shrink-0 border border-neutral-300 dark:border-neutral-700"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="min-w-0 space-y-1">
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">{color.name}</h4>
                        <div className="flex items-center gap-1.5">
                          <code className="text-[11px] font-mono font-bold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded tracking-wide border border-neutral-200/60 dark:border-neutral-700">
                            {color.hex}
                          </code>
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 leading-tight">{color.role}</p>
                      </div>
                    </div>
                    <div className="text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200 transition-colors flex-shrink-0 p-1">
                      {copiedHex === color.hex ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <Check size={14} />
                          Copiado
                        </span>
                      ) : (
                        <Copy size={15} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: TYPOGRAPHY */}
        {activeTab === 'typography' && (
          <section className="space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#7B2FFF]">Escala Tipográfica</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold">Tipografia e Hierarquia de Leitura</h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Uso prioritário de <strong>Inter</strong> e <strong>System UI</strong> (SF Pro / Roboto / Segoe UI) para renderização instantânea com zero bytes adicionais de download.
              </p>
            </div>

            <div className="space-y-6 p-6 sm:p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700">
              
              <div className="border-b border-neutral-200 dark:border-neutral-700 pb-6">
                <span className="text-[11px] font-mono text-neutral-400 uppercase">Display Heading 1 (clamp 2rem - 3.25rem · font-black · tracking-tight)</span>
                <p className="text-3xl sm:text-4xl font-black tracking-tight mt-1 text-neutral-900 dark:text-white">
                  Onde as indicações têm um endereço
                </p>
              </div>

              <div className="border-b border-neutral-200 dark:border-neutral-700 pb-6">
                <span className="text-[11px] font-mono text-neutral-400 uppercase">Section Heading 2 (text-2xl / sm:text-3xl · font-extrabold)</span>
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-neutral-900 dark:text-white">
                  Quanto mais perto, mais confiável
                </p>
              </div>

              <div className="border-b border-neutral-200 dark:border-neutral-700 pb-6">
                <span className="text-[11px] font-mono text-neutral-400 uppercase">Card Title / Name (text-base · font-bold)</span>
                <p className="text-base font-bold mt-1 text-neutral-900 dark:text-white">
                  Ana Ribeiro · Diarista e Passadeira
                </p>
              </div>

              <div className="border-b border-neutral-200 dark:border-neutral-700 pb-6">
                <span className="text-[11px] font-mono text-neutral-400 uppercase">Body Regular (text-xs / sm:text-sm · line-height 1.6)</span>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mt-1 max-w-xl">
                  Encontre diaristas, eletricistas, babás e qualquer serviço por quem você já conhece. Sem algoritmos cobrando por lead. Não por quem pagou pra aparecer.
                </p>
              </div>

              <div>
                <span className="text-[11px] font-mono text-neutral-400 uppercase">Micro Labels & Badges (text-[11px] · font-bold · uppercase)</span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded bg-[#7B2FFF]/15 text-[#7B2FFF] text-[10px] font-extrabold">1º GRAU</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 text-[10px] font-extrabold">WHATSAPP VERIFICADO</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 text-[10px] font-extrabold">★ 14 INDICAÇÕES</span>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* TAB 4: COMPONENTS SHOWCASE */}
        {activeTab === 'components' && (
          <section className="space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#7B2FFF]">Biblioteca de Componentes</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold">Componentes Principais do App</h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Padrões reutilizáveis que compõem as telas de busca, perfil e exploração do Qindica.
              </p>
            </div>

            {/* Live UserCard Demo */}
            <div className="space-y-3">
              <div className="flex items-center justify-between max-w-[280px]">
                <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">UserCard (O Cartão)</h3>
                <span className="text-[11px] text-neutral-400">Escala real</span>
              </div>
              <div className="w-full max-w-[280px]">
                <UserCard user={sampleUser} />
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed pt-1 max-w-md">
                O UserCard resolve a trindade da contratação: <strong>Quem é</strong> (avatar e nome), <strong>O que faz</strong> (tags de serviço), <strong>Onde atende</strong> (distância em km calculada por CEP) e <strong>Quem confia</strong> (estrelas e laços mútuos).
              </p>
            </div>

            {/* Degree Badges */}
            <div className="space-y-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Selo de Grau de Confiança</h3>
              <div className="flex flex-wrap gap-4">
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#7B2FFF] text-white flex items-center justify-center font-bold text-xs">
                    1º
                  </span>
                  <div>
                    <strong className="block text-xs">1º Grau</strong>
                    <span className="text-[10px] text-neutral-400">Conexão direta</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#C4ACEE] text-[#7B2FFF] flex items-center justify-center font-bold text-xs">
                    2º
                  </span>
                  <div>
                    <strong className="block text-xs">2º Grau</strong>
                    <span className="text-[10px] text-neutral-400">Amigo do amigo</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 flex items-center justify-center font-bold text-xs">
                    3º+
                  </span>
                  <div>
                    <strong className="block text-xs">3º Grau em diante</strong>
                    <span className="text-[10px] text-neutral-400">Rede estendida</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Star Button Microinteraction */}
            <div className="space-y-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Botão de Indicação (Microinteração)</h3>
              <div className="flex items-center gap-3">
                <button className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center gap-1.5 shadow-2xs">
                  <Star size={15} fill="currentColor" />
                  <span>Indicado por você</span>
                </button>
                <button className="px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 font-semibold text-xs flex items-center gap-1.5">
                  <Star size={15} />
                  <span>Indicar profissional</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* TAB 5: VOICE & TONE */}
        {activeTab === 'voice' && (
          <section className="space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#7B2FFF]">Guia Editorial</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold">Tom de Voz e Linguagem</h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Como o Qindica escreve, fala e se posiciona em todas as interfaces.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                  Como nós falamos:
                </h3>
                <ul className="text-xs text-neutral-700 dark:text-neutral-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Direto ao ponto:</strong> "Diarista", "Pintor", "Eletricista" em vez de "Prestador de serviços residenciais generalistas".</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Humano e popular:</strong> "Onde as indicações do grupo de WhatsApp têm um endereço fixo".</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Respeitoso com o trabalhador:</strong> Gratuito de verdade, sem truques de moedas virtuais ou leilões de lead.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-red-50/70 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 space-y-3">
                <div className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center font-bold text-xs">
                  ✕
                </div>
                <h3 className="text-sm font-bold text-red-900 dark:text-red-300">
                  O que é banido do Qindica:
                </h3>
                <ul className="text-xs text-neutral-700 dark:text-neutral-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✕</span>
                    <span><strong>Jargões de startup:</strong> "Supercharge sua contratação", "Ecossistema disruptivo de gig economy", "Monetize sua rede".</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✕</span>
                    <span><strong>Letras miúdas:</strong> "Primeiro contato grátis, depois R$ 39,90 por cliente".</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✕</span>
                    <span><strong>Avaliações robóticas e genéricas:</strong> Avaliações anônimas sem contexto de quem contratou.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Live Experience CTA Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7B2FFF] dark:text-[#a068ff]">
              <Sparkles size={13} />
              <span>Do design ao produto vivo</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-neutral-900 dark:text-white">
              Experimente o Qindica na prática
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md leading-relaxed">
              Veja como os tokens visuais, os graus de confiança e os componentes do BDS ganham vida na navegação real.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate({ name: 'landing' })}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 text-xs font-bold transition shadow-2xs cursor-pointer text-center"
            >
              Ver Landing Page
            </button>
            <button
              onClick={() => navigate({ name: 'home' })}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#7B2FFF] hover:bg-[#6916EE] text-white text-xs font-bold transition shadow-2xs cursor-pointer text-center"
            >
              Acessar Aplicativo
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-8 px-6 sm:px-8 lg:px-12 border-t border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-400">
        <p>© 2026 Qindica · Brand & Design System Architecture</p>
      </footer>
    </div>
  );
};
