import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import { GET_POST_USER } from '../../api/Api';
import useFetch from '../../Hooks/useFetch';
import FeedModal from './FeedModal';
import { useUser } from '../../provider/userProvider';
import Header from '../Header/header';
import HeaderFeeds from '../Header/headerFeeds';
import Error from '../Helper/Error';

const FeedSeguindo: React.FC = () => {
  const user = useUser().getUser();
  const { request, loading, error } = useFetch();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [foto, setFoto] = useState<any[]>([]);

  const handlePhotoClick = (photo: any) => {
    setSelectedPhoto(photo);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
    setModalVisible(false);
  };

  const headerData = {
    textHeader: user?.usuario || '',
    icon: 'person-circle-outline'
  };

  useEffect(() => {
    const fetchData = async () => {
      const requests = user?.seguindo.map(async (users) => {
        const { url, options } = GET_POST_USER(users);
        const { response, json } = await request(url, options);
        return { response, json };
      });

      const responses = await Promise.all(requests);
      const jsonData = responses.filter(({ response }) => response && response.ok).map(({ json }) => json);
      const allPhotos = jsonData.flatMap(photoData => photoData.posts);
      setFoto(allPhotos);
    };

    fetchData();
  }, [user, request]);

  if (error) return <Error error={error} />;
  if (loading) return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;

  return (
    <ScrollView style={styles.container}>
      <Header data={headerData} />
      <HeaderFeeds screen={'FeedSeguindoScreen'} />
      <FlatList
        data={foto}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
        renderItem={({ item }) => (
          <View style={styles.column}>
            <TouchableOpacity key={item._id} style={styles.photo} onPress={() => handlePhotoClick(item)}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.pathFotoPost }} style={styles.image} resizeMode="cover" />
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
      <FeedModal visible={modalVisible} photo={selectedPhoto} onClose={closeModal} />
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
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
  },
});

export default FeedSeguindo;
