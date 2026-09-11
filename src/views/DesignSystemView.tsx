import React, { useState } from 'react';
import { 
  Palette, 
  Layers, 
  Type, 
  Star, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
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
  Moon,
  MessageCircle,
  Award,
  Search,
  Lock,
  Briefcase,
  Calendar,
  BadgeCheck,
  ExternalLink,
  Code2,
  Info,
  Link as LinkIcon,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserCard } from '../components/UserCard';
import { BrandLogo } from '../components/BrandLogo';

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
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const [copiedLogoCode, setCopiedLogoCode] = useState<boolean>(false);
  const [logoVariant, setLogoVariant] = useState<'full' | 'symbol'>('full');
  const [logoTheme, setLogoTheme] = useState<'purple' | 'light' | 'dark'>('purple');
  const [logoSize, setLogoSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [logoTagline, setLogoTagline] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'brand' | 'colors' | 'typography' | 'icons' | 'components' | 'voice'>('brand');

  const tabs = [
    { id: 'brand' as const, num: '1', label: 'Logotipo & Marca', shortLabel: 'Logotipo', icon: Sparkles },
    { id: 'colors' as const, num: '2', label: 'Cores & Tokens', shortLabel: 'Cores', icon: Palette },
    { id: 'typography' as const, num: '3', label: 'Tipografia & Escala', shortLabel: 'Tipografia', icon: Type },
    { id: 'icons' as const, num: '4', label: 'Iconografia (Lucide)', shortLabel: 'Ícones Lucide', icon: Compass },
    { id: 'components' as const, num: '5', label: 'Componentes Chave', shortLabel: 'Componentes', icon: Layers },
    { id: 'voice' as const, num: '6', label: 'Tom de Voz', shortLabel: 'Tom de Voz', icon: HeartHandshake },
  ];

  const currentTabIndex = tabs.findIndex((t) => t.id === activeTab);
  const prevTab = currentTabIndex > 0 ? tabs[currentTabIndex - 1] : null;
  const nextTab = currentTabIndex < tabs.length - 1 ? tabs[currentTabIndex + 1] : null;

  const scrollToContent = () => {
    const el = document.getElementById('design-system-content');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const copyIconCode = (name: string) => {
    navigator.clipboard?.writeText(`import { ${name} } from 'lucide-react';`);
    setCopiedIcon(name);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  const iconCategories = [
    {
      category: 'Reputação & Mérito',
      description: 'Indicadores de confiança, estrelas e reconhecimento autêntico',
      icons: [
        { name: 'Star', component: Star, usage: 'Contagem real de indicações recebidas', fill: true, color: 'text-amber-500 fill-amber-500' },
        { name: 'Award', component: Award, usage: 'Distintivo de destaque ou recomendação especial', color: 'text-[#7B2FFF]' },
        { name: 'Sparkles', component: Sparkles, usage: 'Novidade, destaques e primeiros passos', color: 'text-purple-500' },
        { name: 'CheckCircle2', component: CheckCircle2, usage: 'Status atestado e verificação de perfil', color: 'text-emerald-500' },
        { name: 'BadgeCheck', component: BadgeCheck, usage: 'Selo de perfil verificado por clientes', color: 'text-[#7B2FFF]' },
      ],
    },
    {
      category: 'Rede & Confiança',
      description: 'Conexões sociais, laços de vizinhança e segurança',
      icons: [
        { name: 'Share2', component: Share2, usage: 'Compartilhamento de perfil no WhatsApp e rede', color: 'text-[#7B2FFF]' },
        { name: 'Users', component: Users, usage: 'Comunidade, rede de contatos e conexões mútuas', color: 'text-blue-500' },
        { name: 'ShieldCheck', component: ShieldCheck, usage: 'Segurança garantida e anti-fraude', color: 'text-emerald-500' },
        { name: 'Link', component: LinkIcon, usage: 'Link direto do perfil profissional', color: 'text-neutral-500' },
      ],
    },
    {
      category: 'Contato & Ação Direta',
      description: 'Comunicação sem intermediários ou taxas por telefone',
      icons: [
        { name: 'MessageCircle', component: MessageCircle, usage: 'Ação primária de conversa via WhatsApp', color: 'text-emerald-500' },
        { name: 'Phone', component: Phone, usage: 'Ligação direta e dados de contato', color: 'text-blue-500' },
        { name: 'ExternalLink', component: ExternalLink, usage: 'Abertura externa de links e conversas', color: 'text-neutral-500' },
      ],
    },
    {
      category: 'Profissional & Localização',
      description: 'Atributos do autônomo, especialidades e proximidade',
      icons: [
        { name: 'MapPin', component: MapPin, usage: 'Bairro, cidade e cálculo de distância em km', color: 'text-red-500' },
        { name: 'Briefcase', component: Briefcase, usage: 'Serviços prestados e categoria de trabalho', color: 'text-neutral-600 dark:text-neutral-300' },
        { name: 'Calendar', component: Calendar, usage: 'Dias de atendimento e disponibilidade na agenda', color: 'text-neutral-600 dark:text-neutral-300' },
        { name: 'FileText', component: FileText, usage: 'Apresentação detalhada e manifesto do profissional', color: 'text-neutral-600 dark:text-neutral-300' },
      ],
    },
    {
      category: 'Navegação & Sistema',
      description: 'Fluxo de uso, buscas e configurações de acessibilidade',
      icons: [
        { name: 'Search', component: Search, usage: 'Campo de pesquisa de serviços e profissionais', color: 'text-neutral-500' },
        { name: 'ArrowLeft', component: ArrowLeft, usage: 'Voltar de tela ou cancelar fluxo', color: 'text-neutral-500' },
        { name: 'ArrowRight', component: ArrowRight, usage: 'Avançar no cadastro ou fluxo de indicação', color: 'text-[#7B2FFF]' },
        { name: 'Sun', component: Sun, usage: 'Modo claro (alto contraste diurno)', color: 'text-amber-500' },
        { name: 'Moon', component: Moon, usage: 'Modo escuro (conforto visual noturno)', color: 'text-indigo-400' },
      ],
    },
  ];

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
            <div className="flex items-center gap-2.5 truncate">
              <button
                onClick={() => navigate({ name: 'landing' })}
                className="cursor-pointer hover:opacity-90 transition-opacity flex items-center shrink-0"
                title="Ir para o início"
              >
                <BrandLogo variant="full" theme={isDarkMode ? 'dark' : 'light'} size="sm" />
              </button>
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

        {/* Tab Switcher - Grid Responsivo sem Rolagem Oculta */}
        <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Capítulos do Design System
            </span>
            <span className="text-xs font-mono font-bold text-[#7B2FFF] dark:text-[#a068ff]">
              Capítulo {currentTabIndex + 1} de {tabs.length}
            </span>
          </div>

          {/* Grid de 6 abas: 2 colunas no mobile pequeno, 3 no tablet e 6 no desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    scrollToContent();
                  }}
                  className={`min-h-[52px] p-2.5 sm:p-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer text-left relative ${
                    isActive
                      ? 'bg-[#7B2FFF] text-white shadow-md shadow-[#7B2FFF]/20 ring-2 ring-[#7B2FFF]/40 scale-[1.02]'
                      : 'bg-neutral-100 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200/70 dark:border-neutral-700/60'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-neutral-200/80 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0 flex-1 leading-tight">
                    <span className="block text-[10px] font-mono opacity-75">Cap. {tab.num}</span>
                    <span className="block truncate font-bold text-[11px] sm:text-xs">{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Areas based on Active Tab */}
      <main id="design-system-content" className="py-12 px-6 sm:px-8 lg:px-12 max-w-6xl mx-auto space-y-16">

        {/* TAB 1: LOGO & BRAND IDENTITY */}
        {activeTab === 'brand' && (
          <section className="space-y-12">
            {/* Tab Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7B2FFF]/10 text-[#7B2FFF] dark:text-[#a068ff] text-xs font-bold">
                <Sparkles size={13} />
                Identidade Visual & Logomarca
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold">Logotipo, Símbolo & Identidade Visual</h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
                O ecossistema visual do Qindica funde as letras <strong>Q</strong> e <strong>i</strong> coroando a assinatura com a <strong>estrela dourada (#FFA800)</strong>, símbolo da recomendação de mérito e confiança mútua.
              </p>
            </div>

            {/* Interactive Logo Playground */}
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#7B2FFF]" />
                    Playground Interativo do Componente &lt;BrandLogo /&gt;
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Alterne variantes, temas, tamanhos e tags para testar a renderização em tempo real.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const code = `<BrandLogo variant="${logoVariant}" theme="${logoTheme}" size="${logoSize}" ${logoVariant === 'full' && !logoTagline ? 'showTagline={false}' : ''} />`;
                      navigator.clipboard?.writeText(code);
                      setCopiedLogoCode(true);
                      setTimeout(() => setCopiedLogoCode(false), 2000);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-200/80 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition cursor-pointer active:scale-95"
                  >
                    {copiedLogoCode ? <Check size={13} className="text-emerald-500" /> : <Code2 size={13} />}
                    <span>{copiedLogoCode ? 'Código Copiado!' : 'Copiar JSX'}</span>
                  </button>
                </div>
              </div>

              {/* Controls bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-xs">
                {/* Variant */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Variante</label>
                  <div className="flex rounded-lg bg-neutral-100 dark:bg-neutral-800 p-0.5">
                    <button
                      onClick={() => setLogoVariant('full')}
                      className={`flex-1 py-1 px-2 rounded-md font-bold transition text-center cursor-pointer ${
                        logoVariant === 'full' ? 'bg-white dark:bg-neutral-700 text-[#7B2FFF] shadow-xs' : 'text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      Completa
                    </button>
                    <button
                      onClick={() => setLogoVariant('symbol')}
                      className={`flex-1 py-1 px-2 rounded-md font-bold transition text-center cursor-pointer ${
                        logoVariant === 'symbol' ? 'bg-white dark:bg-neutral-700 text-[#7B2FFF] shadow-xs' : 'text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      Símbolo Qi
                    </button>
                  </div>
                </div>

                {/* Theme */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Tema</label>
                  <div className="flex rounded-lg bg-neutral-100 dark:bg-neutral-800 p-0.5">
                    <button
                      onClick={() => setLogoTheme('purple')}
                      className={`flex-1 py-1 px-1.5 rounded-md font-bold transition text-center cursor-pointer ${
                        logoTheme === 'purple' ? 'bg-[#7B2FFF] text-white shadow-xs' : 'text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      Roxo
                    </button>
                    <button
                      onClick={() => setLogoTheme('light')}
                      className={`flex-1 py-1 px-1.5 rounded-md font-bold transition text-center cursor-pointer ${
                        logoTheme === 'light' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs' : 'text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      Claro
                    </button>
                    <button
                      onClick={() => setLogoTheme('dark')}
                      className={`flex-1 py-1 px-1.5 rounded-md font-bold transition text-center cursor-pointer ${
                        logoTheme === 'dark' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      Escuro
                    </button>
                  </div>
                </div>

                {/* Size */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Escala (Size)</label>
                  <div className="grid grid-cols-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 p-0.5 text-center">
                    {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setLogoSize(s)}
                        className={`py-1 rounded-md font-bold uppercase transition cursor-pointer ${
                          logoSize === s ? 'bg-white dark:bg-neutral-700 text-[#7B2FFF] shadow-xs' : 'text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tagline toggle */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Assinatura</label>
                  <button
                    onClick={() => setLogoTagline(!logoTagline)}
                    disabled={logoVariant === 'symbol'}
                    className={`w-full py-1.5 px-2.5 rounded-lg font-bold transition text-center cursor-pointer border ${
                      logoVariant === 'symbol'
                        ? 'opacity-40 cursor-not-allowed border-neutral-200 dark:border-neutral-800 text-neutral-400'
                        : logoTagline
                        ? 'bg-[#7B2FFF]/10 border-[#7B2FFF]/40 text-[#7B2FFF] dark:text-[#a068ff]'
                        : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {logoTagline ? 'Com Tagline' : 'Sem Tagline'}
                  </button>
                </div>
              </div>

              {/* Stage Preview Box */}
              <div
                className={`min-h-[180px] sm:min-h-[220px] rounded-2xl flex flex-col items-center justify-center p-8 transition-colors border ${
                  logoTheme === 'purple'
                    ? 'bg-[#7B2FFF] border-[#6916EE] text-white'
                    : logoTheme === 'dark'
                    ? 'bg-[#0F0F12] border-neutral-800 text-white'
                    : 'bg-white border-neutral-200 text-neutral-900 shadow-inner'
                }`}
              >
                <div className="p-4 rounded-xl transition-transform duration-200">
                  <BrandLogo
                    variant={logoVariant}
                    theme={logoTheme}
                    size={logoSize}
                    showTagline={logoTagline}
                  />
                </div>

                <div className="mt-4 flex items-center gap-3 text-[11px] font-mono opacity-80">
                  <span>variant="{logoVariant}"</span>
                  <span>·</span>
                  <span>theme="{logoTheme}"</span>
                  <span>·</span>
                  <span>size="{logoSize}"</span>
                  {logoVariant === 'full' && (
                    <>
                      <span>·</span>
                      <span>showTagline={String(logoTagline)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Official SVG Asset Cards */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#7B2FFF]" />
                    Kit Oficial de Arquivos Vetoriais (.SVG)
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Arquivos vetorizados oficiais com margem de segurança ajustada (22% de respiro no símbolo) prontos para download.
                  </p>
                </div>
              </div>

              {/* Grid of the 6 official SVG variants */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: 'PurpleBgFull.svg',
                    title: 'Versão Completa · Fundo Roxo',
                    desc: 'Uso em banners institucionais, apresentações e cartões de destaque.',
                    file: '/logos/PurpleBgFull.svg',
                    bg: 'bg-[#7B2FFF]',
                    type: 'full' as const,
                    theme: 'purple' as const,
                  },
                  {
                    name: 'WhiteBgFull.svg',
                    title: 'Versão Completa · Fundo Claro',
                    desc: 'Padrão principal para cabeçalhos, documentos claros e posts com fundo branco.',
                    file: '/logos/WhiteBgFull.svg',
                    bg: 'bg-white border-b border-neutral-200',
                    type: 'full' as const,
                    theme: 'light' as const,
                  },
                  {
                    name: 'BlackBgFull.svg',
                    title: 'Versão Completa · Fundo Escuro',
                    desc: 'Versão de alto contraste para interfaces dark mode, displays OLED e fundos escuros.',
                    file: '/logos/BlackBgFull.svg',
                    bg: 'bg-[#0F0F12]',
                    type: 'full' as const,
                    theme: 'dark' as const,
                  },
                  {
                    name: 'PurpleBgSymbol.svg',
                    title: 'Símbolo Qi · Fundo Roxo',
                    desc: 'Ícone de aplicativo, avatar de redes sociais e favicon oficial com margem segura.',
                    file: '/logos/PurpleBgSymbol.svg',
                    bg: 'bg-[#7B2FFF]',
                    type: 'symbol' as const,
                    theme: 'purple' as const,
                  },
                  {
                    name: 'WhiteBgSymbol.svg',
                    title: 'Símbolo Qi · Fundo Claro',
                    desc: 'Símbolo compacto para layouts de navegação claros e botões pequenos.',
                    file: '/logos/WhiteBgSymbol.svg',
                    bg: 'bg-white border-b border-neutral-200',
                    type: 'symbol' as const,
                    theme: 'light' as const,
                  },
                  {
                    name: 'BlackBgSymbol.svg',
                    title: 'Símbolo Qi · Fundo Escuro',
                    desc: 'Símbolo compacto sobre fundo escuro/preto para barras e rodapés escuros.',
                    file: '/logos/BlackBgSymbol.svg',
                    bg: 'bg-[#0F0F12]',
                    type: 'symbol' as const,
                    theme: 'dark' as const,
                  },
                ].map((asset) => (
                  <div
                    key={asset.name}
                    className="flex flex-col rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs hover:border-[#7B2FFF]/60 hover:shadow-md transition-all"
                  >
                    {/* Visual Preview Box using BrandLogo component to ensure instant rendering */}
                    <div className={`h-40 ${asset.bg} flex items-center justify-center p-6 relative select-none`}>
                      {asset.type === 'symbol' ? (
                        <div className="w-16 h-16 flex items-center justify-center">
                          <BrandLogo variant="symbol" theme={asset.theme} size="custom" className="w-full h-full" />
                        </div>
                      ) : (
                        <div className="max-w-[85%] flex items-center justify-center">
                          <BrandLogo variant="full" theme={asset.theme} size="lg" />
                        </div>
                      )}
                      <span className="absolute top-2.5 right-2.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/40 text-white backdrop-blur-xs">
                        SVG VETORIAL
                      </span>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <p className="text-xs font-mono font-bold text-[#7B2FFF] dark:text-[#a068ff] truncate">
                          {asset.name}
                        </p>
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5">
                          {asset.title}
                        </h4>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-normal">
                          {asset.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                        <a
                          href={asset.file}
                          download={asset.name}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#7B2FFF] hover:bg-[#6820df] text-white text-xs font-bold active:scale-95 transition-all shadow-xs cursor-pointer"
                        >
                          <Download size={13} />
                          <span>Baixar SVG</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(asset.file);
                            setCopiedIcon(asset.name);
                            setTimeout(() => setCopiedIcon(null), 2000);
                          }}
                          className="px-2.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-medium active:scale-95 transition-colors cursor-pointer"
                          title="Copiar caminho do arquivo"
                        >
                          {copiedIcon === asset.name ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safe Margin (Clear Space) & Geometry Specs */}
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 text-white space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#7B2FFF]" />
                    Área de Proteção & Margem de Respiro (22%)
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Especificações técnicas para garantir que o símbolo nunca encoste nas bordas nem seja cortado por máscaras do Android ou iOS.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Visual diagram */}
                <div className="p-6 rounded-2xl bg-black/40 border border-neutral-800 flex items-center justify-center">
                  <div className="relative w-44 h-44 rounded-3xl bg-[#7B2FFF] flex items-center justify-center border-2 border-dashed border-white/40">
                    <div className="absolute inset-4 rounded-2xl border border-dotted border-white/60 pointer-events-none flex items-center justify-center">
                      <span className="absolute -top-2.5 bg-neutral-900 px-1 text-[9px] font-mono text-white/80">
                        Safe Zone (22% Margem)
                      </span>
                    </div>
                    <div className="w-24 h-24 flex items-center justify-center">
                      <BrandLogo variant="symbol" theme="purple" size="custom" className="w-full h-full" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-neutral-300">
                  <h4 className="text-sm font-bold text-white">Regras de Aplicação do Símbolo</h4>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>
                      <strong>Margem Interna de Respiro:</strong> O glifo do Qi ocupa 70% da caixa delimitadora, reservando 15% a 22% de margem livre em todos os lados.
                    </li>
                    <li>
                      <strong>Compatibilidade com Ícones Mobile:</strong> Em ícones redondos do Android e esquilos (squircles) do iOS, os 4 cantos da caixa podem ser cortados pelo sistema sem atingir a estrela ou a cauda do Q.
                    </li>
                    <li>
                      <strong>Tamanhos Mínimos:</strong> Para telas digitais, o símbolo não deve ser aplicado em tamanho menor que <strong>24x24px</strong>. A logo completa deve ter no mínimo <strong>110px de largura</strong>.
                    </li>
                    <li>
                      <strong>Cores Proibidas:</strong> Nunca altere a cor da estrela para tons frios (azul, verde); a estrela deve ser sempre dourada (<code className="text-amber-400">#FFA800</code>) ou branca quando sobre fundos de contraste absoluto.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Storytelling & Foundations: O Conceito do QI */}
            <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[#7B2FFF]">Fundamentos de Marca</p>
                <h3 className="text-xl sm:text-2xl font-extrabold">O Conceito do "QI" Recontextualizado</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center font-black">
                    QI
                  </div>
                  <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                    O "QI" do privilégio corporativo (O passado)
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    No mercado formal tradicional de escritórios, o "Quem Indica" sempre representou a antítese da meritocracia: nepotismo, vagas decididas a portas fechadas e exclusão de talentos periféricos que não frequentam certos círculos sociais.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#7B2FFF]/10 dark:bg-[#7B2FFF]/15 border-2 border-[#7B2FFF]/30 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#7B2FFF] text-white flex items-center justify-center font-black">
                    ★
                  </div>
                  <h4 className="text-base font-bold text-[#7B2FFF] dark:text-[#a068ff]">
                    O "Qindica" da confiança real (A solução)
                  </h4>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    No trabalho autônomo e de serviços (diaristas, pedreiros, babás, eletricistas), a indicação é o inverso do nepotismo: é a <strong>garantia de segurança física e respeito mútuo</strong>. Ninguém bota um desconhecido dentro de casa para cuidar dos filhos sem a palavra de alguém de confiança.
                  </p>
                </div>
              </div>

              {/* Core Product Pillars */}
              <div className="p-8 rounded-3xl bg-neutral-900 text-white space-y-6 mt-6">
                <h4 className="text-xl font-bold">Os Três Pilares de UX do Qindica</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-[#7B2FFF] text-white flex items-center justify-center text-xs font-bold">
                      01
                    </div>
                    <h5 className="text-sm font-bold">Confiança Explícita</h5>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Você sempre sabe <strong>quem</strong> indicou o profissional. Sem avaliações anônimas de 5 estrelas compradas em massa.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-[#7B2FFF] text-white flex items-center justify-center text-xs font-bold">
                      02
                    </div>
                    <h5 className="text-sm font-bold">Zero Taxa sobre o Trabalho</h5>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Nenhum profissional paga para receber contatos. Não cobramos R$ 40 por telefone de cliente como fazem os marketplaces tradicionais.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-[#7B2FFF] text-white flex items-center justify-center text-xs font-bold">
                      03
                    </div>
                    <h5 className="text-sm font-bold">Leveza e Inclusão</h5>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Funciona perfeitamente em aparelhos Android de entrada com pouca memória. Abre direto no navegador e se instala como PWA sem ocupar espaço.
                    </p>
                  </div>
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

        {/* TAB 4: ICONOGRAPHY (LUCIDE ICONS) */}
        {activeTab === 'icons' && (
          <section className="space-y-10">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#7B2FFF]">Iconografia & Glifos</p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-2xl sm:text-3xl font-extrabold">Biblioteca Oficial: Lucide Icons</h2>
                <div className="flex items-center gap-2">
                  <a
                    href="https://lucide.dev/icons"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition border border-neutral-200 dark:border-neutral-700"
                  >
                    lucide.dev <ExternalLink size={12} />
                  </a>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#7B2FFF]/10 text-[#7B2FFF] dark:text-[#a068ff]">
                    Plugin Figma: Lucide Icons
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-3xl">
                O Qindica padroniza 100% dos seus ícones através da biblioteca <strong>lucide-react</strong>. Todos os glifos compartilham a mesma métrica geométrica, cantos arredondados e traço consistente, garantindo unidade entre o produto web, o PWA e as peças visuais de Instagram/Figma.
              </p>
            </div>

            {/* Spec Rules / Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#7B2FFF]/15 text-[#7B2FFF] flex items-center justify-center font-bold text-xs">
                  24px
                </div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Grid & Geometria Base</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Desenhados sobre matriz óptica de 24×24px. As curvas usam terminação suave (<code className="text-[10px] bg-neutral-200 dark:bg-neutral-700 px-1 py-0.5 rounded">round</code>) para harmonizar com os cantos <code className="text-[10px] bg-neutral-200 dark:bg-neutral-700 px-1 py-0.5 rounded">rounded-2xl</code> do app.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#7B2FFF]/15 text-[#7B2FFF] flex items-center justify-center font-bold text-xs">
                  2px
                </div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Espessura do Traço (Stroke)</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Padrão absoluto de <code className="text-[10px] bg-neutral-200 dark:bg-neutral-700 px-1 py-0.5 rounded">strokeWidth=&#123;2&#125;</code>. Mantém alta legibilidade mesmo em telas AMOLED ou LCDs populares sob forte iluminação solar.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold text-xs">
                  ★
                </div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Outline vs. Solid Fill</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Ícones de interface são predominantemente lineares (outline). A única exceção com preenchimento pleno sólido é a <strong>Estrela de Mérito</strong> (<code className="text-[10px] bg-neutral-200 dark:bg-neutral-700 px-1 py-0.5 rounded">fill-amber-500</code>).
                </p>
              </div>
            </div>

            {/* Sizing Scale Showcase */}
            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Escala Semântica de Tamanhos na Interface</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-neutral-500">14px (Micro / Badge)</span>
                    <span className="text-[10px] bg-neutral-100 dark:bg-neutral-700 px-1.5 py-0.5 rounded font-mono">size=14</span>
                  </div>
                  <div className="h-12 flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-bold">
                      <Star size={14} className="fill-amber-500 text-amber-500" />
                      14 indicações
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-tight">Chips, tags de 1º grau, contadores numéricos e status de conexão.</p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-neutral-500">18px (Botões / Ações)</span>
                    <span className="text-[10px] bg-neutral-100 dark:bg-neutral-700 px-1.5 py-0.5 rounded font-mono">size=18</span>
                  </div>
                  <div className="h-12 flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                      <MessageCircle size={18} />
                      WhatsApp
                    </button>
                    <button className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300">
                      <Share2 size={18} />
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-tight">Botões primários, campos de formulário, navegação e botões de cabeçalho.</p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-neutral-500">24px (Seção / Destaque)</span>
                    <span className="text-[10px] bg-neutral-100 dark:bg-neutral-700 px-1.5 py-0.5 rounded font-mono">size=24</span>
                  </div>
                  <div className="h-12 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#7B2FFF]/15 text-[#7B2FFF] flex items-center justify-center">
                      <ShieldCheck size={24} />
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center">
                      <Users size={24} />
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-tight">Cabeçalhos de módulos, cards informativos e seções explicativas.</p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-neutral-500">32px (Hero / Feedback)</span>
                    <span className="text-[10px] bg-neutral-100 dark:bg-neutral-700 px-1.5 py-0.5 rounded font-mono">size=32</span>
                  </div>
                  <div className="h-12 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-purple-500/15 text-[#7B2FFF] flex items-center justify-center">
                      <Sparkles size={32} />
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                      <CheckCircle2 size={32} />
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-tight">Telas de boas-vindas, celebração de nova estrela recebida e onboarding.</p>
                </div>
              </div>
            </div>

            {/* Categorized Icon Catalog */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">Catálogo Semântico de Ícones do Qindica</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Clique em qualquer ícone para copiar o comando de importação oficial para React.</p>
                </div>
                {copiedIcon && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold animate-fade-in">
                    <Check size={14} />
                    Copiado: import &#123; {copiedIcon} &#125; from 'lucide-react';
                  </span>
                )}
              </div>

              <div className="space-y-6">
                {iconCategories.map((group) => (
                  <div key={group.category} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#7B2FFF]">{group.category}</h4>
                      <span className="text-xs text-neutral-400">· {group.description}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {group.icons.map((item) => {
                        const IconComponent = item.component;
                        return (
                          <div
                            key={item.name}
                            onClick={() => copyIconCode(item.name)}
                            className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/70 hover:border-[#7B2FFF] dark:hover:border-[#7B2FFF] transition-all cursor-pointer flex items-center justify-between gap-3 group active:scale-98"
                            title={`Clique para copiar import { ${item.name} } from 'lucide-react'`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-700/60 flex items-center justify-center shrink-0 ${item.color}`}>
                                <IconComponent size={20} className={item.fill ? 'fill-current' : ''} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-[#7B2FFF] transition-colors">{item.name}</span>
                                  <code className="text-[10px] text-neutral-400 font-mono">lucide</code>
                                </div>
                                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 leading-tight">{item.usage}</p>
                              </div>
                            </div>

                            <div className="text-neutral-300 group-hover:text-[#7B2FFF] dark:text-neutral-600 dark:group-hover:text-[#a068ff] transition-colors shrink-0">
                              {copiedIcon === item.name ? (
                                <Check size={16} className="text-emerald-500" />
                              ) : (
                                <Copy size={16} />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Figma & Social Media Integration Tip */}
            <div className="p-5 rounded-2xl bg-[#7B2FFF]/5 dark:bg-[#7B2FFF]/10 border border-[#7B2FFF]/20 flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-[#7B2FFF] text-white flex items-center justify-center shrink-0">
                <Code2 size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Uso no Figma, Claude Design e Posts de Instagram</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Para criar criativos de Instagram e designs no Figma com os mesmos ícones: instale o plugin <strong>"Lucide Icons"</strong> no Figma. Ele permite buscar qualquer um dos nomes acima e inseri-los já vetorizados em SVG com 24×24px e traço de 2px, mantendo fidelidade estrita entre a interface do app e sua comunicação nas redes sociais.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* TAB 5: COMPONENTS SHOWCASE */}
        {activeTab === 'components' && (
          <section className="space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#7B2FFF]">Biblioteca de Componentes</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold">Componentes Principais do App</h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Padrões reutilizáveis que compõem as telas de busca, perfil e exploração do Qindica.
              </p>
            </div>

            {/* Component 1: BrandLogo */}
            <div className="space-y-4 p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-[#7B2FFF]" />
                    BrandLogo (Assinatura Oficial da Marca)
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Componente React oficial para exibição responsiva da logo completa ou símbolo isolado.
                  </p>
                </div>
                <code className="text-[11px] font-mono font-bold text-[#7B2FFF] bg-[#7B2FFF]/10 px-2 py-1 rounded">
                  &lt;BrandLogo /&gt;
                </code>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center gap-3">
                  <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase">Variant: Full · Light</span>
                  <BrandLogo variant="full" theme="light" size="md" />
                </div>
                <div className="p-4 rounded-xl bg-[#7B2FFF] text-white flex flex-col items-center justify-center gap-3 shadow-md shadow-[#7B2FFF]/20">
                  <span className="text-[10px] font-mono text-white/70 font-bold uppercase">Variant: Full · Purple</span>
                  <BrandLogo variant="full" theme="purple" size="md" />
                </div>
                <div className="p-4 rounded-xl bg-[#0F0F12] text-white flex flex-col items-center justify-center gap-3">
                  <span className="text-[10px] font-mono text-white/70 font-bold uppercase">Variant: Symbol · Dark</span>
                  <div className="w-12 h-12 flex items-center justify-center">
                    <BrandLogo variant="symbol" theme="dark" size="custom" className="w-full h-full" />
                  </div>
                </div>
              </div>
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

        {/* Chapter Pagination Navigator */}
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {prevTab ? (
            <button
              onClick={() => {
                setActiveTab(prevTab.id);
                scrollToContent();
              }}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl text-xs font-bold border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-[#7B2FFF] dark:hover:border-[#7B2FFF] text-neutral-700 dark:text-neutral-200 transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Capítulo anterior: <strong className="text-neutral-900 dark:text-white">{prevTab.num}. {prevTab.label}</strong></span>
            </button>
          ) : <div />}

          {nextTab && (
            <button
              onClick={() => {
                setActiveTab(nextTab.id);
                scrollToContent();
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-bold bg-[#7B2FFF] hover:bg-[#6916EE] text-white transition flex items-center justify-center gap-2 shadow-xs cursor-pointer ml-auto group"
            >
              <span>Próximo capítulo: <strong>{nextTab.num}. {nextTab.label}</strong></span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

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
