// Recommendations View Component
// Displays personalized food recommendations

import { recommendationEngine } from '../modules/recommendationEngine.js';
import { categoryEmojis } from '../data/groceryDatabase.js';

export function renderRecommendationsView(container, currentUser) {
    const recommendations = recommendationEngine.getRecommendations(currentUser);

    container.innerHTML = `
    <div class="recommendations-container">
      <h2 style="margin-bottom: 1.5rem; font-size: 2rem;">💡 Personalized Recommendations</h2>

      <div class="glass-card mb-3" style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);">
        <h3 style="margin-bottom: 0.5rem;">🤖 AI-Powered Suggestions</h3>
        <p class="text-muted">Based on your consumption patterns, emotional state, and ML predictions</p>
      </div>

      ${recommendations.length > 0 ? `
        <div class="grid-3">
          ${recommendations.map(rec => {
        const emoji = categoryEmojis[rec.product.category] || '📦';
        const healthBadge = rec.product.healthTag === 'healthy'
            ? '<span class="badge badge-healthy">Healthy</span>'
            : '<span class="badge badge-unhealthy">Unhealthy</span>';

        const priorityColor = rec.priority === 'high' ? '#4ecb71' : '#4facfe';
        const priorityBorder = rec.priority === 'high' ? '2px solid rgba(78, 203, 113, 0.5)' : '1px solid rgba(79, 172, 254, 0.3)';

        return `
              <div class="glass-card" style="padding: 1.5rem; border: ${priorityBorder};">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                  <div style="font-size: 2.5rem;">${emoji}</div>
                  <div style="font-size: 1.5rem;">${rec.emoji}</div>
                </div>
                
                <h4 style="margin-bottom: 0.5rem; font-size: 1.25rem;">${rec.product.name}</h4>
                
                <div style="margin-bottom: 0.75rem;">
                  ${healthBadge}
                  <span class="badge" style="background: rgba(${rec.priority === 'high' ? '78, 203, 113' : '79, 172, 254'}, 0.2); color: ${priorityColor}; margin-left: 0.5rem;">
                    ${rec.priority.toUpperCase()}
                  </span>
                </div>

                <div style="background: var(--bg-glass); padding: 0.75rem; border-radius: var(--radius-sm); margin-bottom: 0.75rem;">
                  <div style="font-size: 0.875rem; color: var(--text-secondary);">
                    <strong>Why?</strong> ${rec.reason}
                  </div>
                </div>

                <div style="display: flex; gap: 0.5rem; font-size: 0.75rem; color: var(--text-muted);">
                  <span>📦 ${rec.product.category}</span>
                  <span>⏱️ ${rec.product.shelfLife} days</span>
                </div>

                <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--border-color); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">
                  ${rec.type.replace(/_/g, ' ')}
                </div>
              </div>
            `;
    }).join('')}
        </div>
      ` : `
        <div class="glass-card text-center" style="padding: 3rem;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🎯</div>
          <h3 style="margin-bottom: 1rem;">No Recommendations Yet</h3>
          <p class="text-muted">Start adding and consuming items to get personalized recommendations!</p>
        </div>
      `}
    </div>
  `;
}
