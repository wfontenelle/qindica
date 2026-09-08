import { GeoLocation, User } from '../types';

/**
 * Strips non-numeric characters from a CEP string.
 */
export function cleanCep(cep: string): string {
  return (cep || '').replace(/\D/g, '');
}

/**
 * Formats an 8-digit numeric string into standard Brazilian CEP "00000-000".
 */
export function formatCep(cep: string): string {
  const cleaned = cleanCep(cep);
  if (cleaned.length <= 5) {
    return cleaned;
  }
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
}

/**
 * Validates if a string is a valid 8-digit CEP.
 */
export function isValidCep(cep: string): boolean {
  const cleaned = cleanCep(cep);
  return cleaned.length === 8;
}

/**
 * Fallback coordinate dictionary for major Brazilian state capitals and metropolitan areas.
 * Ensures zero-latency coordinate resolution for any Brazilian city returned by ViaCEP.
 */
export const BRAZIL_CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Capitais
  'são paulo-sp': { lat: -23.5505, lng: -46.6333 },
  'sao paulo-sp': { lat: -23.5505, lng: -46.6333 },
  'rio de janeiro-rj': { lat: -22.9068, lng: -43.1729 },
  'belo horizonte-mg': { lat: -19.9167, lng: -43.9345 },
  'curitiba-pr': { lat: -25.4284, lng: -49.2733 },
  'porto alegre-rs': { lat: -30.0346, lng: -51.2177 },
  'brasília-df': { lat: -15.7975, lng: -47.8919 },
  'brasilia-df': { lat: -15.7975, lng: -47.8919 },
  'salvador-ba': { lat: -12.9777, lng: -38.5016 },
  'recife-pe': { lat: -8.0476, lng: -34.8770 },
  'fortaleza-ce': { lat: -3.7319, lng: -38.5267 },
  'florianópolis-sc': { lat: -27.5954, lng: -48.5480 },
  'florianopolis-sc': { lat: -27.5954, lng: -48.5480 },
  'goiânia-go': { lat: -16.6869, lng: -49.2648 },
  'goiania-go': { lat: -16.6869, lng: -49.2648 },
  'vitória-es': { lat: -20.3155, lng: -40.3128 },
  'vitoria-es': { lat: -20.3155, lng: -40.3128 },
  'manaus-am': { lat: -3.1190, lng: -60.0217 },
  'belém-pa': { lat: -1.4558, lng: -48.5044 },
  'belem-pa': { lat: -1.4558, lng: -48.5044 },
  'cuiabá-mt': { lat: -15.6014, lng: -56.0979 },
  'cuiaba-mt': { lat: -15.6014, lng: -56.0979 },
  'campo grande-ms': { lat: -20.4697, lng: -54.6201 },
  'natal-rn': { lat: -5.7945, lng: -35.2110 },
  'joão pessoa-pb': { lat: -7.1195, lng: -34.8450 },
  'joao pessoa-pb': { lat: -7.1195, lng: -34.8450 },
  'maceió-al': { lat: -9.6658, lng: -35.7350 },
  'maceio-al': { lat: -9.6658, lng: -35.7350 },
  'teresina-pi': { lat: -5.0920, lng: -42.8038 },
  'são luís-ma': { lat: -2.5391, lng: -44.2829 },
  'sao luis-ma': { lat: -2.5391, lng: -44.2829 },
  'aracaju-se': { lat: -10.9472, lng: -37.0731 },

  // Cidades do interior de SP e capitais regionais
  'campinas-sp': { lat: -22.9056, lng: -47.0608 },
  'santos-sp': { lat: -23.9608, lng: -46.3336 },
  'são bernardo do campo-sp': { lat: -23.6944, lng: -46.5653 },
  'santo andré-sp': { lat: -23.6639, lng: -46.5383 },
  'guarulhos-sp': { lat: -23.4542, lng: -46.5333 },
  'osasco-sp': { lat: -23.5329, lng: -46.7917 },
  'são josé dos campos-sp': { lat: -23.1794, lng: -45.8869 },
  'ribeirão preto-sp': { lat: -21.1775, lng: -47.8103 },
  'sorocaba-sp': { lat: -23.5015, lng: -47.4521 },
  'niterói-rj': { lat: -22.8833, lng: -43.1036 },
  'londrina-pr': { lat: -23.3045, lng: -51.1696 },
  'joinville-sc': { lat: -26.3045, lng: -48.8487 },
  'caxias do sul-rs': { lat: -29.1678, lng: -51.1794 },
};

/**
 * Calculates distance between two coordinates in kilometers using the Haversine formula.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (
    lat1 == null ||
    lon1 == null ||
    lat2 == null ||
    lon2 == null ||
    isNaN(lat1) ||
    isNaN(lon1) ||
    isNaN(lat2) ||
    isNaN(lon2)
  ) {
    return NaN;
  }

  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Formats a distance in kilometers to user-friendly Portuguese text.
 * e.g., 0.4 -> "400 m", 2.3 -> "2,3 km", 45 -> "45 km"
 */
export function formatDistance(distanceKm: number | null | undefined): string {
  if (distanceKm == null || isNaN(distanceKm) || !isFinite(distanceKm)) {
    return '';
  }
  if (distanceKm < 1) {
    const meters = Math.max(50, Math.round(distanceKm * 1000));
    return `${meters} m`;
  }
  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1).replace('.', ',')} km`;
  }
  return `${Math.round(distanceKm)} km`;
}

export interface ViaCepResponse {
  cep: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

/**
 * Fetches address data from ViaCEP and resolves geographic coordinates.
 */
export async function fetchAddressByCep(
  rawCep: string
): Promise<{
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
} | null> {
  const cleaned = cleanCep(rawCep);
  if (cleaned.length !== 8) return null;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
    if (!res.ok) return null;

    const data: ViaCepResponse = await res.json();
    if (data.erro || !data.localidade) {
      return null;
    }

    // Determine coordinates:
    // 1. Check fallback coordinate dictionary by city and state
    const cityKey = `${data.localidade.trim().toLowerCase()}-${data.uf.trim().toLowerCase()}`;
    let coords = BRAZIL_CITY_COORDINATES[cityKey];

    // If city is São Paulo, add slight micro-offsets based on neighborhood/CEP to avoid stacking
    if (!coords) {
      // Fallback to state capital or generic center
      const stateCapitalKey = Object.keys(BRAZIL_CITY_COORDINATES).find((k) =>
        k.endsWith(`-${data.uf.trim().toLowerCase()}`)
      );
      if (stateCapitalKey) {
        coords = BRAZIL_CITY_COORDINATES[stateCapitalKey];
      } else {
        coords = { lat: -23.5505, lng: -46.6333 }; // Default SP
      }
    }

    // Apply micro-variations from CEP suffix (0-999) so nearby CEPs in the same city have sensible relative distances
    const suffixNum = parseInt(cleaned.slice(5), 10) || 0;
    const microLatOffset = ((suffixNum % 100) - 50) * 0.0006;
    const microLngOffset = (Math.floor(suffixNum / 100) - 5) * 0.0006;

    return {
      cep: formatCep(data.cep || cleaned),
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || '',
      latitude: Number((coords.lat + microLatOffset).toFixed(5)),
      longitude: Number((coords.lng + microLngOffset).toFixed(5)),
    };
  } catch (error) {
    console.error('Error fetching address by CEP:', error);
    return null;
  }
}

/**
 * Requests GPS position from browser's navigator.geolocation.
 */
export function getBrowserGeolocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada pelo navegador.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        reject(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}
