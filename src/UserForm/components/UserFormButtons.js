// components/UserFormButtons.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { userFormButtonsStyles } from '../styles/UserFormButtonsStyles';

const UserFormButtons = ({ 
  loading, 
  onSubmit, 
  onBackToLogin 
}) => {
  return (
    <View style={userFormButtonsStyles.buttonContainer}>
      <TouchableOpacity
        style={[userFormButtonsStyles.primaryButton, loading && userFormButtonsStyles.buttonDisabled]}
        onPress={onSubmit}
        disabled={loading}
      >
        <Text style={userFormButtonsStyles.primaryButtonText}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={userFormButtonsStyles.secondaryButton}
        onPress={onBackToLogin}
      >
        <Text style={userFormButtonsStyles.secondaryButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserFormButtons;