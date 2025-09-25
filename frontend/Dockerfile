# build do React
FROM node:20-alpine as build

WORKDIR /app

# copia package.json e package-lock.json
COPY package.json package-lock.json* ./

RUN npm install

# copia todo o restante do frontend
COPY . .

# build do React
RUN npm run build

# serve a build usando Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
