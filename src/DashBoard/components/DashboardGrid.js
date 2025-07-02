// components/DashboardGrid.js
import React from 'react';
import { FlatList } from 'react-native';
import DashboardCard from './DashboardCard';
import { dashboardGridStyles } from '../styles/DashboardGridStyles';

const DashboardGrid = ({ dashboardItems, onCardPress }) => {
  const renderDashboardCard = ({ item, index }) => {
    return (
      <DashboardCard 
        item={item} 
        onPress={onCardPress}
      />
    );
  };

  return (
    <FlatList
      data={dashboardItems}
      renderItem={renderDashboardCard}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={dashboardGridStyles.row}
      contentContainerStyle={dashboardGridStyles.gridContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default DashboardGrid;