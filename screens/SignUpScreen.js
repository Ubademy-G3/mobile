import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Platform, ActivityIndicator, Modal, Pressable } from 'react-native';
import {app} from '../app/app';
import SelectDropdown from 'react-native-select-dropdown'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MultiSelect from 'react-native-multiple-select';
import { ScrollView } from 'react-native-gesture-handler';
import { firebase } from '../firebase';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

Feather.loadFont();
MaterialCommunityIcons.loadFont();

const rols = ["student", "instructor"];
const db = firebase.default.firestore();

const SignupScreen = (props) => {
    const param_email = props.route.params ? props.route.params.email: '';
    const param_password = props.route.params ? props.route.params.password: '';
    const param_signupGoogle = props.route.params ? props.route.params.google: '';
    const param_firstName = props.route.params ? props.route.params.firstName: '';
    const param_lastName = props.route.params ? props.route.params.lastName: '';
    
    const [SignUpData, setData] = useState({
        id: 0,
        firstName: param_firstName,
        lastName: param_lastName,
        email: param_email, 
        password: param_password, 
        location: '',
        rol:'',
        interests: [],
        description: "",
        subscription: 'free',
        profilePictureUrl: "https://firebasestorage.googleapis.com/v0/b/ubademy-mobile.appspot.com/o/c23449d1-43e3-4cc5-9681-25d563ee5ab9.jpg?alt=media&token=8ec949cd-5ad1-4bbf-a1a5-c3d7c612e440",
        favoriteCourses: [],

    });

    const [errorData, setError] = useState({
        messageError: '',
        showError: false,
    });
    const [loading, setLoading] = useState(false);
    const [modalErrorVisible, setModalErrorVisible] = useState(false);
    const [modalErrorText, setModalErrorText] = useState({
        title: "",
        body: "",
    });
    const [selectInterets, setSelectInterets] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [expoPushToken, setExpoPushToken] = useState("");

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    }, []);

    const registerForPushNotificationsAsync = async () => {
        let token;
        if (Constants.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          token = (await Notifications.getExpoPushTokenAsync()).data;
        } else {
          alert('Must use physical device for Push Notifications');
        }
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
        return token;
      }

    const handleApiResponseGetCategories = (response) => {
        if (!response.hasError()) {
            setCategories(response.content())
        } else {
            console.log("[Create Course screen] error", response.content().message);
        }
    }

    const handleApiResponseLogin = async (response) => {
        if (response.hasError()) {
            setModalErrorText({ title: "Login error:", body: response.content().message});
            setModalErrorVisible(true);
        } else {
            await app.loginUser(response.content().token, response.content().id);
            setData({...SignUpData, id: response.content().id});
            db.collection('users').doc(response.content().id).set({
                id: response.content().id,
                expoPushToken: expoPushToken
            });
            if (SignUpData.rol === "student") {
                setSelectInterets(true);
                await app.apiClient().getAllCategories({token: response.content().token}, handleApiResponseGetCategories);
            } else {
                props.navigation.replace('TabNavigator', {
                    screen: 'Drawer',
                    params: { screen: 'Profile',
                        params: { id: response.content().id }
                    }
                });
            }
        }
    }

    const handleApiResponseEditProfile = async (response) => {
        if (!response.hasError()) {
            props.navigation.replace('TabNavigator', {
                screen: 'Drawer',
                params: { screen: 'Profile',
                    params: { id: SignUpData.id }
                }
            });
        } else {
            console.log("[Signup screen] error", response.content().message);
        }
    }
   
    const handleApiResponseSignUp = (response) => {
        if (response.hasError()) {
            setError({
                ...errorData,
                messageError: response.content().message,
                showError: true,
            });
            setModalErrorText({ title: "Signup error:", body: response.content().message});
            setModalErrorVisible(true);
        } else {
            setError({
                ...errorData,
                showError: false,
            });
        }
    }

    const handleSubmitEditProfile = async () =>{
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        await app.apiClient().editProfile({
            id: idLS,
            interests: SignUpData.interests,
            token: tokenLS}, idLS, handleApiResponseEditProfile);
        setLoading(false);
    }

    const handleSubmitSignUp = async () => {
        setLoading(true);
        if (param_signupGoogle) {
            await app.apiClient().signup({
                firstName: SignUpData.firstName,
                lastName: SignUpData.lastName,
                email: SignUpData.email, 
                password: SignUpData.password, 
                location: SignUpData.location,
                rol: SignUpData.rol,
                interests: SignUpData.interests,
                description: SignUpData.description,
                subscription: SignUpData.subscription,
                profilePictureUrl: SignUpData.profilePictureUrl,
                favoriteCourses: SignUpData.favoriteCourses,
                registerType: "google"
        
            }, handleApiResponseSignUp);
        } else {
            await app.apiClient().signup({
                firstName: SignUpData.firstName,
                lastName: SignUpData.lastName,
                email: SignUpData.email, 
                password: SignUpData.password, 
                location: SignUpData.location,
                rol: SignUpData.rol,
                interests: SignUpData.interests,
                description: SignUpData.description,
                subscription: SignUpData.subscription,
                profilePictureUrl: SignUpData.profilePictureUrl,
                favoriteCourses: SignUpData.favoriteCourses,
                registerType: "not-google"
        
            }, handleApiResponseSignUp);
        }
        setLoading(false);
    }

    const onSelectedItemsChange = (selectedItems) => {
        setSelectedItems(selectedItems);
    };

    const doLogin = async () => {
        if (!errorData.showError) {
            if (param_signupGoogle) {
                await app.apiClient().login({email: SignUpData.email, password: SignUpData.password, loginType: "google"}, handleApiResponseLogin);
            } else {
                await app.apiClient().login({email: SignUpData.email, password: SignUpData.password, loginType: "not-google"}, handleApiResponseLogin);
            }
        }
    }

    useEffect(() => {
        if(SignUpData.rol != '') {
            doLogin();
        }
    }, [errorData]);

    useEffect(() => {
        setData({
            ...SignUpData,
            interests: selectedItems,
        });
    }, [selectedItems]);
    
    return (
        <View>
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
                                <Text style={styles.modalText}>{modalErrorText.title}</Text>
                            </View>
                            <Text style={styles.modalText}>{modalErrorText.body}</Text>
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
            <SafeAreaView>
                <View style={styles.headerWrapper}>
                    <Image
                    source={require("../assets/images/logo.png")}
                    style={styles.logoImage}
                    />
                </View>
            </SafeAreaView>
            <ScrollView style = {styles.scrollView}>
                <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <View style={styles.inputContainer}>
                        {!selectInterets && (
                            <>
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
                            {SignUpData.rol === "student" &&(
                                <>
                                <TextInput
                                    placeholder="Location"
                                    onChangeText={text => setData({
                                        ...SignUpData,
                                        location: text,
                                    })}
                                    value={SignUpData.location}
                                    style={styles.input}
                                />
                                </>
                            )}
                            </>
                        )}
                        {selectInterets && (
                            <>
                            <Text style={styles.inputText}>Interests</Text>
                            <MultiSelect
                                hideTags
                                items={categories}
                                uniqueKey="id"
                                onSelectedItemsChange={onSelectedItemsChange}
                                selectedItems={selectedItems}
                                selectText="Pick all your interests"
                                searchInputPlaceholderText="Select your interests..."
                                onChangeInput={(text) => console.log(text)}
                                tagRemoveIconColor="#CCC"
                                tagBorderColor="#CCC"
                                tagTextColor="#CCC"
                                selectedItemTextColor="#CCC"
                                selectedItemIconColor="#CCC"
                                itemTextColor="#000"
                                displayKey="name"
                                styleMainWrapper={styles.inputMultiSelect}
                                searchInputStyle={{color: '#CCC'}}
                                submitButtonColor="#48d22b"
                                submitButtonText="Submit"
                            />
                            </>
                        )}
                    </View>
                    <View style={styles.buttonContainer}>
                        {!selectInterets && (
                        <TouchableOpacity
                            onPress={() => {handleSubmitSignUp()}}
                            style={styles.button}
                            disabled={loading}
                        >
                            {
                                loading ? <ActivityIndicator color="#696969" animating={loading} /> : <Text style={styles.buttonText}>Save</Text>
                            }
                        </TouchableOpacity>
                        )}
                        {selectInterets && (
                            <TouchableOpacity
                                onPress={() => {handleSubmitEditProfile()}}
                                style={styles.button}
                                disabled={loading}
                            >
                                {
                                    loading ? <ActivityIndicator color="#696969" animating={loading} /> : <Text style={styles.buttonText}>Save</Text>
                                }
                            </TouchableOpacity>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView:{
        height: 400
    },
    headerContainer: {
        flex: 1,
        paddingBottom: 5,
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
    inputMultiSelect : {
        backgroundColor:'white',
        paddingHorizontal: 15,
        borderRadius: 10,
        marginTop: 5,
    },
    inputText: {
        color:'#87ceeb',
        fontWeight: '700',
        fontSize: 16,
        paddingTop:10,
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

export default SignupScreen;