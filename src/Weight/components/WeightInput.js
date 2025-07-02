// components/WeightInput.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { inputCardStyles } from '../styles/InputCardStyles';

const WeightInput = ({ 
  weight, 
  onWeightChange, 
  onCalculate, 
  loading 
}) => {
  return (
    <View style={inputCardStyles.inputCard}>
      <Text style={inputCardStyles.inputLabel}>Enter Your Weight</Text>
      
      <View style={inputCardStyles.inputContainer}>
        <TextInput
          style={inputCardStyles.weightInput}
          placeholder="0"
          value={weight}
          onChangeText={onWeightChange}
          keyboardType="decimal-pad"
          maxLength={6}
          textAlign="center"
        />
        <Text style={inputCardStyles.unitLabel}>lbs</Text>
      </View>

      <TouchableOpacity
        style={[inputCardStyles.calculateButton, loading && inputCardStyles.buttonDisabled]}
        onPress={onCalculate}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={inputCardStyles.calculateButtonText}>
          {loading ? '⏳ Calculating...' : '🧮 Calculate BMI'}
        </Text>
        {!loading && <Text style={inputCardStyles.tapHint}>Tap to calculate</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default WeightInput;