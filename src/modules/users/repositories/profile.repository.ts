import { supabase } from "@/src/utils/supabase";
import { UpdateProfileData } from "../dtos/update-profile.dto";

// Obtener usuarios cercanos usando la función RPC en Supabase
export async function getNearbyUsers(userId: string, radiusKm: number = 200) {

  const { data: currentUserProfile, error: profileError } = await supabase
    .from("profiles")
    .select("latitude, longitude")
    .eq("user_id", userId)
    .single();

  if (profileError || !currentUserProfile) {
    console.error("Error obteniendo perfil del usuario:", profileError);
    return [];
  }

  const userLat = parseFloat(currentUserProfile.latitude);
  const userLng = parseFloat(currentUserProfile.longitude);

  const { data: nearbyUsers, error } = await supabase.rpc("nearby_profiles", {
    user_lat: userLat,
    user_lng: userLng,
    max_distance: radiusKm,
    current_user_id: userId,
  });

  if (error) {
    console.error("Error obteniendo usuarios cercanos:", error);
    return [];
  }

  return nearbyUsers;
}

// Obtener un perfil de usuario por ID
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error obteniendo perfil del usuario:", error);
    return null;
  }

  return data;
}

// Actualizar perfil del usuario
export async function updateProfile(
  userId: string,
  updateData: Partial<UpdateProfileData>
) {
  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("user_id", userId);

  if (error) {
    console.error("Error updating profile:", error);
    throw error;
  }

  return true;
}

// Procesar onboarding y actualizar perfil
export async function onboardUser(
  userId: string,
  state: any
): Promise<boolean> {
  // Asegurar tipo literal para gender
  const gender: 0 | 1 | 2 =
    state.gender === "1" ? 0 : state.gender === "2" ? 1 : 2;

  const updateData: Partial<UpdateProfileData> = {
    name: state.name,
    alias: state.alias,
    bio: state.bio,
    birth_date: state.birth_date,
    gender,
    interested_in: state.interestedIn,
    avatar: state.mainPicture,
    address: state.selectedAddress,
    location: state.selectedLocation
      ? JSON.stringify(state.selectedLocation)
      : null,
    latitude: state.selectedLocation?.latitude ?? null,
    longitude: state.selectedLocation?.longitude ?? null,
    is_onboarded: 1,
  };

  return await updateProfile(userId, updateData);
}
