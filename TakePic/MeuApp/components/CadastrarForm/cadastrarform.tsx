import React from 'react';
import { View, Text, TextInput, TouchableOpacity, } from 'react-native';
import styles from './style';

const CadastrarForm = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Usuário</Text>
            <TextInput style={styles.input} />

            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} secureTextEntry />

            <Text style={styles.label}>Data de Nascimento</Text>
            {/* <TextInput style={styles.input} secureTextEntry /> */}

            <Text style={styles.label}>Senha</Text>
            <TextInput style={styles.input} secureTextEntry />

            <TouchableOpacity>
                <Text style={styles.button}>Cadastrar</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CadastrarForm;