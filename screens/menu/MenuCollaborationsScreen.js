import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CourseComponent from '../../components/CourseComponent';
import { app } from '../../app/app';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const MenuCollaborationsScreen = (props) => {
    const [loading, setLoading] = useState(false);
    
    const [courses, setCourses] = useState([]);

    const [rating, setRating] = useState(0);

    const handleResponseCourseResponse = (response) => {
        console.log("[Menu Subscribed Courses Screen] content: ", response.content())
        if (!response.hasError()) {
               setCourses(courses => [...courses, response.content()]);
        } else {
            console.log("[Menu Subscribed Courses Screen] error", response.content().message);
        }
    }
    
    const handleResponseGetCourseRating = (response) => {
        console.log("[Course component] get rating: ", response.content())
        if (!response.hasError()) {
            setRating(response.content().rating);
        } else {
            console.log("[Course component] error", response.content().message);
        }        
    }

    const handleResponseGetCoursesByUser = async (response) => {
        console.log("[Menu Subscribed Courses screen] content: ", response.content())
        if (!response.hasError()) {
            let tokenLS = await app.getToken();
            for(let course of response.content().courses){
                await app.apiClient().getCourseById({token: tokenLS}, course.course_id, handleResponseCourseResponse);
                await app.apiClient().getCourseRating({token: tokenLS}, course.course_id, handleResponseGetCourseRating);
            }
            console.log("[Menu Subscribed Courses screen] response: ", courses);
        } else {
            console.log("[Menu Subscribed Courses screen] error", response.content().message);
        }
    }

    const onRefresh = async () => {
        console.log("[Menu Subscribed Courses screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        console.log("[Menu Subscribed Courses screen] token:",tokenLS);
        await app.apiClient().getAllCoursesByUser({token: tokenLS}, idLS, undefined, "collaborator", handleResponseGetCoursesByUser);
        setLoading(false);
    }

    useEffect(() => {
        setCourses([]);
        console.log("[Menu Subscribed Courses screen] entro a useEffect");
        onRefresh();
    }, [props]);

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.coursesCardWrapper}>
                    {courses.length === 0 && (
                        <Text style={styles.courseText}>Be a collaborator to see your courses here.</Text>
                    )}
                    {courses.map((item) => (
                        <>
                        <TouchableOpacity
                        key={item.id}
                        onPress={() =>
                            props.navigation.navigate('Edit Course', {
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
                                        <Image source={{uri: item.profile_picture}} style={styles.courseCardImage} />
                                    </View>
                                    <View style={styles.courseTitleWrapper}>
                                        <Text style={styles.courseTitlesTitle}>
                                            {item.name}
                                        </Text>
                                        <View style={styles.courseTitlesRating}>
                                            <MaterialCommunityIcons
                                            name="star"
                                            size={20}
                                            color={'black'}
                                            />
                                            <Text style={styles.rating}>{rating}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.courseDescriptionWrapper}>
                                    <Text style={styles.courseTitleDescription}>
                                    {item.description}
                                    </Text>
                                </View> 
                            </View>
                        </View>
                        </TouchableOpacity>
                        </>
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
    courseText: {
        marginTop: 15,
        fontWeight: '300',
        fontSize: 16,
        paddingBottom: 5,
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
    coursesCardWrapper: {
        paddingHorizontal: 20,
    },
    courseCardWrapper: {
        backgroundColor: 'white',
        borderRadius: 25,
        paddingTop: 15,
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
        marginBottom: 20,
    },
    courseTitlesTitle: {
        fontSize: 16,
        color: 'black'
    },
    courseTitlesRating: {
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
    rating: {
        fontSize: 16,
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
        borderRadius: 15,
        resizeMode: 'contain',
    },
    courseDescriptionWrapper : {
        paddingTop: 5,
        marginBottom: 10,
        marginRight: 5,
    },
})

export default MenuCollaborationsScreen;