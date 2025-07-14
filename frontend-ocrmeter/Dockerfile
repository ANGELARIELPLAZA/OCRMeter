# Etapa 1: build de producción
FROM node:18 as builder

WORKDIR /app
COPY . .
RUN npm install
ENV NODE_ENV=production
RUN npm run build

# Etapa 2: Nginx para servir la app
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/certs /etc/nginx/certs
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
