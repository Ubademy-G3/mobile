import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Image, TouchableOpacity } from 'react-native';
import forYouData from '../assets/data/forYouData'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import image from "../assets/images/profilePic.jpg"
import { app } from '../app/app';
import CourseComponent from '../components/CourseComponent';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const AnothersProfileScreen = (props) => {
    const param_id = props.route.params ? props.route.params.id : 'defaultId';//'45f517a2-a988-462d-9397-d9cb3f5ce0e0';
    
    const [loading, setLoading] = useState(false);
    
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
        //await app.apiClient().getAllCoursesByUser({token: tokenLS}, param_id, undefined, handleGetCoursesByUser);
        setLoading(false);
    };

    useEffect(() => {
        console.log("[Profile screen] entro a useEffect"); 
        console.log("[Profile screen] param id:", param_id);
        console.log("[Profile screen] params: ", props.route.params)
        onRefresh();
    }, [param_id]);

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
                <View style={styles.locationWrapper}>
                    <Text style={styles.locationTitle}>Location:</Text>
                    <Text style={styles.location}>{userData.location}</Text>
                </View>
                <View style={styles.interestsWrapper}>
                    <Text style={styles.interestsTitle}>Interests:</Text>
                    {/* ADD INTERESTS!! Horizontal flat list?*/}
                </View>
                {/* ADD CHAT BUTTON!!*/}
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
    descriptionWrapper: {
        paddingHorizontal: 15,
        // paddingVertical: 10,
        paddingBottom: 10,
    },
    description: {
        fontSize: 16,
    },
    locationWrapper:{
        paddingHorizontal: 15,
        flexDirection: "row",
        // paddingVertical: 10,
        paddingBottom: 10,
        marginTop: 5,
    },
    location: {
        fontSize: 16,
    },
    locationTitle: {
        fontWeight: '500',
        fontSize: 16,
        marginRight: 5,
    },
    interestsWrapper:{
        paddingHorizontal: 15,
        // paddingVertical: 10,
        paddingBottom: 10,
        marginTop: 5,
    },
    interestsTitle: {
        fontWeight: '500',
        fontSize: 16,
        marginRight: 5,
    },
})

export default AnothersProfileScreen;