# Task: Crear vista de perfil en dashboard (React Native)

**Fecha:** 2025-07-28

## Objetivo

Implementar la vista de perfil en la carpeta `app/dashboard/profile/` siguiendo el diseño proporcionado, logrando la mayor similitud visual posible y reutilizando componentes existentes del sistema.

## Plan de acción

1. Revisar la estructura del proyecto y los componentes reutilizables (`Avatar`, `Button`, `Text`).
2. Implementar la pantalla en `app/dashboard/profile/index.tsx`:
   - Imagen de fondo curva en la parte superior.
   - Avatar circular superpuesto con badge de edición.
   - Nombre, edad, género, descripción y botón destacado inferior.
   - Uso del ícono SVG como componente React.
3. Documentar el proceso y actualizar el devlog.

## Archivos modificados/creados

- `app/dashboard/profile/index.tsx`
- `docs/2025-07-28-profile-screen.md` (este archivo)

## Observaciones

- Se usaron los componentes `Avatar`, `AvatarBadge`, `AvatarImage`, `Button`, `ButtonText`, `ButtonIcon` para máxima consistencia.
- El ícono de chat se importó desde el SVG como componente React.
- Se utilizaron imágenes y datos de ejemplo; deben ser reemplazados por datos reales en integración.
- Se respetó la estructura y patrones del proyecto.
