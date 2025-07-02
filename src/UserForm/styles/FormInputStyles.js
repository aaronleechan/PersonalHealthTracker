// styles/FormInputStyles.js
import { StyleSheet } from 'react-native';

export const formInputStyles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#2c3e50',
  },
  inputError: {
    borderColor: '#e74c3c',
    backgroundColor: '#fdf2f2',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  helperText: {
    color: '#95a5a6',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});