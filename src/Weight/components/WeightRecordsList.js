// components/WeightRecordsList.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useScreen } from '../../../App';
import { weightRecordsListStyles } from '../styles/WeightRecordsListStyles';

const WeightRecordsList = ({ refreshTrigger, onRecordDeleted }) => {
  const db = useSQLiteContext();
  const { userCode } = useScreen();
  const [weightRecords, setWeightRecords] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (user) {
      loadWeightRecords();
    }
  }, [user, refreshTrigger]);

  const loadUserData = async () => {
    try {
      const userData = await db.getFirstAsync(`SELECT * FROM users WHERE code = ?`, [userCode]);
      setUser(userData);
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const loadWeightRecords = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const records = await db.getAllAsync(
        `SELECT id, weight, recordedAt 
         FROM weight_records 
         WHERE userId = ? 
         ORDER BY recordedAt DESC 
         LIMIT 10`,
        [user.id]
      );
      
      console.log('Raw records from DB:', records);
      
      // Calculate BMI for each record since it's not stored in DB
      const recordsWithBMI = records.map(record => {
        const bmi = calculateBMI(record.weight, user.height);
        console.log(`Processing record - Weight: ${record.weight}, BMI: ${bmi}`);
        return {
          id: record.id,
          weight: record.weight,
          recordedAt: record.recordedAt,
          bmi
        };
      });
      
      console.log('Final records with BMI:', recordsWithBMI);
      setWeightRecords(recordsWithBMI);
    } catch (error) {
      console.log('Error loading weight records:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = (weightInLbs, heightInCm) => {
    const weightInKg = weightInLbs * 0.453592;
    const heightInM = heightInCm / 100;
    const bmiValue = weightInKg / (heightInM * heightInM);
    return parseFloat(bmiValue.toFixed(1));
  };

  const handleDeleteRecord = (record) => {
    const displayDate = new Date(record.recordedAt).toLocaleDateString();
    
    Alert.alert(
      'Delete Weight Record',
      `Are you sure you want to delete this weight record?\n\nWeight: ${record.weight} lbs\nDate: ${displayDate}`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteRecord(record)
        }
      ]
    );
  };

  const deleteRecord = async (record) => {
    try {
      // Only delete from database if the record has a valid ID
      if (record.id) {
        await db.runAsync(`DELETE FROM weight_records WHERE id = ?`, [record.id]);
      }
      
      // Reload records after deletion
      loadWeightRecords();
      
      // Notify parent component that a record was deleted
      if (onRecordDeleted) {
        onRecordDeleted();
      }
      
      Alert.alert('Success', 'Weight record deleted successfully!');
    } catch (error) {
      console.log('Error deleting record:', error);
      Alert.alert('Error', 'Failed to delete weight record');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBMICategory = (bmiValue) => {
    if (bmiValue < 18.5) return { category: 'Underweight', color: '#3498db' };
    if (bmiValue < 25) return { category: 'Normal', color: '#27ae60' };
    if (bmiValue < 30) return { category: 'Overweight', color: '#f39c12' };
    return { category: 'Obese', color: '#e74c3c' };
  };

  const renderWeightRecord = (item) => {
    console.log(item);
    
    const bmiCategory = getBMICategory(item.bmi);
    
    return (
      <View key={item.id} style={weightRecordsListStyles.recordItem}>
        <View style={weightRecordsListStyles.recordInfo}>
          <View style={weightRecordsListStyles.recordHeader}>
            <Text style={weightRecordsListStyles.weightText}>{item.weight} lbs</Text>
            <Text style={weightRecordsListStyles.dateText}>{formatDate(item.recordedAt)}</Text>
          </View>
          <View style={weightRecordsListStyles.bmiInfo}>
            <Text style={weightRecordsListStyles.bmiLabel}>BMI: </Text>
            <Text style={[weightRecordsListStyles.bmiValue, { color: bmiCategory.color }]}>
              {item.bmi} ({bmiCategory.category})
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={weightRecordsListStyles.deleteButton}
          onPress={() => handleDeleteRecord(item)}
        >
          <Text style={weightRecordsListStyles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (weightRecords.length === 0 && !loading) {
    return (
      <View style={weightRecordsListStyles.container}>
        <View style={weightRecordsListStyles.header}>
          <Text style={weightRecordsListStyles.title}>Recent Weight Records</Text>
        </View>
        <View style={weightRecordsListStyles.emptyState}>
          <Text style={weightRecordsListStyles.emptyText}>📝</Text>
          <Text style={weightRecordsListStyles.emptyTitle}>No Records Yet</Text>
          <Text style={weightRecordsListStyles.emptySubtitle}>
            Start tracking your weight to see your records here
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={weightRecordsListStyles.container}>
      <View style={weightRecordsListStyles.header}>
        <Text style={weightRecordsListStyles.title}>Recent Weight Records</Text>
        <Text style={weightRecordsListStyles.subtitle}>Tap 🗑️ to delete a record</Text>
      </View>
      
      <View style={weightRecordsListStyles.listContainer}>
        {weightRecords.map((item) => renderWeightRecord(item))}
      </View>
    </View>
  );
};

export default WeightRecordsList;