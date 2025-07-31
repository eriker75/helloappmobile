# Mejora de UX en Chat: Avatar y Alias Instantáneos

**Fecha:** 2025-07-28  
**Responsable:** Roo (AI)  
**Estado:** Doing

## Objetivo

Optimizar la experiencia de usuario en la lista y detalle de chats para que:

- El nombre mostrado sea siempre el alias del usuario (no "Chat").
- El avatar del usuario se muestre instantáneamente al seleccionar un chat, sin recargar desde red si ya está en estado.
- Se gestione el estado de carga de avatar para transiciones suaves.

## Plan de Acción

1. Refactorizar el store de chat (`src/modules/chat/stores/chat.store.ts`) para asegurar que la información del usuario (alias, avatar) esté siempre cacheada y accesible por `chatId`.
2. Actualizar la lista de chats (`app/dashboard/chats/index.tsx`) para usar SIEMPRE el alias y avatar correctos desde el store, evitando el fallback a "Chat".
3. Actualizar el detalle de chat (`app/dashboard/chats/[chatId]/index.tsx`) para obtener avatar y alias desde el store por `chatId`, mostrando la imagen y nombre instantáneamente.
4. (Opcional) Añadir estado de carga de avatar en el store para feedback visual.
5. Documentar los cambios en este archivo y en `devlog.md`.

## Archivos a Modificar

- `src/modules/chat/stores/chat.store.ts`
- `app/dashboard/chats/index.tsx`
- `app/dashboard/chats/[chatId]/index.tsx`
- `docs/devlog.md` (resumen)
- (Opcional) Componentes de UI si se requiere para el estado de carga

## Observaciones

- Se prioriza la reutilización del estado global para evitar requests innecesarios.
- El store debe exponer helpers para obtener alias/avatar por `chatId`.
- El UI debe mostrar placeholders o spinners si el avatar está cargando.
- Se mantiene la arquitectura modular y la separación de responsabilidades.
