import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import FeedPhotos from './FeedPhotos';
import FeedModal from './FeedModal';

const Feed: React.FC = () => {
  const [modalPhoto, setModalPhoto] = useState<any>(null); // Defina o tipo apropriado para modalPhoto

  return (
    <View style={styles.mainContainer}>
      <FeedPhotos/>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 2,
  }
});


export default Feed;
