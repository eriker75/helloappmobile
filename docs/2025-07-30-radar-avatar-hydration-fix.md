# Task: Fix avatar disappearance in radar after reload

**Fecha:** 2025-07-30  
**Responsable:** Roo  
**Estado:** completed

## Problema

Tras iniciar sesión, los avatares de los usuarios cercanos (`useNearbyUsers`) se muestran correctamente en el radar. Sin embargo, al recargar la app con "r" (React Native), los avatares desaparecen y no se vuelven a mostrar hasta volver a loguearse.

## Análisis

- El hook `useNearbyUsers` se inicializaba con `user?.id || ""`. Si el perfil del usuario aún no estaba cargado tras el reload, el hook se llamaba con un string vacío, por lo que no se hacía la consulta.
- Cuando el perfil se cargaba posteriormente, React Query no siempre reactivaba la consulta correctamente, resultando en que los usuarios cercanos (y sus avatares) no se mostraban.
- El chat y otros módulos usan persistencia/hidratación de estado, pero el radar depende de la consulta en vivo.

## Solución

- Se modificó `app/dashboard/radar.tsx` para que el hook `useNearbyUsers` solo se invoque cuando `user?.id` está disponible.
- Se agregó un estado de carga temprano que muestra un spinner hasta que el perfil del usuario esté listo.
- Esto garantiza que la consulta de usuarios cercanos siempre se realice con un `userId` válido y que los avatares se muestren correctamente tras cualquier reload.

## Archivos modificados

- `app/dashboard/radar.tsx`

## Observaciones

- No se modificó la lógica de backend ni la UI, solo el flujo de inicialización de hooks.
- El cambio es seguro y no afecta otros módulos.
