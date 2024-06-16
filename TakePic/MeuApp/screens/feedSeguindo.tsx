import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GET_POST_USER } from '../api/Api';
import useFetch from '../Hooks/useFetch';
import FeedPhotosItem from '../components/Feed/FeedPhotosItem';
import FeedModal from '../components/Feed/FeedModal';
import { useUser } from '../provider/userProvider';
import { userModel } from '../models/userModel';

const FeedSeguindo: React.FC = () => {
  const user:userModel = useUser().getUser();
  const { data, request, loading, error } = useFetch();
  const token = window.localStorage.getItem('token');

  const [foto, setFoto] = useState<any[]>([]);
  const [modalPhoto, setModalPhoto] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const requests = user?.seguindo.map((users) => {
        const { url, options } = GET_POST_USER(users);
        return request(url, options);
      });

      const responses = await Promise.all(requests);
      const jsonData = responses.filter((response: any) => response.ok).map((response) => response.json());
      setFoto(jsonData);
    };

    fetchData();
  }, [user, request]);

  return (
    <>
      {modalPhoto && (
        <FeedModal photo={modalPhoto} setModalPhoto={setModalPhoto} />
      )}

      <View style={styles.feed}>
        {loading && <Text>Carregando...</Text>}
        {foto.map((obj) =>
          obj.posts.map((url: any) => (
            <FeedPhotosItem
              key={url._id}
              photo={url}
              setModalPhoto={setModalPhoto}
            />
          ))
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  feed: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    maxHeight: '100%',
  },
});

export default FeedSeguindo;
