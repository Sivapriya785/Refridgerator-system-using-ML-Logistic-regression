// Comprehensive Grocery Product Database
// Each product has: ID, name, category, health tag, shelf life (days)

export const groceryDatabase = [
  // Fruits (Healthy)
  { id: 'FRUIT001', name: 'Apple', category: 'fruit', healthTag: 'healthy', shelfLife: 7 },
  { id: 'FRUIT002', name: 'Banana', category: 'fruit', healthTag: 'healthy', shelfLife: 5 },
  { id: 'FRUIT003', name: 'Orange', category: 'fruit', healthTag: 'healthy', shelfLife: 10 },
  { id: 'FRUIT004', name: 'Grapes', category: 'fruit', healthTag: 'healthy', shelfLife: 7 },
  { id: 'FRUIT005', name: 'Strawberries', category: 'fruit', healthTag: 'healthy', shelfLife: 3 },
  { id: 'FRUIT006', name: 'Mango', category: 'fruit', healthTag: 'healthy', shelfLife: 5 },
  
  // Vegetables (Healthy)
  { id: 'VEG001', name: 'Carrot', category: 'vegetable', healthTag: 'healthy', shelfLife: 14 },
  { id: 'VEG002', name: 'Broccoli', category: 'vegetable', healthTag: 'healthy', shelfLife: 7 },
  { id: 'VEG003', name: 'Spinach', category: 'vegetable', healthTag: 'healthy', shelfLife: 5 },
  { id: 'VEG004', name: 'Tomato', category: 'vegetable', healthTag: 'healthy', shelfLife: 7 },
  { id: 'VEG005', name: 'Bell Pepper', category: 'vegetable', healthTag: 'healthy', shelfLife: 10 },
  { id: 'VEG006', name: 'Cucumber', category: 'vegetable', healthTag: 'healthy', shelfLife: 7 },
  
  // Dairy (Healthy)
  { id: 'DAIRY001', name: 'Milk', category: 'dairy', healthTag: 'healthy', shelfLife: 7 },
  { id: 'DAIRY002', name: 'Yogurt', category: 'dairy', healthTag: 'healthy', shelfLife: 14 },
  { id: 'DAIRY003', name: 'Cheese', category: 'dairy', healthTag: 'healthy', shelfLife: 21 },
  { id: 'DAIRY004', name: 'Butter', category: 'dairy', healthTag: 'healthy', shelfLife: 30 },
  
  // Protein (Healthy)
  { id: 'PROTEIN001', name: 'Chicken Breast', category: 'protein', healthTag: 'healthy', shelfLife: 3 },
  { id: 'PROTEIN002', name: 'Eggs', category: 'protein', healthTag: 'healthy', shelfLife: 21 },
  { id: 'PROTEIN003', name: 'Salmon', category: 'protein', healthTag: 'healthy', shelfLife: 2 },
  { id: 'PROTEIN004', name: 'Tofu', category: 'protein', healthTag: 'healthy', shelfLife: 7 },
  
  // Grains (Healthy)
  { id: 'GRAIN001', name: 'Brown Rice', category: 'grain', healthTag: 'healthy', shelfLife: 180 },
  { id: 'GRAIN002', name: 'Whole Wheat Bread', category: 'grain', healthTag: 'healthy', shelfLife: 7 },
  { id: 'GRAIN003', name: 'Oats', category: 'grain', healthTag: 'healthy', shelfLife: 365 },
  
  // Snacks (Mixed)
  { id: 'SNACK001', name: 'Almonds', category: 'snack', healthTag: 'healthy', shelfLife: 180 },
  { id: 'SNACK002', name: 'Granola Bar', category: 'snack', healthTag: 'healthy', shelfLife: 90 },
  { id: 'SNACK003', name: 'Popcorn', category: 'snack', healthTag: 'healthy', shelfLife: 60 },
  
  // Junk Food (Unhealthy)
  { id: 'JUNK001', name: 'Chocolate Bar', category: 'junk', healthTag: 'unhealthy', shelfLife: 180 },
  { id: 'JUNK002', name: 'Potato Chips', category: 'junk', healthTag: 'unhealthy', shelfLife: 90 },
  { id: 'JUNK003', name: 'Cookies', category: 'junk', healthTag: 'unhealthy', shelfLife: 60 },
  { id: 'JUNK004', name: 'Ice Cream', category: 'junk', healthTag: 'unhealthy', shelfLife: 90 },
  { id: 'JUNK005', name: 'Candy', category: 'junk', healthTag: 'unhealthy', shelfLife: 180 },
  { id: 'JUNK006', name: 'Donuts', category: 'junk', healthTag: 'unhealthy', shelfLife: 3 },
  
  // Beverages (Mixed)
  { id: 'BEV001', name: 'Orange Juice', category: 'beverage', healthTag: 'healthy', shelfLife: 7 },
  { id: 'BEV002', name: 'Soda', category: 'beverage', healthTag: 'unhealthy', shelfLife: 180 },
  { id: 'BEV003', name: 'Energy Drink', category: 'beverage', healthTag: 'unhealthy', shelfLife: 365 },
  { id: 'BEV004', name: 'Green Tea', category: 'beverage', healthTag: 'healthy', shelfLife: 365 },
  { id: 'BEV005', name: 'Water', category: 'beverage', healthTag: 'healthy', shelfLife: 365 },
];

// Helper function to get product by ID
export function getProductById(productId) {
  return groceryDatabase.find(product => product.id === productId);
}

// Helper function to get products by category
export function getProductsByCategory(category) {
  return groceryDatabase.filter(product => product.category === category);
}

// Helper function to get products by health tag
export function getProductsByHealthTag(healthTag) {
  return groceryDatabase.filter(product => product.healthTag === healthTag);
}

// Get all unique categories
export function getAllCategories() {
  return [...new Set(groceryDatabase.map(p => p.category))];
}

// Category color mapping
export const categoryColors = {
  fruit: '#ff6b9d',
  vegetable: '#4ecb71',
  dairy: '#ffd93d',
  snack: '#ff9f43',
  junk: '#ee5a6f',
  beverage: '#4facfe',
  protein: '#c44569',
  grain: '#f8b500',
};

// Category emoji mapping
export const categoryEmojis = {
  fruit: '🍎',
  vegetable: '🥦',
  dairy: '🥛',
  snack: '🥜',
  junk: '🍫',
  beverage: '🥤',
  protein: '🍗',
  grain: '🌾',
};
