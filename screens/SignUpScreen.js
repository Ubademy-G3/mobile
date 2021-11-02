import React, { Component, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppState, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import {app} from '../app/app';

const SignupScreen = (props) => {
    const param_email = props.route.params ? props.route.params.email: '';
    const param_password = props.route.params ? props.route.params.password: '';
    
    const [SignUpData, setData] = useState({
        firstname: '',
        lastname: '',
        email: param_email, 
        password: param_password, 
        rol:'', //deberia darle opciones a elegir
    });

    const [errorMessage, setError] = useState(false);

    const handleApiResponseLogin = (response) => {
        console.log("[Signup screen] entro a handle api response")
        if (response.hasError()) {
            setError({
                errorMessage: response.errorMessages(),
            });
            console.log("[Signup screen] error")
        } else {
            app.loginUser(response.content().token);
            console.log("[Signup screen] token: ", response.content().token)
            props.navigation.navigate('TabNavigator', {screen: 'Explorer'})
        }
    }
   
    const handleApiResponseSignUp = (response) => {
        console.log("[Signup screen] entro a handle api response sign up")
        if (response.hasError()) {
            setError({
                errorMessage: response.errorMessages(),
            });
            console.log("error")
        } else {
            console.log("[Signup screen] done signup")
        }
    }

    const handleSubmitSignUp = () => {
        console.log("[Signup screen] entro a submit signup")
        app.apiClient().signup(SignUpData, handleApiResponseSignUp);
        handleSubmitLogin()
        console.log("[Signup screen] termino submit signup")
    }

    const handleSubmitLogin = () => {
        console.log("[Signup screen] entro a submit login")
        app.apiClient().login({email: SignUpData.email, password: SignUpData.password}, handleApiResponseLogin);
        console.log("[Signup screen] termino submit login")
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
                    placeholder="First Name"
                    onChangeText={text => setData({
                        ...SignUpData,
                        firstname: text,
                    })}
                    value={SignUpData.firstname}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Last Name"
                    onChangeText={text => setData({
                        ...SignUpData,
                        lastname: text,
                    })}
                    value={SignUpData.lastname}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Email"
                    onChangeText={text => setData({
                        ...SignUpData,
                        email: text,
                    })}
                    value={SignUpData.email}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Password"
                    onChangeText={text => setData({
                        ...SignUpData,
                        password: text,
                    })}
                    value={SignUpData.password}
                    style={styles.input}
                    secureTextEntry
                />
                {/* Esto que sigue deberia darle opciones no escribir */}
                <TextInput
                    placeholder="Student or Profesor?"
                    onChangeText={text => setData({
                        ...SignUpData,
                        rol: text,
                    })}
                    value={SignUpData.rol}
                    style={styles.input}
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => {handleSubmitSignUp()}}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
    },
    headerContainer: {
        flex: 1,
        paddingBottom: 5,
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
})

export default SignupScreen;