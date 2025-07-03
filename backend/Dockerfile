# Dockerfile
FROM node:18-slim

# Crear app directory
WORKDIR /usr/src/app

# Copiar dependencias
COPY package*.json ./

# Instalar solo dependencias necesarias
RUN npm install --production

# Copiar el resto del código
COPY . .

# Exponer el puerto que usa tu backend (ej: 4000)
EXPOSE 4000

# Comando para correr el backend
CMD ["node", "app.js"]
