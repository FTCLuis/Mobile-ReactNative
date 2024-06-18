import { useNavigation, NavigationProp } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, ScrollView, FlatList, Text, TouchableOpacity, Image, Dimensions, Animated } from 'react-native'; // Importe Animated
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
  const [reloadData, setReloadData] = useState(false); 
  const [isDeleting, setIsDeleting] = useState(false); 
  const user: userModel | void = useUser().getUser();

  useEffect(() => {
    fetchPhotos();
  }, [request, reloadData]); 

  const fetchPhotos = async () => {
    const { url, options } = GET_POSTS();
    const { json } = await request(url, options);
    if (json) {
      setPosts(json); 
    }
  };

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
        setReloadData(true); 
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Failed to delete comment", error);
    } finally {
      setIsDeleting(false); 
    }
  };

  const reloadDataHandler = () => {
    setReloadData(true);
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
  }

  if (error) return <Error error={error} />;
  
  if (loading && !isDeleting) return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;

  return (
    <ScrollView style={styles.container}>
      <Header data={headerData} />
      <HeaderFeeds screen={'FeedGeralScreen'} />
      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
        renderItem={({ item }) => (
          <View style={styles.column}>
            {item.posts.slice(0, 1).map((photo: any) => ( 
              <TouchableOpacity key={photo._id} style={styles.photo} onPress={() => handlePhotoClick(photo)}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: photo.pathFotoPost }} style={styles.image} resizeMode="cover" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />

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
});

export default FeedPhotos;