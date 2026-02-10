# ----- STAGE 1: build Angular -----
FROM node:25-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --configuration production

# ----- STAGE 2: serve com Nginx -----
FROM nginx:stable-alpine

COPY --from=build /app/dist/ /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
