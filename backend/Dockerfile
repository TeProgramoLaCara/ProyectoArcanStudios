FROM node:20-alpine

WORKDIR /app

# Instalar dependencias (incluyendo devDependencies para compilar)
COPY package*.json ./
RUN npm install

# Copiar el código fuente
COPY . .

# Compilar el código NestJS (genera la carpeta dist/)
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
