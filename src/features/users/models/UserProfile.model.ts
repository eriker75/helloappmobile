export interface UserProfile {
  // User Data
  id: string; // UUID de user
  name: string;
  email: string;

  // Profile Data
  profileId?: string; // UUID profiles.id
  alias?: string | null;
  bio?: string | null;
  birthDate?: string | null; // timestamp
  gender?: number | null; // smallint 0 -> male, 1 -> woman
  interestedIn?: string[] | null; // jsonb -> ['men','women'] or ['woman']
  avatar?: string | null; // URL del avatar
  address?: string | null;
  preferences?: string | null; // jsonb -> '["tall","ebony"]' (como string JSON)
  lastOnline?: string | null; // timestamp
  location?: string | null; // Geographic information
  latitude: number;
  longitude: number;
  isOnboarded?: number | null; // 0 NO ONBOARDED, 1 ONBOARDED
  status?: number | null; // 1 ACTIVE, 0 INACTIVE
  isVerified?: number | null; // 1 verified, 0 NOT verified
  createdAt: string; // Profile Creation Date
  updatedAt?: string | null; // Profile Last Update Date
}
