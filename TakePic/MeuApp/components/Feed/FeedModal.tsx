import React from 'react';
import { Modal, View, StyleSheet, Text, TouchableOpacity, Image, TextInput, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../provider/userProvider';
import FeedButtonEdit from './FeedButtonEdit';
import FeedButtonDelete from './FeedButtonDelete';

interface FeedModalProps {
  visible: boolean;
  photo: {
    pathFotoPost: string;
    comentarios: { _id: string; comentarioTexto: string; usuario: string }[];
  } | null;
  onClose: () => void;
}

const FeedModal: React.FC<FeedModalProps> = ({ visible, photo, onClose }) => {
  if (!visible || !photo) return null;

  const user = useUser();
  const currentUser = user.getUser().usuario;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.innerModalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={30} color="#333" />
          </TouchableOpacity>
          <View style={styles.modalImageContainer}>
            <Image source={{ uri: photo.pathFotoPost }} style={styles.modalImage} resizeMode="contain" />
          </View>
          <ScrollView style={styles.commentsContainer}>
            {photo.comentarios.map((comentario) => (
              <View key={comentario._id} style={styles.comment}>
                <View style={styles.commentTextContainer}>
                  <Text style={styles.commentText}>
                    <Text style={styles.commentUser}>{comentario.usuario}: </Text>
                    {comentario.comentarioTexto}
                  </Text>
                  {comentario.usuario === currentUser && (
                    <View style={styles.buttonContainer}>
                      <FeedButtonEdit />
                      <FeedButtonDelete />
                    </View>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Digite seu comentário..."
              style={styles.commentInput}
              multiline
            />
            <TouchableOpacity style={styles.postButton}>
              <Text style={styles.postButtonText}>Postar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerModalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    maxHeight: '80%',
  },
  modalImageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  modalImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  commentsContainer: {
    maxHeight: 200,
    marginBottom: 10,
  },
  comment: {
    marginBottom: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 10,
  },
  commentTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  commentUser: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  modalContent: {
    width: '100%',
  },
  commentInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  postButton: {
    backgroundColor: '#ff1493',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});

export default FeedModal;
