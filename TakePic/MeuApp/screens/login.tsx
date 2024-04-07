import React from 'react';
import { View, Text } from 'react-native';
import Header from '../components/Header/header';
import Footer from '../components/Footer/footer'; 
import LoginForm from '../components/LoginForm/loginform'; 

const LoginPage = () => {
  return (
    <View style={{flex: 1}}>
      <Header />
      <View style={{ paddingHorizontal: 20, flex: 1, marginTop: 26}}>
        <Text style={{ fontSize: 38, marginBottom: 5, marginTop: 10, fontWeight: "bold" }}>Login</Text>
        <View style={{width: 100, backgroundColor: 'hotpink', height: 2, marginBottom: 20 }} />
        <LoginForm />
        <Footer />
      </View>
    </View>
  );
};

export default LoginPage;
