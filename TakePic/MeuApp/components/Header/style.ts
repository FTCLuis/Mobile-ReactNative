import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: 'gray'
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    loginText: {
        fontSize: 16,
        marginTop: 5
    },
});

export default styles;
