# Migration vers Quarto : fait et à faire

Dernière mise à jour : 31/10/2026. **La migration est faite** : le site Quarto est en ligne depuis le 21/10/2026.

## Ce qui a été fait

1. **Correction de sécurité** (21/10) : suppression dans l'ancien `index.html` du script `https://polyfill.io/v3/polyfill.min.js`. Ce domaine a été racheté en 2024 puis utilisé pour injecter du code malveillant dans plus de 380 000 sites ([The Hacker News](https://thehackernews.com/2024/07/polyfillio-attack-impacts-over-380000.html)). Commit `09e876c`.
2. **Passage à Quarto** (21/10, commit `1cc6922`) : pages `index.qmd`, `research/`, `teaching/`, `about/` (contenus repris des pages HTML), `blog/` avec deux billets en brouillon, thème clair/sombre, macros LaTeX, `refs.bib`, `requirements.txt`, workflow `.github/workflows/publish.yml`, cette documentation. Les anciennes pages HTML sont retirées ; elles restent dans l'historique Git (`git show 09e876c:index.html`). Le CV `about/CV.pdf` est conservé.
3. **GitHub Pages en mode GitHub Actions** et premier déploiement réussi (21/10).
4. **MathJax en sortie SVG** (21/10, commit `b2eb59d`), réglé dans `_quarto.yml` (`html-math-method`).
5. **PC fixe** (30/10) : dépôt cloné dans `C:\Users\ADMIN\work\garryterii.github.io`, Quarto 1.10.19.
6. **Première page compagnon** (30/10, commit `4ac3cc4`) : `teaching/descente-un-pas/` (`index.qmd` + `descente.js`), liée depuis la section « Pages compagnon » de `teaching/index.qmd`. Vérifiée en ligne : https://garryterii.github.io/teaching/descente-un-pas/

### Points relevés

- Quarto charge **MathJax 3** (pas la version 4) et ajoute lui-même un script `polyfill` servi par **cdnjs.cloudflare.com**. Ce n'est pas le domaine compromis : c'est le miroir sûr mis en place par Cloudflare en 2024. Aucune action nécessaire.
- Une citation `[@...]` placée **à l'intérieur** d'un théorème, avec les références en marge, fait déborder l'encadré sur toute la largeur. Citer juste après le théorème (voir [03-ECRIRE-UN-BILLET.md](03-ECRIRE-UN-BILLET.md)).
- Quarto ajoute `**/*.quarto_ipynb` au `.gitignore` et le réécrit avec des fins de ligne CRLF sous Windows : les remettre en LF avant de commiter.
- Le workflow utilise Quarto 1.9.37, le PC fixe 1.10.19. Si un rendu diffère entre l'aperçu local et le site en ligne, aligner la version dans `publish.yml`.

## Ce qui reste à faire

- Relire la page `descente-un-pas` : encadré « Prototype » en haut de page, libellé « AUTEUR·RICE » affiché par Quarto.
- Relire le texte d'accueil et la liste « Cours actuels » de `teaching/index.qmd`.
- Relire les deux billets en brouillon (`quarto preview`), puis publier le premier : retirer `draft: true`, `git commit`, `git push`.
- Facultatif : export automatique de `refs.bib` depuis Zotero.

## Liste de contrôle

- [x] Workflow dans `.github/workflows/`
- [x] Correction polyfill et retrait de l'ancien site (commits `09e876c`, `1cc6922`)
- [x] Pages en mode GitHub Actions, push, site en ligne vérifié (21/10)
- [x] Outils installés sur le PC fixe, rendu local vérifié (30/10)
- [x] Première page compagnon publiée (30/10)
- [ ] Texte d'accueil et enseignements relus
- [ ] Encadré « Prototype » de `descente-un-pas` relu
- [ ] Zotero : export automatique de `refs.bib` (facultatif)
- [ ] Premier billet publié

## Pistes pour la suite

- Remplacer les GIF par des vidéos MP4 courtes (`{{< video fichier.mp4 >}}`) pour les simulations lourdes (démouillage, flot 3D).
- Python dans le navigateur : extension `quarto-live` (Pyodide) pour un billet où le lecteur modifie le schéma. Vérifier qu'elle est maintenue avant de l'adopter.
- Billets en anglais pour VISxAI ou les blogposts ICLR : un sous-dossier `blog/posts/en/` avec `lang: en`.
