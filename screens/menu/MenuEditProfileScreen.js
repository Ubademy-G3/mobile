import React, { useState, useEffect, setStatus } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Alert, Button } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { app } from '../../app/app';
import MultiSelect from 'react-native-multiple-select';

import * as ImagePicker from "expo-image-picker";
import { firebase } from '../../firebase';

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

    const [categories, setCategories] = useState([]);

    const [selectedItems, setSelectedItems] = useState([]);

    const handleApiResponseEditProfile = (response) => {
        console.log("[Edit Profile screen] response content: ", response.content())
        if (!response.hasError()) {
            Alert.alert(
                "Update Succesfull:",
                response.content().message,
                [
                  { text: "OK", onPress: () => {} }
                ]
            );
        } else {
            console.log("[Edit Profile screen] error", response.content().message);
        }
    }

    const handleApiResponseGetCategories = (response) => {
        console.log("[Create Course screen] response content: ", response.content())
        if (!response.hasError()) {
            setCategories(response.content())
        } else {
            console.log("[Create Course screen] error", response.content().message);
        }
    }

    const handleApiResponseProfile = (response) => {
        console.log("[Edit Profile screen] content: ", response.content())
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
        console.log("[Edit Profile screen] entro a submit edit profile")
        setLoading(true);
        console.log("[Edit Profile screen] data:", userData)
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        console.log("[Edit Profile screen] token:", tokenLS);
        await app.apiClient().editProfile({
            id: idLS,
            firstName: userData.firstName,
            lastName: userData.lastName,
            location: userData.location,
            profilePictureUrl: userData.profilePictureUrl,
            description: userData.description, 
            interests: userData.interests,
            token: tokenLS}, idLS, handleApiResponseEditProfile);
        setLoading(false);
        console.log("[Edit Profile screen] termino submit signup")
    }
    
    const onRefresh = async () => {
        console.log("[Edit Profile screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        console.log("[Edit Profile screen] token:",tokenLS);
        await app.apiClient().getProfile({id: idLS, token: tokenLS}, idLS, handleApiResponseProfile);
        await app.apiClient().getAllCategories({token: tokenLS}, handleApiResponseGetCategories);
        setLoading(false);
    };

    useEffect(() => {
        console.log("[Edit Profile screen] entro a useEffect"); 
        onRefresh();
    }, []);

    const choosePhotoFromLibrary = async () => {
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
          });
        console.log("CARGO UNA IMAGEN:", pickerResult);
        const mediaUri = Platform.OS === 'ios' ? pickerResult.uri.replace('file://', '') : pickerResult.uri;
        console.log("Media URi:", mediaUri);  
        uploadMediaOnFirebase(mediaUri);
    }
    
    const uploadMediaOnFirebase = async (mediaUri) => {
        const uploadUri = mediaUri;
        console.log("uploadUri:", uploadUri);
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
        console.log("filename:", filename);  

        try{
            const response = await fetch(uploadUri);
            const blob = await response.blob();
            const task = firebase.default.storage().ref(filename);
            await task.put(blob);
            const newURL = await task.getDownloadURL();          
            console.log("NUEVO URL:", newURL);
            setData({
                ...userData,
                profilePictureUrl: newURL,
            })
            Alert.alert(
                'Image Uploaded',
                'Your image has been uploaded'
            );
        } catch(err) {
            console.log("Error en el firebase storage:", err);
        }
    }

    useEffect(() => {
        console.log("[Edit Profile screen] entro a useEffect"); 
        setData({
            ...userData,
            interests: selectedItems,
        })
    }, [selectedItems]);

    const onSelectedItemsChange = (selectedItems) => {
        setSelectedItems(selectedItems);
    };

    return (
        <ScrollView
        //contentContainerStyle={styles.container}
        >
            <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                    <TouchableOpacity
                        onPress={() => {choosePhotoFromLibrary()}}
                        /*style={styles.button}*/
                        disabled={loading}
                    >
                        <Image source={{uri: userData.profilePictureUrl}} style={styles.titlesImage} />
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
        {/*             <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={() => {choosePhotoFromLibrary()}}
                                style={styles.button}
                                disabled={loading}
                            >
                                {
                                    <Text style={styles.buttonText}>Change Profile Photo</Text>
                                }
                            </TouchableOpacity>
                    </View> */}
                    <View style={styles.buttonContainer}>
                        
                        <TouchableOpacity
                            onPress={() => {handleSubmitEditProfile()}}
                            style={styles.button}
                            disabled={loading}
                        >
                            {
                                loading ? <ActivityIndicator animating={loading} /> : <Text style={styles.buttonText}>Save</Text>
                            }
                        </TouchableOpacity>
                    </View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 25,
    },
    /*logoImage: {
        width: 75,
        height: 75,
        borderRadius: 40,
    },*/
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
    },
    buttonText: {
        color:'white',
        fontWeight: '700',
        fontSize: 16,
    },
})

export default MenuEditProfileScreen;