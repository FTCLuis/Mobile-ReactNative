import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from "./style";

const Header = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>TakePic</Text>
      <TouchableOpacity>
        <Text style={styles.loginText}>Login / Registrar-se</Text>
      </TouchableOpacity>
    </View>
  );
};


export default Header;