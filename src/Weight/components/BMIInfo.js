// components/BMIInfo.js
import React from 'react';
import { View, Text } from 'react-native';
import { infoCardStyles } from '../styles/InfoCardStyles';

const BMIInfo = () => {
  const bmiRanges = [
    { color: '#3498db', text: 'Underweight: Below 18.5' },
    { color: '#27ae60', text: 'Normal: 18.5 - 24.9' },
    { color: '#f39c12', text: 'Overweight: 25 - 29.9' },
    { color: '#e74c3c', text: 'Obese: 30 and above' }
  ];

  return (
    <View style={infoCardStyles.infoCard}>
      <Text style={infoCardStyles.infoTitle}>BMI Categories</Text>
      <View style={infoCardStyles.bmiRanges}>
        {bmiRanges.map((range, index) => (
          <View key={index} style={infoCardStyles.bmiRange}>
            <View style={[infoCardStyles.colorIndicator, { backgroundColor: range.color }]} />
            <Text style={infoCardStyles.rangeText}>{range.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default BMIInfo;