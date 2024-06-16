import React from 'react';
import { Modal, View, StyleSheet, Text, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importe os ícones que deseja utilizar

interface FeedModalProps {
  visible: boolean;
  photo: {
    pathFotoPost: string;
  } | null;
  onClose: () => void;
}

const FeedModal: React.FC<FeedModalProps> = ({ visible, photo, onClose }) => {
  if (!visible || !photo) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose} // Apenas para Android
    >
      <View style={styles.modalBackground}>
        <View style={styles.innerModalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={30} color="#333" />
          </TouchableOpacity>
          <View style={styles.modalImageContainer}>
            <Image source={{ uri: photo.pathFotoPost }} style={styles.modalImage} resizeMode="contain" />
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro semi-transparente
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
  },
  modalImageContainer: {
    width: '100%',
    aspectRatio: 1, // Mantém a proporção da imagem (1:1)
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  modalImage: {
    width: '100%',
    height: undefined, // Altura undefined para permitir o ajuste automático
    aspectRatio: 1, // Mantém a proporção da imagem (1:1)
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
