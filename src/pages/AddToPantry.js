import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToPantry } from '../store/inventorySlice';
import Selector from '../components/Selector';

export const PANTRY_CATEGORIES = {
  fruits: {
    title: 'Fruits',
    items: [
      'Fuji Apples', 'Gala Apples', 'Honeycrisp Apples', 'Granny Smith Apples', 'Apricots', 'Avocados', 'Bananas', 'Blackberries',
      'Blood Oranges', 'Blueberries', 'Cantaloupe', 'Cherries', 'Clementines', 'Cranberries', 'Dates', 'Dragon Fruit', 'Figs',
      'Grapefruit', 'Green Grapes', 'Guava', 'Honeydew', 'Kiwi', 'Kumquats', 'Lemons', 'Limes', 'Mandarin Oranges', 'Mangoes',
      'Navel Oranges', 'Nectarines', 'Papayas', 'Passion Fruit', 'Peaches', 'Pears', 'Persimmons', 'Pineapple', 'Plums',
      'Pomegranates', 'Raspberries', 'Red Grapes', 'Rhubarb', 'Starfruit', 'Strawberries', 'Tangerines', 'Watermelon'
    ]
  },
  vegetables: {
    title: 'Vegetables',
    items: [
      'Acorn Squash', 'Artichokes', 'Arugula', 'Asparagus', 'Bamboo Shoots', 'Beefsteak Tomatoes', 'Beets', 'Bitter Melon', 'Bok Choy',
      'Broccoli', 'Brussels Sprouts', 'Butternut Squash', 'Button Mushrooms', 'Cabbage', 'Carrots', 'Cauliflower', 'Celery', 'Chayote',
      'Cherry Tomatoes', 'Eggplant', 'Collard Greens', 'Corn', 'Cremini Mushrooms', 'Kale', 'Daikon Radish', 'Cucumbers', 'English Peas',
      'Enoki Mushrooms', 'Fennel', 'Garlic', 'Ginger', 'Grape Tomatoes', 'Green Bell Peppers', 'Green Onions', 'Green Beans',
      'Heirloom Tomatoes', 'Iceberg Lettuce', 'Jalapeños', 'Jicama', 'Leeks', 'Mustard Greens', 'Okra', 'Orange Bell Peppers',
      'Oyster Mushrooms', 'Parsnips', 'Portobello Mushrooms', 'Pumpkins', 'Radishes', 'Red Bell Peppers', 'Red Onions', 'Red Potatoes',
      'Roma Tomatoes', 'Romaine Lettuce', 'Russet Potatoes', 'Rutabaga', 'Shallots', 'Shiitake Mushrooms', 'Snap Peas', 'Snow Peas',
      'Spaghetti Squash', 'Spinach', 'Sweet Potatoes', 'Swiss Chard', 'Taro Root', 'Turnips', 'White Onions', 'Yams',
      'Yellow Bell Peppers', 'Yellow Onions', 'Yellow Squash', 'Yukon Gold Potatoes', 'Zucchini'
    ]
  },
  fresh_herbs: {
    title: 'Fresh Herbs',
    items: [
      'Basil', 'Thai Basil', 'Chives', 'Cilantro', 'Dill', 'Lemongrass', 'Mint', 'Oregano', 'Parsley', 'Rosemary', 'Sage',
      'Tarragon', 'Thyme'
    ]
  },
  dairy: {
    title: 'Dairy',
    items: [
      'Salted Butter', 'Unsalted Butter', 'Cheddar Cheese', 'Chicken Eggs', 'Low-fat Cottage Cheese', 'Full-fat Cottage Cheese',
      'Cream Cheese', 'Duck Eggs', 'Feta Cheese', 'Goat Cheese', 'Goat Milk', 'Heavy Cream', 'Fresh Mozzarella Cheese',
      'Shredded Mozzarella Cheese', 'Parmesan Cheese', 'Plain Whole Milk Yogurt', 'Quail Eggs', 'Raw Milk', 'Sheep Milk',
      'Sour Cream', 'Whole Milk', 'Whole Milk Ricotta Cheese'
    ]
  },
  meat: {
    title: 'Meat & Poultry',
    items: [
      'Beef Brisket', 'Beef Chuck Roast', 'Beef Ribeye Steak', 'Beef Sirloin Steak', 'Beef Tenderloin', 'Bone-in Chicken Breast',
      'Bone-in Chicken Thighs', 'Bone-in Pork Chops', 'Boneless Chicken Breast', 'Boneless Chicken Thighs', 'Boneless Pork Chops',
      'Chicken Drumsticks', 'Chicken Wings', 'Cornish Hen', 'Duck Breast', 'Goose', 'Grass-fed Ground Beef', 'Ground Lamb',
      'Ground Pork', 'Ground Turkey', 'Lamb Chops', 'Lamb Leg', 'Lean Ground Beef', 'Pork Belly', 'Pork Shoulder', 'Pork Tenderloin',
      'Quail', 'Turkey Breast', 'Whole Chicken', 'Whole Duck', 'Whole Turkey'
    ]
  },
  seafood: {
    title: 'Seafood',
    items: [
      'Atlantic Salmon', 'Catfish', 'Clams', 'Cod', 'Crab Legs', 'Crawfish', 'Haddock', 'Halibut', 'Lobster Tails', 'Mackerel',
      'Mussels', 'Octopus', 'Oysters', 'Sardines', 'Scallops', 'Farm-raised Shrimp', 'Wild-caught Shrimp', 'Snapper',
      'Sockeye Salmon', 'Squid', 'Tilapia', 'Trout', 'Tuna Steaks', 'Wild-caught Salmon'
    ]
  },
  grains: {
    title: 'Grains & Cereals',
    items: [
      'Amaranth', 'Arborio Rice', 'Barley', 'Basmati Rice', 'Black Quinoa', 'Brown Rice', 'Buckwheat', 'Bulgur', 'Farro',
      'Jasmine Rice', 'Long-grain White Rice', 'Millet', 'Red Quinoa', 'Rolled Oats', 'Short-grain White Rice', 'Steel-cut Oats',
      'White Quinoa', 'Wild Rice'
    ]
  },
  pasta: {
    title: 'Pasta',
    items: [
      'Angel Hair', 'Couscous', 'Farfalle', 'Fettuccine', 'Fusilli', 'Lasagna Noodles', 'Linguine', 'Macaroni', 'Orzo',
      'Penne Pasta', 'Rigatoni', 'Spaghetti', 'Tortellini'
    ]
  },
  flours: {
    title: 'Flours',
    items: [
      'All-purpose Flour', 'Almond Flour', 'Bread Flour', 'Buckwheat Flour', 'Chickpea Flour', 'Cornmeal', 'Rice Flour',
      'Rye Flour', 'Whole Wheat Flour'
    ]
  },
  legumes: {
    title: 'Legumes',
    items: [
      'Adzuki Beans', 'Black Beans', 'Black-eyed Peas', 'Brown Lentils', 'Chickpeas', 'Green Lentils', 'Kidney Beans', 'Mung Beans',
      'Navy Beans', 'Pinto Beans', 'Red Lentils', 'Green Split Peas', 'Yellow Split Peas'
    ]
  },
  canned: {
    title: 'Canned Goods',
    items: [
      'Canned Black Beans', 'Canned Chickpeas', 'Canned Corn', 'Canned Green Beans', 'Canned Kidney Beans', 'Canned Peas',
      'Canned Salmon in Water', 'Canned Sardines in Water', 'Canned Tuna in Water', 'Diced Canned Tomatoes', 'Tomato Paste',
      'Whole Canned Tomatoes'
    ]
  },
  nuts: {
    title: 'Nuts & Seeds',
    items: [
      'Whole Almonds', 'Slivered Almonds', 'Brazil Nuts', 'Cashews', 'Chia Seeds', 'Flaxseeds', 'Hazelnuts', 'Hemp Seeds',
      'Macadamia Nuts', 'Peanuts', 'Pecans', 'Pine Nuts', 'Pistachios', 'Poppy Seeds', 'Pumpkin Seeds', 'Sesame Seeds',
      'Sunflower Seeds', 'Walnuts'
    ]
  },
  frozen_vegetables: {
    title: 'Frozen Vegetables',
    items: [
      'Frozen Asparagus', 'Frozen Broccoli', 'Frozen Brussels Sprouts', 'Frozen Carrots', 'Frozen Cauliflower', 'Frozen Corn',
      'Frozen Edamame', 'Frozen Green Beans', 'Frozen Kale', 'Frozen Peas', 'Frozen Spinach'
    ]
  },
  frozen_fruits: {
    title: 'Frozen Fruits',
    items: [
      'Frozen Blackberries', 'Frozen Blueberries', 'Frozen Cherries', 'Frozen Mango', 'Frozen Peaches', 'Frozen Pineapple',
      'Frozen Raspberries', 'Frozen Strawberries'
    ]
  },
  bakery: {
    title: 'Bakery',
    items: [
      'Bagels', 'Ciabatta', 'Croissants', 'Multigrain Bread', 'Pita Bread', 'Rye Bread', 'Sourdough Bread', 'Corn Tortillas',
      'Flour Tortillas', 'Whole Wheat Bread'
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