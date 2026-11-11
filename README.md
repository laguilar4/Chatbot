# Chatbot (React + Node + MySQL)

Burbuja de chat con dos opciones:
- **Preguntas**: muestra las preguntas activas guardadas en MySQL; el usuario teclea el número (o hace clic) y el bot responde.
- **WhatsApp**: abre `https://wa.me/573014837377`.

Incluye un panel `/admin` para crear, editar, ocultar y eliminar preguntas.

## Estructura

```
database.txt          → Script SQL: base de datos, tabla y queries
server/               → API REST (Express 5 + mysql2 + zod)
  src/config          → variables de entorno validadas y pool MySQL
  src/routes          → definición de rutas
  src/controllers     → capa HTTP
  src/services        → reglas de negocio
  src/repositories    → acceso a datos (sentencias preparadas)
  src/middlewares     → validación, auth admin, manejo de errores
client/               → React 19 + Vite
  src/components/ChatBot  → burbuja y ventana del chat
  src/components/admin    → formulario, tabla y login del panel
  src/hooks               → lógica de datos reutilizable
  src/api                 → cliente HTTP
```

## Puesta en marcha

1. **Base de datos**: ejecuta `database.txt` en MySQL (MySQL Workbench o `mysql -u root -p < database.txt`).
   Cambia la contraseña de `chatbot_user` en el script.
2. **Backend**
   ```bash
   cd server
   npm install
   # edita .env (credenciales MySQL y ADMIN_API_KEY)
   npm run dev          # http://localhost:4000
   ```
3. **Frontend**
   ```bash
   cd client
   npm install
   npm run dev          # http://localhost:5173
   ```
4. Abre `http://localhost:5173` para ver la burbuja y `http://localhost:5173/admin` para el panel
   (la clave es el valor de `ADMIN_API_KEY`).

## Endpoints

| Método | Ruta                        | Auth        | Descripción                    |
|--------|-----------------------------|-------------|--------------------------------|
| GET    | `/api/health`               | —           | Estado del servidor            |
| GET    | `/api/questions`            | —           | Preguntas activas (chatbot)    |
| GET    | `/api/admin/questions`      | `x-api-key` | Todas las preguntas            |
| GET    | `/api/admin/questions/:id`  | `x-api-key` | Una pregunta                   |
| POST   | `/api/admin/questions`      | `x-api-key` | Crear                          |
| PUT    | `/api/admin/questions/:id`  | `x-api-key` | Actualizar                     |
| DELETE | `/api/admin/questions/:id`  | `x-api-key` | Eliminar                       |

Body de POST/PUT:
```json
{ "optionNumber": 1, "question": "¿Horario?", "answer": "Lunes a viernes 8-6", "isActive": true }
```

## Producción
- `cd client && npm run build` genera `client/dist` (sírvelo con Nginx o similar y redirige `/api` al backend).
- Si el frontend va en otro dominio, define `VITE_API_URL` con la URL completa de la API y agrega ese dominio a `CORS_ORIGIN`.
- La clave de admin es una protección básica; para varios administradores conviene usar usuarios con JWT/sesiones.
