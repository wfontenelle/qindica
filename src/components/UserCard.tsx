import React, { useMemo } from 'react';
import { Star, MapPin } from 'lucide-react';
import { User } from '../types';
import { useApp } from '../context/AppContext';
import { formatDistance } from '../utils/geo';

interface UserCardProps {
  user: User;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const { navigate, isIndicatedByMe, toggleIndication, getUserNetworkStats, getUserDistance, currentUser, isAuthenticated } = useApp();
  const indicated = isAuthenticated && isIndicatedByMe(user.id);
  const netStats = getUserNetworkStats(user.id);
  const distKm = getUserDistance(user);

  const isMe = isAuthenticated && user.id === currentUser.id;

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleIndication(user.id);
  };

  const handleCardClick = () => {
    if (isMe) {
      navigate({ name: 'profile-me' });
    } else {
      navigate({ name: 'profile', userId: user.id });
    }
  };

  // Badge label: shown on top-left of photo ("Você" or "1º", "2º", "3º", "4º", "5º")
  // Real degree only (null if no real connection path exists or if unauthenticated)
  const degreeLabel = isAuthenticated
    ? (isMe ? 'Você' : (netStats.degree ? `${netStats.degree}º` : null))
    : null;

  // Miniatures stack (Facebook style) and connection text in bottom-left of photo going right
  const { avatarsToShow, connectionText } = useMemo(() => {
    if (isMe) {
      return {
        avatarsToShow: netStats.allReferrers?.slice(0, 3) || [],
        connectionText: (user.indicationCount || 0) > 0
          ? `${user.indicationCount} ${(user.indicationCount || 0) === 1 ? 'indicação' : 'indicações'}`
          : 'Seu perfil',
      };
    }

    if (isAuthenticated) {
      // 1st degree: directly indicated by active user
      if (netStats.degree === 1) {
        const otherRefs = (netStats.allReferrers || []).filter((r) => r.id !== currentUser.id);
        if (otherRefs.length > 0) {
          return {
            avatarsToShow: otherRefs.slice(0, 3),
            connectionText: `Você + ${otherRefs.length}`,
          };
        }
        return {
          avatarsToShow: [{ id: currentUser.id, name: 'Você', photo: currentUser.photo }],
          connectionText: 'Sua indicação',
        };
      }

      // 2nd degree: via 1st degree contacts
      if (netStats.degree === 2 && netStats.mutualReferrers && netStats.mutualReferrers.length > 0) {
        const refs = netStats.mutualReferrers;
        if (refs.length === 1) {
          return {
            avatarsToShow: refs.slice(0, 1),
            connectionText: `via ${refs[0].name}`,
          };
        }
        if (refs.length === 2) {
          return {
            avatarsToShow: refs.slice(0, 2),
            connectionText: `via ${refs[0].name} e ${refs[1].name}`,
          };
        }
        return {
          avatarsToShow: refs.slice(0, 3),
          connectionText: `${refs.length} em comum`,
        };
      }

      // 3rd, 4th, 5th degree or outside direct network
      if (netStats.allReferrers && netStats.allReferrers.length > 0) {
        const refs = netStats.allReferrers;
        if (refs.length === 1) {
          return {
            avatarsToShow: refs.slice(0, 1),
            connectionText: `via ${refs[0].name}`,
          };
        }
        if (refs.length === 2) {
          return {
            avatarsToShow: refs.slice(0, 2),
            connectionText: `via ${refs[0].name} e ${refs[1].name}`,
          };
        }
        return {
          avatarsToShow: refs.slice(0, 3),
          connectionText: `${refs.length} indicações`,
        };
      }

      // 0 indications on this profile
      return {
        avatarsToShow: [],
        connectionText: 'Seja o 1º a indicar',
      };
    }

    // Unauthenticated (guest visitor)
    if (netStats.allReferrers && netStats.allReferrers.length > 0) {
      const refs = netStats.allReferrers;
      if (refs.length === 1) {
        return {
          avatarsToShow: refs.slice(0, 1),
          connectionText: `via ${refs[0].name}`,
        };
      }
      if (refs.length === 2) {
        return {
          avatarsToShow: refs.slice(0, 2),
          connectionText: `via ${refs[0].name} e ${refs[1].name}`,
        };
      }
      return {
        avatarsToShow: refs.slice(0, 3),
        connectionText: `${refs.length} indicações`,
      };
    }

    return {
      avatarsToShow: [],
      connectionText: (user.indicationCount || 0) > 0
        ? `${user.indicationCount} indicações`
        : 'Seja o 1º a indicar',
    };
  }, [isAuthenticated, isMe, netStats, currentUser, user.indicationCount]);

  return (
    <div
      id={`user-card-${user.id}`}
      onClick={handleCardClick}
      title={
        isAuthenticated
          ? isMe
            ? 'Seu perfil no Qindica'
            : netStats.pathDescription || `${user.name} - ${netStats.degreeLabel}`
          : `${user.name} - ${user.indicationCount || 0} indicações`
      }
      className="group relative bg-white dark:bg-[#18181C] rounded-lg p-2 sm:p-2.5 flex flex-col items-center justify-between shadow-xs border border-neutral-200/80 dark:border-neutral-800 hover:border-[#7B2FFF]/50 dark:hover:border-[#7B2FFF]/70 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
    >
      {/* Photo Container */}
      <div className="relative w-full aspect-square rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-2">
        <img
          src={user.photo}
          alt={user.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7B2FFF&color=fff&size=200`;
          }}
        />

        {/* Estrelinha no canto superior direito */}
        <button
          id={`star-btn-${user.id}`}
          onClick={handleStarClick}
          aria-label={indicated ? `Desindicar ${user.name}` : `Indicar ${user.name}`}
          className={`absolute top-1.5 right-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center backdrop-blur-xs transition-all ${
            indicated
              ? 'bg-[#7B2FFF] text-white shadow-sm ring-1.5 ring-white/80 dark:ring-[#18181C] scale-105'
              : 'bg-black/35 text-white/95 hover:bg-black/55 active:scale-90'
          }`}
        >
          <Star
            size={13}
            className={`${
              indicated ? 'fill-amber-300 text-amber-300' : 'text-white'
            } transition-colors sm:w-3.5 sm:h-3.5`}
            strokeWidth={indicated ? 1.5 : 2}
          />
        </button>

        {/* Subtle dark vignette at bottom for text & avatar contrast */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/85 via-black/45 to-transparent pointer-events-none" />

        {/* Barra inferior da foto: Esquerda (Avatares + via X) e Direita (Grau limpo, sem overlay) */}
        <div className="absolute bottom-1.5 left-1.5 right-1.5 z-10 flex items-center justify-between gap-1.5 select-none pointer-events-none">
          {/* Lado esquerdo: Miniaturas estilo Facebook + texto */}
          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
            {avatarsToShow.length > 0 ? (
              <>
                <div className="flex -space-x-1.5 shrink-0 items-center">
                  {avatarsToShow.map((ref, idx) => (
                    <img
                      key={ref.id || idx}
                      src={ref.photo}
                      alt={ref.name}
                      className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full ring-1.5 ring-black/80 dark:ring-[#18181C] object-cover shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(ref.name)}&background=7B2FFF&color=fff&size=100`;
                      }}
                    />
                  ))}
                </div>
                <span className="text-white/95 text-[10px] sm:text-[11px] font-medium tracking-normal drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] truncate leading-tight">
                  {connectionText}
                </span>
              </>
            ) : (user.indicationCount || 0) > 0 ? (
              <div className="flex items-center gap-1 text-white/95 text-[10px] sm:text-[11px] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                <Star size={10} className="fill-amber-300 text-amber-300 shrink-0" />
                <span>{user.indicationCount} {user.indicationCount === 1 ? 'indicação' : 'indicações'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-amber-300/95 text-[10px] sm:text-[11px] font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] truncate">
                <Star size={10} className="text-amber-300 shrink-0 fill-amber-300" />
                <span className="truncate">{connectionText}</span>
              </div>
            )}
          </div>

          {/* Lado direito (canto inferior direito): Grau limpo e leve, sem caixinha/overlay */}
          {isAuthenticated && degreeLabel && (
            <span
              id={`user-degree-label-${user.id}`}
              className="shrink-0 text-white/95 text-[11px] sm:text-xs font-bold tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] ml-auto"
            >
              {degreeLabel}
            </span>
          )}
        </div>
      </div>

      {/* 4. Embaixo do nome: SEMPRE A PROFISSÃO */}
      <div className="w-full text-center px-1 pb-0.5 mt-0.5">
        <p className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-tight truncate">
          {user.name}
        </p>
        <p
          className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-normal truncate mt-0.5 leading-tight"
          title={user.bio}
        >
          {user.bio}
        </p>

        {/* Localização / Distância */}
        {(user.neighborhood || user.city || distKm != null) && (
          <div
            className="flex items-center justify-center gap-1 text-[10px] text-neutral-400 dark:text-neutral-500 font-medium truncate mt-1"
            title={`${distKm != null ? `${formatDistance(distKm)} de você · ` : ''}${user.neighborhood ? `${user.neighborhood}, ` : ''}${user.city || ''} ${user.state ? `(${user.state})` : ''}`}
          >
            <MapPin size={10} className="text-[#7B2FFF] dark:text-[#a068ff] shrink-0" />
            <span className="truncate">
              {distKm != null ? (
                <strong className="text-neutral-600 dark:text-neutral-300 font-semibold">{formatDistance(distKm)}</strong>
              ) : null}
              {distKm != null && (user.neighborhood || user.city) ? ' · ' : ''}
              {user.neighborhood || user.city}
              {user.state ? ` (${user.state})` : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
