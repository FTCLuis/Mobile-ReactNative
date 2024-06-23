import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, } from 'react-native';
import styles from './style';
import { SEND_REQUEST, USER_REGISTER } from '../../api/Api';
import { useNavigation } from '@react-navigation/native';
import { Modal } from 'react-native';
import AlertModal from '../alertModal/alertModal';



const CadastrarForm = () => {
    const [usuario, setUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const [modalAlertVisible, setModalAlertVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [MessageType, setMessageType] = useState <'success' | 'error' | 'warning'>('warning');
    const [loading, setLoading] = useState(false);


    // {
    //     "usuario": "Guilherme Saar",
    //     "email": "guilherme.saar@gmail.com",
    //     "senha": "G123",
    //     "dataNasc": "2024-06-22T11:54:51.321Z",
    //     "dataAtual": "2024-06-22T11:54:51.321Z",
    //     "requestRegister": {
    //         "status": true,
    //         "httpCode": 201,
    //         "data": {
    //             "message": "Usuário \"Guilherme Saar\" criado com sucesso."
    //         }
    //     }
    // }

    const cadastrar = async() => {
        if (!usuario || !email || !password) {
            setErrorMessage("Sem Dados!");
            setMessageType("error")
            setModalAlertVisible(true);
            return;
        }

        setLoading(true);

        let getUserRegister = USER_REGISTER ({
            usuario: usuario,
            email: email,
            senha: password,
            dataNasc: new Date(),
            dataAtual: new Date(),
        });

        let requestRegister = await SEND_REQUEST(getUserRegister.url, getUserRegister.options);
        if (!requestRegister.status) {
            setErrorMessage("Erro na chamada da API: " + requestRegister.error);
            setMessageType("error")
            setModalAlertVisible(true);
            setLoading(false);
            return;
        }
    
        if (!requestRegister.data) {
            setErrorMessage("Erro na chamada da API: " + JSON.stringify(requestRegister));
            setMessageType("error")
            setModalAlertVisible(true);
            setLoading(false);
            return;
        }
        
        setErrorMessage("Usuário criado com sucesso!");
        setMessageType("success")
        setModalAlertVisible(true);
        setLoading(false);

        // redireciona para a pagina de login
        navigation.navigate('LoginScreen' as never); //home
        return;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Usuário</Text>
            <TextInput onChangeText={(usuario) => setUsuario(usuario)} style={styles.input} />

            <Text style={styles.label}>Email</Text>
            <TextInput onChangeText={(email) => setEmail(email)} style={styles.input} />

            <Text style={styles.label}>Senha</Text>
            <TextInput onChangeText={(password) => setPassword(password)} style={styles.input} secureTextEntry />

            <TouchableOpacity onPress={cadastrar}>
                <Text  style={styles.button}>Cadastrar</Text>
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

             
            <View>  
                <AlertModal visible={modalAlertVisible} message={errorMessage} type={MessageType} onClose={() => setModalAlertVisible(false)} />
            </View>
        </View>
    );
};

export default CadastrarForm;