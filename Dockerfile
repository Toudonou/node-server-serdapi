# Utiliser une image Node.js officielle légère
FROM node:24-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port sur lequel l'application tourne
EXPOSE 3050

# Commande pour démarrer l'application
CMD ["node", "index.js"]
