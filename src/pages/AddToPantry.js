import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToPantry } from '../store/inventorySlice';
import Selector from '../components/Selector';

export const PANTRY_CATEGORIES = {
  fruits: {
    title: 'Fruits',
    items: [
      'Apricots', 'Avocados', 'Bananas', 'Blackberries', 'Blood Oranges', 'Blueberries',
      'Cantaloupe', 'Cherries', 'Cranberries', 'Dates', 'Figs', 'Fuji Apples',
      'Granny Smith Apples', 'Grapefruit', 'Green Grapes', 'Honeydew', 'Honeycrisp Apples',
      'Kiwi', 'Lemons', 'Limes', 'Mandarin Oranges', 'Mangoes', 'Navel Oranges',
      'Nectarines', 'Peaches', 'Pears', 'Persimmons', 'Pineapple', 'Plums',
      'Pomegranates', 'Raspberries', 'Red Grapes', 'Rhubarb', 'Starfruit',
      'Strawberries', 'Watermelon'
    ]
  },
  vegetables: {
    title: 'Vegetables',
    items: [
      'Acorn Squash', 'Artichokes', 'Arugula', 'Asparagus', 'Beefsteak Tomatoes',
      'Beets', 'Black Beans', 'Bok Choy', 'Broccoli', 'Brussels Sprouts',
      'Butternut Squash', 'Button Mushrooms', 'Carrots', 'Cauliflower', 'Celery',
      'Cherry Tomatoes', 'Chickpeas', 'Collard Greens', 'Corn', 'Cremini Mushrooms',
      'Curly Kale', 'Eggplant', 'English Cucumbers', 'English Peas', 'Fennel',
      'Garlic', 'Ginger', 'Grape Tomatoes', 'Green Bell Peppers', 'Green Cabbage',
      'Green Onions', 'Green Beans', 'Heirloom Tomatoes', 'Iceberg Lettuce',
      'Jalapeños', 'Kidney Beans', 'Lacinato Kale', 'Leeks', 'Mung Beans',
      'Navy Beans', 'Okra', 'Orange Bell Peppers', 'Parsnips', 'Persian Cucumbers',
      'Pinto Beans', 'Portobello Mushrooms', 'Pumpkins', 'Radishes', 'Red Bell Peppers',
      'Red Cabbage', 'Red Onions', 'Red Potatoes', 'Roma Tomatoes', 'Romaine Lettuce',
      'Russet Potatoes', 'Rutabaga', 'Shallots', 'Shiitake Mushrooms', 'Snap Peas',
      'Snow Peas', 'Spaghetti Squash', 'Spinach', 'Split Peas', 'Sweet Potatoes',
      'Swiss Chard', 'Turnips', 'White Onions', 'Yams', 'Yellow Bell Peppers',
      'Yellow Onions', 'Yellow Squash', 'Yukon Gold Potatoes', 'Zucchini'
    ]
  },
  fresh_herbs: {
    title: 'Fresh Herbs',
    items: [
      'Basil', 'Chives', 'Cilantro', 'Dill', 'Mint', 'Oregano', 'Parsley',
      'Rosemary', 'Sage', 'Thyme'
    ]
  },
  dairy: {
    title: 'Dairy',
    items: [
      'Chicken Eggs', 'Duck Eggs', 'Full Fat Cottage Cheese', 'Goat Milk',
      'Heavy Cream', 'Plain Whole Milk Yogurt', 'Quail Eggs', 'Raw Milk',
      'Sheep Milk', 'Unsalted Butter', 'Whole Milk', 'Whole Milk Ricotta Cheese'
    ]
  },
  meat: {
    title: 'Meat & Poultry',
    items: [
      'Beef Brisket', 'Beef Chuck Roast', 'Beef Ribeye Steak', 'Beef Sirloin Steak',
      'Beef Tenderloin', 'Bone-in Chicken Breast', 'Bone-in Chicken Thighs',
      'Bone-in Pork Chops', 'Boneless Chicken Breast', 'Boneless Chicken Thighs',
      'Boneless Pork Chops', 'Chicken Drumsticks', 'Chicken Wings', 'Duck Breast',
      'Goose', 'Grass-fed Ground Beef', 'Ground Lamb', 'Ground Pork', 'Ground Turkey',
      'Lamb Chops', 'Lamb Leg', 'Lean Ground Beef', 'Pork Belly', 'Pork Shoulder',
      'Pork Tenderloin', 'Turkey Breast', 'Whole Chicken', 'Whole Duck', 'Whole Turkey'
    ]
  },
  seafood: {
    title: 'Seafood',
    items: [
      'Atlantic Salmon', 'Clams', 'Cod', 'Crab Legs', 'Haddock', 'Halibut',
      'Lobster Tails', 'Mackerel', 'Mussels', 'Octopus', 'Oysters', 'Sardines',
      'Scallops', 'Snapper', 'Sockeye Salmon', 'Squid', 'Tilapia', 'Trout',
      'Tuna Steaks', 'Wild-caught Salmon', 'Wild-caught Shrimp'
    ]
  },
  grains: {
    title: 'Grains & Cereals',
    items: [
      'Amaranth', 'Arborio Rice', 'Barley', 'Basmati Rice', 'Black Quinoa',
      'Brown Rice', 'Buckwheat', 'Bulgur', 'Farro', 'Jasmine Rice',
      'Long-grain White Rice', 'Millet', 'Red Quinoa', 'Rolled Oats',
      'Short-grain White Rice', 'Steel-cut Oats', 'White Quinoa', 'Wild Rice'
    ]
  },
  pasta: {
    title: 'Pasta',
    items: [
      'Couscous', 'Fusilli', 'Lasagna Noodles', 'Macaroni', 'Orzo',
      'Penne Pasta', 'Spaghetti'
    ]
  },
  flours: {
    title: 'Flours',
    items: [
      'All-purpose Flour', 'Buckwheat Flour', 'Cornmeal', 'Rye Flour',
      'Whole Wheat Flour'
    ]
  },
  legumes: {
    title: 'Legumes',
    items: [
      'Black Beans', 'Brown Lentils', 'Chickpeas', 'Green Lentils',
      'Kidney Beans', 'Mung Beans', 'Navy Beans', 'Pinto Beans',
      'Red Lentils', 'Split Peas'
    ]
  },
  canned: {
    title: 'Canned Goods',
    items: [
      'Canned Salmon in Water', 'Canned Sardines in Water', 'Canned Tuna in Water',
      'Diced Canned Tomatoes', 'Tomato Paste', 'Whole Canned Tomatoes'
    ]
  },
  nuts: {
    title: 'Nuts & Seeds',
    items: [
      'Brazil Nuts', 'Cashews', 'Chia Seeds', 'Flaxseeds', 'Hazelnuts',
      'Hemp Seeds', 'Macadamia Nuts', 'Peanuts', 'Pine Nuts', 'Pistachios',
      'Poppy Seeds', 'Pumpkin Seeds', 'Sesame Seeds', 'Slivered Almonds',
      'Sunflower Seeds', 'Walnuts', 'Whole Almonds'
    ]
  },
  frozen_vegetables: {
    title: 'Frozen Vegetables',
    items: [
      'Frozen Asparagus', 'Frozen Broccoli', 'Frozen Brussels Sprouts',
      'Frozen Cauliflower', 'Frozen Corn', 'Frozen Edamame', 'Frozen Green Beans',
      'Frozen Kale', 'Frozen Peas', 'Frozen Spinach'
    ]
  },
  frozen_fruits: {
    title: 'Frozen Fruits',
    items: [
      'Frozen Blackberries', 'Frozen Blueberries', 'Frozen Cherries',
      'Frozen Mango', 'Frozen Peaches', 'Frozen Pineapple',
      'Frozen Raspberries', 'Frozen Strawberries'
    ]
  },
  bakery: {
    title: 'Bakery',
    items: [
      'Rye Bread', 'Sourdough Bread', 'Whole Wheat Bread'
    ]
  }
};

const AddToPantry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleComplete = (selections) => {
    // Add all selected items to pantry
    Object.entries(selections).forEach(([category, items]) => {
      items.forEach(item => {
        dispatch(addToPantry({
          food: {
            id: item.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
            name: item,
            category: PANTRY_CATEGORIES[category].title,
            unit: 'unit'
          },
          amount: 1
        }));
      });
    });
    navigate('/pantry');
  };

  return (
    <Selector
      categories={PANTRY_CATEGORIES}
      onComplete={handleComplete}
      onBack={() => navigate('/pantry')}
      title="Add Items to Pantry"
      completeButtonText="Add to Pantry"
    />
  );
};

export default AddToPantry; 