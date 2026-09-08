import { AppRoute } from '../types';

/**
 * Parses the current URL (query params, hash, or pathname) to determine the AppRoute.
 * This ensures direct links, shared links, and QR codes land immediately on the intended profile.
 */
export function parseRouteFromLocation(): AppRoute {
  if (typeof window === 'undefined') {
    return { name: 'home' };
  }

  try {
    const url = new URL(window.location.href);

    const isShareRef =
      url.searchParams.get('ref') === 'share' ||
      url.searchParams.get('src') === 'share';

    const inviteParam =
      url.searchParams.get('invite') ||
      url.searchParams.get('convite');

    // 1. Direct profile via query param: ?profile=user_X or ?u=user_X or ?user=user_X
    const profileParam =
      url.searchParams.get('profile') ||
      url.searchParams.get('u') ||
      url.searchParams.get('user');

    const tabParam = url.searchParams.get('tab');
    const typeParam = url.searchParams.get('type');

    if (tabParam === 'share') {
      return {
        name: 'share',
        userId: profileParam || undefined,
        initialTab: typeParam === 'profile' ? 'profile' : 'invite',
      };
    }

    if (inviteParam) {
      return { name: 'home', invitedBy: inviteParam };
    }

    if (profileParam) {
      return {
        name: 'profile',
        userId: profileParam,
        fromShare: isShareRef,
        invitedBy: isShareRef ? profileParam : undefined,
      };
    }

    // 2. Direct search query: ?q=advogado
    const queryParam = url.searchParams.get('q');
    if (queryParam) {
      return { name: 'search', initialQuery: queryParam };
    }

    // 3. Tab query params: ?tab=me | search | share | edit | auth | landing | lp | design-system | brand
    if (tabParam === 'landing' || tabParam === 'lp') {
      return { name: 'landing' };
    }
    if (tabParam === 'design-system' || tabParam === 'brand') {
      return { name: 'design-system' };
    }
    if (tabParam === 'me' || tabParam === 'profile-me') {
      return { name: 'profile-me' };
    }
    if (tabParam === 'search') {
      return { name: 'search' };
    }
    if (tabParam === 'edit') {
      return { name: 'edit' };
    }
    if (tabParam === 'auth') {
      return { name: 'auth' };
    }

    // 4. Pathname parsing: /profile/:userId or /p/:userId or /landing or /design-system
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts.includes('landing') || pathParts.includes('lp')) {
      return { name: 'landing' };
    }
    if (pathParts.includes('design-system') || pathParts.includes('brand')) {
      return { name: 'design-system' };
    }
    const profileIdx = pathParts.findIndex((p) => p === 'profile' || p === 'p');
    if (profileIdx !== -1 && pathParts[profileIdx + 1]) {
      return {
        name: 'profile',
        userId: decodeURIComponent(pathParts[profileIdx + 1]),
      };
    }

    // 5. Hash routing fallback: #/profile/user_X or #profile=user_X
    if (url.hash) {
      const cleanHash = url.hash.replace(/^#\/?/, '');
      if (cleanHash.startsWith('profile/')) {
        const id = cleanHash.replace('profile/', '');
        if (id) return { name: 'profile', userId: decodeURIComponent(id) };
      }
      const hashParams = new URLSearchParams(cleanHash);
      const hashProfile = hashParams.get('profile') || hashParams.get('u');
      if (hashProfile) {
        return { name: 'profile', userId: hashProfile };
      }
    }
  } catch (error) {
    console.error('Failed to parse route from location:', error);
  }

  return { name: 'home' };
}

/**
 * Generates a clean, universally compatible URL for a given profile.
 * Uses query param `?profile=userId` because it works seamlessly across all
 * static hosting platforms, Vite dev/preview servers, Cloud Run, and WhatsApp embeds
 * without triggering server 404s.
 */
export function getProfileShareUrl(userId: string): string {
  if (typeof window === 'undefined') {
    return `https://ais-pre-fizmycpefnx3h6mv5pzpno-684124925565.us-west2.run.app/?profile=${encodeURIComponent(userId)}&ref=share`;
  }

  let origin = window.location.origin;

  // In AI Studio preview, the shared app domain (ais-pre) is publicly reachable
  // from external smartphone cameras and external networks without internal dev-session restrictions.
  if (origin.includes('ais-dev-')) {
    origin = origin.replace('ais-dev-', 'ais-pre-');
  } else if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    // When running on localhost inside container, use the shared public deployment
    // so physical smartphone cameras pointing at the monitor will open the real site.
    origin = 'https://ais-pre-fizmycpefnx3h6mv5pzpno-684124925565.us-west2.run.app';
  }

  const path = window.location.pathname.replace(/\/$/, '');
  return `${origin}${path}/?profile=${encodeURIComponent(userId)}&ref=share`;
}

/**
 * Generates an official invitation URL to join the Qindica network.
 * Accessing this link or scanning the QR code immediately rewards the inviter with +1 trust star!
 */
export function getInviteUrl(userId: string): string {
  if (typeof window === 'undefined') {
    return `https://ais-pre-fizmycpefnx3h6mv5pzpno-684124925565.us-west2.run.app/?invite=${encodeURIComponent(userId)}`;
  }

  let origin = window.location.origin;

  if (origin.includes('ais-dev-')) {
    origin = origin.replace('ais-dev-', 'ais-pre-');
  } else if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    origin = 'https://ais-pre-fizmycpefnx3h6mv5pzpno-684124925565.us-west2.run.app';
  }

  const path = window.location.pathname.replace(/\/$/, '');
  return `${origin}${path}/?invite=${encodeURIComponent(userId)}`;
}

/**
 * Synchronizes the browser's address bar with the active route without reloading.
 */
export function syncUrlWithRoute(route: AppRoute) {
  if (typeof window === 'undefined' || !window.history?.pushState) return;

  try {
    const url = new URL(window.location.href);

    // Clear existing transient routing query params
    url.searchParams.delete('profile');
    url.searchParams.delete('u');
    url.searchParams.delete('user');
    url.searchParams.delete('q');
    url.searchParams.delete('tab');
    url.hash = '';

    switch (route.name) {
      case 'landing':
        url.searchParams.set('tab', 'landing');
        break;
      case 'design-system':
        url.searchParams.set('tab', 'design-system');
        break;
      case 'profile':
        url.searchParams.set('profile', route.userId);
        break;
      case 'search':
        if (route.initialQuery) {
          url.searchParams.set('q', route.initialQuery);
        } else {
          url.searchParams.set('tab', 'search');
        }
        break;
      case 'share':
        url.searchParams.set('tab', 'share');
        if (route.userId) {
          url.searchParams.set('profile', route.userId);
        }
        break;
      case 'profile-me':
        url.searchParams.set('tab', 'me');
        break;
      case 'edit':
        url.searchParams.set('tab', 'edit');
        break;
      case 'auth':
        url.searchParams.set('tab', 'auth');
        break;
      case 'home':
      default:
        // Clean URL for home
        break;
    }

    const newUrl = url.pathname + (url.search ? url.search : '') + (url.hash ? url.hash : '');
    const currentUrl = window.location.pathname + window.location.search + window.location.hash;

    if (newUrl !== currentUrl) {
      window.history.pushState({ route }, '', newUrl);
    }
  } catch (err) {
    console.error('Failed to sync URL with route:', err);
  }
}
