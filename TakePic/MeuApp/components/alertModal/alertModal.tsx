import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import getStyles from './style';

interface ModalProps {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
  onClose: () => void;
}

const AlertModal: React.FC<ModalProps> = ({ visible, message, type, onClose }) => {
  // Definindo um tipo explícito para styles
  const styles = getStyles(type);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (visible) {
      timer = setTimeout(() => {
        onClose();
      }, 1700);
    }

    return () => clearTimeout(timer);
  }, [visible, onClose]);

  // Definindo modalStyle como ViewStyle
  const modalStyle: ViewStyle = styles[type] || {};

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, modalStyle]}>
          <Text style={styles.modalText}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;
