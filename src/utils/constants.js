import { FOOD_CATEGORIES } from '../constants';

export const CURRENT_STATES = [
  'Sad', 'Anxious', 'Stressed', 'Angry', 'Frustrated', 'Nervous', 'Insecure',
  'Bored', 'Confident',
  'Happy', 'Grateful', 'Excited', 'Motivated',
  'Cold', 'Sick', 'Nauseous', 'Feverish', 'Injured', 'Pain', 'Bloated', 'Dehydrated', 'Hungry', 'Thirsty',
  'Tired', 'Sleepy', 'Lethargic', 'On their period', 'Energized', 'Relaxed', 'Calm', 'Focused'
];

export const DESIRED_STATES = [
  'Calm', 'Peaceful', 'Grateful', 'Loving', 'Grounded',
  'Joyful', 'Optimistic', 'Excited', 'Vibrant', 'Driven',
  'Focused', 'Clear-headed', 'Reflective', 'Mindful', 'Creative', 'Resilient',
  'Energized', 'Rested', 'Strong', 'Light', 'Flexible', 'Hydrated', 'Satiated', 'Pain-free',
  'Sexually Aroused', 'Motivated', 'Alert'
];

export const DUMMY_FOODS = [
  {
    id: '1',
    name: 'Fish',
    icon: '🐟',
    description: 'Boosts energy with protein',
    rating: 'Nomnomnomnom',
    recommendation: 'high', 
    category: FOOD_CATEGORIES.PROTEIN,
    calories: 180,
    protein: 24,    // 96 calories from protein (24g × 4 cal/g) We can estimate through 4/4/9  t
    carbs: 0,       // 0 calories from carbs
    fats: 9.3,      // 84 calories from fat (9.3g × 9 cal/g)
    servingSize: '100g',
    servingsPerMeal: 1
  },
  {
    id: '2',
    name: 'Avocado',
    icon: '🥑',
    description: 'Healthy fats, moderate energy',
    rating: 'Nom',
    recommendation: 'moderate',
    category: FOOD_CATEGORIES.FATS,
    calories: 240,
    protein: 3,      // 12 calories from protein
    carbs: 12,       // 48 calories from carbs
    fats: 20,        // 180 calories from fat
    servingSize: '1 medium',
    servingsPerMeal: 0.5
  },
  {
    id: '3',
    name: 'Broccoli',
    icon: '🥦',
    description: 'Vitamin-packed energy booster',
    rating: 'Nomnomnomnom',
    recommendation: 'high',
    category: FOOD_CATEGORIES.VEGETABLES,
    calories: 55,
    protein: 3.7,    // 14.8 calories from protein
    carbs: 11,       // 44 calories from carbs
    fats: 0,         // 0 calories from fat
    servingSize: '100g',
    servingsPerMeal: 1
  },
  {
    id: '4',
    name: 'Brown Rice',
    icon: '🍚',
    description: 'Complex carbs for steady energy',
    rating: 'Nom',
    recommendation: 'moderate',
    category: FOOD_CATEGORIES.GRAINS,
    calories: 215,
    protein: 5,      // 20 calories from protein
    carbs: 45,       // 180 calories from carbs
    fats: 1.8,       // 16.2 calories from fat
    servingSize: '1 cup cooked',
    servingsPerMeal: 0.75
  },
  {
    id: '5',
    name: 'Blueberries',
    icon: '🫐',
    description: 'Antioxidant-rich brain food',
    rating: 'Nomnomnomnom',
    recommendation: 'high',
    category: FOOD_CATEGORIES.FRUITS,
    calories: 85,
    protein: 1.1,    // 4.4 calories from protein
    carbs: 21,       // 84 calories from carbs
    fats: 0.5,       // 4.5 calories from fat
    servingSize: '1 cup',
    servingsPerMeal: 0.5
  },
  {
    id: '6',
    name: 'Almonds',
    icon: '🥜',
    description: 'Protein and healthy fats',
    rating: 'Nom',
    recommendation: 'moderate',
    category: FOOD_CATEGORIES.FATS,
    calories: 160,
    protein: 6,      // 24 calories from protein
    carbs: 6,        // 24 calories from carbs
    fats: 14,        // 126 calories from fat
    servingSize: '1 oz (23 almonds)',
    servingsPerMeal: 0.5
  },
  {
    id: '7',
    name: 'Spinach',
    icon: '🥬',
    description: 'Iron-rich energy boost',
    rating: 'Nomnomnomnom',
    recommendation: 'high',
    category: FOOD_CATEGORIES.VEGETABLES,
    calories: 23,
    protein: 2.9,    // 11.6 calories from protein
    carbs: 3.6,      // 14.4 calories from carbs
    fats: 0.4,       // 3.6 calories from fat
    servingSize: '100g',
    servingsPerMeal: 1
  },
  {
    id: '8',
    name: 'Quinoa',
    icon: '🌾',
    description: 'Complete protein source',
    rating: 'Nom',
    recommendation: 'moderate',
    category: FOOD_CATEGORIES.GRAINS,
    calories: 220,
    protein: 8.1,    // 32.4 calories from protein
    carbs: 39.4,     // 157.6 calories from carbs
    fats: 3.6,       // 32.4 calories from fat
    servingSize: '1 cup cooked',
    servingsPerMeal: 0.75
  },
  {
    id: '9',
    name: 'Banana',
    icon: '🍌',
    description: 'Quick energy boost',
    rating: 'Nom',
    recommendation: 'moderate',
    category: FOOD_CATEGORIES.FRUITS,
    calories: 105,
    protein: 1.3,    // 5.2 calories from protein
    carbs: 27,       // 108 calories from carbs
    fats: 0.4,       // 3.6 calories from fat
    servingSize: '1 medium',
    servingsPerMeal: 1
  },
  {
    id: '10',
    name: 'Ice Cream',
    icon: '🍦',
    description: 'High sugar, avoid crashes',
    rating: 'Nono',
    recommendation: 'avoid',
    category: FOOD_CATEGORIES.DAIRY,
    calories: 270,
    protein: 4.5,    // 18 calories from protein
    carbs: 31,       // 124 calories from carbs
    fats: 14,        // 126 calories from fat
    servingSize: '1 cup',
    servingsPerMeal: 0.5
  },
  {
    id: '11',
    name: 'Chicken Breast',
    icon: '🍗',
    description: 'Lean protein for muscle recovery',
    rating: 'Nomnomnomnom',
    recommendation: 'high',
    category: FOOD_CATEGORIES.PROTEIN,
    calories: 165,
    protein: 31,     // 124 calories from protein
    carbs: 0,        // 0 calories from carbs
    fats: 3.6,       // 32.4 calories from fat
    servingSize: '100g',
    servingsPerMeal: 1
  },
  {
    id: '12',
    name: 'Sweet Potato',
    icon: '🍠',
    description: 'Nutrient-dense carb source',
    rating: 'Nomnomnomnom',
    recommendation: 'high',
    category: FOOD_CATEGORIES.VEGETABLES,
    calories: 180,
    protein: 4,      // 16 calories from protein
    carbs: 41.5,     // 166 calories from carbs
    fats: 0.1,       // 0.9 calories from fat
    servingSize: '1 medium',
    servingsPerMeal: 0.75
  },
  {
    id: '13',
    name: 'Eggs',
    icon: '🥚',
    description: 'Complete protein and healthy fats',
    rating: 'Nomnomnomnom',
    recommendation: 'high',
    category: FOOD_CATEGORIES.PROTEIN,
    calories: 140,
    protein: 12,     // 48 calories from protein
    carbs: 1,        // 4 calories from carbs
    fats: 10,        // 90 calories from fat
    servingSize: '2 large eggs',
    servingsPerMeal: 1
  },
  {
    id: '14',
    name: 'Greek Yogurt',
    icon: '🥛',
    description: 'High protein, gut-friendly',
    rating: 'Nomnomnomnom',
    recommendation: 'high',
    category: FOOD_CATEGORIES.DAIRY,
    calories: 100,
    protein: 17,     // 68 calories from protein
    carbs: 6,        // 24 calories from carbs
    fats: 0.5,       // 4.5 calories from fat
    servingSize: '6 oz',
    servingsPerMeal: 1
  },
  {
    id: '15',
    name: 'Olive Oil',
    icon: '🫒',
    description: 'Heart-healthy fats',
    rating: 'Nom',
    recommendation: 'moderate',
    category: FOOD_CATEGORIES.FATS,
    calories: 120,
    protein: 0,      // 0 calories from protein
    carbs: 0,        // 0 calories from carbs
    fats: 14,        // 126 calories from fat
    servingSize: '1 tbsp',
    servingsPerMeal: 0.5
  },
  {
    id: '16',
    name: 'Salmon',
    icon: '🐟',
    description: 'Omega-3 rich brain food',
    rating: 'Nomnomnomnom',
    recommendation: 'high',
    category: FOOD_CATEGORIES.PROTEIN,
    calories: 206,
    protein: 22,     // 88 calories from protein
    carbs: 0,        // 0 calories from carbs
    fats: 13,        // 117 calories from fat
    servingSize: '100g',
    servingsPerMeal: 1
  },
  {
    id: '17',
    name: 'Oatmeal',
    icon: '🥣',
    description: 'Sustained energy from complex carbs',
    rating: 'Nomnomnomnom',
    recommendation: 'high',
    category: FOOD_CATEGORIES.GRAINS,
    calories: 150,
    protein: 5,      // 20 calories from protein
    carbs: 27,       // 108 calories from carbs
    fats: 2.5,       // 22.5 calories from fat
    servingSize: '1 cup cooked',
    servingsPerMeal: 1
  },
  {
    id: '18',
    name: 'Lentils',
    icon: '🥫',
    description: 'Plant protein and fiber',
    rating: 'Nomnomnomnom',
    recommendation: 'high',
    category: FOOD_CATEGORIES.PROTEIN,
    calories: 230,
    protein: 18,     // 72 calories from protein
    carbs: 40,       // 160 calories from carbs
    fats: 0.8,       // 7.2 calories from fat
    servingSize: '1 cup cooked',
    servingsPerMeal: 0.75
  }
]; 