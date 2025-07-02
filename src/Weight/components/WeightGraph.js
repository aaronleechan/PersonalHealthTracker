// components/WeightGraph.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useScreen } from '../../../App';
import { weightGraphStyles } from '../styles/WeightGraphStyles';

const WeightGraph = ({ refreshTrigger }) => {
  const db = useSQLiteContext();
  const { userCode } = useScreen();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [weightData, setWeightData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const periods = [
    { key: 'day', label: 'Day', days: 1 },
    { key: 'week', label: 'Week', days: 7 },
    { key: 'month', label: 'Month', days: 30 },
    { key: 'year', label: 'Year', days: 365 }
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (user) {
      loadWeightData();
    }
  }, [selectedPeriod, user, refreshTrigger]);

  const loadUserData = async () => {
    try {
      const userData = await db.getFirstAsync(`SELECT * FROM users WHERE code = ?`, [userCode]);
      setUser(userData);
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const loadWeightData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const selectedDays = periods.find(p => p.key === selectedPeriod)?.days || 7;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - selectedDays);
      
      const records = await db.getAllAsync(
        `SELECT weight, recordedAt 
         FROM weight_records 
         WHERE userId = ? AND recordedAt >= ? 
         ORDER BY recordedAt ASC`,
        [user.id, startDate.toISOString()]
      );
      
      console.log('Weight records found:', records); // Debug log
      setWeightData(records);
    } catch (error) {
      console.log('Error loading weight data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    switch (selectedPeriod) {
      case 'day':
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      case 'week':
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      case 'month':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'year':
        return date.toLocaleDateString('en-US', { month: 'short' });
      default:
        return date.toLocaleDateString();
    }
  };

  const getWeightTrend = () => {
    if (weightData.length < 2) return { trend: 'stable', change: 0 };
    
    const latest = weightData[weightData.length - 1].weight;
    const previous = weightData[weightData.length - 2].weight;
    const change = latest - previous;
    
    return {
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      change: Math.abs(change).toFixed(1)
    };
  };

  const renderGraph = () => {
    if (weightData.length === 0) {
      return (
        <View style={weightGraphStyles.noDataContainer}>
          <Text style={weightGraphStyles.noDataText}>⚖️</Text>
          <Text style={weightGraphStyles.noDataTitle}>No Weight Data</Text>
          <Text style={weightGraphStyles.noDataSubtitle}>
            Start tracking your weight to see your progress over time
          </Text>
        </View>
      );
    }

    const maxWeight = Math.max(...weightData.map(d => d.weight));
    const minWeight = Math.min(...weightData.map(d => d.weight));
    const range = maxWeight - minWeight || 10; // Minimum range of 10 lbs
    const graphHeight = 280; // Increased height for better visibility
    const graphWidth = Dimensions.get('window').width - 80;
    const pointWidth = Math.max(graphWidth / (weightData.length || 1), 60); // Increased spacing

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={[weightGraphStyles.graphContainer, { 
          width: Math.max(graphWidth, pointWidth * weightData.length),
          height: graphHeight + 60 // Extra space for labels
        }]}>
          {/* Weight Reference Lines */}
          <View style={weightGraphStyles.referenceLines}>
            {[
              Math.ceil(minWeight - 5),
              Math.ceil((minWeight + maxWeight) / 2),
              Math.ceil(maxWeight + 5)
            ].map((line, index) => {
              const linePosition = graphHeight - ((line - (minWeight - 5)) / (range + 10)) * graphHeight;
              return (
                <View 
                  key={index}
                  style={[
                    weightGraphStyles.referenceLine, 
                    { top: linePosition }
                  ]}
                >
                  <Text style={weightGraphStyles.referenceLineText}>
                    {line} lbs
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Data Points and Line */}
          <View style={weightGraphStyles.dataContainer}>
            {weightData.map((record, index) => {
              const yPosition = graphHeight - ((record.weight - (minWeight - 5)) / (range + 10)) * graphHeight;
              const xPosition = index * pointWidth + pointWidth / 2;
              
              // Determine point color based on weight trend
              let pointColor = '#3498db'; // Default blue
              if (index > 0) {
                const prevWeight = weightData[index - 1].weight;
                if (record.weight > prevWeight) pointColor = '#e74c3c'; // Red for weight gain
                else if (record.weight < prevWeight) pointColor = '#27ae60'; // Green for weight loss
              }
              
              return (
                <View key={index}>      
                  {/* Data Point */}
                  <View
                    style={[
                      weightGraphStyles.dataPoint,
                      {
                        left: xPosition - 12,
                        top: yPosition - 12,
                        backgroundColor: pointColor
                      }
                    ]}
                  >
                    <Text style={weightGraphStyles.dataPointText}>
                      {record.weight}
                    </Text>
                  </View>
                  
                  {/* X-axis Label */}
                  <Text
                    style={[
                      weightGraphStyles.xAxisLabel,
                      {
                        left: xPosition - 30,
                        top: graphHeight + 15
                      }
                    ]}
                  >
                    {formatDate(record.recordedAt)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    );
  };

  const getLatestWeight = () => {
    if (weightData.length === 0) return null;
    const latest = weightData[weightData.length - 1];
    const trend = getWeightTrend();
    return {
      weight: latest.weight,
      bmi: latest.bmi,
      date: new Date(latest.recordedAt).toLocaleDateString(),
      trend
    };
  };

  const latestWeight = getLatestWeight();

  return (
    <View style={weightGraphStyles.container}>
      {/* Header */}
      <View style={weightGraphStyles.header}>
        <Text style={weightGraphStyles.title}>Weight Progress</Text>
        <Text style={weightGraphStyles.subtitle}>Track your weight changes over time</Text>
      </View>

      {/* Current Weight Display */}
      {latestWeight && (
        <View style={weightGraphStyles.currentWeightCard}>
          <View style={weightGraphStyles.currentWeightHeader}>
            <Text style={weightGraphStyles.currentWeightLabel}>Current Weight</Text>
            <View style={weightGraphStyles.currentWeightValue}>
              <Text style={weightGraphStyles.currentWeightValueText}>
              {latestWeight.weight} lbs
            </Text>
            </View>
          </View>
          <View style={weightGraphStyles.trendContainer}>
            <Text style={weightGraphStyles.trendLabel}>Trend: </Text>
            <Text style={[
              weightGraphStyles.trendText,
              {
                color: latestWeight.trend.trend === 'up' ? '#e74c3c' : 
                      latestWeight.trend.trend === 'down' ? '#27ae60' : '#7f8c8d'
              }
            ]}>
              {latestWeight.trend.trend === 'up' ? '↗️ ' : 
               latestWeight.trend.trend === 'down' ? '↘️ ' : '➡️ '}
              {latestWeight.trend.change} lbs
              {latestWeight.trend.trend === 'up' ? ' gained' : 
               latestWeight.trend.trend === 'down' ? ' lost' : ' no change'}
            </Text>
          </View>
          <Text style={weightGraphStyles.currentWeightDate}>
            Last updated: {latestWeight.date}
          </Text>
        </View>
      )}

      {/* Period Selector */}
      <View style={weightGraphStyles.periodSelector}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period.key}
            style={[
              weightGraphStyles.periodButton,
              selectedPeriod === period.key && weightGraphStyles.periodButtonActive
            ]}
            onPress={() => setSelectedPeriod(period.key)}
          >
            <Text
              style={[
                weightGraphStyles.periodButtonText,
                selectedPeriod === period.key && weightGraphStyles.periodButtonTextActive
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Graph */}
      <View style={weightGraphStyles.graphWrapper}>
        {loading ? (
          <View style={weightGraphStyles.loadingContainer}>
            <Text style={weightGraphStyles.loadingText}>Loading graph...</Text>
          </View>
        ) : (
          renderGraph()
        )}
      </View>

      {/* Weight Change Legend */}
      <View style={weightGraphStyles.legend}>
        <Text style={weightGraphStyles.legendTitle}>Weight Trend Indicators</Text>
        <View style={weightGraphStyles.legendItems}>
          {[
            { color: '#27ae60', text: 'Weight Loss' },
            { color: '#3498db', text: 'Stable Weight' },
            { color: '#e74c3c', text: 'Weight Gain' }
          ].map((item, index) => (
            <View key={index} style={weightGraphStyles.legendItem}>
              <View style={[weightGraphStyles.legendColor, { backgroundColor: item.color }]} />
              <Text style={weightGraphStyles.legendText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default WeightGraph;