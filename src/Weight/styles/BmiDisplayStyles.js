// styles/BMIDisplayStyles.js
import { StyleSheet } from 'react-native';

export const bmiDisplayStyles = StyleSheet.create({
  bmiCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bmiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bmiTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  bmiValueContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bmiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  bmiCategory: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  bmiDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#27ae60',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#229954',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  saveTapHint: {
    color: '#ffffff',
    fontSize: 11,
    opacity: 0.8,
    marginTop: 2,
    fontStyle: 'italic',
  },
});