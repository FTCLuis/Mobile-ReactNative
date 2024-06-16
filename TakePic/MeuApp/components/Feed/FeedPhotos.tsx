import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import useFetch from '../../Hooks/useFetch';
import { GET_POSTS } from '../../api/Api';
import FeedPhotosItem from './FeedPhotosItem';
import Error from '../Helper/Error';
import HeaderFeeds from '../Header/headerFeeds';
import Header from '../Header/header';

interface FeedPhotosProps {
  setModalPhoto: React.Dispatch<React.SetStateAction<any>>;
}

interface Photo {
  pathFotoPost: string;
}

type RootStackParamList = {
  FeedSeguindoScreen: undefined;
};

const FeedPhotos: React.FC<FeedPhotosProps> = ({ setModalPhoto }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { data, request, loading, error } = useFetch();

  useEffect(() => {
    const fetchPhotos = async () => {
      const { url, options } = GET_POSTS();
      await request(url, options);
    };
    fetchPhotos();
  }, [request]);

  if (error) return <Error error={error} />;
  if (loading) return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;

  if (data) {
    return (
      <View style={styles.container}>
        <Header/>
        <HeaderFeeds/>
        <FlatList
          data={data}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.column}>
              {item.posts.map((photo: Photo) => (
                <FeedPhotosItem
                photo={photo}
                setModalPhoto={setModalPhoto}
                />
              ))}
            </View>
          )}
        />
      </View>
    );
  }

  return null; // Caso não haja dados ainda
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
  column: {
    flex: 1,
    padding: 5,
  },
});

export default FeedPhotos;
