// styles/SignUpSectionStyles.js
import { StyleSheet } from 'react-native';

export const signUpSectionStyles = StyleSheet.create({
  signUpSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
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
  newUserText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 16,
    textAlign: 'center',
  },
  signUpButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#27ae60',
    alignItems: 'center',
    minWidth: 160,
  },
  signUpButtonText: {
    color: '#27ae60',
    fontSize: 16,
    fontWeight: '600',
  },
});