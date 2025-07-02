// WeightScreen.js - Main container component
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useScreen } from '../../App';

// Import components
import WeightHeader from './components/WeightHeader';
import BMIDisplay from './components/BMIDisplay';
import WeightInput from './components/WeightInput';
import BMIInfo from './components/BMIInfo';
import WeightGraph from './components/WeightGraph';
import WeightRecordsList from './components/WeightRecordsList';

// Import styles
import { mainScreenStyles } from './styles/MainScreenStyles';

const WeightScreen = ({ onBack }) => {
  const { userCode } = useScreen();
  const db = useSQLiteContext();
  
  const [weight, setWeight] = useState('');
  const [user, setUser] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBMI, setShowBMI] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await db.getFirstAsync(`SELECT * FROM users WHERE code = ?`, [userCode]);
      setUser(userData);
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const calculateBMI = (weightInLbs, heightInCm) => {
    const weightInKg = weightInLbs * 0.453592;
    const heightInM = heightInCm / 100;
    const bmiValue = weightInKg / (heightInM * heightInM);
    return parseFloat(bmiValue.toFixed(1));
  };

  const getBMICategory = (bmiValue) => {
    if (bmiValue < 18.5) return { category: 'Underweight', color: '#3498db' };
    if (bmiValue < 25) return { category: 'Normal', color: '#27ae60' };
    if (bmiValue < 30) return { category: 'Overweight', color: '#f39c12' };
    return { category: 'Obese', color: '#e74c3c' };
  };

  const handleCalculateBMI = async () => {
    if (!weight.trim()) {
      Alert.alert('Missing Weight', 'Please enter your weight');
      return;
    }

    if (isNaN(weight) || parseFloat(weight) <= 0) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User data not found');
      return;
    }

    setLoading(true);
    try {
      const weightValue = parseFloat(weight);
      const calculatedBMI = calculateBMI(weightValue, user.height);
      const bmiInfo = getBMICategory(calculatedBMI);
      
      setBmi(calculatedBMI);
      setBmiCategory(bmiInfo);
      setShowBMI(true);

    } catch (error) {
      console.log('Error calculating BMI:', error);
      Alert.alert('Error', 'Failed to calculate BMI');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecord = async () => {
    setLoading(true);
    try {
      await db.runAsync(
        `INSERT INTO weight_records (userId, weight, recordedAt)
         VALUES (?, ?, ?)`,
        [user.id, parseFloat(weight), new Date().toISOString()]
      );

      Alert.alert(
        '✅ Weight Saved!',
        `Your weight record has been saved successfully.`,
        [
          {
            text: 'Add Another',
            onPress: () => {
              setWeight('');
              setShowBMI(false);
              setRefreshTrigger(prev => prev + 1); // Refresh graph and list
            }
          },
          {
            text: 'Back to Dashboard',
            onPress: onBack
          }
        ]
      );

    } catch (error) {
      console.log('Error saving weight:', error);
      Alert.alert('Error', 'Failed to save weight record');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordDeleted = () => {
    // Refresh graph when a record is deleted
    setRefreshTrigger(prev => prev + 1);
  };

  const handleWeightChange = (text) => {
    setWeight(text);
  };

  return (
    <SafeAreaView style={mainScreenStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" translucent={false} />
      
      <KeyboardAvoidingView 
        style={mainScreenStyles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={mainScreenStyles.scrollContent}>
          
          {/* Using separated components */}
          <WeightHeader onBack={onBack} />

          <BMIDisplay
            showBMI={showBMI}
            bmi={bmi}
            bmiCategory={bmiCategory}
            weight={weight}
            userHeight={user?.height}
            loading={loading}
            onSave={handleSaveRecord}
          />

          <WeightInput
            weight={weight}
            onWeightChange={handleWeightChange}
            onCalculate={handleCalculateBMI}
            loading={loading}
          />

          <BMIInfo />
          <WeightGraph/>
          <WeightRecordsList/>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default WeightScreen;