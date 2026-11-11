# Chatbot (React + Node + MySQL)

Burbuja de chat con preguntas frecuentes guardadas en MySQL, botón de WhatsApp y panel `/admin`. La estructura, los endpoints y la puesta en marcha local están en [README.md](README.md).

## Despliegue en EC2 con Docker

Dos contenedores en una red de Docker:

- `client/Dockerfile`: compila con Vite y sirve `dist` con Nginx en el puerto 80. `client/nginx.conf` envía `/api/` al backend y devuelve `index.html` para las rutas de React Router.
- `server/Dockerfile`: API Express en el puerto 4000, sin publicarlo al exterior. Las variables se pasan al ejecutar con `--env-file`.

Desde la raíz del proyecto:

```bash
docker network create chatbot
docker build -t chatbot-server ./server
docker build -t chatbot-client ./client

docker run -d --name server --network chatbot --restart unless-stopped --env-file server/.env chatbot-server
docker run -d --name client --network chatbot --restart unless-stopped -p 80:80 chatbot-client
```

### Reglas del despliegue

- El contenedor del backend debe llamarse `server`, porque `client/nginx.conf` lo busca con ese nombre.
- `server/.env` no está en git y las imágenes no lo incluyen. Hay que crearlo en la EC2 con `NODE_ENV=production` y una `ADMIN_API_KEY` larga y nueva.
- `DB_HOST` no puede ser `localhost`, porque dentro del contenedor apunta al propio contenedor. Usar el endpoint de RDS o la IP privada de MySQL.
- Si MySQL corre en la misma EC2, el usuario `'chatbot_user'@'localhost'` de `database.txt` no sirve desde Docker. Hay que crearlo para la red de Docker y hacer que MySQL acepte conexiones fuera de `127.0.0.1`.
- En el Security Group abrir solo el 80 (y el 443 con HTTPS). Nunca publicar el 4000: `trust proxy` confía en `X-Forwarded-For`, y con acceso directo esa cabecera se podría falsificar para evadir el rate limit.
- Sin HTTPS, la clave de admin viaja sin cifrar cada vez que se usa `/admin`.

### Variables del cliente

Vite incrusta las variables `VITE_*` en el bundle al compilar, así que se definen como `--build-arg` y cambiarlas exige reconstruir la imagen. `client/.env` no entra en la imagen, y los valores por defecto están en `client/Dockerfile`.

## Decisiones que hay que conservar

- **Scroll del chat** (`client/src/components/ChatBot/ChatWindow.jsx`): el último mensaje del usuario se lleva a la parte superior, y la lista de preguntas se oculta tras cada respuesta. Así la respuesta se lee desde el inicio. "Ver otras preguntas" vuelve a mostrar la lista, y también se puede escribir el número directamente.
- **`trust proxy`** (`server/src/app.js`): activo solo en producción. Sin él, el rate limit de 120 peticiones por minuto trataría a todos los usuarios como la IP de Nginx.
- **Resolver de Nginx** (`client/nginx.conf`): `resolver 127.0.0.11` junto con la variable en `proxy_pass` evita que Nginx falle al arrancar si el backend aún no existe, o que conserve una IP vieja tras un reinicio.

## Servidor EC2

Estado configurado el 2026-11-10. El chatbot todavía no está desplegado.

- IP pública `54.227.69.64`, IP privada `172.31.21.70`, usuario `ec2-user`.
- Amazon Linux 2023, x86_64, unos 4 GB de RAM y 50 GB de disco.
- Instalado: Docker (activo al arrancar, `ec2-user` lo usa sin `sudo`), Docker Compose (plugin en `/usr/local/lib/docker/cli-plugins`), Buildx, git y rsync.
- Los proyectos van en `/home/ec2-user/proyectos`.
- Solo un proyecto puede usar el puerto 80. Los demás necesitan otro puerto o un proxy inverso por dominio.

Conexión desde la raíz del proyecto, con la llave `chatbot.pem`:

```bash
ssh -i chatbot.pem ec2-user@54.227.69.64
```

Copia del proyecto desde Git Bash, sin llave, `.env` ni carpetas pesadas:

```bash
tar --exclude=node_modules --exclude=dist --exclude=.git --exclude='*.pem' --exclude='.env' -czf - . | ssh -i chatbot.pem ec2-user@54.227.69.64 'mkdir -p ~/proyectos/chatbot && tar -xzf - -C ~/proyectos/chatbot'
```

### Puertos del Security Group

| Puerto | Origen | Uso |
|---|---|---|
| 22 | Solo la IP del administrador | SSH |
| 80 | `0.0.0.0/0` | Chatbot |
| 443 | `0.0.0.0/0` | Solo cuando se configure HTTPS, que requiere un dominio |

No abrir el 4000 ni el 3306. Las reglas de salida se dejan con todo permitido.

### Tamaño de la instancia

Unos 4 GB de RAM en x86 sobran para este proyecto. La opción económica equivalente es una t3.small (2 GB), que no requiere cambiar la AMI.

## Base de datos y seeds

- Orden de carga: las secciones 1 a 4 de `database.txt` y luego `seed_preguntas.sql`.
- `database.txt` no se puede ejecutar completo: la sección final son queries de referencia con `?` y da error de sintaxis en MySQL. El comando del README lo ejecuta entero, así que falla al llegar a esa parte.
- `seed_preguntas.sql` tiene las 15 preguntas actuales. Se puede ejecutar varias veces porque actualiza por `option_number` en lugar de duplicar filas.
- Las preguntas creadas o editadas desde `/admin` no llegan solas al seed. Hay que copiarlas a mano o quedarán fuera en una instalación nueva.

## Pendientes

- Definir dónde va MySQL. La recomendación es un contenedor en la misma EC2 en lugar de RDS.
- Generar en el servidor un `server/.env` de producción con contraseña y `ADMIN_API_KEY` nuevas.
- Desplegar el chatbot y construir las imágenes por primera vez: los Dockerfiles aún no se han probado.
- Mover `chatbot.pem` fuera del repositorio o agregarlo a un `.gitignore`, porque hoy `git add .` lo incluiría.
- Probar el scroll del chat en un navegador.
- Confirmar el número de WhatsApp: `client/.env`, `client/.env.example` y `client/Dockerfile` usan 573127384841, pero `README.md` y el valor por defecto de `client/src/config.js` tienen 573014837377.
