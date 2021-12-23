import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, FlatList, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActivityIndicator } from 'react-native-paper';
import { app } from '../app/app';
import CourseComponent from '../components/CourseComponent';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const ProfileScreen = (props) => {
    const mounted = useRef(false);
    const param_id = props.route.params ? props.route.params.id : 'defaultId';//'45f517a2-a988-462d-9397-d9cb3f5ce0e0';

    console.log("PROFILE ID: ",param_id);
    
    const [loading, setLoading] = useState(false);
    
    const [courses, setCourses] = useState([]);  
    
    const [userData, setData] = useState({
        firstName: "",
        lastName: "",
        location: "",
        profilePictureUrl: "../assets/images/profilePic.jpg",
        description: "",
        interests: [],
        rol: "",
    });

    const [categories, setCategories] = useState([]);

    const [favCourses, setFavCourses] = useState([]);

    const handleGetFavoriteCourses = (response) => {
        console.log("[Menu Favorite Courses Screen] content: ", response.content())
        if (!response.hasError()) {
            setFavCourses(response.content().courses);
        } else {
            console.log("[Menu Favorite Courses Screen] error", response.content().message);
        }
    }
    
    const handleGetCategories = (response) => {
        console.log("[Profile Screen] categories content: ", response.content())
        if (!response.hasError()) {
            const userCategories = response.content().filter((category) => userData.interests.indexOf(category.id.toString()) !== -1);
            setCategories(userCategories);
        } else {
            console.log("[Profile Screen] error", response.content().message);
        }
    }

    const handleGetCoursesFromList = (response) => {
        console.log("[Profile Screen] get courses from list: ", response.content())
        if (!response.hasError()) {
            setCourses(response.content().courses);
        } else {
            console.log("[Profile Screen] error", response.content().message);
        }
    }

    const handleGetCoursesByUser = async (response) => {
        console.log("[Profile screen] content: ", response.content())
        if (!response.hasError()) {
            let tokenLS = await app.getToken();
            const courses_list = [];
            for (let course of response.content().courses) {
                courses_list.push(course.id);
            }
            await app.apiClient().getAllCoursesFromList({token: tokenLS}, courses_list, handleGetCoursesFromList)
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
        } else {
            console.log("[Profile screen] error", response.content().message);
        }
    }

    const onRefreshCategories = async () => {
        let tokenLS = await app.getToken();
        await app.apiClient().getAllCategories({token: tokenLS}, handleGetCategories);
    }

    const auxGetCourses = async () => {
        let tokenLS = await app.getToken();
        await app.apiClient().getAllCoursesByUser({ token: tokenLS }, param_id, { user_type: userData.rol }, handleGetCoursesByUser);
    }

    useEffect(() => {
        if (userData.interests.length > 0) {
            console.log("[Anothers Profile screen] entro a updating categories"); 
            onRefreshCategories();            
        }
        if(userData.rol !== ""){
            auxGetCourses();
        }
        setLoading(false);
    }, [userData]);
    
    const onRefresh = async () => {
        console.log("[Profile screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        await app.apiClient().getProfile({ id: param_id, token: tokenLS }, param_id, handleApiResponseProfile);
        await app.apiClient().getFavoriteCoursesByUser({token: tokenLS}, idLS, handleGetFavoriteCourses);
    };

    useEffect(() => {
        mounted.current = true;
        setCourses([]);
        setFavCourses([]);
        setCategories([]);
        onRefresh();
        return() => {
            mounted.current = false;
        }
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
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={{uri: item.photo_url}} style={styles.interestsImage} />
                </View>
              <Text style={styles.categoryItemTitle}>{item.name}</Text>            
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {
                loading ? 
                <View style={{flex:1, justifyContent: 'center'}}>
                    <ActivityIndicator style={{ margin: '50%' }} color="lightblue" /> 
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
                            {userData.description != "" &&(
                                <Text style={styles.description}>{userData.description}</Text>
                            )}
                        </View>
                        {userData.rol === "student" && (
                            <>
                            {userData.location != "" && (
                            <View style={styles.locationWrapper}>
                                <Text style={styles.locationTitle}>Location:</Text>
                                <Text style={styles.location}>{userData.location}</Text>
                            </View>
                            )}
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
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => {
                                    props.navigation.navigate('Course Screen', {item: item});
                                    }}
                                >
                                    <CourseComponent 
                                    item={item}
                                    key={item.id}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                        {userData.rol === "student" && (
                            <View style={styles.coursesCardWrapper}>
                                <Text style={styles.coursesTitle}>Favorite courses</Text>
                                {favCourses.map(item => (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => {
                                        props.navigation.navigate('Course Screen', {item: item});
                                        }}
                                    >
                                        <CourseComponent 
                                        item={item}
                                        key={item.id}
                                        />
                                    </TouchableOpacity>
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
    interestsImage: {
        width: 80,
        height: 80,
    },
    titleWrapper: {
        paddingTop:35,
        paddingHorizontal: 10,
        //flex: 1, 
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    titlesTitle: {
        fontSize: 24,
        color: '#87ceeb',
        textAlign: 'justify',
        width: "85%", 
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
        paddingHorizontal: 10,
        paddingVertical: 10,
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