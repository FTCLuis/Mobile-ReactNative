import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FeedButtonDeletePostProps {
    postId: string;
    onDelete: (postId: string) => void;
    deleting: boolean;
}

const FeedButtonDeletePost: React.FC<FeedButtonDeletePostProps> = ({ postId, onDelete, deleting }) => {
    const handlePress = () => {
        onDelete(postId);
    };
    return (
        <TouchableOpacity style={styles.button} onPress={handlePress} disabled={deleting}>
            {deleting ? (
                <Text style={styles.deletingText}>Excluindo...</Text>
            ) : (
                <>
                    <Ionicons name="trash-outline" size={20} color="#F44336" />
                    <Text style={styles.buttonText}>Deletar</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffcccc',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        justifyContent: 'center'
    },
    buttonText: {
        color: '#F44336',
        marginLeft: 5
    },
    deletingText: {
        color: '#F44336',
    },
});

export default FeedButtonDeletePost;