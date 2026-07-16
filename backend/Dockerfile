# ETAPA 1: "cocina" — con TODAS las dependencias (incluye devDependencies para compilar TypeScript)
FROM node:20-alpine AS build
WORKDIR /app
# Copiamos SOLO los archivos de dependencias primero (para aprovechar la caché)
COPY package*.json ./
RUN npm ci
# RECIÉN AHORA copiamos todo el código fuente
COPY . .
RUN npx prisma generate
RUN npm run build

# ETAPA 2: "vitrina" — solo dependencias de producción, sin devDependencies
FROM node:20-alpine AS final
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
EXPOSE 3000
CMD ["node", "dist/main"]