// DashboardScreen.js - Main container component
import React, { useState, useEffect, useMemo } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useScreen } from '../../App';
import WeightScreen from '../Weight/WeightScreen';

// Import components
import DashboardHeader from './components/DashboardHeader';
import UserInfoCard from './components/UserInfoCard';
import DashboardTitle from './components/DashboardTitle';
import DashboardGrid from './components/DashboardGrid';

// Import styles
import { dashboardMainStyles } from './styles/DashboardMainStyles';

// Import data
import { createDashboardItems, CARD_TYPES } from './data/dashboardData';

const DashBoardScreen = () => {
  const { navigateToStart, userCode } = useScreen();
  const db = useSQLiteContext();
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [latestWeight, setLatestWeight] = useState(null);

  useEffect(() => {
    loadUserData();
    loadLatestWeight();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await db.getFirstAsync(`SELECT * FROM users WHERE code = ?`, [userCode]);
      setUser(userData);
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const loadLatestWeight = async () => {
    try {
      const userData = await db.getFirstAsync(`SELECT * FROM users WHERE code = ?`, [userCode]);
      if (userData) {
        const weightRecord = await db.getFirstAsync(
          `SELECT weight FROM weight_records WHERE userId = ? ORDER BY recordedAt DESC LIMIT 1`,
          [userData.id]
        );
        setLatestWeight(weightRecord?.weight || null);
      }
    } catch (error) {
      console.log('Error loading latest weight:', error);
    }
  };

  const handleCardPress = (item) => {
    switch (item.id) {
      case CARD_TYPES.WEIGHT:
        setCurrentScreen('weight');
        break;
      case CARD_TYPES.ACTIVITY:
        alert('Activity screen coming soon!');
        break;
      case CARD_TYPES.CALORIES:
        alert('Calories screen coming soon!');
        break;
      case CARD_TYPES.BLOOD_PRESSURE:
        alert('Blood Pressure screen coming soon!');
        break;
      default:
        console.log(`Navigate to ${item.screen}`);
    }
  };

  const handleLogout = () => {
    navigateToStart();
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
    // Reload latest weight when returning from weight screen
    loadLatestWeight();
  };

  // Create dynamic dashboard items with latest weight
  const dashboardItems = useMemo(() => 
    createDashboardItems(latestWeight), 
    [latestWeight]
  );

  // Render different screens based on currentScreen state
  if (currentScreen === 'weight') {
    return <WeightScreen onBack={handleBackToDashboard} />;
  }

  return (
    <SafeAreaView style={dashboardMainStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" translucent={false} />
      
      {/* Header Component */}
      <DashboardHeader 
        user={user} 
        onLogout={handleLogout} 
      />

      {/* User Info Card Component */}
      <UserInfoCard user={user} />

      {/* Dashboard Title Component */}
      <DashboardTitle />

      {/* Dashboard Grid Component */}
      <DashboardGrid 
        dashboardItems={dashboardItems}
        onCardPress={handleCardPress}
      />
    </SafeAreaView>
  );
};

export default DashBoardScreen;