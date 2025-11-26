/**
 * Systeme de Logs pour Gestionnaire d'Inventaire v2
 */

class InventoryLogManager {
  constructor(storageKey = 'inventory_logs') {
    this.storageKey = storageKey;
    this.logs = this.loadLogs();
    this.maxLogs = 10000;
  }

  addLog(action, details = {}) {
    const logEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action,
      userId: localStorage.getItem('userId') || 'anonymous',
      ...details
    };
    
    this.logs.unshift(logEntry);
    if (this.logs.length > this.maxLogs) this.logs.pop();
    this.saveLogs();
    return logEntry;
  }

  loadLogs() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Erreur chargement logs:', e);
      return [];
    }
  }

  saveLogs() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.logs));
    } catch (e) {
      console.error('Erreur sauvegarde logs:', e);
    }
  }

  exportToCSV() {
    const headers = ['ID', 'Timestamp', 'Action', 'User', 'Details'];
    const rows = this.logs.map(log => [log.id, log.timestamp, log.action, log.userId, JSON.stringify(log)]);
    let csv = headers.join(',') + '\n';
    rows.forEach(row => csv += row.map(cell => `"${cell}"`).join(',') + '\n');
    return csv;
  }

  exportToJSON() {
    return JSON.stringify(this.logs, null, 2);
  }

  downloadExport(format = 'csv') {
    const content = format === 'csv' ? this.exportToCSV() : this.exportToJSON();
    const filename = `logs_${new Date().toISOString().split('T')[0]}.${format}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  filterLogs(filters = {}) {
    return this.logs.filter(log => {
      if (filters.action && log.action !== filters.action) return false;
      if (filters.userId && log.userId !== filters.userId) return false;
      return true;
    });
  }

  getStatistics() {
    return {
      totalLogs: this.logs.length,
      actionCounts: {},
      dateRange: {
        oldest: this.logs[this.logs.length - 1]?.timestamp,
        newest: this.logs[0]?.timestamp
      }
    };
  }
}

window.logManager = new InventoryLogManager();
export { InventoryLogManager };
