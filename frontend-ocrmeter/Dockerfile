# Etapa 1: build de producción
FROM node:18 as builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Etapa 2: Nginx para servir la app
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configuración básica de nginx (opcional)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
