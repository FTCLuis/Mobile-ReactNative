import React from "react";
import { View, Text } from 'react-native';
import Header from '../components/Header/header';
import Footer from '../components/Footer/footer'; 
import CadastrarForm from "../components/CadastrarForm/cadastrarform";

const footerData = {
    text: "Já possui conta? ",
    text2: "Logue-se"
}

const headerData = {
    textHeader: 'Login / Registrar-se',
    icon: ''
}

const CadastroPage = () => {
    return (
        <View style={{flex: 1}}>
            <Header data={headerData}/>
            <View style={{paddingHorizontal: 20, flex: 1, marginTop: 26}}>
                <Text style={{ fontSize: 38, marginBottom: 5, marginTop: 10, fontWeight: "bold" }}>Cadastro</Text>
                <View style={{ width: 155, backgroundColor: 'hotpink', height: 2, marginBottom: 20, marginLeft: 3 }} />
                <CadastrarForm/>
                <Footer data={footerData}/>
            </View>
        </View>
    );
};

export default CadastroPage;