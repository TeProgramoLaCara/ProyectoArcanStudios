FROM node:20-alpine

WORKDIR /app

# Instalar dependencias (incluyendo devDependencies para poder compilar)
COPY package*.json ./
RUN npm install

# Copiar el código fuente
COPY . .

# Compilar Next.js (genera la carpeta .next/)
RUN npm run build

EXPOSE 4000

# Iniciamos Next.js especificando explícitamente el puerto 4000 para enlazar con Nginx
CMD ["npx", "next", "start", "-p", "4000", "-H", "0.0.0.0"]
