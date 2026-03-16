// ML Insights View Component
// Displays machine learning model insights and predictions

import { predictionModels } from '../ml/predictionModels.js';
import { featureEngineering } from '../ml/featureEngineering.js';
import { activityLogger } from '../modules/activityLogger.js';

export function renderMLInsightsView(container, currentUser) {
    const modelStatus = predictionModels.areModelsTrained();
    const insights = predictionModels.getModelInsights(currentUser);
    const logs = activityLogger.getLogsByUser(currentUser);
    const consumptionLogs = logs.filter(l => l.action === 'remove');

    container.innerHTML = `
    <div class="ml-insights-container">
      <h2 style="margin-bottom: 1.5rem; font-size: 2rem;">🤖 Machine Learning Insights</h2>

      <!-- Model Status -->
      <div class="glass-card mb-3">
        <h3 style="margin-bottom: 1rem;">📊 Model Status</h3>
        <div class="grid-2">
          <div style="background: var(--bg-glass); padding: 1rem; border-radius: var(--radius-md);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <span style="font-size: 1.5rem;">${modelStatus.unhealthyEating ? '✅' : '⏳'}</span>
              <strong>Unhealthy Eating Model</strong>
            </div>
            <div style="font-size: 0.875rem; color: var(--text-muted);">
              ${modelStatus.unhealthyEating ? 'Trained and ready' : 'Not trained yet'}
            </div>
          </div>
          <div style="background: var(--bg-glass); padding: 1rem; border-radius: var(--radius-md);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <span style="font-size: 1.5rem;">${modelStatus.wastage ? '✅' : '⏳'}</span>
              <strong>Wastage Prediction Model</strong>
            </div>
            <div style="font-size: 0.875rem; color: var(--text-muted);">
              ${modelStatus.wastage ? 'Trained and ready' : 'Not trained yet'}
            </div>
          </div>
        </div>

        <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-md);">
          <strong>Training Data Available:</strong> ${consumptionLogs.length} consumption records
          ${consumptionLogs.length < 5 ? `
            <div class="alert alert-warning mt-2">
              <div class="alert-icon">⚠️</div>
              <div class="alert-content">
                <div class="alert-message">Need at least 5 consumption records to train models. Current: ${consumptionLogs.length}</div>
              </div>
            </div>
          ` : ''}
        </div>

        <button class="btn btn-primary mt-2" id="train-models-btn" ${consumptionLogs.length < 5 ? 'disabled' : ''}>
          🎓 Train ML Models
        </button>
      </div>

      <!-- Predictions -->
      ${modelStatus.unhealthyEating && insights.unhealthyEating ? `
        <div class="glass-card mb-3">
          <h3 style="margin-bottom: 1rem;">🍔 Unhealthy Eating Prediction</h3>
          
          <div style="text-align: center; padding: 2rem; background: var(--bg-glass); border-radius: var(--radius-md); margin-bottom: 1rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">
              ${insights.unhealthyEating.prediction === 'unhealthy' ? '⚠️' : '✅'}
            </div>
            <div style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">
              ${insights.unhealthyEating.prediction === 'unhealthy' ? 'Unhealthy Pattern Detected' : 'Healthy Pattern'}
            </div>
            <div style="font-size: 1rem; color: var(--text-muted); margin-bottom: 1rem;">
              Confidence: ${Math.round(insights.unhealthyEating.probability * 100)}%
            </div>
            
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-sm); max-width: 600px; margin: 0 auto;">
              <strong>Recommendation:</strong><br>
              ${insights.unhealthyEating.recommendation}
            </div>
          </div>

          <div class="grid-2">
            <div style="background: var(--bg-glass); padding: 1rem; border-radius: var(--radius-md);">
              <div style="font-size: 2rem; font-weight: 700; color: #ee5a6f;">${insights.unhealthyEating.unhealthyPercentage}%</div>
              <div style="font-size: 0.875rem; color: var(--text-muted);">Unhealthy Food Consumption</div>
            </div>
            <div style="background: var(--bg-glass); padding: 1rem; border-radius: var(--radius-md);">
              <div style="font-size: 2rem; font-weight: 700; color: #ff9f43;">${insights.unhealthyEating.lateNightPercentage}%</div>
              <div style="font-size: 0.875rem; color: var(--text-muted);">Late-Night Consumption</div>
            </div>
          </div>
        </div>
      ` : ''}

      ${modelStatus.wastage && insights.wastage ? `
        <div class="glass-card mb-3">
          <h3 style="margin-bottom: 1rem;">🗑️ Wastage Analysis</h3>
          
          <div style="text-align: center; padding: 2rem; background: var(--bg-glass); border-radius: var(--radius-md); margin-bottom: 1rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">
              ${insights.wastage.wastagePercentage >= 30 ? '🚨' : insights.wastage.wastagePercentage >= 15 ? '⚠️' : '✅'}
            </div>
            <div style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">
              ${insights.wastage.wastagePercentage}% Wastage Rate
            </div>
            <div style="font-size: 1rem; color: var(--text-muted); margin-bottom: 1rem;">
              ${insights.wastage.totalWastage} items wasted
            </div>
            
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-sm); max-width: 600px; margin: 0 auto;">
              <strong>Recommendation:</strong><br>
              ${insights.wastage.recommendation}
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Feature Importance -->
      <div class="glass-card mb-3">
        <h3 style="margin-bottom: 1rem;">🔬 Model Features</h3>
        <p class="text-muted mb-2">These behavioral features are used to train the ML models (NOT QR code images):</p>
        
        <div class="grid-2">
          <div>
            <h4 style="margin-bottom: 0.75rem; font-size: 1rem;">Unhealthy Eating Features:</h4>
            <ul style="list-style: none; padding: 0;">
              ${featureEngineering.getUnhealthyEatingFeatureNames().map(feature => `
                <li style="padding: 0.5rem; background: var(--bg-glass); margin-bottom: 0.5rem; border-radius: var(--radius-sm);">
                  ✓ ${feature}
                </li>
              `).join('')}
            </ul>
          </div>
          <div>
            <h4 style="margin-bottom: 0.75rem; font-size: 1rem;">Wastage Prediction Features:</h4>
            <ul style="list-style: none; padding: 0;">
              ${featureEngineering.getWastageFeatureNames().map(feature => `
                <li style="padding: 0.5rem; background: var(--bg-glass); margin-bottom: 0.5rem; border-radius: var(--radius-sm);">
                  ✓ ${feature}
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>

      <!-- Algorithm Info -->
      <div class="glass-card">
        <h3 style="margin-bottom: 1rem;">📚 Algorithm Information</h3>
        <div style="background: var(--bg-glass); padding: 1.5rem; border-radius: var(--radius-md);">
          <h4 style="margin-bottom: 0.75rem;">Logistic Regression</h4>
          <p style="color: var(--text-secondary); margin-bottom: 1rem;">
            This system uses <strong>Logistic Regression</strong>, a supervised machine learning algorithm for binary classification. 
            The model is trained on behavioral data extracted from your consumption patterns, NOT on QR code images.
          </p>
          <ul style="color: var(--text-secondary); margin-left: 1.5rem;">
            <li>Sigmoid activation function for probability estimation</li>
            <li>Gradient descent optimization with L2 regularization</li>
            <li>Interpretable feature weights for explainability</li>
            <li>Continuous learning from new consumption data</li>
          </ul>
        </div>
      </div>
    </div>
  `;

    // Add event listener for train button
    const trainBtn = container.querySelector('#train-models-btn');
    if (trainBtn) {
        trainBtn.addEventListener('click', () => {
            trainBtn.disabled = true;
            trainBtn.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; margin: 0 auto;"></div>';

            setTimeout(() => {
                const results = predictionModels.trainAllModels(currentUser);

                let message = '';
                if (results.unhealthyEating.success) {
                    message += `✅ Unhealthy Eating Model: ${(results.unhealthyEating.accuracy * 100).toFixed(2)}% accuracy\\n`;
                }
                if (results.wastage.success) {
                    message += `✅ Wastage Model: ${(results.wastage.accuracy * 100).toFixed(2)}% accuracy`;
                }

                alert('Models Trained Successfully!\\n\\n' + message);

                // Refresh view
                window.dispatchEvent(new CustomEvent('refreshView'));
            }, 1000);
        });
    }
}
