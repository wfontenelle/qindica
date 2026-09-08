import React, { useState, useMemo, useEffect } from 'react';
import { UserCard } from '../components/UserCard';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowDownUp, Users, Star, Network, LogIn, MapPin, Navigation, Loader2, Check, Edit2, X, UserPlus, Palette } from 'lucide-react';
import { sortUsersByCriterion, SortOption } from '../utils/networkGraph';
import { formatCep, cleanCep } from '../utils/geo';

export const HomeView: React.FC = () => {
  const {
    users,
    currentUser,
    indications,
    networkStats,
    isAuthenticated,
    openAuthModal,
    userLocation,
    setUserCep,
    requestGpsLocation,
    showToast,
    activeInviter,
    dismissInviterBanner,
    navigate,
  } = useApp();

  const [selectedDegreeFilter, setSelectedDegreeFilter] = useState<'all' | '1' | '2' | '3' | '4' | '5'>('all');
  const [sortOption, setSortOption] = useState<SortOption>(
    isAuthenticated ? 'network_degree' : 'proximity'
  );

  // Quick CEP editing state on the home bar
  const [isEditingCep, setIsEditingCep] = useState(false);
  const [tempCep, setTempCep] = useState(userLocation?.cep || currentUser.cep || '');
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [isSubmittingCep, setIsSubmittingCep] = useState(false);

  // When user logs in or out, automatically enforce default sorting:
  // Logged in: Conexão -> Proximidade -> Estrelas ('network_degree')
  // Logged out: Proximidade -> Estrelas ('proximity')
  useEffect(() => {
    if (isAuthenticated) {
      setSortOption('network_degree');
    } else {
      setSortOption('proximity');
    }
  }, [isAuthenticated]);

  // Determine active reference location (User's registered profile location or guest session location)
  const referenceLocation = useMemo(() => {
    if (isAuthenticated && currentUser.latitude != null && currentUser.longitude != null) {
      return {
        latitude: currentUser.latitude,
        longitude: currentUser.longitude,
        city: currentUser.city,
        state: currentUser.state,
        neighborhood: currentUser.neighborhood,
        cep: currentUser.cep,
      };
    }
    return userLocation;
  }, [
    isAuthenticated,
    currentUser.latitude,
    currentUser.longitude,
    currentUser.city,
    currentUser.state,
    currentUser.neighborhood,
    currentUser.cep,
    userLocation,
  ]);

  const handleApplyCep = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = cleanCep(tempCep);
    if (clean.length !== 8) {
      showToast('Digite um CEP válido com 8 números');
      return;
    }
    setIsSubmittingCep(true);
    const success = await setUserCep(clean);
    setIsSubmittingCep(false);
    if (success) {
      setIsEditingCep(false);
      showToast('Localização atualizada! Ordenação por proximidade aplicada.');
    } else {
      showToast('CEP não encontrado. Verifique o número digitado.');
    }
  };

  const handleApplyGps = async () => {
    setIsLocatingGps(true);
    const success = await requestGpsLocation();
    setIsLocatingGps(false);
    if (success) {
      setIsEditingCep(false);
      showToast('GPS ativo! Ordenando pela sua localização exata.');
    } else {
      showToast('Permissão de GPS negada ou indisponível.');
    }
  };

  const myIndicationsCount = indications.filter(
    (i) => i.fromUserId === currentUser.id
  ).length;

  // Degree counts calculated from the live network graph starting from currentUser (only when logged in)
  const counts = useMemo(() => {
    if (!isAuthenticated) return { d1: 0, d2: 0, d3: 0, d4: 0, d5: 0 };
    const degMap = { d1: 0, d2: 0, d3: 0, d4: 0, d5: 0 };
    networkStats.forEach((stats, userId) => {
      if (userId === currentUser.id) return;
      if (stats.degree === 1) degMap.d1++;
      else if (stats.degree === 2) degMap.d2++;
      else if (stats.degree === 3) degMap.d3++;
      else if (stats.degree === 4) degMap.d4++;
      else if (stats.degree === 5) degMap.d5++;
    });
    return degMap;
  }, [networkStats, isAuthenticated, currentUser.id]);

  // Filter by degree only if logged in
  const degreeFilteredUsers = useMemo(() => {
    // When authenticated, do not show currentUser in the browse grid
    const candidateUsers = isAuthenticated
      ? users.filter((u) => u.id !== currentUser.id)
      : users;

    if (!isAuthenticated || selectedDegreeFilter === 'all') return candidateUsers;
    const targetDeg = Number(selectedDegreeFilter);
    return candidateUsers.filter((u) => {
      const stats = networkStats.get(u.id);
      return stats?.degree === targetDeg;
    });
  }, [users, currentUser.id, networkStats, selectedDegreeFilter, isAuthenticated]);

  // Then sort according to chosen criterion with referenceLocation passed!
  const sortedUsers = useMemo(() => {
    const effectiveSort = (!isAuthenticated && sortOption === 'network_degree') ? 'proximity' : sortOption;
    return sortUsersByCriterion(degreeFilteredUsers, networkStats, effectiveSort, referenceLocation);
  }, [degreeFilteredUsers, networkStats, sortOption, isAuthenticated, referenceLocation]);

  return (
    <div className="flex flex-col min-h-full pb-10">
      {/* Welcome Invite Banner when accessed through ?invite=userId or ?ref=share */}
      {activeInviter && (
        <div className="bg-gradient-to-r from-[#7B2FFF]/10 via-purple-500/10 to-indigo-500/10 dark:from-[#7B2FFF]/20 dark:via-purple-950/30 dark:to-indigo-950/20 rounded-xl p-4 sm:p-5 border border-[#7B2FFF]/30 mb-4 sm:mb-5 shadow-xs relative transition-all">
          <button
            type="button"
            onClick={dismissInviterBanner}
            className="absolute top-3 right-3 p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
            title="Fechar aviso"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 pr-6">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-xs ring-2 ring-[#7B2FFF]/30 bg-neutral-100 dark:bg-neutral-800">
                <img
                  src={activeInviter.photo}
                  alt={activeInviter.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-neutral-900 dark:text-white">
                  🎉 Você foi convidado(a) por <strong>{activeInviter.name}</strong> para fazer parte do Qindica!
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Star size={10} className="fill-amber-400 text-amber-500" />
                  +1 Estrela no cadastro
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed">
                Cadastre-se na rede para conectar-se diretamente em <strong>1º grau</strong> com {activeInviter.name.split(' ')[0]} e conceder <strong>+1 estrela de indicação</strong> para fortalecer a reputação dele(a)!
              </p>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0 mt-2 sm:mt-0">
              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-[#7B2FFF] hover:bg-[#6A23E3] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  Criar conta grátis
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate({ name: 'profile', userId: activeInviter.id })}
                className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
              >
                Ver perfil de {activeInviter.name.split(' ')[0]}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discovery Banner for Guest Users */}
      {!isAuthenticated && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500/10 via-[#7B2FFF]/10 to-indigo-500/10 dark:from-purple-950/30 dark:via-[#7B2FFF]/20 dark:to-indigo-950/30 border border-[#7B2FFF]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7B2FFF]/15 text-[#7B2FFF] flex items-center justify-center shrink-0">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-900 dark:text-white">
                Como o Qindica revoluciona a indicação profissional?
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Lógica humana de 5 graus de confiança, sem algoritmos opacos de leilão ou taxas abusivas.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate({ name: 'landing' })}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              Conhecer a Proposta
            </button>
            <button
              id="home-brand-system-btn"
              onClick={() => navigate({ name: 'design-system' })}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold text-[#7B2FFF] dark:text-[#a068ff] bg-[#7B2FFF]/10 dark:bg-[#7B2FFF]/20 hover:bg-[#7B2FFF]/15 dark:hover:bg-[#7B2FFF]/30 border border-[#7B2FFF]/30 shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <Palette size={13} strokeWidth={2.4} />
              <span>Brand System</span>
            </button>
          </div>
        </div>
      )}

      {/* Header Banner Section */}
      <div className="bg-white dark:bg-[#18181C] rounded-xl p-4 sm:p-5 shadow-xs border border-neutral-200/80 dark:border-neutral-800 mb-4 sm:mb-5 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                {isAuthenticated ? 'Quem você indica?' : 'Profissionais recomendados'}
              </h2>
              {isAuthenticated && (
                <span className="inline-flex md:hidden items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#7B2FFF]/10 dark:bg-[#7B2FFF]/20 text-[#7B2FFF] dark:text-[#a068ff]">
                  <Sparkles size={12} />
                  {myIndicationsCount} indicados
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-medium leading-relaxed max-w-xl">
              {isAuthenticated ? (
                <>
                  A estrela (⭐) é o elo de conexão da sua rede de confiança. Seus indicados formam seu <strong>1º</strong>, as indicações deles o <strong>2º</strong>, <strong>3º</strong>, <strong>4º</strong> e <strong>5º</strong>, propagando a reputação de forma escalonada.
                </>
              ) : (
                <>
                  Descubra profissionais recomendados ordenados por <strong>proximidade geográfica</strong> e <strong>estrelas</strong>. Entre na sua conta para conectar sua rede de indicações em 1º e 2º grau.
                </>
              )}
            </p>
          </div>

          {/* Desktop Stats summary & Quick CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            <div className="bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200/80 dark:border-neutral-700/60 rounded-lg px-3 py-2 text-center transition-colors">
              <span className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Profissionais</span>
              <span className="text-sm font-extrabold text-neutral-900 dark:text-white flex items-center justify-center gap-1">
                <Users size={14} className="text-[#7B2FFF]" />
                {isAuthenticated ? users.filter((u) => u.id !== currentUser.id).length : users.length}
              </span>
            </div>

            {isAuthenticated && (
              <div className="bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200/80 dark:border-neutral-700/60 rounded-lg px-3 py-2 text-center transition-colors">
                <span className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Suas indicações</span>
                <span className="text-sm font-extrabold text-[#7B2FFF] dark:text-[#a068ff] flex items-center justify-center gap-1">
                  <Star size={14} className="fill-[#7B2FFF] dark:fill-[#a068ff]" />
                  {myIndicationsCount}
                </span>
              </div>
            )}

            {/* Quick Invite Button */}
            <button
              id="home-invite-cta-btn"
              type="button"
              onClick={() => navigate({ name: 'share', initialTab: 'invite' })}
              className="bg-[#7B2FFF]/10 hover:bg-[#7B2FFF]/20 dark:bg-[#7B2FFF]/20 dark:hover:bg-[#7B2FFF]/30 border border-[#7B2FFF]/30 rounded-lg px-3 py-2 text-center transition-all cursor-pointer group"
              title="Convidar alguém para fazer parte da rede e ganhar +1 estrela no cadastro"
            >
              <span className="block text-[10px] font-bold text-[#7B2FFF] dark:text-[#a068ff] uppercase tracking-wider flex items-center justify-center gap-1">
                <Star size={10} className="fill-[#7B2FFF] dark:fill-[#a068ff]" /> +1 Estrela
              </span>
              <span className="text-xs font-bold text-[#7B2FFF] dark:text-[#a068ff] flex items-center justify-center gap-1 mt-0.5">
                <UserPlus size={13} />
                Convidar amigos
              </span>
            </button>

            {!isAuthenticated && (
              <button
                id="home-banner-login-btn"
                onClick={() => openAuthModal('login')}
                className="bg-[#7B2FFF] hover:bg-[#6A23E3] text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <LogIn size={14} />
                <span>Entrar</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Quick Invite Bar */}
        <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex md:hidden items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
            <Star size={12} className="fill-amber-400 text-amber-500 shrink-0" />
            <span className="truncate">Ganhe +1 estrela por amigo cadastrado</span>
          </div>
          <button
            type="button"
            onClick={() => navigate({ name: 'share', initialTab: 'invite' })}
            className="px-2.5 py-1.5 rounded-lg bg-[#7B2FFF] text-white text-xs font-bold flex items-center gap-1 shrink-0 shadow-xs active:scale-95 cursor-pointer"
          >
            <UserPlus size={12} />
            <span>Convidar</span>
          </button>
        </div>
      </div>

      {/* Geolocation & Reference CEP Bar */}
      <div className="mb-3 px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#18181C] border border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs transition-colors shadow-2xs">
        <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
          <MapPin size={15} className="text-[#7B2FFF] shrink-0" />
          <div className="leading-tight">
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-semibold uppercase tracking-wider block">
              Localização de referência:
            </span>
            <span className="font-bold text-neutral-900 dark:text-white">
              {referenceLocation?.neighborhood ? `${referenceLocation.neighborhood}, ` : ''}
              {referenceLocation?.city || 'São Paulo'} - {referenceLocation?.state || 'SP'}
              {referenceLocation?.cep ? ` (${formatCep(referenceLocation.cep)})` : ''}
            </span>
          </div>
        </div>

        {/* Action button or inline form */}
        {!isEditingCep ? (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setTempCep(referenceLocation?.cep || '');
                setIsEditingCep(true);
              }}
              className="px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200/80 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 text-[11px] font-semibold text-neutral-700 dark:text-neutral-200 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Edit2 size={11} />
              <span>Alterar CEP</span>
            </button>
            <button
              type="button"
              onClick={handleApplyGps}
              disabled={isLocatingGps}
              className="px-2.5 py-1 rounded-md bg-[#7B2FFF]/10 hover:bg-[#7B2FFF]/20 text-[11px] font-semibold text-[#7B2FFF] dark:text-[#a068ff] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {isLocatingGps ? <Loader2 size={11} className="animate-spin" /> : <Navigation size={11} />}
              <span>Meu GPS</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCep} className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
            <input
              type="text"
              maxLength={9}
              value={tempCep}
              onChange={(e) => setTempCep(formatCep(e.target.value))}
              placeholder="Digite seu CEP"
              className="w-28 px-2.5 py-1 rounded-md bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#7B2FFF]"
              autoFocus
            />
            <button
              type="submit"
              disabled={isSubmittingCep}
              className="px-2.5 py-1 rounded-md bg-[#7B2FFF] hover:bg-[#6A23E3] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
            >
              {isSubmittingCep ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
              <span>OK</span>
            </button>
            <button
              type="button"
              onClick={handleApplyGps}
              disabled={isLocatingGps}
              className="px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1 cursor-pointer"
              title="Usar sinal GPS do navegador"
            >
              <Navigation size={11} />
              <span>GPS</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditingCep(false)}
              className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
            >
              <X size={14} />
            </button>
          </form>
        )}
      </div>

      {/* Filter and Order Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 mb-4 bg-white dark:bg-[#18181C] p-3 sm:p-3.5 rounded-lg border border-neutral-200/80 dark:border-neutral-800 shadow-xs transition-colors">
        {/* Network Degree Select Filter (ONLY for logged in users) */}
        {isAuthenticated ? (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label
              htmlFor="home-degree-select"
              className="text-xs font-bold text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Network size={14} className="text-[#7B2FFF]" />
              <span>Rede:</span>
            </label>
            <select
              id="home-degree-select"
              value={selectedDegreeFilter}
              onChange={(e) => setSelectedDegreeFilter(e.target.value as 'all' | '1' | '2' | '3' | '4' | '5')}
              className="w-full sm:w-auto text-xs font-semibold px-3 py-1.5 rounded-md bg-neutral-50 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700/80 focus:outline-none focus:ring-2 focus:ring-[#7B2FFF] cursor-pointer transition-all"
            >
              <option value="all">Todos na plataforma ({isAuthenticated ? users.filter((u) => u.id !== currentUser.id).length : users.length})</option>
              <option value="1">1º (Minhas indicações) · {counts.d1}</option>
              <option value="2">2º (Amigos de indicados) · {counts.d2}</option>
              <option value="3">3º (3º nível) · {counts.d3}</option>
              {counts.d4 > 0 && <option value="4">4º (4º nível) · {counts.d4}</option>}
              {counts.d5 > 0 && <option value="5">5º (5º nível) · {counts.d5}</option>}
            </select>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            <Users size={14} className="text-[#7B2FFF]" />
            <span>Exibindo <strong>{sortedUsers.length}</strong> profissionais cadastrados</span>
          </div>
        )}

        {/* Sort Dropdown / Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label
            htmlFor="home-sort-select"
            className="text-xs font-bold text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <ArrowDownUp size={13} className="text-[#7B2FFF]" />
            <span>Ordenar:</span>
          </label>
          <select
            id="home-sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="w-full sm:w-auto text-xs font-semibold px-3 py-1.5 rounded-md bg-neutral-50 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700/80 focus:outline-none focus:ring-2 focus:ring-[#7B2FFF] cursor-pointer transition-all"
          >
            {isAuthenticated && (
              <option value="network_degree">Relação na Rede (Conexão ➔ Proximidade ➔ Estrelas)</option>
            )}
            <option value="proximity">Mais próximos (Geolocalização ➔ Estrelas)</option>
            <option value="stars_desc">Mais estrelas (Mais recomendados)</option>
            <option value="newest_first">Mais recentes (Novo membro)</option>
            <option value="oldest_first">Mais tempo de plataforma</option>
            <option value="name_asc">Ordem alfabética (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Feedback banner if 0 results */}
      {sortedUsers.length === 0 && (
        <div className="p-8 text-center bg-white dark:bg-[#18181C] rounded-lg border border-neutral-200/80 dark:border-neutral-800 my-4 shadow-xs">
          <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
            Nenhum profissional encontrado.
          </p>
          {isAuthenticated && (
            <button
              onClick={() => setSelectedDegreeFilter('all')}
              className="mt-3 px-4 py-2 rounded-md bg-[#7B2FFF] text-white text-xs font-bold"
            >
              Ver todos da rede
            </button>
          )}
        </div>
      )}

      {/* Responsive Grid of User Cards: max 6 columns on desktop */}
      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {sortedUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};
