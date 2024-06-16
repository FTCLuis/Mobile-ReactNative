import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FeedButtonDeleteProps {
  commentId: string;
  onDelete: (commentId: string) => void;
}

const FeedButtonDelete: React.FC<FeedButtonDeleteProps> = ({ commentId, onDelete }) => {
  const handlePress = () => {
    onDelete(commentId);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Ionicons name="trash-outline" size={20} color="#F44336" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 5,
    marginLeft: 1,
  },
});

export default FeedButtonDelete;
