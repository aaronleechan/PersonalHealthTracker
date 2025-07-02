// components/SignUpSection.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { signUpSectionStyles } from '../styles/SignUpSectionStyles';

const SignUpSection = ({ onSignUp }) => {
  return (
    <View style={signUpSectionStyles.signUpSection}>
      <Text style={signUpSectionStyles.newUserText}>New to Health Tracker?</Text>
      <TouchableOpacity
        style={signUpSectionStyles.signUpButton}
        onPress={onSignUp}
      >
        <Text style={signUpSectionStyles.signUpButtonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpSection;