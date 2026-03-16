# Smart Refrigerator ML Application

A human-centric smart refrigerator system using QR-code-based food identification and machine learning to analyze user behavior, predict food wastage, and provide personalized recommendations.

## 🚀 Quick Start

### Option 1: Using Python (Recommended if you don't have Node.js)

```bash
python server.py
```

Then open http://localhost:3000 in your browser.

### Option 2: Using Vite (if you have Node.js)

```bash
npm install
npm run dev
```

## ✨ Features

- **QR Code Food Tracking**: Scan QR codes to add/remove items (QR codes encode product IDs only)
- **Machine Learning**: Logistic Regression models trained on behavioral data
  - Unhealthy eating pattern prediction
  - Food wastage prediction
- **Behavior Analysis**: Identifies consumption patterns, habits, and trends
- **Emotion Inference**: Detects emotional states from usage patterns
- **Personalized Recommendations**: AI-powered food suggestions
- **Real-time Alerts**: Expiry warnings, wastage risks, unhealthy patterns
- **Analytics Dashboard**: Consumption trends, category breakdown, weekly summaries

## 🧠 Machine Learning

The system uses **Logistic Regression** (implemented from scratch) for binary classification:

- **Training Data**: Behavioral features extracted from consumption logs
- **Features**: Time of consumption, late-night indicator, food category, frequency, expiry proximity
- **NOT trained on**: QR code images or visual patterns
- **Models**: Unhealthy eating predictor, food wastage predictor

## 📊 Key Components

- **38 Products**: Fruits, vegetables, dairy, protein, grains, snacks, junk food, beverages
- **Multi-User Support**: Track consumption for multiple users
- **Real-time Inventory**: Automatic expiry tracking
- **Activity Logging**: Comprehensive consumption history
- **Custom Charts**: Canvas-based visualizations

## 💡 Usage Tips

1. **Generate Sample Data**: Open browser console and run:
   ```javascript
   window.smartFridgeApp.generateSampleData()
   ```

2. **Train ML Models**: Navigate to "ML Insights" and click "Train ML Models"

3. **View Recommendations**: Check "Recommendations" tab for personalized suggestions

4. **Monitor Alerts**: Dashboard shows active alerts for expiring food and unhealthy patterns

## 🎨 Design

- Modern dark mode with glassmorphism effects
- Vibrant color palette
- Smooth animations and micro-interactions
- Responsive layout

## 📁 Project Structure

```
Fridge/
├── index.html              # Main HTML
├── styles.css              # Design system
├── main.js                 # Application orchestrator
├── qrcode.js              # Standalone QR generator
├── data/
│   ├── groceryDatabase.js  # Product database
│   └── storageManager.js   # localStorage wrapper
├── modules/
│   ├── qrGenerator.js      # QR code generation
│   ├── qrScanner.js        # QR scanning simulation
│   ├── inventoryManager.js # Inventory tracking
│   ├── activityLogger.js   # Action logging
│   ├── behaviorAnalyzer.js # Pattern detection
│   ├── emotionInference.js # Emotional state detection
│   ├── recommendationEngine.js # AI recommendations
│   ├── alertSystem.js      # Notification system
│   ├── analyticsEngine.js  # Metrics calculation
│   └── chartRenderer.js    # Custom charts
├── ml/
│   ├── logisticRegression.js   # ML algorithm
│   ├── featureEngineering.js   # Feature extraction
│   └── predictionModels.js     # Model management
└── components/
    ├── dashboard.js        # Main dashboard
    ├── scanView.js         # QR scanning UI
    ├── analyticsView.js    # Analytics dashboard
    ├── recommendationsView.js # Recommendations
    └── mlInsightsView.js   # ML insights
```

## 🔬 Technical Details

- **No external ML libraries**: Logistic regression implemented from scratch
- **No deep learning**: Focus on interpretable models
- **Behavioral data only**: ML trained on consumption patterns, not QR images
- **LocalStorage persistence**: All data stored locally
- **Vanilla JavaScript**: No framework dependencies
- **ES6 Modules**: Modern JavaScript architecture

## 🎯 Project Goal

Demonstrate a human-centric, emotion-aware smart refrigerator system that leverages machine learning and behavioral data to reduce food wastage, promote healthy eating, and serve as a foundation for future smart home appliances.

---

Built with ❤️ using vanilla JavaScript, HTML5 Canvas, and machine learning
