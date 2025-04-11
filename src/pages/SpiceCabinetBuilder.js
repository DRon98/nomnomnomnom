import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToPantry } from '../store/inventorySlice';
import Selector from '../components/SpiceSelector';

export const SPICE_CATEGORIES = {
  spices: {
    title: 'Spices',
    items: [
      'Allspice', 'Anise', 'Black Pepper', 'Caraway', 'Cardamom (Green, Black)',
      'Cayenne', 'Celery Seed', 'Chili Peppers', 'Cinnamon', 'Cloves',
      'Coriander', 'Cumin', 'Dill Seed', 'Fennel Seed', 'Fenugreek',
      'Galangal (dried)', 'Ginger (dried/ground)', 'Grains of Paradise',
      'Juniper Berries', 'Mace', 'Mustard Seeds (Yellow, Brown, Black)',
      'Nigella Seeds', 'Nutmeg', 'Paprika (Sweet, Smoked, Hot)', 'Poppy Seeds',
      'Saffron', 'Sesame Seeds', 'Star Anise', 'Sumac', 'Turmeric', 'White Pepper'
    ]
  },
  herbs: {
    title: 'Herbs',
    items: [
      'Basil', 'Bay Leaf', 'Chervil', 'Chives', 'Cilantro', 'Dill', 'Epazote',
      'Fennel Fronds', 'Lavender', 'Lemon Balm', 'Lemongrass (dried)', 'Lovage',
      'Marjoram', 'Mint', 'Oregano', 'Parsley', 'Rosemary', 'Sage', 'Savory',
      'Sorrel', 'Tarragon', 'Thyme', 'Watercress (dried)'
    ]
  },
  salts: {
    title: 'Salts',
    items: [
      'Table Salt', 'Sea Salt', 'Kosher Salt', 'Himalayan Pink Salt', 'Black Salt',
      'Smoked Salt', 'Celtic Salt', 'Flake Salt', 'Red Alaea Salt', 'Black Lava Salt'
    ]
  },
  condiments: {
    title: 'Condiments and Fermented Seasonings',
    items: [
      'Soy Sauce', 'Fish Sauce', 'Oyster Sauce', 'Miso (White, Red, Yellow)',
      'Vinegar', 'Gochujang', 'Harissa', 'Sriracha', 'Sambal Oelek', 'Mustard',
      'Worcestershire Sauce', 'Hoisin Sauce', 'Tamari', 'Ponzu', 'Doenjang',
      'Black Bean Sauce', 'Shrimp Paste', 'Yuzu Kosho', 'Tahini (sesame paste)',
      'Chili Oil'
    ]
  },
  enhancers: {
    title: 'Other Flavor Enhancers',
    items: [
      'Garlic (dried/powdered)', 'Onion (dried/powdered)', 'Shallot (dried)',
      'Monosodium Glutamate (MSG)', 'Dried Mushrooms', 'Asafoetida', 'Tamarind',
      'Anchovy Paste', 'Dried Seaweed', 'Bonito Flakes', 'Nutritional Yeast',
      'Lemon Peel (dried)', 'Orange Peel (dried)', 'Amchur', 'Kokum',
      'Truffle Powder', 'Wasabi Powder', 'Sichuan Peppercorns', 'Dashi Powder',
      'Fermented Black Beans'
    ]
  },
  blends: {
    title: 'Regional Seasoning Blends',
    items: [
      'Garam Masala', 'Ras el Hanout', 'Za\'atar', 'Chinese Five-Spice', 'Adobo',
      'Jerk Seasoning', 'Herbes de Provence', 'Berbere', 'Shichimi Togarashi',
      'Baharat', 'Chaat Masala', 'Tandoori Masala', 'Creole Seasoning', 'Old Bay',
      'Tajín', 'Furikake', 'Dukkah', 'Advieh', 'Quatre Épices', 'Panch Phoran',
      'Sazón', 'Recado Rojo', 'Chimichurri (dried)', 'Hawayej', 'Gomasio'
    ]
  }
};

const SpiceCabinetBuilder = () => {
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
            category: 'Spices & Seasonings',
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
      categories={SPICE_CATEGORIES}
      onComplete={handleComplete}
      onBack={() => navigate('/pantry')}
      title="Build Your Spice Cabinet"
      completeButtonText="Add to Pantry"
    />
  );
};

export default SpiceCabinetBuilder; 