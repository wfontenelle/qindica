import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { User, Indication, ToastMessage, AppRoute, AuthMode, GeoLocation } from '../types';
import { INITIAL_USERS, INITIAL_CURRENT_USER, INITIAL_INDICATIONS, CURRENT_USER_ID } from '../data/seedData';
import { calculateNetworkDistances, UserNetworkStats, ReferrerAvatar } from '../utils/networkGraph';
import { parseRouteFromLocation, syncUrlWithRoute, markAppExplored } from '../utils/routes';
import { calculateDistanceKm, fetchAddressByCep, getBrowserGeolocation } from '../utils/geo';
import { auth, db, googleProvider } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';

interface AppContextType {
  users: User[];
  currentUser: User;
  indications: Indication[];
  currentRoute: AppRoute;
  routeHistory: AppRoute[];
  navigate: (route: AppRoute) => void;
  goBack: () => void;
  isIndicatedByMe: (userId: string) => boolean;
  toggleIndication: (userId: string) => Promise<void>;
  updateCurrentUser: (updated: Partial<User>) => Promise<void>;
  getUserById: (id: string) => User | undefined;
  getUserNetworkStats: (userId: string) => UserNetworkStats;
  networkStats: Map<string, UserNetworkStats>;
  toasts: ToastMessage[];
  showToast: (text: string) => void;
  dismissToast: (id: string) => void;
  isDbConnected: boolean;

  // Theme additions
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Auth additions
  authUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: AuthMode;
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, pass: string, phone?: string, whatsapp?: boolean) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;

  // Geolocation & Distance additions
  userLocation: GeoLocation | null;
  setUserLocation: (loc: GeoLocation | null) => void;
  setUserCep: (cep: string) => Promise<boolean>;
  requestGpsLocation: () => Promise<boolean>;
  getUserDistance: (user: User) => number | null;

  // Invite & Referral additions
  activeInviter: User | null;
  dismissInviterBanner: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_USERS = 'qindica_users_v4';
const STORAGE_KEY_ME = 'qindica_me_v4';
const STORAGE_KEY_INDICATIONS = 'qindica_indications_v4';
const STORAGE_KEY_LOCATION = 'qindica_user_location_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ME);
      return saved ? JSON.parse(saved) : INITIAL_CURRENT_USER;
    } catch {
      return INITIAL_CURRENT_USER;
    }
  });

  const [indications, setIndications] = useState<Indication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INDICATIONS);
      const parsed: Indication[] = saved ? JSON.parse(saved) : INITIAL_INDICATIONS;
      return parsed.filter((i) => !i.fromUserId.startsWith('convite_'));
    } catch {
      return INITIAL_INDICATIONS;
    }
  });

  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => parseRouteFromLocation());
  const [routeHistory, setRouteHistory] = useState<AppRoute[]>(() => [parseRouteFromLocation()]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);

  // Geolocation state (for both guest visitors and authenticated users)
  const [userLocation, setUserLocationState] = useState<GeoLocation | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOCATION);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const setUserLocation = useCallback((loc: GeoLocation | null) => {
    setUserLocationState(loc);
    try {
      if (loc) {
        localStorage.setItem(STORAGE_KEY_LOCATION, JSON.stringify(loc));
      } else {
        localStorage.removeItem(STORAGE_KEY_LOCATION);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Sync route on popstate (browser back/forward or direct navigation)
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.route) {
        setCurrentRoute(e.state.route);
      } else {
        setCurrentRoute(parseRouteFromLocation());
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Dark Mode Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('qindica_theme_mode');
      if (saved !== null) {
        return saved === 'dark';
      }
      return Boolean(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        localStorage.setItem('qindica_theme_mode', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        localStorage.setItem('qindica_theme_mode', 'light');
      }
    } catch {
      // Ignore
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  // Authentication states
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('login');

  // Active inviter state (for welcoming banner when arriving via ?invite=userId or ?profile=userId&ref=share)
  const [activeInviterId, setActiveInviterId] = useState<string | null>(() => {
    try {
      const url = new URL(window.location.href);
      return (
        url.searchParams.get('invite') ||
        url.searchParams.get('convite') ||
        (url.searchParams.get('ref') === 'share' ? url.searchParams.get('profile') : null) ||
        null
      );
    } catch {
      return null;
    }
  });

  const activeInviter = useMemo(() => {
    if (!activeInviterId) return null;
    return users.find((u) => u.id === activeInviterId) || null;
  }, [activeInviterId, users]);

  const dismissInviterBanner = useCallback(() => {
    setActiveInviterId(null);
  }, []);

  const showToast = useCallback((text: string) => {
    const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastMessage = { id, text };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const openAuthModal = useCallback((mode: AuthMode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  // Local storage backups
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ME, JSON.stringify(currentUser));
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INDICATIONS, JSON.stringify(indications));
    } catch (e) {
      console.error(e);
    }
  }, [indications]);

  // Auth State Listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      setIsAuthLoading(true);
      if (fbUser) {
        markAppExplored();
        setAuthUser(fbUser);
        setIsAuthenticated(true);

        try {
          // Check if user doc exists in Firestore
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const data = userSnap.data() as User;
            const profile: User = {
              ...data,
              id: fbUser.uid,
              tags: Array.isArray(data.tags) ? data.tags : [],
              indicationCount: Number(data.indicationCount) || 0,
            };
            setCurrentUser(profile);
          } else {
            // Create user profile in Firestore
            const newProfile: User = {
              id: fbUser.uid,
              name: fbUser.displayName || 'Novo Usuário',
              bio: 'Profissional na rede Qindica',
              photo:
                fbUser.photoURL ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  fbUser.displayName || 'User'
                )}&background=7B2FFF&color=fff&size=200`,
              tags: ['Tecnologia', 'Networking'],
              presentationText:
                'Olá! Faço parte da rede Qindica para indicar e receber recomendações de profissionais de confiança.',
              email: fbUser.email || '',
              phone: '',
              whatsapp: true,
              indicationCount: 0,
            };
            await setDoc(userDocRef, newProfile);
            setCurrentUser(newProfile);
          }
        } catch (err) {
          console.error('Error synchronizing user profile after auth:', err);
        }
      } else {
        setAuthUser(null);
        setIsAuthenticated(false);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Real-time Firestore sync: Users & Indications collections
  useEffect(() => {
    const usersColRef = collection(db, 'users');

    const unsubscribeUsers = onSnapshot(
      usersColRef,
      async (snapshot) => {
        const isFromCache = snapshot.metadata.fromCache;
        setIsDbConnected(!isFromCache);

        if (snapshot.empty) {
          // Only perform initial seed when confirmed empty directly from server
          if (isFromCache) {
            return;
          }
          try {
            const batch = writeBatch(db);
            const meRef = doc(db, 'users', CURRENT_USER_ID);
            batch.set(meRef, INITIAL_CURRENT_USER);

            INITIAL_USERS.forEach((u) => {
              const uRef = doc(db, 'users', u.id);
              batch.set(uRef, u);
            });

            await batch.commit();
          } catch (err: any) {
            if (err?.code === 'permission-denied') {
              handleFirestoreError(err, OperationType.WRITE, 'users');
            } else {
              console.warn('Notice seeding users to Firestore:', err);
            }
          }
        } else {
          const loadedUsers: User[] = [];
          const currentUid = auth.currentUser?.uid;
          let loadedMe: User | null = null;

          const updatesToPersist: { id: string; locationData: Partial<User> }[] = [];

          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as User;
            const seedFallback = INITIAL_USERS.find((u) => u.id === docSnap.id);

            // If Firestore document doesn't have CEP or coords yet, queue it to update Firestore
            if (!isFromCache && (!data.cep || data.latitude === undefined) && seedFallback?.cep) {
              updatesToPersist.push({
                id: docSnap.id,
                locationData: {
                  cep: seedFallback.cep,
                  city: seedFallback.city || '',
                  state: seedFallback.state || '',
                  neighborhood: seedFallback.neighborhood || '',
                  street: seedFallback.street || '',
                  latitude: seedFallback.latitude,
                  longitude: seedFallback.longitude,
                },
              });
            }

            const fullUser: User = {
              ...seedFallback,
              ...data,
              id: docSnap.id,
              tags: Array.isArray(data.tags) && data.tags.length > 0 ? data.tags : (seedFallback?.tags || []),
              indicationCount: Number(data.indicationCount) || seedFallback?.indicationCount || 0,
              whatsapp: data.whatsapp !== undefined ? Boolean(data.whatsapp) : (seedFallback?.whatsapp !== undefined ? seedFallback.whatsapp : true),
              createdAt: data.createdAt || seedFallback?.createdAt || new Date(Date.now() - (parseInt(docSnap.id.replace(/\D/g, '') || '10') * 86400000 * 4)).toISOString(),
              cep: data.cep || seedFallback?.cep,
              city: data.city || seedFallback?.city,
              state: data.state || seedFallback?.state,
              neighborhood: data.neighborhood || seedFallback?.neighborhood,
              street: data.street || seedFallback?.street,
              latitude: data.latitude ?? seedFallback?.latitude,
              longitude: data.longitude ?? seedFallback?.longitude,
            };

            if (currentUid && docSnap.id === currentUid) {
              loadedMe = fullUser;
            }
            loadedUsers.push(fullUser);
          });

          // Write missing location fields (CEP, coords, city) directly into Firestore documents only when connected
          if (!isFromCache && updatesToPersist.length > 0) {
            const batch = writeBatch(db);
            updatesToPersist.forEach(({ id, locationData }) => {
              batch.set(doc(db, 'users', id), locationData, { merge: true });
            });
            batch.commit().catch((err) => {
              if (err?.code === 'permission-denied') {
                handleFirestoreError(err, OperationType.UPDATE, 'users');
              } else {
                console.warn('Notice migrating CEP fields to Firestore:', err);
              }
            });
          }

          // Sort loaded users by indicationCount descending for ranking consistency
          loadedUsers.sort((a, b) => b.indicationCount - a.indicationCount);

          if (loadedUsers.length > 0) {
            setUsers(loadedUsers);
          }
          if (loadedMe) {
            setCurrentUser(loadedMe);
          }

          // Ensure any newly introduced seed users are present in Firestore when connected
          if (!isFromCache) {
            INITIAL_USERS.forEach((u) => {
              if (!loadedUsers.some((lu) => lu.id === u.id)) {
                const uRef = doc(db, 'users', u.id);
                setDoc(uRef, u).catch((err) => {
                  if (err?.code === 'permission-denied') {
                    handleFirestoreError(err, OperationType.CREATE, `users/${u.id}`);
                  }
                });
              }
            });
          }
        }
      },
      (error: any) => {
        setIsDbConnected(false);
        if (error?.code === 'permission-denied') {
          handleFirestoreError(error, OperationType.LIST, 'users');
        } else {
          console.warn('Firestore users onSnapshot operating in offline mode:', error?.message || error);
        }
      }
    );

    // Real-time Firestore sync: Indications collection
    const indicationsColRef = collection(db, 'indications');
    const unsubscribeIndications = onSnapshot(
      indicationsColRef,
      async (snapshot) => {
        const isFromCache = snapshot.metadata.fromCache;
        const loadedIndications: Indication[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Indication;
          if (data && data.fromUserId && data.toUserId) {
            loadedIndications.push({
              fromUserId: data.fromUserId,
              toUserId: data.toUserId,
              createdAt: data.createdAt || new Date().toISOString(),
            });
          }
        });

        // Set indications state
        setIndications(loadedIndications);

        // Only synchronize missing chains if connected to server
        if (isFromCache) {
          return;
        }

        try {
          const batch = writeBatch(db);
          let hasMissingChains = false;

          // 1. Ensure inter-user chain links (from 2nd degree down through 5th degree)
          INITIAL_INDICATIONS.forEach((ind) => {
            if (ind.fromUserId !== CURRENT_USER_ID) {
              const exists = loadedIndications.some(
                (li) => li.fromUserId === ind.fromUserId && li.toUserId === ind.toUserId
              );
              if (!exists) {
                hasMissingChains = true;
                const docId = `chain_${ind.fromUserId}_${ind.toUserId}`;
                batch.set(doc(db, 'indications', docId), ind);
              }
            }
          });

          // 2. Ensure active user (or user_me) has starter 1st degree connections
          const currentUid = auth.currentUser?.uid || CURRENT_USER_ID;
          const userHasIndications = loadedIndications.some(
            (li) => li.fromUserId === currentUid
          );

          if (!userHasIndications) {
            hasMissingChains = true;
            const starterTargets = ['user_1', 'user_2', 'user_4', 'user_6'];
            starterTargets.forEach((targetId) => {
              const docId = `user_starter_${currentUid}_${targetId}`;
              batch.set(doc(db, 'indications', docId), {
                fromUserId: currentUid,
                toUserId: targetId,
                createdAt: new Date().toISOString(),
              });
            });

            // Incoming recommendations for current user so they have referrers
            const inboundReferrers = ['user_1', 'user_2'];
            inboundReferrers.forEach((fromId) => {
              const exists = loadedIndications.some(
                (li) => li.fromUserId === fromId && li.toUserId === currentUid
              );
              if (!exists) {
                const docId = `user_inbound_${fromId}_${currentUid}`;
                batch.set(doc(db, 'indications', docId), {
                  fromUserId: fromId,
                  toUserId: currentUid,
                  createdAt: new Date().toISOString(),
                });
              }
            });
          }

          // Always ensure user_me has connections for guest preview
          const userMeHasIndications = loadedIndications.some(
            (li) => li.fromUserId === CURRENT_USER_ID
          );
          if (!userMeHasIndications && currentUid !== CURRENT_USER_ID) {
            hasMissingChains = true;
            const starterTargets = ['user_1', 'user_2', 'user_4', 'user_6'];
            starterTargets.forEach((targetId) => {
              const docId = `user_starter_user_me_${targetId}`;
              batch.set(doc(db, 'indications', docId), {
                fromUserId: CURRENT_USER_ID,
                toUserId: targetId,
                createdAt: new Date().toISOString(),
              });
            });
          }

          if (hasMissingChains) {
            await batch.commit();
          }
        } catch (err: any) {
          if (err?.code === 'permission-denied') {
            handleFirestoreError(err, OperationType.WRITE, 'indications');
          } else {
            console.warn('Notice synchronizing multi-degree chain in Firestore:', err);
          }
        }
      },
      (error: any) => {
        if (error?.code === 'permission-denied') {
          handleFirestoreError(error, OperationType.LIST, 'indications');
        } else {
          console.warn('Firestore indications onSnapshot operating in offline mode:', error?.message || error);
        }
      }
    );

    return () => {
      unsubscribeUsers();
      unsubscribeIndications();
    };
  }, []);

  const navigate = useCallback((route: AppRoute) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (route.name !== 'landing' && route.name !== 'design-system') {
      markAppExplored();
    }
    setCurrentRoute(route);
    syncUrlWithRoute(route);
    setRouteHistory((prev) => [...prev, route]);
  }, []);

  const goBack = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setRouteHistory((prev) => {
      if (prev.length > 1) {
        const nextHist = prev.slice(0, prev.length - 1);
        const prevRoute = nextHist[nextHist.length - 1];
        setCurrentRoute(prevRoute);
        syncUrlWithRoute(prevRoute);
        return nextHist;
      }
      const homeRoute: AppRoute = { name: 'home' };
      setCurrentRoute(homeRoute);
      syncUrlWithRoute(homeRoute);
      return [{ name: 'home' }];
    });
  }, []);

  // Establish mutual 1st-degree connection and award +1 star to the inviter upon registration
  const connectReferralAndAwardStar = useCallback(
    async (newUserId: string, newUserName: string) => {
      const pendingInviterId =
        sessionStorage.getItem('qindica_pending_inviter') ||
        localStorage.getItem('qindica_pending_inviter');

      if (!pendingInviterId || pendingInviterId === newUserId) {
        return;
      }

      try {
        // Direct indication from newly registered user to the inviter (grants inviter the trust star)
        const indDocId = `ind_${newUserId}_${pendingInviterId}`;
        const recipDocId = `ind_${pendingInviterId}_${newUserId}`;

        // Check if connection already exists to prevent duplicate stars
        const existingIndDoc = await getDoc(doc(db, 'indications', indDocId));
        if (existingIndDoc.exists()) {
          sessionStorage.removeItem('qindica_pending_inviter');
          localStorage.removeItem('qindica_pending_inviter');
          setActiveInviterId(null);
          return;
        }

        const directIndication: Indication = {
          fromUserId: newUserId,
          toUserId: pendingInviterId,
          createdAt: new Date().toISOString(),
        };

        // Reciprocal connection indication so both users become direct 1st-degree contacts in the network
        const reciprocalIndication: Indication = {
          fromUserId: pendingInviterId,
          toUserId: newUserId,
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, 'indications', indDocId), directIndication);
        await setDoc(doc(db, 'indications', recipDocId), reciprocalIndication);

        setIndications((prev) => {
          const filtered = prev.filter(
            (i) =>
              !(i.fromUserId === newUserId && i.toUserId === pendingInviterId) &&
              !(i.fromUserId === pendingInviterId && i.toUserId === newUserId)
          );
          return [...filtered, directIndication, reciprocalIndication];
        });

        // Fetch inviter and increment indicationCount (+1 Star)
        const inviterDocRef = doc(db, 'users', pendingInviterId);
        const inviterSnap = await getDoc(inviterDocRef);
        let inviterName = 'seu contato';

        if (inviterSnap.exists()) {
          const inviterData = inviterSnap.data() as User;
          inviterName = inviterData.name ? inviterData.name.split(' ')[0] : inviterName;
          const newCount = (Number(inviterData.indicationCount) || 0) + 1;
          await setDoc(
            inviterDocRef,
            { indicationCount: newCount },
            { merge: true }
          );

          setUsers((prev) =>
            prev.map((u) =>
              u.id === pendingInviterId
                ? { ...u, indicationCount: newCount }
                : u
            )
          );

          if (currentUser.id === pendingInviterId) {
            setCurrentUser((prev) => ({
              ...prev,
              indicationCount: newCount,
            }));
          }
        } else {
          const target = users.find((u) => u.id === pendingInviterId);
          if (target) {
            inviterName = target.name.split(' ')[0];
            const newCount = (target.indicationCount || 0) + 1;
            await setDoc(
              inviterDocRef,
              { ...target, indicationCount: newCount },
              { merge: true }
            );
            setUsers((prev) =>
              prev.map((u) =>
                u.id === pendingInviterId
                  ? { ...u, indicationCount: newCount }
                  : u
              )
            );
            if (currentUser.id === pendingInviterId) {
              setCurrentUser((prev) => ({
                ...prev,
                indicationCount: newCount,
              }));
            }
          }
        }

        // Clean up pending referral keys
        sessionStorage.removeItem('qindica_pending_inviter');
        localStorage.removeItem('qindica_pending_inviter');
        setActiveInviterId(null);

        showToast(
          `🎉 Cadastro concluído! Conexão realizada com ${inviterName} e +1 estrela de indicação concedida! ⭐`
        );
      } catch (e) {
        console.error('Failed to link referral connection and award star:', e);
      }
    },
    [users, currentUser.id, showToast]
  );

  // Auth Methods
  const loginWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      markAppExplored();

      // Link referral and award star upon registration / initial sign-in
      await connectReferralAndAwardStar(user.uid, user.displayName || 'Novo Usuário');

      showToast(`Bem-vindo(a), ${user.displayName?.split(' ')[0] || 'usuário'}! 👋`);
      closeAuthModal();

      // Exit Landing Page directly into the App
      if (currentRoute.name === 'landing' || currentRoute.name === 'auth') {
        navigate({ name: 'home' });
      }
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        return;
      }
      console.error('Google Sign-In Error:', error);
      if (error.code === 'auth/unauthorized-domain') {
        showToast('Domínio não autorizado no Firebase. Adicione o domínio nas configurações do Authentication no Firebase Console.');
      } else if (error.code === 'auth/operation-not-allowed') {
        showToast('Provedor Google não está ativado no Firebase Console (Authentication > Sign-in method).');
      } else if (error.code === 'auth/popup-blocked') {
        showToast('O navegador bloqueou a janela de login. Por favor, permita popups.');
      } else {
        showToast(`Falha no login com Google: ${error.message || 'Tente novamente.'}`);
      }
      throw error;
    }
  }, [showToast, closeAuthModal, connectReferralAndAwardStar, currentRoute.name, navigate]);

  const loginWithEmail = useCallback(
    async (email: string, pass: string) => {
      try {
        const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
        const user = result.user;
        markAppExplored();
        showToast(`Bem-vindo(a) de volta, ${user.displayName?.split(' ')[0] || 'usuário'}!`);
        closeAuthModal();

        // Exit Landing Page directly into the App
        if (currentRoute.name === 'landing' || currentRoute.name === 'auth') {
          navigate({ name: 'home' });
        }
      } catch (error: any) {
        let msg = 'Erro ao realizar login. Verifique seus dados.';
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
          msg = 'E-mail ou senha incorretos.';
        } else if (error.code === 'auth/invalid-email') {
          msg = 'Formato de e-mail inválido.';
        } else if (error.code === 'auth/too-many-requests') {
          msg = 'Muitas tentativas. Tente novamente em alguns instantes.';
        }
        showToast(msg);
        throw error;
      }
    },
    [showToast, closeAuthModal, currentRoute.name, navigate]
  );

  const registerWithEmail = useCallback(
    async (name: string, email: string, pass: string, phone?: string, whatsapp?: boolean) => {
      try {
        const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
        const user = result.user;

        await updateProfile(user, {
          displayName: name.trim(),
          photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name.trim()
          )}&background=7B2FFF&color=fff&size=200`,
        });

        // Initialize Firestore Profile
        const newProfile: User = {
          id: user.uid,
          name: name.trim(),
          bio: 'Profissional na rede Qindica',
          photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name.trim()
          )}&background=7B2FFF&color=fff&size=200`,
          tags: ['Geral', 'Networking'],
          presentationText: 'Olá! Sou novo na rede Qindica.',
          email: email.trim(),
          phone: phone ? phone.trim() : '',
          whatsapp: whatsapp !== undefined ? Boolean(whatsapp) : true,
          indicationCount: 0,
        };

        await setDoc(doc(db, 'users', user.uid), newProfile);
        setCurrentUser(newProfile);
        setUsers((prev) => [newProfile, ...prev.filter((u) => u.id !== user.uid)]);

        // Link referral, create mutual connection and award +1 star to the inviter
        await connectReferralAndAwardStar(user.uid, name);

        markAppExplored();
        showToast('Conta criada com sucesso! 🎉');
        closeAuthModal();

        // Exit Landing Page directly into the App
        if (currentRoute.name === 'landing' || currentRoute.name === 'auth') {
          navigate({ name: 'home' });
        }
      } catch (error: any) {
        let msg = 'Erro ao cadastrar. Tente novamente.';
        if (error.code === 'auth/email-already-in-use') {
          msg = 'Este e-mail já está cadastrado. Faça login.';
        } else if (error.code === 'auth/weak-password') {
          msg = 'A senha deve ter pelo menos 6 caracteres.';
        } else if (error.code === 'auth/invalid-email') {
          msg = 'E-mail inválido.';
        }
        showToast(msg);
        throw error;
      }
    },
    [showToast, closeAuthModal, connectReferralAndAwardStar, currentRoute.name, navigate]
  );

  const resetPassword = useCallback(
    async (email: string) => {
      try {
        await sendPasswordResetEmail(auth, email.trim());
        showToast('Link de recuperação enviado para o seu e-mail! 📬');
      } catch (error: any) {
        let msg = 'Erro ao enviar e-mail de recuperação.';
        if (error.code === 'auth/user-not-found') {
          msg = 'Nenhum usuário encontrado com este e-mail.';
        }
        showToast(msg);
        throw error;
      }
    },
    [showToast]
  );

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      showToast('Você saiu da sua conta.');
      navigate({ name: 'home' });
    } catch (error) {
      console.error('Logout error:', error);
      showToast('Erro ao sair da conta.');
    }
  }, [showToast, navigate]);

  const isIndicatedByMe = useCallback(
    (userId: string) => {
      const activeId = currentUser.id;
      return indications.some(
        (ind) => ind.fromUserId === activeId && ind.toUserId === userId
      );
    },
    [indications, currentUser.id]
  );

  const toggleIndication = useCallback(
    async (userId: string) => {
      // Prompt auth if user is on default seed account and not signed in with Firebase
      if (!auth.currentUser && !isAuthenticated) {
        showToast('Faça login ou cadastre-se para indicar profissionais!');
        openAuthModal('login');
        return;
      }

      const activeUserId = currentUser.id;
      if (activeUserId === userId) {
        showToast('Você não pode indicar a si mesmo!');
        return;
      }

      const alreadyIndicated = indications.some(
        (ind) => ind.fromUserId === activeUserId && ind.toUserId === userId
      );

      const targetUser = users.find((u) => u.id === userId);
      const currentCount = targetUser ? targetUser.indicationCount : 0;
      const indDocId = `ind_${activeUserId}_${userId}`;

      if (alreadyIndicated) {
        const newCount = Math.max(0, currentCount - 1);

        // Optimistic UI update
        setIndications((prev) =>
          prev.filter(
            (ind) => !(ind.fromUserId === activeUserId && ind.toUserId === userId)
          )
        );
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, indicationCount: newCount } : u
          )
        );

        // Firestore update
        try {
          await deleteDoc(doc(db, 'indications', indDocId));
          if (targetUser) {
            await setDoc(
              doc(db, 'users', userId),
              { ...targetUser, indicationCount: newCount },
              { merge: true }
            );
          }
        } catch (err) {
          console.error('Firestore delete indication error:', err);
        }
      } else {
        const newCount = currentCount + 1;
        const newIndication: Indication = {
          fromUserId: activeUserId,
          toUserId: userId,
          createdAt: new Date().toISOString(),
        };

        // Optimistic UI update
        setIndications((prev) => [...prev, newIndication]);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, indicationCount: newCount } : u
          )
        );
        showToast('⭐ Indicado com sucesso!');

        // Firestore update
        try {
          await setDoc(doc(db, 'indications', indDocId), newIndication);
          if (targetUser) {
            await setDoc(
              doc(db, 'users', userId),
              { ...targetUser, indicationCount: newCount },
              { merge: true }
            );
          }
        } catch (err) {
          console.error('Firestore set indication error:', err);
        }
      }
    },
    [indications, users, currentUser.id, isAuthenticated, openAuthModal, showToast]
  );

  // Auto-detect invite or share URL parameter on load and register pending inviter
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const inviteId =
        url.searchParams.get('invite') ||
        url.searchParams.get('convite');
      const profileId =
        url.searchParams.get('profile') ||
        url.searchParams.get('u');
      const isShare =
        url.searchParams.get('ref') === 'share' ||
        url.searchParams.get('src') === 'share';

      const targetId = inviteId || (isShare && profileId ? profileId : null);

      if (targetId) {
        // Save pending inviter in session and local storage so that upon registration,
        // the two users connect directly and the inviter receives +1 star
        sessionStorage.setItem('qindica_pending_inviter', targetId);
        localStorage.setItem('qindica_pending_inviter', targetId);
        setActiveInviterId(targetId);

        // Don't show toast to the user if viewing their own link
        if (currentUser.id === targetId && isAuthenticated) {
          return;
        }

        const inviter = users.find((u) => u.id === targetId);
        const inviterFirstName = inviter ? inviter.name.split(' ')[0] : 'um contato';

        if (!isAuthenticated) {
          showToast(
            `👋 Você acessou pelo convite de ${inviterFirstName}! Crie sua conta para se conectarem em 1º grau e conceder +1 estrela a ele(a).`
          );
        }
      }
    } catch (e) {
      console.error('Error parsing invite param:', e);
    }
  }, [users, currentUser.id, isAuthenticated, showToast]);

  const updateCurrentUser = useCallback(
    async (updated: Partial<User>) => {
      const merged = { ...currentUser, ...updated };
      setCurrentUser(merged);
      setUsers((prev) => {
        const exists = prev.some((u) => u.id === merged.id);
        if (exists) {
          return prev.map((u) => (u.id === merged.id ? merged : u));
        }
        return [merged, ...prev];
      });
      showToast('Perfil atualizado com sucesso!');

      try {
        await setDoc(doc(db, 'users', currentUser.id), merged, { merge: true });
      } catch (err) {
        console.error('Firestore update profile error:', err);
      }
    },
    [currentUser, showToast]
  );

  const getUserById = useCallback(
    (id: string) => {
      if (!id) return undefined;
      if (id === 'me') {
        return currentUser;
      }
      // If matching the authenticated user's ID, return the live currentUser
      if (isAuthenticated && currentUser.id && id === currentUser.id) {
        return currentUser;
      }
      // Search in all users (finds Alexandre Souza by his id 'user_me')
      const target = users.find((u) => u.id === id);
      if (target) {
        return target;
      }
      // Fallback only if id matches currentUser.id
      if (id === currentUser.id) {
        return currentUser;
      }
      return undefined;
    },
    [currentUser, users, isAuthenticated]
  );

  // Real-time calculated network graph stats for all users based on active currentUser
  // When not logged in, no degree information is calculated or shown!
  const networkStats = React.useMemo(() => {
    if (!isAuthenticated) {
      const unauthStats = new Map<string, UserNetworkStats>();
      const incoming = new Map<string, Set<string>>();
      const userMap = new Map<string, User>();
      users.forEach((u) => {
        incoming.set(u.id, new Set());
        userMap.set(u.id, u);
      });
      indications.forEach((ind) => {
        incoming.get(ind.toUserId)?.add(ind.fromUserId);
      });

      users.forEach((u) => {
        const refs = incoming.get(u.id) || new Set();
        const allRefs: ReferrerAvatar[] = [];
        refs.forEach((refId) => {
          const ru = userMap.get(refId);
          if (ru) {
            allRefs.push({
              id: ru.id,
              name: ru.name.split(' ')[0],
              photo: ru.photo,
            });
          }
        });

        unauthStats.set(u.id, {
          degree: null,
          degreeLabel: '',
          mutualFirstDegreeCount: 0,
          mutualSecondDegreeCount: 0,
          firstDegreeReferrers: [],
          mutualReferrers: [],
          allReferrers: allRefs,
          pathDescription: undefined,
        });
      });
      return unauthStats;
    }

    return calculateNetworkDistances(currentUser.id, users, indications);
  }, [currentUser.id, users, indications, isAuthenticated]);

  const getUserNetworkStats = useCallback(
    (userId: string): UserNetworkStats => {
      if (!isAuthenticated) {
        const stats = networkStats.get(userId);
        if (stats) return stats;
        return {
          degree: null,
          degreeLabel: '',
          mutualFirstDegreeCount: 0,
          mutualSecondDegreeCount: 0,
          firstDegreeReferrers: [],
          mutualReferrers: [],
          allReferrers: [],
          pathDescription: undefined,
        };
      }

      const stats = networkStats.get(userId);
      if (stats) return stats;
      return {
        degree: null,
        degreeLabel: 'Fora da rede',
        mutualFirstDegreeCount: 0,
        mutualSecondDegreeCount: 0,
        firstDegreeReferrers: [],
        mutualReferrers: [],
        allReferrers: [],
        pathDescription: 'Fora da sua rede de conexões direta',
      };
    },
    [networkStats, isAuthenticated]
  );

  // Geolocation helpers
  const setUserCep = useCallback(
    async (cepInput: string): Promise<boolean> => {
      const result = await fetchAddressByCep(cepInput);
      if (!result) {
        showToast('CEP não encontrado. Digite um CEP válido com 8 dígitos.');
        return false;
      }
      const newLoc: GeoLocation = {
        latitude: result.latitude,
        longitude: result.longitude,
        city: result.city,
        state: result.state,
        neighborhood: result.neighborhood,
        cep: result.cep,
        source: 'cep',
      };
      setUserLocation(newLoc);
      showToast(`Localização definida: ${result.neighborhood ? `${result.neighborhood}, ` : ''}${result.city} - ${result.state}`);
      return true;
    },
    [setUserLocation, showToast]
  );

  const requestGpsLocation = useCallback(async (): Promise<boolean> => {
    try {
      const coords = await getBrowserGeolocation();
      const newLoc: GeoLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        source: 'gps',
      };
      setUserLocation(newLoc);
      showToast('Sua localização GPS foi detectada com sucesso!');
      return true;
    } catch (err) {
      console.error('GPS error:', err);
      showToast('Não foi possível obter sua localização GPS. Verifique a permissão do navegador.');
      return false;
    }
  }, [setUserLocation, showToast]);

  const getUserDistance = useCallback(
    (user: User): number | null => {
      const refLoc =
        isAuthenticated && currentUser.latitude != null && currentUser.longitude != null
          ? { latitude: currentUser.latitude, longitude: currentUser.longitude }
          : userLocation;

      if (!refLoc || user.latitude == null || user.longitude == null) {
        return null;
      }
      const dist = calculateDistanceKm(
        refLoc.latitude,
        refLoc.longitude,
        user.latitude,
        user.longitude
      );
      return isNaN(dist) ? null : dist;
    },
    [isAuthenticated, currentUser, userLocation]
  );

  return (
    <AppContext.Provider
      value={{
        users,
        currentUser,
        indications,
        currentRoute,
        routeHistory,
        navigate,
        goBack,
        isIndicatedByMe,
        toggleIndication,
        updateCurrentUser,
        getUserById,
        getUserNetworkStats,
        networkStats,
        toasts,
        showToast,
        dismissToast,
        isDbConnected,

        // Theme
        isDarkMode,
        toggleDarkMode,

        // Auth
        authUser,
        isAuthenticated,
        isAuthLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        resetPassword,
        logout,

        // Geolocation additions
        userLocation,
        setUserLocation,
        setUserCep,
        requestGpsLocation,
        getUserDistance,

        // Invite & Referral additions
        activeInviter,
        dismissInviterBanner,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
