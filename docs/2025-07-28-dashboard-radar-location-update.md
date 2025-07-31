# Task: Actualizar ubicación del usuario automáticamente en el radar del dashboard

**Fecha:** 2025-07-28

## Objetivo

Al entrar a la vista de `/dashboard/radar`, si el usuario tiene permisos de ubicación, actualizar tanto en la base de datos (perfil) como en el store la ubicación del usuario usando la información del dispositivo. Si no tiene permisos, solicitarlos y, si se aprueban, realizar la actualización.

## Plan de acción

1. Revisar la lógica de manejo de ubicación en el onboarding (`app/onboarding/location.tsx` y `src/utils/location.ts`).
2. Identificar los métodos del store de usuario para actualizar la ubicación (`src/modules/users/stores/auth-user-profile.store.ts`).
3. Implementar un `useEffect` en `app/dashboard/radar.tsx` que:
   - Verifique permisos de ubicación.
   - Solicite permisos si es necesario.
   - Obtenga la ubicación del dispositivo si están concedidos.
   - Actualice el perfil en la base de datos y el store con la nueva ubicación.

## Archivos modificados

- `app/dashboard/radar.tsx`

## Observaciones

- Se reutilizó la lógica y métodos existentes del onboarding para mantener consistencia.
- Se corrigieron errores de tipos al comparar enums de permisos.
- Se importó correctamente `LocationPermissionStatuses` para evitar errores de compilación.
- El flujo es transparente para el usuario: si los permisos están concedidos, la ubicación se actualiza automáticamente; si no, se solicita.
