# Migración de integración Supabase a React Native

**Fecha:** 2025-07-15  
**Estado:** completado  
**Responsable:** Roo

## Objetivo

Migrar la integración de Supabase a la forma recomendada para React Native usando `@supabase/auth-helpers-react-native` y la configuración oficial, eliminando dependencias incompatibles y asegurando la compatibilidad con el entorno móvil.

## Plan de acción

1. Crear/actualizar el archivo [`src/utils/supabase.ts`] con la configuración recomendada para React Native.
2. Crear el hook [`src/hooks/useGoogleLogin.ts`] con el flujo de login usando la nueva instancia de Supabase.
3. Corregir el uso de la propiedad `token` en la autenticación con Supabase.
4. Tipar correctamente los parámetros de los stores para evitar errores de TypeScript.
5. Verificar que no se use la antigua integración incompatible en el proyecto.
6. Documentar el proceso en `/docs`.

## Archivos modificados/creados

- [`src/utils/supabase.ts`]
- [`src/hooks/useGoogleLogin.ts`]
- [`docs/2025-07-15-migracion-supabase-react-native.md`] (este archivo)

## Observaciones

- Se eliminó el uso de `@supabase/supabase-js` directamente en favor de la configuración recomendada.
- Se corrigió el error de `structuredClone` al evitar dependencias incompatibles.
- Se recomienda revisar el resto del proyecto para asegurar que no existan otros usos de la antigua integración.
