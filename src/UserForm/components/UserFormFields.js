// components/UserFormFields.js
import React from 'react';
import { View } from 'react-native';
import FormInputField from './FormInputField';
import { userFormFieldsStyles } from '../styles/UserFormFieldsStyles';

const UserFormFields = ({ form, errors, onFieldChange }) => {
  return (
    <View style={userFormFieldsStyles.form}>
      <FormInputField
        label="Full Name"
        placeholder="Enter your name"
        value={form.name}
        onChangeText={(text) => onFieldChange('name', text)}
        error={errors.name}
        autoCapitalize="words"
      />

      <FormInputField
        label="Age"
        placeholder="Enter your age"
        value={form.age}
        onChangeText={(text) => onFieldChange('age', text)}
        error={errors.age}
        keyboardType="number-pad"
        maxLength={3}
      />

      <FormInputField
        label="Height (cm)"
        placeholder="Enter your height"
        value={form.height}
        onChangeText={(text) => onFieldChange('height', text)}
        error={errors.height}
        keyboardType="decimal-pad"
        maxLength={5}
      />

      <FormInputField
        label="Your Unique Code"
        placeholder="Create a unique code"
        value={form.code}
        onChangeText={(text) => onFieldChange('code', text)}
        error={errors.code}
        helperText="This will be used to access your account"
        autoCapitalize="none"
        maxLength={20}
      />
    </View>
  );
};

export default UserFormFields;