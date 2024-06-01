import { StyleSheet } from 'react-native';
import { useTheme } from '../../../../providers/themeProvider';

const getStyles = (type: 'success' | 'error' | 'warning') => {
  const theme = useTheme();

  let ModalbackgroundColor;
  switch (type) {
    case 'success':
      ModalbackgroundColor = theme.theme.BackgroundSuccess;
      break;
    case 'error':
      ModalbackgroundColor = theme.theme.BackgroundError;
      break;
    case 'warning':
      ModalbackgroundColor = theme.theme.BackgroundWarning;
      break;
    default:
      ModalbackgroundColor = theme.theme.BackgroundSecondary;
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
      color: theme.theme.ColorPrimary,
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
      color: theme.theme.ColorSecondary,
      fontSize: 16,
    },
  });
};

export default getStyles;