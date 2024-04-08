import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './style';
import { useNavigation } from '@react-navigation/native';

interface FooterProps {
  data: {
    text: string;
    text2: string;
  };
}


const Footer: React.FC<FooterProps> = ({data}) => {

  const navigation = useNavigation();

  const redirecionarPagina = () => {
    if (data.text2 === "cadastrar") {
      navigation.navigate('CadastroScreen');
    } else {
      navigation.navigate('LoginScreen');
    }
  };

  return (
    <View style={styles.container}>
      <Text> {data.text} 
        <TouchableOpacity onPress={redirecionarPagina}>
          <Text style={styles.signupText}>Clique aqui </Text>
        </TouchableOpacity>
        para {data.text2}
      </Text>
    </View>
  );
};

export default Footer;
