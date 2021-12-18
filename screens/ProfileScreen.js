import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, FlatList, ActivityIndicator } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { app } from '../app/app';
import CourseComponent from '../components/CourseComponent';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const ProfileScreen = (props) => {
    const param_id = props.route.params ? props.route.params.id : 'defaultId';//'45f517a2-a988-462d-9397-d9cb3f5ce0e0';

    console.log("PROFILE ID: ",param_id);
    
    const [loading, setLoading] = useState(false);
    
    const [courses, setCourses] = useState([]);  
    
    const [userData, setData] = useState(null);

    const [categories, setCategories] = useState([]);

    const [favCourses, setFavCourses] = useState([]);

    const handleCourseResponse = (response) => {
        console.log("[Profile Screen] content: ", response.content())
        if (!response.hasError()) {
               setCourses(courses => [...courses, response.content()]);
        } else {
            console.log("[Profile Screen] error", response.content().message);
        }
    }

    const handleFavoriteCourseResponse = (response) => {
        console.log("[Profile Screen] content: ", response.content())
        if (!response.hasError()) {
            console.log(response.content())
            setFavCourses(courses => [...courses, response.content()]);
        } else {
            console.log("[Profile Screen] error", response.content().message);
        }
    }
    
    const handleResponseGetCategory = (response) => {
        console.log("[Profile Screen] categories content: ", response.content())
        if (!response.hasError()) {
            setCategories(categories => [...categories, response.content()]);
        } else {
            console.log("[Profile Screen] error", response.content().message);
        }
    }

    const handleGetCoursesByUser = async (response) => {
        //console.log("[Profile screen] content: ", response.content())
        if (!response.hasError()) {
            let tokenLS = await app.getToken();
            for(let course of response.content().courses){
                await app.apiClient().getCourseById({token: tokenLS}, course.course_id, handleCourseResponse)
            }
            //console.log("[Profile screen] response: ", courses);
        } else {
            console.log("[Profile screen] error", response.content().message);
        }
    }

    const handleApiResponseProfile = async (response) => {
        //console.log("[Profile screen] content: ", response.content())
        if (!response.hasError()) {            
            setData({
                firstName: response.content().firstName,
                lastName: response.content().lastName,
                location: response.content().location,
                profilePictureUrl: response.content().profilePictureUrl,
                description: response.content().description,
                interests: response.content().interests,
                favoriteCourses: response.content().favoriteCourses,
                rol: response.content().rol,
            });
            let tokenLS = await app.getToken();
            for (let id of response.content().interests) {
                console.log("[Profile screen] interests id:", id);
                await app.apiClient().getCategoryById({token: tokenLS}, id, handleResponseGetCategory);
            }
            await Promise.all(
                response.content().favoriteCourses.map(async (courseId) => {
                    return await app.apiClient().getCourseById({ token: tokenLS }, courseId, handleFavoriteCourseResponse);
                })
            )
        } else {
            console.log("[Profile screen] error", response.content().message);
        }
    }
    
    const onRefresh = async () => {
        console.log("[Profile screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        await app.apiClient().getProfile({ id: param_id, token: tokenLS }, param_id, handleApiResponseProfile);
        await app.apiClient().getAllCoursesByUser({ token: tokenLS }, param_id, undefined, undefined, handleGetCoursesByUser);
        setLoading(false);
    };

    useEffect(() => {
        setCourses([]);
        setFavCourses([]);
        setCategories([]);
        onRefresh();
    }, [param_id, props]);

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
              <Text style={styles.categoryItemTitle}>{item.name}</Text>            
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {
                loading ? 
                <View style={{flex:1, justifyContent: 'center'}}>
                    <ActivityIndicator color="#696969" animating={loading} size="large" /> 
                </View>
                :
                <>
                {userData && (
                    <ScrollView>
                        <View style={styles.titlesWrapper}>
                            <View>
                                <Image source={{uri: userData.profilePictureUrl}} style={styles.titlesImage} />
                            </View>
                            <View>
                                <View style={styles.titleWrapper}>
                                    <Text style={styles.titlesTitle}>{userData.firstName} {userData.lastName}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.descriptionWrapper}>
                            <Text style={styles.locationTitle}>{userData.rol.charAt(0).toUpperCase()+userData.rol.slice(1)}</Text>
                            <Text style={styles.description}>{userData.description}</Text>
                        </View>
                        {userData.rol === "student" && (
                            <>
                            <View style={styles.locationWrapper}>
                                <Text style={styles.locationTitle}>Location:</Text>
                                <Text style={styles.location}>{userData.location}</Text>
                            </View>
                            <View style={styles.categoriesWrapper}>
                                <Text style={styles.coursesTitle}>Your interests</Text>
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
                        {userData.rol === "student" && (
                            <View style={styles.coursesCardWrapper}>
                                <Text style={styles.coursesTitle}>Favorite courses</Text>
                                {favCourses.map(item => (
                                    <CourseComponent 
                                    item={item}
                                    navigation={props.navigation}/>
                                ))}
                            </View>
                        )}
                    </ScrollView>
                )}
                </>
            }
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
        paddingTop:35,
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
        paddingHorizontal: 15,
    },
    coursesTitle: {
        fontSize: 20,
        marginTop: 10,
        fontWeight: "bold",
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
    },
    categoriesWrapper: {
        //marginTop: 10,
        paddingTop: 10,
        //paddingLeft: 20,
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
    categoriesText: {
        fontSize: 20,
        //paddingHorizontal: 20,
    },
    categoriesListWrapper: {
        paddingTop: 15,
        paddingBottom: 5,
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
    locationWrapper:{
        paddingHorizontal: 15,
        flexDirection: "row",
        // paddingVertical: 10,
        paddingBottom: 10,
        //marginTop: 5,
    },
    location: {
        fontSize: 16,
    },
    locationTitle: {
        fontWeight: '500',
        fontSize: 16,
        marginRight: 5,
    },
    rolTitle: {
        fontWeight: '400',
        fontSize: 16,
        marginRight: 5,
    },
})

export default ProfileScreen;