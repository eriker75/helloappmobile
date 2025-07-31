# Task: Cargar perfil de usuario dinámicamente por ID y actualizar store global

**Fecha:** 2025-07-28

## Objetivo

Permitir que la vista de perfil (`app/dashboard/profile/[id]/index.tsx`) cargue la información del usuario dinámicamente por ID, utilizando el patrón repository/service, y que actualice un store global para perfiles de usuario por ID.

## Plan de acción

1. Analizar la implementación actual de la vista de perfil y los stores existentes.
2. Crear un nuevo store global (`user-profiles.store.ts`) para almacenar perfiles de usuario por ID.
3. Modificar la vista de perfil para que, al cargar el perfil con el hook `useUserProfile`, lo almacene en el store global.
4. Documentar el proceso y actualizar el devlog.

## Archivos modificados/creados

- `src/modules/users/stores/user-profiles.store.ts` (nuevo)
- `app/dashboard/profile/[id]/index.tsx` (modificado)
- `docs/2025-07-28-profile-dynamic-by-id.md` (este archivo)

## Observaciones

- El store global permite compartir perfiles de usuario entre vistas y evitar requests innecesarios.
- Se mantiene la arquitectura modular y la separación de responsabilidades.
- El store puede extenderse para persistencia en AsyncStorage si se requiere en el futuro.
