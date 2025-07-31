# Propuesta de alineación backend-frontend para listado de chats

## 1. Estructura recomendada de la respuesta del backend (GET /chats)

```json
[
  {
    "id": "string",
    "createdAt": "ISODate",
    "updatedAt": "ISODate",
    "isActive": true,
    "type": "individual" | "group",
    "description": "string | null",
    "creator": {
      "id": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "isActive": true,
      "isVerified": true,
      "isStaff": false,
      "dateJoined": "ISODate",
      "resetToken": null,
      "resetTokenExpires": null,
      "role": "user" | "admin"
    },
    "name": "string",
    "members": [
      {
        "id": "string",
        "user": {
          "id": "string",
          "email": "string",
          "firstName": "string",
          "lastName": "string",
          "isActive": true,
          "isVerified": true,
          "isStaff": false,
          "dateJoined": "ISODate",
          "resetToken": null,
          "resetTokenExpires": null,
          "role": "user" | "admin"
        },
        "joinedAt": "ISODate",
        "role": "admin" | "member"
      }
    ],
    "lastMessage": {
      "id": "string",
      "content": "string",
      "sender": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string"
      },
      "createdAt": "ISODate",
      "readed": true
    }
  }
]
```

- **Nota:** No se incluye el campo `password` en ningún usuario.
- Todos los campos están en camelCase.
- Se incluye el objeto `lastMessage` con la información relevante para la UI.

---

## 2. Modelo TypeScript recomendado para el frontend

```typescript
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isVerified: boolean;
  isStaff: boolean;
  dateJoined: string;
  resetToken: string | null;
  resetTokenExpires: string | null;
  role: "user" | "admin";
}

export interface ChatMember {
  id: string;
  user: User;
  joinedAt: string;
  role: "admin" | "member";
}

export interface Message {
  id: string;
  content: string;
  sender: Pick<User, "id" | "firstName" | "lastName" | "email">;
  createdAt: string;
  readed: boolean;
}

export interface Chat {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  type: "individual" | "group";
  description: string | null;
  creator: User;
  name: string;
  members: ChatMember[];
  lastMessage: Message | null;
}
```

---

## 3. Adaptaciones mínimas en la UI

- Acceder a `chat.lastMessage` directamente para mostrar el último mensaje, su contenido, hora y estado de lectura.
- Acceder a `chat.members` para mostrar avatares, nombres, etc.
- Todos los campos deben ser accedidos en camelCase.

---

## 4. Adaptaciones mínimas en el backend

- Excluir el campo `password` de cualquier usuario en la respuesta (usar DTOs o serializadores).
- Asegurarse de que todos los campos estén en camelCase (puedes usar `@Expose({ name: '...' })` de class-transformer si es necesario).
- Incluir el objeto `lastMessage` en la respuesta de cada chat, con los campos relevantes para la UI.
- Si hay campos legacy en snake_case, migrar a camelCase en la respuesta.

---

## 5. Resumen

- El backend puede enviar información de más, pero nunca de menos.
- El frontend debe mapear los datos según el modelo propuesto.
- Esta estructura permite máxima flexibilidad y coherencia entre backend y frontend.
