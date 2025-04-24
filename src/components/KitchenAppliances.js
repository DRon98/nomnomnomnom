import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaBlender, FaUtensils, FaFire, FaCoffee } from 'react-icons/fa';
import { toggleAppliance, toggleCategory, addApplianceToDelete } from '../store/kitchenAppliancesSlice';
import './KitchenAppliances.css';
import { useUserAppliances } from '../hooks/useAppliances';
import { getCurrentUserId } from '../utils/auth';
import { ERROR_MESSAGES } from '../constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applianceService } from '../utils/applianceService';

const APPLIANCE_CATEGORIES = {
  basics: {
    icon: <FaUtensils />,
    title: 'Basic Equipment',
    items: [
      'Cutting Board',
      'Chef\'s Knife',
      'Measuring Cups',
      'Measuring Spoons',
      'Mixing Bowls',
      'Colander',
      'Can Opener',
      'Tongs',
      'Peeler',
      'Whisk'
    ]
  },
  cooking: {
    icon: <FaFire />,
    title: 'Cooking',
    items: [
      'Stovetop',
      'Oven',
      'Microwave',
      'Air Fryer',
      'Slow Cooker',
      'Pressure Cooker',
      'Rice Cooker',
      'Toaster Oven',
      'Grill'
    ]
  },
  prep: {
    icon: <FaBlender />,
    title: 'Prep & Processing',
    items: [
      'Food Processor',
      'Blender',
      'Stand Mixer',
      'Hand Mixer',
      'Immersion Blender',
      'Food Scale',
      'Box Grater'
    ]
  },
  specialty: {
    icon: <FaCoffee />,
    title: 'Specialty',
    items: [
      'Coffee Maker',
      'Electric Kettle',
      'Waffle Maker',
      'Ice Cream Maker',
      'Dehydrator',
      'Sous Vide',
      'Deep Fryer',
      'Espresso Machine'
    ]
  }
};

const KitchenAppliances = () => {
  const dispatch = useDispatch();
  const selectedAppliances = useSelector(state => state.kitchenAppliances.selectedAppliances);
  const [userId, setUserId] = useState(null);
  const appliancesToDelete = useSelector(state => state.kitchenAppliances.appliancesToDelete);
  const [existingAppliances, setExistingAppliances] = useState([]); // Store appliances from GET
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getCurrentUserId();
      setUserId(id);
    };
    fetchUserId();
  }, []);

  const { data: userAppliances, isLoading, error } = useUserAppliances(userId);

  useEffect(() => {
    if (userAppliances) {
      // Group appliances by category
      const appliancesByCategory = userAppliances.reduce((acc, appliance) => {
        const category = appliance.category.toLowerCase();
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(appliance.name.toLowerCase());
        return acc;
      }, {});

      // Update Redux state with existing appliances
      Object.entries(appliancesByCategory).forEach(([category, appliances]) => {
        appliances.forEach(appliance => {
          dispatch(toggleAppliance({ appliance, category }));
        });
      });
    }
  }, [userAppliances, dispatch]);

  useEffect(() => {
    console.log('User Appliances:', userAppliances);
  }, [userAppliances]);

  const handleToggleAppliance = (appliance, category) => {
    // If the appliance was previously selected (exists in userAppliances)
    const existingAppliance = userAppliances?.find(
      a => a.name.toLowerCase() === appliance.toLowerCase() && a.category.toLowerCase() === category.toLowerCase()
    );

    if (existingAppliance && isApplianceSelected(appliance, category)) {
      // If unselecting an existing appliance, add to appliancesToDelete
      dispatch(addApplianceToDelete(existingAppliance.id));
    }

    dispatch(toggleAppliance({ appliance: appliance.toLowerCase(), category }));
  };

  const handleToggleCategory = (category) => {
    dispatch(toggleCategory({
      category,
      items: APPLIANCE_CATEGORIES[category].items.map(item => item.toLowerCase())
    }));
  };


   // React Query mutation for updating appliances
   const updateAppliancesMutation = useMutation({
    mutationFn: (updateData) => applianceService.updateAppliances(userId, updateData),
    onMutate: async (updateData) => {
      // Optimistic update: Cancel ongoing queries and update cache
      await queryClient.cancelQueries(['appliances', userId]);

      const previousAppliances = queryClient.getQueryData(['appliances', userId]);

      // Update cache optimistically
      queryClient.setQueryData(['appliances', userId], (old) => {
        // Remove deleted appliances
        let updatedAppliances = old
          ? old.filter((appliance) => !updateData.appliance_ids_to_delete.includes(appliance.id))
          : [];
        // Add new appliances
        const newAppliances = updateData.appliances_to_add.map((appliance, index) => ({
          id: `temp-id-${Date.now()}-${index}`, // Temporary ID
          user_id: userId,
          name: appliance.name,
          category: appliance.category,
          is_owned: appliance.is_owned,
          created_at: new Date().toISOString(),
        }));
        return [...updatedAppliances, ...newAppliances];
      });

      // Clear error message
      setErrorMessage(null);

      return { previousAppliances };
    },
    onError: (err, updateData, context) => {
      // Rollback on error
      queryClient.setQueryData(['appliances', userId], context.previousAppliances);
      setErrorMessage(ERROR_MESSAGES.GENERIC);
      console.error('Error updating appliances:', err);
    },
    onSuccess: () => {
      // Invalidate cache to refetch fresh data
      queryClient.invalidateQueries(['appliances', userId]);
      // Clear error message
      setErrorMessage(null);
    },
  });

 const handleSubmit = () => {
    if (!userId) {
      setErrorMessage('User not authenticated');
      return;
    }

    // Transform selectedAppliances into appliances_to_add
    const appliancesToAdd = Object.keys(selectedAppliances).flatMap((category) =>
      selectedAppliances[category].map((name) => ({
        name,
        category,
        is_owned: true,
      }))
    );

    // Filter out appliances that already exist in userAppliances
    const existingApplianceNames = userAppliances
      ? userAppliances.map((appliance) => appliance.name.toLowerCase())
      : [];
    const newAppliancesToAdd = appliancesToAdd.filter(
      (appliance) => !existingApplianceNames.includes(appliance.name.toLowerCase())
    );

    // Get appliances to delete from Redux state
    const applianceIdsToDelete = appliancesToDelete;

    // Prepare payload
    const updateData = {
      appliances_to_add: newAppliancesToAdd,
      appliance_ids_to_delete: applianceIdsToDelete,
    };

    console.log('Update Data:', updateData);
    // Trigger mutation
    updateAppliancesMutation.mutate(updateData);
  };

  const isApplianceSelected = (appliance, category) => {
    return selectedAppliances[category].includes(appliance.toLowerCase());
  };

  const isCategoryFullySelected = (category) => {
    const items = APPLIANCE_CATEGORIES[category].items.map(item => item.toLowerCase());
    return items.every(item => selectedAppliances[category].includes(item));
  };

  const hasSelectedAppliances = Object.values(selectedAppliances).some(category => category.length > 0);

  return (
    <div className="kitchen-appliances">
      <h2>My Kitchen Appliances</h2>
      <div className="appliance-categories">
        {Object.entries(APPLIANCE_CATEGORIES).map(([key, category]) => (
          <div key={key} className="category-section">
            <div className="category-header">
              <div className="category-title">
                {category.icon}
                <h3>{category.title}</h3>
              </div>
              <button
                className={`select-all-btn ${
                  isCategoryFullySelected(key) ? 'all-selected' : ''
                }`}
                onClick={() => handleToggleCategory(key)}
              >
                {isCategoryFullySelected(key) ? 'Remove All' : 'Select All'}
              </button>
            </div>
            <div className="appliance-bubbles">
              {category.items.map(item => (
                <button
                  key={item}
                  className={`appliance-bubble ${
                    isApplianceSelected(item, key) ? 'selected' : ''
                  }`}
                  onClick={() => handleToggleAppliance(item, key)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button 
        className="submit-button"
        onClick={handleSubmit}
        disabled={!hasSelectedAppliances || updateAppliancesMutation.isLoading}
      >
        {updateAppliancesMutation.isLoading ? 'Submitting...' : 'Submit Kitchen Appliances'}
      </button>
    </div>
  );
};

export default KitchenAppliances; 