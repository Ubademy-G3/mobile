import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CourseComponent from '../../components/CourseComponent';
import { app } from '../../app/app';
import { useFocusEffect } from '@react-navigation/native';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const MenuCollaborationsScreen = (props) => {
    const [loading, setLoading] = useState(false);
    
    const [courses, setCourses] = useState([]);

    const [rating, setRating] = useState(0);

    const handleResponseCourseResponse = (response) => {
        console.log("[Menu Collaborations Courses Screen] content: ", response.content())
        if (!response.hasError()) {
               setCourses(courses => [...courses, response.content()]);
        } else {
            console.log("[Menu Collaborations Courses Screen] error", response.content().message);
        }
    }    

    const handleResponseGetCoursesByUser = async (response) => {
        console.log("[Menu Collaborations Courses screen] content: ", response.content())
        if (!response.hasError()) {
            let tokenLS = await app.getToken();
            for(let course of response.content().courses){
                await app.apiClient().getCourseById({token: tokenLS}, course.id, handleResponseCourseResponse);
                
            }
            console.log("[Menu Collaborations Courses screen] response: ", courses);
        } else {
            console.log("[Menu Collaborations Courses screen] error", response.content().message);
        }
    }

    const onRefresh = async () => {
        console.log("[Menu Collaborations Courses screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        console.log("[Menu Collaborations Courses screen] token:",tokenLS);
        await app.apiClient().getAllCoursesByUser({token: tokenLS}, idLS, { user_type: 'collaborator' }, handleResponseGetCoursesByUser);
        setLoading(false);
    }

    /* useEffect(() => {
        setCourses([]);
        console.log("[Menu Collaborations Courses screen] entro a useEffect");
        onRefresh();
    }, [props]); */
    
    useFocusEffect(
        useCallback(() => {
            setCourses([]);
            console.log("[Menu Collaborations screen] entro a useEffect");
            onRefresh();
        }, [])
    );

    return (
        <View style={styles.container}>
            {
                loading ? 
                    <View style={{flex:1, justifyContent: 'center'}}>
                        <ActivityIndicator color="#696969" animating={loading} size="large" /> 
                    </View>
                :
                    <>
                    <ScrollView>
                        <View style={styles.coursesCardWrapper}>
                            {courses.length === 0 && (
                                <Text style={styles.courseText}>Be a collaborator to see your courses here.</Text>
                            )}
                            {courses.map((item) => (
                                <>
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
                                </>
                            ))}
                        </View>
                    </ScrollView>
                </>
            }
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
        paddingHorizontal: 15,
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