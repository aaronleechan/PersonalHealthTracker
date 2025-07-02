// styles/DividerStyles.js
import { StyleSheet } from 'react-native';

export const dividerStyles = StyleSheet.create({
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#95a5a6',
    fontSize: 14,
    fontWeight: '500',
  },
});