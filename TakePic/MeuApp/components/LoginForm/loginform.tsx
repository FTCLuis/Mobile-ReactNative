import React from 'react';
import { View, Text, TextInput, TouchableOpacity} from 'react-native';
import styles from './style';

const LoginForm = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} />

      <Text style={styles.label}>Senha</Text>
      <TextInput style={styles.input} secureTextEntry />

      <TouchableOpacity>
		    <Text style={styles.button}>Entrar</Text>
		  </TouchableOpacity>


    </View>
  );
};

export default LoginForm;
