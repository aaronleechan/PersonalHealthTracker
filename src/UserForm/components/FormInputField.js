// components/FormInputField.js
import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { formInputStyles } from '../styles/FormInputStyles';

const FormInputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helperText,
  keyboardType = 'default',
  maxLength,
  autoCapitalize = 'sentences',
  ...textInputProps
}) => {
  return (
    <View style={formInputStyles.inputContainer}>
      <Text style={formInputStyles.label}>{label}</Text>
      <TextInput
        style={[formInputStyles.input, error && formInputStyles.inputError]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        {...textInputProps}
      />
      {error && <Text style={formInputStyles.errorText}>{error}</Text>}
      {helperText && <Text style={formInputStyles.helperText}>{helperText}</Text>}
    </View>
  );
};

export default FormInputField;