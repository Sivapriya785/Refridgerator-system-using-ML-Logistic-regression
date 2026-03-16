// Logistic Regression Implementation from Scratch
// Binary classification using gradient descent optimization

class LogisticRegression {
    constructor(learningRate = 0.01, iterations = 1000, regularization = 0.01) {
        this.learningRate = learningRate;
        this.iterations = iterations;
        this.regularization = regularization;
        this.weights = null;
        this.bias = 0;
        this.trainingHistory = [];
    }

    // Sigmoid activation function
    sigmoid(z) {
        // Clip values to prevent overflow
        const clipped = z.map(val => Math.max(-500, Math.min(500, val)));
        return clipped.map(val => 1 / (1 + Math.exp(-val)));
    }

    // Initialize weights
    initializeWeights(numFeatures) {
        this.weights = new Array(numFeatures).fill(0).map(() => Math.random() * 0.01);
        this.bias = 0;
    }

    // Compute predictions
    predict(X) {
        if (!this.weights) {
            throw new Error('Model not trained. Call fit() first.');
        }

        const z = X.map(row => {
            const weightedSum = row.reduce((sum, val, idx) => sum + val * this.weights[idx], 0);
            return weightedSum + this.bias;
        });

        const probabilities = this.sigmoid(z);
        return probabilities.map(p => p >= 0.5 ? 1 : 0);
    }

    // Compute prediction probabilities
    predictProba(X) {
        if (!this.weights) {
            throw new Error('Model not trained. Call fit() first.');
        }

        const z = X.map(row => {
            const weightedSum = row.reduce((sum, val, idx) => sum + val * this.weights[idx], 0);
            return weightedSum + this.bias;
        });

        return this.sigmoid(z);
    }

    // Compute cost (log loss with L2 regularization)
    computeCost(X, y) {
        const m = X.length;
        const probabilities = this.predictProba(X);

        let cost = 0;
        for (let i = 0; i < m; i++) {
            const p = Math.max(1e-15, Math.min(1 - 1e-15, probabilities[i])); // Prevent log(0)
            cost += -y[i] * Math.log(p) - (1 - y[i]) * Math.log(1 - p);
        }

        // Add L2 regularization
        const regTerm = (this.regularization / (2 * m)) *
            this.weights.reduce((sum, w) => sum + w * w, 0);

        return (cost / m) + regTerm;
    }

    // Train the model using gradient descent
    fit(X, y) {
        const m = X.length;
        const numFeatures = X[0].length;

        // Initialize weights
        this.initializeWeights(numFeatures);
        this.trainingHistory = [];

        // Gradient descent
        for (let iter = 0; iter < this.iterations; iter++) {
            // Forward pass
            const probabilities = this.predictProba(X);

            // Compute gradients
            const dw = new Array(numFeatures).fill(0);
            let db = 0;

            for (let i = 0; i < m; i++) {
                const error = probabilities[i] - y[i];
                db += error;
                for (let j = 0; j < numFeatures; j++) {
                    dw[j] += error * X[i][j];
                }
            }

            // Update weights with L2 regularization
            for (let j = 0; j < numFeatures; j++) {
                const regGradient = (this.regularization / m) * this.weights[j];
                this.weights[j] -= this.learningRate * ((dw[j] / m) + regGradient);
            }
            this.bias -= this.learningRate * (db / m);

            // Record training history every 100 iterations
            if (iter % 100 === 0) {
                const cost = this.computeCost(X, y);
                this.trainingHistory.push({ iteration: iter, cost });
            }
        }

        // Final cost
        const finalCost = this.computeCost(X, y);
        this.trainingHistory.push({ iteration: this.iterations, cost: finalCost });

        return this;
    }

    // Evaluate model accuracy
    score(X, y) {
        const predictions = this.predict(X);
        let correct = 0;
        for (let i = 0; i < y.length; i++) {
            if (predictions[i] === y[i]) {
                correct++;
            }
        }
        return correct / y.length;
    }

    // Get model parameters
    getParams() {
        return {
            weights: this.weights,
            bias: this.bias,
            learningRate: this.learningRate,
            iterations: this.iterations,
            regularization: this.regularization,
        };
    }

    // Set model parameters (for loading saved models)
    setParams(params) {
        this.weights = params.weights;
        this.bias = params.bias;
        this.learningRate = params.learningRate;
        this.iterations = params.iterations;
        this.regularization = params.regularization;
    }

    // Serialize model to JSON
    toJSON() {
        return {
            weights: this.weights,
            bias: this.bias,
            learningRate: this.learningRate,
            iterations: this.iterations,
            regularization: this.regularization,
            trainingHistory: this.trainingHistory,
        };
    }

    // Load model from JSON
    static fromJSON(json) {
        const model = new LogisticRegression(
            json.learningRate,
            json.iterations,
            json.regularization
        );
        model.weights = json.weights;
        model.bias = json.bias;
        model.trainingHistory = json.trainingHistory || [];
        return model;
    }
}

export { LogisticRegression };
