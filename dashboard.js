// Dashboard Component
// Main dashboard view with inventory, stats, and alerts

import { inventoryManager } from '../modules/inventoryManager.js';
import { alertSystem } from '../modules/alertSystem.js';
import { analyticsEngine } from '../modules/analyticsEngine.js';
import { categoryEmojis } from '../data/groceryDatabase.js';

export function renderDashboard(container, currentUser) {
    const stats = inventoryManager.getStatistics();
    const alerts = alertSystem.generateAlerts(currentUser);
    const inventoryAnalytics = analyticsEngine.getInventoryAnalytics();
    const inventory = inventoryManager.getAllItems();

    container.innerHTML = `
    <div class="dashboard-container">
      <h2 style="margin-bottom: 1.5rem; font-size: 2rem;">📊 Dashboard</h2>

      <!-- Stats Grid -->
      <div class="grid-4 mb-3">
        <div class="stat-card">
          <div class="stat-value">${stats.total}</div>
          <div class="stat-label">Total Items</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="background: linear-gradient(135deg, #4ecb71 0%, #00f2fe 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            ${stats.healthy}
          </div>
          <div class="stat-label">Healthy Items</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            ${inventoryAnalytics.expiringCount}
          </div>
          <div class="stat-label">Expiring Soon</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            ${alerts.length}
          </div>
          <div class="stat-label">Active Alerts</div>
        </div>
      </div>

      <!-- Alerts Section -->
      ${alerts.length > 0 ? `
        <div class="glass-card mb-3">
          <h3 style="margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
            🔔 Active Alerts
          </h3>
          <div id="alerts-container">
            ${alerts.slice(0, 5).map(alert => `
              <div class="alert alert-${alert.color}">
                <div class="alert-icon">${alert.icon}</div>
                <div class="alert-content">
                  <div class="alert-title">${alert.title}</div>
                  <div class="alert-message">${alert.message}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Current Inventory -->
      <div class="glass-card">
        <h3 style="margin-bottom: 1rem;">🧊 Current Inventory</h3>
        ${inventory.length > 0 ? `
          <div class="grid-3" id="inventory-grid">
            ${inventory.map(item => {
        const daysLeft = inventoryManager.getDaysUntilExpiry(item);
        const emoji = categoryEmojis[item.category] || '📦';
        const healthBadge = item.healthTag === 'healthy'
            ? '<span class="badge badge-healthy">Healthy</span>'
            : '<span class="badge badge-unhealthy">Unhealthy</span>';
        const expiryColor = daysLeft <= 1 ? '#ee5a6f' : daysLeft <= 3 ? '#ff9f43' : '#4ecb71';

        return `
                <div class="glass-card" style="padding: 1rem;">
                  <div style="font-size: 2rem; text-align: center; margin-bottom: 0.5rem;">${emoji}</div>
                  <div style="font-weight: 600; text-align: center; margin-bottom: 0.25rem;">${item.productName}</div>
                  <div style="text-align: center; margin-bottom: 0.5rem;">${healthBadge}</div>
                  <div style="font-size: 0.75rem; color: ${expiryColor}; text-align: center; font-weight: 600;">
                    ${daysLeft >= 0 ? `Expires in ${daysLeft} day(s)` : 'Expired'}
                  </div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 0.25rem;">
                    Added by ${item.addedBy}
                  </div>
                  <button class="btn btn-danger mt-2" style="width: 100%; font-size: 0.875rem;" data-remove-item="${item.id}">
                    Remove
                  </button>
                </div>
              `;
    }).join('')}
          </div>
        ` : `
          <div class="text-center text-muted" style="padding: 2rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🍽️</div>
            <p>Your refrigerator is empty. Scan QR codes to add items!</p>
          </div>
        `}
      </div>
    </div>
  `;

    // Add event listeners for remove buttons
    container.querySelectorAll('[data-remove-item]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.getAttribute('data-remove-item');
            window.dispatchEvent(new CustomEvent('removeItem', { detail: { itemId } }));
        });
    });
}
