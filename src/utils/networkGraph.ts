import { User, Indication } from '../types';
import { calculateDistanceKm } from './geo';

export type NetworkDegree = number | null;

export interface ReferrerAvatar {
  id: string;
  name: string;
  photo: string;
}

export interface UserNetworkStats {
  degree: NetworkDegree; // 1 = 1º, 2 = 2º, 3 = 3º, 4 = 4º, 5 = 5º, etc.
  degreeLabel: string; // "1º", "2º", "3º", "4º", "5º"
  mutualFirstDegreeCount: number; // Quantos do meu 1º indicaram esta pessoa
  mutualSecondDegreeCount: number; // Quantos do meu 2º indicaram esta pessoa
  firstDegreeReferrers: string[]; // Nomes de contatos do 1º que indicaram essa pessoa
  mutualReferrers: ReferrerAvatar[]; // Contatos em comum que indicaram (com foto e nome)
  allReferrers: ReferrerAvatar[]; // Todos os indicadores conhecidos desta pessoa (com foto e nome)
  pathDescription?: string; // e.g. "Indicado por Matheus e Beatriz (seu 1º)"
}

/**
 * Calculates the network distance and connection graph starting from activeUserId via BFS.
 * - 1st: directly indicated by activeUserId
 * - 2nd: indicated by someone in 1st degree
 * - 3rd: indicated by someone in 2nd degree
 * - 4th: indicated by someone in 3rd degree
 * - 5th: indicated by someone in 4th degree
 */
export function calculateNetworkDistances(
  activeUserId: string,
  users: User[],
  indications: Indication[]
): Map<string, UserNetworkStats> {
  const statsMap = new Map<string, UserNetworkStats>();

  // Map: userId -> Set of userIds that indicated this user (who gave them a star)
  const incomingIndications = new Map<string, Set<string>>();
  // Map: userId -> Set of userIds that this user indicated (outgoing stars)
  const outgoingIndications = new Map<string, Set<string>>();

  users.forEach((u) => {
    incomingIndications.set(u.id, new Set());
    outgoingIndications.set(u.id, new Set());
  });

  indications.forEach((ind) => {
    if (!incomingIndications.has(ind.toUserId)) {
      incomingIndications.set(ind.toUserId, new Set());
    }
    incomingIndications.get(ind.toUserId)!.add(ind.fromUserId);

    if (!outgoingIndications.has(ind.fromUserId)) {
      outgoingIndications.set(ind.fromUserId, new Set());
    }
    outgoingIndications.get(ind.fromUserId)!.add(ind.toUserId);
  });

  // BFS from activeUserId to compute real network degree (1, 2, 3, 4, 5...)
  const degreeMap = new Map<string, number>();
  const queue: string[] = [];

  const myOutgoing = outgoingIndications.get(activeUserId) || new Set();
  myOutgoing.forEach((targetId) => {
    if (targetId !== activeUserId) {
      degreeMap.set(targetId, 1);
      queue.push(targetId);
    }
  });

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const currentDist = degreeMap.get(currentId)!;
    // Cap BFS graph exploration at 5 degrees of separation
    if (currentDist >= 5) continue;
    const currentOutgoing = outgoingIndications.get(currentId) || new Set();
    currentOutgoing.forEach((targetId) => {
      if (targetId !== activeUserId && !degreeMap.has(targetId)) {
        degreeMap.set(targetId, currentDist + 1);
        queue.push(targetId);
      }
    });
  }

  const userNameMap = new Map<string, string>();
  const userMap = new Map<string, User>();
  users.forEach((u) => {
    userNameMap.set(u.id, u.name);
    userMap.set(u.id, u);
  });

  users.forEach((u) => {
    const referrers = incomingIndications.get(u.id) || new Set();

    if (u.id === activeUserId) {
      const myRefs: ReferrerAvatar[] = [];
      referrers.forEach((refId) => {
        const ru = userMap.get(refId);
        if (ru) {
          myRefs.push({
            id: ru.id,
            name: ru.name.split(' ')[0],
            photo: ru.photo,
          });
        }
      });

      statsMap.set(u.id, {
        degree: null,
        degreeLabel: 'Você',
        mutualFirstDegreeCount: 0,
        mutualSecondDegreeCount: 0,
        firstDegreeReferrers: [],
        mutualReferrers: [],
        allReferrers: myRefs,
        pathDescription: 'Seu próprio perfil no Qindica',
      });
      return;
    }

    // 1st degree referrers & all referrers
    const firstReferrers: string[] = [];
    const mutualReferrers: ReferrerAvatar[] = [];
    const allReferrers: ReferrerAvatar[] = [];

    referrers.forEach((refId) => {
      const ru = userMap.get(refId);
      if (ru) {
        const refAvatar: ReferrerAvatar = {
          id: ru.id,
          name: ru.name.split(' ')[0],
          photo: ru.photo,
        };
        allReferrers.push(refAvatar);

        if (degreeMap.get(refId) === 1) {
          firstReferrers.push(refAvatar.name);
          mutualReferrers.push(refAvatar);
        }
      }
    });

    // 2nd degree referrers
    let secondDegreeReferrerCount = 0;
    referrers.forEach((refId) => {
      if (degreeMap.get(refId) === 2) {
        secondDegreeReferrerCount++;
      }
    });

    // Determine real degree: only 1, 2, 3, 4, 5 if a real path exists; otherwise null
    const rawDegree = degreeMap.get(u.id);
    const degree: number | null = (rawDegree && rawDegree <= 5) ? rawDegree : null;

    const degreeLabel = degree ? `${degree}º` : '';

    let pathDescription = '';
    if (degree === 1) {
      pathDescription = 'Indicado(a) diretamente por você (sua rede direta)';
    } else if (degree === 2) {
      if (firstReferrers.length > 0) {
        const namesListed = firstReferrers.slice(0, 2).join(' e ');
        const extra = firstReferrers.length > 2 ? ` e +${firstReferrers.length - 2}` : '';
        pathDescription = `Indicado(a) por ${namesListed}${extra} (seu 1º)`;
      } else {
        pathDescription = 'Conexão de 2º grau através das suas indicações';
      }
    } else if (degree === 3) {
      pathDescription = 'Conexão de 3º grau na sua rede de confiança';
    } else if (degree === 4) {
      pathDescription = 'Conexão de 4º grau na sua rede de confiança';
    } else if (degree === 5) {
      pathDescription = 'Conexão de 5º grau na sua rede de confiança';
    } else {
      if ((u.indicationCount || 0) === 0) {
        pathDescription = 'Sem indicações ainda · Seja a primeira pessoa a indicar!';
      } else {
        pathDescription = 'Fora da sua rede de conexões direta';
      }
    }

    statsMap.set(u.id, {
      degree,
      degreeLabel,
      mutualFirstDegreeCount: firstReferrers.length,
      mutualSecondDegreeCount: secondDegreeReferrerCount,
      firstDegreeReferrers: firstReferrers,
      mutualReferrers,
      allReferrers,
      pathDescription,
    });
  });

  return statsMap;
}

export type SortOption =
  | 'network_degree' // 1º: Conexão (grau) -> 2º: Geolocalização (mais próximo) -> 3º: Estrelas
  | 'proximity' // 1º: Geolocalização (mais próximo) -> 2º: Estrelas
  | 'stars_desc' // Mais estrelas totais (mais recomendados)
  | 'newest_first' // Mais recente na plataforma
  | 'oldest_first' // Mais tempo de plataforma
  | 'name_asc'; // Ordem alfabética (A - Z)

/**
 * Sorts users according to the desired criteria.
 * Default is 'network_degree'.
 * Supports referenceLocation for proximity calculation.
 */
export function sortUsersByCriterion(
  users: User[],
  networkStats: Map<string, UserNetworkStats>,
  sortOption: SortOption = 'network_degree',
  referenceLocation?: { latitude: number; longitude: number } | null
): User[] {
  const list = [...users];

  // Helper to get distance from referenceLocation in km
  const getDist = (u: User): number => {
    if (!referenceLocation || u.latitude == null || u.longitude == null) {
      return Infinity;
    }
    const d = calculateDistanceKm(
      referenceLocation.latitude,
      referenceLocation.longitude,
      u.latitude,
      u.longitude
    );
    return isNaN(d) ? Infinity : d;
  };

  return list.sort((a, b) => {
    if (sortOption === 'name_asc') {
      return a.name.localeCompare(b.name);
    }

    if (sortOption === 'stars_desc') {
      const starsDiff = (b.indicationCount || 0) - (a.indicationCount || 0);
      if (starsDiff !== 0) return starsDiff;
      // Proximity tie-breaker
      const distA = getDist(a);
      const distB = getDist(b);
      if (distA !== distB) return distA - distB;
      return a.name.localeCompare(b.name);
    }

    if (sortOption === 'proximity') {
      // 1º fator: Geolocalização (mais próximo)
      const distA = getDist(a);
      const distB = getDist(b);

      if (distA !== distB) {
        return distA - distB;
      }

      // 2º fator: Estrelas
      const starsDiff = (b.indicationCount || 0) - (a.indicationCount || 0);
      if (starsDiff !== 0) return starsDiff;
      return a.name.localeCompare(b.name);
    }

    if (sortOption === 'oldest_first') {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      const timeDiff = dateA - dateB;
      if (timeDiff !== 0) return timeDiff;
      return (b.indicationCount || 0) - (a.indicationCount || 0);
    }

    if (sortOption === 'newest_first') {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      const timeDiff = dateB - dateA;
      if (timeDiff !== 0) return timeDiff;
      return (b.indicationCount || 0) - (a.indicationCount || 0);
    }

    // Default: 'network_degree' (Para logados: 1º Conexão, 2º Geolocalização, 3º Estrelas)
    const statsA = networkStats.get(a.id);
    const statsB = networkStats.get(b.id);

    // Degree weight: Você (0) -> 1º (1) -> 2º (2) -> 3º (3) -> 4º (4) -> 5º (5) -> Sem grau (999)
    const degA = statsA?.degreeLabel === 'Você' ? 0 : (statsA?.degree ?? 999);
    const degB = statsB?.degreeLabel === 'Você' ? 0 : (statsB?.degree ?? 999);

    if (degA !== degB) {
      return degA - degB;
    }

    // Within same degree:
    // 2º Fator: Geolocalização / Proximidade (quem está mais perto vem primeiro)
    const distA = getDist(a);
    const distB = getDist(b);
    if (distA !== distB && isFinite(distA) && isFinite(distB)) {
      // Se a diferença for relevante (> 100 metros), prioriza o mais perto
      if (Math.abs(distA - distB) > 0.1) {
        return distA - distB;
      }
    } else if (isFinite(distA) !== isFinite(distB)) {
      return isFinite(distA) ? -1 : 1;
    }

    // Se grau for 2 e distância for similar: desempate por amigos em comum em 1º grau
    if (degA === 2) {
      const mutualDiff = (statsB?.mutualFirstDegreeCount || 0) - (statsA?.mutualFirstDegreeCount || 0);
      if (mutualDiff !== 0) return mutualDiff;
    }

    // 3º Fator: Estrelas / Indicações recebidas
    const starsDiff = (b.indicationCount || 0) - (a.indicationCount || 0);
    if (starsDiff !== 0) return starsDiff;

    return a.name.localeCompare(b.name);
  });
}
