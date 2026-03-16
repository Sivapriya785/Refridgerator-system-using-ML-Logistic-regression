// LocalStorage-based data persistence manager
// Manages: inventory, consumption logs, user profiles, ML training data

const STORAGE_KEYS = {
    INVENTORY: 'smartFridge_inventory',
    LOGS: 'smartFridge_logs',
    USERS: 'smartFridge_users',
    ML_DATA: 'smartFridge_mlData',
    ML_MODELS: 'smartFridge_mlModels',
};

class StorageManager {
    constructor() {
        this.initializeStorage();
    }

    // Initialize storage with default data if empty
    initializeStorage() {
        if (!this.getInventory()) {
            this.saveInventory([]);
        }
        if (!this.getLogs()) {
            this.saveLogs([]);
        }
        if (!this.getUsers()) {
            this.saveUsers(['User A', 'User B', 'User C']);
        }
        if (!this.getMLData()) {
            this.saveMLData({ unhealthyEating: [], foodWastage: [] });
        }
        if (!this.getMLModels()) {
            this.saveMLModels({});
        }
    }

    // Generic storage methods
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error saving to ${key}:`, error);
            return false;
        }
    }

    load(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error loading from ${key}:`, error);
            return null;
        }
    }

    // Inventory methods
    getInventory() {
        return this.load(STORAGE_KEYS.INVENTORY) || [];
    }

    saveInventory(inventory) {
        return this.save(STORAGE_KEYS.INVENTORY, inventory);
    }

    addInventoryItem(item) {
        const inventory = this.getInventory();
        inventory.push({
            ...item,
            id: Date.now().toString(),
            addedAt: new Date().toISOString(),
        });
        return this.saveInventory(inventory);
    }

    removeInventoryItem(itemId) {
        const inventory = this.getInventory();
        const filtered = inventory.filter(item => item.id !== itemId);
        return this.saveInventory(filtered);
    }

    updateInventoryItem(itemId, updates) {
        const inventory = this.getInventory();
        const index = inventory.findIndex(item => item.id === itemId);
        if (index !== -1) {
            inventory[index] = { ...inventory[index], ...updates };
            return this.saveInventory(inventory);
        }
        return false;
    }

    // Consumption logs methods
    getLogs() {
        return this.load(STORAGE_KEYS.LOGS) || [];
    }

    saveLogs(logs) {
        return this.save(STORAGE_KEYS.LOGS, logs);
    }

    addLog(logEntry) {
        const logs = this.getLogs();
        logs.push({
            ...logEntry,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
        });
        return this.saveLogs(logs);
    }

    getLogsByUser(username) {
        const logs = this.getLogs();
        return logs.filter(log => log.username === username);
    }

    getLogsByDateRange(startDate, endDate) {
        const logs = this.getLogs();
        return logs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate >= startDate && logDate <= endDate;
        });
    }

    // User methods
    getUsers() {
        return this.load(STORAGE_KEYS.USERS) || [];
    }

    saveUsers(users) {
        return this.save(STORAGE_KEYS.USERS, users);
    }

    addUser(username) {
        const users = this.getUsers();
        if (!users.includes(username)) {
            users.push(username);
            return this.saveUsers(users);
        }
        return false;
    }

    // ML Data methods
    getMLData() {
        return this.load(STORAGE_KEYS.ML_DATA) || { unhealthyEating: [], foodWastage: [] };
    }

    saveMLData(mlData) {
        return this.save(STORAGE_KEYS.ML_DATA, mlData);
    }

    addMLTrainingData(type, dataPoint) {
        const mlData = this.getMLData();
        if (!mlData[type]) {
            mlData[type] = [];
        }
        mlData[type].push(dataPoint);
        return this.saveMLData(mlData);
    }

    // ML Models methods
    getMLModels() {
        return this.load(STORAGE_KEYS.ML_MODELS) || {};
    }

    saveMLModels(models) {
        return this.save(STORAGE_KEYS.ML_MODELS, models);
    }

    saveMLModel(modelName, modelData) {
        const models = this.getMLModels();
        models[modelName] = modelData;
        return this.saveMLModels(models);
    }

    getMLModel(modelName) {
        const models = this.getMLModels();
        return models[modelName] || null;
    }

    // Clear all data (for testing/reset)
    clearAllData() {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        this.initializeStorage();
    }

    // Export all data
    exportAllData() {
        return {
            inventory: this.getInventory(),
            logs: this.getLogs(),
            users: this.getUsers(),
            mlData: this.getMLData(),
            mlModels: this.getMLModels(),
        };
    }

    // Import data
    importData(data) {
        if (data.inventory) this.saveInventory(data.inventory);
        if (data.logs) this.saveLogs(data.logs);
        if (data.users) this.saveUsers(data.users);
        if (data.mlData) this.saveMLData(data.mlData);
        if (data.mlModels) this.saveMLModels(data.mlModels);
    }
}

// Export singleton instance
export const storageManager = new StorageManager();
