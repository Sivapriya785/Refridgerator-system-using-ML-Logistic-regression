// Feature Engineering Module
// Extracts behavioral features from consumption logs for ML training
// Features are derived from USER BEHAVIOR, not QR code images

import { activityLogger } from '../modules/activityLogger.js';

class FeatureEngineering {
    constructor() {
        this.categoryEncoding = {
            'fruit': 0,
            'vegetable': 1,
            'dairy': 2,
            'snack': 3,
            'junk': 4,
            'beverage': 5,
            'protein': 6,
            'grain': 7,
        };
    }

    // Normalize a value to [0, 1] range
    normalize(value, min, max) {
        if (max === min) return 0;
        return (value - min) / (max - min);
    }

    // Extract features for unhealthy eating prediction
    extractUnhealthyEatingFeatures(log, userHistory) {
        const features = [];

        // Feature 1: Hour of day (normalized 0-23 -> 0-1)
        features.push(this.normalize(log.hour, 0, 23));

        // Feature 2: Late-night indicator (binary)
        features.push(log.isLateNight ? 1 : 0);

        // Feature 3: Is unhealthy food (binary)
        features.push(log.healthTag === 'unhealthy' ? 1 : 0);

        // Feature 4: Category encoding (normalized)
        const categoryCode = this.categoryEncoding[log.category] || 0;
        features.push(this.normalize(categoryCode, 0, 7));

        // Feature 5: Weekend indicator (binary)
        features.push(log.isWeekend ? 1 : 0);

        // Feature 6: Recent unhealthy consumption frequency (past 7 days)
        const recentUnhealthy = this.getRecentUnhealthyCount(log.username, log.timestamp, 7);
        features.push(this.normalize(recentUnhealthy, 0, 20));

        // Feature 7: Time since last consumption (hours, normalized)
        const hoursSinceLastConsumption = this.getHoursSinceLastConsumption(log.username, log.timestamp);
        features.push(this.normalize(hoursSinceLastConsumption, 0, 24));

        return features;
    }

    // Extract features for food wastage prediction
    extractWastageFeatures(log, inventoryItem) {
        const features = [];

        // Feature 1: Days until expiry (normalized, can be negative)
        const daysUntilExpiry = log.daysUntilExpiry !== null ? log.daysUntilExpiry : 0;
        features.push(this.normalize(daysUntilExpiry, -7, 30));

        // Feature 2: Category encoding
        const categoryCode = this.categoryEncoding[log.category] || 0;
        features.push(this.normalize(categoryCode, 0, 7));

        // Feature 3: Consumption frequency for this category (past 14 days)
        const categoryFrequency = this.getCategoryFrequency(log.username, log.category, log.timestamp, 14);
        features.push(this.normalize(categoryFrequency, 0, 10));

        // Feature 4: Is perishable (shelf life < 7 days)
        const isPerishable = log.shelfLife !== undefined && log.shelfLife < 7 ? 1 : 0;
        features.push(isPerishable);

        // Feature 5: User's historical wastage rate
        const wastageRate = this.getUserWastageRate(log.username, log.timestamp);
        features.push(wastageRate);

        // Feature 6: Time of removal (hour, normalized)
        features.push(this.normalize(log.hour, 0, 23));

        return features;
    }

    // Get recent unhealthy consumption count
    getRecentUnhealthyCount(username, beforeTimestamp, days) {
        const logs = activityLogger.getAllLogs();
        const cutoffDate = new Date(beforeTimestamp);
        cutoffDate.setDate(cutoffDate.getDate() - days);

        return logs.filter(l =>
            l.username === username &&
            l.action === 'remove' &&
            l.healthTag === 'unhealthy' &&
            new Date(l.timestamp) >= cutoffDate &&
            new Date(l.timestamp) < new Date(beforeTimestamp)
        ).length;
    }

    // Get hours since last consumption
    getHoursSinceLastConsumption(username, beforeTimestamp) {
        const logs = activityLogger.getAllLogs();
        const userConsumption = logs
            .filter(l =>
                l.username === username &&
                l.action === 'remove' &&
                new Date(l.timestamp) < new Date(beforeTimestamp)
            )
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (userConsumption.length === 0) return 24;

        const lastConsumption = new Date(userConsumption[0].timestamp);
        const current = new Date(beforeTimestamp);
        const diffMs = current - lastConsumption;
        const diffHours = diffMs / (1000 * 60 * 60);

        return Math.min(diffHours, 24);
    }

    // Get category consumption frequency
    getCategoryFrequency(username, category, beforeTimestamp, days) {
        const logs = activityLogger.getAllLogs();
        const cutoffDate = new Date(beforeTimestamp);
        cutoffDate.setDate(cutoffDate.getDate() - days);

        return logs.filter(l =>
            l.username === username &&
            l.action === 'remove' &&
            l.category === category &&
            new Date(l.timestamp) >= cutoffDate &&
            new Date(l.timestamp) < new Date(beforeTimestamp)
        ).length;
    }

    // Get user's historical wastage rate
    getUserWastageRate(username, beforeTimestamp) {
        const logs = activityLogger.getAllLogs();
        const userLogs = logs.filter(l =>
            l.username === username &&
            l.action === 'remove' &&
            new Date(l.timestamp) < new Date(beforeTimestamp)
        );

        if (userLogs.length === 0) return 0;

        const wastedCount = userLogs.filter(l => l.wasWasted === true).length;
        return wastedCount / userLogs.length;
    }

    // Prepare training data for unhealthy eating model
    prepareUnhealthyEatingData(username = null) {
        const logs = activityLogger.getAllLogs();
        const consumptionLogs = logs.filter(l => l.action === 'remove');
        const filteredLogs = username
            ? consumptionLogs.filter(l => l.username === username)
            : consumptionLogs;

        const X = [];
        const y = [];

        for (const log of filteredLogs) {
            const features = this.extractUnhealthyEatingFeatures(log, filteredLogs);
            X.push(features);

            // Label: 1 if unhealthy eating pattern, 0 otherwise
            // Pattern is unhealthy if: late night + unhealthy food, or frequent unhealthy consumption
            const isUnhealthyPattern = (log.isLateNight && log.healthTag === 'unhealthy') ||
                (log.healthTag === 'unhealthy' && this.getRecentUnhealthyCount(log.username, log.timestamp, 7) >= 3);
            y.push(isUnhealthyPattern ? 1 : 0);
        }

        return { X, y };
    }

    // Prepare training data for wastage prediction model
    prepareWastageData(username = null) {
        const logs = activityLogger.getAllLogs();
        const consumptionLogs = logs.filter(l => l.action === 'remove' && l.daysUntilExpiry !== null);
        const filteredLogs = username
            ? consumptionLogs.filter(l => l.username === username)
            : consumptionLogs;

        const X = [];
        const y = [];

        for (const log of filteredLogs) {
            const features = this.extractWastageFeatures(log, null);
            X.push(features);

            // Label: 1 if wasted, 0 if consumed before expiry
            y.push(log.wasWasted ? 1 : 0);
        }

        return { X, y };
    }

    // Get feature names for interpretability
    getUnhealthyEatingFeatureNames() {
        return [
            'Hour of Day',
            'Late Night',
            'Is Unhealthy Food',
            'Category',
            'Weekend',
            'Recent Unhealthy Count',
            'Hours Since Last Consumption',
        ];
    }

    getWastageFeatureNames() {
        return [
            'Days Until Expiry',
            'Category',
            'Category Frequency',
            'Is Perishable',
            'User Wastage Rate',
            'Hour of Removal',
        ];
    }
}

// Export singleton instance
export const featureEngineering = new FeatureEngineering();
