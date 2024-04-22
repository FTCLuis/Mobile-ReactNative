import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, } from 'react-native';
import styles from './style';
import { SEND_REQUEST, USER_REGISTER } from '../../api/Api';
import { useNavigation } from '@react-navigation/native';



const CadastrarForm = () => {
    const [usuario, setUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const cadastrar = async() => {
        if (!usuario || !email || !password) {
            console.log("Sem Dados");
            // tratativa aqui
            return;
        }

        let getUserRegister = USER_REGISTER ({
            usuario: usuario,
            email: email,
            senha: password,
            dataNasc: new Date(),
            dataAtual: new Date(),
        });

        let requestRegister = await SEND_REQUEST(getUserRegister.url, getUserRegister.options);
        if (!requestRegister.status) {
            console.log(requestRegister.error)
            // colocar tratativa aqui
            return;
        }
    
        if (!requestRegister.data) {
            console.log("sem data")
            console.log(requestRegister)
            // tratativa aqui
            return;
        }
        
        console.log({
            usuario: usuario,
            email: email,
            senha: password,
            dataNasc: new Date(),
            dataAtual: new Date(),
            requestRegister: requestRegister
        })

        // //redireciona para a pagina de login
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
        </View>
    );
};

export default CadastrarForm;