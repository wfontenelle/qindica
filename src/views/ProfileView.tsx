import React, { useState, useMemo, useEffect } from 'react';
import { Star, Edit3, Share2, Mail, Phone, CheckCircle2, ShieldCheck, Plus, X, MessageCircle, Network, Users, Sparkles, MapPin, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import { getWhatsAppApiUrl } from '../utils/whatsapp';
import { UserCard } from '../components/UserCard';
import { formatDistance } from '../utils/geo';

interface ProfileViewProps {
  userId?: string;
  isMe?: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ userId, isMe = false }) => {
  const {
    getUserById,
    currentUser,
    isIndicatedByMe,
    toggleIndication,
    updateCurrentUser,
    navigate,
    showToast,
    isAuthenticated,
    openAuthModal,
    getUserNetworkStats,
    getUserDistance,
    indications,
    currentRoute,
  } = useApp();
  const [quickTagInput, setQuickTagInput] = useState('');
  const [showQuickTagForm, setShowQuickTagForm] = useState(false);
  const [dismissShareBanner, setDismissShareBanner] = useState(false);

  const isFromShare = currentRoute.name === 'profile' && Boolean(currentRoute.fromShare);

  // If visitor is not logged in and explicitly requested "Meu Perfil"
  if (isMe && !isAuthenticated) {
    return (
      <div className="p-8 text-center bg-white dark:bg-[#18181C] rounded-xl border border-neutral-200/80 dark:border-neutral-800 my-8 max-w-md mx-auto shadow-xs">
        <div className="w-14 h-14 rounded-lg bg-[#7B2FFF]/10 dark:bg-[#7B2FFF]/20 text-[#7B2FFF] dark:text-[#a068ff] flex items-center justify-center mx-auto mb-3.5">
          <ShieldCheck size={28} />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1.5">Conecte-se ao seu perfil</h3>
        <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm font-medium mb-5">
          Faça login ou crie sua conta para gerenciar seus dados, tags e acompanhar suas recomendações na rede Qindica.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="w-full py-2.5 bg-[#7B2FFF] text-white rounded-lg text-sm font-bold shadow-xs hover:bg-[#6A23E3] transition-all cursor-pointer active:scale-98"
        >
          Entrar ou Cadastrar
        </button>
      </div>
    );
  }

  const user: User | undefined = isMe
    ? currentUser
    : userId
    ? getUserById(userId)
    : currentUser;

  if (!user) {
    return (
      <div className="p-8 text-center bg-white dark:bg-[#18181C] rounded-lg border border-neutral-200/80 dark:border-neutral-800 my-8">
        <p className="text-neutral-500 dark:text-neutral-400 font-medium">Usuário não encontrado.</p>
        <button
          onClick={() => navigate({ name: 'home' })}
          className="mt-4 px-6 py-2.5 bg-[#7B2FFF] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#6A23E3]"
        >
          Voltar para o início
        </button>
      </div>
    );
  }

  const isActualMe =
    (isMe && isAuthenticated) ||
    (isAuthenticated && Boolean(currentUser?.id && user?.id && user.id === currentUser.id));
  const indicated = !isActualMe && isIndicatedByMe(user.id);
  const otherIndications = Math.max(0, user.indicationCount - (indicated ? 1 : 0));
  const netStats = getUserNetworkStats(user.id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [user?.id]);

  // People who indicate this profile (referrers)
  const referringUsers = useMemo(() => {
    if (!user) return [];
    const matchingIndications = indications.filter((ind) => ind.toUserId === user.id);

    const result: User[] = [];
    const seenIds = new Set<string>();

    matchingIndications.forEach((ind) => {
      if (!seenIds.has(ind.fromUserId)) {
        seenIds.add(ind.fromUserId);
        const refUser = getUserById(ind.fromUserId);
        if (refUser) {
          result.push(refUser);
        }
      }
    });

    return result;
  }, [user, indications, getUserById]);

  const handleIndicate = () => {
    toggleIndication(user.id);
  };

  const handleQuickAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = quickTagInput.trim();
    if (!raw) return;

    const tagsToAdd = raw
      .split(/[,;]+/)
      .map((t) => t.trim().replace(/^#+/, ''))
      .filter((t) => t.length > 0);

    const currentTags = user.tags || [];
    const newTags = [...currentTags];
    let added = 0;

    tagsToAdd.forEach((t) => {
      const formatted = t.charAt(0).toUpperCase() + t.slice(1);
      if (!newTags.some((ex) => ex.toLowerCase() === formatted.toLowerCase())) {
        newTags.push(formatted);
        added++;
      }
    });

    if (added > 0) {
      updateCurrentUser({ tags: newTags });
      setQuickTagInput('');
      setShowQuickTagForm(false);
      showToast(`${added} tag(s) adicionada(s)! 🎉`);
    } else {
      showToast('Esta tag já está no seu perfil.');
    }
  };

  const handleQuickRemoveTag = (tagToRemove: string) => {
    const updated = (user.tags || []).filter(
      (t) => t.toLowerCase() !== tagToRemove.toLowerCase()
    );
    updateCurrentUser({ tags: updated });
    showToast(`Tag removida.`);
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      {/* Banner for visitors arriving from external shared link or QR Code only */}
      {!isActualMe && isFromShare && !dismissShareBanner && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-[#7B2FFF]/8 dark:bg-[#7B2FFF]/15 border border-[#7B2FFF]/20 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
            <span className="text-sm">🔗</span>
            <span>
              Você abriu o perfil compartilhado de <strong>{user.name}</strong>.
            </span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={() => navigate({ name: 'home' })}
              className="text-[#7B2FFF] dark:text-[#a068ff] font-bold hover:underline cursor-pointer"
            >
              Conhecer toda a rede Qindica →
            </button>
            <button
              type="button"
              onClick={() => setDismissShareBanner(true)}
              className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
              title="Fechar aviso"
              aria-label="Fechar"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Responsive Grid: 1 col on mobile, 12 cols on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-start">
        {/* Left Column: User Identity & Primary Actions */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white dark:bg-[#18181C] rounded-lg p-5 sm:p-6 shadow-xs border border-neutral-200/80 dark:border-neutral-800 flex flex-col items-center text-center relative transition-colors">
            {/* Avatar Photo with Connection Degree Badge */}
            <div className="relative mb-4">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg overflow-hidden shadow-sm ring-3 ring-[#7B2FFF]/15 dark:ring-[#7B2FFF]/20 bg-neutral-100 dark:bg-neutral-800">
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7B2FFF&color=fff&size=200`;
                  }}
                />
              </div>

              {/* Connection Degree Badge: Only shown if authenticated AND has a real connection degree */}
              {isAuthenticated && (
                isActualMe ? (
                  <div
                    id="profile-network-badge"
                    className="absolute -bottom-2 -right-2 bg-[#7B2FFF] text-white px-2.5 py-1 rounded-md text-xs font-extrabold shadow-sm flex items-center gap-1.5 border-2 border-white dark:border-[#18181C]"
                  >
                    <Network size={13} className="text-amber-300" />
                    <span>Seu Perfil</span>
                  </div>
                ) : netStats.degree ? (
                  <div
                    id="profile-network-badge"
                    className="absolute -bottom-2 -right-2 bg-[#7B2FFF] text-white px-2.5 py-1 rounded-md text-xs font-extrabold shadow-sm flex items-center gap-1.5 border-2 border-white dark:border-[#18181C]"
                  >
                    <Network size={13} className="text-amber-300" />
                    <span>{netStats.degree}º na rede</span>
                  </div>
                ) : null
              )}
            </div>

            {/* Name and Short Bio */}
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              {user.name}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-1 max-w-[280px]">
              {user.bio}
            </p>

            {/* Localização & Distância */}
            {(user.city || user.neighborhood || user.state || user.cep || getUserDistance(user) != null) && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/60 text-xs text-neutral-600 dark:text-neutral-300 font-medium">
                <MapPin size={12} className="text-[#7B2FFF] dark:text-[#a068ff] shrink-0" />
                <span>
                  {user.neighborhood ? `${user.neighborhood}, ` : ''}
                  {user.city || ''}
                  {user.state ? ` - ${user.state}` : ''}
                  {getUserDistance(user) != null && !isActualMe ? ` · ${formatDistance(getUserDistance(user))} de você` : ''}
                </span>
              </div>
            )}

            {/* Alert when person has 0 indications */}
            {!isActualMe && (user.indicationCount || 0) === 0 && (
              <div className="w-full mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5 text-left shadow-xs">
                <Sparkles size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Nenhuma indicação ainda</p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300/90 mt-0.5 leading-relaxed">
                    Seja a primeira pessoa a indicar {user.name.split(' ')[0]} com sua estrela ⭐ para inaugurar a rede de confiança deste perfil!
                  </p>
                </div>
              </div>
            )}

            {/* Network Path & Stats Pill */}
            <div className="mt-3.5 flex flex-col items-center gap-1.5 w-full">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/60 text-neutral-700 dark:text-neutral-300 text-xs font-semibold">
                <Star size={14} className="text-amber-500 fill-amber-500" />
                <span>
                  <strong>{user.indicationCount}</strong> {user.indicationCount === 1 ? 'indicação na rede' : 'indicações na rede'}
                </span>
              </div>

              {/* Path context if not me: Only shown if authenticated */}
              {isAuthenticated && !isActualMe && netStats.pathDescription && (
                <div className="w-full mt-1 px-3 py-1.5 rounded-md bg-[#7B2FFF]/5 dark:bg-[#7B2FFF]/10 border border-[#7B2FFF]/20 text-[11px] font-medium text-[#7B2FFF] dark:text-[#a068ff] text-center">
                  {netStats.pathDescription}
                </div>
              )}
            </div>

            {/* Contact details if available */}
            {(user.email || user.phone) && (
              <div className="w-full mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-2 text-left text-xs text-neutral-600 dark:text-neutral-300">
                {user.email && (
                  <div className="flex items-center gap-2.5 truncate">
                    <Mail size={14} className="text-[#7B2FFF] dark:text-[#a068ff] shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone size={14} className="text-[#7B2FFF] dark:text-[#a068ff] shrink-0" />
                    <span>
                      {isActualMe
                        ? user.phone
                        : user.phone.replace(/(\d{2,3})(\d{1,2})?(\d{4})(\d{4})/, '($1) •••••-$4')}
                    </span>
                  </div>
                )}
                {user.phone && user.whatsapp !== false ? (
                  <div className="flex flex-col gap-1.5 mt-2">
                    <a
                      id="profile-whatsapp-btn"
                      href={getWhatsAppApiUrl(
                        user.phone,
                        'Olá! Estou entrando em contato através do Qindica.'
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                    >
                      <MessageCircle size={17} className="fill-white/20" />
                      <span>Conversar no WhatsApp</span>
                    </a>
                    <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-neutral-400 dark:text-neutral-500">
                      <ShieldCheck size={12} className="text-emerald-500 shrink-0" />
                      <span>Contato direto protegido contra robôs</span>
                    </div>
                  </div>
                ) : user.whatsapp === false ? (
                  <div className="mt-2 py-2 px-3 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/50 text-[11px] text-neutral-500 dark:text-neutral-400 text-center">
                    Contatos diretos temporariamente pausados
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Action Buttons in Left Column */}
          <div className="flex flex-col gap-2.5">
            {isActualMe ? (
              <>
                <button
                  id="edit-profile-btn"
                  onClick={() => navigate({ name: 'edit' })}
                  className="w-full py-3.5 px-5 rounded-lg bg-[#7B2FFF] hover:bg-[#6A23E3] active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Edit3 size={16} strokeWidth={2.5} />
                  <span>Editar meu perfil →</span>
                </button>

                <button
                  id="share-invite-btn"
                  onClick={() => navigate({ name: 'share', initialTab: 'invite' })}
                  className="w-full py-3 px-4 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-amber-500/30 transition-all cursor-pointer"
                >
                  <UserPlus size={16} className="text-amber-600 dark:text-amber-400" />
                  <span>Convidar para fazer parte (+1 estrela no cadastro) →</span>
                </button>

                <button
                  id="share-profile-btn"
                  onClick={() => navigate({ name: 'share', initialTab: 'profile' })}
                  className="w-full py-2.5 px-4 rounded-lg bg-white dark:bg-[#18181C] hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-[0.98] text-neutral-800 dark:text-neutral-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs border border-neutral-200/80 dark:border-neutral-800 transition-all cursor-pointer"
                >
                  <Share2 size={15} strokeWidth={2.2} className="text-[#7B2FFF] dark:text-[#a068ff]" />
                  <span>Compartilhar meu QR Code de perfil</span>
                </button>
              </>
            ) : (
              <div>
                {indicated ? (
                  <div className="flex flex-col gap-2">
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 text-emerald-800 dark:text-emerald-200 px-4 py-3 rounded-lg flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                            ⭐ Indicado por você
                          </p>
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                            Mais {otherIndications} {otherIndications === 1 ? 'pessoa indica' : 'pessoas indicam'} este profissional.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      id="toggle-unindicate-btn"
                      onClick={handleIndicate}
                      className="w-full py-2.5 px-4 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-xs font-semibold text-center hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      Remover minha indicação
                    </button>
                  </div>
                ) : (
                  <button
                    id="indicate-user-btn"
                    onClick={handleIndicate}
                    className="w-full py-3.5 px-5 rounded-lg bg-[#7B2FFF] hover:bg-[#6A23E3] active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#7B2FFF]/20 transition-all cursor-pointer"
                  >
                    <Star size={18} className="fill-amber-300 text-amber-300" strokeWidth={1.5} />
                    <span>Indicar {user.name.split(' ')[0]} ⭐</span>
                  </button>
                )}

                <div className="flex flex-col gap-1.5 mt-2">
                  <button
                    id="share-other-profile-btn"
                    onClick={() => navigate({ name: 'share', userId: user.id, initialTab: 'profile' })}
                    className="w-full py-2.5 px-4 rounded-lg bg-white dark:bg-[#18181C] hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-[0.98] text-neutral-700 dark:text-neutral-300 font-semibold text-xs flex items-center justify-center gap-2 border border-neutral-200/80 dark:border-neutral-800 transition-all cursor-pointer"
                  >
                    <Share2 size={14} className="text-[#7B2FFF] dark:text-[#a068ff]" />
                    <span>Compartilhar perfil de {user.name.split(' ')[0]}</span>
                  </button>
                  <button
                    id="invite-other-profile-btn"
                    onClick={() => navigate({ name: 'share', initialTab: 'invite' })}
                    className="w-full py-2 px-3 rounded-lg text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <UserPlus size={13} />
                    <span>Convidar amigos para fazer parte</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Extended Information (Presentation, Tags, Trust Network) */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-4">
          {/* Tags as Purple Pill Chips */}
          <div className="bg-white dark:bg-[#18181C] rounded-lg p-5 sm:p-6 shadow-xs border border-neutral-200/80 dark:border-neutral-800 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Competências & Áreas
              </h3>
              {isActualMe && !showQuickTagForm && (
                <button
                  type="button"
                  id="profile-quick-add-tag-trigger"
                  onClick={() => setShowQuickTagForm(true)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#7B2FFF] dark:text-[#a068ff] hover:text-[#6A23E3] bg-[#7B2FFF]/10 dark:bg-[#7B2FFF]/20 hover:bg-[#7B2FFF]/20 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                >
                  <Plus size={13} strokeWidth={2.5} />
                  <span>Adicionar Tag</span>
                </button>
              )}
            </div>

            {/* Inline Add Tag Form if user is viewing their own profile */}
            {isActualMe && showQuickTagForm && (
              <form onSubmit={handleQuickAddTag} className="mb-3.5 p-3 bg-neutral-50 dark:bg-neutral-800/70 rounded-lg border border-neutral-200/80 dark:border-neutral-700/60">
                <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300 block mb-1.5">
                  Adicionar nova competência ou tag:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={quickTagInput}
                    onChange={(e) => setQuickTagInput(e.target.value)}
                    placeholder="Ex: Consultoria, Design, Copywriting..."
                    className="flex-1 px-3 py-1.5 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#7B2FFF]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#7B2FFF] text-white text-xs font-bold rounded-md hover:bg-[#6A23E3] cursor-pointer"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQuickTagForm(false)}
                    className="px-2.5 py-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-xs font-semibold cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {user.tags && user.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-md bg-[#7B2FFF]/10 dark:bg-[#7B2FFF]/20 text-[#7B2FFF] dark:text-[#a068ff] text-xs font-bold tracking-tight transition-all group"
                  >
                    <button
                      type="button"
                      onClick={() => navigate({ name: 'search', initialQuery: tag })}
                      className="hover:underline cursor-pointer"
                    >
                      #{tag}
                    </button>
                    {isActualMe && (
                      <button
                        type="button"
                        onClick={() => handleQuickRemoveTag(tag)}
                        className="w-4 h-4 rounded bg-[#7B2FFF]/15 hover:bg-[#7B2FFF] hover:text-white flex items-center justify-center text-[#7B2FFF] dark:text-[#a068ff] transition-colors cursor-pointer"
                        title="Remover tag"
                      >
                        <X size={10} strokeWidth={3} />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400 dark:text-neutral-500 italic">
                Nenhuma tag ou área adicionada ainda. {isActualMe && 'Clique em "Adicionar Tag" acima.'}
              </p>
            )}
          </div>

          {/* Long Presentation Text Card */}
          <div className="bg-white dark:bg-[#18181C] rounded-lg p-5 sm:p-6 shadow-xs border border-neutral-200/80 dark:border-neutral-800 transition-colors">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
              Apresentação Profissional
            </h3>
            <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal whitespace-pre-line">
              {user.presentationText || 'Nenhuma apresentação detalhada cadastrada ainda.'}
            </p>
          </div>

          {/* Quem Indica Section (Referrers) */}
          <div className="bg-white dark:bg-[#18181C] rounded-lg p-5 sm:p-6 shadow-xs border border-neutral-200/80 dark:border-neutral-800 transition-colors">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-2">
                <Users size={16} className="text-[#7B2FFF] dark:text-[#a068ff]" />
                Quem indica {isActualMe ? 'você' : user.name.split(' ')[0]}
              </h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#7B2FFF]/10 dark:bg-[#7B2FFF]/20 text-[#7B2FFF] dark:text-[#a068ff]">
                {referringUsers.length} {referringUsers.length === 1 ? 'indicação' : 'indicações'}
              </span>
            </div>

            {referringUsers.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
                {referringUsers.map((refUser) => (
                  <UserCard key={refUser.id} user={refUser} />
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-800/40 rounded-lg border border-dashed border-neutral-200 dark:border-neutral-700/60 p-4">
                <p>Nenhuma indicação direta registrada ainda para este perfil.</p>
                {!isActualMe && (
                  <p className="mt-1 font-medium text-neutral-600 dark:text-neutral-300">
                    Seja a primeira pessoa a indicar {user.name.split(' ')[0]} com sua estrela ⭐!
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Trust Network Explainer Card */}
          <div className="bg-white dark:bg-[#18181C] rounded-lg p-5 sm:p-6 shadow-xs border border-neutral-200/80 dark:border-neutral-800 transition-colors">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3 flex items-center gap-2">
              <Network size={16} className="text-[#7B2FFF] dark:text-[#a068ff]" />
              Como Funciona a Rede de Conexões no Qindica
            </h3>
            <div className="grid sm:grid-cols-3 gap-3 mt-3">
              <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200/60 dark:border-neutral-700/60">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#7B2FFF]"></span>
                  <span className="text-xs font-bold text-[#7B2FFF] dark:text-[#a068ff] block">1º (Direto)</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5">
                  Pessoas que você indicou diretamente com sua estrela ⭐.
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200/60 dark:border-neutral-700/60">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">2º (Amigos)</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5">
                  Indicados por quem você indicou. Priorizados por quantas pontes de 1º têm em comum.
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200/60 dark:border-neutral-700/60">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-neutral-400"></span>
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block">3º, 4º e 5º</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5">
                  Rede expandida de confiança e reputação escalonada em múltiplos graus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
