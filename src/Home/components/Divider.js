// components/Divider.js
import React from 'react';
import { View, Text } from 'react-native';
import { dividerStyles } from '../styles/DividerStyles';

const Divider = ({ text = "or" }) => {
  return (
    <View style={dividerStyles.dividerContainer}>
      <View style={dividerStyles.dividerLine} />
      <Text style={dividerStyles.dividerText}>{text}</Text>
      <View style={dividerStyles.dividerLine} />
    </View>
  );
};

export default Divider;