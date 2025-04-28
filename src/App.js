import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import GroceryBuilder from './pages/GroceryBuilder';
import FoodSurvey from './pages/FoodSurvey';
import RecipeBuilder from './pages/RecipeBuilder';
import RecipeGenerator from './pages/RecipeGenerator';
import PantryManager from './pages/PantryManager';
import KitchenAppliances from './components/KitchenAppliances';
import WeeklyCalendar from './pages/WeeklyCalendar';
import SpiceCabinetBuilder from './pages/SpiceCabinetBuilder';
import GroceryList from './pages/GroceryList';
import AddToPantry from './pages/AddToPantry';
import AddToShoppingList from './pages/AddToShoppingList';
import AddSpicesToList from './pages/AddSpicesToList';
import TabbedRecipeGenerator from './components/TabbedRecipeGenerator';
import Register from './pages/Register';
import ErrorBoundary from './components/ErrorBoundary';
import LifestyleSurvey from './components/LifestyleSurvey';
import './App.css';
import './components/ErrorBoundary/styles.css';
import { queryClient } from './utils/queryClient';
import { AuthProvider } from './utils/authContext';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
// Create a client


function App() {
  const persister = createSyncStoragePersister({
    storage: window.localStorage,
    maxSize: 1 * 1024 * 1024, // 5MB limit
  });



  return (
    <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{
      persister,
      keyFilter: (query) => query.queryKey[0] === 'foods', // Persist only ['foods']
    }}
  >
      <AuthProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="grocery-builder" element={<GroceryBuilder />} />
              <Route path="food-survey" element={<FoodSurvey />} />
              <Route path="recipe-builder" element={<RecipeBuilder />} />
              <Route path="recipe-generator" element={<TabbedRecipeGenerator />} />
              <Route path="pantry" element={<PantryManager />} />
              <Route path="kitchen-appliances" element={<KitchenAppliances />} />
              <Route path="lifestyle-survey" element={<LifestyleSurvey />} />
              <Route path="weekly-calendar" element={<WeeklyCalendar />} />
              <Route path="spice-cabinet-builder" element={<SpiceCabinetBuilder />} />
              <Route path="grocery-list" element={<GroceryList />} />
              <Route path="add-to-pantry" element={<AddToPantry />} />
              <Route path="add-to-shopping-list" element={<AddToShoppingList />} />
              <Route path="add-spices-to-list" element={<AddSpicesToList />} />
              <Route path="register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
      </AuthProvider>
    </PersistQueryClientProvider>
  );
}

export default App;