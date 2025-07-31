## 2025-07-30 – Fix: Avatares de usuarios cercanos desaparecen tras reload en radar

- **Task:** [2025-07-30-radar-avatar-hydration-fix.md](2025-07-30-radar-avatar-hydration-fix.md)
- **Summary:** Se corrigió un bug donde, tras recargar la app con "r" en React Native, los avatares de los usuarios cercanos en el radar no se mostraban. El hook `useNearbyUsers` ahora solo se invoca cuando el perfil del usuario está cargado, garantizando la consulta y renderizado correcto de avatares tras cualquier reload.
- **Impact:** Los avatares de usuarios cercanos siempre se muestran correctamente en el radar, incluso después de recargar la app. No se afecta la lógica de backend ni otros módulos.

# Development Log

## 2025-07-30 – Redirección tras login según is_onboarded

- **Task:** [2025-07-30-login-onboarded-redirect.md](2025-07-30-login-onboarded-redirect.md)
- **Summary:** Ahora, tras iniciar sesión con Google, si el usuario tiene `is_onboarded === 1` es redirigido directamente a `/dashboard/radar`. Si no, sigue el flujo de onboarding como antes.
- **Impact:** Mejora la experiencia de usuario para quienes ya completaron el onboarding, evitando pasos innecesarios y alineando la navegación con el estado real del usuario. No afecta la lógica de autenticación ni el backend.

## 2025-07-28 – Actualización automática de ubicación en el radar del dashboard

- **Task:** [2025-07-28-dashboard-radar-location-update.md](2025-07-28-dashboard-radar-location-update.md)
- **Summary:** Ahora, al entrar a la vista de radar (`/dashboard/radar`), si el usuario tiene permisos de ubicación, se actualiza automáticamente su ubicación tanto en la base de datos como en el store usando la información del dispositivo. Si no tiene permisos, se solicitan y, si se aprueban, se realiza la actualización.
- **Impact:** Mejora la precisión y actualidad de la ubicación del usuario en la app, alineando la experiencia del radar con el flujo de onboarding y manteniendo la consistencia en el manejo de estado y permisos.

## 2025-07-28 – Extracto en la bio del perfil de usuario

- **Task:** [2025-07-28-profile-bio-excerpt.md](2025-07-28-profile-bio-excerpt.md)
- **Summary:** Ahora el perfil de usuario muestra solo un extracto de la bio (máx. 140 caracteres) para mejorar la legibilidad y evitar que bios largas saturen la vista.
- **Impact:** Mejora la experiencia visual y mantiene la interfaz limpia. No afecta la lógica de almacenamiento ni otras funcionalidades.

## 2025-07-28 – Navegación al perfil desde avatar en detalle de chat

- **Task:** [2025-07-28-chat-avatar-navigate-profile.md](2025-07-28-chat-avatar-navigate-profile.md)
- **Summary:** Ahora, al hacer clic en el avatar del usuario en la cabecera del detalle de chat (chats 1 a 1), se navega directamente al perfil de ese usuario. Para grupos, el avatar no es interactivo.
- **Impact:** Mejora la experiencia de usuario permitiendo acceder rápidamente al perfil desde el chat, manteniendo la arquitectura modular y sin afectar la lógica de mensajes.

## 2025-07-19 – Add More Mock Chats and Messages for Scroll Testing

- **Task:** [2025-07-19-add-mock-chats-and-messages.md](2025-07-19-add-mock-chats-and-messages.md)
- **Summary:** Expanded the mock data in the chat list (`app/dashboard/chat.tsx`) to 20 chats and in the chat detail (`app/dashboard/[chatId]/index.tsx`) to 35 messages. This allows for effective scroll and UI performance testing.
- **Impact:** No backend or navigation logic was affected. All changes are for UI demonstration and testing only. The UI now supports scroll scenarios with a realistic volume of chats and messages.

## 2025-07-25 – Implement Real-Time Chat with Supabase

- **Task:** [2025-07-25-chat-realtime.md](2025-07-25-chat-realtime.md)
- **Summary:** Replaced all mock chat and message data with a fully functional, real-time chat system using Supabase. Implemented repositories, services, and hooks for chats and messages, following the modular architecture. Refactored `app/dashboard/chat.tsx` and `app/dashboard/[chatId]/index.tsx` to use dynamic, real-time data.
- **Impact:** The chat UI is now fully dynamic and updates in real time. The codebase now includes a scalable chat module with clear separation of concerns and real-time support, ready for production use.

## 2025-07-28 – Implement Profile Screen in Dashboard

- **Task:** [2025-07-28-profile-screen.md](2025-07-28-profile-screen.md)
- **Summary:** Created the profile screen in `app/dashboard/profile/index.tsx` to closely match the provided design. Utilized existing UI components (`Avatar`, `Button`, `Text`) and imported the chat SVG as a React component for the action button. The layout includes a curved image background, overlapping avatar with edit badge, user info, and a prominent action button.
- **Impact:** The dashboard now features a visually accurate, modular, and maintainable profile screen, ready for integration with real user data and further enhancements.

## 2025-07-28 – Mejora de UX: Avatar y Alias Instantáneos en Chat

- **Task:** [2025-07-28-chat-ux-avatar-alias.md](2025-07-28-chat-ux-avatar-alias.md)
- **Summary:** Refactorizado el manejo de alias y avatar en la lista y detalle de chats para que el nombre y la imagen del usuario se muestren instantáneamente al seleccionar un chat, sin recargar desde red si ya están en estado. Ahora el store centraliza la información de usuario y el estado de carga de avatar, permitiendo feedback visual (spinner) mientras se carga la imagen.
- **Impact:** La experiencia de usuario es mucho más fluida y consistente. El nombre del usuario siempre se muestra correctamente (no "Chat"), y la imagen de avatar aparece de inmediato si ya fue cargada previamente, con indicador de carga si es necesario. Se mantiene la arquitectura modular y la separación de responsabilidades.

## 2025-07-28 – Marcar mensajes como leídos al entrar a un chat

- **Task:** [2025-07-28-mark-messages-read-on-chat-open.md](2025-07-28-mark-messages-read-on-chat-open.md)
- **Summary:** Ahora, al entrar a un chat, se envía automáticamente un request que marca como leídos (`readed = TRUE`) todos los mensajes no leídos (no enviados por el usuario actual) de ese chat. Se implementó siguiendo la arquitectura modular: función en el repositorio, hook en el servicio y trigger en el montaje de la pantalla de chat.
- **Impact:** Mejora la UX y la consistencia del estado de lectura de mensajes, manteniendo la separación de responsabilidades y la escalabilidad del módulo de chat.

## 2025-07-28 – Persistencia de estado de chats y detalles en AsyncStorage

- **Task:** [2025-07-28-persist-chat-state-asyncstorage.md](2025-07-28-persist-chat-state-asyncstorage.md)
- **Summary:** Se integró AsyncStorage en el store de chats (Zustand) para persistir el array de chats localmente. Al iniciar la app, el store se hidrata desde AsyncStorage, permitiendo mostrar los chats y detalles de usuario instantáneamente, incluso antes de la carga desde red. Los cambios en el estado de chats se guardan automáticamente en AsyncStorage.
- **Impact:** La experiencia de usuario es mucho más fluida: los chats, alias y avatares aparecen de inmediato al abrir la app, mejorando la percepción de velocidad y continuidad. No se afecta la lógica de mensajes ni la arquitectura modular.

## 2025-07-28 – Mejora de carga en vista de chats

- **Task:** [2025-07-28-mejora-carga-chats.md](2025-07-28-mejora-carga-chats.md)
- **Summary:** Se mejoró la experiencia de carga en la vista de chats mostrando un overlay blanco con un spinner circular mientras se cargan los datos, manteniendo el header fijo y visible en todo momento.
- **Impact:** La carga de chats ahora es visualmente más clara y profesional, evitando parpadeos o movimientos del header. El usuario percibe una transición más suave y moderna.

## 2025-07-28 – Perfil dinámico por ID y store global de perfiles

- **Task:** [2025-07-28-profile-dynamic-by-id.md](2025-07-28-profile-dynamic-by-id.md)
- **Summary:** Se implementó la carga dinámica del perfil de usuario por ID en la vista `app/dashboard/profile/[id]/index.tsx`, utilizando el patrón repository/service y React Query. Además, se creó un store global para almacenar perfiles de usuario por ID, permitiendo compartir y reutilizar la información de perfiles en toda la app.
- **Impact:** Mejora la eficiencia y consistencia del manejo de perfiles de usuario, evitando requests duplicados y facilitando la integración de nuevas funcionalidades que requieran acceso a perfiles de otros usuarios.

## 2025-07-28 – Restaurar navegación al perfil desde el radar

- **Task:** [2025-07-28-radar-profile-dialog-fix.md](2025-07-28-radar-profile-dialog-fix.md)
- **Summary:** Se restauró la funcionalidad para que, al tocar la imagen de un usuario en el radar, el botón "Ver perfil" en el cuadro de diálogo navegue correctamente al perfil dinámico por ID usando el router.
- **Impact:** La experiencia de usuario es más intuitiva y consistente, permitiendo acceder al perfil de cualquier usuario cercano directamente desde el radar. No se afectó la lógica de visualización ni la arquitectura existente.

## 2025-07-30 – Incluir profileId y userId en el objeto other_user_profile de la lista de chats

- **Task:** [2025-07-30-chat-list-profileid.md](2025-07-30-chat-list-profileid.md)
- **Summary:** Ahora el objeto `other_user_profile` en la respuesta de la lista de chats incluye tanto el `profileId` (UUID del perfil) como el `userId` (UUID del usuario) asociados al perfil. Esto permite identificar de forma inequívoca el perfil y el usuario en el frontend, facilitando futuras integraciones y navegación.
- **Impact:** Mejora la estructura de datos de la lista de chats, permitiendo un manejo más robusto y flexible de los perfiles de usuario en la UI. El cambio es retrocompatible y no afecta la lógica de mensajes ni la estructura de grupos.

## 2025-07-30 – Refactor: Actualización automática y silenciosa de ubicación en radar

- **Task:** [2025-07-30-radar-location-permission-update.md](2025-07-30-radar-location-permission-update.md)
- **Summary:** Se refactorizó la lógica de actualización de ubicación en `/dashboard/radar` para que, al entrar, se verifiquen y soliciten permisos de ubicación si es necesario, y solo se actualice la ubicación en la base de datos y el store si realmente cambió respecto a la anterior. El flujo es ahora más robusto y silencioso, evitando actualizaciones innecesarias y mejorando la experiencia de usuario.
- **Impact:** Se garantiza que la ubicación del usuario esté siempre actualizada y precisa al usar el radar, sin interrumpir la navegación ni mostrar prompts innecesarios. Se mantiene la consistencia con el flujo de onboarding y se mejora la eficiencia de las actualizaciones.

## 2025-07-30 – Infinite Scroll, Real-Time, and Optimistic UI in Chats

- **Task:** [2025-07-30-infinite-scroll-chat.md](2025-07-30-infinite-scroll-chat.md)
- **Summary:** Se implementó paginación e infinite scroll en la lista de chats y mensajes, con scroll infinito hacia abajo (chats) y hacia arriba (mensajes). Se integró suscripción en tiempo real para nuevos mensajes y cambios de estado (enviado, recibido, leído), y se añadió manejo de estado optimista para el envío de mensajes. El scroll se mantiene al fondo cuando llegan mensajes nuevos. El indicador de "escribiendo" requiere soporte backend (tabla/canal "typing" en Supabase).
- **Impact:** La experiencia de usuario es mucho más fluida y moderna: los chats y mensajes se cargan progresivamente, las actualizaciones son instantáneas y el feedback visual es inmediato. El código es modular, escalable y preparado para futuras mejoras como typing en tiempo real.

## 2025-07-30 – Indicador de "Escribiendo..." en chats (Typing Indicator)

- **Task:** [2025-07-30-chat-typing-indicator.md](2025-07-30-chat-typing-indicator.md)
- **Summary:** Se implementó un indicador visual y en tiempo real que muestra cuando un usuario está escribiendo en un chat. El indicador aparece en la parte inferior de la pantalla de chat (animación de puntitos), en la cabecera ("Escribiendo...") y en la lista de chats, reemplazando el último mensaje cuando alguien está escribiendo. Se creó una tabla/canal `typing_events` en Supabase para eventos efímeros de escritura, y se integró la lógica en el repositorio, servicio, hooks y UI, siguiendo la arquitectura modular.
- **Impact:** La experiencia de chat es mucho más fluida y moderna, con feedback inmediato sobre la actividad de los participantes. El código es escalable y preparado para futuras mejoras. Se garantiza limpieza del estado de typing al enviar mensaje, tras timeout y al salir del chat.
