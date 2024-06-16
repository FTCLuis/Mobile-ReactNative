import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FeedButtonDelete: React.FC = () => {
  return (
    <TouchableOpacity style={styles.button}>
      <Ionicons name="trash-outline" size={20} color="#F44336" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 5,
    marginLeft: 1, // Diminui o espaçamento entre os botões
  },
});

export default FeedButtonDelete;
