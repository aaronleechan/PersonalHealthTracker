// components/WeightHeader.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { headerStyles } from '../styles/HeaderStyles';

const WeightHeader = ({ onBack }) => {
  return (
    <View style={headerStyles.header}>
      <TouchableOpacity style={headerStyles.backButton} onPress={onBack}>
        <Text style={headerStyles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <Text style={headerStyles.title}>Weight Entry</Text>
      <Text style={headerStyles.subtitle}>Track your weight in pounds (lb)</Text>
    </View>
  );
};

export default WeightHeader;