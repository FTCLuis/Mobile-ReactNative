import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import useFetch from '../../Hooks/useFetch';
import { GET_POSTS } from '../../api/Api';
import FeedPhotosItem from './FeedPhotosItem';
import Error from '../Helper/Error';

interface FeedPhotosProps {
  setModalPhoto: React.Dispatch<React.SetStateAction<any>>; // Defina o tipo apropriado para setModalPhoto
}

const FeedPhotos: React.FC<FeedPhotosProps> = ({ setModalPhoto }) => {
  const { data, request, loading, error } = useFetch();

  useEffect(() => {
    const fetchPhotos = async () => {
      const { url, options } = GET_POSTS();
      await request(url, options);
    };
    fetchPhotos();
  }, [request]);

  if (error) return <Error error={error} />;
  if (loading) return <ActivityIndicator />;
  if (data)

    return (
      <FlatList
        data={data}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.feed}>
            {item.posts.map((photo: any) => (
              <FeedPhotosItem
                key={photo._id}
                photo={photo}
                setModalPhoto={setModalPhoto}
              />
            ))}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

const styles = StyleSheet.create({
  feed: {
     paddingHorizontal: 5, // Adiciona padding horizontal para evitar que as fotos toquem nas bordas da tela
     paddingBottom: 10,
  },
});


export default FeedPhotos;