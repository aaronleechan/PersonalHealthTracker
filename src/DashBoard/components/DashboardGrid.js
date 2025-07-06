// components/DashboardGrid.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CARD_TYPES } from '../data/dashboardData';

const DashboardGrid = ({ dashboardItems, onCardPress }) => {
  
  const renderCard = (item) => {
    const isBloodPressure = item.id === CARD_TYPES.BLOOD_PRESSURE;
    const isHealthAnalysis = item.id === CARD_TYPES.HEALTH_ANALYSIS;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.card,
          { backgroundColor: item.color },
          isBloodPressure && item.hasData && styles.bpCardWithData,
          isHealthAnalysis && styles.healthAnalysisCard
        ]}
        onPress={() => onCardPress(item)}
        activeOpacity={0.8}
      >
        {/* Special layout for Health Analysis card */}
        {isHealthAnalysis ? (
          <View style={styles.healthAnalysisContent}>
            {/* Left side - Icon and main info */}
            <View style={styles.healthAnalysisLeft}>
              <Text style={styles.healthAnalysisIcon}>
                {item.icon}
              </Text>
              <View style={styles.healthAnalysisTextContainer}>
                <Text style={styles.healthAnalysisTitle}>
                  {item.title}
                </Text>
                <Text style={styles.healthAnalysisValue}>
                  {item.value}
                </Text>
                <Text style={styles.healthAnalysisSubtitle}>
                  {item.subtitle}
                </Text>
              </View>
            </View>
            
            {/* Right side - Status and action */}
            <View style={styles.healthAnalysisRight}>
              {/* Data Status Indicator */}
              <View style={[
                styles.dataStatusIndicator,
                { backgroundColor: item.hasData ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)' }
              ]}>
                <Text style={styles.dataStatusText}>
                  {item.hasData ? '✓ Data Ready' : '! Need Data'}
                </Text>
              </View>
              
              {/* Action Hint */}
              <Text style={styles.actionHint}>
                {item.hasData ? 'Tap to generate AI insights' : 'Add weight & BP first'}
              </Text>
            </View>
          </View>
        ) : (
          // Regular card layout for other cards
          <>
            {/* Card Icon */}
            <Text style={styles.cardIcon}>
              {item.icon}
            </Text>
            
            {/* Card Title */}
            <Text style={styles.cardTitle}>
              {item.title}
            </Text>
            
            {/* Card Value */}
            <Text style={[
              styles.cardValue,
              isBloodPressure && item.hasData && styles.bpValue,
            ]}>
              {item.value}
            </Text>
            
            {/* Card Subtitle with BP Category */}
            <Text style={[
              styles.cardSubtitle,
              isBloodPressure && item.hasData && styles.bpSubtitle,
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
          </>
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

  healthAnalysisCard: {
    width: '100%',
    aspectRatio: 2.5,
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'stretch',
  },

  healthAnalysisContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  healthAnalysisLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  healthAnalysisTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  healthAnalysisRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 120, // Ensures minimum width for content
  },
  cardIcon: {
    fontSize: 30,
    marginBottom: 8,
  },

  healthAnalysisIcon: {
    fontSize: 40,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  healthAnalysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
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
  healthAnalysisValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
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
  healthAnalysisSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  dataStatusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 8,
  },
  dataStatusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
  },
  actionHint: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontStyle: 'italic',
    maxWidth: 120, // Prevents text from being too wide
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