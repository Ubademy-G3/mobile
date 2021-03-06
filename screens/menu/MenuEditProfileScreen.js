import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Modal, Pressable } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { app } from '../../app/app';
import MultiSelect from 'react-native-multiple-select';
import { ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from "expo-image-picker";
import { firebase } from '../../firebase';
import { useFocusEffect } from '@react-navigation/native';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const MenuEditProfileScreen = (props) => {

    const [userData, setData] = useState({
        firstName: "",
        lastName: "",
        location: "",
        profilePictureUrl: "",
        description: "",
        interests: [],
        rol:"",
    });
    const [loading, setLoading] = useState(false);
    const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
    const [modalSuccessText, setModalSuccessText] = useState("");
    const [modalErrorVisible, setModalErrorVisible] = useState(false);
    const [modalErrorText, setModalErrorText] = useState("");
    const [modalAttentionVisible, setModalAttentionVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loadingButton, setLoadingButton] = useState(false);

    const handleApiResponseEditProfile = (response) => {
        if (!response.hasError()) {
            setModalSuccessVisible(true);
            setModalSuccessText(response.content().message);
        } else {
            setModalErrorVisible(true);
            setModalErrorText(response.content().message);
        }
    }

    const handleApiResponseGetCategories = (response) => {
        if (!response.hasError()) {
            setCategories(response.content())
        } else {
            console.log("[Create Course screen] error", response.content().message);
        }
    }

    const handleApiResponseProfile = (response) => {
        if (!response.hasError()) {
            setData({
                firstName: response.content().firstName,
                lastName: response.content().lastName,
                location: response.content().location,
                profilePictureUrl: response.content().profilePictureUrl,
                description: response.content().description,
                interests: response.content().interests,
                rol: response.content().rol,
            });
        } else {
            console.log("[Edit Profile screen] error", response.content().message);
        }
    }

    const handleSubmitEditProfile = async () =>{
        setLoadingButton(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        await app.apiClient().editProfile({
            id: idLS,
            firstName: userData.firstName,
            lastName: userData.lastName,
            location: userData.location,
            profilePictureUrl: userData.profilePictureUrl,
            description: userData.description, 
            interests: userData.interests,
            token: tokenLS}, idLS, handleApiResponseEditProfile);
        setLoadingButton(false);
    }
    
    const onRefresh = async () => { 
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        await app.apiClient().getProfile({id: idLS, token: tokenLS}, idLS, handleApiResponseProfile);
        await app.apiClient().getAllCategories({token: tokenLS}, handleApiResponseGetCategories);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            onRefresh();
        }, [])
    );

    const choosePhotoFromLibrary = async () => {
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
          });
        const mediaUri = Platform.OS === 'ios' ? pickerResult.uri.replace('file://', '') : pickerResult.uri;
        uploadMediaOnFirebase(mediaUri);
    }
    
    const uploadMediaOnFirebase = async (mediaUri) => {
        const uploadUri = mediaUri;
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

        try{
            const response = await fetch(uploadUri);
            const blob = await response.blob();
            const task = firebase.default.storage().ref(filename);
            await task.put(blob);
            const newURL = await task.getDownloadURL(); 
            setData({
                ...userData,
                profilePictureUrl: newURL,
            })
            setModalAttentionVisible(true);
            /* Alert.alert(
                'Image Uploaded',
                'Your image has been uploaded'
            ); */
        } catch(err) {
            console.log("Error en el firebase storage:", err);
        }
    }

    useEffect(() => {
        setData({
            ...userData,
            interests: selectedItems,
        })
    }, [selectedItems]);

    const onSelectedItemsChange = (selectedItems) => {
        setSelectedItems(selectedItems);
    };

    return (
        <View style={styles.centeredView}>
            {(modalSuccessVisible || modalErrorVisible || modalAttentionVisible) && (
                <View style={{justifyContent: 'center', alignItems: 'center',}}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalErrorVisible}
                    onRequestClose={() => {
                    setModalErrorVisible(!modalErrorVisible);
                    }}
                >
                    <View style={[styles.centeredView, {justifyContent: 'center', alignItems: 'center',}]}>
                        <View style={styles.modalView}>
                            <View style={{ display:'flex', flexDirection: 'row' }}>
                                <MaterialCommunityIcons
                                    name="close-circle-outline"
                                    size={30}
                                    color={"#ff6347"}
                                    style={{ position: 'absolute', top: -6, left: -35}}
                                />
                                <Text style={styles.modalText}>Update Unsuccesfull:</Text>
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
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalSuccessVisible}
                    onRequestClose={() => {
                    setModalSuccessVisible(!modalSuccessVisible);
                    }}
                >
                    <View style={[styles.centeredView, {justifyContent: 'center', alignItems: 'center',}]}>
                        <View style={styles.modalView}>
                            <View style={{ display:'flex', flexDirection: 'row' }}>
                                <MaterialCommunityIcons
                                    name="check-circle-outline"
                                    size={30}
                                    color={"#9acd32"}
                                    style={{ position: 'absolute', top: -6, left: -35}}
                                />
                                <Text style={styles.modalText}>Update Succesfull:</Text>
                            </View>
                            <Text style={styles.modalText}>{modalSuccessText}</Text>
                            <Pressable
                            style={[styles.buttonModal, {backgroundColor: "#9acd32"}]}
                            onPress={() => {
                                setModalSuccessVisible(!modalSuccessVisible)}}
                            >
                                <Text style={styles.textStyle}>Ok</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalAttentionVisible}
                    onRequestClose={() => {
                    setModalAttentionVisible(!modalAttentionVisible);
                    }}
                >
                    <View style={[styles.centeredView,{justifyContent: 'center', alignItems: 'center',}]}>
                        <View style={styles.modalView}>
                            <View style={{ display:'flex', flexDirection: 'row' }}>
                                <MaterialCommunityIcons
                                    name="alert-circle-outline"
                                    size={30}
                                    color={"#87ceeb"}
                                    style={{ position: 'absolute', top: -6, left: -35}}
                                />
                                <Text style={styles.modalText}>Image Uploaded:</Text>
                            </View>
                            <Text style={styles.modalText}>Your image has been uploaded</Text>
                            <Pressable
                            style={[styles.buttonModal, styles.buttonAttention]}
                            onPress={() => setModalAttentionVisible(!modalAttentionVisible)}
                            >
                                <Text style={styles.textStyle}>Ok</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                </View>
            )}
            {
            loading ? 
                <View style={{flex:1, justifyContent: 'center'}}>
                    <ActivityIndicator style={{ margin: '50%' }} color="lightblue" animating={loading} size="large" />
                </View>
            :
                <>
                <ScrollView
                >
                    <KeyboardAvoidingView
                    style={styles.containerWrapper}
                    behavior={Platform.OS === "ios" ? "padding" : "padding"}
                    >
                            <TouchableOpacity
                                onPress={() => {choosePhotoFromLibrary()}}
                                disabled={loading}
                            >
                                <View style={{ display:'flex', flexDirection: 'row' }}>
                                    <Image source={{uri: userData.profilePictureUrl}} style={styles.titlesImage} />
                                    <MaterialCommunityIcons
                                        name="camera-outline"
                                        size={25}
                                        color={'grey'}
                                        style={{position: 'absolute', right: -8, bottom: 0,}}
                                    />
                                </View>
                                
                            </TouchableOpacity>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputText}>First Name</Text>
                                <TextInput
                                    placeholder={userData.firstName}
                                    onChangeText={text => setData({
                                        ...userData,
                                        firstName: text,
                                    })}
                                    value={userData.firstName}
                                    style={styles.input}
                                />
                                <Text style={styles.inputText}>Last Name</Text>
                                <TextInput
                                    placeholder={userData.lastName}
                                    onChangeText={text => setData({
                                        ...userData,
                                        lastName: text,
                                    })}
                                    value={userData.lastName}
                                    style={styles.input}
                                />
                                <Text style={styles.inputText}>Description</Text>
                                <TextInput
                                    placeholder={userData.description}
                                    onChangeText={text => setData({
                                        ...userData,
                                        description: text,
                                    })}
                                    value={userData.description}
                                    style={styles.input}
                                />
                                {userData.rol === "student" && (
                                    <>
                                    <Text style={styles.inputText}>Location</Text>
                                    <TextInput
                                        placeholder={userData.location}
                                        onChangeText={text => setData({
                                            ...userData,
                                            location: text,
                                        })}
                                        value={userData.location}
                                        style={styles.input}
                                    />
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
                                
                                <TouchableOpacity
                                    onPress={() => {handleSubmitEditProfile()}}
                                    style={styles.button}
                                    disabled={loadingButton}
                                >
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                    </KeyboardAvoidingView>
                </ScrollView>
                </>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 25,
    },
    titlesImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
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
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
    },
    button: {
        backgroundColor: `#87ceeb`,
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color:'white',
        fontWeight: '700',
        fontSize: 16,
    },
    centeredView: {
        flex: 1,
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

export default MenuEditProfileScreen;