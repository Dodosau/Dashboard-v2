# Dashboard (GitHub Pages)

Structure "un widget = un dossier" :

- `widgets/<name>/<name>.html`
- `widgets/<name>/<name>.css`
- `widgets/<name>/<name>.js` (exporte `init()`)

## Déploiement (GitHub Pages)
1. Crée un nouveau repo GitHub (public ou privé).
2. Uploade tous les fichiers à la racine du repo.
3. Settings → Pages → Branch `main` → Folder `/ (root)`
4. Ouvre l’URL GitHub Pages.

## Ajouter un widget
1. Crée `widgets/foo/foo.html`, `foo.css`, `foo.js`
2. Dans `index.html`, ajoute `<div data-widget="foo"></div>` à l’endroit voulu.
3. Dans `foo.js`, exporte `init()`.

## Config
Tout est dans `js/config.js` (APIs, refresh, timezone, etc.).

## PWA (iPad)
Ce repo inclut :
- `manifest.webmanifest`
- `service-worker.js` (cache offline basique)

Sur iPad (Safari) : Partager → "Sur l’écran d’accueil".
