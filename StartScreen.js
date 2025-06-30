// StartScreen.js
import React, { useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';

const StartScreen = ({ onSignUp, onUser }) => {
  const db = useSQLiteContext();
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');

  const handleExistingUser = async () => {

    if (!code) {
      Alert.alert("Please enter your code");
      return;
    }

    try{
        const user = await db.getFirstAsync(`SELECT * FROM users WHERE code = ?`, [code]);
        console.log(user);
        if (user){
            onUser();
            alert(`Welcome back, the current user with code: ${user.name}`);
        }
        else{
            setMsg(`No user found with that code`);
        }
    }catch(e){
        console.log(e);
        Alert.alert('Error', e.message || 'An error occurred while adding the user.');
    }
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Code (if existing user)"
        value={code}
        onChangeText={setCode}
      />
        <View style={styles.buttonGroup}>
            <View style={styles.createButtonWrapper}>
                <Button title="Enter" onPress={handleExistingUser} color="#2196F3" />
            </View>

            <View style={styles.mainPageButtonWrapper}>
                <Button title="Sign Up" onPress={onSignUp} color="#4CAF50" />
            </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 100,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonGroup: {
    marginTop: 20,
    width: '100%',
  },
  createButtonWrapper: {
    marginBottom: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },  
  mainPageButtonWrapper: {
    borderRadius: 5,
    overflow: 'hidden',
  }
});

export default StartScreen;
