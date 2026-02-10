# Estágio 1: Build
FROM node:25-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Serve
FROM nginx:stable-alpine
COPY --from=build /app/dist/frontend/ /usr/share/nginx/html/
# Ou se não tiver subpasta:
COPY --from=build /app/dist/ /usr/share/nginx/html/
EXPOSE 80
