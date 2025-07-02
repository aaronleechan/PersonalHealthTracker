// components/DashboardGrid.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CARD_TYPES } from '../data/dashboardData';

const DashboardGrid = ({ dashboardItems, onCardPress }) => {
  
  const renderCard = (item) => {
    const isBloodPressure = item.id === CARD_TYPES.BLOOD_PRESSURE;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.card,
          { backgroundColor: item.color },
          isBloodPressure && item.hasData && styles.bpCardWithData
        ]}
        onPress={() => onCardPress(item)}
        activeOpacity={0.8}
      >
        {/* Card Icon */}
        <Text style={styles.cardIcon}>{item.icon}</Text>
        
        {/* Card Title */}
        <Text style={styles.cardTitle}>{item.title}</Text>
        
        {/* Card Value */}
        <Text style={[
          styles.cardValue,
          isBloodPressure && item.hasData && styles.bpValue
        ]}>
          {item.value}
        </Text>
        
        {/* Card Subtitle with BP Category */}
        <Text style={[
          styles.cardSubtitle,
          isBloodPressure && item.hasData && styles.bpSubtitle
        ]}>
          {item.subtitle}
        </Text>

        {/* Blood Pressure Category Badge */}
        {isBloodPressure && item.hasData && item.category && (
          <View style={[
            styles.categoryBadge,
            { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
          ]}>
            <Text style={styles.categoryText}>
              {item.category.shortName}
            </Text>
          </View>
        )}

        {/* Status Indicator for BP */}
        {isBloodPressure && item.hasData && (
          <View style={[
            styles.statusIndicator,
            { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
          ]}>
            <Text style={styles.statusText}>
              {item.category.shortName === 'Normal' ? '✅' : 
               item.category.shortName === 'Elevated' ? '⚠️' : 
               item.category.shortName === 'Crisis' ? '🚨' : '⚡'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {dashboardItems.map(renderCard)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  bpCardWithData: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  bpValue: {
    fontSize: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  bpSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
  },
  statusIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
  },
});

export default DashboardGrid;