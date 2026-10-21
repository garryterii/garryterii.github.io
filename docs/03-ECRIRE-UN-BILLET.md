# Écrire un billet

## 1. Créer le dossier

Un billet = un dossier `blog/posts/AAAA-MM-JJ-titre-court/` contenant `index.qmd`, et à côté ses fichiers (code, images, vidéos, données).

```yaml
---
title: "Titre du billet"
description: "Une phrase qui donne envie de lire (affichée dans la liste)."
date: 2026-12-01
categories: [fondamentaux, analyse numérique]   # travaux | fondamentaux | IA appliquée, + thèmes
draft: true          # visible dans quarto preview, pas en ligne ; retirer pour publier
---
```

Le sommaire, la bibliographie (`refs.bib`) et les options de marge sont réglés pour tous les billets dans `blog/_metadata.yml`.

## 2. Les maths

LaTeX habituel : `$...$` en ligne, `$$...$$` en display. Les macros de `assets/macros.html` (`\R`, `\N`, `\C`, `\eps`, `\dd`, `\norm{}`, `\abs{}`, `\Per`, `\Div`) sont disponibles partout ; y ajouter les tiennes.

**Équation numérotée et renvoi :**

```markdown
$$
\partial_t u=\Delta u-\frac{1}{\eps^2}W'(u)
$$ {#eq-ac}

La solution de @eq-ac ...        → « Équation 2 », avec lien
```

Pour un `align`, mettre tout l'environnement dans `$$ ... $$` et le label après.

**Théorèmes et preuves :**

```markdown
::: {#thm-modica}
## Modica–Mortola
Énoncé...
:::

Ce résultat est dû à @modica1977.     ← citer APRÈS le bloc, pas dedans

::: {.proof}
*Idée.* ...
:::

Comme le montre le @thm-modica, ...
```

Préfixes disponibles : `thm` (théorème), `lem`, `prp`, `cor`, `def`, `cnj`, `exm`, `exr`, `rem`, `alg`. Tous sont numérotés et en français. `.proof` n'est pas numérotée.

> Une citation à l'intérieur d'un théorème fait déborder l'encadré sur toute la largeur (la référence part dans la marge et entraîne le bloc). Citer juste après.

## 3. Citations et notes

- `[@allen1979]` → (Allen et Cahn 1979) ; `@allen1979` → Allen et Cahn (1979). La référence complète s'affiche **dans la marge**, à hauteur du texte.
- Ajouter une référence : l'ajouter dans Zotero (collection « Carnet ») si l'export automatique est en place, sinon la copier dans `refs.bib`.
- Note en marge :
  ```markdown
  ::: {.column-margin}
  Remarque courte, affichée à droite (sous le paragraphe sur téléphone).
  :::
  ```
- Note de bas de page classique : `texte^[contenu de la note]`, elle aussi rendue dans la marge.

## 4. Figures et mise en page

```markdown
![Légende](figure.png){#fig-profil}          → « Figure 1 », renvoi avec @fig-profil

::: {.column-page}                              → figure plus large que le texte
![...](grande-figure.png)
:::
```

Largeurs disponibles : `.column-body` (texte), `.column-page` (texte + marge), `.column-screen-inset` (presque tout l'écran).

## 5. Code et simulations : quel niveau choisir ?

| Niveau | Quand | Comment |
| --- | --- | --- |
| **Vidéo** | Simulation lourde calculée chez toi (Cahn–Hilliard 3D, démouillage, entraînement d'un réseau) | Exporter un MP4 H.264 de quelques Mo, puis `{{< video demouillage.mp4 >}}` |
| **Python exécuté** | Une figure calculée à la construction (convergence, profils) | Cellule ```` ```{python} ```` ; le résultat est figé dans `_freeze/` |
| **Observable JS** | Curseurs et figure réactive, légers (Newton, point fixe, paramètres d'une EDO) | Cellules ```` ```{ojs} ```` avec `Inputs.range` et `Plot` ; voir le billet Newton |
| **JavaScript libre** | Simulation temps réel sur grille (Allen–Cahn, réaction-diffusion) | Un fichier `.js` dans le dossier du billet + un bloc ```` ```{=html} ```` ; voir le billet Allen–Cahn |
| **Python dans le navigateur** | Le lecteur modifie et relance du Python | Extension `quarto-live` (Pyodide) ; à tester avant d'adopter |

### Python exécuté

````markdown
```{python}
#| label: fig-ordres
#| fig-cap: "Erreur en fonction du nombre d'itérations."
#| code-fold: true
#| code-summary: "Voir le code Python"
import numpy as np
import matplotlib.pyplot as plt
...
plt.show()
```
````

Avec `freeze: auto`, le code n'est relancé que si le billet change. **Valider le dossier `_freeze/`** avec le billet : la publication n'a alors pas besoin de refaire le calcul.

### Observable JS

````markdown
```{ojs}
//| echo: false
viewof x0 = Inputs.range([0.6, 4], {value: 3.5, step: 0.01, label: "x₀"})
```

```{ojs}
//| echo: false
Plot.plot({ marks: [ Plot.line(d3.range(0.5, 4.2, 0.01), {x: d => d, y: d => d**3 - 2*d - 5}) ] })
```
````

Les cellules se recalculent dès qu'un curseur bouge. Pour reprendre la couleur du site dans une figure : `stroke: "var(--gt-accent)"`.

### JavaScript libre (canvas)

1. Écrire la simulation dans `simulation.js`, à côté du billet, et la déclarer dans l'en-tête : `resources: [simulation.js]`.
2. Dans le billet :
   ````markdown
   ```{=html}
   <div class="column-page">
     <div class="sim" id="ma-simulation"> <canvas ...></canvas> ... </div>
   </div>
   <script src="simulation.js"></script>
   ```
   ````
3. La classe `.sim` (dans `assets/theme.scss`) met le champ à gauche et les réglages à droite, et passe sur une colonne sur téléphone. Les couleurs du thème sont dans les variables CSS `--gt-accent`, `--gt-field-bg`, `--gt-ink-soft`, `--gt-rule` (elles changent en mode sombre).

Règles : une seule interaction centrale par billet ; une image fixe ou une légende qui dit ce qu'on doit voir ; le code complet lié depuis le billet.

## 6. Relire et publier

```bash
quarto preview                    # relire, y compris en mode sombre et sur téléphone (outils du navigateur)
# retirer draft: true
git add blog/posts/AAAA-MM-JJ-titre-court _freeze
git commit -m "Billet : titre"
git push
```

Le billet apparaît sur la page Carnet, sur l'accueil (3 derniers) et dans le flux RSS.
