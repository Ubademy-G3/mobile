import React, { Component, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppState, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert, ActivityIndicator } from 'react-native';
import {app} from '../app/app';
import SelectDropdown from 'react-native-select-dropdown'
import Feather from 'react-native-vector-icons/Feather'
import MultiSelect from 'react-native-multiple-select';

Feather.loadFont();

const rols = ["student", "instructor"];
// const subscriptions = ["free", "platinum", "gold"];

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
        /* registerType: "not-google",
        loginType: "not-google", */

    });

    const [errorData, setError] = useState({
        messageError: '',
        showError: false,
    });

    const [loading, setLoading] = useState(false);

    const [selectInterets, setSelectInterets] = useState(false);

    const [categories, setCategories] = useState([]);

    const [selectedItems, setSelectedItems] = useState([]);

    const handleApiResponseGetCategories = (response) => {
        console.log("[Create Course screen] response content: ", response.content())
        if (!response.hasError()) {
            setCategories(response.content())
        } else {
            console.log("[Create Course screen] error", response.content().message);
        }
    }

    const handleApiResponseLogin = async (response) => {
        console.log("[Signup screen] entro a handle api response:", response.content());
        if (response.hasError()) {
            console.log("[Signup screen] error")
            Alert.alert(
                "Login error:",
                response.content().message,
                [
                  { text: "OK", onPress: () => {} }
                ]
              );
        } else {
            await app.loginUser(response.content().token, response.content().id);
            console.log("[Signup screen] token: ", response.content().token);
            setData({...SignUpData, id: response.content().id});
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
        console.log("[Signup screen] response content: ", response.content())
        if (!response.hasError()) {
            //let idLS = await app.getId();
            console.log("[Signup screen] ID!!!: ", SignUpData.id)
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
            setError({
                ...errorData,
                showError: false,
            });
        }
    }

    const handleSubmitEditProfile = async () =>{
        console.log("[Signup screen] entro a submit edit profile")
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        console.log("[Signup screen] token:", tokenLS);
        console.log("[Signup screen] id:", idLS);
        await app.apiClient().editProfile({
            id: idLS,
            interests: SignUpData.interests,
            token: tokenLS}, idLS, handleApiResponseEditProfile);
        setLoading(false);
        console.log("[Signup screen] termino submit signup")
    }

    const handleSubmitSignUp = async () => {
        console.log("[Signup screen] entro a submit signup")
        setLoading(true);
        console.log("[Signup screen] data:", SignUpData)
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
        console.log("[Signup screen] show error: ", errorData.showError);
        setLoading(false);
        console.log("[Signup screen] termino submit signup")
    }

    const onSelectedItemsChange = (selectedItems) => {
        setSelectedItems(selectedItems);
    };

    const doLogin = async () => {
        if (!errorData.showError) {
            console.log("[Signup screen] entro a submit login");
            if (param_signupGoogle) {
                await app.apiClient().login({email: SignUpData.email, password: SignUpData.password, loginType: "google"}, handleApiResponseLogin);
            } else {
                await app.apiClient().login({email: SignUpData.email, password: SignUpData.password, loginType: "not-google"}, handleApiResponseLogin);
            }
            console.log("[Signup screen] termino submit login");
        }
    }

    useEffect(() => {
        console.log("[Signup screen] params: ", props.route.params);
        console.log("[Signup screen] Entro a use effect");
        if(SignUpData.rol != '') {
            doLogin();
        }
    }, [errorData]);

    /* useEffect(() => {
        if (param_signupGoogle) {
            console.log("SETEO TYPES EN GOOGLE");
            setData({...SignUpData, registerType: "google", loginType: "google"});
        }
    }, []); */

    useEffect(() => {
        console.log("[Signup screen] entro a useEffect", SignUpData); 
        setData({
            ...SignUpData,
            interests: selectedItems,
        });
    }, [selectedItems]);
    
    return (
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
                            loading ? <ActivityIndicator animating={loading} /> : <Text style={styles.buttonText}>Save</Text>
                        }
                    </TouchableOpacity>
                )}
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
    inputMultiSelect : {
        backgroundColor:'white',
        paddingHorizontal: 15,
        //paddingVertical: 5,
        borderRadius: 10,
        marginTop: 5,
    },
    inputText: {
        color:'#87ceeb',
        fontWeight: '700',
        fontSize: 16,
        //paddingVertical: 5,
        paddingTop:10,
    },
})

export default SignupScreen;