import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from './style';
import { GET_POSTS, SEND_REQUEST, TOKEN_POST, USER_GET, USER_REGISTER } from '../../api/Api';

const LoginForm = () => {
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const cadastrar = async() => {
    let getUserRegister = USER_REGISTER ({
      usuario: "TESTEtesteTeste",
      email: email,
      senha: password,
      dataNasc: new Date(),
      dataAtual: new Date(),
    });
    let requestRegister = await SEND_REQUEST(getUserRegister.url, getUserRegister.options);
    
    console.log({
      usuario: "TESTEtesteTeste",
      email: email,
      senha: password,
      dataNasc: new Date(),
      dataAtual: new Date(),
      requestRegister: requestRegister
    })
    // TESTEteste
    // TESTE
    // TESTEtesteTeste

  //   {
  //     "usuario": "TESTEtesteTeste",
  //     "email": "teste@teste",
  //     "senha": "teste123",
  //     "dataNasc": "2024-04-19T23:40:57.432Z",
  //     "dataAtual": "2024-04-19T23:40:57.432Z",
  //     "requestRegister": {
  //         "status": true,
  //         "httpCode": 201,
  //         "data": {
  //             "message": "Usuário \"TESTEtesteTeste\" criado com sucesso."
  //         }
  //     }
  // }
    return;
  }

  const login = async () => {

 

    let getTokenData = await TOKEN_POST({"email": email, "senha": password});
    let requestToken = await SEND_REQUEST(getTokenData.url, getTokenData.options);
    if (!requestToken.status) {
      console.log({
        user: email,
        senha: password
      });
      // colocar tratativa aqui
      return;
    }

    if (!requestToken.data || !requestToken.data.access_token) {
      console.log({
        user: email,
        senha: password,
        requestToken: requestToken
      });
      // tratativa aqui
      return;
    }

    setToken(requestToken.data.access_token);
    
    let getUser = USER_GET(token, email)
    let requestUser = await SEND_REQUEST(getUser.url, getUser.options);
    if (!requestUser.status) {
      console.log({
        token: token,
        email: email
      });
      // colocar tratativa aqui
      return;
    }

    console.log({
      getPosts: getUser,
      request: requestUser
    });
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
