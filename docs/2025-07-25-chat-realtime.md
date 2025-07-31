# Chat en Tiempo Real con Supabase

**Fecha:** 2025-07-25  
**Responsable:** Roo (AI)  
**Estado:** Plan

## Objetivo

Implementar un sistema de chat completamente funcional y en tiempo real usando Supabase, siguiendo la arquitectura modular del proyecto (repositorios, servicios, hooks, stores). El sistema debe actualizar la UI dinámicamente tanto en la lista de chats como en la vista de mensajes.

## Alcance

- Crear los archivos necesarios en `src/modules/chat/`:
  - DTOs y modelos de chat/mensaje.
  - Repositorios para operaciones CRUD y suscripciones en tiempo real (Supabase).
  - Servicios con React Query para manejo de datos.
  - Hooks para lógica de estado y suscripción.
  - Store si es necesario para estado global/local.
- Refactorizar las vistas:
  - `app/dashboard/chat.tsx` (lista de chats).
  - `app/dashboard/[chatId]/index.tsx` (mensajes).
- Documentar y actualizar devlog y readme.

## Archivos a crear/modificar

**Nuevos archivos:**

- `src/modules/chat/definitions/Chat.model.ts`
- `src/modules/chat/definitions/Message.model.ts`
- `src/modules/chat/dtos/create-chat.dto.ts`
- `src/modules/chat/dtos/create-message.dto.ts`
- `src/modules/chat/repositories/chat.repository.ts`
- `src/modules/chat/repositories/message.repository.ts`
- `src/modules/chat/services/chat.service.ts`
- `src/modules/chat/services/message.service.ts`
- `src/modules/chat/hooks/useChats.ts`
- `src/modules/chat/hooks/useMessages.ts`
- `src/modules/chat/hooks/useSendMessage.ts`
- `src/modules/chat/stores/chat.store.ts` (si es necesario)

**Archivos a modificar:**

- `app/dashboard/chat.tsx`
- `app/dashboard/[chatId]/index.tsx`
- `docs/devlog.md`
- `README.md` (si aplica)

## Arquitectura

- **DTOs/Models:** Definir tipos y contratos para chats y mensajes.
- **Repositorios:** Encapsulan llamadas a Supabase (CRUD, realtime).
- **Servicios:** Hooks de React Query para obtener, mutar y suscribirse a datos.
- **Hooks:** Lógica de estado, suscripción y helpers.
- **Store:** Estado global/local si es necesario para el chat activo o mensajes.

## Observaciones

- Se seguirá el patrón de los módulos existentes (users).
- Se prioriza la simplicidad y la reutilización.
- Se usará Supabase para realtime (on `INSERT`/`UPDATE` en `messages` y `chats`).
- Se documentarán los cambios en devlog y readme.

## Próximos pasos

1. Definir modelos y DTOs.
2. Implementar repositorios.
3. Implementar servicios y hooks.
4. Refactorizar vistas.
5. Pruebas y documentación.
