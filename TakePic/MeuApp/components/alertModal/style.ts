import { StyleSheet } from 'react-native';

const getStyles = (type: 'success' | 'error' | 'warning') => {

  let ModalbackgroundColor;
  switch (type) {
    case 'success':
      ModalbackgroundColor = '#4CAF50';
      break;
    case 'error':
      ModalbackgroundColor = '#F44336';
      break;
    case 'warning':
      ModalbackgroundColor = 'hotpink';
      break;
    default:
      ModalbackgroundColor = 'hotpink';
      break;
  }

  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-start', // Alteração aqui
      alignItems: 'flex-end', // Adição aqui
      marginTop: 30, // Adição aqui (opcional: para adicionar um espaço entre o modal e o topo)
      marginRight: 10, // Adição aqui
    },
    modalContent: {
      backgroundColor: ModalbackgroundColor.toString(),
      paddingVertical: 13,
      paddingHorizontal: 30,
      borderRadius: 10,
      position: 'relative',
    },
    modalText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: 0,
      right: 0,
      padding: 2,
      alignSelf: 'flex-end',
    },
    closeButtonText: {
      color: 'gray',
      fontSize: 16,
    },
  });
};

export default getStyles;