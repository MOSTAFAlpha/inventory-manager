/**
 * Module Export pour Gestionnaire d'Inventaire
 * Export CSV, Excel, PDF
 */

class ExportManager {
  // Export en CSV
  static exportToCSV(data, filename = 'inventaire.csv') {
    let csv = 'Ref,Designation,Quantite,PrixUnitaire,PrixTotal\n';
    data.forEach(item => {
      csv += `"${item.ref}","${item.des}",${item.qty},${item.price || 0},${(item.qty * (item.price || 0))}\n`;
    });
    this.downloadFile(csv, filename, 'text/csv');
  }

  // Export en Excel (format simplifie)
  static exportToExcel(data, filename = 'inventaire.xlsx') {
    const csv = this.prepareCSV(data);
    this.downloadFile(csv, filename.replace('.xlsx', '.csv'), 'text/csv');
  }

  // Export en JSON
  static exportToJSON(data, filename = 'inventaire.json') {
    const json = JSON.stringify(data, null, 2);
    this.downloadFile(json, filename, 'application/json');
  }

  // Preparer les donnees en CSV
  static prepareCSV(data) {
    let csv = 'Reference,Designation,Quantite,Prix,Total\n';
    data.forEach(item => {
      csv += `${item.ref},"${item.des}",${item.qty},${item.price},${item.qty * (item.price || 0)}\n`;
    });
    return csv;
  }

  // Telecharger le fichier
  static downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Imprimer l'inventaire
  static printInventory() {
    window.print();
  }

  // Generer rapport PDF
  static generateReport(data) {
    let report = 'RAPPORT D\'INVENTAIRE\n';
    report += '==================\n\n';
    report += `Date: ${new Date().toLocaleDateString()}\n\n`;
    report += 'Elements:\n';
    let total = 0;
    data.forEach(item => {
      const lineTotal = item.qty * (item.price || 0);
      report += `- ${item.ref}: ${item.des} (Qty: ${item.qty}, Price: ${item.price})\n`;
      total += lineTotal;
    });
    report += `\nTOTAL: ${total.toFixed(2)} DH`;
    return report;
  }
}

window.exportManager = ExportManager;
export { ExportManager };
