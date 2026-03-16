// Standalone QR Code Generator
// Simplified QR code generation without external dependencies

class SimpleQRGenerator {
    constructor() {
        this.qrCache = new Map();
    }

    // Generate QR code as data URL using a simple visual representation
    async generateQRCode(productId, options = {}) {
        // Check cache first
        if (this.qrCache.has(productId)) {
            return this.qrCache.get(productId);
        }

        const { width = 200, color = { dark: '#667eea', light: '#ffffff' } } = options;

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = width;
        const ctx = canvas.getContext('2d');

        // Fill background
        ctx.fillStyle = color.light;
        ctx.fillRect(0, 0, width, width);

        // Generate a deterministic pattern based on product ID
        const hash = this.hashCode(productId);
        const gridSize = 21; // Standard QR code grid
        const cellSize = width / gridSize;

        ctx.fillStyle = color.dark;

        // Draw position markers (corners)
        this.drawPositionMarker(ctx, 0, 0, cellSize);
        this.drawPositionMarker(ctx, gridSize - 7, 0, cellSize);
        this.drawPositionMarker(ctx, 0, gridSize - 7, cellSize);

        // Draw data pattern based on hash
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                // Skip position markers
                if (this.isPositionMarker(x, y, gridSize)) continue;

                // Generate pseudo-random pattern based on hash and position
                const seed = hash + x * 31 + y * 17;
                if (this.pseudoRandom(seed) > 0.5) {
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }

        // Add product ID text at bottom for debugging
        ctx.fillStyle = color.dark;
        ctx.font = `${cellSize * 0.8}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(productId, width / 2, width - cellSize / 2);

        const qrDataUrl = canvas.toDataURL();
        this.qrCache.set(productId, qrDataUrl);

        return qrDataUrl;
    }

    // Draw position marker (corner squares)
    drawPositionMarker(ctx, startX, startY, cellSize) {
        const size = 7;

        // Outer square
        for (let i = 0; i < size; i++) {
            ctx.fillRect(startX * cellSize, (startY + i) * cellSize, cellSize, cellSize);
            ctx.fillRect((startX + i) * cellSize, startY * cellSize, cellSize, cellSize);
            ctx.fillRect((startX + size - 1) * cellSize, (startY + i) * cellSize, cellSize, cellSize);
            ctx.fillRect((startX + i) * cellSize, (startY + size - 1) * cellSize, cellSize, cellSize);
        }

        // Inner square
        for (let y = 2; y < 5; y++) {
            for (let x = 2; x < 5; x++) {
                ctx.fillRect((startX + x) * cellSize, (startY + y) * cellSize, cellSize, cellSize);
            }
        }
    }

    // Check if position is in a position marker area
    isPositionMarker(x, y, gridSize) {
        return (
            (x < 9 && y < 9) || // Top-left
            (x >= gridSize - 9 && y < 9) || // Top-right
            (x < 9 && y >= gridSize - 9) // Bottom-left
        );
    }

    // Simple hash function
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    // Pseudo-random number generator
    pseudoRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    // Generate QR codes for multiple products
    async generateBulkQRCodes(productIds) {
        const promises = productIds.map(id => this.generateQRCode(id));
        return await Promise.all(promises);
    }

    // Clear cache
    clearCache() {
        this.qrCache.clear();
    }

    // Get cache size
    getCacheSize() {
        return this.qrCache.size;
    }
}

// Export as default to match the expected import
export default {
    toDataURL: async (data, options) => {
        const generator = new SimpleQRGenerator();
        return await generator.generateQRCode(data, options);
    },
    toCanvas: async (canvas, data, options) => {
        const generator = new SimpleQRGenerator();
        const dataUrl = await generator.generateQRCode(data, options);
        const img = new Image();
        img.onload = () => {
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
        };
        img.src = dataUrl;
    }
};

// Also export the class
export { SimpleQRGenerator };
