# Task: Debug auth.uid() value in nearby_profiles function

**Fecha:** 2025-07-30  
**Responsable:** Roo  
**Estado:** completed

## Objetivo

Verificar si el valor de `auth.uid()` en el contexto de la función `nearby_profiles` coincide con el `user_id` del usuario autenticado en la tabla `profiles`, para descartar problemas de filtrado en la consulta de usuarios cercanos.

## Modificación temporal

Agregar una columna de depuración al resultado de la función para retornar el valor de `auth.uid()`:

```sql
CREATE OR REPLACE FUNCTION public.nearby_profiles(
  user_lat float,
  user_lng float,
  max_distance float
)
RETURNS TABLE (
  user_id uuid,
  username text,
  avatar_url text,
  latitude float,
  longitude float,
  distance_km float,
  debug_auth_uid uuid
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
    ) / 1000 AS distance_km,
    auth.uid() as debug_auth_uid
  FROM profiles p
  WHERE 
    ST_DWithin(
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      ST_SetSRID(ST_MakePoint(p.longitude, p.latitude), 4326)::geography,
      max_distance * 1000
    )
    AND p.user_id != auth.uid()
    AND p.status = 1
  ORDER BY distance_km ASC;
$$;
```

## Siguiente paso

- Llama a la función desde el frontend y revisa el valor de `debug_auth_uid` en el resultado.
- Compara ese valor con el `user_id` de tu usuario en la tabla `profiles`.
- Si no coinciden, revisa la integración de autenticación y el mapeo de IDs.

## Observaciones

- Recuerda revertir la función para eliminar la columna de depuración después de la prueba.
