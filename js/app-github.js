/**
 * GitHub Integration for Inventory Manager
 * Allows loading/exporting inventory data from GitHub
 */

const GITHUB_OWNER = 'MOSTAFAlpha';
const GITHUB_REPO = 'inventory-manager';
const GITHUB_BRANCH = 'main';
const DATA_FILE_PATH = 'data/inventory-data.json';

// ==========================
// LOAD DATA FROM GITHUB
// ==========================
async function loadInventoryFromGitHub() {
  try {
    const url = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${DATA_FILE_PATH}`;
    console.log('Chargement depuis:', url);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const jsonData = await response.json();
    console.log('✅ Données chargées depuis GitHub:', jsonData);
    
    // Appliquer les données au formulaire
    applyLoadedData(jsonData.inventory);
    showMessage('✅ Inventaire chargé depuis GitHub !', false);
  } catch(error) {
    console.error('Erreur:', error);
    showMessage(`❌ Erreur: ${error.message}`, true);
  }
}

// ==========================
// APPLY LOADED DATA TO FORM
// ==========================
function applyLoadedData(inventoryArray) {
  if (!inventoryArray || !Array.isArray(inventoryArray)) {
    console.error('Format de données invalide');
    return;
  }
  
  inventoryArray.forEach(item => {
    const priceInput = document.querySelector(`input[data-ref="${item.ref}"]`);
    const noteTextarea = document.querySelector(`textarea[data-ref="${item.ref}-notes"]`);
    
    if (priceInput) {
      priceInput.value = item.price || 0;
      // Déclencher calculateTotals après chaque changement
      if (window.calculateTotals) {
        window.calculateTotals();
      }
    }
    
    if (noteTextarea) {
      noteTextarea.value = item.note || '';
    }
  });
  
  // Calculer les totaux une fois à la fin
  if (window.calculateTotals) {
    window.calculateTotals();
  }
}

// ==========================
// EXPORT DATA TO JSON FILE
// ==========================
function exportInventoryToJSON() {
  try {
    // Récupérer toutes les données du formulaire
    const formData = [];
    
    // Récupérer la liste des produits (dépend du DOM)
    const rows = document.querySelectorAll('#dataBody tr');
    
    rows.forEach(row => {
      const refCell = row.querySelector('td:first-child');
      const desigCell = row.querySelector('td:nth-child(2)');
      const qtyCell = row.querySelector('td:nth-child(3)');
      const priceInput = row.querySelector('input[type="number"]');
      const noteTextarea = row.querySelector('textarea');
      
      if (refCell) {
        formData.push({
          ref: refCell.textContent.trim(),
          designation: desigCell?.textContent.trim() || '',
          qty: parseInt(qtyCell?.textContent) || 0,
          price: parseFloat(priceInput?.value) || 0,
          note: noteTextarea?.value || ''
        });
      }
    });
    
    // Créer l'objet JSON à exporter
    const exportData = {
      lastUpdated: new Date().toISOString(),
      version: '1.0.0',
      company: 'Solo Electronique',
      inventory: formData
    };
    
    // Télécharger le fichier JSON
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showMessage('✅ Données exportées ! Téléchargez et commitez sur GitHub', false);
  } catch(error) {
    console.error('Erreur export:', error);
    showMessage(`❌ Erreur export: ${error.message}`, true);
  }
}

// ==========================
// SAVE TO LOCALSTORAGE (BACKUP LOCAL)
// ==========================
function saveToLocalStorage() {
  try {
    const rows = document.querySelectorAll('#dataBody tr');
    const localData = {};
    
    rows.forEach(row => {
      const refCell = row.querySelector('td:first-child');
      const priceInput = row.querySelector('input[type="number"]');
      const noteTextarea = row.querySelector('textarea');
      
      if (refCell) {
        const ref = refCell.textContent.trim();
        localData[ref] = {
          price: parseFloat(priceInput?.value) || 0,
          note: noteTextarea?.value || ''
        };
      }
    });
    
    localStorage.setItem('inventoryData', JSON.stringify(localData));
    showMessage('💾 Sauvegardé localement', false);
  } catch(error) {
    console.error('Erreur localStorage:', error);
  }
}

// ==========================
// LOAD FROM LOCALSTORAGE
// ==========================
function loadFromLocalStorage() {
  try {
    const savedData = localStorage.getItem('inventoryData');
    if (!savedData) {
      showMessage('Aucune donnée locale trouvée', false);
      return;
    }
    
    const localData = JSON.parse(savedData);
    
    Object.keys(localData).forEach(ref => {
      const priceInput = document.querySelector(`input[data-ref="${ref}"]`);
      const noteTextarea = document.querySelector(`textarea[data-ref="${ref}-notes"]`);
      
      if (priceInput) priceInput.value = localData[ref].price;
      if (noteTextarea) noteTextarea.value = localData[ref].note;
    });
    
    if (window.calculateTotals) window.calculateTotals();
    showMessage('✅ Données locales chargées', false);
  } catch(error) {
    console.error('Erreur chargement local:', error);
    showMessage(`❌ Erreur: ${error.message}`, true);
  }
}

// Exporter les fonctions
window.loadInventoryFromGitHub = loadInventoryFromGitHub;
window.exportInventoryToJSON = exportInventoryToJSON;
window.saveToLocalStorage = saveToLocalStorage;
window.loadFromLocalStorage = loadFromLocalStorage;
