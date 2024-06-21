import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import { PHOTO_POST, SEND_REQUEST, UPLOAD_PHOTO_POST, USER_GET_PHOTO } from '../../api/Api'; // Importe suas funções de requisição e configuração de URL
import { useUser } from '../../provider/userProvider';
import { userModel } from '../../models/userModel';
import { PermissionsAndroid } from 'react-native';

interface criarPostModalProps {
    data: {
        visible: boolean;
        onClose: () => void;
    }
}

const CriarPostModal: React.FC<criarPostModalProps> = ({data}) => {
    const userProvider: {
        isLogged: boolean;
        toggleLogged: () => void;
        setUser: (usrData: userModel) => void;
        getUser: () => userModel;
    } | void = useUser()

    const user: userModel | void = userProvider.getUser(); 
    const navigation = useNavigation();
    const [description, setDescription] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);

    
    useEffect(() => {
        if (!userProvider || !user || !navigation) return;
    
        async function atualizaPosts() {
          try {
            // Aqui você pode atualizar os posts do usuário após postar a foto
            const postsUpdateOptions = USER_GET_PHOTO(user.usuario, user.token);
            const responsePosts = await SEND_REQUEST(postsUpdateOptions.url, postsUpdateOptions.options);
            
            if (!responsePosts.status) {
              console.error('Erro ao obter posts:', responsePosts.error);
              return;
            }
            
            const updatedUser = { ...user, posts: responsePosts.data.posts };
            userProvider.setUser(updatedUser);
          } catch (error) {
            console.error('Erro ao atualizar posts:', error);
          }
        }
        
        atualizaPosts();
    }, [userProvider, user, navigation]);
    
    const handleClose = () => {
        setImageUri(null);
        data.onClose();
    }

    const postarFoto = async () => {
        try {
            if (!imageUri) {
                console.error("Imagem não selecionada!");
                return;
            }
        
            const imageResponse = await fetch(imageUri);
            const blob = await imageResponse.blob();
        
            const formData = new FormData();
            formData.append('file', blob, 'photo.jpg');
            const { url, options } = UPLOAD_PHOTO_POST(formData, user.token);
        
            const response = await SEND_REQUEST(url, options);

            if (!response.status) {
                console.error("Erro ao postar a foto!");
                return
            }

            console.log("Foto postado com sucesso!");

            const photoResponseOptions = PHOTO_POST({usuario: user.usuario, pathFotoPost: response.data.url, descricaoPost: description}, user.token, user._id)
            const responsePhoto = await SEND_REQUEST(photoResponseOptions.url, photoResponseOptions.options);
            
            if (!responsePhoto.status) {
                console.error("Erro ao postar a foto!");
                return;
            }

            console.log("Foto postado com sucesso!");

            const postsUpdateOptions = USER_GET_PHOTO(user.usuario, user.token);
            const responsePosts = await SEND_REQUEST(postsUpdateOptions.url, postsUpdateOptions.options);
            
            if (!responsePosts.status) {
                console.error("Erro ao obter os posts!");
              return;
            }
            
            const updatedUser = { ...user, posts: responsePosts.data.posts };
            userProvider.setUser(updatedUser);

            handleClose();
          
                
        } catch (error) {
            console.error("Erro na requisição!");
        }
    };

    const requestStoragePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    {
                        title: 'Permissão de Acesso ao Armazenamento',
                        message: 'O aplicativo precisa de acesso ao armazenamento para selecionar fotos.',
                        buttonNeutral: 'Pergunte-me depois',
                        buttonNegative: 'Cancelar',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Você pode usar o armazenamento');
                    openImagePicker(); // Chama o seletor de imagens após a permissão ser concedida
                } else {
                    console.log('Permissão de armazenamento negada');
                    console.error('Permissão de armazenamento negada');
                }
            } catch (err) {
                console.warn(err);
                console.error('Erro ao solicitar permissão de armazenamento');
            }
        } else {
            openImagePicker();
        }
    };

    const openImagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.uri);
        }
    };
    
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={data.visible}
            onRequestClose={data.onClose} >
            <View style={styles.modalBackground}>
            
                <View style={styles.modalView}>

                    <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                        <Ionicons name="close-outline" size={24} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.title}>Postar Foto</Text>
                        <View style={{ width: 100, backgroundColor: 'hotpink', height: 2, marginBottom: 25}} />
                    <Text style={styles.label}>Descrição da Foto</Text>

                    <TextInput
                        style={styles.textArea}
                        placeholder="Digite a descrição..."
                        multiline={true}
                        numberOfLines={4}
                        value={description}
                        onChangeText={setDescription}
                    />

                    <TouchableOpacity style={styles.button} onPress={openImagePicker}>
                        <Text style={styles.buttonText}>Escolher Imagem</Text>
                    </TouchableOpacity>

                    {imageUri && <Text>Imagem selecionada</Text>}

                    <TouchableOpacity style={styles.button}
                        onPress={() => {postarFoto()}}>
                        <Text style={styles.buttonText}>Postar Foto</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        marginTop: 70,
        marginRight: 20,
        marginBottom: 20,
        marginLeft: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
    },
    textArea: {
        height: 100,
        width: '100%',
        borderColor: 'gray',
        borderRadius: 10,
        borderWidth: 1,
        padding: 10,
        marginBottom: 25,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: 'hotpink',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1, // Coloque um índice de ordem para garantir que o botão fique acima do conteúdo
    },
});


export default CriarPostModal;