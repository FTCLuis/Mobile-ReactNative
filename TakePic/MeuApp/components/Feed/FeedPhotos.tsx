import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, ScrollView, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import useFetch from '../../Hooks/useFetch';
import { GET_POSTS, POST_DELETE } from '../../api/Api';
import Error from '../Helper/Error';
import HeaderFeeds from '../Header/headerFeeds';
import Header from '../Header/header';
import FeedModal from './FeedModal';
import { userModel } from '../../models/userModel';
import { useUser } from '../../provider/userProvider';

interface FeedPhotosProps {
  setModalPhoto: React.Dispatch<React.SetStateAction<any>>;
}

interface Photo {
  pathFotoPost: string;
}

const FeedPhotos: React.FC<FeedPhotosProps> = ({ setModalPhoto }) => {
  const { data, request, loading, error } = useFetch();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const user: userModel | void = useUser().getUser();

  const fetchPhotos = async () => {
    const { url, options } = GET_POSTS();
    const { json } = await request(url, options);
    if (json) {
      setPosts(json);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPhotos();
    }, [])
  );

  const onDeletePost = async (postId: string) => {
    setIsDeleting(true);

    const updatedPosts = posts.filter(post => post._id !== postId);
    setPosts(updatedPosts);

    try {
      const token = user.token;
      if (!token) {
        console.error("Token not found");
        return;
      }

      const { url, options } = POST_DELETE(postId, token);
      const { response } = await request(url, options);
      if (response && response.ok) {
        fetchPhotos();
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Failed to delete post", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePhotoClick = (photo: any) => {
    setSelectedPhoto(photo);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
    setModalVisible(false);
  };

  const headerData = {
    textHeader: user.usuario,
    icon: 'person-circle-outline'
  };

  if (error) return <Error error={error} />;
  if (loading && !isDeleting) return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;

  // Criar uma matriz de todas as fotos de todos os usuários
  let allPhotos: any[] = [];
  posts.forEach(post => {
    allPhotos = [...allPhotos, ...post.posts];
  });

  // Calcula quantas colunas (fotos por linha) queremos exibir
  const columns = 2;

  return (
    <ScrollView style={styles.container}>
      <Header data={headerData} />
      <HeaderFeeds screen={'FeedGeralScreen'} />
      <View style={styles.flatListContainer}>
        {Array.from({ length: Math.ceil(allPhotos.length / columns) }).map((_, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {Array.from({ length: columns }).map((_, colIndex) => {
              const photoIndex = rowIndex * columns + colIndex;
              const photo = allPhotos[photoIndex];
              if (photo) {
                return (
                  <TouchableOpacity key={photo._id} style={styles.photo} onPress={() => handlePhotoClick(photo)}>
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: photo.pathFotoPost }} style={styles.image} resizeMode="cover" />
                    </View>
                  </TouchableOpacity>
                );
              } else {
                return <View key={photoIndex} style={styles.photo}></View>;
              }
            })}
          </View>
        ))}
      </View>
      <FeedModal visible={modalVisible} photo={selectedPhoto} onClose={closeModal} onDeletePost={onDeletePost} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatListContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  photo: {
    width: '48%', // Ajuste para duas colunas, com espaçamento
    aspectRatio: 1,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default FeedPhotos;
