// components/UserInfoCard.js
import React from 'react';
import { View, Text } from 'react-native';
import { userInfoCardStyles } from '../styles/UserInfoCardStyles';

const UserInfoCard = ({ user }) => {
  if (!user) return null;

  return (
    <View style={userInfoCardStyles.userInfoCard}>
      <View style={userInfoCardStyles.userInfoRow}>
        <View style={userInfoCardStyles.userInfoItem}>
          <Text style={userInfoCardStyles.userInfoLabel}>Age</Text>
          <Text style={userInfoCardStyles.userInfoValue}>{user.age}</Text>
        </View>
        <View style={userInfoCardStyles.userInfoItem}>
          <Text style={userInfoCardStyles.userInfoLabel}>Height</Text>
          <Text style={userInfoCardStyles.userInfoValue}>{user.height} cm</Text>
        </View>
        {user.weight && (
          <View style={userInfoCardStyles.userInfoItem}>
            <Text style={userInfoCardStyles.userInfoLabel}>Weight</Text>
            <Text style={userInfoCardStyles.userInfoValue}>{user.weight} kg</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default UserInfoCard;