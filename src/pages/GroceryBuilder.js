import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DUMMY_FOODS } from '../utils/constants';
import './GroceryBuilder.css';

const GroceryBuilder = () => {
  const groceryItems = useSelector(state => state.inventory.groceries);
  
  // Form state
  const [breakfastCount, setBreakfastCount] = useState(7);
  const [lunchCount, setLunchCount] = useState(5);
  const [dinnerCount, setDinnerCount] = useState(7);
  const [brunchCount, setBrunchCount] = useState(2);
  const [eatOutCount, setEatOutCount] = useState(0);
  const [macroProfile, setMacroProfile] = useState('balanced');
  const [fruitVeggieServings, setFruitVeggieServings] = useState(5);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [generatedList, setGeneratedList] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  // Calculate total weekly values
  const totalMeals = Number(breakfastCount) + Number(lunchCount) + Number(dinnerCount) + Number(brunchCount);
  const homeCooked = totalMeals - Number(eatOutCount);
  const totalCalories = calorieGoal * 7;
  const fruitVeggieTotal = fruitVeggieServings * 7;

  // Macro nutrient breakdown based on selected profile
  const [macros, setMacros] = useState({
    carbs: { percent: 40, grams: 200, calories: 800 },
    protein: { percent: 30, grams: 150, calories: 600 },
    fats: { percent: 30, grams: 67, calories: 600 }
  });

  // Update macros when profile or calorie goal changes
  useEffect(() => {
    let carbPercent, proteinPercent, fatPercent;
    
    switch(macroProfile) {
      case 'highProtein':
        carbPercent = 30;
        proteinPercent = 40;
        fatPercent = 30;
        break;
      case 'lowCarb':
        carbPercent = 20;
        proteinPercent = 40;
        fatPercent = 40;
        break;
      case 'keto':
        carbPercent = 10;
        proteinPercent = 30;
        fatPercent = 60;
        break;
      case 'highCarb':
        carbPercent = 60;
        proteinPercent = 15;
        fatPercent = 25;
        break;
      case 'mediterranean':
        carbPercent = 50;
        proteinPercent = 20;
        fatPercent = 30;
        break;
      default: // balanced
        carbPercent = 40;
        proteinPercent = 30;
        fatPercent = 30;
    }
    
    const dailyCalories = calorieGoal;
    const carbCalories = dailyCalories * (carbPercent / 100);
    const proteinCalories = dailyCalories * (proteinPercent / 100);
    const fatCalories = dailyCalories * (fatPercent / 100);
    
    setMacros({
      carbs: {
        percent: carbPercent,
        grams: Math.round(carbCalories / 4), // 4 calories per gram
        calories: Math.round(carbCalories)
      },
      protein: {
        percent: proteinPercent,
        grams: Math.round(proteinCalories / 4), // 4 calories per protein
        calories: Math.round(proteinCalories)
      },
      fats: {
        percent: fatPercent,
        grams: Math.round(fatCalories / 9), // 9 calories per gram
        calories: Math.round(fatCalories)
      }
    });
  }, [macroProfile, calorieGoal]);

  // Calculate weekly nutritional needs
  const calculateWeeklyNeeds = () => {
    // Total daily macro needs in grams
    const dailyCarbsGrams = macros.carbs.grams;
    const dailyProteinGrams = macros.protein.grams;
    const dailyFatGrams = macros.fats.grams;
    
    // Weekly needs (accounting for eating out)
    const homeCookedRatio = homeCooked / totalMeals;
    
    return {
      carbsGrams: Math.round(dailyCarbsGrams * 7 * homeCookedRatio),
      proteinGrams: Math.round(dailyProteinGrams * 7 * homeCookedRatio),
      fatGrams: Math.round(dailyFatGrams * 7 * homeCookedRatio),
      totalCalories: Math.round(calorieGoal * 7 * homeCookedRatio)
    };
  };

  // Generate grocery list based on settings and shopping list items
  const handleGenerateList = () => {
    if (groceryItems.length === 0) {
      alert('Your shopping list is empty. Add items to generate a grocery list.');
      return;
    }

    const weeklyNeeds = calculateWeeklyNeeds();
    
    // Copy grocery items and add nutritional values and serving estimates
    const items = groceryItems.map(item => {
      // Find matching DUMMY_FOOD if available for nutritional data
      const foodMatch = DUMMY_FOODS.find(f => 
        f.name.toLowerCase() === item.food.name.toLowerCase() || 
        item.food.name.toLowerCase().includes(f.name.toLowerCase())
      );
      
      let calories, protein, carbs, fats, servingSize, servingsPerMeal;
      
      if (foodMatch) {
        calories = foodMatch.calories;
        protein = foodMatch.protein;
        carbs = foodMatch.carbs;
        fats = foodMatch.fats;
        servingSize = foodMatch.servingSize;
        servingsPerMeal = foodMatch.servingsPerMeal;
      } else {
        // Use random values if no match found
        calories = Math.round(Math.random() * 150) + 50;
        protein = Math.round(Math.random() * 10) + 2;
        carbs = Math.round(Math.random() * 20) + 5;
        fats = Math.round(Math.random() * 8) + 1;
        servingSize = "1 serving";
        servingsPerMeal = 1;
      }
      
      // Calculate servings based on macronutrient needs
      let requiredServings;
      
      // Determine if this food is primarily carbs, protein, or fat
      const primaryMacro = determinePrimaryMacro(carbs, protein, fats);
      
      if (primaryMacro === 'carbs') {
        requiredServings = calculateServings(carbs, weeklyNeeds.carbsGrams, 30);
      } else if (primaryMacro === 'protein') {
        requiredServings = calculateServings(protein, weeklyNeeds.proteinGrams, 40);
      } else { // fat
        requiredServings = calculateServings(fats, weeklyNeeds.fatGrams, 25);
      }
      
      // Calculate required quantity (amount to buy)
      // Min amount is the current quantity in the list
      const quantity = Math.max(
        item.amount, 
        Math.ceil(requiredServings * servingsPerMeal)
      );
      
      // Estimated servings this will provide
      const estimatedServings = Math.round(quantity / servingsPerMeal);
      
      return {
        ...item,
        calories,
        protein,
        carbs,
        fats,
        servingSize,
        servingsPerMeal,
        primaryMacro,
        quantity,
        estimatedServings,
        totalCalories: calories * estimatedServings,
        totalProtein: protein * estimatedServings,
        totalCarbs: carbs * estimatedServings,
        totalFats: fats * estimatedServings
      };
    });

    setGeneratedList(items);
  };

  // Determine if an item is primarily carbs, protein, or fat
  const determinePrimaryMacro = (carbs, protein, fats) => {
    const carbCals = carbs * 4;
    const proteinCals = protein * 4;
    const fatCals = fats * 9;
    
    if (carbCals > proteinCals && carbCals > fatCals) {
      return 'carbs';
    } else if (proteinCals > carbCals && proteinCals > fatCals) {
      return 'protein';
    } else {
      return 'fats';
    }
  };

  // Calculate required servings based on nutritional needs
  const calculateServings = (gramsPerServing, totalGramsNeeded, contributionPercent) => {
    // How much of the total need this food type should contribute
    const targetGrams = totalGramsNeeded * (contributionPercent / 100);
    
    // How many servings needed to meet the target
    return Math.ceil(targetGrams / Math.max(1, gramsPerServing));
  };

  const handleSaveAsTemplate = () => {
    alert('Grocery list template saved!');
    // In a real app, would save to backend/localStorage
  };

  const filteredItems = activeTab === 'all' 
    ? generatedList 
    : generatedList.filter(item => {
        // Simple categorization based on food properties
        const foodName = item.food.name.toLowerCase();
        
        if (activeTab === 'proteins' && 
            (foodName.includes('chicken') || foodName.includes('beef') || 
             foodName.includes('fish') || foodName.includes('egg') || 
             foodName.includes('yogurt') || foodName.includes('tofu'))) {
          return true;
        }
        
        if (activeTab === 'produce' && 
            (foodName.includes('apple') || foodName.includes('banana') || 
             foodName.includes('spinach') || foodName.includes('broccoli') || 
             foodName.includes('potato') || foodName.includes('veggie') || 
             foodName.includes('fruit'))) {
          return true;
        }
        
        if (activeTab === 'grains' && 
            (foodName.includes('rice') || foodName.includes('bread') || 
             foodName.includes('pasta') || foodName.includes('cereal') || 
             foodName.includes('oat'))) {
          return true;
        }
        
        if (activeTab === 'other' && 
            !(foodName.includes('chicken') || foodName.includes('beef') || 
              foodName.includes('fish') || foodName.includes('egg') || 
              foodName.includes('yogurt') || foodName.includes('apple') || 
              foodName.includes('banana') || foodName.includes('spinach') || 
              foodName.includes('broccoli') || foodName.includes('rice') || 
              foodName.includes('bread') || foodName.includes('pasta'))) {
          return true;
        }
        
        return false;
      });

  const handleAddItem = (foodId) => {
    // In a real app, this would add the item to the user's shopping list
    alert(`Added ${generatedList.find(i => i.foodId === foodId).food.name} to shopping list`);
  };

  const handleSaveAndOrder = () => {
    alert('Grocery list saved and prepared for ordering!');
    // In a real app, would connect to grocery delivery service
  };

  // Calculate nutritional totals for the grocery list
  const calculateListTotals = () => {
    if (generatedList.length === 0) {
      return {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
      };
    }

    return generatedList.reduce((totals, item) => {
      return {
        calories: totals.calories + (item.totalCalories || 0),
        protein: totals.protein + (item.totalProtein || 0),
        carbs: totals.carbs + (item.totalCarbs || 0),
        fats: totals.fats + (item.totalFats || 0)
      };
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  const listTotals = calculateListTotals();

  return (
    <div className="grocery-builder">
      <h1>Grocery Builder</h1>
      
      <div className="builder-container">
        <div className="customize-section">
          <h2>Customize Your Grocery List</h2>
          
          <div className="meal-counts">
            <h3>How many meals do you wish to consume this week?</h3>
            
            <div className="meal-input">
              <label htmlFor="breakfast-count">Breakfast:</label>
              <input 
                type="number" 
                id="breakfast-count" 
                value={breakfastCount}
                onChange={(e) => setBreakfastCount(e.target.value)}
                min="0"
                max="7"
              />
            </div>
            
            <div className="meal-input">
              <label htmlFor="lunch-count">Lunch:</label>
              <input 
                type="number" 
                id="lunch-count" 
                value={lunchCount}
                onChange={(e) => setLunchCount(e.target.value)}
                min="0"
                max="7"
              />
            </div>
            
            <div className="meal-input">
              <label htmlFor="dinner-count">Dinner:</label>
              <input 
                type="number" 
                id="dinner-count" 
                value={dinnerCount}
                onChange={(e) => setDinnerCount(e.target.value)}
                min="0"
                max="7"
              />
            </div>
            
            <div className="meal-input">
              <label htmlFor="brunch-count">Brunch:</label>
              <input 
                type="number" 
                id="brunch-count" 
                value={brunchCount}
                onChange={(e) => setBrunchCount(e.target.value)}
                min="0"
                max="7"
              />
            </div>
            
            <div className="meal-input">
              <label htmlFor="eat-out-count">Eating Out:</label>
              <input 
                type="number" 
                id="eat-out-count" 
                value={eatOutCount}
                onChange={(e) => setEatOutCount(e.target.value)}
                min="0"
                max={totalMeals}
              />
            </div>
          </div>
          
          <div className="profile-section">
            <h3>Select your macronutrient profile goal:</h3>
            <div className="select-wrapper">
              <select 
                value={macroProfile}
                onChange={(e) => setMacroProfile(e.target.value)}
                className="macro-select"
              >
                <option value="balanced">Balanced (40/30/30)</option>
                <option value="highProtein">High Protein (30/40/30)</option>
                <option value="lowCarb">Low Carb (20/40/40)</option>
                <option value="keto">Keto (10/30/60)</option>
                <option value="highCarb">High Carb (60/15/25)</option>
                <option value="mediterranean">Mediterranean (50/20/30)</option>
              </select>
            </div>
          </div>
          
          <div className="servings-section">
            <h3>Daily fruit & vegetable servings target:</h3>
            <div className="select-wrapper">
              <select 
                value={fruitVeggieServings}
                onChange={(e) => setFruitVeggieServings(e.target.value)}
                className="servings-select"
              >
                <option value="3">3 servings</option>
                <option value="4">4 servings</option>
                <option value="5">5 servings</option>
                <option value="6">6 servings</option>
                <option value="7">7 servings</option>
                <option value="8">8 servings</option>
              </select>
            </div>
          </div>
          
          <div className="calorie-section">
            <h3>Daily calorie goal:</h3>
            <div className="select-wrapper">
              <select 
                value={calorieGoal}
                onChange={(e) => setCalorieGoal(Number(e.target.value))}
                className="calorie-select"
              >
                <option value="1500">1500 calories</option>
                <option value="1800">1800 calories</option>
                <option value="2000">2000 calories</option>
                <option value="2200">2200 calories</option>
                <option value="2500">2500 calories</option>
                <option value="3000">3000 calories</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="nutrition-visual">
          <div className="pie-chart">
            <div className="chart-container">
              <div className="pie" style={{'--carbs': `${macros.carbs.percent}%`, '--protein': `${macros.protein.percent}%`, '--fats': `${macros.fats.percent}%`}}></div>
            </div>
            
            <div className="chart-legend">
              <h3>Nutrient Ratio</h3>
              <div className="legend-item">
                <div className="color-box carbs"></div>
                <span>Carbs: {macros.carbs.percent}% ({macros.carbs.grams}g)</span>
              </div>
              <div className="legend-item">
                <div className="color-box protein"></div>
                <span>Protein: {macros.protein.percent}% ({macros.protein.grams}g)</span>
              </div>
              <div className="legend-item">
                <div className="color-box fats"></div>
                <span>Fats: {macros.fats.percent}% ({macros.fats.grams}g)</span>
              </div>
            </div>
          </div>
          
          <div className="weekly-calculations">
            <h3>Weekly Calculations:</h3>
            <ul>
              <li>{totalCalories.toLocaleString()} total calories</li>
              <li>{fruitVeggieTotal} fruit & veggie servings</li>
              <li>{totalMeals} total meals ({homeCooked} home-cooked)</li>
            </ul>
          </div>
          
          <div className="action-buttons">
            <button className="generate-button" onClick={handleGenerateList}>
              Generate Grocery List
            </button>
            <button className="template-button" onClick={handleSaveAsTemplate}>
              Save As Template
            </button>
          </div>
        </div>
      </div>
      
      {generatedList.length > 0 && (
        <div className="grocery-list-section">
          <div className="grocery-list-header">
            <h2>Your Grocery List</h2>
            <div className="search-bar">
              <input type="text" placeholder="Search or filter items..." />
              <button className="search-button">🔍</button>
            </div>
          </div>
          
          <div className="grocery-totals">
            <div className="grocery-totals-header">Nutritional Totals for Week</div>
            <div className="grocery-totals-items">
              <div className="grocery-total-item">
                <span className="total-label">Calories:</span>
                <span className="total-value">{Math.round(listTotals.calories).toLocaleString()}</span>
              </div>
              <div className="grocery-total-item">
                <span className="total-label">Protein:</span>
                <span className="total-value">{Math.round(listTotals.protein)}g</span>
              </div>
              <div className="grocery-total-item">
                <span className="total-label">Carbs:</span>
                <span className="total-value">{Math.round(listTotals.carbs)}g</span>
              </div>
              <div className="grocery-total-item">
                <span className="total-label">Fats:</span>
                <span className="total-value">{Math.round(listTotals.fats)}g</span>
              </div>
            </div>
          </div>
          
          <div className="grocery-tabs">
            <button 
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Items
            </button>
            <button 
              className={`tab ${activeTab === 'proteins' ? 'active' : ''}`}
              onClick={() => setActiveTab('proteins')}
            >
              Proteins
            </button>
            <button 
              className={`tab ${activeTab === 'produce' ? 'active' : ''}`}
              onClick={() => setActiveTab('produce')}
            >
              Produce
            </button>
            <button 
              className={`tab ${activeTab === 'grains' ? 'active' : ''}`}
              onClick={() => setActiveTab('grains')}
            >
              Grains & Staples
            </button>
            <button 
              className={`tab ${activeTab === 'other' ? 'active' : ''}`}
              onClick={() => setActiveTab('other')}
            >
              Other
            </button>
          </div>
          
          <div className="grocery-table">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Amount</th>
                  <th>Serving Size</th>
                  <th>Calories</th>
                  <th>Macros (C/P/F)</th>
                  <th>Category</th>
                  <th>Add</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <tr key={item.foodId}>
                      <td>{item.food.name}</td>
                      <td>
                        <input 
                          type="text" 
                          value={item.quantity || item.amount} 
                          readOnly 
                          className="amount-input"
                        />
                      </td>
                      <td>{item.servingSize || '1 serving'}</td>
                      <td>{item.calories || '—'} per serving</td>
                      <td>
                        {item.carbs || '—'}/{item.protein || '—'}/{item.fats || '—'}g
                      </td>
                      <td>{activeTab === 'all' ? getCategoryFromFood(item.food.name) : activeTab.slice(0, -1)}</td>
                      <td>
                        <button 
                          className="add-button"
                          onClick={() => handleAddItem(item.foodId)}
                        >
                          +
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-items">No items in this category</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="order-button-container">
            <button className="order-button" onClick={handleSaveAndOrder}>
              Save & Order Groceries
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to categorize foods
function getCategoryFromFood(foodName) {
  foodName = foodName.toLowerCase();
  
  if (foodName.includes('chicken') || foodName.includes('beef') || 
      foodName.includes('fish') || foodName.includes('egg') || 
      foodName.includes('yogurt') || foodName.includes('tofu')) {
    return 'Proteins';
  }
  
  if (foodName.includes('apple') || foodName.includes('banana') || 
      foodName.includes('spinach') || foodName.includes('broccoli') || 
      foodName.includes('potato') || foodName.includes('veggie') || 
      foodName.includes('fruit')) {
    return 'Produce';
  }
  
  if (foodName.includes('rice') || foodName.includes('bread') || 
      foodName.includes('pasta') || foodName.includes('cereal') || 
      foodName.includes('oat')) {
    return 'Grains & Staples';
  }
  
  return 'Other';
}

export default GroceryBuilder; 