# Estágio 1: Build
FROM node:25-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build 2>&1 | tail -20  # Mostra erros

# Estágio 2: Serve
FROM nginx:stable-alpine
COPY --from=build /app/dist/frontend/ /usr/share/nginx/html/
# Se não existir, copia dist/ diretamente
COPY --from=build /app/dist/ /usr/share/nginx/html/
EXPOSE 80
