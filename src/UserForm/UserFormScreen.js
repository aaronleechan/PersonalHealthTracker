// UserFormScreen.js - Main container component
import React, { useState } from 'react';
import { 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert 
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useScreen } from '../../App';

// Import components
import UserFormHeader from './components/UserFormHeader';
import UserFormFields from './components/UserFormFields';
import UserFormButtons from './components/UserFormButtons';

// Import styles
import { userFormMainStyles } from './styles/UserFormMainStyles';

const UserFormScreen = () => {
  const { navigateToHome, navigateToMain, setUserCode } = useScreen();
  const db = useSQLiteContext();
  
  const [form, setForm] = useState({
    name: '',
    age: '',
    height: '',
    code: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFieldChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.age.trim()) newErrors.age = 'Age is required';
    else if (isNaN(form.age) || parseInt(form.age) <= 0 || parseInt(form.age) > 120) {
      newErrors.age = 'Please enter a valid age (1-120)';
    }
    if (!form.height.trim()) newErrors.height = 'Height is required';
    else if (isNaN(form.height) || parseFloat(form.height) <= 0 || parseFloat(form.height) > 300) {
      newErrors.height = 'Please enter a valid height (1-300 cm)';
    }
    if (!form.code.trim()) newErrors.code = 'Code is required';
    else if (form.code.length < 4) newErrors.code = 'Code must be at least 4 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Check if code exists
      const existingUser = await db.getFirstAsync(`SELECT code FROM users WHERE code = ?`, [form.code]);
      if (existingUser) {
        setErrors({ code: 'This code already exists' });
        setLoading(false);
        return;
      }

      await db.runAsync(
        `INSERT INTO users (name, age, height, code, createdAt)
         VALUES (?, ?, ?, ?, ?)`,
        [
          form.name.trim(),
          parseInt(form.age),
          parseFloat(form.height),
          form.code.trim(),
          new Date().toISOString()
        ]
      );

      Alert.alert(
        '🎉 Success!',
        `Welcome ${form.name}! Your account has been created.`,
        [
          {
            text: 'Get Started',
            onPress: () => {
              setUserCode(form.code);
              navigateToMain();
            }
          }
        ]
      );

    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigateToHome();
  };

  return (
    <KeyboardAvoidingView 
      style={userFormMainStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={userFormMainStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Component */}
        <UserFormHeader />

        {/* Form Fields Component */}
        <UserFormFields 
          form={form}
          errors={errors}
          onFieldChange={handleFieldChange}
        />

        {/* Buttons Component */}
        <UserFormButtons 
          loading={loading}
          onSubmit={handleSubmit}
          onBackToLogin={handleBackToLogin}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UserFormScreen;