import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from "./style";

interface HeaderProps {
  data: {
    textHeader: string;
    icon?: any;
  }
}

const Header: React.FC<HeaderProps> = ({data}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>TakePic</Text>
      <View>
        <TouchableOpacity style={styles.userInfo}>
          <Text style={styles.loginText}>{data.textHeader}</Text>
          {data.icon && <Ionicons name={data.icon} size={24} color="black" style={styles.icon} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default Header;