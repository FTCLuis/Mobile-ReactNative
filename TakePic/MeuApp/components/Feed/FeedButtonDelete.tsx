import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FeedButtonDeleteProps {
  commentId: string;
  onDelete: (commentId: string) => void;
  deleting: boolean;
}

const FeedButtonDelete: React.FC<FeedButtonDeleteProps> = ({ commentId, onDelete, deleting }) => {
  const handlePress = () => {
    onDelete(commentId);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress} disabled={deleting}>
      {deleting ? (
        <Text style={styles.deletingText}>Excluindo...</Text>
      ) : (
        <Ionicons name="trash-outline" size={20} color="#F44336" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 5,
    marginLeft: 1, // Diminui o espaçamento entre os botões
  },
  deletingText: {
    color: '#F44336',
    fontSize: 14,
  },
});

export default FeedButtonDelete;
