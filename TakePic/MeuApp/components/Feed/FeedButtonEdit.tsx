import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FeedButtonEditProps {
  onPress: () => void;
}

const FeedButtonEdit: React.FC<FeedButtonEditProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name="create-outline" size={20} color="#4CAF50" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 5,
    marginRight: 1,
  },
});

export default FeedButtonEdit;
