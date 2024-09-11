# Usar una imagen oficial de Node.js como base
FROM node:18

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Exponer el puerto en el que la aplicación escuchará
EXPOSE 4000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
