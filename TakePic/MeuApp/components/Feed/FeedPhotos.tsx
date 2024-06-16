import { useNavigation, NavigationProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, ScrollView, FlatList, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import useFetch from '../../Hooks/useFetch';
import { GET_POSTS } from '../../api/Api';
import Error from '../Helper/Error';
import HeaderFeeds from '../Header/headerFeeds';
import Header from '../Header/header';
import FeedModal from './FeedModal';

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

  useEffect(() => {
    const fetchPhotos = async () => {
      const { url, options } = GET_POSTS();
      await request(url, options);
    };
    fetchPhotos();
  }, [request]);

  if (error) return <Error error={error} />;
  if (loading) return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;

  const handlePhotoClick = (photo: any) => {
    setSelectedPhoto(photo);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
    setModalVisible(false);
  };
  
  if (data) {
    return (
      <ScrollView style={styles.container}>
        <Header />
        <HeaderFeeds screen={'FeedGeralScreen'} />
        <FlatList
          data={data}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.flatListContainer}
          renderItem={({ item }) => (
            <View style={styles.column}>
              {item.posts.slice(0, 1).map((photo: any) => ( // Renderiza apenas a primeira foto de cada item
                <TouchableOpacity key={photo._id} style={styles.photo} onPress={() => handlePhotoClick(photo)}>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: photo.pathFotoPost }} style={styles.image} resizeMode="cover" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />

        <FeedModal visible={modalVisible} photo={selectedPhoto} onClose={closeModal} />
      </ScrollView>
    );
  };
}

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    marginRight: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  tabTextActive: {
    fontSize: 16,
    color: '#ff1493',
  },
  activeIndicator: {
    marginTop: 5,
    height: 2,
    backgroundColor: '#ff1493',
    borderRadius: 1,
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
