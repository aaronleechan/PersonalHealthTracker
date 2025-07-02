// components/LoginCard.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { loginCardStyles } from '../styles/LoginCardStyles';

const LoginCard = ({ 
  code, 
  onCodeChange, 
  errorMessage, 
  loading, 
  onLogin 
}) => {
  return (
    <View style={loginCardStyles.loginCard}>
      <View style={loginCardStyles.inputContainer}>
        <Text style={loginCardStyles.label}>Your Code</Text>
        <TextInput
          style={[loginCardStyles.input, errorMessage && loginCardStyles.inputError]}
          placeholder="Enter your unique code"
          value={code}
          onChangeText={onCodeChange}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={20}
        />
        {errorMessage ? <Text style={loginCardStyles.errorText}>{errorMessage}</Text> : null}
      </View>

      <TouchableOpacity
        style={[loginCardStyles.loginButton, loading && loginCardStyles.buttonDisabled]}
        onPress={onLogin}
        disabled={loading}
      >
        <Text style={loginCardStyles.loginButtonText}>
          {loading ? 'Checking...' : 'Sign In'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginCard;