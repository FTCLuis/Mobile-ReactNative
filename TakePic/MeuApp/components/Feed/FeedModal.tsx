import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import useFetch from '../../Hooks/useFetch';
import Error from '../Helper/Error';
import { GET_POST_ID } from '../../api/Api';

interface FeedModalProps {
  photo: { _id: string }; // Defina o tipo apropriado para a foto
  setModalPhoto: React.Dispatch<React.SetStateAction<boolean>>;
}

const FeedModal: React.FC<FeedModalProps> = ({ photo, setModalPhoto }) => {
  const { data, error, loading, request } = useFetch();

  useEffect(() => {
    const { url, options } = GET_POST_ID(photo._id);
    request(url, options);
  }, [photo, request]);

  function handleOutsideClick() {
    setModalPhoto(false);
  }

  return (
    <TouchableOpacity style={styles.modal} onPress={handleOutsideClick}>
      <View>
        {error && <Error error={error} />}
        {loading && <Text>Carregando...</Text>}
        {/* {data && <PhotoContent data={data} setModalPhoto={setModalPhoto} />} */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default FeedModal;
