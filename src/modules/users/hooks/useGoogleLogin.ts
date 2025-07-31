import { supabase } from "@/src/utils/supabase";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuthUserProfileStore } from "../stores/auth-user-profile.store";

if (!process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID) {
  throw new Error("Not GOOGLE_CLIENT_ID Found in env variables");
}

GoogleSignin.configure({
  webClientId: "260713514618-jh036mf3tls5ffmuo70tg19j0r96v8sp.apps.googleusercontent.com",
  // console log para verificar configuración
});
console.log("GoogleSignin configured with webClientId:", process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID);

export const useGoogleLogin = () => {
  const router = useRouter();
  const setAuthUserProfileData = useAuthUserProfileStore(
    (state) => state.setAuthUserProfileData
  );
  const clearAuthData = useAuthUserProfileStore((state) => state.clearAuthData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async () => {
    console.log("signIn iniciado");
    setIsLoading(true);
    setError(null);

    try {
      // 1. Verificar servicios de Google Play
      console.log("Verificando Google Play Services...");
      await GoogleSignin.hasPlayServices();
      console.log("Google Play Services OK");

      // 2. Iniciar sesión con Google
      console.log("Intentando iniciar sesión con Google...");
      const response = await GoogleSignin.signIn();
      console.log("Respuesta de GoogleSignin.signIn():", response);

      if (!isSuccessResponse(response) || !response.data.idToken) {
        throw new Error("No se pudo obtener el token de Google");
      }
      console.log("ID token obtenido:", response.data.idToken);

      // 3. Autenticar con Supabase usando el token de Google
      console.log("Autenticando con Supabase...");
      const { data: authData, error: supabaseError } =
        await supabase.auth.signInWithIdToken({
          provider: "google",
          token: response.data.idToken,
        });
      console.log("Respuesta de supabase.auth.signInWithIdToken:", {
        authData,
        supabaseError,
      });

      if (supabaseError || !authData.user) {
        throw new Error(
          supabaseError?.message || "Error en la autenticación con Supabase"
        );
      }

      // 4. Obtener perfil del usuario
      // 4.1. Obtener el user_id desde auth.users
      console.log("Obteniendo usuario desde supabase.auth.getUser()...");
      const {
        data: { user: userData },
      } = await supabase.auth.getUser();
      console.log("Datos de usuario obtenidos:", userData);

      if (!userData) throw new Error("Usuario no encontrado");

      // 4.2. Obtener el perfil asociado
      console.log("Consultando perfil en tabla profiles...");
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userData.id)
        .single();
      console.log("Datos de perfil:", profileData);

      if (profileError) {
        console.error("Error consultando perfil:", profileError);
        throw new Error("No se pudo obtener el perfil del usuario");
      }

      // 5. Crear objeto UserProfile combinado
      const userProfile = {
        id: userData?.id,
        name:
          userData.user_metadata?.full_name ||
          authData?.user.user_metadata?.full_name ||
          "",
        email: userData.email || authData?.user.email || "",
        profile_id: profileData?.id,
        alias: profileData?.alias || null,
        bio: profileData?.bio || null,
        birth_date: profileData?.birth_date || null,
        gender: profileData?.gender || null,
        interested_in: profileData?.interested_in || null,
        avatar:
          profileData?.avatar ||
          authData?.user.user_metadata?.avatar_url ||
          null,
        address: profileData?.address || null,
        preferences: profileData?.preferences || null,
        last_online: profileData?.last_online || null,
        location: profileData?.location || null,
        is_onboarded: profileData?.is_onboarded || 0,
        status: profileData?.status || 1,
        latitude: profileData?.latitude,
        longitude: profileData?.longitude,
        is_verified: 1,
        created_at: profileData?.created_at || null,
        updated_at: profileData?.updated_at || null,
      };
      console.log("UserProfile combinado:", userProfile);

      // 6. Guardar en el store
      await setAuthUserProfileData(userProfile);
      console.log("Perfil de usuario guardado en el store");
    } catch (error) {
      console.error("Error en el proceso de login:", error);

      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            setError("Inicio de sesión cancelado");
            console.log("Error: Inicio de sesión cancelado");
            return false;
          case statusCodes.IN_PROGRESS:
            setError("Proceso de inicio de sesión en progreso");
            console.log("Error: Proceso en progreso");
            return false;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            setError("Google Play Services no está disponible");
            console.log("Error: Google Play Services no disponible");
            return false;
          default:
            setError("Error en el inicio de sesión con Google");
            console.log("Error desconocido en login con Google:", error);
            return false;
        }
      } else {
        const message =
          error instanceof Error ? error.message : "Error desconocido";
        setError(message);
        console.log("Error no tipado en login:", message);
      }
    } finally {
      setIsLoading(false);
      console.log("signIn finalizado");
      return true;
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      console.log("Intentando cerrar sesión...");

      // Cerrar sesión en Google
      await GoogleSignin.signOut();
      console.log("Sesión de Google cerrada");

      // Cerrar sesión en Supabase
      await supabase.auth.signOut();
      console.log("Sesión de Supabase cerrada");

      // Limpiar el store
      await clearAuthData();
      console.log("Store limpiado");

      // Redirigir al login
      router.replace("/login");
      console.log("Redirigido a /login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setError("Error al cerrar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    signOut,
    isLoading,
    error,
  };
};
