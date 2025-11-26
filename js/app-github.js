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

// ====== ENHANCED localStorage BACKUP FOR ALL COLUMNS ======
// Ces fonctions sauvegardent ALL column data (prix, notes, images) en localStorage
// comme sauvegarde de secours en cas d'indisponibilité de Firebase

/** Sauvegarde complète de l'inventaire avec tous les données dans localStorage **/
function saveInventoryToLocalStorage() {
    const inventory = {};
    const refs = document.querySelectorAll('input[data-ref]');
    
    refs.forEach(input => {
        const ref = input.getAttribute('data-ref');
        const priceValue = parseFloat(input.value) || 0;
        const noteTextarea = document.querySelector(`textarea[data-ref="${ref}-notes"]`);
        const noteValue = noteTextarea ? noteTextarea.value : '';
        const imageSrc = localStorage.getItem(`image-${ref}`);
        
        inventory[ref] = {
            price: priceValue,
            note: noteValue,
            image: imageSrc || null,
            timestamp: new Date().toISOString()
        };
    });
    
    try {
        localStorage.setItem('inventory-backup', JSON.stringify(inventory));
        if (window.showMessage) showMessage('✅ Inventaire sauvegardé en localStorage', false);
    } catch (error) {
        console.error('Erreur sauvegarde localStorage:', error);
        if (window.showMessage) showMessage('❌ Erreur sauvegarde', true);
    }
}

/** Restore l'inventaire depuis localStorage en cas de perte de données **/
function restoreInventoryFromLocalStorage() {
    try {
        const backupData = localStorage.getItem('inventory-backup');
        if (!backupData) return false;
        
        const inventory = JSON.parse(backupData);
        Object.keys(inventory).forEach(ref => {
            const item = inventory[ref];
            
            // Restaurer le prix
            const priceInput = document.querySelector(`input[data-ref="${ref}"]`);
            if (priceInput) priceInput.value = item.price;
            
            // Restaurer la note
            const noteTextarea = document.querySelector(`textarea[data-ref="${ref}-notes"]`);
            if (noteTextarea) noteTextarea.value = item.note;
            
            // Restaurer l'image
            if (item.image) localStorage.setItem(`image-${ref}`, item.image);
        });
        
        if (window.calculateTotals) window.calculateTotals();
        if (window.loadSavedImages) window.loadSavedImages();
        if (window.showMessage) showMessage('✅ Données restaurées depuis sauvegarde locale', false);
        
        return true;
    } catch (error) {
        console.error('Erreur restauration localStorage:', error);
        return false;
    }
}

// Exporter les nouvelles fonctions
window.saveInventoryToLocalStorage = saveInventoryToLocalStorage;
window.restoreInventoryFromLocalStorage = restoreInventoryFromLocalStorage;

// Exporter les fonctions
window.loadInventoryFromGitHub = loadInventoryFromGitHub;
window.exportInventoryToJSON = exportInventoryToJSON;
window.saveToLocalStorage = saveToLocalStorage;
window.loadFromLocalStorage = loadFromLocalStorage;
