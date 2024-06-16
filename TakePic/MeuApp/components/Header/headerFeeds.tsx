import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

const HeaderFeeds = () => {
    type RootStackParamList = {
        FeedSeguindoScreen: undefined;
        FeedGeralScreen: undefined;
    };
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [activeTab, setActiveTab] = useState<'FeedGeralScreen' | 'FeedSeguindoScreen'>('FeedGeralScreen'); // Estado para controlar a aba ativa

    const handlePress = (screen: 'FeedGeralScreen' | 'FeedSeguindoScreen') => {
        setActiveTab(screen);
        if (screen === 'FeedGeralScreen') {
            navigation.navigate('FeedGeralScreen');
        } else if (screen === 'FeedSeguindoScreen') {
            navigation.navigate('FeedSeguindoScreen');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={styles.tabButton}
                    onPress={() => handlePress('FeedGeralScreen')}>
                    <Text style={activeTab === 'FeedGeralScreen' ? styles.tabTextActive : styles.tabText}>Feed Geral</Text>
                    {activeTab === 'FeedGeralScreen' && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => handlePress('FeedSeguindoScreen')}
                >
                    <Text style={activeTab === 'FeedSeguindoScreen' ? styles.tabTextActive : styles.tabText}>Seguindo</Text>
                    {activeTab === 'FeedSeguindoScreen' && <View style={styles.activeIndicator} />}
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
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#ff1493',
        borderRadius: 1,
    },
});

export default HeaderFeeds;
