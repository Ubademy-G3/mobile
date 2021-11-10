import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

class MessagesScreen extends Component {
    render() {
        return (
            <View>
                <Text>Messages Screen!!</Text>
                {/*<Button onPress={() => this.props.navigation.navigate('Login')} title={"Mi Perfil"}/>*/}
            </View>
        )
    }
}

const styles = StyleSheet.create({})

export default MessagesScreen;