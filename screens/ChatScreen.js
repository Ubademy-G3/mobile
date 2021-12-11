import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const ChatScreen = (props) => {
    return (
        <View>
            <Text>Chat Screen!!</Text>
            <TouchableOpacity 
            onPress={() => props.navigation.navigate('Messages Screen', {id: "abc52922-eddf-403a-80b7-f61023953edd"})} //aca poner nombre del q chatea
            style={styles.button}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: `#87ceeb`,
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        paddingTop: 10,
        marginBottom: 8,
    },
})

export default ChatScreen;