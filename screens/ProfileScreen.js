import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

class ProfileScreen extends Component {
    render() {
        return (
            <View>
                <Text>Profile Screen!!</Text>
                {/*<Button onPress={() => this.props.navigation.navigate('Login')} title={"Mi Perfil"}/>*/}
            </View>
        )
    }
}

const styles = StyleSheet.create({})

export default ProfileScreen;