// HomeScreen.js - Main container component
import React, { useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useScreen } from '../../App';

// Import components
import HomeHeader from './components/HomeHeader';
import LoginCard from './components/LoginCard';
import Divider from './components/Divider';
import SignUpSection from './components/SignUpSection';
import HomeFooter from './components/HomeFooter';

// Import styles
import { homeMainStyles } from './styles/HomeMainStyles';

const HomeScreen = () => {
  const db = useSQLiteContext();
  const { navigateToSignUp, navigateToMain, setUserCode } = useScreen();
  
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCodeChange = (text) => {
    setCode(text);
    setMsg(''); // Clear error message when user types
  };

  const handleExistingUser = async () => {
    if (!code.trim()) {
      Alert.alert("Missing Code", "Please enter your code to continue");
      return;
    }

    setLoading(true);
    try {
      const user = await db.getFirstAsync(`SELECT * FROM users WHERE code = ?`, [code.trim()]);
      
      if (user) {
        setUserCode(code.trim());
        navigateToMain();
        Alert.alert('🎉 Welcome Back!', `Hello ${user.name}, great to see you again!`);
      } else {
        setMsg('No account found with this code');
      }
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigateToSignUp();
  };

  return (
    <KeyboardAvoidingView 
      style={homeMainStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={homeMainStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Component */}
        <HomeHeader />

        {/* Login Card Component */}
        <LoginCard 
          code={code}
          onCodeChange={handleCodeChange}
          errorMessage={msg}
          loading={loading}
          onLogin={handleExistingUser}
        />

        {/* Divider Component */}
        <Divider />

        {/* Sign Up Section Component */}
        <SignUpSection onSignUp={handleSignUp} />

        {/* Footer Component */}
        <HomeFooter />

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;