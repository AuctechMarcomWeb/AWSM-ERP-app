import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MembersScreen = ({ route }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Members</Text>
      <Text style={styles.placeholder}>Screen content for Members</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  placeholder: { fontSize: 16, color: '#666' },
});

export default MembersScreen;
