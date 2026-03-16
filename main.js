// Main Application
// Orchestrates the entire smart refrigerator application

import { qrScanner } from './modules/qrScanner.js';
import { inventoryManager } from './modules/inventoryManager.js';
import { activityLogger } from './modules/activityLogger.js';
import { getProductById } from './data/groceryDatabase.js';
import { renderDashboard } from './components/dashboard.js';
import { renderScanView } from './components/scanView.js';
import { renderAnalyticsView } from './components/analyticsView.js';
import { renderRecommendationsView } from './components/recommendationsView.js';
import { renderMLInsightsView } from './components/mlInsightsView.js';

class SmartFridgeApp {
    constructor() {
        this.currentUser = 'User A';
        this.currentView = 'dashboard';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupQRScanner();
        this.renderCurrentView();
    }

    setupEventListeners() {
        // User selection
        const userSelect = document.getElementById('current-user');
        if (userSelect) {
            userSelect.addEventListener('change', (e) => {
                this.currentUser = e.target.value;
                this.renderCurrentView();
            });
        }

        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.getAttribute('data-view');
                this.switchView(view);
            });
        });

        // Custom events
        window.addEventListener('removeItem', (e) => {
            this.handleRemoveItem(e.detail.itemId);
        });

        window.addEventListener('refreshView', () => {
            this.renderCurrentView();
        });
    }

    setupQRScanner() {
        qrScanner.onScan((data) => {
            const { product, action } = data;

            if (action === 'add') {
                this.handleAddItem(product);
            } else if (action === 'remove') {
                this.handleRemoveItemByProduct(product);
            }
        });
    }

    handleAddItem(product) {
        // Add to inventory
        const item = inventoryManager.addItem(product.id, this.currentUser);

        // Log the action
        activityLogger.logAdd(product, this.currentUser);

        console.log('Item added:', item);

        // Refresh view
        this.renderCurrentView();
    }

    handleRemoveItemByProduct(product) {
        // Find item in inventory
        const inventory = inventoryManager.getAllItems();
        const item = inventory.find(i => i.productId === product.id);

        if (item) {
            this.handleRemoveItem(item.id);
        } else {
            // Item not in inventory, but still log consumption
            activityLogger.logRemove(product, this.currentUser, null);
            alert(`${product.name} consumed (not in inventory)`);
        }
    }

    handleRemoveItem(itemId) {
        const item = inventoryManager.getItemById(itemId);

        if (!item) {
            console.error('Item not found:', itemId);
            return;
        }

        // Get product details
        const product = getProductById(item.productId);

        // Remove from inventory
        inventoryManager.removeItem(itemId, this.currentUser);

        // Log the removal
        activityLogger.logRemove(product, this.currentUser, item);

        console.log('Item removed:', item);

        // Refresh view
        this.renderCurrentView();
    }

    switchView(view) {
        this.currentView = view;

        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-view') === view) {
                btn.classList.add('active');
            }
        });

        this.renderCurrentView();
    }

    renderCurrentView() {
        const container = document.getElementById('view-container');

        switch (this.currentView) {
            case 'dashboard':
                renderDashboard(container, this.currentUser);
                break;
            case 'scan':
                renderScanView(container, this.currentUser);
                break;
            case 'analytics':
                renderAnalyticsView(container, this.currentUser);
                break;
            case 'recommendations':
                renderRecommendationsView(container, this.currentUser);
                break;
            case 'ml-insights':
                renderMLInsightsView(container, this.currentUser);
                break;
            default:
                renderDashboard(container, this.currentUser);
        }
    }

    // Utility: Generate sample data for testing
    generateSampleData() {
        console.log('Generating sample data...');

        const users = ['User A', 'User B', 'User C'];
        const sampleProducts = [
            'FRUIT001', 'FRUIT002', 'VEG001', 'VEG002', 'DAIRY001',
            'JUNK001', 'JUNK002', 'BEV002', 'SNACK001', 'PROTEIN001'
        ];

        // Generate random consumption logs
        for (let i = 0; i < 30; i++) {
            const user = users[Math.floor(Math.random() * users.length)];
            const productId = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
            const product = getProductById(productId);

            if (!product) continue;

            // Random timestamp in past 7 days
            const daysAgo = Math.floor(Math.random() * 7);
            const hoursAgo = Math.floor(Math.random() * 24);
            const timestamp = new Date();
            timestamp.setDate(timestamp.getDate() - daysAgo);
            timestamp.setHours(hoursAgo);

            // Create synthetic log
            const log = {
                username: user,
                productId: product.id,
                productName: product.name,
                category: product.category,
                healthTag: product.healthTag,
                action: 'remove',
                timestamp: timestamp.toISOString(),
                hour: hoursAgo,
                dayOfWeek: timestamp.getDay(),
                isLateNight: hoursAgo >= 22 || hoursAgo < 6,
                isWeekend: timestamp.getDay() === 0 || timestamp.getDay() === 6,
                daysUntilExpiry: Math.floor(Math.random() * 10) - 2,
                wasWasted: Math.random() > 0.8,
            };

            activityLogger.getAllLogs().push(log);
        }

        // Save logs
        const logs = activityLogger.getAllLogs();
        activityLogger.logs = logs;

        console.log('Sample data generated:', logs.length, 'logs');
        this.renderCurrentView();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new SmartFridgeApp();

    // Expose app to window for debugging
    window.smartFridgeApp = app;

    console.log('🧊 Smart Refrigerator ML Application Initialized');
    console.log('💡 Tip: Use window.smartFridgeApp.generateSampleData() to create test data');
});
