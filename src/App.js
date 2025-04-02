import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import GroceryBuilder from './pages/GroceryBuilder';
import FoodSurvey from './pages/FoodSurvey';
import RecipeBuilder from './pages/RecipeBuilder';
import PantryManager from './pages/PantryManager';
import ErrorBoundary from './components/ErrorBoundary';
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
            <Route path="pantry" element={<PantryManager />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;