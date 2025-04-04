import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import GroceryBuilder from './pages/GroceryBuilder';
import FoodSurvey from './pages/FoodSurvey';
import RecipeBuilder from './pages/RecipeBuilder';
import RecipeGenerator from './pages/RecipeGenerator';
import PantryManager from './pages/PantryManager';
import KitchenAppliances from './components/KitchenAppliances';
import FoodJournal from './pages/FoodJournal';
import ErrorBoundary from './components/ErrorBoundary';
import LifestyleSurvey from './components/LifestyleSurvey';
import './App.css';
import './components/ErrorBoundary/styles.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="grocery-builder" element={<GroceryBuilder />} />
            <Route path="food-survey" element={<FoodSurvey />} />
            <Route path="recipe-builder" element={<RecipeBuilder />} />
            <Route path="recipe-generator" element={<RecipeGenerator />} />
            <Route path="pantry" element={<PantryManager />} />
            <Route path="kitchen-appliances" element={<KitchenAppliances />} />
            <Route path="food-journal" element={<FoodJournal />} />
            <Route path="lifestyle-survey" element={<LifestyleSurvey />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;