import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import forYouData from '../assets/data/forYouData'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { app } from '../app/app';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const MenuEditProfileScreen = (props) => {
    const [userData, setData] = useState({
        firstName: "",
        lastName: "",
        location: "",
        //profilePicture: "",
        //description: "",
    });

    const [loading, setLoading] = useState(false);

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
    
    const handleSubmitEditProfile = async () =>{
        console.log("[Edit Profile screen] entro a submit edit profile")
        setLoading(true);
        console.log("[Edit Profile screen] data:", userData)
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        console.log("[Edit Profile screen] token:",tokenLS);
        await app.apiClient().editProfile({firstName: userData.firstName,
            lastName: userData.lastName,
            location: userData.location,
            //profilePicture: "",
            //description: userData.description, 
            token: tokenLS}, idLS, handleApiResponseEditProfile);
        setLoading(false);
        console.log("[Edit Profile screen] termino submit signup")
    }

    const handleApiResponseProfile = (response) => {
        console.log("[Edit Profile screen] content: ", response.content())
        if (!response.hasError()) {
            setData({
                firstName: response.content().firstName,
                lastName: response.content().lastName,
                location: response.content().location,
                profilePicture: response.content().profilePicture,
                //description: response.content().description,
            });
        } else {
            console.log("[Edit Profile screen] error", response.content().message);
        }
    }
    
    const onRefresh = async () => {
        console.log("[Edit Profile screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        console.log("[Edit Profile screen] token:",tokenLS);
        await app.apiClient().getProfile({id: idLS, token: tokenLS}, idLS, handleApiResponseProfile);
        setLoading(false);
    };

    useEffect(() => {
        console.log("[Edit Profile screen] entro a useEffect"); 
        console.log("[Edit Profile screen] params: ", props.route.params)
        onRefresh();
    }, []);

    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            {/*<View>
                    <Image source={image} style={styles.titlesImage} />
            </View>*/}
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
                {/**<Text style={styles.inputText}>Description</Text>
                <TextInput
                    placeholder={userData.description}
                    onChangeText={text => setData({
                        ...userData,
                        description: text,
                    })}
                    value={userData.description}
                    style={styles.input}
                />*/}
            </View>
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
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //paddingTop: 5,
    },
    /*logoImage: {
        width: 75,
        height: 75,
        borderRadius: 40,
    },*/
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

export default MenuEditProfileScreen;