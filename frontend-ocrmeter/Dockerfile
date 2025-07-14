# Etapa 1: Compila el frontend
FROM node:18 as builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Etapa 2: Solo entrega el frontend
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
