import { AppRoute } from '../types';

export const STORAGE_KEY_SEEN_LP = 'qindica_has_entered_app';

/**
 * Checks whether the visitor has already explored the app or is logged in.
 */
export function hasUserExploredApp(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const hasSeen = localStorage.getItem(STORAGE_KEY_SEEN_LP);
    const hasUser = localStorage.getItem('qindica_current_user');
    return Boolean(hasSeen === 'true' || hasUser);
  } catch {
    return false;
  }
}

/**
 * Marks that the user chose to enter / explore the app, so subsequent visits
 * to root '/' can land directly on the App's home page if desired.
 */
export function markAppExplored(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SEEN_LP, 'true');
  } catch {
    // Ignore storage errors
  }
}

/**
 * Parses the current URL (query params, hash, or pathname) to determine the AppRoute.
 * This ensures direct links, shared links, and QR codes land immediately on the intended profile,
 * while first-time/direct visitors to the root URL land on the Landing Page.
 */
export function parseRouteFromLocation(): AppRoute {
  if (typeof window === 'undefined') {
    return { name: 'landing' };
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
      markAppExplored();
      return {
        name: 'share',
        userId: profileParam || undefined,
        initialTab: typeParam === 'profile' ? 'profile' : 'invite',
      };
    }

    if (inviteParam) {
      markAppExplored();
      return { name: 'home', invitedBy: inviteParam };
    }

    if (profileParam) {
      markAppExplored();
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
      markAppExplored();
      return { name: 'search', initialQuery: queryParam };
    }

    // 3. Tab query params: ?tab=app | home | me | search | share | edit | auth | landing | lp | design-system | brand
    if (tabParam === 'landing' || tabParam === 'lp') {
      return { name: 'landing' };
    }
    if (tabParam === 'design-system' || tabParam === 'brand' || tabParam === 'bds') {
      return { name: 'design-system' };
    }
    if (tabParam === 'app' || tabParam === 'home') {
      markAppExplored();
      return { name: 'home' };
    }
    if (tabParam === 'me' || tabParam === 'profile-me') {
      markAppExplored();
      return { name: 'profile-me' };
    }
    if (tabParam === 'search') {
      markAppExplored();
      return { name: 'search' };
    }
    if (tabParam === 'edit') {
      markAppExplored();
      return { name: 'edit' };
    }
    if (tabParam === 'auth') {
      markAppExplored();
      return { name: 'auth' };
    }

    // 4. Pathname parsing: /profile/:userId or /p/:userId or /landing or /design-system or /app
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts.includes('landing') || pathParts.includes('lp')) {
      return { name: 'landing' };
    }
    if (pathParts.includes('design-system') || pathParts.includes('brand') || pathParts.includes('bds')) {
      return { name: 'design-system' };
    }
    if (pathParts.includes('app') || pathParts.includes('feed') || pathParts.includes('explore')) {
      markAppExplored();
      return { name: 'home' };
    }
    const profileIdx = pathParts.findIndex((p) => p === 'profile' || p === 'p');
    if (profileIdx !== -1 && pathParts[profileIdx + 1]) {
      markAppExplored();
      return {
        name: 'profile',
        userId: decodeURIComponent(pathParts[profileIdx + 1]),
      };
    }

    // 5. Hash routing fallback: #/profile/user_X or #profile=user_X or #landing or #app
    if (url.hash) {
      const cleanHash = url.hash.replace(/^#\/?/, '');
      if (cleanHash === 'landing' || cleanHash === 'lp') {
        return { name: 'landing' };
      }
      if (cleanHash === 'app' || cleanHash === 'home') {
        markAppExplored();
        return { name: 'home' };
      }
      if (cleanHash.startsWith('profile/')) {
        const id = cleanHash.replace('profile/', '');
        if (id) {
          markAppExplored();
          return { name: 'profile', userId: decodeURIComponent(id) };
        }
      }
      const hashParams = new URLSearchParams(cleanHash);
      const hashProfile = hashParams.get('profile') || hashParams.get('u');
      if (hashProfile) {
        markAppExplored();
        return { name: 'profile', userId: hashProfile };
      }
    }

    // 6. Root URL '/' evaluation:
    // If the visitor already explored the app or has an active session/profile, land on 'home'.
    // Otherwise, first-time visitors default to the Landing Page ('landing')!
    if (hasUserExploredApp()) {
      return { name: 'home' };
    }
    return { name: 'landing' };
  } catch (error) {
    console.error('Failed to parse route from location:', error);
  }

  return { name: 'landing' };
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
        // If the user has already explored the app and manually chooses Landing, show ?tab=landing
        // If not yet explored (first access), leave URL clean at root /
        if (hasUserExploredApp()) {
          url.searchParams.set('tab', 'landing');
        }
        break;
      case 'design-system':
        url.searchParams.set('tab', 'design-system');
        break;
      case 'home':
        // When visiting the app feed, if user entered from root, keep ?tab=app so it is directly bookmarkable
        url.searchParams.set('tab', 'app');
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
      default:
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
