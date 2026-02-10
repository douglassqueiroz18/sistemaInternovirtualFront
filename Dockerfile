# ----- STAGE 1: build Angular -----
FROM node:25-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
RUN cp -r dist/frontend/* /usr/share/nginx/html/ || cp -r dist/* /usr/share/nginx/html/

# Instala nginx e roda
RUN apk add --no-cache nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
