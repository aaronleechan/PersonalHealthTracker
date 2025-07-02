// DashboardScreen.js - Main container component
import React, { useState, useEffect, useMemo } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useScreen } from '../../App';
import WeightScreen from '../Weight/WeightScreen';
import BloodPressureScreen from '../BloodPressure/BloodPressureScreen';

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
  const [latestBloodPressure, setLatestBloodPressure] = useState(null);

  useEffect(() => {
    loadUserData();
    loadLatestWeight();
    loadLatestBloodPressure();
  }, []);

  console.log(currentScreen);

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

  const loadLatestBloodPressure = async () => {
    try {
      const userData = await db.getFirstAsync(`SELECT * FROM users WHERE code = ?`, [userCode]);
      if (userData) {
        const bpRecord = await db.getFirstAsync(
          `SELECT systolic, diastolic, pulse, recordedAt 
           FROM blood_pressure_records 
           WHERE userId = ? 
           ORDER BY recordedAt DESC 
           LIMIT 1`,
          [userData.id]
        );
        
        if (bpRecord) {
          // Calculate BP category
          const bpCategory = getBPCategory(bpRecord.systolic, bpRecord.diastolic);
          setLatestBloodPressure({
            ...bpRecord,
            category: bpCategory
          });
        } else {
          setLatestBloodPressure(null);
        }
      }
    } catch (error) {
      console.log('Error loading latest blood pressure:', error);
    }
  };

  // AHA Blood Pressure Category Calculator
  const getBPCategory = (systolic, diastolic) => {
    if (systolic < 120 && diastolic < 80) {
      return {
        stage: 'Normal',
        color: '#27ae60',
        shortName: 'Normal'
      };
    }
    
    if ((systolic >= 120 && systolic <= 129) && diastolic < 80) {
      return {
        stage: 'Elevated',
        color: '#f39c12',
        shortName: 'Elevated'
      };
    }
    
    if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
      return {
        stage: 'High Blood Pressure Stage 1',
        color: '#e67e22',
        shortName: 'Stage 1'
      };
    }
    
    if (systolic >= 140 || diastolic >= 90) {
      return {
        stage: 'High Blood Pressure Stage 2',
        color: '#e74c3c',
        shortName: 'Stage 2'
      };
    }
    
    if (systolic > 180 || diastolic > 120) {
      return {
        stage: 'Hypertensive Crisis',
        color: '#8e44ad',
        shortName: 'Crisis'
      };
    }

    return {
      stage: 'Unknown',
      color: '#95a5a6',
      shortName: 'Unknown'
    };
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
        setCurrentScreen('bloodpressure');
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
    // Reload latest data when returning from any screen
    loadLatestWeight();
    loadLatestBloodPressure();
  };

  // Create dynamic dashboard items with latest weight and blood pressure
  const dashboardItems = useMemo(() => 
    createDashboardItems(latestWeight, latestBloodPressure),
    [latestWeight, latestBloodPressure]
  );

  // Render different screens based on currentScreen state
  if (currentScreen === 'weight') {
    return <WeightScreen onBack={handleBackToDashboard} />;
  }

  if(currentScreen === 'bloodpressure'){
    return <BloodPressureScreen onBack={handleBackToDashboard}/>;
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