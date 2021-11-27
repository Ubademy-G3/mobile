import React, { Component, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppState, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert, ActivityIndicator } from 'react-native';
import {app} from '../app/app';
import SelectDropdown from 'react-native-select-dropdown'
import Feather from 'react-native-vector-icons/Feather'
import { auth } from '../firebase'

Feather.loadFont();

const rols = ["Student", "Instructor"];
const subscriptions = ["Free", "Platinum", "Gold"];

const SignupScreen = (props) => {
    const param_email = props.route.params ? props.route.params.email: '';
    const param_password = props.route.params ? props.route.params.password: '';
    const param_signupGoogle = props.route.params ? props.route.params.google: '';
    const param_firstName = props.route.params ? props.route.params.firstName: '';
    const param_lastName = props.route.params ? props.route.params.lastName: '';
    
    const [SignUpData, setData] = useState({
        firstName: param_firstName,
        lastName: param_lastName,
        email: param_email, 
        password: param_password, 
        location: '',
        rol:'',
        interests: [],
        description: "",
        subscription_type: '',//deberia darle opciones a elegir
    });

    const [errorData, setError] = useState({
        messageError: '',
        showError: false,
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("[Signup screen] params: ", props.route.params);
        console.log("[Signup screen] Entro a use effect")
    }, [errorData.showError]);

    const handleApiResponseLogin = (response) => {
        console.log("[Signup screen] entro a handle api response")
        if (response.hasError()) {
            setError({
                ...errorData,
                messageError: response.content().message,
                showError: true,
            });
            console.log("[Signup screen] error")
            Alert.alert(
                "Login error:",
                response.content().message,
                [
                  { text: "OK", onPress: () => {} }
                ]
              );
        } else {
            app.loginUser(response.content().token, response.content().id);
            console.log("[Signup screen] token: ", response.content().token);
            props.navigation.replace('TabNavigator', {
                screen: 'Drawer',
                params: { screen: 'Profile',
                    params: { id: response.content().id }
                }
            });
        }
    }
   
    const handleApiResponseSignUp = (response) => {
        console.log("[Signup screen] entro a handle api response sign up")
        if (response.hasError()) {
            setError({
                ...errorData,
                messageError: response.content().message,
                showError: true,
            });
            console.log("[Signup screen] error")
            console.log("[Signup screen] show error: ", errorData.showError);
            Alert.alert(
                "Signup error:",
                response.content().message,
                [
                  { text: "OK", onPress: () => {} }
                ]
              );
        } else {
            console.log("[Signup screen] done signup")
        }
    }

    const handleSubmitSignUp = async () => {
        console.log("[Signup screen] entro a submit signup")
        setLoading(true);
        console.log("[Signup screen] data:", SignUpData)
        await app.apiClient().signup(SignUpData, handleApiResponseSignUp);
        console.log("[Signup screen] show error: ", errorData.showError);
        //handleFirebaseSignUp()
        if (!errorData.showError) {
            console.log("[Signup screen] entro a submit login");
            await app.apiClient().login({email: SignUpData.email, password: SignUpData.password}, handleApiResponseLogin);
            console.log("[Signup screen] termino submit login");
        }
        setLoading(false);
        console.log("[Signup screen] termino submit signup")
    }
    /*const handleFirebaseSignUp = () => {
        console.log("[Signup screen] firebase signup")
        auth
          .createUserWithEmailAndPassword(SignUpData.email, SignUpData.password)
          .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Registered with:', user.email);
          })
          .catch(error => alert(error.message))
        console.log("[Signup screen] termino firebase signup")
    }*/

    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                
                {!param_signupGoogle && (
                    <>
                        <TextInput
                        placeholder="First Name"
                        onChangeText={text => setData({
                            ...SignUpData,
                            firstName: text,
                        })}
                        value={SignUpData.firstName}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Last Name"
                        onChangeText={text => setData({
                            ...SignUpData,
                            lastName: text,
                        })}
                        value={SignUpData.lastName}
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
                    </>
                )}
                <TextInput
                    placeholder="Location"
                    onChangeText={text => setData({
                        ...SignUpData,
                        location: text,
                    })}
                    value={SignUpData.location}
                    style={styles.input}
                />
                <SelectDropdown
                    data={rols}
                    onSelect={(selectedItem, index) => setData({
                        ...SignUpData,
                        rol: selectedItem,
                    })}
                    value={SignUpData.rol}
                    defaultButtonText={"Select a rol"}
                    buttonStyle={styles.buttonDropdown}
                    buttonTextStyle={styles.textDropdown}
                    renderDropdownIcon={() => {
                        return (
                          <Feather name="chevron-down" color={"#444"} size={18} />
                        );
                      }}
                />
                <SelectDropdown
                    data={subscriptions}
                    onSelect={(selectedItem, index) => setData({
                        ...SignUpData,
                        subscription_type: selectedItem,
                    })}
                    value={SignUpData.subscription_type}
                    defaultButtonText={"Select a subscription type"}
                    buttonStyle={styles.buttonDropdown}
                    buttonTextStyle={styles.textDropdown}
                    renderDropdownIcon={() => {
                        return (
                          <Feather name="chevron-down" color={"#444"} size={18} />
                        );
                    }}
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => {handleSubmitSignUp()}}
                    style={styles.button}
                    disabled={loading}
                >
                    {
                        loading ? <ActivityIndicator animating={loading} /> : <Text style={styles.buttonText}>Save</Text>
                    }
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
        //paddingTop: 5,
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
    buttonDropdown: {
        width:'100%',
        height: 40,
        backgroundColor:'white',
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    textDropdown: {
        color: "#444",
        fontSize: 14,
        textAlign: 'left',
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