import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const ChatScreen = (props) => {
    return (
        <View>
            <Text>Chat Screen!!</Text>
            <TouchableOpacity 
            onPress={() => props.navigation.navigate('Messages Screen', {id: "ac249a59-be3c-4660-9b0f-e7f660aaeac9"})}
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