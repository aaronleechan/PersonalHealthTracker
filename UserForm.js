import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

const UserForm = () => {
  const [form, setForm] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    code: '',
    createdAt: new Date().toISOString(),
  });

  const db = useSQLiteContext();

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const { name, age, height, weight, code, createdAt } = form;

      if (!name || !age || !height || !weight || !code) {
        throw new Error('All fields are required');
      }

      await db.runAsync(
        `
        INSERT INTO users (name, age, height, weight, code, createdAt)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [name, age, height, weight, code, createdAt]
      );

      Alert.alert(`User ${name} has been created successfully!`);

      setForm({
        name: '',
        age: '',
        height: '',
        code: '',
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.log(e);
      Alert.alert('Error', e.message || 'An error occurred while adding the user.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Name" value={form.name} onChangeText={(text) => setForm({...form, name: text})} />
      <TextInput style={styles.input} placeholder="Age" value={form.age} onChangeText={(text) => setForm({...form, age: text})} />
      <TextInput style={styles.input} placeholder="Height" value={form.height} onChangeText={(text) => setForm({...form, height: text})} />
      <TextInput style={styles.input} placeholder="Code" value={form.code} onChangeText={(text) => setForm({...form, code: text})} />
      <Button title="Create User" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: `#fff`,
    borderRadius: 10,
    shadowColor: `#000`,
    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  }
});

export default UserForm;
