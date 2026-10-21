# Sites de référence : comment ils sont faits, ce qu'on en reprend

Analyse du 21/10/2026. Les 8 premiers sites ont été ouverts dans le navigateur intégré : leurs scripts, feuilles de style et polices ont été lus dans la page elle-même. Les sites de la seconde partie ont été lus en texte seulement, donc leur outillage est en partie déduit.

## Les blogs de tes marque-pages

| Site | Générateur / thème | Maths | Figures et simulations | Mise en page | Typographie |
|---|---|---|---|---|---|
| [Cîndea, méthodes numériques](https://lmbp.uca.fr/~cindea/blog/post/met-num-equations-nonlin/) | Hugo 0.123.7, thème Blackburn | MathJax 3.2.2 | Diaporamas de PNG (boutons ❮ ❯) | Menu latéral, commentaires Disqus | Raleway (titres), sans-serif, colonne de 800 px max |
| [ICLR Blogposts 2023, EDP autorégressives](https://iclr-blogposts.github.io/2023/blog/2023/autoregressive-neural-pde-solver/) | Jekyll al-folio, gabarit Distill | MathJax 3.2.0 | GIF, PNG, figure Plotly en iframe (curseur, environ 16 Mo) | Sommaire, citations au survol, BibTeX, mode sombre | Roboto 14 px |
| [Lil'Log](https://lilianweng.github.io/posts/2018-08-12-vae/) | Hugo 0.163.3, thème PaperMod | MathJax 3.2.2 | PNG statiques | Sommaire, clair/sombre, recherche | Police système 16 px, colonne de 748 px max |
| [Simon Coste](https://scoste.fr/posts/flowmatching/) | Franklin.jl, thème Hyde | KaTeX **pré-rendu à la construction** (aucun JS) | PNG et SVG, peu d'images | Sommaire, renvois d'équations, barre latérale | PT Sans 17 px |
| [Vlad Niculae](https://vene.ro/blog/mirror-descent.html) | Pelican | KaTeX 0.12 | PNG et un graphique d3 v3 écrit à la main | **Notes en marge à la Tufte**, sommaire | PT Serif 18 px, interligne 1,66 |
| [Frank Nielsen, Divergences](https://franknielsen.github.io/Divergence/) | HTML à la main, sans CSS | Aucun moteur | PNG, JPEG, GIF | Page-liste de liens | Times par défaut |
| [Diffusion Meets Flow Matching](https://diffusionflow.github.io/) | Jekyll al-folio, gabarit Distill (ICLR blogposts 2025) | MathJax 3.2.0 | 4 figures Plotly interactives (curseurs), GIF de particules | Sommaire, citations au survol, mode sombre | Roboto 14 px |
| [Transformer Explainer](https://poloclub.github.io/transformer-explainer/) | Application SvelteKit (Vite, Tailwind) | KaTeX | 96 canvas, 152 SVG ; GPT-2 dans le navigateur (ONNX, déduit) | Application plein écran + article | Tailwind sans-serif |

**En une ligne par site :**

- **Cîndea** traite presque le programme de Méthodologie 4B. Chaque méthode est un diaporama de 5 à 7 images ; un curseur Observable JS fait mieux, et sert aussi en cours.
- **ICLR Blogposts** et **Diffusion Meets Flow Matching** utilisent la même recette : gabarit Distill sur al-folio, et figures Plotly exportées depuis Python dans des iframes. Lourd, mais rapide à produire.
- **Lil'Log** est la référence du blog technique sobre : une colonne, sommaire, mode sombre, tout en images statiques.
- **Simon Coste** pré-rend ses formules : la page s'affiche instantanément. Ses notes sont rangées en séries (« Flow models I–V »).
- **Vlad Niculae** a la meilleure typographie de la liste : serif en 18 px, notes en marge à la Tufte.
- **Frank Nielsen** est un index de références, à prendre comme modèle de page « ressources », pas de style.
- **Transformer Explainer** est une application complète : hors de portée d'un billet de blog.

## Les sites cités en exemple

| Site | Ce qu'on a observé | Ce qu'on en reprend |
|---|---|---|
| [francisbach.com](https://francisbach.com/) | WordPress, thème générique ; LaTeX rendu dans le navigateur ; figures en PNG et GIF générés en Python ; preuves en fin de billet | Le modèle éditorial : le texte d'abord, des figures simples, les preuves à la fin |
| [gpeyre.com](https://www.gpeyre.com/), [Mathematical Nexus](https://www.gpeyre.com/mathematical-nexus/) | Catalogue de vignettes (images et vidéos) reliées à des notebooks, avec filtres | Plus tard, une page « Galerie » de simulations renvoyant chacune à son billet ou à son code |
| [distill.pub](https://distill.pub/) | Revue en pause depuis juillet 2021, gabarit non maintenu ; figures interactives codées à la main par article | Les colonnes larges, notes et citations en marge : Quarto les fournit (`.column-page`, `reference-location: margin`) |
| [VISxAI](https://visxai.io/) | Format libre : on soumet un lien vers une page en ligne | Un débouché pour un billet ambitieux sur les réseaux pour les EDP |
| 3Blue1Brown | manim (Community Edition 0.22) ; sortie vidéo uniquement | Des MP4 courts pour les idées géométriques |
| [The Coding Train](https://thecodingtrain.com/) | Croquis p5.js 2.x ouverts dans l'éditeur p5 | p5.js reste une option pour une simulation en canvas, à la place du JavaScript pur |

## Ce que le site Quarto reprend déjà

| Effet | Où |
|---|---|
| Notes et références dans la marge (Niculae, Distill) | `reference-location: margin`, `citation-location: margin`, `.column-margin` dans `_quarto.yml` et les billets |
| Citations et notes au survol (Distill) | `citations-hover`, `footnotes-hover` |
| Sommaire à gauche (Lil'Log, al-folio) | `blog/_metadata.yml` |
| Mode sombre (PaperMod, al-folio) | `assets/theme-dark.scss` |
| Serif lisible en 17 px, colonne de 680 px (Niculae, Coste) | `assets/theme.scss`, `grid.body-width` |
| Curseurs à la place des diaporamas (Cîndea) | Billet Newton, Observable JS |
| Simulation temps réel en canvas | Billet Allen–Cahn |
| Séries de billets (Coste) | `categories` + filtre de la page Carnet |

## À essayer plus tard

- Figures **Plotly** produites directement par une cellule Python (sans iframe) pour les champs de phase en fonction du temps.
- **Pré-rendu des formules** à la construction, comme Coste : possible avec un filtre Lua et KaTeX, au prix de la numérotation automatique. Pas prioritaire.
