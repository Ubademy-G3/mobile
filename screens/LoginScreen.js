import React, {Component, useState} from 'react';
import { AppState, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import {app} from '../app/app';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = (props) => {
    const [data, setData] = useState({
        email: '',
        password: ''
    });

    const [errorMessage, setError] = useState(false);

    const handleApiResponseLogin = (response) => {
        console.log("[Login screen] entro a handle api response login")
        console.log("[Login screen] has errors: ", response.hasError())
        console.log("[Login screen] error message: ", response.content().message)
        if (response.hasError()) {
            setError({
                errorMessage: response.errorMessages(),
            });
            console.log("[Login screen] error")
        } else {
            console.log("[Login screen] response: ", response.content())
            console.log("[Login screen] token: ", response.content().token)
            app.loginUser(response.content().token);
            props.navigation.navigate('TabNavigator', {screen: 'Explorer'})
        }
    }

    const handleSubmitLogin = () => {
        console.log("[Login screen] entro a submit login")
        app.apiClient().login(data, handleApiResponseLogin);
        console.log("[Login screen] termino submit login")
    }

    const handleSubmitSignUp = () => {
        console.log("[Login screen] entro a submit sign up")
        props.navigation.navigate('Signup', {email: data.email, password: data.password })
        console.log("[Login screen] termino submit sign up")
    }

    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        >
            {/*<View style={styles.headerContainer}>
                <SafeAreaView>
                    <View style={styles.headerWrapper}>
                        <Image
                        source={require("../assets/images/logo.png")}
                        style={styles.logoImage}
                        />
                    </View>
                </SafeAreaView>
            </View>*/}
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Email"
                    onChangeText={text => setData({
                        ...data,
                        email: text,
                    })}
                    value={data.email}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Password"
                    onChangeText={text => setData({
                        ...data,
                        password: text,
                    })}
                    value={data.password}
                    style={styles.input}
                    secureTextEntry
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => {handleSubmitLogin()}}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {handleSubmitSignUp()}}
                    style={[styles.button, styles.buttonOutlined]}
                >
                    <Text style={styles.buttonOutlineText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {}} //handleSubmitForgotPassword()}
                    style={[styles.fadedButton]}
                >
                    <Text style={styles.buttonFadedText}>Forgot password?</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        flex: 2,
    },
    headerWrapper: {
        paddingTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: 75,
        height: 75,
        borderRadius: 40,
    },
    inputContainer: {
        width:'80%',
    },
    input: {
        backgroundColor:'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: `#87ceeb`,
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color:'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlined: {
        backgroundColor:'white',
        marginTop: 5,
        borderColor: '#87ceeb',
        borderWidth:2,
    },
    buttonOutlineText: {
        color:'#87ceeb',
        fontWeight: '700',
        fontSize: 16,
    },
    fadedButton: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonFadedText: {
        color:'#87ceeb',
        fontWeight: '700',
        fontSize: 16,
        //textDecorationLine: 'underline',
    },
})

export default LoginScreen;