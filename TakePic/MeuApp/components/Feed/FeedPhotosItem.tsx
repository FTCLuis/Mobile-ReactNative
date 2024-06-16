import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions, View } from 'react-native';

interface FeedPhotosItemProps {
  photo: {
    pathFotoPost: string;
  };
  onPress: () => void; // Alterado para onPress
}

const FeedPhotosItem: React.FC<FeedPhotosItemProps> = ({ photo, onPress }) => {
  const size = Dimensions.get('window').width / 2 - 15;

  return (
    <TouchableOpacity style={styles.photo} onPress={onPress}>
      <View>
        <Image source={{ uri: photo.pathFotoPost }} resizeMode="cover" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  photo: {
    margin: 5,
  },
});

export default FeedPhotosItem;
