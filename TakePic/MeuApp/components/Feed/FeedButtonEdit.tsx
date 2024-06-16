import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FeedButtonEdit: React.FC = () => {
  return (
    <TouchableOpacity style={styles.button}>
      <Ionicons name="create-outline" size={20} color="#4CAF50" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 5,
    marginRight: 1, // Diminui o espaçamento entre os botões
  },
});

export default FeedButtonEdit;
