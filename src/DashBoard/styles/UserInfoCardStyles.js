// styles/UserInfoCardStyles.js
import { StyleSheet } from 'react-native';

export const userInfoCardStyles = StyleSheet.create({
  userInfoCard: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  userInfoItem: {
    alignItems: 'center',
  },
  userInfoLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  userInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});