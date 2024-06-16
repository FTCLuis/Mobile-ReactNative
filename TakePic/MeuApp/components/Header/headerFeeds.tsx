import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

interface HeaderFeedsProps {
    screen: 'FeedGeralScreen' | 'FeedSeguindoScreen';
  }

const HeaderFeeds: React.FC<HeaderFeedsProps> = ({screen}) => {
    type RootStackParamList = {
        FeedSeguindoScreen: undefined;
        FeedGeralScreen: undefined;
    };
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [activeTab, setActiveTab] = useState<'FeedGeralScreen' | 'FeedSeguindoScreen'>(screen);

    const handlePress = (screen: 'FeedGeralScreen' | 'FeedSeguindoScreen') => {
        setActiveTab(screen);
        if (screen === 'FeedGeralScreen') {
            navigation.navigate('FeedGeralScreen');
        } else if (screen === 'FeedSeguindoScreen') {
            navigation.navigate('FeedSeguindoScreen');
        }
    };
console.log(screen)
    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={styles.tabButton}
                    onPress={() => handlePress('FeedGeralScreen')}>
                    <Text style={[styles.tabText, activeTab === 'FeedGeralScreen' && styles.tabTextActive]}>Feed Geral</Text>
                    <View style={[styles.activeIndicator, activeTab === 'FeedGeralScreen' ? styles.activeIndicatorActive : null]} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => handlePress('FeedSeguindoScreen')}
                >
                    <Text style={[styles.tabText, activeTab === 'FeedSeguindoScreen' && styles.tabTextActive]}>Seguindo</Text>
                    <View style={[styles.activeIndicator, activeTab === 'FeedSeguindoScreen' ? styles.activeIndicatorActive : null]} />
                </TouchableOpacity>
            </View>
        </View>
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
        marginBottom: 15
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
        position: 'relative', // Adicionando posição relativa para o TouchableOpacity
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
        height: 2,
        backgroundColor: '#ff1493',
        borderRadius: 1,
        opacity: 0, // Começa oculto
    },
    activeIndicatorActive: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        opacity: 1, // Torna visível quando ativo
    },
});

export default HeaderFeeds;
