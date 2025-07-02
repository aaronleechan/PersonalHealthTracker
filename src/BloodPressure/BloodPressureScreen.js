// BloodPressureScreen.js - Main container component
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useScreen } from '../../App';

// Temporary inline styles until we create separate files
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  inputContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputGroup: {
    flex: 1,
    alignItems: 'center',
  },
  separator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginHorizontal: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    minWidth: 80,
  },
  calculateButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  stageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  readingText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  saveButton: {
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 15,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const BloodPressureScreen = ({ onBack = () => {} }) => {
  const { userCode } = useScreen();
  const db = useSQLiteContext();
  
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [user, setUser] = useState(null);
  const [bpStage, setBpStage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showBPStage, setShowBPStage] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [graphData, setGraphData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // day, week, month, year
  const [allRecords, setAllRecords] = useState([]);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (user) {
      loadGraphData();
      loadAllRecords();
    }
  }, [user, selectedPeriod, refreshTrigger]);

  const loadUserData = async () => {
    try {
      const userData = await db.getFirstAsync(`SELECT * FROM users WHERE code = ?`, [userCode]);
      setUser(userData);
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const loadGraphData = async () => {
    if (!user) return;
    
    try {
      let dateFilter = '';
      const now = new Date();
      
      switch (selectedPeriod) {
        case 'day':
          // Last 24 hours
          const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          dateFilter = `AND recordedAt >= '${dayAgo.toISOString()}'`;
          break;
        case 'week':
          // Last 7 days
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          dateFilter = `AND recordedAt >= '${weekAgo.toISOString()}'`;
          break;
        case 'month':
          // Last 30 days
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          dateFilter = `AND recordedAt >= '${monthAgo.toISOString()}'`;
          break;
        case 'year':
          // Last 365 days
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          dateFilter = `AND recordedAt >= '${yearAgo.toISOString()}'`;
          break;
      }

      const records = await db.getAllAsync(
        `SELECT systolic, diastolic, pulse, recordedAt 
         FROM blood_pressure_records 
         WHERE userId = ? ${dateFilter}
         ORDER BY recordedAt ASC`,
        [user.id]
      );
      
      setGraphData(records);
    } catch (error) {
      console.log('Error loading graph data:', error);
    }
  };

  const loadAllRecords = async () => {
    if (!user) return;
    
    try {
      const records = await db.getAllAsync(
        `SELECT id, systolic, diastolic, pulse, recordedAt 
         FROM blood_pressure_records 
         WHERE userId = ? 
         ORDER BY recordedAt DESC`,
        [user.id]
      );
      
      setAllRecords(records);
    } catch (error) {
      console.log('Error loading all records:', error);
    }
  };

  const handleDeleteRecord = async (recordId, systolic, diastolic) => {
    Alert.alert(
      'Delete Record',
      `Are you sure you want to delete this blood pressure record (${systolic}/${diastolic})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.runAsync(`DELETE FROM blood_pressure_records WHERE id = ?`, [recordId]);
              setRefreshTrigger(prev => prev + 1); // This will reload both graph and records
              Alert.alert('✅ Deleted', 'Record deleted successfully');
            } catch (error) {
              console.log('Error deleting record:', error);
              Alert.alert('Error', 'Failed to delete record');
            }
          }
        }
      ]
    );
  };

  // AHA Blood Pressure Guidelines
  const getBPStage = (systolicValue, diastolicValue) => {
    const sys = parseInt(systolicValue);
    const dia = parseInt(diastolicValue);

    if (sys < 120 && dia < 80) {
      return {
        stage: 'Normal',
        description: 'Less than 120/80 mmHg',
        color: '#27ae60',
        recommendation: 'Maintain healthy lifestyle habits.'
      };
    }
    
    if ((sys >= 120 && sys <= 129) && dia < 80) {
      return {
        stage: 'Elevated',
        description: '120-129 systolic and less than 80 diastolic',
        color: '#f39c12',
        recommendation: 'Adopt healthy lifestyle changes.'
      };
    }
    
    if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) {
      return {
        stage: 'High Blood Pressure Stage 1',
        description: '130-139/80-89 mmHg',
        color: '#e67e22',
        recommendation: 'Lifestyle changes and possibly medication.'
      };
    }
    
    if (sys >= 140 || dia >= 90) {
      return {
        stage: 'High Blood Pressure Stage 2',
        description: '140/90 mmHg or higher',
        color: '#e74c3c',
        recommendation: 'Lifestyle changes and medication likely needed.'
      };
    }
    
    if (sys > 180 || dia > 120) {
      return {
        stage: 'Hypertensive Crisis',
        description: 'Higher than 180/120 mmHg',
        color: '#8e44ad',
        recommendation: 'Seek immediate medical attention!'
      };
    }

    return {
      stage: 'Invalid Reading',
      description: 'Please check your values',
      color: '#95a5a6',
      recommendation: 'Enter valid blood pressure values.'
    };
  };

  const validateInputs = () => {
    if (!systolic.trim() || !diastolic.trim() || !pulse.trim()) {
      Alert.alert('Missing Values', 'Please enter systolic, diastolic, and pulse values');
      return false;
    }

    const sysValue = parseInt(systolic);
    const diasValue = parseInt(diastolic);
    const pulseValue = parseInt(pulse);

    if (isNaN(sysValue) || isNaN(diasValue) || isNaN(pulseValue)) {
      Alert.alert('Invalid Values', 'Please enter valid numeric values');
      return false;
    }

    if (sysValue <= 0 || diasValue <= 0 || pulseValue <= 0) {
      Alert.alert('Invalid Values', 'Values must be greater than 0');
      return false;
    }

    if (sysValue > 300 || diasValue > 200 || pulseValue > 220) {
      Alert.alert('Values Too High', 'Please check your readings - values seem unusually high');
      return false;
    }

    if (sysValue < 50 || diasValue < 30 || pulseValue < 30) {
      Alert.alert('Values Too Low', 'Please check your readings - values seem unusually low');
      return false;
    }

    if (sysValue <= diasValue) {
      Alert.alert('Invalid Reading', 'Systolic pressure should be higher than diastolic pressure');
      return false;
    }

    return true;
  };

  const handleCalculateBPStage = async () => {
    if (!validateInputs()) {
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User data not found');
      return;
    }

    setLoading(true);
    try {
      const stage = getBPStage(systolic, diastolic);
      setBpStage(stage);
      setShowBPStage(true);

      // Show warning for hypertensive crisis
      if (stage.stage === 'Hypertensive Crisis') {
        Alert.alert(
          '⚠️ HYPERTENSIVE CRISIS',
          'Your blood pressure reading indicates a hypertensive crisis. Please seek immediate medical attention!',
          [{ text: 'Understood', style: 'default' }]
        );
      }

    } catch (error) {
      console.log('Error calculating BP stage:', error);
      Alert.alert('Error', 'Failed to calculate blood pressure stage');
    } finally {
      setLoading(false);
    }
  };

  const formatDateForChart = (dateString, period) => {
    const date = new Date(dateString);
    switch (period) {
      case 'day':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case 'week':
        return date.toLocaleDateString([], { weekday: 'short' });
      case 'month':
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      case 'year':
        return date.toLocaleDateString([], { month: 'short' });
      default:
        return date.toLocaleDateString();
    }
  };

  const calculateStats = () => {
    if (graphData.length === 0) return null;
    
    const systolicValues = graphData.map(r => r.systolic);
    const diastolicValues = graphData.map(r => r.diastolic);
    const pulseValues = graphData.map(r => r.pulse);
    
    return {
      avgSystolic: Math.round(systolicValues.reduce((a, b) => a + b, 0) / systolicValues.length),
      avgDiastolic: Math.round(diastolicValues.reduce((a, b) => a + b, 0) / diastolicValues.length),
      avgPulse: Math.round(pulseValues.reduce((a, b) => a + b, 0) / pulseValues.length),
      maxSystolic: Math.max(...systolicValues),
      minSystolic: Math.min(...systolicValues),
      totalReadings: graphData.length
    };
  };

  const renderGraph = () => {
    const periods = [
      { key: 'day', label: 'Day' },
      { key: 'week', label: 'Week' },
      { key: 'month', label: 'Month' },
      { key: 'year', label: 'Year' }
    ];

    const stats = calculateStats();

    console.log('Graph data:', graphData.length, 'records for period:', selectedPeriod);

    return (
      <View style={styles.graphContainer}>
        <Text style={styles.graphTitle}>📈 Blood Pressure Trends</Text>
        
        {/* Period Selector */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: '#f8f9fa',
          borderRadius: 10,
          padding: 4,
          marginBottom: 20,
        }}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={{
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderRadius: 8,
                alignItems: 'center',
                backgroundColor: selectedPeriod === period.key ? '#e74c3c' : 'transparent',
              }}
              onPress={() => setSelectedPeriod(period.key)}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: selectedPeriod === period.key ? 'white' : '#7f8c8d',
              }}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Debug Info */}
        <Text style={{ textAlign: 'center', fontSize: 12, color: '#7f8c8d', marginBottom: 10 }}>
          Found {graphData.length} records for {selectedPeriod}
        </Text>

        {/* Chart */}
        {graphData.length === 0 ? (
          <View style={styles.emptyChart}>
            <Text style={styles.emptyChartText}>
              No records found for the selected period.{'\n'}
              Add some blood pressure readings to see your trends!
            </Text>
          </View>
        ) : (
          <>
            {/* Simple Chart with guaranteed visibility */}
            <View style={{
              height: 220,
              backgroundColor: '#f0f0f0',
              borderRadius: 10,
              padding: 15,
              marginBottom: 15,
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-around'
            }}>
              {graphData.slice(-8).map((record, index) => {
                // Simple height calculation - ensure bars are always visible
                const systolicHeight = Math.max(25, (record.systolic / 180) * 140);
                const diastolicHeight = Math.max(20, (record.diastolic / 120) * 140);
                
                return (
                  <View key={index} style={{
                    alignItems: 'center',
                    flex: 1,
                  }}>
                    {/* Bar container */}
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                      height: 160,
                      marginBottom: 8,
                    }}>
                      {/* Systolic bar - RED */}
                      <View style={{
                        width: 20,
                        height: systolicHeight,
                        backgroundColor: '#e74c3c',
                        marginRight: 4,
                        borderRadius: 4,
                      }} />
                      
                      {/* Diastolic bar - BLUE */}
                      <View style={{
                        width: 20,
                        height: diastolicHeight,
                        backgroundColor: '#3498db',
                        borderRadius: 4,
                      }} />
                    </View>
                    
                    {/* Labels */}
                    <Text style={{
                      fontSize: 11,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: '#2c3e50'
                    }}>
                      {record.systolic}/{record.diastolic}
                    </Text>
                    <Text style={{
                      fontSize: 9,
                      color: '#7f8c8d',
                      textAlign: 'center'
                    }}>
                      {formatDateForChart(record.recordedAt, selectedPeriod)}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Legend */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 15,
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 15,
              }}>
                <View style={{
                  width: 16,
                  height: 16,
                  backgroundColor: '#e74c3c',
                  borderRadius: 8,
                  marginRight: 8,
                }} />
                <Text style={{
                  fontSize: 14,
                  color: '#2c3e50',
                  fontWeight: '500',
                }}>Systolic</Text>
              </View>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 15,
              }}>
                <View style={{
                  width: 16,
                  height: 16,
                  backgroundColor: '#3498db',
                  borderRadius: 8,
                  marginRight: 8,
                }} />
                <Text style={{
                  fontSize: 14,
                  color: '#2c3e50',
                  fontWeight: '500',
                }}>Diastolic</Text>
              </View>
            </View>

            {/* Statistics */}
            {stats && (
              <View style={{
                backgroundColor: '#ffffff',
                borderRadius: 12,
                padding: 20,
                marginTop: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  textAlign: 'center',
                  marginBottom: 15,
                }}>
                  📊 Statistics Summary
                </Text>
                
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}>
                  <View style={{
                    width: '48%',
                    backgroundColor: '#f8f9fa',
                    borderRadius: 8,
                    padding: 15,
                    marginBottom: 10,
                    alignItems: 'center',
                  }}>
                    <Text style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#27ae60',
                    }}>
                      {stats.avgSystolic}/{stats.avgDiastolic}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: '#7f8c8d',
                      fontWeight: '500',
                      marginTop: 4,
                    }}>
                      Average BP
                    </Text>
                  </View>
                  
                  <View style={{
                    width: '48%',
                    backgroundColor: '#f8f9fa',
                    borderRadius: 8,
                    padding: 15,
                    marginBottom: 10,
                    alignItems: 'center',
                  }}>
                    <Text style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#e74c3c',
                    }}>
                      {stats.maxSystolic}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: '#7f8c8d',
                      fontWeight: '500',
                      marginTop: 4,
                    }}>
                      Highest Systolic
                    </Text>
                  </View>
                  
                  <View style={{
                    width: '48%',
                    backgroundColor: '#f8f9fa',
                    borderRadius: 8,
                    padding: 15,
                    marginBottom: 10,
                    alignItems: 'center',
                  }}>
                    <Text style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#3498db',
                    }}>
                      {stats.minSystolic}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: '#7f8c8d',
                      fontWeight: '500',
                      marginTop: 4,
                    }}>
                      Lowest Systolic
                    </Text>
                  </View>
                  
                  <View style={{
                    width: '48%',
                    backgroundColor: '#f8f9fa',
                    borderRadius: 8,
                    padding: 15,
                    marginBottom: 10,
                    alignItems: 'center',
                  }}>
                    <Text style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#f39c12',
                    }}>
                      {stats.avgPulse} bpm
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: '#7f8c8d',
                      fontWeight: '500',
                      marginTop: 4,
                    }}>
                      Average Pulse
                    </Text>
                  </View>
                </View>
                
                <View style={{
                  backgroundColor: '#e8f4f8',
                  borderRadius: 8,
                  padding: 12,
                  marginTop: 10,
                  alignItems: 'center',
                }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#2c3e50',
                  }}>
                    {stats.totalReadings}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: '#7f8c8d',
                    fontWeight: '500',
                    marginTop: 2,
                  }}>
                    Total Readings in {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
                  </Text>
                </View>
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  const renderBPGuidelinesTable = () => {
    const guidelines = [
      {
        category: 'NORMAL',
        systolic: 'LESS THAN 120',
        connector: 'and',
        diastolic: 'LESS THAN 80',
        color: '#8bc34a',
        textColor: '#2e7d32'
      },
      {
        category: 'ELEVATED',
        systolic: '120 - 129',
        connector: 'and',
        diastolic: 'LESS THAN 80',
        color: '#ffeb3b',
        textColor: '#f57f17'
      },
      {
        category: 'HIGH BLOOD PRESSURE\n(HYPERTENSION) STAGE 1',
        systolic: '130 - 139',
        connector: 'or',
        diastolic: '80 - 89',
        color: '#ff9800',
        textColor: '#e65100'
      },
      {
        category: 'HIGH BLOOD PRESSURE\n(HYPERTENSION) STAGE 2',
        systolic: '140 OR HIGHER',
        connector: 'or',
        diastolic: '90 OR HIGHER',
        color: '#ff5722',
        textColor: '#bf360c'
      },
      {
        category: 'HYPERTENSIVE CRISIS\n(consult your doctor immediately)',
        systolic: 'HIGHER THAN 180',
        connector: 'and/or',
        diastolic: 'HIGHER THAN 120',
        color: '#9c27b0',
        textColor: '#4a148c'
      }
    ];

    // Get current user's BP stage for highlighting
    const currentStage = showBPStage && bpStage ? bpStage.stage : null;

    return (
      <View style={{
        margin: 20,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#2c3e50',
          textAlign: 'center',
          padding: 20,
          paddingBottom: 15,
        }}>
          📋 AHA Blood Pressure Guidelines
        </Text>

        {/* Table Header */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: '#5a5a5a',
        }}>
          <View style={{ flex: 1, padding: 12 }}>
            <Text style={{
              color: 'white',
              fontSize: 11,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
              BLOOD PRESSURE CATEGORY
            </Text>
          </View>
          <View style={{ flex: 1, padding: 12 }}>
            <Text style={{
              color: 'white',
              fontSize: 11,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
              SYSTOLIC mm Hg{'\n'}(upper number)
            </Text>
          </View>
          <View style={{ flex: 1, padding: 12 }}>
            <Text style={{
              color: 'white',
              fontSize: 11,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
              DIASTOLIC mm Hg{'\n'}(lower number)
            </Text>
          </View>
        </View>

        {/* Table Rows */}
        {guidelines.map((guideline, index) => {
          const isCurrentStage = currentStage && (
            (currentStage === 'Normal' && guideline.category === 'NORMAL') ||
            (currentStage === 'Elevated' && guideline.category === 'ELEVATED') ||
            (currentStage === 'High Blood Pressure Stage 1' && guideline.category.includes('STAGE 1')) ||
            (currentStage === 'High Blood Pressure Stage 2' && guideline.category.includes('STAGE 2')) ||
            (currentStage === 'Hypertensive Crisis' && guideline.category.includes('HYPERTENSIVE CRISIS'))
          );

          return (
            <View key={index} style={{
              flexDirection: 'row',
              backgroundColor: guideline.color,
              borderWidth: isCurrentStage ? 3 : 0,
              borderColor: isCurrentStage ? '#2c3e50' : 'transparent',
            }}>
              <View style={{ flex: 1, padding: 12, justifyContent: 'center' }}>
                <Text style={{
                  color: guideline.textColor,
                  fontSize: 10,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                  {guideline.category}
                </Text>
                {isCurrentStage && (
                  <Text style={{
                    color: '#2c3e50',
                    fontSize: 10,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: 4,
                  }}>
                    ← YOUR READING
                  </Text>
                )}
              </View>
              
              <View style={{ flex: 1, padding: 12, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{
                  color: guideline.textColor,
                  fontSize: 10,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                  {guideline.systolic}
                </Text>
              </View>
              
              <View style={{ flex: 0.3, padding: 12, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{
                  color: guideline.textColor,
                  fontSize: 10,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                  {guideline.connector}
                </Text>
              </View>
              
              <View style={{ flex: 1, padding: 12, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{
                  color: guideline.textColor,
                  fontSize: 10,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                  {guideline.diastolic}
                </Text>
              </View>
            </View>
          );
        })}

        {/* Current Status Display */}
        {showBPStage && bpStage && (
          <View style={{
            padding: 15,
            backgroundColor: '#f8f9fa',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
          }}>
            <Text style={{
              fontSize: 14,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#2c3e50',
              marginBottom: 8,
            }}>
              🩺 Your Current Status
            </Text>
            <View style={{
              backgroundColor: bpStage.color,
              borderRadius: 8,
              padding: 12,
            }}>
              <Text style={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
                {systolic}/{diastolic} mmHg → {bpStage.stage}
              </Text>
              <Text style={{
                color: 'white',
                fontSize: 12,
                textAlign: 'center',
                marginTop: 4,
                fontStyle: 'italic',
              }}>
                {bpStage.recommendation}
              </Text>
            </View>
          </View>
        )}

        <View style={{
          padding: 12,
          backgroundColor: '#e3f2fd',
        }}>
          <Text style={{
            fontSize: 10,
            color: '#1976d2',
            textAlign: 'center',
            lineHeight: 14,
          }}>
            Source: American Heart Association (AHA) Guidelines{'\n'}
            Note: Blood pressure category is determined by the highest category that applies.
          </Text>
        </View>
      </View>
    );
  };

  const getBPStageForRecord = (systolic, diastolic) => {
    if (systolic < 120 && diastolic < 80) return { stage: 'Normal', color: '#27ae60' };
    if ((systolic >= 120 && systolic <= 129) && diastolic < 80) return { stage: 'Elevated', color: '#f39c12' };
    if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) return { stage: 'Stage 1', color: '#e67e22' };
    if (systolic >= 140 || diastolic >= 90) return { stage: 'Stage 2', color: '#e74c3c' };
    if (systolic > 180 || diastolic > 120) return { stage: 'Crisis', color: '#8e44ad' };
    return { stage: 'Unknown', color: '#95a5a6' };
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderRecordsList = () => {
    if (allRecords.length === 0) {
      return (
        <View style={{
          margin: 20,
          backgroundColor: '#ffffff',
          borderRadius: 15,
          padding: 30,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#2c3e50',
            marginBottom: 10,
          }}>
            📋 Your Blood Pressure Records
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#7f8c8d',
            textAlign: 'center',
            lineHeight: 20,
          }}>
            No blood pressure records yet.{'\n'}
            Start tracking to see your history here!
          </Text>
        </View>
      );
    }

    return (
      <View style={{
        margin: 20,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#2c3e50',
          textAlign: 'center',
          marginBottom: 15,
        }}>
          📋 Your Blood Pressure Records
        </Text>
        
        <Text style={{
          fontSize: 12,
          color: '#7f8c8d',
          textAlign: 'center',
          marginBottom: 15,
        }}>
          {allRecords.length} record{allRecords.length !== 1 ? 's' : ''} found • Tap 🗑️ to delete
        </Text>

        {allRecords.slice(0, 10).map((record, index) => {
          const stage = getBPStageForRecord(record.systolic, record.diastolic);
          
          return (
            <View key={record.id} style={{
              backgroundColor: '#f8f9fa',
              borderRadius: 12,
              padding: 15,
              marginBottom: 10,
              borderLeftWidth: 4,
              borderLeftColor: stage.color,
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#2c3e50',
                  }}>
                    {record.systolic}/{record.diastolic} mmHg
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: '#e74c3c',
                    marginTop: 2,
                  }}>
                    💓 {record.pulse} bpm
                  </Text>
                </View>
                
                <View style={{
                  backgroundColor: stage.color,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 15,
                  marginRight: 10,
                }}>
                  <Text style={{
                    fontSize: 10,
                    color: 'white',
                    fontWeight: 'bold',
                  }}>
                    {stage.stage}
                  </Text>
                </View>

                <TouchableOpacity
                  style={{
                    backgroundColor: '#ff4757',
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => handleDeleteRecord(record.id, record.systolic, record.diastolic)}
                >
                  <Text style={{ fontSize: 16 }}>🗑️</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={{
                fontSize: 11,
                color: '#7f8c8d',
              }}>
                📅 {formatDateTime(record.recordedAt)}
              </Text>
            </View>
          );
        })}

        {allRecords.length > 10 && (
          <Text style={{
            fontSize: 12,
            color: '#7f8c8d',
            textAlign: 'center',
            marginTop: 10,
            fontStyle: 'italic',
          }}>
            Showing latest 10 records out of {allRecords.length} total
          </Text>
        )}
      </View>
    );
  };

  const handleSaveRecord = async () => {
    setLoading(true);
    try {
      await db.runAsync(
        `INSERT INTO blood_pressure_records (userId, systolic, diastolic, pulse, recordedAt)
         VALUES (?, ?, ?, ?, ?)`,
        [user.id, parseInt(systolic), parseInt(diastolic), parseInt(pulse), new Date().toISOString()]
      );

      Alert.alert(
        '✅ Blood Pressure Saved!',
        `Your blood pressure record (${systolic}/${diastolic}, Pulse: ${pulse}) has been saved successfully.`,
        [
          {
            text: 'Add Another',
            onPress: () => {
              setSystolic('');
              setDiastolic('');
              setPulse('');
              setShowBPStage(false);
              setRefreshTrigger(prev => prev + 1);
            }
          },
          {
            text: 'Back to Dashboard',
            onPress: onBack
          }
        ]
      );

    } catch (error) {
      console.log('Error saving blood pressure:', error);
      Alert.alert('Error', 'Failed to save blood pressure record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#ffffff" 
        translucent={false}
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Blood Pressure Tracker 🫀</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Input Section */}
          <View style={styles.inputContainer}>
            <Text style={styles.sectionTitle}>Enter Your Blood Pressure</Text>
            
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Systolic</Text>
                <TextInput
                  style={styles.input}
                  value={systolic}
                  onChangeText={setSystolic}
                  placeholder="120"
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>

              <Text style={styles.separator}>/</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Diastolic</Text>
                <TextInput
                  style={styles.input}
                  value={diastolic}
                  onChangeText={setDiastolic}
                  placeholder="80"
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Pulse Rate (bpm)</Text>
              <TextInput
                style={styles.input}
                value={pulse}
                onChangeText={setPulse}
                placeholder="72"
                keyboardType="numeric"
                maxLength={3}
              />
            </View>

            <TouchableOpacity
              style={styles.calculateButton}
              onPress={handleCalculateBPStage}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.calculateButtonText}>
                  📊 Check Blood Pressure Stage
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Stage Display */}
          {showBPStage && bpStage && (
            <View style={styles.stageCard}>
              <Text style={[styles.stageTitle, { color: bpStage.color }]}>
                {bpStage.stage}
              </Text>
              <Text style={styles.readingText}>
                {systolic}/{diastolic} mmHg
              </Text>
              <Text style={{ textAlign: 'center', marginBottom: 10 }}>
                Pulse: {pulse} bpm
              </Text>
              <Text style={{ textAlign: 'center', marginBottom: 10 }}>
                {bpStage.description}
              </Text>
              <Text style={{ textAlign: 'center', fontStyle: 'italic', marginBottom: 15 }}>
                {bpStage.recommendation}
              </Text>
              
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: bpStage.color }]}
                onPress={handleSaveRecord}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    💾 Save Record
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Graph Component */}
          {renderGraph()}

          {/* AHA Guidelines Table */}
          {renderBPGuidelinesTable()}

          {/* Records List with Delete Feature */}
          {renderRecordsList()}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BloodPressureScreen;