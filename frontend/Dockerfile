# ETAPA 1: "taller" — Node con devDependencies, compila los assets estáticos
FROM node:20-alpine AS build
WORKDIR /app
# Igual que en el backend: copiamos primero los archivos de dependencias
# para que Docker cachee la capa de `npm ci` mientras no cambie el package*.json
COPY package*.json ./
RUN npm ci
COPY . .
# Vite "hornea" las variables VITE_* dentro del JS en tiempo de build,
# no las lee en runtime como hace @nestjs/config. Por eso entra como
# build ARG (ver docker-compose.yml) y no como variable de entorno del contenedor final.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ETAPA 2: "vitrina" — nginx sirviendo los estáticos, sin Node ni node_modules
FROM nginx:alpine AS final
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
