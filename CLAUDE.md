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

Chatbot desplegado el 2026-11-10 en `http://54.227.69.64`, con tres contenedores en la red `chatbot` y `restart=unless-stopped`:

- `mysql` (imagen `mysql:8.4`): sin puertos publicados, datos en el volumen `chatbot_mysql_data`.
- `server`: API, sin puertos publicados, con variables en `~/proyectos/chatbot/server/.env`.
- `client`: Nginx, único contenedor publicado, en el puerto 80.

La contraseña root de MySQL está en `~/secrets/chatbot-mysql.env`. Los secretos solo existen en el servidor, con permisos 600.

Para publicar cambios del código, en `~/proyectos/chatbot`:

```bash
git pull
docker build -t chatbot-server ./server && docker rm -f server
docker run -d --name server --network chatbot --restart unless-stopped --env-file server/.env chatbot-server
docker build -t chatbot-client ./client && docker rm -f client
docker run -d --name client --network chatbot --restart unless-stopped -p 80:80 chatbot-client
```

Al usar `docker exec -i` dentro de un script enviado por `ssh ... bash -s`, el comando consume el resto del script. Ejecutar el script desde un archivo o usar `</dev/null`.

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

En la EC2 actual se abrieron también el 3306 y el 443. El 3306 sigue sin ser accesible porque el contenedor no lo publica, pero conviene cerrar esa regla. El 443 no tiene efecto mientras Nginx escuche solo en el 80.

### Cambiar `ADMIN_API_KEY`

Docker solo lee `--env-file` al crear el contenedor, así que `docker restart` no aplica el cambio. Editar `server/.env` y recrear la API:

```bash
docker rm -f server
docker run -d --name server --network chatbot --restart unless-stopped --env-file server/.env chatbot-server
```

La clave no se guarda en este archivo ni en git, porque `CLAUDE.md` está en el repositorio. Está en `server/.env` del servidor y del entorno local, y en una máquina nueva hay que preguntársela al usuario.

### Tamaño de la instancia

Unos 4 GB de RAM en x86 sobran para este proyecto. La opción económica equivalente es una t3.small (2 GB), que no requiere cambiar la AMI.

## Recrear todo en una máquina nueva

Guía para Amazon Linux 2023 con usuario `ec2-user`. Sustituir `<IP>` por la IP pública nueva y actualizar la sección "Servidor EC2" al terminar. Ejecutar los scripts desde un archivo en el servidor, no con `ssh ... bash -s`.

**1. Antes de empezar**

- Security Group: 22 solo desde la IP del administrador y 80 desde `0.0.0.0/0`. Agregar 443 solo si se configura HTTPS.
- Si la máquina vieja sigue activa y tiene preguntas nuevas creadas desde `/admin`, exportarlas para no perderlas:

```bash
docker exec mysql sh -c 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" exec mysqldump -h127.0.0.1 -uroot --no-tablespaces --default-character-set=utf8mb4 chatbot_db questions' </dev/null > questions.sql
```

**2. Preparar el servidor**

```bash
sudo dnf install -y docker git rsync
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
mkdir -p ~/proyectos

# Docker Compose. En una instancia ARM usar docker-compose-linux-aarch64.
cd /tmp
B=docker-compose-linux-x86_64
U=https://github.com/docker/compose/releases/latest/download
curl -fsSLO $U/$B && curl -fsSLO $U/$B.sha256 && sha256sum -c $B.sha256
sudo install -D -m 0755 $B /usr/local/lib/docker/cli-plugins/docker-compose
rm -f $B $B.sha256
```

Cerrar la sesión SSH y volver a entrar para usar Docker sin `sudo`. Luego clonar el proyecto:

```bash
git clone https://github.com/laguilar4/Chatbot.git ~/proyectos/chatbot
```

**3. Crear los secretos**

Sustituir `<IP>` y `<CLAVE_ADMIN>`. La clave se le pide al usuario, y si tiene caracteres especiales debe mantenerse entre comillas simples.

```bash
cd ~/proyectos/chatbot
umask 077
mkdir -p ~/secrets
ROOT_PW=$(openssl rand -hex 24)
DB_PW=$(openssl rand -hex 24)
ADMIN_KEY='<CLAVE_ADMIN>'
printf 'MYSQL_ROOT_PASSWORD=%s\nMYSQL_DATABASE=chatbot_db\n' "$ROOT_PW" > ~/secrets/chatbot-mysql.env
cat > server/.env <<EOF
NODE_ENV=production
PORT=4000
CORS_ORIGIN=http://<IP>
DB_HOST=mysql
DB_PORT=3306
DB_USER=chatbot_user
DB_PASSWORD=$DB_PW
DB_NAME=chatbot_db
DB_CONNECTION_LIMIT=10
ADMIN_API_KEY=$ADMIN_KEY
EOF
umask 022
```

**4. Levantar MySQL y cargar los datos**

Continuar en la misma sesión para conservar `DB_PW`.

```bash
docker network create chatbot
docker volume create chatbot_mysql_data
docker run -d --name mysql --network chatbot --restart unless-stopped \
  --env-file ~/secrets/chatbot-mysql.env -v chatbot_mysql_data:/var/lib/mysql mysql:8.4

as_root() { docker exec -i mysql sh -c 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" exec mysql -h127.0.0.1 -uroot --default-character-set=utf8mb4 "$@"' sh "$@"; }

# Se conecta por TCP para no confundirse con el servidor temporal de la inicialización.
until as_root -e 'SELECT 1' </dev/null >/dev/null 2>&1; do sleep 2; done

{ echo 'USE chatbot_db;'; sed -n '/^CREATE TABLE IF NOT EXISTS questions/,/ENGINE=InnoDB/p' database.txt; } | as_root
as_root <<SQL
CREATE USER IF NOT EXISTS 'chatbot_user'@'%' IDENTIFIED BY '$DB_PW';
GRANT SELECT, INSERT, UPDATE, DELETE ON chatbot_db.* TO 'chatbot_user'@'%';
SQL
as_root < seed_preguntas.sql
```

Si se exportó `questions.sql`, copiarlo al servidor y cargarlo después del seed con `as_root chatbot_db < questions.sql`. Reemplaza la tabla completa.

**5. Construir y levantar la aplicación**

```bash
docker build -t chatbot-server ./server
docker build -t chatbot-client ./client
docker run -d --name server --network chatbot --restart unless-stopped --env-file server/.env chatbot-server
docker run -d --name client --network chatbot --restart unless-stopped -p 80:80 chatbot-client
```

**6. Verificar**

- `docker logs server` muestra la conexión a MySQL y la API escuchando.
- Desde fuera, `http://<IP>/`, `/admin`, `/api/health` y `/api/questions` responden 200.
- `/api/admin/questions` responde 401 sin clave y 200 con `x-api-key`.
- Desde fuera, los puertos 3306 y 4000 no responden.
- La página abre en un navegador real, también en el celular. `curl` no detecta los problemas de redirección a HTTPS.

## Base de datos y seeds

- Orden de carga: las secciones 1 a 4 de `database.txt` y luego `seed_preguntas.sql`.
- `database.txt` no se puede ejecutar completo: la sección final son queries de referencia con `?` y da error de sintaxis en MySQL. El comando del README lo ejecuta entero, así que falla al llegar a esa parte.
- `seed_preguntas.sql` tiene las 15 preguntas actuales. Se puede ejecutar varias veces porque actualiza por `option_number` en lugar de duplicar filas.
- Las preguntas creadas o editadas desde `/admin` no llegan solas al seed. Hay que copiarlas a mano o quedarán fuera en una instalación nueva.

## Pendientes

- Programar backups de MySQL (`mysqldump` hacia S3): hoy los datos solo están en el volumen de la EC2.
- Configurar HTTPS. Sirve un dominio propio o, para empezar, uno gratuito como `<ip-con-guiones>.sslip.io` con Let's Encrypt. Requiere modificar `client/nginx.conf`, publicar el 443 y renovar el certificado automáticamente.
- Resolver el acceso desde celular: en el PC carga, pero las visitas móviles no llegaban a Nginx. La causa probable es que el navegador móvil fuerza `https://` y el 443 no atiende. HTTPS lo resolvería.
- Cerrar la regla del 3306 en el Security Group de la EC2 actual.
- Probar el scroll del chat en un navegador.
- Confirmar el número de WhatsApp: `client/.env`, `client/.env.example` y `client/Dockerfile` usan 573127384841, pero `README.md` y el valor por defecto de `client/src/config.js` tienen 573014837377.
