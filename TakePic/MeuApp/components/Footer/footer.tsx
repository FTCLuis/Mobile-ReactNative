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
    if (data.text2 === "Cadastre-se") {
      navigation.navigate('CadastroScreen' as never);
    } else {
      navigation.navigate('LoginScreen' as never);
    }
  };

  return (
    <View style={styles.container}>
      <Text> {data.text} 
        <TouchableOpacity onPress={redirecionarPagina}>
          <Text style={styles.signupText}> {data.text2} aqui </Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

export default Footer;
