import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import forYouData from '../assets/data/forYouData'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import image from "../assets/images/profilePic.jpg"
import { app } from '../app/app';
import CourseComponent from '../components/CourseComponent';

import * as ImagePicker from "expo-image-picker"
import { firebase } from '../firebase'
//import firebase from "firebase";
//import {} from 'firebase/storage';

/*const firebaseConfig = {
    apiKey: "AIzaSyDRUanGZYpuMBy5BjydmRAEVgoDHT-Nv5E",
    authDomain: "ubademy-mobile.firebaseapp.com",
    projectId: "ubademy-mobile",
    storageBucket: "ubademy-mobile.appspot.com",
    messagingSenderId: "241878143297",
    appId: "1:241878143297:web:73b561df646333256511c0",
    measurementId: "G-233TRRELBZ"
};*/

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const ProfileScreen = (props) => {
    const param_id = props.route.params ? props.route.params.id : 'defaultId';//'45f517a2-a988-462d-9397-d9cb3f5ce0e0';
    
    const [loading, setLoading] = useState(false);
    
    const [courses, setCourses] = useState([]);   

    //if (!firebase.apps.length) {
        //firebase.initializeApp(firebaseConfig);
        //firebase.initializeApp(firebaseConfig);
    //} else {
    /*    firebase.app();
    }*/

    const handleCourseResponse = (response) => {
        console.log("[Profile Screen] content: ", response.content())
        if (!response.hasError()) {
               setCourses(courses => [...courses, response.content()]);
        } else {
            console.log("[Profile Screen] error", response.content().message);
        }
    }
    

    const handleGetCoursesByUser = async (response) => {
        console.log("[Profile screen] content: ", response.content())
        if (!response.hasError()) {
            let tokenLS = await app.getToken();
            for(let course of response.content().courses){
                await app.apiClient().getCourseById({token: tokenLS}, course.course_id, handleCourseResponse)
            }
            console.log("[Profile screen] response: ", courses);
        } else {
            console.log("[Profile screen] error", response.content().message);
        }
    }
    
    const [userData, setData] = useState({
        firstName: "Name",
        lastName: "Last name",
        location: "",
        profilePicture: "../assets/images/profilePic.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
        coursesHistory: [],
    });

    const handleApiResponseProfile = (response) => {
        console.log("[Profile screen] content: ", response.content())
        if (!response.hasError()) {            
            setData({
                firstName: response.content().firstName,
                lastName: response.content().lastName,
                location: response.content().location,
                profilePicture: response.content().profilePicture,
                description: response.content().description
            });
            
        } else {
            console.log("[Profile screen] error", response.content().message);
        }
    }
    
    const onRefresh = async () => {
        console.log("[Profile screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        console.log("[Profile screen] token:",tokenLS);
        await app.apiClient().getProfile({id: param_id, token: tokenLS}, param_id, handleApiResponseProfile);
        await app.apiClient().getAllCoursesByUser({token: tokenLS}, param_id, undefined, handleGetCoursesByUser);
        setLoading(false);
    };

    useEffect(() => {
        console.log("[Profile screen] entro a useEffect"); 
        console.log("[Profile screen] param id:", param_id);
        console.log("[Profile screen] params: ", props.route.params)
        onRefresh();
    }, [param_id]);
        

    const choosePhotoFromLibrary = async () => {
        const pickerResult = await ImagePicker.launchImageLibraryAsync();
        console.log("CARGO UNA IMAGEN:", pickerResult);
        const mediaUri = Platform.OS === 'ios' ? pickerResult.uri.replace('file://', '') : pickerResult.uri;
        console.log("Media URi:", mediaUri);  
        uploadMediaOnFirebase(mediaUri);
        
        /*const blob = await new Promise<Blob>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', mediaUri, true);
            xhr.send(null);
        });
    
        return {
            blob: <Blob>blob</Blob>,
            uri: mediaUri,
        };*/
    }
    
    const uploadMediaOnFirebase = async (mediaUri) => {
        /*const result = await choosePhotoFromLibrary();
        if (!result || !result.blob) return;
        let filename = result.uri.substring(result.uri.lastIndexOf('/') + 1);

        const ref = firebase
            .storage()
            .ref()
            .child(filename);
        await ref.put(result.blob);
        const newURL = await ref.getDownloadURL();
        console.log("NEW URL: ", newURL)*/
        //updateProfilePicURL(newURL);
        //await updateProfileInfo();
        const uploadUri = mediaUri;
        console.log("uploadUri:", uploadUri);
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
        console.log("filename:", filename);  

        try{
            const response = await fetch(uploadUri);
            const blob = await response.blob();
            const task = await firebase.default.storage().ref(filename).put(blob);
            Alert.alert(
                'Image Uploaded',
                'Your image has been uploaded to Firebase'
            );
        } catch(err) {
            console.log("Error en el firebase storage:", err);
        }
    }
     

    return (
        <View style={styles.container}>             
            <ScrollView>
                <View style={styles.titlesWrapper}>
                    <View>
                        <Image source={image} style={styles.titlesImage} />
                    </View>
                    <View style={styles.titleWrapper}>
                        <Text style={styles.titlesTitle}>{userData.firstName} {userData.lastName}</Text>
                    </View>
                    
                </View>
                
                <View style={styles.descriptionWrapper}>
                    <Text style={styles.description}>{userData.description}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => {choosePhotoFromLibrary()}}
                    style={styles.button}
                    disabled={loading}
                >
                    {
                        <Text style={styles.buttonText}>Add Media to Firebase</Text>
                    }
                </TouchableOpacity>
                <View style={styles.coursesCardWrapper}>
                    <Text style={styles.coursesTitle}>Your courses</Text>
                    {courses.length === 0 && (
                        <Text style={styles.courseText}>Subscribe to/complete courses to see your courses here.</Text>
                    )}
                    {courses.map(item => (
                        <CourseComponent 
                        item={item}
                        navigation={props.navigation}/>
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    titlesWrapper: {
        flexDirection: "row",
        paddingVertical:25,
        paddingHorizontal: 15,
        //paddingTop: 5,
        //paddingLeft: 10,
        //justifyContent: 'center',
        //alignItems: 'center',
    },
    titlesImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    titleWrapper: {
        paddingVertical:35,
        paddingHorizontal: 10,
        flex: 1, 
        flexWrap: 'wrap',
        flexDirection: "row",
    },
    titlesTitle: {
        fontSize: 24,
        color: '#87ceeb',
        textAlign: 'justify',        
    },
    titlesRating: {
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontSize: 18,
    },
    descriptionWrapper: {
        paddingHorizontal: 15,
        // paddingVertical: 10,
        paddingBottom: 10,
    },
    description: {
        fontSize: 16,
    },
    coursesCardWrapper: {
        paddingHorizontal: 20,
      },
      coursesTitle: {
        fontSize: 20,
      },
      courseCardWrapper: {
        backgroundColor: 'white',
        borderRadius: 25,
        paddingTop: 20,
        paddingLeft: 20,
        flexDirection: 'row',
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,  
      },
      courseTitleWrapper: {
        marginLeft: 5,
        flexDirection: 'column',
      },
      courseTitlesTitle: {
        fontSize: 16,
        color: 'black'
      },
      courseTitlesRating: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      forYouTitlesDescription: {
        fontSize: 12,
        color: 'grey',
        marginTop: 7,
        paddingRight: 40,
      },
      forYouButtons: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      addCourseButton: {
        marginTop: 20,
        marginLeft: -20,
        backgroundColor: '#87ceeb',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderTopRightRadius: 25,
        borderBottomLeftRadius: 25,
      },
      favoriteCourseButton: {
        backgroundColor: '#87ceeb',
        marginTop: 20,
        marginLeft: 183,
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderTopLeftRadius: 25,
        borderBottomRightRadius: 25,
      },
      ratingWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
      },
      rating: {
        fontSize: 12,
        color: 'black',
        marginLeft: 5,
      },
      courseCardTop: {
        //marginLeft: 20,
        //paddingRight: 40,
        flexDirection: 'row',
        alignItems: 'center',
        //marginRight: 80,
      },
      courseCardImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
      },
    courseText: {
        marginTop: 15,
        fontWeight: '300',
        fontSize: 16,
        paddingBottom: 5,
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
    }
})

export default ProfileScreen;