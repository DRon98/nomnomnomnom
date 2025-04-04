import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format, subDays } from 'date-fns';
import { FOOD_CONSUMPTION_LEVELS } from '../../../constants';
import { useFoodSelection } from '../../../hooks/useFoodSelection';
import { addJournalEntry } from '../../../store/actions/journalActions';
import { selectPersonalizedTip } from '../../../store/selectors/userSelectors';
import { selectFoods } from '../../../store/selectors/foodSelectors';
import FoodJournalPresentation from '../components/FoodJournalPresentation';

/**
 * Container component that handles the logic and state for the food journal
 * @returns {JSX.Element} Food journal container component
 */
const FoodJournalContainer = () => {
  const dispatch = useDispatch();
  const foods = useSelector(selectFoods);
  const personalizedTip = useSelector(selectPersonalizedTip);
  
  // Local state
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [searchTerm, setSearchTerm] = useState('');
  const [journalData, setJournalData] = useState({
    recommendedFoodConsumption: null,
    otherFoodsEaten: null,
    ateSuggestedTimes: null,
    followedTip: null,
    message: '',
  });

  // Food selection hook
  const {
    selectedFoods,
    toggleFood,
    clearSelection,
    isSelected
  } = useFoodSelection([], (foods) => {
    console.log('Selected foods changed:', foods);
  });

  // Memoized values
  const pastWeekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => 
      format(subDays(new Date(), i), 'yyyy-MM-dd')
    );
  }, []);

  const filteredFoods = useMemo(() => {
    if (!searchTerm.trim()) return foods;
    return foods.filter(food => 
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [foods, searchTerm]);

  // Callbacks
  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setStep(0);
      clearSelection();
      setJournalData({
        recommendedFoodConsumption: null,
        otherFoodsEaten: null,
        ateSuggestedTimes: null,
        followedTip: null,
        message: '',
      });
    }
  }, [isOpen, clearSelection]);

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
  }, []);

  const formatDate = useCallback((date) => {
    return format(new Date(date), 'MMMM d, yyyy');
  }, []);

  const handleConsumptionSelect = useCallback((level) => {
    setJournalData(prev => ({
      ...prev,
      recommendedFoodConsumption: level
    }));
    setStep(level === FOOD_CONSUMPTION_LEVELS.NONE ? 0.5 : 1);
  }, []);

  const handleOtherFoodsResponse = useCallback((response) => {
    setJournalData(prev => ({
      ...prev,
      otherFoodsEaten: response === 'yes'
    }));
    setStep(response === 'yes' ? 2.5 : 1);
  }, []);

  const handleMealTimesResponse = useCallback((response) => {
    if (typeof response === 'string') {
      setJournalData(prev => ({
        ...prev,
        ateSuggestedTimes: response === 'yes'
      }));
    }
    setStep(2);
  }, []);

  const handleTipResponse = useCallback((response) => {
    setJournalData(prev => ({
      ...prev,
      followedTip: response === 'yes',
      message: response === 'yes' 
        ? 'Great job following your eating tip!' 
        : 'Keep working on following your eating tips for better results.'
    }));
    setStep(3);
  }, []);

  const handleSubmit = useCallback(() => {
    dispatch(addJournalEntry({
      date: selectedDate,
      ...journalData,
      selectedFoods: selectedFoods
    }));
    setIsOpen(false);
    setStep(0);
    clearSelection();
  }, [dispatch, selectedDate, journalData, selectedFoods, clearSelection]);

  return (
    <FoodJournalPresentation
      isOpen={isOpen}
      onToggle={handleToggle}
      selectedDate={selectedDate}
      onDateChange={handleDateChange}
      pastWeekDates={pastWeekDates}
      formatDate={formatDate}
      step={step}
      journalData={journalData}
      onConsumptionSelect={handleConsumptionSelect}
      onFoodSelect={toggleFood}
      onOtherFoodsResponse={handleOtherFoodsResponse}
      onMealTimesResponse={handleMealTimesResponse}
      onTipResponse={handleTipResponse}
      onSubmit={handleSubmit}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      filteredFoods={filteredFoods}
      selectedFoods={selectedFoods}
      personalizedTip={personalizedTip}
    />
  );
};

export default FoodJournalContainer; 