import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Modal, Pressable } from 'react-native';
import { app } from '../app/app';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Google from 'expo-google-app-auth';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

MaterialCommunityIcons.loadFont();
Ionicons.loadFont();

const LoginScreen = (props) => {                   
    const [data, setData] = useState({
        email: '',
        password: '',
        loginType: "not-google",
    });

    const [googleData, setGoogleData] = useState({
        firstName: "",
        lastName: "",
        password: "",
        email: ""
    })

    const [loading, setLoading] = useState(false);
    const [modalErrorVisible, setModalErrorVisible] = useState(false);
    const [modalErrorText, setModalErrorText] = useState("");
    const [modalAttentionVisible, setModalAttentionVisible] = useState(false);
    const [modalAttentionText, setModalAttentionText] = useState("");
    const [login, setLogin] = useState(false);
    const [restorePassword, setRestorePassword] = useState(false);
    const [token, setToken] = useState(0);
    const [id, setId] = useState(0);
    const mounted = useRef(false);

    const handleApiResponseLogin = async (response) => {
        if (response.hasError()) {
            if (response.content().message === "User not found" &&
            data.loginType === "google"){
                props.navigation.replace('Signup', {
                    email: googleData.email, 
                    password: googleData.password, 
                    google: true,
                    firstName: googleData.firstName,
                    lastName: googleData.lastName});
            }            
            else {
                if (response.content().status === 400) {
                    setModalErrorText("Invalid fields");
                } else if (response.content().status === 403) {
                    setModalErrorText("Invalid credentials");
                } else if (response.content().status === 404) {
                    setModalErrorText("User not found with given email");
                } else {
                    setModalErrorText("Unexpected error. Please try again in a few seconds.");
                }
                setModalErrorVisible(true);
            }
        } else {
            if (response.content().subscriptionState === "about_to_expire") {
                setModalAttentionText("Your subscription is about to expire, remember to renew it.");
                setModalAttentionVisible(true);
                setToken(response.content().token);
                setId(response.content().id);
            } else if (response.content().subscriptionState === "expired") {
                setModalAttentionText("Your subscription expired, your subscription is now free.");
                setModalAttentionVisible(true);
                setToken(response.content().token);
                setId(response.content().id);
            } else {
                await app.loginUser(response.content().token, response.content().id);
                props.navigation.replace('TabNavigator', {
                    screen: 'Drawer',
                    params: { screen: 'Profile',
                        params: { id: response.content().id }
                    }
                });
            }
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
          return response;
        } else {
          return { cancelled: true };
        }
      } catch (e) {
        return { error: true };
      }
    }

    const handleApiResponseForgotPassword = (response) => {
        if (response.hasError()) {
            setModalErrorText(response.content().message);
            setModalErrorVisible(true);
        } else {
            setModalAttentionText("An email has been sent to your account.");
            setModalAttentionVisible(true);
        }
    }

    const handleSubmitSignUp = () => {
        props.navigation.navigate('Signup', {email: data.email, password: data.password, google: false})
    }

    const handleSubmitForgotPassword = () => {
        setRestorePassword(true);
    }

    const handleSubmitDontRestore = () => {
        setRestorePassword(false);
    }

    const handleSubmitRestorePassword = async () => {
        await app.apiClient().resetPassword({email: data.email}, handleApiResponseForgotPassword);
    }

    const handleOkModalAttention = async () => {
        setModalAttentionVisible(!modalAttentionVisible);
        if(modalAttentionText === "Your subscription expired, your subscription is now free." ||
        modalAttentionText === "Your subscription is going to expire in 5 days, remember to renew it.") {
            await app.loginUser(token, id);
            props.navigation.replace('TabNavigator', {
                screen: 'Drawer',
                params: { screen: 'Profile',
                    params: { id: id }
                }
            });
        }
    }

    const callback = useCallback(async () => {
        if (data.loginType === "google" && mounted.current) {
            const response = await handleGoogleLogin();
            setGoogleData({...googleData, 
                email: response.user.email, 
                password: response.user.id,
                firstName: response.user.givenName,
                lastName: response.user.familyName});
            setData({...data, email: response.user.email,
                password: response.user.id})
        }
      }, [data.loginType])

    const callbackLogin = useCallback(async () => {
        if (login === true && mounted.current) {
            setLoading(true);
            await app.apiClient().login(data, handleApiResponseLogin);
            if (mounted.current){
                setLoading(false);
                setLogin(false);
            }
        }
    }, [login])
    
    useEffect(() => {
        mounted.current = true;
        callback()
        return () => {
            mounted.current = false;
        }
    }, [callback])

    useEffect(() => {
        if (data.loginType === "google") {
            setLogin(true);
        }
    }, [data.email])

    useEffect(() => {
        mounted.current = true;
        callbackLogin();
        return () => {
            mounted.current = false;
        }
    }, [callbackLogin])

    return (
        <>
            <>
                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalErrorVisible}
                        onRequestClose={() => {
                        setModalErrorVisible(!modalErrorVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <View style={{ display:'flex', flexDirection: 'row' }}>
                                    <MaterialCommunityIcons
                                        name="close-circle-outline"
                                        size={30}
                                        color={"#ff6347"}
                                        style={{ position: 'absolute', top: -6, left: -35}}
                                    />
                                    <Text style={styles.modalText}>Login Error:</Text>
                                </View>
                                <Text style={styles.modalText}>{modalErrorText}</Text>
                                <Pressable
                                style={[styles.buttonModal, styles.buttonClose]}
                                onPress={() => setModalErrorVisible(!modalErrorVisible)}
                                >
                                    <Text style={styles.textStyle}>Ok</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalAttentionVisible}
                        onRequestClose={() => {
                        setModalAttentionVisible(!modalAttentionVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <View style={{ display:'flex', flexDirection: 'row' }}>
                                    <MaterialCommunityIcons
                                        name="alert-circle-outline"
                                        size={30}
                                        color={"#87ceeb"}
                                        style={{ position: 'absolute', top: -6, left: -35}}
                                    />
                                    <Text style={styles.modalText}>Attention:</Text>
                                </View>
                                <Text style={styles.modalText}>{modalAttentionText}</Text>
                                <Pressable
                                style={[styles.buttonModal, styles.buttonAttention]}
                                onPress={() => handleOkModalAttention()}
                                >
                                    <Text style={styles.textStyle}>Ok</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                </View>
            </>
            <View style={styles.container}>
                <SafeAreaView>
                    <View style={styles.headerWrapper}>
                        <Image
                        source={require("../assets/images/logo.png")}
                        style={styles.logoImage}
                        />
                    </View>
                </SafeAreaView>
                <ScrollView>
                    <KeyboardAvoidingView
                    style={styles.containerText}
                    behavior={Platform.OS === "ios" ? "padding" : "padding"}
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
                            {!restorePassword && (
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
                            )}
                        </View>
                        <View style={styles.buttonContainer}>
                            {!restorePassword && (
                                <>
                                <TouchableOpacity
                                    onPress={() => {setLogin(true)}}
                                    style={styles.button}
                                    //error={errorData.showError}
                                    disabled={loading}
                                >
                                    {
                                        loading ? <ActivityIndicator color="#696969" animating={loading} /> : <Text style={styles.buttonText}>Login</Text>
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
                                        //setsignupGoogle(true);
                                        setData({...data, loginType: "google"});
                                    }}
                                    style={styles.button}
                                >
                                    <View style={{display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: "center"}}>
                                    <Ionicons
                                        name="logo-google"
                                        size={20}
                                        color={"white"}
                                        style={{marginRight: 15}}
                                    />
                                    <Text style={[styles.buttonText, {}]}>Login with Google</Text>
                                    </View>
                                </TouchableOpacity> 
                                <TouchableOpacity
                                    onPress={() => {handleSubmitForgotPassword()}}
                                    style={[styles.fadedButton]}
                                >
                                    <Text style={styles.buttonFadedText}>Forgot password?</Text>
                                </TouchableOpacity>
                                </>
                            )}
                            {restorePassword && (
                                <>
                                <TouchableOpacity
                                    onPress={() => {handleSubmitRestorePassword()}}
                                    style={styles.button}
                                >
                                    <Text style={styles.buttonText}>Restore password</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {handleSubmitDontRestore()}}
                                    style={[styles.fadedButton]}
                                >
                                    <Text style={styles.buttonFadedText}>Go back</Text>
                                </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerText: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30
    },
    headerWrapper: {
        paddingTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 40,
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
        paddingTop: 10,
        marginBottom: 8,
    },
    buttonText: {
        color:'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlined: {
        backgroundColor:'white',
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
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        paddingHorizontal: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    buttonModal: {
        borderRadius: 20,
        paddingHorizontal: 40,
        paddingVertical: 15,
        elevation: 2
    },
    buttonClose: {
        backgroundColor: "#ff6347",
    },
    buttonAttention: {
        backgroundColor: "#87ceeb",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
})

export default LoginScreen;