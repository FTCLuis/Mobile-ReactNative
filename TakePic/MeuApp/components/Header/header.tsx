import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from "./style";
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  data: {
    textHeader: string;
    icon?: string;
  }
}

const Header: React.FC<HeaderProps> = ({data}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.userInfo} onPress={() => {{data.icon && navigation.navigate('FeedGeralScreen' as never)}}}>
        <Text style={styles.logoText}>TakePic</Text>
      </TouchableOpacity>

      <View>
        <TouchableOpacity style={styles.userInfo} onPress={() => {{data.icon && navigation.navigate('MinhaContaScreen' as never)}}}>
          <Text style={styles.loginText}>{data.textHeader}</Text>
          <Text>{data.icon && <Ionicons name={data.icon} size={24} color="black" style={styles.icon} />}</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};


export default Header;