# Étape 1 : Utiliser une image de base officielle pour Node.js
FROM node:20-alpine

# Étape 2 : Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Étape 3 : Copier les fichiers nécessaires (package.json et pnpm-lock.yaml)
COPY package.json front/pnpm-lock.yaml ./

# Installer pnpm et les dépendances
RUN npm install -g pnpm && pnpm install

# Étape 4 : Copier le fichier .env dans le conteneur
COPY src/.env .env

# Étape 5 : Copier tout le reste des fichiers de front/src dans le conteneur
COPY src /app/src

# Étape 6 : Copier le dossier public dans le conteneur
COPY public /app/public

# Étape 7 : Copier les fichiers de configuration de Tailwind et PostCSS
COPY tailwind.config.ts /app/tailwind.config.ts
COPY postcss.config.mjs /app/postcss.config.mjs

# Étape 8 : Construire l'application Next.js
RUN pnpm build

# Vérifier la présence du dossier .next
RUN ls -la /app/.next

# Étape 9 : Exposer le nouveau port 3001
EXPOSE 3001

# Étape 10 : Démarrer l'application avec next start
CMD ["next", "start", "-p", "3001"]