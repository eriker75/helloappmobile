# Task: Migrar carga de imágenes de onboarding a backend (NestJS)

**Fecha:** 2025-07-31  
**Estado:** plan  
**Responsable:** Roo

## Objetivo

Reemplazar la carga directa de imágenes de onboarding a Supabase desde el frontend (React Native Expo) por un flujo donde las imágenes (1 principal obligatoria y 4 secundarias) se envían al backend NestJS mediante un endpoint `multipart/form-data` usando `nestjs-form-data`. El backend almacenará las imágenes usando el módulo de archivos (local o S3) y devolverá las URLs.

## Plan de acción

1. Analizar el flujo actual de selección y carga de imágenes en `app/app/onboarding/pictures.tsx` y el helper de Supabase en `app/src/utils/storage`.
2. Crear/ajustar el endpoint de onboarding en el backend para aceptar 5 imágenes (`mainImage` obligatoria y `secondaryImages[]`), usando `nestjs-form-data`.
3. Actualizar los DTOs y servicios del backend para procesar y almacenar las imágenes usando el módulo de archivos.
4. Modificar el frontend para enviar las imágenes al backend en vez de a Supabase.
5. Actualizar/crear pruebas para el nuevo flujo.
6. Documentar el proceso en este archivo y registrar el resumen en `devlog.md`.

## Archivos a modificar/crear

- `app/app/onboarding/pictures.tsx`
- `app/src/utils/storage`
- `back/src/modules/onboarding/` (controlador, DTO, servicio)
- `back/src/files/` (si es necesario crear/ajustar el módulo de archivos)
- `app/docs/2025-07-31-onboarding-images-backend-upload.md` (este archivo)
- `app/docs/devlog.md` (resumen final)

## Observaciones

- Se debe asegurar que el endpoint reciba exactamente 5 imágenes (1 principal, 4 secundarias) y valide su presencia/formato.
- El backend debe devolver las URLs de las imágenes almacenadas para su uso posterior.
- El flujo debe ser compatible tanto con almacenamiento local como S3.
- Actualizar la documentación y devlog al finalizar.
