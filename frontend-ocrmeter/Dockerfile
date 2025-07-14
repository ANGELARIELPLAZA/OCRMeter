# Etapa 1: build de Vite
FROM node:18-alpine as build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Etapa 2: producción con Nginx
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
