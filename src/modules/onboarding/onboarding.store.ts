import { Location } from "@/src/definitions/ineterfaces/Location.interface";
import { create } from "zustand";
import { useAuthUserProfileStore } from "../users/stores/auth-user-profile.store";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
} from "./onboarding.schemas";

export interface OnboardingImage {
  uri: string;
  file: any | null; // File or Expo Asset
}

export interface OnboardingState {
  name: string;
  alias: string;
  birth_date: string;
  bio: string;
  gender: string;
  interestedIn: string[];
  mainPicture: OnboardingImage | null;
  secondaryPictures: OnboardingImage[];
  selectedAddress: string;
  selectedLocation: Location | null;
}

export interface OnboardingActions {
  // Profile Data
  setName: (name: string) => void;
  setAlias: (alias: string) => void;
  setBirthDate: (birth_date: string) => void;
  setBio: (bio: string) => void;
  setGender: (gender: string) => void;
  setInterest: (interestedIn: string[]) => void;
  addInterest: (interestedIn: string) => void;
  removeInterest: (interestedIn: string) => void;

  // Photos
  setMainPicture: (mainPicture: OnboardingImage) => void;
  setSecondaryPictures: (secondaryPictures: OnboardingImage[]) => void;
  addSecondaryPicture: (picture: OnboardingImage) => void;
  removeSecondaryPicture: (index: number) => void;

  // Location
  setSelectedLocation: (address: string, location: Location | null) => void;
  clearSelectedLocation: () => void;

  // Utils
  reset: () => void;
  validateCurrentStep: (step: number) => Promise<boolean>;
  submitOnboarding: () => Promise<void>;
}

const initialState: OnboardingState = {
  name: "",
  alias: "",
  birth_date: "",
  bio: "",
  gender: "",
  interestedIn: [],
  mainPicture: null,
  secondaryPictures: [],
  selectedAddress: "",
  selectedLocation: null,
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>(
  (set, get) => ({
    ...initialState,

    // Personal User Profile Data
    setName: (name) => set({ name }),
    setAlias: (alias) => set({ alias }),
    setBirthDate: (birth_date) => set({ birth_date }),
    setBio: (bio) => set({ bio }),
    setGender: (gender) => set({ gender }),

    setInterest: (interestedIn) => set({ interestedIn }),
    addInterest: (interestedIn) =>
      set((state) => ({ interestedIn: [...state.interestedIn, interestedIn] })),
    removeInterest: (interestedIn) =>
      set((state) => ({
        interestedIn: state.interestedIn.filter((i) => i !== interestedIn),
      })),

    // Photos
    setMainPicture: (mainPicture) => set({ mainPicture }),
    setSecondaryPictures: (secondaryPictures) => set({ secondaryPictures }),
    addSecondaryPicture: (picture) =>
      set((state) => ({
        secondaryPictures: [...state.secondaryPictures, picture],
      })),
    removeSecondaryPicture: (index) =>
      set((state) => ({
        secondaryPictures: state.secondaryPictures.filter((_, i) => i !== index),
      })),

    // Location
    setSelectedLocation: (address, location) =>
      set({ selectedAddress: address, selectedLocation: location }),
    clearSelectedLocation: () =>
      set({ selectedAddress: "", selectedLocation: null }),

    // Steps Validation
    validateCurrentStep: async (step) => {
      const state = get();
      try {
        switch (step) {
          case 1:
            await step1Schema.parseAsync({ name: state.name });
            return true;
          case 2:
            await step2Schema.parseAsync({
              alias: state.alias,
              birth_date: state.birth_date,
              bio: state.bio,
              gender: state.gender,
              interestedIn: state.interestedIn,
            });
            return true;
          case 3:
            await step3Schema.parseAsync({
              mainPicture: state.mainPicture?.uri,
              secondaryPictures: state.secondaryPictures.map((img) => img.uri),
            });
            return true;
          case 4:
            await step4Schema.parseAsync({
              selectedAddress: state.selectedAddress,
              selectedLocation: state.selectedLocation,
            });
            return true;
          default:
            return false;
        }
      } catch (error) {
        console.log("Validation error:", error);
        return false;
      }
    },

    // Sendind Data
    submitOnboarding: async () => {
      const state = get();
      const authStore = useAuthUserProfileStore.getState();

      // Convertir datos de onboarding a formato de perfil de usuario
      // This method will be replaced in the UI to build FormData and call the API
    },

    // Reset
    reset: () => set(initialState),
  })
);
