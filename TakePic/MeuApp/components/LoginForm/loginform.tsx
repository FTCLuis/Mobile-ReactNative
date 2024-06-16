import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import styles from './style';
import { SEND_REQUEST, TOKEN_POST, USER_GET } from '../../api/Api';   
import { useUser } from '../../provider/userProvider';
import { useNavigation } from '@react-navigation/native';
import AlertModal from '../alertModal/alertModal';


const LoginForm = () => {
  const user = useUser(); 
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [MessageType, setMessageType] = useState <'success' | 'error' | 'warning'>('warning');

  useEffect(() => {
    if (user.isLogged) {
      navigation.navigate('FeedGeralScreen' as never); //home
    }
  }, [user.isLogged, navigation]); 
  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  const login = async () => {
    if ( !email || !password ) {
      setErrorMessage("Algum campo não foi informado!");
      setMessageType("error")
      setModalVisible(true); 
      return;
    }

    setLoading(true);
    let getTokenData = await TOKEN_POST({"email": email, "senha": password});
    let requestToken = await SEND_REQUEST(getTokenData.url, getTokenData.options);
    if (!requestToken.status) {
      setErrorMessage(requestToken.error ? requestToken.error : 'Erro ao fazer login');
      setMessageType("error")
      setModalVisible(true); 
      setLoading(false);
      return;
    }

    if (!requestToken.data || !requestToken.data.access_token) {
      setErrorMessage('Sem Dados!');
      setMessageType("error")
      setLoading(false);
      setModalVisible(true); 
      return;
    }

    let getUser = USER_GET(requestToken.data.access_token, email)
    let requestUser = await SEND_REQUEST(getUser.url, getUser.options);
    if (!requestUser.status) {
      setErrorMessage(requestUser.error ? requestUser.error : 'Erro ao carregar Usuario');
      setMessageType("error")
      setModalVisible(true); 
      setLoading(false);
      return;
    }

    if (!requestUser.data) {
      setErrorMessage('Sem Dados!');
      setMessageType("error")
      setLoading(false);
      setModalVisible(true); 
      return;
    }

    setMessageType("success")
    setErrorMessage('Logado com sucesso!');
    setModalVisible(true); 
    user.toggleLogged()
    requestUser.data.token = requestToken.data.access_token
    user.setUser(requestUser.data)
    setLoading(false);
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

      <Modal
          animationType="fade"
          transparent={true}
          visible={loading}
      >
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
      </Modal>

      <AlertModal visible={modalVisible} message={errorMessage} type={MessageType} onClose={() => setModalVisible(false)} />
    </View>
  );
};

export default LoginForm;
