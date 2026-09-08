export interface User {
  id: string;
  name: string;
  bio: string;
  photo: string;
  tags: string[];
  presentationText: string;
  email: string;
  phone: string;
  whatsapp?: boolean;
  indicationCount: number;
  createdAt?: string; // ISO date string of user account creation
  // Geolocation & Address
  cep?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
  street?: string;
  latitude?: number;
  longitude?: number;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  neighborhood?: string;
  cep?: string;
  source?: 'gps' | 'cep' | 'profile';
}

export interface Indication {
  fromUserId: string;
  toUserId: string;
  createdAt: string;
}

export interface ToastMessage {
  id: string;
  text: string;
}

export type AuthMode = 'login' | 'register' | 'forgot';

export type AppRoute = 
  | { name: 'landing' }
  | { name: 'design-system' }
  | { name: 'home'; invitedBy?: string }
  | { name: 'search'; initialQuery?: string }
  | { name: 'profile'; userId: string; fromShare?: boolean; invitedBy?: string }
  | { name: 'profile-me' }
  | { name: 'edit' }
  | { name: 'share'; userId?: string; initialTab?: 'invite' | 'profile' }
  | { name: 'auth'; mode?: AuthMode; invitedBy?: string }
  | { name: 'onboarding' };
