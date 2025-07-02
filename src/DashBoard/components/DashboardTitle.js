// components/DashboardTitle.js
import React from 'react';
import { View, Text } from 'react-native';
import { dashboardTitleStyles } from '../styles/DashboardTitleStyles';

const DashboardTitle = () => {
  return (
    <View style={dashboardTitleStyles.dashboardHeader}>
      <Text style={dashboardTitleStyles.dashboardTitle}>Health Dashboard</Text>
      <Text style={dashboardTitleStyles.dashboardSubtitle}>Track your fitness journey</Text>
    </View>
  );
};

export default DashboardTitle;