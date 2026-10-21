# garryterii.github.io

Site personnel et carnet (blog) de Garry Terii, construit avec [Quarto](https://quarto.org) et publié sur GitHub Pages par GitHub Actions.

> **État au 21/10/2026.** Le projet Quarto est en place dans ce dossier, mais rien n'est encore poussé sur GitHub. Le site en ligne est toujours l'ancien site HTML (corrigé : le script `polyfill.io` a été retiré de `index.html`). Les étapes pour basculer sont dans [docs/02-MIGRATION.md](docs/02-MIGRATION.md).

## Les documents à lire, dans l'ordre

| Fichier | Contenu |
| --- | --- |
| [docs/01-INSTALLATION-PC.md](docs/01-INSTALLATION-PC.md) | Installer les outils sur le nouvel ordinateur personnel (Git, Quarto, VS Code, Python) |
| [docs/02-MIGRATION.md](docs/02-MIGRATION.md) | Ce qui a été fait, ce qui reste à faire, avec les commandes exactes |
| [docs/03-ECRIRE-UN-BILLET.md](docs/03-ECRIRE-UN-BILLET.md) | Écrire un billet : maths, théorèmes, citations, notes en marge, code, simulations |
| [docs/04-SITES-DE-REFERENCE.md](docs/04-SITES-DE-REFERENCE.md) | Analyse des blogs de référence (Bach, Peyré, Distill, Lil'Log, Niculae…) et ce qu'on en reprend |

## Structure du dépôt

```
_quarto.yml              configuration du site (menu, thème, MathJax, marges)
index.qmd                page d'accueil (présentation + 3 derniers billets)
research/index.qmd       publications
teaching/index.qmd       enseignements
about/index.qmd          à propos (+ about/CV.pdf)
blog/index.qmd           le carnet : liste des billets, filtres, flux RSS
blog/_metadata.yml       options communes aux billets (sommaire, bibliographie)
blog/posts/AAAA-MM-JJ-titre/index.qmd   un dossier par billet, avec son code
refs.bib                 bibliographie commune (à terme : export Zotero)
assets/theme.scss        style clair (polices, couleur d'accent, théorèmes, simulations)
assets/theme-dark.scss   style sombre
assets/macros.html       macros LaTeX communes (\R, \eps, \norm…)
.github/workflows/publish.yml   construction et publication automatiques
requirements.txt         paquets Python pour les billets qui exécutent du code
docs/                    documentation du projet (non publiée)
```

## Commandes courantes

```bash
quarto preview            # aperçu local, se met à jour à chaque sauvegarde
quarto render             # construit tout le site dans _site/
git add . && git commit -m "Nouveau billet : ..." && git push   # publie (l'Action fait le reste)
```

## Choix techniques, en bref

- **Quarto 1.9** : théorèmes numérotés et renvois (`@thm-...`, `@eq-...`), citations `.bib`, notes et références dans la marge, blog avec RSS, code Python exécuté, Observable JS pour l'interactif.
- **MathJax 3** (celui que Quarto charge par défaut) avec les macros de `assets/macros.html`.
- **Style** : texte en Literata, interface en IBM Plex Sans, code en JetBrains Mono ; une seule couleur d'accent (bleu-vert lagon) ; mode sombre automatique.
- **Publication** : GitHub Actions construit le site à chaque `push` sur `main` et le dépose sur GitHub Pages. Les billets en brouillon (`draft: true`) ne sont pas publiés.
