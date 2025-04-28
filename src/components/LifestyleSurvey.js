import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleResponse } from '../store/lifestyleSlice';
import './LifestyleSurvey.css';
import { useLifestyle } from '../hooks/useLifestyle';
import BaseSurvey from './BaseSurvey';
import { getCurrentUserId } from '../utils/auth';

const LIFESTYLE_CATEGORIES = {
  activeCompetitive: {
    title: 'Active & Competitive Lifestyles',
    subcategories: {
      HighIntensity: 'High-Intensity Competitive Sports: Team or individual sports with intense physical demands and competition, like soccer or boxing.',
      Endurance: 'Endurance Sports: Activities focused on stamina and long-distance effort, such as running or triathlon.',
      WinterSports: 'Winter Sports/Activities: Seasonal sports or recreation in cold environments, like skiing or ice hockey.'
    }
  },
  fitnessSkill: {
    title: 'Fitness & Skill Development',
    subcategories: {
      StrengthTraining: 'Individual Strength Training: Exercises to build muscle and power, like weightlifting or powerlifting.',
      Cardio: 'Individual Cardio: Solo activities to boost heart health and endurance, such as running or cycling.',
      SkillPerformance: 'Skill-Based Performance Activities: Tasks requiring coordination and artistry, like dance or gymnastics.'
    }
  },
  outdoorRelaxation: {
    title: 'Outdoor & Relaxation Pursuits',
    subcategories: {
      OutdoorActivities: 'Outdoor Activities: Nature-based recreation or adventure, such as hiking or kayaking.',
      Relaxation: 'Relaxation-Based Activities: Calming practices for recovery or stress relief, like foam rolling or fishing.',
      Mindfulness: 'Mindfulness: Focused mental exercises for clarity and peace, such as meditation or yoga.'
    }
  },
  socialProfessional: {
    title: 'Social & Professional Engagement',
    subcategories: {
      RomanticSocializing: 'Romantic Socializing: Activities to bond with a partner, like date nights or shared hobbies.',
      Networking: 'Networking & Professional Socializing: Career-focused interactions, such as conferences or happy hours.',
      CommunicationWork: 'Communication-Based Work: Jobs or tasks relying on interpersonal exchange, like public speaking or teaching.',
      Gaming: 'Gaming: Interactive play with others, often online, such as multiplayer video games.'
    }
  },
  dailyCognitive: {
    title: 'Daily Life & Cognitive Work',
    subcategories: {
      ParentalDuties: 'Parental Duties: Caregiving responsibilities for kids, like parenting or stroller walking.',
      EverydayTasks: 'Everyday Tasks: Routine chores or duties, such as cooking or cleaning.',
      StrategicThinking: 'Strategic Thinking: Planning and decision-making tasks, like coaching or operations work.',
      AnalyticalWork: 'Analytical and Problem-Based Work: Intellectual efforts to solve complex issues, such as coding or research.',
      CommunicationWork: 'Communication-Based Work: Repeated here if distinct in context, like managing teams or client calls.',
      Relaxation: 'Relaxation-Based Activities: Repeated here if tied to daily routine, like gardening for calm.'
    }
  }
};

const LifestyleSurvey = () => {
  const dispatch = useDispatch();
  const responses = useSelector(state => state.lifestyle.responses);
  const [userId, setUserId] = useState(null);

  const { data: lifestyleData, isLoading, error, updateLifestyle, isUpdating, updateError } = useLifestyle(userId);

  // Transform API data to match Redux state format
  const transformApiDataToReduxFormat = (apiData) => {
    if (!apiData) return {};
    
    return {
      activeCompetitive: apiData.active_competitive || [],
      fitnessSkill: apiData.fitness_skill || [],
      outdoorRelaxation: apiData.outdoor_relaxation || [],
      socialProfessional: apiData.social_professional || [],
      dailyCognitive: apiData.daily_cognitive || []
    };
  };

  // Initialize Redux state with API data when it's loaded
  useEffect(() => {
    if (lifestyleData) {
      const transformedData = transformApiDataToReduxFormat(lifestyleData);
      // Initialize each category with the API data
      Object.entries(transformedData).forEach(([category, items]) => {
        items.forEach(item => {
          dispatch(toggleResponse({ category, subcategory: item }));
        });
      });
    }
  }, [lifestyleData, dispatch]);

  const handleToggle = (category, subcategory) => {
    dispatch(toggleResponse({ category, subcategory }));
  };

  const handleSubmit = () => {
    if (!userId) {
      console.error('No user ID available');
      return;
    }

    // Transform the responses into the format expected by the API
    const lifestyleData = {
      active_competitive: responses.activeCompetitive || [],
      fitness_skill: responses.fitnessSkill || [],
      outdoor_relaxation: responses.outdoorRelaxation || [],
      social_professional: responses.socialProfessional || [],
      daily_cognitive: responses.dailyCognitive || []
    };

    console.log('Submitting lifestyle data:', lifestyleData);
    updateLifestyle(lifestyleData);
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getCurrentUserId();
      setUserId(id);
    };
    fetchUserId();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <BaseSurvey
      title="Lifestyle Survey"
      categories={LIFESTYLE_CATEGORIES}
      responses={responses}
      onToggle={handleToggle}
      onSubmit={handleSubmit}
      isSubmitting={isUpdating}
      submitError={updateError}
      initialData={transformApiDataToReduxFormat(lifestyleData)}
    />
  );
};

export default LifestyleSurvey; 