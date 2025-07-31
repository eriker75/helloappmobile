# Task: Actualización automática de ubicación en Radar al entrar

**Fecha:** 2025-07-30  
**Responsable:** Roo  
**Estado:** completed

## Objetivo

Refactorizar la lógica de actualización de ubicación del usuario para que, al entrar a la vista de `/dashboard/radar`, si el usuario tiene permisos de ubicación, se actualice tanto en la base de datos como en el store la ubicación actual del dispositivo. Si no tiene permisos, se solicitan y, si son aprobados, se realiza la actualización.

## Plan y pasos

1. Analizar la lógica existente en `onboarding/location.tsx` para manejo de permisos y actualización de ubicación.
2. Revisar el store de perfil de usuario y el servicio de actualización de perfil.
3. Implementar un `useEffect` en `app/dashboard/radar.tsx` que:
   - Verifique permisos de ubicación.
   - Si están concedidos, obtenga la ubicación y actualice DB y store.
   - Si no, solicite permisos y repita el proceso si son aprobados.
   - Solo actualiza si la ubicación cambió.
4. Actualizar documentación y devlog.
5. Probar el flujo en la app.

## Archivos modificados

- `app/dashboard/radar.tsx`

## Observaciones

- Se reutilizó la lógica de onboarding para mantener consistencia.
- Se evita actualizar si la ubicación no cambió.
- Se maneja el flujo de permisos de forma silenciosa para no interrumpir la experiencia.
- No se modificó la UI, solo la lógica de efecto lateral.
