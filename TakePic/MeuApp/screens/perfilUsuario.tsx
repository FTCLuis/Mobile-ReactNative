import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ScrollView, Image } from 'react-native';
import { useUser } from '../provider/userProvider';
import { userModel, userPost } from '../models/userModel';
import Header from '../components/Header/header';
import { useNavigation, useRoute } from '@react-navigation/native';
import CriarPostModal from '../components/criarPostModal/criarPostModal';
import FeedModal from '../components/Feed/FeedModal';
import { POST_DELETE, SEND_REQUEST, USER_GET_PHOTO, USER_GET_USUARIO, USER_FOLLOW } from '../api/Api';

const PerfilUsuario = () => {
    const route = useRoute();
    const usuario = route.params;

    const userProvider = useUser();
    const user = userProvider?.getUser(); 
    const { toggleLogged } = useUser();
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalAddVisible, setModalAddVisible] = useState(false);
    const [modalAlertVisible, setModalAlertVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [MessageType, setMessageType] = useState<'success' | 'error' | 'warning'>('warning');
    const [isFollower, setIsFollowing] = useState(false)

    const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
    const [reloadData, setReloadData] = useState(false); 
    const [fotos, setFotos] = useState([]);
    const [numPosts, setNumPosts] = useState(0);
    const [numSeguidores, setNumSeguidores] = useState(0);
    const [numSeguindo, setNumSeguindo] = useState(0);

    useEffect(() => {
        const fetchImages = async () => {
            var count = 0;
            var posts: any = [];

            if (usuario?.usuario && user?.token) {
                const postsUpdateOptions = USER_GET_PHOTO(usuario.usuario, user.token);
                const responsePosts = await SEND_REQUEST(postsUpdateOptions.url, postsUpdateOptions.options);

                const userinfo = USER_GET_USUARIO(user.token, usuario.usuario);
                const infoUser = await SEND_REQUEST(userinfo.url, userinfo.options);

                if (infoUser.data) {
                    setNumPosts(infoUser.data.posts?.length || 0);
                    setNumSeguidores(infoUser.data.seguidores?.length || 0);
                    setNumSeguindo(infoUser.data.seguido?.length || 0);
                }

                if (!responsePosts.status) {
                    setErrorMessage("Erro ao obter os posts!");
                    setMessageType("error");
                    setModalAlertVisible(true);
                    return;
                }

                responsePosts.data.posts.forEach((post: userPost) => {
                    count++;
                    posts.push({
                        id: count,
                        uri: post?.pathFotoPost,
                        post: post
                    });
                });

                setFotos(posts);
            }
        };

        fetchImages();
    }, [reloadData]);

    const checkIfFollowing = () => {
        const seguidores = user?.seguindo || [];
        console.log(seguidores)
        setIsFollowing(seguidores.includes(usuario?.usuario));
    };

    useEffect(() => {
        checkIfFollowing();
    }, []);

    const headerData = {
        textHeader: user?.usuario,
        icon: 'person-circle-outline'
    };

    const fecharModal = () => {
        setReloadData(true);
        setModalAddVisible(false);
    };

    const criarPostModalData = {
        visible: modalAddVisible,
        onClose: fecharModal
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
            const token = user?.token;
            if (!token) {
                setErrorMessage("Token não encontrado!");
                setMessageType("error");
                setModalAlertVisible(true);
                return;
            }

            const { url, options } = POST_DELETE(postId, token);
            const dados = await SEND_REQUEST(url, options);

            if (!dados.status) {
                setErrorMessage("Falha ao deletar comentário!");
                setMessageType("error");
                setModalAlertVisible(true);
                return;
            }

            const updatedPosts = Object.entries(user.posts).filter(post => post[1]._id !== postId);
            let remakePosts = [];
            updatedPosts.map(item => {
                remakePosts.push(item[1]);
            });

            const updatedUser = { ...user, posts: remakePosts };
            userProvider?.setUser(updatedUser);
            setErrorMessage("Post deletado com sucesso!");
            setMessageType("success");
            setModalAlertVisible(true);
            setReloadData(prev => !prev); 

        } catch (error) {
            setErrorMessage("Falha ao deletar comentário - 2!");
            setMessageType("error");
            setModalAlertVisible(true);
        } 
    };

    const seguirUsuario = async () => {
        try {
            let dadosRequest = await USER_FOLLOW(user?.usuario, usuario?.usuario, user?.token);
            await SEND_REQUEST(dadosRequest.url, dadosRequest.options);
            let seguindo: [] = user?.seguindo // .push(usuario?.usuario)
            if (!isFollower) {
                seguindo.push(usuario?.usuario)
            } else {
                const updatedPosts = seguindo.filter(seguindo => seguindo !== usuario?.usuario);
                seguindo = []
                updatedPosts.map(item => {
                    seguindo.push(item[1]);
                });
            }

            const updatedUser = { ...user, seguindo: seguindo };
            userProvider?.setUser(updatedUser);
            
            setIsFollowing(!isFollower); // Marcamos como seguindo após ação bem-sucedida
            setReloadData(prev => !prev); // Atualiza os dados
        } catch (error) {
            console.error('Erro ao seguir usuário:', error);
            setErrorMessage("Erro ao seguir usuário!");
            setMessageType("error");
            setModalAlertVisible(true);
        }
    };

    return (
        <View style={styles.container}>
            <Header data={headerData} />

            <View style={styles.content}>
                <View style={styles.textMC}>
                    <Text style={styles.sectionTitle}> {usuario?.usuario} </Text>
                </View>

                <View style={styles.buttons}>
                    <TouchableOpacity onPress={seguirUsuario}>
                        <Text style={styles.buttonFollow}>
                            {isFollower ? "Seguindo" : "Seguir"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.statsContainer}>
                <Text ><Text style={styles.statText}>{numPosts || 0}</Text> posts</Text>
                <Text ><Text style={styles.statText}>{numSeguidores || 0}</Text> seguidores</Text>
                <Text ><Text style={styles.statText}>{numSeguindo || 0}</Text> seguindo</Text>
            </View>

            <CriarPostModal data={criarPostModalData} />

            <ScrollView>
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
            </ScrollView>

            <FeedModal visible={modalVisible} photo={selectedPhoto} onClose={closeModal} onDeletePost={onDeletePost} />
        </View>
    );
};

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
        marginTop: 20,
        alignItems: 'center'
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
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    column: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
    photo: {
        marginVertical: 5,
        flex: 1,
    },
    imageContainer: {
        width: '100%',
        height: 200, // Definir altura fixa ou aspectRatio
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        overflow: 'hidden',
        aspectRatio: 1
    },
    image: {
        width: '100%',
        height: '100%',
        aspectRatio: 1
    },
    buttonFollow: {
        backgroundColor: 'hotpink',
        paddingHorizontal: 15,
        paddingVertical: 8,
        color: 'white',
        borderRadius: 5,
        fontWeight: 'bold',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        backgroundColor: '#f5f5f5', // Cinza clarinho
        marginTop: 15,
        alignItems: "center"
    },
    statText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PerfilUsuario;
