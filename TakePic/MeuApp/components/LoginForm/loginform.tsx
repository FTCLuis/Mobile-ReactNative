import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from './style';
import { GET_POSTS, SEND_REQUEST, TOKEN_POST, USER_GET, USER_REGISTER } from '../../api/Api';   
import { useUser } from '../../provider/userProvider';
import { useNavigation } from '@react-navigation/native';


const LoginForm = () => {
  const user = useUser(); 
  const navigation = useNavigation();

  useEffect(() => {
    if (user.isLogged) {
      navigation.navigate('CadastroScreen' as never); //home
    }
  }, [user.isLogged, navigation]); 
  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  const login = async () => {
    if ( !email || !password ) {
      console.log("Sem Dados");
      // tratativa aqui
      return;
    }

    let getTokenData = await TOKEN_POST({"email": email, "senha": password});
    let requestToken = await SEND_REQUEST(getTokenData.url, getTokenData.options);
    if (!requestToken.status) {
      console.log(requestToken.error)
      // colocar tratativa aqui
      return;
    }

    if (!requestToken.data || !requestToken.data.access_token) {
      // tratativa aqui
      return;
    }

    let getUser = USER_GET(requestToken.data.access_token, email)
    let requestUser = await SEND_REQUEST(getUser.url, getUser.options);
    if (!requestUser.status) {
      console.log(requestUser.error)
      // colocar tratativa aqui
      return;
    }

    if (!requestUser.data) {
      // tratativa aqui
      return;
    }

    user.toggleLogged()
    requestUser.data.token = requestToken.data.access_token
    user.setUser(requestUser.data)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput onChangeText={(email) => setEmail(email)} value={email} style={styles.input} />

      <Text style={styles.label}>Senha</Text>
      <TextInput onChangeText={(password) => setPassword(password)} value={password} style={styles.input} secureTextEntry />

      <TouchableOpacity onPress={login}>
        <Text style={styles.button}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;
