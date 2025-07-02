// components/DashboardHeader.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { dashboardHeaderStyles } from '../styles/DashboardHeaderStyles';

const DashboardHeader = ({ user, onLogout }) => {
  return (
    <View style={dashboardHeaderStyles.header}>
      <View style={dashboardHeaderStyles.headerLeft}>
        <Text style={dashboardHeaderStyles.welcomeText}>Welcome back!</Text>
        <Text style={dashboardHeaderStyles.userName}>{user?.name || 'User'}</Text>
      </View>
      <TouchableOpacity 
        style={dashboardHeaderStyles.logoutButton}
        onPress={onLogout}
      >
        <Text style={dashboardHeaderStyles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DashboardHeader;