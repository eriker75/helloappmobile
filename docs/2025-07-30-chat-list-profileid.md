# Task: Incluir profileId y userId en el objeto `other_user_profile` de la lista de chats

## Objetivo

Modificar la respuesta de la lista de chats para que el objeto `other_user_profile` incluya tanto el `profileId` como el `userId` asociado al perfil, permitiendo identificar de forma inequívoca el perfil y el usuario en el frontend.

## Plan de acción

1. Revisar la implementación actual en [`src/modules/chat/repositories/chat.repository.ts`](src/modules/chat/repositories/chat.repository.ts).
2. Identificar cómo se construye el objeto `other_user_profile` y si el `profileId` está disponible o requiere un join/adaptación.
3. Modificar la consulta y el mapeo para incluir ambos campos: `profileId` y `userId`.
4. Actualizar los DTOs o servicios relacionados si es necesario.
5. Probar la respuesta para asegurar que ambos campos se incluyen correctamente.
6. Documentar el cambio en el `devlog.md`.

## Archivos a modificar

- [`src/modules/chat/repositories/chat.repository.ts`](src/modules/chat/repositories/chat.repository.ts)
- (Posiblemente) DTOs o servicios relacionados al chat o perfil.

## Observaciones

- Según el `devlog.md`, la arquitectura sigue un patrón modular repository/service.
- El store global de perfiles y la carga dinámica por ID ya están implementados.
- Este cambio es retrocompatible y no afecta la lógica de mensajes ni la estructura de grupos.
