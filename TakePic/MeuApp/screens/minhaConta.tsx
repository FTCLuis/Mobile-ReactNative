import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../provider/userProvider';
import { userModel, userPost } from '../models/userModel';
import Header from '../components/Header/header';
import { useNavigation } from '@react-navigation/native';
import CriarPostModal from '../components/criarPostModal/criarPostModal';
import FeedModal from '../components/Feed/FeedModal';
import { POST_DELETE, SEND_REQUEST } from '../api/Api';
import AlertModal from '../components/alertModal/alertModal';

const MinhaConta = () => {
    const userProvider = useUser();

    if (!userProvider) {
        return null; // ou um componente de loading
    }

    const user = userProvider.getUser(); 
    const { toggleLogged } = useUser();
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalAddVisible, setModalAddVisible] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
    const [fotos, setFotos] = useState([
        // { id: '1', uri: '' },
        // { id: '2', uri: 'https://c4.wallpaperflare.com/wallpaper/685/872/5/soccer-sociedade-esportiva-palmeiras-logo-wallpaper-preview.jpg' },
        // { id: '3', uri: 'https://c4.wallpaperflare.com/wallpaper/246/350/412/palestra-italia-palmeiras-wallpaper-preview.jpg' },
        // { id: '4', uri: 'https://p2.trrsf.com/image/fget/cf/774/0/images.terra.com/2023/04/09/cymera_20230409_181121-skpkao3lfk9u.jpg' },
    ]);

    const [modalAlertVisible, setModalAlertVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [MessageType, setMessageType] = useState <'success' | 'error' | 'warning'>('warning');
    const [loading, setLoading] = useState(false);

    const headerData = {
        textHeader: user.usuario,
        icon: 'person-circle-outline'
    };

    const fecharModal = () => {
        setModalAddVisible(false);
    };

    const criarPostModalData = {
        visible: modalAddVisible,
        onClose: fecharModal
    };

    const redirectLogin = () => {
        toggleLogged();
        navigation.navigate('LoginScreen' as never);
    };

    const handlePhotoClick = (photo: any) => {
        setSelectedPhoto(photo.post);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedPhoto(null);
        setModalVisible(false);
    };

    const onDeletePost = async (postId: string) => {
        try {
            const token = user.token;
            if (!token) {
                setErrorMessage("Token não encontrado!");
                setMessageType("error");
                setModalAlertVisible(true);
                return;
            }
            const { url, options } = POST_DELETE(postId, token);
            const dados = await SEND_REQUEST(url, options);

            let requestUser = await SEND_REQUEST(url, options);
            if (!requestUser.status) {
                setErrorMessage("Falha ao deletar comentário!");
                setMessageType("error");
                setModalAlertVisible(true);
                return;
            }

            setErrorMessage("Post deletado com sucesso!");
            setMessageType("success");
            setModalAlertVisible(true);
           
        } catch (error) {
            console.log(error)
            setErrorMessage("Falha ao deletar comentário - 2!");
            setMessageType("error");
            setModalAlertVisible(true);
        } 
    };

    useEffect(() => {
        console.log(1)
        const fetchImages = async () => {
            var count = 0;
            var posts: any = [];
            
            if (!user.posts) {
                setFotos(posts);
                return;
            }

            user.posts.forEach((post: userPost) => {
                count++;
                posts.push({
                    id: count,
                    uri: post?.pathFotoPost,
                    post: post
                });
            });
            setFotos(posts);
        };
        fetchImages();
    }, [user.posts]);

    return (
        <View style={styles.container}>
            <Header data={headerData} />

            <View style={styles.content}>
                <View style={styles.textMC}>
                    <Text style={styles.sectionTitle}>Minha Conta</Text>
                    <View style={{ width: 178, backgroundColor: 'hotpink', height: 2}} />
                </View>

                <View style={styles.buttons}>
                    <TouchableOpacity style={styles.button} onPress={() => setModalAddVisible(true)}>
                        <Ionicons name="add-outline" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={redirectLogin}>
                        <Ionicons name="log-out-outline" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <CriarPostModal data={criarPostModalData} />

            <FeedModal visible={modalVisible} photo={selectedPhoto} onClose={closeModal} onDeletePost={onDeletePost} />

			<View style={{flex: 1}}>
				<FlatList
					data={fotos}
					numColumns={2}
					keyExtractor={(item, index) => index.toString()}
					contentContainerStyle={styles.flatListContainer}
					renderItem={({ item }) => (
						<View style={styles.column}>
							<TouchableOpacity key={item.id} style={styles.photo} onPress={() => handlePhotoClick(item)}>
								<View style={styles.imageContainer}>
								<Image source={{ uri: item.uri }} style={styles.image} resizeMode="cover" />
								</View>
							</TouchableOpacity>
						</View>
					)}
				/>
			</View>

          
                <AlertModal
                    visible={modalAlertVisible}
                    message={errorMessage}
                    type={MessageType}
                    onClose={() => setModalAlertVisible(false)}
                />
       

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
		flexGrow: 1,
        backgroundColor: 'white',
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 20,
        marginTop: 20,
    },
    textMC: {
        justifyContent: 'center',
        alignContent: 'center',
    },
    sectionTitle: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    buttons: {
        flexDirection: 'row',
        marginRight: 15,
    },
    button: {
        margin: 8,
        padding: 11,
        backgroundColor: 'lightgray',
        borderRadius: 8,
        elevation: 2,
    },
    flatListContainer: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    column: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
    photo: {
        marginVertical: 5,
		flex: 1
    },
    imageContainer: {
        width: '100%',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        overflow: 'hidden',
        aspectRatio: 1,
    },
    image: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,
    },
});

export default MinhaConta;

