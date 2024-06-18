import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { POST_LIKE } from '../../api/Api';
import { useUser } from '../../provider/userProvider';
import useFetch from '../../Hooks/useFetch';

interface FeedLikePostProps {
  postId: string;
  likedUsers: string[];
  onLikeChange: (newLikedUsers: string[]) => void;
}

const FeedLikePost: React.FC<FeedLikePostProps> = ({ postId, likedUsers = [], onLikeChange }) => {
  const user = useUser();
  const currentUser = user.getUser().usuario;
  const { request } = useFetch();
  const [liked, setLiked] = useState(likedUsers.includes(currentUser));
  const [likes, setLikes] = useState(likedUsers.length || 0);

  useEffect(() => {
    setLiked(likedUsers.includes(currentUser));
    setLikes(likedUsers.length || 0);
  }, [likedUsers, currentUser]);

  const handleLike = async () => {
    const token = user.getUser().token;
    if (!token) {
      console.error('Token not found');
      return;
    }

    const { url, options } = POST_LIKE({ usuario: currentUser }, postId, token);
    const { json, response } = await request(url, options);
    console.log(json)
    if (response && response.ok) {

      setLiked(json.includes(currentUser));
      setLikes(json.length || 0);
      onLikeChange(json);
    } else {
      console.error('Failed to like post');
    }
  };

  return (
    <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
      <Ionicons name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? 'red' : '#333'} />
      <Text style={styles.likeCount}>{likes}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    marginLeft: 5,
    fontSize: 16,
    color: '#333',
  },
});

export default FeedLikePost;