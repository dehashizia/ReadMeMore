# Cahier des Charges - Application ReadMeMore

## 1. Contexte du projet

ReadMeMore est une application de gestion de bibliothèque personnelle permettant aux utilisateurs de rechercher, ajouter, et organiser leurs livres. Elle vise à offrir une interface intuitive pour les utilisateurs finaux tout en fournissant des fonctionnalités d'administration pour gérer les livres et les utilisateurs.

## 2. Objectifs du projet

- Créer une application accessible sur mobile et desktop.
- Permettre aux utilisateurs de gérer leur collection de livres.
- Intégrer des fonctionnalités d'administration pour la gestion des livres et des utilisateurs.
- Garantir la sécurité des données et l'intégrité des sessions utilisateur.

## 3. Fonctionnalités

### 3.1. Fonctionnalités principales

#### 3.1.1. Authentification et autorisation

- Inscription : Permettre aux utilisateurs de s'inscrire avec un nom d'utilisateur, un mot de passe et un email.
- Connexion : Authentifier les utilisateurs avec un nom d'utilisateur et un mot de passe.
- Déconnexion : Permettre aux utilisateurs de se déconnecter de leur compte.
- Réinitialisation de mot de passe : Permettre aux utilisateurs de réinitialiser leur mot de passe en cas d'oubli.
- Changement de mot de passe : Permettre aux utilisateurs de changer leur mot de passe à partir de leur profil.

#### 3.1.2. Gestion des livres

- Recherche de livres : Permettre aux utilisateurs de rechercher des livres à l'aide de l'API Google Books.
- Ajout de livres : Permettre aux utilisateurs d'ajouter des livres à leur bibliothèque à partir des résultats de recherche.
- Filtrage de livres : Permettre aux utilisateurs de filtrer les livres par catégorie.
- Bibliothèque personnelle : Afficher les livres ajoutés par l'utilisateur, organisés par statut (à lire, en cours, lus).

#### 3.1.3. Fonctionnalités d'administration

- Gestion des utilisateurs :
  - Ajouter, modifier, et supprimer des utilisateurs.
  - Bloquer ou débloquer des comptes utilisateurs.
- Gestion des livres :
  - Ajouter, modifier, et supprimer des livres dans la base de données.
  - Afficher une liste des livres disponibles.

### 3.2. Liste des fonctionnalités du MVP

- Authentification et autorisation (inscription, connexion, déconnexion).
- Gestion des livres (recherche, ajout, filtrage, bibliothèque personnelle).
- Fonctionnalités d'administration (gestion des utilisateurs et des livres).

### 3.3. Liste des fonctionnalités optionnelles

- Scanner de livres : Permettre aux utilisateurs de scanner des codes-barres pour ajouter des livres à leur bibliothèque.
- Statistiques : Afficher des statistiques sur les livres (nombre total de livres, livres lus, etc.).
- Thèmes personnalisés : Permettre aux utilisateurs de choisir un thème clair ou sombre.

## 4. Exigences techniques

### 4.1. Technologies utilisées

- **Front-end :**
- - Next.js
  - React
  - TypeScript
  - Tailwind CSS
- **Back-end :**
  - Node.js
  - Express
  - PostgreSQL
  - pg (PostgreSQL client pour Node.js)
- **Sécurité :**
  - JWT pour l'authentification
  - CORS pour les requêtes cross-origin
  - CSRF protection
  - XSS protection
- **Docker :** Utilisation de Docker pour la conteneurisation de l'application.

### 4.2. Architecture

- L'application sera développée avec une architecture découplée, où le front-end et le back-end seront dans le même repository mais fonctionneront de manière indépendante.
- API RESTful pour la communication entre le front-end et le back-end.

### 4.3. CI/CD

- Intégration de pipelines CI/CD pour automatiser le déploiement et les tests à chaque mise à jour de code.
- Utilisation d'outils comme GitHub Actions ou Travis CI pour automatiser les tests et les déploiements.

### 4.4. Tests automatisés

- Mise en place de tests unitaires pour vérifier le bon fonctionnement de chaque composant.
- Utilisation de frameworks de test comme Jest ou Mocha pour le front-end et le back-end.

## 5. Planning prévisionnel

- **Phase de conception (2 semaines)**
  - Finalisation des maquettes
  - Création du MCD, MLD, et diagrammes UML
- **Phase de développement (4-6 semaines)**
  - Développement du front-end (3 semaines)
  - Développement du back-end (3 semaines)
  - Intégration et tests (2 semaines)
- **Phase de déploiement (1 semaine)**
  - Déploiement sur un serveur de production
  - Documentation de l'API
- **Phase de tests et validation (1 semaine)**
  - Tests unitaires et fonctionnels
  - Validation finale par des utilisateurs test

## 6. Analyse des risques

### Risques techniques :

- Difficultés dans l'intégration des API tierces.
- Problèmes de performance en cas d'utilisation intensive.

### Risques de sécurité :

- Risque d'accès non autorisé aux fonctionnalités administratives.
- Risques liés aux failles de sécurité XSS et CSRF.

## 7. Documentation et suivi

- Un journal de bord sera tenu pour suivre l'avancement du projet et les tâches réalisées.
- Utilisation d’un outil de gestion de projet (ex. : Trello, GitHub Projects) pour organiser les tâches et les priorités.