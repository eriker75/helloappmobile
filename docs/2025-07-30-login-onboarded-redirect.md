# Task: Redirigir usuarios onboarded al dashboard tras login con Google

## Fecha

2025-07-30

## Objetivo

Cuando un usuario inicie sesión con Google y su perfil tenga `is_onboarded === 1`, debe ser redirigido directamente a `/dashboard/radar` en vez de `/onboarding`. Si no está onboarded, sigue el flujo normal de onboarding.

## Plan de acción

1. Analizar el flujo de login y obtención del perfil de usuario tras login con Google.
2. Modificar la lógica de redirección en `app/login.tsx` para que:
   - Si `userProfile?.is_onboarded === 1`, redirija a `/dashboard/radar`.
   - Si no, redirija a `/onboarding`.
3. Documentar el cambio en este archivo y en `devlog.md`.

## Archivos modificados

- `app/login.tsx` (lógica de redirección tras login)
- `docs/2025-07-30-login-onboarded-redirect.md` (este documento)
- `docs/devlog.md` (resumen del cambio)

## Observaciones

- Se utiliza el store Zustand `useAuthUserProfileStore` para acceder a `userProfile` tras el login.
- Se añade un pequeño delay tras el login para asegurar que el store se actualizó antes de redirigir.
- No se requiere modificar el backend ni la lógica de obtención del perfil, solo la redirección en el frontend.
