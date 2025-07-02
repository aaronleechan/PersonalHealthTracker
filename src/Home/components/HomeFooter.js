// components/HomeFooter.js
import React from 'react';
import { View, Text } from 'react-native';
import { homeFooterStyles } from '../styles/HomeFooterStyles';

const HomeFooter = ({ text = "Track your fitness journey with ease" }) => {
  return (
    <View style={homeFooterStyles.footer}>
      <Text style={homeFooterStyles.footerText}>{text}</Text>
    </View>
  );
};

export default HomeFooter;