// components/BMIDisplay.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { inputCardStyles } from '../styles/InputCardStyles';
import { bmiDisplayStyles } from '../styles/BmiDisplayStyles';

const BMIDisplay = ({ 
  showBMI, 
  bmi, 
  bmiCategory, 
  weight, 
  userHeight, 
  loading, 
  onSave 
}) => {
  if (!showBMI || !bmi) return null;

  return (
    <View style={[bmiDisplayStyles.bmiCard, { borderLeftColor: bmiCategory.color }]}>
      <View style={bmiDisplayStyles.bmiHeader}>
        <Text style={bmiDisplayStyles.bmiTitle}>Your BMI Result</Text>
        <View style={[bmiDisplayStyles.bmiValueContainer, { backgroundColor: bmiCategory.color }]}>
          <Text style={bmiDisplayStyles.bmiValue}>{bmi}</Text>
        </View>
      </View>
      <Text style={[bmiDisplayStyles.bmiCategory, { color: bmiCategory.color }]}>
        {bmiCategory.category}
      </Text>
      <Text style={bmiDisplayStyles.bmiDescription}>
        Based on weight: {weight} lb and height: {userHeight} cm
      </Text>
      
      <TouchableOpacity
        style={[bmiDisplayStyles.saveButton, loading && inputCardStyles.buttonDisabled]}
        onPress={onSave}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={bmiDisplayStyles.saveButtonText}>
          {loading ? '⏳ Saving...' : '💾 Save This Record'}
        </Text>
        {!loading && <Text style={bmiDisplayStyles.saveTapHint}>Tap to save</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default BMIDisplay;