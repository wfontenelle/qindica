import React, { useState, useRef, useEffect } from 'react';
import {
  User as UserIcon,
  Search,
  ArrowLeft,
  Home,
  Share2,
  Sparkles,
  LogIn,
  LogOut,
  UserCheck,
  Edit3,
  ChevronDown,
  Sun,
  Moon,
  ArrowRight,
  X,
  UserPlus,
  Star,
  Download,
  Smartphone,
  Palette,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PWAInstallModal } from './PWAInstallModal';

interface TopBarProps {
  showBack?: boolean;
  titleOverride?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ showBack, titleOverride }) => {
  const {
    navigate,
    goBack,
    currentRoute,
    currentUser,
    indications,
    isAuthenticated,
    openAuthModal,
    logout,
    isDarkMode,
    toggleDarkMode,
  } = useApp();

  const [navSearch, setNavSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isHome = currentRoute.name === 'home';
  const isProfileMe = currentRoute.name === 'profile-me';
  const isSearch = currentRoute.name === 'search';
  const isShare = currentRoute.name === 'share';

  const myIndicationsCount = indications.filter(
    (i) => i.fromUserId === currentUser.id
  ).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDesktopSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate({ name: 'search', initialQuery: navSearch.trim() });
      setNavSearch('');
    } else {
      navigate({ name: 'search' });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#121216]/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800 transition-colors shadow-xs">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Left Section: Back button or Brand Logo */}
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              id="topbar-back-btn"
              onClick={goBack}
              className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
              aria-label="Voltar"
            >
              <ArrowLeft size={18} strokeWidth={2.4} />
            </button>
          )}

          {/* Logo */}
          <button
            id="topbar-brand-btn"
            onClick={() => navigate({ name: 'home' })}
            className="flex items-center gap-2 focus:outline-none group active:scale-98 transition-transform cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#7B2FFF] flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:bg-[#6A23E3] transition-colors">
              Q
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-neutral-900 dark:text-white leading-none">
                Qi<span className="text-[#7B2FFF]">ndica</span>
              </span>
              <span className="hidden md:inline text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 leading-none mt-0.5">
                Rede de Indicações
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Global Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <form onSubmit={handleDesktopSearch} className="relative flex items-center">
            <Search
              size={15}
              className="absolute left-3.5 text-neutral-400 dark:text-neutral-500 pointer-events-none"
            />
            <input
              id="topbar-desktop-search"
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Buscar pessoas, áreas, tags..."
              className="w-full bg-neutral-100/80 dark:bg-neutral-800/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:bg-white dark:focus:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 pl-10 pr-14 py-2 rounded-lg text-xs font-medium border border-transparent focus:border-[#7B2FFF] focus:ring-2 focus:ring-[#7B2FFF]/20 focus:outline-none transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {navSearch && (
                <button
                  type="button"
                  id="topbar-search-clear-btn"
                  onClick={() => setNavSearch('')}
                  className="w-5 h-5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Limpar busca"
                  title="Limpar"
                >
                  <X size={11} strokeWidth={2.5} />
                </button>
              )}
              <button
                type="submit"
                id="topbar-search-submit-btn"
                className="w-6 h-6 rounded bg-[#7B2FFF] hover:bg-[#6A23E3] text-white flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer"
                aria-label="Confirmar busca"
                title="Buscar"
              >
                <ArrowRight size={12} strokeWidth={2.5} />
              </button>
            </div>
          </form>
        </div>

        {/* Mobile Center Title if on sub-route */}
        {titleOverride && (
          <div className="md:hidden flex-1 text-center truncate px-2">
            <h1 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
              {titleOverride}
            </h1>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {isAuthenticated && (
            <div className="hidden lg:flex items-center mr-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#7B2FFF]/10 text-[#7B2FFF] dark:bg-[#7B2FFF]/20 dark:text-[#a068ff]">
                <Sparkles size={11} />
                {myIndicationsCount} indicados
              </span>
            </div>
          )}

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            <button
              id="desktop-nav-home"
              onClick={() => navigate({ name: 'home' })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isHome
                  ? 'bg-[#7B2FFF] text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Home size={14} strokeWidth={2.4} />
              <span>Início</span>
            </button>

            <button
              id="desktop-nav-search"
              onClick={() => navigate({ name: 'search' })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isSearch
                  ? 'bg-[#7B2FFF] text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Search size={14} strokeWidth={2.4} />
              <span>Buscar</span>
            </button>

            {isAuthenticated && (
              <>
                <button
                  id="desktop-nav-invite"
                  onClick={() => navigate({ name: 'share', initialTab: 'invite' })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isShare && currentRoute.initialTab === 'invite'
                      ? 'bg-[#7B2FFF] text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <UserPlus size={14} strokeWidth={2.4} />
                  <span>Convidar</span>
                </button>

                <button
                  id="desktop-nav-share"
                  onClick={() => navigate({ name: 'share', initialTab: 'profile' })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isShare && currentRoute.initialTab === 'profile'
                      ? 'bg-[#7B2FFF] text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Share2 size={14} strokeWidth={2.4} />
                  <span>Compartilhar</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Search Button */}
          <button
            id="topbar-search-btn"
            onClick={() => navigate({ name: 'search' })}
            className={`md:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              isSearch
                ? 'bg-[#7B2FFF] text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
            aria-label="Buscar pessoas"
          >
            <Search size={17} strokeWidth={2.4} />
          </button>

          {/* Install App Button */}
          <button
            id="topbar-install-pwa-btn"
            onClick={() => setIsInstallModalOpen(true)}
            className="h-9 px-2.5 rounded-lg bg-[#7B2FFF]/10 dark:bg-[#7B2FFF]/20 hover:bg-[#7B2FFF]/15 dark:hover:bg-[#7B2FFF]/30 text-[#7B2FFF] dark:text-[#a068ff] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 border border-[#7B2FFF]/30 shadow-2xs text-xs font-bold"
            aria-label="Instalar Aplicativo"
            title="Instalar Qindica no celular ou computador"
          >
            <Download size={15} strokeWidth={2.4} />
            <span className="hidden sm:inline text-[11px]">Instalar App</span>
          </button>

          {/* Dark Mode Toggle Button (Accessible always) */}
          <button
            id="theme-toggle-btn"
            onClick={toggleDarkMode}
            className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 flex items-center justify-center transition-all cursor-pointer active:scale-95 border border-neutral-200/60 dark:border-neutral-700/60 shadow-2xs"
            aria-label={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
            title={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {isDarkMode ? (
              <Sun size={17} className="text-amber-400 fill-amber-400/20" strokeWidth={2.2} />
            ) : (
              <Moon size={16} className="text-neutral-700" strokeWidth={2.2} />
            )}
          </button>

          {/* Auth Section: Logged In vs Logged Out */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => navigate({ name: 'landing' })}
                className="hidden md:inline-flex px-2.5 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-[#7B2FFF] dark:hover:text-[#a068ff] transition-colors cursor-pointer"
              >
                Sobre o App
              </button>
              <button
                id="topbar-login-btn"
                onClick={() => openAuthModal('login')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Entrar
              </button>
              <button
                id="topbar-signup-btn"
                onClick={() => openAuthModal('register')}
                className="px-3.5 py-1.5 rounded-lg bg-[#7B2FFF] hover:bg-[#6A23E3] text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <LogIn size={13} strokeWidth={2.5} />
                <span>Cadastrar</span>
              </button>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                id="topbar-user-menu-btn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-lg transition-all border cursor-pointer ${
                  isDropdownOpen || isProfileMe
                    ? 'bg-[#7B2FFF]/10 border-[#7B2FFF] text-[#7B2FFF]'
                    : 'bg-white dark:bg-[#18181C] border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/80'
                }`}
                aria-label="Menu do Usuário"
              >
                <div className="w-7 h-7 rounded-md overflow-hidden bg-neutral-200 dark:bg-neutral-700 shrink-0 ring-1 ring-[#7B2FFF]/20">
                  <img
                    src={currentUser.photo}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          currentUser.name
                        )}&background=7B2FFF&color=fff&size=100`;
                    }}
                  />
                </div>
                <span className="hidden sm:inline text-xs font-bold truncate max-w-[90px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown size={14} className="text-neutral-400 dark:text-neutral-500" />
              </button>

              {/* User Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#18181C] rounded-xl shadow-xl border border-neutral-200/80 dark:border-neutral-800 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                    <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">
                      {currentUser.email || currentUser.bio}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold">
                      ⭐ {currentUser.indicationCount} {currentUser.indicationCount === 1 ? 'indicação' : 'indicações'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate({ name: 'profile-me' });
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <UserCheck size={15} className="text-[#7B2FFF]" />
                    <span>Ver meu perfil</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate({ name: 'edit' });
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Edit3 size={15} className="text-neutral-500" />
                    <span>Editar dados do perfil</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate({ name: 'share', initialTab: 'invite' });
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <UserPlus size={15} className="text-amber-500" />
                      <span>Convidar para a rede</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      +1 ⭐
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate({ name: 'share', initialTab: 'profile' });
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Share2 size={15} className="text-neutral-500" />
                    <span>Compartilhar perfil</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsInstallModalOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone size={15} className="text-[#7B2FFF]" />
                      <span>Instalar no celular</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#7B2FFF] bg-[#7B2FFF]/10 px-1.5 py-0.5 rounded">
                      PWA
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      toggleDarkMode();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {isDarkMode ? (
                        <Sun size={15} className="text-amber-400" />
                      ) : (
                        <Moon size={15} className="text-neutral-500" />
                      )}
                      <span>Modo Escuro</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500">
                      {isDarkMode ? 'Ligado' : 'Desligado'}
                    </span>
                  </button>

                  <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate({ name: 'landing' });
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Sparkles size={15} className="text-[#7B2FFF]" />
                    <span>Sobre / Landing Page</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate({ name: 'design-system' });
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Palette size={15} className="text-[#7B2FFF]" />
                    <span>Brand & Design System</span>
                  </button>

                  <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut size={15} />
                    <span>Sair da conta</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* PWA Installation and Tutorial Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </header>
  );
};
