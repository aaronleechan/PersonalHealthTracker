// components/DashboardCard.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { dashboardCardStyles } from '../styles/DashboardCardStyles';

const DashboardCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={[dashboardCardStyles.card, { backgroundColor: item.color }]}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
    >
      <View style={dashboardCardStyles.cardContent}>
        <Text style={dashboardCardStyles.cardIcon}>{item.icon}</Text>
        <Text style={dashboardCardStyles.cardTitle}>{item.title}</Text>
        <Text style={dashboardCardStyles.cardDescription}>{item.description}</Text>
      </View>
      <View style={dashboardCardStyles.cardArrow}>
        <Text style={dashboardCardStyles.arrowIcon}>→</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DashboardCard;