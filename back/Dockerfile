# Utilisez une version LTS de Node
FROM node:18-slim

# Créer le répertoire de l'application
WORKDIR /app

# Copier les fichiers package*.json
COPY back/package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY back/ .

# Créer le dossier uploads et ses sous-dossiers
RUN mkdir -p uploads/profiles

# Donner les permissions appropriées
RUN chmod -R 755 /app/uploads

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["node", "server.js"]