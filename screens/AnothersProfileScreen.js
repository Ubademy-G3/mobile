import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
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
    
    const [categories, setCategories] = useState([]);

    const [updating, setUpdating] = useState(false);
    
    const [userData, setData] = useState({
        firstName: "Name",
        lastName: "Last name",
        location: "",
        profilePictureUrl: "../assets/images/profilePic.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
        interests: [],
        rol: "",
    });

    const handleGetCategories = (response) => {
        console.log("[Anothers Profile Screen] categories content: ", response.content())
        if (!response.hasError()) {
            const userCategories = response.content().filter((category) => userData.interests.indexOf(category.id.toString()) !== -1);
            console.log("LISTA DE CATEGORIAS FILTRADA: " ,userCategories)
            setCategories(userCategories);
        } else {
            console.log("[Anothers Profile Screen] error", response.content().message);
        }
    }

    const handleApiResponseProfile = async (response) => {
        console.log("[Anothers Profile screen] content: ", response.content())
        if (!response.hasError()) {
            setData({
                id: response.content().id,
                firstName: response.content().firstName,
                lastName: response.content().lastName,
                location: response.content().location,
                profilePicture: response.content().profilePictureUrl,
                description: response.content().description,
                interests: response.content().interests,
                rol: response.content().rol,
            });
            // let tokenLS = await app.getToken();
            // for(let id of response.content().interests){
            //     console.log("[Anothers Profile screen] interests id:", id);
            //     await app.apiClient().getCategoryById({token: tokenLS}, id, handleResponseGetCategory);
            // }
        } else {
            console.log("[Anothers Profile screen] error", response.content().message);
        }
    }

    const onRefreshCategories = async () => {
        let tokenLS = await app.getToken();
        await app.apiClient().getAllCategories({token: tokenLS}, handleGetCategories);
    }
    
    useEffect(() => {
        if (userData.interests.length > 0) {
            console.log("[Anothers Profile screen] entro a updating categories"); 
            onRefreshCategories();            
        }
    }, [userData]);
    
    const onRefresh = async () => {
        console.log("[Anothers Profile screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        console.log("[Anothers Profile screen] token:",tokenLS);
        await app.apiClient().getProfile({id: param_id, token: tokenLS}, param_id, handleApiResponseProfile);
        setLoading(false);
    };

    useEffect(() => {
        console.log("[Anothers Profile screen] entro a useEffect"); 
        console.log("[Anothers Profile screen] param id:", param_id);
        console.log("[Anothers Profile screen] params: ", props.route.params)
        onRefresh();
    }, [param_id]);

    const renderCategoryItem = ({ item }) => {
        return (
            <View
            key={item.id}
            style={[
            styles.categoryItemWrapper,
            {
                backgroundColor: item.selected ? '#87ceeb' : 'white',
                marginLeft: item.id == 0 ? 20 : 0,
            },
            ]}>
              {/*<Image source={item.image} style={styles.categoryItemImage}/>*/ }
              <Text style={styles.categoryItemTitle}>{item.name}</Text>            
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.titlesWrapper}>
                    <View>
                        <Image source={userData.profilePicture ? { uri: userData.profilePicture } : image} style={styles.titlesImage} />
                    </View>
                    <View style={styles.titleWrapper}>
                        <Text style={styles.titlesTitle}>{userData.firstName} {userData.lastName}</Text>
                    </View>
                </View>

                <View style={styles.descriptionWrapper}>
                    <Text style={styles.description}>{userData.description}</Text>
                </View>
                {userData.rol === "student" && (
                    <>
                    <View style={styles.locationWrapper}>
                        <Text style={styles.locationTitle}>Location:</Text>
                        <Text style={styles.location}>{userData.location}</Text>
                    </View>
                    <View style={styles.categoriesWrapper}>
                        <Text style={styles.categoriesText}>{userData.firstName}'s interests:</Text>
                        <View style={styles.categoriesListWrapper}>
                            <FlatList  
                                data={categories}
                                renderItem={renderCategoryItem}
                                keyExtractor={(item) => item.id}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    </View>
                    </>
                )}
            </ScrollView>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity onPress={() => props.navigation.navigate('Direct Message', { id: userData.id, firstName: userData.firstName, lastName: userData.lastName })}> 
                    <View style={styles.favoriteWrapper}>
                        <MaterialCommunityIcons name="chat-plus-outline" size={18} color="black" />
                    </View>
                </TouchableOpacity> 
            </View>
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
    categoriesWrapper: {
        //marginTop: 10,
        paddingTop: 20,
        paddingLeft: 20,
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
    categoriesText: {
        fontSize: 20,
        //paddingHorizontal: 20,
    },
    categoriesListWrapper: {
        paddingTop: 15,
        paddingBottom: 20,
        flexDirection: "row",
    },
    categoryItemWrapper: {
        backgroundColor: '#F5CA48',
        marginRight: 10,
        borderRadius: 20,
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    categoryItemImage: {
        width: 60,
        height: 60,
        marginTop: 15,
        alignSelf: 'center',
        marginHorizontal: 20,
    },
    categoryItemTitle: {
        textAlign: 'center',
        fontSize: 14,
        marginTop: 5,
        marginBottom: 5
    },
    favoriteWrapper: {
        marginBottom: 15,
        marginLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        backgroundColor: '#87ceeb',
        borderRadius: 10,
        width: '50%',
        paddingVertical: 10,
        paddingHorizontal: 10,
        //flexDirection: 'row',
    },
    buttonWrapper: {
        alignItems: 'center',
    },
})

export default AnothersProfileScreen;