// components/HomeHeader.js
import React from 'react';
import { View, Text } from 'react-native';
import { homeHeaderStyles } from '../styles/HomeHeaderStyles';

const HomeHeader = () => {
  return (
    <View style={homeHeaderStyles.header}>
      <Text style={homeHeaderStyles.appTitle}>Health Tracker</Text>
      <Text style={homeHeaderStyles.welcomeText}>Welcome Back!</Text>
      <Text style={homeHeaderStyles.subtitle}>Enter your code to access your account</Text>
    </View>
  );
};

export default HomeHeader;