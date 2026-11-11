FROM node:22-alpine AS build

# Vite incrusta estas variables en el bundle, por eso se definen al construir la imagen.
ARG VITE_API_URL=/api
ARG VITE_WHATSAPP_NUMBER=573127384841
ARG VITE_WHATSAPP_MESSAGE="Hola, quiero más información."
ENV VITE_API_URL=$VITE_API_URL \
    VITE_WHATSAPP_NUMBER=$VITE_WHATSAPP_NUMBER \
    VITE_WHATSAPP_MESSAGE=$VITE_WHATSAPP_MESSAGE

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
