import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

interface FeedPhotosItemProps {
  photo: {
    pathFotoPost: string; // Defina o tipo apropriado para pathFotoPost
  };
  setModalPhoto: React.Dispatch<React.SetStateAction<any>>; // Defina o tipo apropriado para setModalPhoto
}

const FeedPhotosItem: React.FC<FeedPhotosItemProps> = ({ photo, setModalPhoto }) => {
  function handleClick() {
    setModalPhoto(photo);
  }

  return (
    <TouchableOpacity style={styles.photo} onPress={handleClick}>
      <Image source={{ uri: photo.pathFotoPost }} style={styles.image} />
      {/* <Text>Visualizar</Text> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  photo: {
    marginVertical: 10,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 100,
  },
});

export default FeedPhotosItem;
