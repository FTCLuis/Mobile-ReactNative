import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { SEND_REQUEST, UPLOAD_PHOTO_POST } from '../../api/Api'; // Importe suas funções de requisição e configuração de URL
import { useUser } from '../../provider/userProvider';
import { userModel } from '../../models/userModel';

interface criarPostModalProps {
    data: {
        visible: boolean;
        onClose: () => void;
    }
}

const CriarPostModal: React.FC<criarPostModalProps> = ({data}) => {
    
    const user: userModel | void = useUser().getUser(); 
    const navigation = useNavigation();
    const [description, setDescription] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);

    const handleClose = () => {
        setImageUri(null);
        data.onClose();
    }

    const postarFoto = async () => {
        try {
            if (!imageUri) {
                console.log('Nenhuma imagem selecionada');
                return;
            }

            const imageResponse = await fetch(imageUri);
            const blob = await imageResponse.blob(); 
    
            const formData = new FormData();
            formData.append('photo', blob, 'photo.jpg'); 

            const { url, options } = UPLOAD_PHOTO_POST(formData, user.token);
            const response = await SEND_REQUEST(url, options);

            if (response.status) {
                console.log('Foto postada com sucesso:', response.data);

                // setImageUri(null);
                // setDescription('');
                // handleClose();
            } else {
                console.error('Erro ao postar a foto:', response.error);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    const openImagePicker = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
            console.log('Usuário cancelou a seleção da imagem');
            } else if (response.errorCode) {
            console.log('Erro: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
            const uri = response.assets[0].uri;
                if (uri) {
                    setImageUri(uri);
                }
            }
        });
    };
    
    return (
        <Modal
            animationType="slide"
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
                        onPress={() => {
                            postarFoto();
                            handleClose();
                        }}>
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