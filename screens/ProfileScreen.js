import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Image, TouchableOpacity } from 'react-native';
import forYouData from '../assets/data/forYouData'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import image from "../assets/images/profilePic.jpg"
import { app } from '../app/app';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const ProfileScreen = (props) => {
    const param_id = props.route.params ? props.route.params.id : 'defaultId';//'45f517a2-a988-462d-9397-d9cb3f5ce0e0';
    
    const [loading, setLoading] = useState(false);

    const [userData, setData] = useState({
        firstName: "Name",
        lastName: "Last name",
        location: "",
        profilePicture: "../assets/images/profilePic.jpg",
        //description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    });

    const handleApiResponseProfile = (response) => {
        console.log("[Profile screen] content: ", response.content())
        if (!response.hasError()) {
            setData({
                firstName: response.content().firstName,
                lastName: response.content().lastName,
                location: response.content().location,
                profilePicture: response.content().profilePicture,
                //description: response.content().description,
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

                {/*<View style={styles.descriptionWrapper}>
                    <Text style={styles.description}>{userData.description}</Text>
                </View>*/}
                <View style={styles.coursesCardWrapper}>
                    <Text style={styles.coursesTitle}>Your courses</Text>
                    {forYouData.map(item => (
                        <TouchableOpacity
                        key={item.id}
                        onPress={() =>
                            props.navigation.navigate('Course Screen', {
                            item: item,
                            })
                        }>
                        <View
                            style={[
                            styles.courseCardWrapper,
                            {
                                marginTop: item.id == 1 ? 10 : 20,
                            },
                            ]}>
                            <View>
                            <View style={styles.courseCardTop}>
                                <View>
                                <Image source={item.image} style={styles.courseCardImage} />
                                </View>
                                <View style={styles.courseTitleWrapper}>
                                <Text style={styles.courseTitlesTitle}>
                                    {item.title}
                                </Text>
                                <View style={styles.courseTitlesRating}>
                                    <MaterialCommunityIcons
                                    name="star"
                                    size={10}
                                    color={'black'}
                                    />
                                    <Text style={styles.rating}>{item.rating}</Text>
                                </View>
                                </View>
                            </View>
                            <View style={styles.courseDescriptionWrapper}>
                                <Text style={styles.courseTitleDescription}>
                                {item.description}
                                </Text>
                            </View>
                            <View style={styles.forYouButtons} >
                                <View style={styles.addCourseButton}>
                                <Feather name={item.subscribed ? "check" : "plus"} size={16} color={'black'} />
                                </View>
                                <View style={styles.favoriteCourseButton}>
                                <MaterialCommunityIcons name={item.favorited ? "heart" : "heart-outline"} size={16} color={'black'} />
                                </View>
                            </View>  
                            </View>
                        </View>
                        </TouchableOpacity>
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
})

export default ProfileScreen;