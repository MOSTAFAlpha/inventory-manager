# Inventory Manager

Gestionnaire d'inventaire web pour la gestion de stock en temps réel.

## 🌐 Demo en Ligne

**URL en direct** : [https://mostafalpha.github.io/inventory-manager/](https://mostafalpha.github.io/inventory-manager/)

## 🚀 Caractéristiques

- ✅ Gestion d'inventaire intuitive avec interface web
- 📋 Ajout, modification et suppression d'articles
- 💵 Gestion des prix et calcul automatique des totaux
- 🗓️ Notes personnalisées par article
- 📄 Visualisation en temps réel des stocks
- 💾 Sauvegarde automatique des données

## 💻 Tech Stack

- **HTML5** : Structure
- **CSS3** : Styling
- **JavaScript (Vanilla)** : Logique applicative
- **GitHub Pages** : Hosting

## 🛠️ Installation

Cloné le répôt avec :

```bash
git clone https://github.com/MOSTAFAlpha/inventory-manager.git
cd inventory-manager
```

Ouverture du fichier `inventaire.html` dans votre navigateur.

## 💾 Utilisation

1. Ouvrez l'application dans votre navigateur
2. Entrez le nom de l'article
3. Ajoutez la quantité et le prix
4. Cliquez sur "Ajouter" pour enregistrer
5. Consultez le total automatiquement calculé

## 📤 Fichiers

- `inventaire.html` : Application web complète (HTML + CSS + JavaScript)

## 📝 License

Projet open-source - Libre d'utilisation et de modification.

## 🤝 Auteur

MOSTAFAlpha - 2025


## 📡 GitHub Integration (v1.1.0+)

### Load Data from GitHub

The application now supports loading inventory data directly from GitHub, allowing you to maintain your inventory in version control:

```javascript
// Load inventory data from GitHub
await loadInventoryFromGitHub();
```

**Raw File URL**: `https://raw.githubusercontent.com/MOSTAFAlpha/inventory-manager/main/data/inventory-data.json`

### Export Inventory Data

Export your current inventory as a JSON file to backup or share:

```javascript
// Export current inventory data as JSON
exportInventoryToJSON();
```

This will download a file named `inventory-export-[timestamp].json` with all current inventory items.

### Local Storage Backup

Automatic backup and restore functionality using browser localStorage:

```javascript
// Save inventory to local storage
saveToLocalStorage();

// Restore from local storage
loadFromLocalStorage();
```

### Data Structure

The inventory data follows this JSON structure:

```json
{
  "lastUpdated": "2025-11-26T15:00:00Z",
  "version": "1.0.0",
  "company": "Solo Electronique",
  "inventory": [
    {
      "ref": "1",
      "designation": "ADAPTEURS UG-21 REFERENCE NOR 161018",
      "qty": 19,
      "price": 0,
      "note": ""
    }
  ]
}
```

### File Structure

- `data/inventory-data.json` - Central inventory data file
- `js/app-github.js` - GitHub integration module
- `images/` - Directory for product images (not tracked in git)
- `.gitignore` - Excludes images and local files from version control

### Image Management

Product images should be stored in the `images/` folder locally. This folder is excluded from git to keep the repository lightweight. Update the `.gitignore` if you wish to track images.
