import React, {Component, useState} from 'react';
import { AppState, Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, HelperText, Alert, ActivityIndicator } from 'react-native';
import {app} from '../app/app';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebase'
import * as Google from 'expo-google-app-auth';
//const admin = require('firebase-admin');

//const nodemailer = require('nodemailer');
//const functions = require('firebase-functions');

const LoginScreen = (props) => {
    const [data, setData] = useState({
        email: '',
        password: ''
    });

    const [googleData, setGoogleData] = useState({
        firstName: "",
        lastName: "",
        id: "",
        email: ""
    })

    const [errorData, setError] = useState({
        messageError: '',
        showError: false,
    });

    const [loading, setLoading] = useState(false);

    const [signupGoogle, setsignupGoogle] = useState(false);

    const handleApiResponseLogin = (response) => {
        console.log("[Login screen] entro a handle api response login")
        console.log("[Login screen] has errors: ", response.hasError())
        console.log("[Login screen] error message: ", response.content().message)
        if (response.hasError()) {
            console.log("SIGNUPGOOGLE", signupGoogle);
            if (response.content().message === "User not found" &&
            signupGoogle === true){
                props.navigation.replace('Signup', {
                    email: googleData.email, 
                    password: googleData.id, 
                    google: signupGoogle,
                    firstName: googleData.firstName,
                    lastName: googleData.lastName});
            }            
            else {
                setError({
                    messageError: response.content().message,
                    showError: true,
                });
                console.log("[Login screen] error massage: ", response.content().message)
            
                Alert.alert(
                "Error:",
                response.content().message,
                [
                  { text: "OK", onPress: () => {} }
                ]
              );
            }
        } else {
            console.log("[Login screen] response: ", response.content())
            console.log("[Login screen] id: ", response.content().id)
            console.log("[Login screen] token: ", response.content().token)
            app.loginUser(response.content().token, response.content().id);
            props.navigation.replace('TabNavigator', {
                screen: 'Drawer',
                params: { screen: 'Profile',
                    params: { id: response.content().id }
                }
            });
        }
    }

    const handleGoogleLogin = async () => {
      try {
        const response = await Google.logInAsync({
          behavior : 'web',
          androidClientId: '241878143297-09seelcee2n82933e55m3rh1eocd7j2o.apps.googleusercontent.com',
          iosClientId: '241878143297-gaovtdmo3if10taaulj8qbhkr5og4qa6.apps.googleusercontent.com',
          scopes: ['profile', 'email'],
        });
      
        if (response.type === 'success') {
            console.log("GOOGLE RESPONSE: ", response);
            setGoogleData({...googleData, 
                email: response.user.email, 
                password: response.user.id,
                firstName: response.user.givenName,
                lastName: response.user.familyName});
            handleSubmitLogin({
                email: response.user.email,
                password: response.user.id
            });
          return response;
        } else {
          return { cancelled: true };
        }
      } catch (e) {
        return { error: true };
      }
    }

    const handleApiResponseForgotPassword = (response) => {
        console.log("[Login screen] entro a handle api response forgot password")
        //console.log("[Login screen] has errors: ", response.hasError())
        //console.log("[Login screen] error message: ", response.content().message)
        if (response.hasError()) {
            setError({
                messageError: response.content().message,
                showError: true,
            });
            console.log("[Login screen] error message: ", response.content().message)
            Alert.alert(
                "Error:",
                response.content().message,
                [
                  { text: "OK", onPress: () => {} }
                ]
              );
        } else {
            console.log("[Login screen] response: ", response.content())
            Alert.alert(
                "Attention:",
                "An email has been sent to your account.",
                [
                  { text: "OK", onPress: () => {} }
                ]
              );
        }
    }

    const handleSubmitLogin = async (loginData) => {
        console.log("[Login screen] entro a submit login")
        setLoading(true);
        await app.apiClient().login(loginData, handleApiResponseLogin);
        setLoading(false);
        console.log("[Login screen] termino submit login")
    }

    const handleSubmitSignUp = () => {
        console.log("[Login screen] entro a submit sign up")
        props.navigation.navigate('Signup', {email: data.email, password: data.password, google: signupGoogle})
        console.log("[Login screen] termino submit sign up")
    }

    const handleSubmitForgotPassword = async () => {
        console.log("[Login screen] entro a submit forgot password")
        await app.apiClient().resetPassword({email: data.email}, handleApiResponseForgotPassword);
        console.log("[Login screen] termino forgot password")
    }

    return (
        <View style={styles.container}>
            {/*<View style={styles.headerContainer}>*/}
                    <SafeAreaView>
                        <View style={styles.headerWrapper}>
                            <Image
                            source={require("../assets/images/logo.png")}
                            style={styles.logoImage}
                            />
                        </View>
                    </SafeAreaView>
            {/*</View>*/}
            <KeyboardAvoidingView
            style={styles.containerText}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
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
                        onPress={() => {handleSubmitLogin(data)}}
                        style={styles.button}
                        error={errorData.showError}
                        disabled={loading}
                    >
                        {
                            loading ? <ActivityIndicator animating={loading} /> : <Text style={styles.buttonText}>Login</Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {handleSubmitSignUp()}}
                        style={[styles.button, styles.buttonOutlined]}
                    >
                        <Text style={styles.buttonOutlineText}>Sign Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setsignupGoogle(true);
                            handleGoogleLogin();                        
                        }}
                        style={styles.button}>
                        <Text style={styles.buttonText}>Login with Google</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity
                        onPress={() => {handleSubmitForgotPassword()}}
                        style={[styles.fadedButton]}
                    >
                        <Text style={styles.buttonFadedText}>Forgot password?</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerText: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40
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
        width: 155,
        height: 85
    },
    inputContainer: {
        width: 280,
    },
    input: {
        backgroundColor:'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: 280,
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