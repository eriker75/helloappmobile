import { create, StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { createZustandAsyncStorage } from "@/src/config/zustandAsyncStorage";
import { UserProfile } from "../models/UserProfile.model";
import { LocationPermissionStatuses } from "@/src/definitions/enums/LocationPermissionStatuses.enum";

export interface AuthUserProfileState {
  access_token: string | null;
  refresh_token: string | null;
  user_id: number | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  error: Error | null;
  locationStatus: LocationPermissionStatuses;
  currentLocation: Location | null;
}

export interface AuthUserProfileActions {
  setTokens: (
    access_token: string,
    refresh_token: string,
    user_id: number
  ) => void;
  clearTokens: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  getUserId: () => number | null;
  setLoading: (loading: boolean) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setAuthUserProfileData: (userProfile: UserProfile | null) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  setError: (error: Error | null) => void;
  setLocationStatus: (status: LocationPermissionStatuses) => void;
  setCurrentLocation: (location: Location | null) => void;
  clear: () => void;
}

export type AuthUserProfileStore = AuthUserProfileState &
  AuthUserProfileActions;

// This type must match exactly what is returned by partialize
type PersistedAuthUserProfileState = {
  access_token: string | null;
  refresh_token: string | null;
  user_id: number | null;
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  locationStatus: LocationPermissionStatuses;
  currentLocation: Location | null;
};

const initialAuthState: AuthUserProfileState = {
  access_token: null,
  refresh_token: null,
  user_id: null,
  isLoading: false,
  isAuthenticated: false,
  userProfile: null,
  error: null,
  locationStatus: LocationPermissionStatuses.CHECKING,
  currentLocation: null,
};

const authUserProfileStoreCreator: StateCreator<
  AuthUserProfileStore,
  [],
  [["zustand/immer", never], ["zustand/persist", unknown]]
> = (set, get) => ({
  ...initialAuthState,
  setTokens: (access_token, refresh_token, user_id) =>
    set((state) => {
      state.access_token = access_token;
      state.refresh_token = refresh_token;
      state.user_id = user_id;
      state.isAuthenticated = true;
      state.isLoading = false;
      return state;
    }),
  clearTokens: () =>
    set((state) => {
      state.access_token = null;
      state.refresh_token = null;
      state.user_id = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      return state;
    }),
  getAccessToken: () => get().access_token,
  getRefreshToken: () => get().refresh_token,
  getUserId: () => get().user_id,
  setLoading: (loading: boolean) =>
    set((state) => {
      state.isLoading = loading;
      return state;
    }),
  setAuthenticated: (authenticated: boolean) =>
    set((state) => {
      state.isAuthenticated = authenticated;
      return state;
    }),
  setAuthUserProfileData: (userProfile) =>
    set((state) => {
      state.userProfile = userProfile;
      state.isAuthenticated = !!userProfile;
      state.isLoading = false;
      state.error = null;
      return state;
    }),
  updateUserProfile: (updates) =>
    set((state) => {
      const current = state.userProfile;
      state.userProfile = current ? { ...current, ...updates } : null;
      return state;
    }),
  setError: (error) =>
    set((state) => {
      state.error = error;
      return state;
    }),
  setLocationStatus: (status) =>
    set((state) => {
      state.locationStatus = status;
      return state;
    }),
  setCurrentLocation: (location) =>
    set((state) => {
      state.currentLocation = location;
      return state;
    }),
  clear: () =>
    set((state) => {
      Object.assign(state, initialAuthState);
      return state;
    }),
});

export const useAuthUserProfileStore = create<AuthUserProfileStore>()(
  persist(immer(authUserProfileStoreCreator), {
    name: "auth-user-profile-store",
    storage: createZustandAsyncStorage<PersistedAuthUserProfileState>(),
    partialize: (state) => ({
      access_token: state.access_token,
      refresh_token: state.refresh_token,
      user_id: state.user_id,
      isAuthenticated: state.isAuthenticated,
      userProfile: state.userProfile,
      locationStatus: state.locationStatus,
      currentLocation: state.currentLocation,
    }),
  })
);
