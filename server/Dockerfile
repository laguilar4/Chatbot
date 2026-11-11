FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

USER node
EXPOSE 4000

# Se ejecuta node directamente para que reciba SIGTERM y cierre de forma ordenada.
# Las variables (DB_*, ADMIN_API_KEY, ...) se pasan al ejecutar el contenedor.
CMD ["node", "src/index.js"]
