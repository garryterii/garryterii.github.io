# Migration vers Quarto : fait et à faire

Dernière mise à jour : 21/10/2026.

## Ce qui a été fait (par Claude, dans ce dossier, sans rien pousser)

1. **Correction de sécurité** dans `index.html` : suppression de la ligne qui chargeait `https://polyfill.io/v3/polyfill.min.js`. Ce domaine a été racheté en 2024 puis utilisé pour injecter du code malveillant dans plus de 380 000 sites ([The Hacker News](https://thehackernews.com/2024/07/polyfillio-attack-impacts-over-380000.html)). MathJax n'en a pas besoin. *Rien d'autre n'a changé dans ce fichier.*
2. **Projet Quarto ajouté à côté des anciennes pages** (aucun ancien fichier supprimé ni déplacé) :
   - `_quarto.yml`, `index.qmd`, `research/`, `teaching/`, `about/` (contenus repris des pages HTML, légèrement resserrés), `blog/` ;
   - deux billets **en brouillon** (`draft: true`) : *Du champ de phase au flot par courbure moyenne* (simulation Allen–Cahn en JavaScript) et *Newton, sécante, dichotomie* (curseurs Observable JS + figure Python) ;
   - thème clair/sombre, macros LaTeX, `refs.bib`, `requirements.txt`, `.gitignore` ;
   - le workflow GitHub Actions (`.github/workflows/publish.yml`) ;
   - cette documentation dans `docs/`.
3. **Vérification** : le site a été construit avec Quarto 1.9.37 (aucune erreur ni avertissement), puis ouvert dans Chromium. Formules, macros, théorème, renvois, citations en marge, simulation, curseurs OJS, figure Python et mode sombre fonctionnent. Captures dans [docs/captures/](captures/).

### Points relevés pendant la vérification

- Quarto charge **MathJax 3** (pas la version 4) et ajoute lui-même un script `polyfill` servi par **cdnjs.cloudflare.com**. Ce n'est pas le domaine compromis : c'est le miroir sûr mis en place par Cloudflare en 2024. Aucune action nécessaire.
- Une citation `[@...]` placée **à l'intérieur** d'un théorème, avec les références en marge, fait déborder l'encadré sur toute la largeur. Citer juste après le théorème (voir [03-ECRIRE-UN-BILLET.md](03-ECRIRE-UN-BILLET.md)).
- Les polices (Google Fonts) n'ont pas pu être chargées pendant le test : vérifier leur rendu au premier `quarto preview`.

## Ce qui reste à faire (par toi)

Le workflow est déjà à sa place dans `.github/workflows/publish.yml` (déplacé le 21/10). Les billets restent en brouillon (`draft: true`) tant que leur rendu n'est pas validé : en ligne, on verra les pages mais pas encore les billets. Pour relire les billets, utiliser l'aperçu Claude ou `quarto preview`.

### Étape 1 — Publier la correction de sécurité et retirer l'ancien site (Git Bash, PC du bureau)

```bash
cd ~/Documents/MCFC/site/garryterii.github.io
git status                       # contrôle : index.html modifié, nouveaux fichiers non suivis

git add index.html
git commit -m "Retire le script polyfill.io (domaine compromis)"

git rm index.html styles.css about/index.html research/index.html teaching/index.html
git add .
git commit -m "Passage à Quarto : pages, carnet, thème, workflow"
```

Les anciennes pages restent récupérables dans l'historique Git (`git show HEAD~1:index.html`). Le CV `about/CV.pdf` est conservé.

### Étape 2 — Basculer GitHub Pages sur le workflow, puis pousser

1. Sur GitHub, dépôt `garryterii.github.io` : **Settings > Pages > Build and deployment > Source = GitHub Actions**.
2. Pousser :
   ```bash
   git push
   ```
3. Onglet **Actions** : le workflow « Publier le site » tourne 2 à 3 minutes. Quand il est vert, recharger https://garryterii.github.io (Ctrl+F5).

Entre le changement de réglage et la fin du workflow, le site peut être indisponible quelques minutes.

Si le workflow échoue, ouvrir l'étape en rouge dans l'onglet Actions et copier le message d'erreur : c'est le plus utile pour corriger.

### Étape 3 — Installer et tester sur le nouvel ordinateur

Suivre [01-INSTALLATION-PC.md](01-INSTALLATION-PC.md), cloner le dépôt, puis `quarto preview`. Relire les deux billets et les pages ; ajuster le texte d'accueil et la liste « Cours actuels » de `teaching/index.qmd`.

### Étape 4 — Publier le premier billet

Retirer la ligne `draft: true` du billet validé, `git commit`, `git push`.

## Liste de contrôle

- [x] Workflow déplacé dans `.github/workflows/`
- [ ] Étape 1 : correction polyfill et retrait de l'ancien site validés (commits)
- [ ] Étape 2 : Pages en mode GitHub Actions, push, site en ligne vérifié
- [ ] Étape 3 : outils installés sur le nouveau PC, `quarto preview` vérifié
- [ ] Texte d'accueil et enseignements relus
- [ ] Zotero : export automatique de `refs.bib` (facultatif)
- [ ] Étape 4 : premier billet publié

## Pistes pour la suite

- Remplacer les GIF par des vidéos MP4 courtes (`{{< video fichier.mp4 >}}`) pour les simulations lourdes (démouillage, flot 3D).
- Python dans le navigateur : extension `quarto-live` (Pyodide) pour un billet où le lecteur modifie le schéma. Vérifier qu'elle est maintenue avant de l'adopter.
- Billets en anglais pour VISxAI ou les blogposts ICLR : un sous-dossier `blog/posts/en/` avec `lang: en`.
