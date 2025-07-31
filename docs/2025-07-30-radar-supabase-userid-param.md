# Task: Refactor nearby_profiles to use explicit userId parameter

**Fecha:** 2025-07-30  
**Responsable:** Roo  
**Estado:** completed

## Objetivo

Evitar depender de `auth.uid()` en el backend, ya que la sesión de Supabase puede perderse tras un reload en React Native. Se pasa el `user_id` explícitamente desde el frontend a la función RPC.

## Nueva definición de la función SQL

```sql
CREATE OR REPLACE FUNCTION public.nearby_profiles(
  user_lat float,
  user_lng float,
  max_distance float,
  current_user_id uuid
)
RETURNS TABLE (
  user_id uuid,
  username text,
  avatar_url text,
  latitude float,
  longitude float,
  distance_km float
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    p.user_id,
    p.alias AS username,
    p.avatar AS avatar_url,
    p.latitude::float,
    p.longitude::float,
    ST_Distance(
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      ST_SetSRID(ST_MakePoint(p.longitude, p.latitude), 4326)::geography
    ) / 1000 AS distance_km
  FROM profiles p
  WHERE 
    ST_DWithin(
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      ST_SetSRID(ST_MakePoint(p.longitude, p.latitude), 4326)::geography,
      max_distance * 1000
    )
    AND p.user_id != current_user_id
    AND p.status = 1
  ORDER BY distance_km ASC;
$$;
```

## Cambios en el frontend

En el archivo [`src/modules/users/repositories/profile.repository.ts`](src/modules/users/repositories/profile.repository.ts):

```ts
console.log("Calling nearby_profiles with:", {
  userLat,
  userLng,
  radiusKm,
  userId
});

const { data: nearbyUsers, error } = await supabase.rpc("nearby_profiles", {
  user_lat: userLat,
  user_lng: userLng,
  max_distance: radiusKm,
  current_user_id: userId,
});

console.log("Result from nearby_profiles:", nearbyUsers);
```

## Alternativa (mantener auth.uid())

Si prefieres seguir usando `auth.uid()`, debes asegurarte de que la sesión de Supabase esté restaurada antes de cualquier llamada RPC, lo cual es poco confiable tras un reload en Expo. Por robustez y control, se recomienda la opción de pasar el userId explícitamente.

## Observaciones

- Recuerda actualizar el frontend y el backend al mismo tiempo para evitar errores de parámetros.
- El cambio es retrocompatible si solo el frontend actualizado llama a la nueva función.
