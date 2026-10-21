# Installer les outils sur le nouvel ordinateur

Compter 30 à 45 minutes. Les commandes sont pour **Windows** (PowerShell) ; les équivalents macOS et Linux sont en fin de page.

## 1. Les logiciels

Ouvrir PowerShell et lancer :

```powershell
winget install --id Git.Git -e
winget install --id GitHub.cli -e
winget install --id Microsoft.VisualStudioCode -e
winget install --id Posit.Quarto -e
winget install --id Python.Python.3.12 -e
```

Fermer et rouvrir PowerShell, puis vérifier :

```powershell
git --version
quarto --version     # 1.9.x attendu (le site a été testé avec 1.9.37)
python --version     # 3.12.x
```

Si `winget` n'est pas disponible, les installateurs sont sur : [git-scm.com](https://git-scm.com), [quarto.org/docs/get-started](https://quarto.org/docs/get-started/), [code.visualstudio.com](https://code.visualstudio.com), [python.org](https://www.python.org/downloads/).

## 2. Git et GitHub

```powershell
git config --global user.name "Garry Terii"
git config --global user.email "ADRESSE-DU-COMPTE-GITHUB"
gh auth login        # choisir GitHub.com, HTTPS, puis se connecter dans le navigateur
```

## 3. Récupérer le dépôt

Deux possibilités :

- **Cloner depuis GitHub** (simple, mais le clone ne contient pas encore les fichiers Quarto, qui sont seulement sur le PC du bureau) :
  ```powershell
  cd $HOME\Documents
  gh repo clone garryterii/garryterii.github.io
  ```
- **Recommandé** : faire d'abord les étapes 1 et 2 de [02-MIGRATION.md](02-MIGRATION.md) sur le PC du bureau (pousser la branche `quarto`), puis cloner et passer sur cette branche :
  ```powershell
  gh repo clone garryterii/garryterii.github.io
  cd garryterii.github.io
  git switch quarto
  ```

## 4. Python pour les billets qui exécutent du code

Dans le dossier du dépôt :

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
quarto check jupyter     # doit trouver Python et Jupyter
```

Le dossier `.venv` est ignoré par Git. Quarto l'utilise automatiquement s'il est activé dans le terminal.

Si PowerShell refuse d'exécuter `Activate.ps1` : `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

## 5. VS Code

Extensions à installer (onglet Extensions, ou `code --install-extension ...`) :

| Extension | Identifiant | Pour quoi |
| --- | --- | --- |
| Quarto | `quarto.quarto` | Coloration, aperçu, complétion des `@thm-` et `@eq-` |
| Python | `ms-python.python` | Exécuter les cellules Python |
| Jupyter | `ms-toolsai.jupyter` | Idem |
| LaTeX Workshop (facultatif) | `james-yu.latex-workshop` | Si tu compiles aussi tes articles dans VS Code |

## 6. Zotero et la bibliographie (facultatif mais conseillé)

1. Installer l'extension **Better BibTeX** dans Zotero ([retorque.re/zotero-better-bibtex](https://retorque.re/zotero-better-bibtex/)).
2. Créer une collection « Carnet » dans Zotero.
3. Clic droit sur la collection > *Exporter la collection* > format **Better BibTeX**, cocher **Garder à jour**, et enregistrer sous `refs.bib` à la racine du dépôt (écraser celui qui existe).

Les clés de citation (`@modica1977`…) sont alors celles de Better BibTeX : vérifier qu'elles correspondent à celles utilisées dans les billets existants, ou les adapter.

## 7. Premier test

```powershell
cd garryterii.github.io
quarto preview
```

Le navigateur s'ouvre sur le site. Vérifier :

- [ ] les formules s'affichent (MathJax) et les macros `\R`, `\eps` fonctionnent ;
- [ ] le billet Allen–Cahn : la simulation tourne, les boutons et le curseur répondent ;
- [ ] le billet Newton : les curseurs Observable JS bougent la figure ;
- [ ] le bouton clair/sombre en haut à droite change bien tout le style.

Les brouillons (`draft: true`) sont visibles dans `quarto preview` mais pas sur le site publié.

## macOS et Linux

- macOS : `brew install git gh quarto python@3.12 && brew install --cask visual-studio-code`
- Linux (Debian/Ubuntu) : `sudo apt install git gh python3-venv`, puis le paquet `.deb` de Quarto depuis [quarto.org](https://quarto.org/docs/get-started/).
- Activer l'environnement Python : `source .venv/bin/activate`.
