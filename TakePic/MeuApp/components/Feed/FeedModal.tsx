import React, { useState } from 'react';
import { Modal, View, StyleSheet, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../provider/userProvider';
import FeedButtonEdit from './FeedButtonEdit';
import FeedButtonDelete from './FeedButtonDelete';
import { CREATE_COMMENT, DELETE_COMMENT, PHOTO_EDIT_COMMENT } from '../../api/Api';
import useFetch from '../../Hooks/useFetch';
import Error from '../Helper/Error';

interface FeedModalProps {
  visible: boolean;
  photo: {
    pathFotoPost: string;
    comentarios: { _id: string; comentarioTexto: string; usuario: string }[];
    _id: string;
  } | null;
  onClose: () => void;
}

const FeedModal: React.FC<FeedModalProps> = ({ visible, photo, onClose }) => {
  if (!visible || !photo) return null;

  const user = useUser();
  const currentUser = user.getUser().usuario;
  const { request, loading: postingLoading, error } = useFetch();
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentText, setEditedCommentText] = useState('');
  const [commentText, setCommentText] = useState('');
  const [postingComment, setPostingComment] = useState(false); 

  const handlePostComment = async () => {
    if (!commentText.trim()) return;

    const token = user.getUser().token;
    if (!token) {
      console.error("Token not found");
      return;
    }

    const { url, options } = CREATE_COMMENT(
      {
        usuario: currentUser,
        comentarioTexto: commentText,
      },
      photo._id,
      token,
    );

    setPostingComment(true); 

    const { response, json } = await request(url, options);
    if (response && response.ok) {
      setCommentText('');
      // Atualizar a lista de comentários
      photo.comentarios.push(json);
    } else {
      console.error("Failed to post comment");
    }

    setPostingComment(false); 
  };

  const handleDeleteComment = async (commentId: string) => {
    setDeletingCommentId(commentId);
    const token = user.getUser().token;
    if (!token) {
      console.error("Token not found");
      return;
    }

    const { url, options } = DELETE_COMMENT(commentId, token);
    const { response } = await request(url, options);
    if (response && response.ok) {
      const updatedComments = photo.comentarios.filter((comment) => comment._id !== commentId);
      photo.comentarios = updatedComments;
    } else {
      console.error("Failed to delete comment");
    }
    setDeletingCommentId(null);
  };

  const handleStartEditingComment = (commentId: string, initialCommentText: string) => {
    setEditingCommentId(commentId);
    setEditedCommentText(initialCommentText);
  };

  const handleCancelEditingComment = () => {
    setEditingCommentId(null);
    setEditedCommentText('');
  };

  const handleSaveEditedComment = async (commentId: string) => {
    const token = user.getUser().token;
    if (!token) {
      console.error("Token not found");
      return;
    }

    const { url, options } = PHOTO_EDIT_COMMENT(
      {
        comentarioTexto: editedCommentText,
      },
      token,
      commentId,
      photo._id,
    );

    const { response } = await request(url, options);
    if (response && response.ok) {
      const updatedComments = photo.comentarios.map((comment) =>
        comment._id === commentId ? { ...comment, comentarioTexto: editedCommentText } : comment
      );
      photo.comentarios = updatedComments;
      setEditingCommentId(null);
      setEditedCommentText('');
    } else {
      console.error("Failed to edit comment");
    }
  };

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
                  {editingCommentId === comentario._id ? (
                    <View style={styles.editContainer}>
                      <TextInput
                        style={styles.editInput}
                        value={editedCommentText}
                        onChangeText={setEditedCommentText}
                      />
                      <TouchableOpacity onPress={() => handleSaveEditedComment(comentario._id)}>
                        <Ionicons name="checkmark" size={24} color="#4CAF50" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleCancelEditingComment}>
                        <Ionicons name="close" size={24} color="#F44336" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <Text style={styles.commentText}>
                        <Text style={styles.commentUser}>{comentario.usuario}: </Text>
                        {comentario.comentarioTexto}
                      </Text>
                      {comentario.usuario === currentUser && (
                        <View style={styles.buttonContainer}>
                          <FeedButtonEdit
                            onPress={() => handleStartEditingComment(comentario._id, comentario.comentarioTexto)}
                          />
                          <FeedButtonDelete
                            commentId={comentario._id}
                            onDelete={handleDeleteComment}
                            deleting={deletingCommentId === comentario._id}
                          />
                        </View>
                      )}
                    </>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
          {error && <Error error={error} />}
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Digite seu comentário..."
              style={styles.commentInput}
              multiline
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity
              style={styles.postButton}
              onPress={handlePostComment}
              disabled={postingLoading || postingComment} 
            >
              <Text style={styles.postButtonText}>
                {postingComment ? 'Postando...' : 'Postar'}
              </Text>
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
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
    fontSize: 14,
  },
});

export default FeedModal;
