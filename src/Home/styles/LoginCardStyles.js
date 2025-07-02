// styles/LoginCardStyles.js
import { StyleSheet } from 'react-native';

export const loginCardStyles = StyleSheet.create({
  loginCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 24,
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
    marginTop: 6,
    marginLeft: 4,
  },
  loginButton: {
    backgroundColor: '#3498db',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});