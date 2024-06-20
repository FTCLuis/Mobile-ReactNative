import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importe o ícone desejado
import getStyles from './style';

interface ModalProps {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
  onClose: () => void;
}

const AlertModal: React.FC<ModalProps> = ({ visible, message, type, onClose }) => {
  const styles = getStyles(type);

  useEffect(() => {
    let timer: number;
    if (visible) {
      timer = setTimeout(() => {
        onClose();
      }, 1700);
    }
  }, [visible, onClose]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, styles[type]]}>
          <Text style={styles.modalText}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={20} color="#fff" /> {/* Ícone de fechar */}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;