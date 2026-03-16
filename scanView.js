// Scan Interface Component
// QR code scanning interface

import { qrScanner } from '../modules/qrScanner.js';

export function renderScanView(container, currentUser) {
    container.innerHTML = `
    <div class="scan-container">
      <h2 style="margin-bottom: 1.5rem; font-size: 2rem;">📱 QR Code Scanner</h2>

      <div class="grid-2 mb-3">
        <div class="glass-card text-center" style="padding: 3rem; cursor: pointer; transition: all 0.3s ease;" id="scan-add-btn">
          <div style="font-size: 5rem; margin-bottom: 1rem;">➕</div>
          <h3 style="margin-bottom: 0.5rem;">Add Item</h3>
          <p class="text-muted">Scan QR code to add food to refrigerator</p>
        </div>

        <div class="glass-card text-center" style="padding: 3rem; cursor: pointer; transition: all 0.3s ease;" id="scan-remove-btn">
          <div style="font-size: 5rem; margin-bottom: 1rem;">➖</div>
          <h3 style="margin-bottom: 0.5rem;">Remove Item</h3>
          <p class="text-muted">Scan QR code to consume/remove food</p>
        </div>
      </div>

      <div class="glass-card">
        <h3 style="margin-bottom: 1rem;">ℹ️ How It Works</h3>
        <div style="background: var(--bg-glass); padding: 1.5rem; border-radius: var(--radius-md);">
          <ol style="margin-left: 1.5rem; color: var(--text-secondary);">
            <li style="margin-bottom: 0.75rem;">
              <strong>Click "Add Item"</strong> to scan a product's QR code and add it to your refrigerator
            </li>
            <li style="margin-bottom: 0.75rem;">
              <strong>Click "Remove Item"</strong> when you consume food to log the consumption
            </li>
            <li style="margin-bottom: 0.75rem;">
              <strong>QR codes encode only the product ID</strong> - not images or patterns
            </li>
            <li>
              <strong>Machine learning models</strong> analyze your consumption behavior, not QR data
            </li>
          </ol>
        </div>
      </div>
    </div>
  `;

    // Add event listeners
    const addBtn = container.querySelector('#scan-add-btn');
    const removeBtn = container.querySelector('#scan-remove-btn');

    addBtn.addEventListener('mouseenter', () => {
        addBtn.style.transform = 'scale(1.05)';
        addBtn.style.borderColor = 'rgba(78, 203, 113, 0.5)';
    });
    addBtn.addEventListener('mouseleave', () => {
        addBtn.style.transform = 'scale(1)';
        addBtn.style.borderColor = 'var(--border-color)';
    });

    removeBtn.addEventListener('mouseenter', () => {
        removeBtn.style.transform = 'scale(1.05)';
        removeBtn.style.borderColor = 'rgba(238, 90, 111, 0.5)';
    });
    removeBtn.addEventListener('mouseleave', () => {
        removeBtn.style.transform = 'scale(1)';
        removeBtn.style.borderColor = 'var(--border-color)';
    });

    addBtn.addEventListener('click', () => {
        qrScanner.openScanModal('add');
    });

    removeBtn.addEventListener('click', () => {
        qrScanner.openScanModal('remove');
    });
}
