// Prediction Models Module
// Manages training and prediction for unhealthy eating and wastage models

import { LogisticRegression } from './logisticRegression.js';
import { featureEngineering } from './featureEngineering.js';
import { storageManager } from '../data/storageManager.js';
import { activityLogger } from '../modules/activityLogger.js';

class PredictionModels {
    constructor() {
        this.unhealthyEatingModel = null;
        this.wastageModel = null;
        this.loadModels();
    }

    // Train unhealthy eating behavior model
    trainUnhealthyEatingModel(username = null) {
        console.log('Training unhealthy eating model...');

        const { X, y } = featureEngineering.prepareUnhealthyEatingData(username);

        if (X.length < 5) {
            console.warn('Insufficient data for training. Need at least 5 samples.');
            return {
                success: false,
                message: 'Insufficient data. Need at least 5 consumption records.',
                samplesUsed: X.length,
            };
        }

        this.unhealthyEatingModel = new LogisticRegression(0.1, 1000, 0.01);
        this.unhealthyEatingModel.fit(X, y);

        const accuracy = this.unhealthyEatingModel.score(X, y);

        // Save model
        this.saveModels();

        console.log(`Unhealthy eating model trained. Accuracy: ${(accuracy * 100).toFixed(2)}%`);

        return {
            success: true,
            accuracy,
            samplesUsed: X.length,
            trainingHistory: this.unhealthyEatingModel.trainingHistory,
        };
    }

    // Train food wastage prediction model
    trainWastageModel(username = null) {
        console.log('Training wastage prediction model...');

        const { X, y } = featureEngineering.prepareWastageData(username);

        if (X.length < 5) {
            console.warn('Insufficient data for training. Need at least 5 samples.');
            return {
                success: false,
                message: 'Insufficient data. Need at least 5 consumption records with expiry data.',
                samplesUsed: X.length,
            };
        }

        this.wastageModel = new LogisticRegression(0.1, 1000, 0.01);
        this.wastageModel.fit(X, y);

        const accuracy = this.wastageModel.score(X, y);

        // Save model
        this.saveModels();

        console.log(`Wastage model trained. Accuracy: ${(accuracy * 100).toFixed(2)}%`);

        return {
            success: true,
            accuracy,
            samplesUsed: X.length,
            trainingHistory: this.wastageModel.trainingHistory,
        };
    }

    // Train both models
    trainAllModels(username = null) {
        const unhealthyResult = this.trainUnhealthyEatingModel(username);
        const wastageResult = this.trainWastageModel(username);

        return {
            unhealthyEating: unhealthyResult,
            wastage: wastageResult,
        };
    }

    // Predict unhealthy eating behavior for a user's recent activity
    predictUnhealthyEating(username) {
        if (!this.unhealthyEatingModel) {
            return {
                prediction: null,
                probability: 0,
                message: 'Model not trained yet.',
            };
        }

        // Get recent consumption logs
        const recentLogs = activityLogger.getLogsByUser(username)
            .filter(l => l.action === 'remove')
            .slice(-5); // Last 5 consumptions

        if (recentLogs.length === 0) {
            return {
                prediction: null,
                probability: 0,
                message: 'No consumption data available.',
            };
        }

        // Extract features for recent logs
        const features = recentLogs.map(log =>
            featureEngineering.extractUnhealthyEatingFeatures(log, recentLogs)
        );

        // Get predictions
        const probabilities = this.unhealthyEatingModel.predictProba(features);
        const avgProbability = probabilities.reduce((a, b) => a + b, 0) / probabilities.length;

        return {
            prediction: avgProbability >= 0.5 ? 'unhealthy' : 'healthy',
            probability: avgProbability,
            confidence: Math.abs(avgProbability - 0.5) * 2, // 0 to 1 scale
            samplesAnalyzed: recentLogs.length,
        };
    }

    // Predict wastage likelihood for current inventory items
    predictWastageForInventory(inventoryItems, username) {
        if (!this.wastageModel) {
            return [];
        }

        const predictions = [];

        for (const item of inventoryItems) {
            // Create a synthetic log for prediction
            const syntheticLog = {
                username,
                category: item.category,
                healthTag: item.healthTag,
                daysUntilExpiry: this.calculateDaysUntilExpiry(item.expiryDate),
                hour: new Date().getHours(),
                timestamp: new Date().toISOString(),
            };

            const features = [featureEngineering.extractWastageFeatures(syntheticLog, item)];
            const probability = this.wastageModel.predictProba(features)[0];

            predictions.push({
                itemId: item.id,
                productName: item.productName,
                wastageProbability: probability,
                prediction: probability >= 0.5 ? 'likely_wasted' : 'likely_consumed',
                daysUntilExpiry: syntheticLog.daysUntilExpiry,
            });
        }

        return predictions.sort((a, b) => b.wastageProbability - a.wastageProbability);
    }

    // Calculate days until expiry
    calculateDaysUntilExpiry(expiryDate) {
        const now = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    // Get model insights
    getModelInsights(username) {
        const insights = {
            unhealthyEating: null,
            wastage: null,
        };

        // Unhealthy eating insights
        if (this.unhealthyEatingModel) {
            const prediction = this.predictUnhealthyEating(username);
            const stats = activityLogger.getUserStatistics(username, 7);

            insights.unhealthyEating = {
                prediction: prediction.prediction,
                probability: prediction.probability,
                lateNightPercentage: stats.lateNightPercentage,
                unhealthyPercentage: stats.unhealthyPercentage,
                recommendation: this.getUnhealthyEatingRecommendation(prediction, stats),
            };
        }

        // Wastage insights
        if (this.wastageModel) {
            const stats = activityLogger.getUserStatistics(username, 7);

            insights.wastage = {
                wastagePercentage: stats.wastagePercentage,
                totalWastage: stats.wastage,
                recommendation: this.getWastageRecommendation(stats),
            };
        }

        return insights;
    }

    // Get unhealthy eating recommendation
    getUnhealthyEatingRecommendation(prediction, stats) {
        if (prediction.probability >= 0.7) {
            return 'High risk of unhealthy eating patterns detected. Consider healthier alternatives.';
        } else if (prediction.probability >= 0.5) {
            return 'Moderate unhealthy eating patterns. Try to reduce late-night snacking.';
        } else if (stats.lateNightPercentage > 30) {
            return 'Frequent late-night consumption detected. Consider earlier meal times.';
        } else {
            return 'Healthy eating patterns maintained. Keep it up!';
        }
    }

    // Get wastage recommendation
    getWastageRecommendation(stats) {
        if (stats.wastagePercentage >= 30) {
            return 'High food wastage detected. Check expiry dates more frequently.';
        } else if (stats.wastagePercentage >= 15) {
            return 'Moderate wastage. Consider meal planning to reduce waste.';
        } else {
            return 'Low wastage rate. Great job managing your food!';
        }
    }

    // Save models to storage
    saveModels() {
        const models = {};

        if (this.unhealthyEatingModel) {
            models.unhealthyEating = this.unhealthyEatingModel.toJSON();
        }

        if (this.wastageModel) {
            models.wastage = this.wastageModel.toJSON();
        }

        storageManager.saveMLModels(models);
    }

    // Load models from storage
    loadModels() {
        const models = storageManager.getMLModels();

        if (models.unhealthyEating) {
            this.unhealthyEatingModel = LogisticRegression.fromJSON(models.unhealthyEating);
            console.log('Loaded unhealthy eating model from storage');
        }

        if (models.wastage) {
            this.wastageModel = LogisticRegression.fromJSON(models.wastage);
            console.log('Loaded wastage model from storage');
        }
    }

    // Check if models are trained
    areModelsTrained() {
        return {
            unhealthyEating: this.unhealthyEatingModel !== null,
            wastage: this.wastageModel !== null,
        };
    }
}

// Export singleton instance
export const predictionModels = new PredictionModels();
