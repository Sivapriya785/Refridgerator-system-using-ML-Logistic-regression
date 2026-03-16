// Analytics View Component
// Displays consumption trends, category breakdown, and insights

import { analyticsEngine } from '../modules/analyticsEngine.js';
import { chartRenderer } from '../modules/chartRenderer.js';
import { behaviorAnalyzer } from '../modules/behaviorAnalyzer.js';
import { emotionInference } from '../modules/emotionInference.js';

export function renderAnalyticsView(container, currentUser) {
    const analytics = analyticsEngine.getUserAnalytics(currentUser, 7);
    const weeklySummary = analyticsEngine.getWeeklySummary(currentUser);
    const behavior = behaviorAnalyzer.analyzeUserBehavior(currentUser);
    const emotion = emotionInference.inferEmotion(currentUser);

    container.innerHTML = `
    <div class="analytics-container">
      <h2 style="margin-bottom: 1.5rem; font-size: 2rem;">📈 Analytics Dashboard</h2>

      <!-- Weekly Summary -->
      <div class="glass-card mb-3">
        <h3 style="margin-bottom: 1rem;">📅 Weekly Summary</h3>
        <div class="grid-4">
          <div class="stat-card">
            <div class="stat-value">${weeklySummary.totalConsumption}</div>
            <div class="stat-label">Items Consumed</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color: ${weeklySummary.grade.color};">
              ${weeklySummary.grade.grade}
            </div>
            <div class="stat-label">Health Grade ${weeklySummary.grade.emoji}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${weeklySummary.wastageRate}%</div>
            <div class="stat-label">Wastage Rate</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${weeklySummary.lateNightPercentage}%</div>
            <div class="stat-label">Late Night</div>
          </div>
        </div>
      </div>

      <!-- Emotional State -->
      <div class="glass-card mb-3">
        <h3 style="margin-bottom: 1rem;">😊 Emotional State Analysis</h3>
        <div style="text-align: center; padding: 1rem;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">${emotion.primary.emoji}</div>
          <div style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem;">${emotion.primary.description}</div>
          <div style="color: var(--text-muted); margin-bottom: 1rem;">${emotion.primary.reason}</div>
          <div style="background: var(--bg-glass); padding: 1rem; border-radius: var(--radius-md);">
            <strong>Suggestion:</strong> ${emotionInference.getContextMessage(currentUser)}
          </div>
        </div>
      </div>

      <!-- Consumption Trends -->
      <div class="glass-card mb-3">
        <h3 style="margin-bottom: 1rem;">📊 Consumption Trends (7 Days)</h3>
        <div id="trend-chart" style="min-height: 300px;"></div>
      </div>

      <!-- Category Breakdown -->
      <div class="grid-2 mb-3">
        <div class="glass-card">
          <h3 style="margin-bottom: 1rem;">🥗 Category Distribution</h3>
          ${analytics.categoryBreakdown.length > 0 ? `
            <div id="category-chart" style="min-height: 300px;"></div>
          ` : '<p class="text-muted text-center">No data available</p>'}
        </div>

        <div class="glass-card">
          <h3 style="margin-bottom: 1rem;">⏰ Time Distribution</h3>
          ${analytics.timeDistribution.length > 0 ? `
            <div id="time-chart" style="min-height: 300px;"></div>
          ` : '<p class="text-muted text-center">No data available</p>'}
        </div>
      </div>

      <!-- Behavioral Patterns -->
      ${behavior.patterns.length > 0 ? `
        <div class="glass-card mb-3">
          <h3 style="margin-bottom: 1rem;">🔍 Detected Patterns</h3>
          ${behavior.patterns.map(pattern => `
            <div class="alert ${pattern.severity === 'high' ? 'alert-danger' : 'alert-warning'}">
              <div class="alert-icon">${pattern.type === 'late_night_snacking' ? '🌙' : pattern.type === 'junk_food_consumption' ? '🍔' : '🗑️'}</div>
              <div class="alert-content">
                <div class="alert-title">${pattern.type.replace(/_/g, ' ').toUpperCase()}</div>
                <div class="alert-message">${pattern.description}</div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Habits -->
      ${behavior.habits.length > 0 ? `
        <div class="glass-card">
          <h3 style="margin-bottom: 1rem;">💡 Your Habits</h3>
          ${behavior.habits.map(habit => {
        if (habit.type === 'peak_consumption_hours') {
            return `
                <div style="margin-bottom: 1rem;">
                  <strong>Peak Consumption Hours:</strong>
                  <div style="margin-top: 0.5rem;">
                    ${habit.hours.map(h => `
                      <span class="badge badge-healthy" style="margin-right: 0.5rem;">
                        ${h.timeLabel} (${h.hour}:00) - ${h.count} times
                      </span>
                    `).join('')}
                  </div>
                </div>
              `;
        } else if (habit.type === 'favorite_categories') {
            return `
                <div style="margin-bottom: 1rem;">
                  <strong>Favorite Categories:</strong>
                  <div style="margin-top: 0.5rem;">
                    ${habit.categories.map(c => `
                      <span class="badge badge-healthy" style="margin-right: 0.5rem;">
                        ${c.category} - ${c.percentage}%
                      </span>
                    `).join('')}
                  </div>
                </div>
              `;
        }
        return '';
    }).join('')}
        </div>
      ` : ''}
    </div>
  `;

    // Render charts
    if (analytics.trends.dailyConsumption.length > 0) {
        setTimeout(() => {
            const trendChartContainer = container.querySelector('#trend-chart');
            if (trendChartContainer) {
                chartRenderer.renderLineChart(trendChartContainer, analytics.trends.dailyConsumption, {
                    lines: ['total', 'healthy', 'unhealthy'],
                    colors: {
                        total: '#667eea',
                        healthy: '#4ecb71',
                        unhealthy: '#ee5a6f',
                    },
                });
            }
        }, 100);
    }

    if (analytics.categoryBreakdown.length > 0) {
        setTimeout(() => {
            const categoryChartContainer = container.querySelector('#category-chart');
            if (categoryChartContainer) {
                chartRenderer.renderPieChart(categoryChartContainer, analytics.categoryBreakdown);
            }
        }, 100);
    }

    if (analytics.timeDistribution.length > 0) {
        setTimeout(() => {
            const timeChartContainer = container.querySelector('#time-chart');
            if (timeChartContainer) {
                chartRenderer.renderBarChart(timeChartContainer, analytics.timeDistribution, {
                    color: '#4facfe',
                });
            }
        }, 100);
    }
}
