import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../provider/userProvider';
import { userModel, userPost } from '../models/userModel';
import Header from '../components/Header/header';
import { useNavigation } from '@react-navigation/native';
import CriarPostModal from '../components/criarPostModal/criarPostModal';
import { Image } from 'react-native';

const MinhaConta = () => {

    interface Foto {
      id: string;
      uri: string;
    }

    const user: userModel | void = useUser().getUser(); 
    const { toggleLogged } = useUser()
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false)

    const [fotos, setFotos] = useState([
      { id: '1', uri: 'https://p2.trrsf.com/image/fget/cf/774/0/images.terra.com/2023/09/21/774433979-palmeiras-arena-gremio.jpg' },
      { id: '2', uri: 'https://c4.wallpaperflare.com/wallpaper/685/872/5/soccer-sociedade-esportiva-palmeiras-logo-wallpaper-preview.jpg' },
      { id: '3', uri: 'https://c4.wallpaperflare.com/wallpaper/246/350/412/palestra-italia-palmeiras-wallpaper-preview.jpg' },
      { id: '4', uri: 'https://p2.trrsf.com/image/fget/cf/774/0/images.terra.com/2023/04/09/cymera_20230409_181121-skpkao3lfk9u.jpg' },
    ]);

    useEffect(() => {
      const fetchImages = async () => {
        var count = 0;
        var posts: any = []
        user.posts.forEach((post: userPost) => {
          count++;
          posts.push({
            id: count,
            uri: post?.pathFotoPost
          });
        })
        await setFotos(posts)
      };
  
      fetchImages();
    }, []);

    const headerData = {
      textHeader: user.usuario,
      icon: 'person-circle-outline'
    }

    const abrirModal = () => {
      setModalVisible(true);
    };

    const fecharModal = () => {
      setModalVisible(false);
    };

    const criarPostModalData = {
      visible: modalVisible,
      onClose: fecharModal
    };

    const redirectLogin = () => {
      toggleLogged();
      navigation.navigate('LoginScreen' as never)
    } 

    const renderItem = ({ item }: { item: Foto }) => (
      <TouchableOpacity style={styles.itemContainer}>
        <Image source={{ uri: item.uri }} style={styles.itemImage} />
      </TouchableOpacity>
    );
    
    return (
    <View style={styles.container}>
      <Header data={headerData}/>

      <View style={styles.content}>

        <View style={styles.textMC}>
         <Text style={styles.sectionTitle}>Minha Conta</Text>
         <View style={{ width: 178, backgroundColor: 'hotpink', height: 2}} />
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <Ionicons name="add-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={redirectLogin}>
            <Ionicons name="log-out-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <CriarPostModal data={criarPostModalData}/>

      <FlatList
        data={fotos}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.flatListContainer}
      />
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 20,
    justifyContent: 'space-between',
    marginTop: 20
  },
  textMC: {
    justifyContent: 'center',
    alignContent: 'center'
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    marginRight: 15
  },
  button: {
    margin: 8,
    padding: 11,
    backgroundColor: 'lightgray',
    borderRadius: 8,
    elevation: 2,
  },
  flatListContainer: {
    margin: 15
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 5,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    aspectRatio: 1, // Aspect ratio 1:1 para manter a proporção da imagem
  },
});

export default MinhaConta;