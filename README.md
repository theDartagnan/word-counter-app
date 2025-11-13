# Compteur de mots d'articles PDF

Application web pour compter les mots d'un article de recherche au format PDF.

Cette application permet aux auteurs comme aux relecteurs d'articles de recherche de compter uniformément les mots d'une soumissions PDF d'un article de recherche pour une conférence ou un journal.
Elle est pensée pour ne nécessiter aucun traitement serveur ; le fichier PDF n'est donc pas transmis à une machine extérieur. L'application fonctionne de manière entièrement autonome dans le navigateur et ne transmet aucune information personnelle à un serveur distant.

## Mise en place

prérequis : node >= 22

Installation des dépendances

```shell
npm ci
```

## Construction de l'application

Si le déploiement est prévu sur la racine du domaine d'hébergement :

```shell
npm run build
```

Si le déploiement est prévu sur un chemin X du domaine (http://domaine/X) :

```shell
PUBLIC_PATH=/X npm run build
```

### Variables d'environnement supplémentaires

Les variables d'environnement suivante, si positionnées lors du build, influencent ce dernier.

- COUNT_DETAILS : calcule et affiche les différentes variantes de comptage si égale à 1

### Fichiers produits :

- index.html : page principale de l'application (SPA)
- runtime.\*.bundle.js : bundle js de démarrage de l'application 
- vendors.\*.bundle.js : bundle des api tierces
- main.\*.bundle.js : application
- pdf.worker.min.js : worker de décodage PDF
- main.\*.css : feuille de style de l'application
- bundler-\*.\*.bundle.js : parties de l'application accessible en différé à la demande (ex.: mentions légales)
- images : images utilisées dans l'application
- assets/ : icones, manifest, etc.
- .htaccess : configuration Apache httpd pour un déploiement facilité sur ce type de serveur

## Déploiement

le contenu de `./build/public` est à publier sur le serveur.

Le contenu de `./build/build-report` n'est pas à publier et doit être réservé aux développeurs et administrateurs système.

### Déploiement sur serveur Apache httpd (utilisation .htacess)

Prérequis :

- Module rewrite activé
- Htaccess autorisé pour la ré-écriture d'url 

Le déploiement se fait simplement en plaçant les fichiers de `build/public` dans le répertoire de publication. Ce répertoire doit correspondre au chemin public utilisé lors du build.

Le build présentant son propre fichier .htaccess, aucune configuration particulière du serveur autre que les prérequis n'est attendue.

### Apache httpd (sans .htaccess)

Prérequis :

- Module rewrite activé

Le déploiement se fait en plaçant les fichiers de `build/public` dans le répertoire de publication, à l'exception du fichier .htaccess pour éviter tout conflit avec la configuration suivante. Ce répertoire doit correspondre au chemin public utilisé lors du build.

Exemple de configuration pour un déploiment à la racine du domaine (à mettre dans `<VirtualHost>`)

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-l
RewriteRule . /index.html [L]
```

Exemple de configuration pour un déploiment dans le chemin X

```apache
RewriteEngine On
RewriteRule ^/X$ /X/ [R,L]
RewriteBase /X/
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-l
RewriteRule . /X/index.html [L]
```

### nginx

Le déploiement se fait simplement en plaçant les fichiers de `build/public` dans le répertoire de publication. Ce répertoire doit correspondre au chemin public utilisé lors du build.

Exemple de configuration pour un déploiement à la racine du domaine

```nginx
location / {
  try_files $uri /index.html;
}
```

Exemple de configuration pour un déploiment dans le chemin X

```nginx
location /X/ {
  try_files $uri /X/index.html;
}
```

## Auteurs

Rémi Venant <remi.venant@univ-lemans.fr.com>