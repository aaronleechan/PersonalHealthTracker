// components/UserFormHeader.js
import React from 'react';
import { View, Text } from 'react-native';
import { userFormHeaderStyles } from '../styles/UserFormHeaderStyles';

const UserFormHeader = () => {
  return (
    <View style={userFormHeaderStyles.header}>
      <Text style={userFormHeaderStyles.title}>Create Account</Text>
      <Text style={userFormHeaderStyles.subtitle}>Tell us a bit about yourself</Text>
    </View>
  );
};

export default UserFormHeader;