import React from 'react';
import { View, Text } from 'react-native';
import styles from './style';

const Footer = () => {
  return (
    <View style={styles.container}>
      <Text>Não possui uma conta? <Text style={styles.signupText}>Clique aqui</Text></Text>
    </View>
  );
};

export default Footer;
