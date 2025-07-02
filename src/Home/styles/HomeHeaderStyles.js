// styles/HomeHeaderStyles.js
import { StyleSheet } from 'react-native';

export const homeHeaderStyles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
  },
});