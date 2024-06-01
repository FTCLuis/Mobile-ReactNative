import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../provider/userProvider';
import { userModel } from '../models/userModel';

const MinhaConta = () => {
    const user: userModel | void = useUser().getUser(); 


    console.log(user?.usuario)
    


    return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TakePic</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Luis Felipe</Text>
          <Ionicons name="person-circle-outline" size={24} color="black" />
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Minha Conta</Text>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="add-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="log-out-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    marginRight: 8,
    fontSize: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    margin: 8,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
    elevation: 2,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e3e3e3',
  },
  footerText: {
    fontSize: 16,
    color: '#888',
  },
});

export default MinhaConta;