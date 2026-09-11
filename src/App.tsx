import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopBar } from './components/TopBar';
import { ToastContainer } from './components/Toast';
import { AuthModal } from './components/AuthModal';
import { PrivacyModal } from './components/PrivacyModal';
import { HomeView } from './views/HomeView';
import { SearchView } from './views/SearchView';
import { ProfileView } from './views/ProfileView';
import { EditProfileView } from './views/EditProfileView';
import { ShareProfileView } from './views/ShareProfileView';
import { AuthView } from './views/AuthView';
import { LandingView } from './views/LandingView';
import { DesignSystemView } from './views/DesignSystemView';
import { SplashScreen } from './components/SplashScreen';
import { BrandLogo } from './components/BrandLogo';
import { AnimatePresence, motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

const MainNavigator: React.FC = () => {
  const { currentRoute, getUserById, isAuthLoading, navigate } = useApp();
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  React.useEffect(() => {
    if (!isAuthLoading) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isAuthLoading]);

  const renderCurrentView = () => {
    switch (currentRoute.name) {
      case 'landing':
        return <LandingView />;
      case 'design-system':
        return <DesignSystemView />;
      case 'home':
        return <HomeView />;
      case 'search':
        return <SearchView initialQuery={currentRoute.initialQuery} />;
      case 'profile':
        return <ProfileView userId={currentRoute.userId} />;
      case 'profile-me':
        return <ProfileView isMe />;
      case 'edit':
        return <EditProfileView />;
      case 'share':
        return (
          <ShareProfileView
            userId={currentRoute.userId}
            initialTab={currentRoute.initialTab}
          />
        );
      case 'auth':
        return <AuthView initialMode={currentRoute.mode} />;
      default:
        return <HomeView />;
    }
  };

  const isSpecialView = currentRoute.name === 'landing' || currentRoute.name === 'design-system';
  const isSubRoute = currentRoute.name !== 'home';

  let titleOverride: string | undefined;
  if (currentRoute.name === 'profile') {
    const u = getUserById(currentRoute.userId);
    if (u) {
      titleOverride = u.name.split(' ')[0];
    }
  } else if (currentRoute.name === 'profile-me') {
    titleOverride = 'Meu Perfil';
  } else if (currentRoute.name === 'edit') {
    titleOverride = 'Editar Perfil';
  } else if (currentRoute.name === 'share') {
    titleOverride = currentRoute.initialTab === 'profile' ? 'Compartilhar Perfil' : 'Convidar Amigos';
  } else if (currentRoute.name === 'search') {
    titleOverride = 'Buscar';
  } else if (currentRoute.name === 'auth') {
    titleOverride = 'Entrar / Cadastrar';
  } else if (currentRoute.name === 'landing') {
    titleOverride = 'Sobre o Qindica';
  } else if (currentRoute.name === 'design-system') {
    titleOverride = 'Brand & Design System';
  }

  return (
    <div className="min-h-screen bg-[#F4F4F6] dark:bg-[#0E0E11] text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors duration-200">
      {/* Responsive Global TopBar (hidden on full-bleed Landing & Design System views which have their own nav) */}
      {!isSpecialView && (
        <TopBar showBack={isSubRoute} titleOverride={titleOverride} />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col ${isSpecialView ? 'w-full' : 'w-full max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-3 sm:py-6'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={
              currentRoute.name === 'profile'
                ? `profile-${currentRoute.userId}`
                : currentRoute.name
            }
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="flex-1 flex flex-col"
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Discreet Trust & Privacy Footer (only for main app view) */}
      {!isSpecialView && (
        <footer className="w-full max-w-6xl mx-auto px-4 py-6 mt-auto border-t border-neutral-200/60 dark:border-neutral-800/60 text-center flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400 dark:text-neutral-500">
          <div className="flex flex-wrap items-center justify-center gap-2 font-medium">
            <BrandLogo variant="full" theme="auto" size="custom" className="h-5 w-auto" />
            <span>•</span>
            <button
              onClick={() => navigate({ name: 'landing' })}
              className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors cursor-pointer"
            >
              Sobre o Qindica (Landing)
            </button>
            <span>•</span>
            <button
              onClick={() => navigate({ name: 'design-system' })}
              className="hover:text-[#7B2FFF] dark:hover:text-[#a068ff] transition-colors cursor-pointer font-semibold"
            >
              Brand & Design System
            </button>
          </div>
          <button
            onClick={() => setIsPrivacyModalOpen(true)}
            className="inline-flex items-center gap-1.5 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors cursor-pointer"
          >
            <ShieldCheck size={13} className="text-emerald-500" />
            <span className="underline underline-offset-2">Privacidade & Proteção de Dados (LGPD)</span>
          </button>
        </footer>
      )}

      {/* Auth Modal (Popup anywhere in the app) */}
      <AuthModal />

      {/* Privacy & LGPD Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Animated App Splash Screen */}
      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainNavigator />
    </AppProvider>
  );
}
