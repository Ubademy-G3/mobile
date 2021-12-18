import React, {useCallback, useEffect, useState} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import forYouData from '../../assets/data/forYouData'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { app } from '../../app/app';
import CourseComponent from "../../components/CourseComponent"
import { useFocusEffect } from '@react-navigation/native';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const MenuCreatedCoursesScreen = (props) => {
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);

    const handleResponseCourseResponse = (response) => {
        console.log("[Menu Created Courses Screen] content: ", response.content())
        if (!response.hasError()) {
               setCourses(courses => [...courses, response.content()]);
        } else {
            console.log("[Menu Created Courses Screen] error", response.content().message);
        }
    }

    const handleResponseGetCoursesByUser = async (response) => {
        console.log("[Menu Created Courses screen] content: ", response.content())
        if (!response.hasError()) {
            let tokenLS = await app.getToken();
            for(let course of response.content().courses){
                await app.apiClient().getCourseById({token: tokenLS}, course.course_id, handleResponseCourseResponse);
            }
            console.log("[Menu Created Courses screen] response: ", courses);
        } else {
            console.log("[Menu Created Courses screen] error", response.content().message);
        }
    }

    const onRefresh = async () => {
        console.log("[Menu Created Courses screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        console.log("[Menu Created Courses screen] token:",tokenLS);
        await app.apiClient().getAllCoursesByUser({token: tokenLS}, idLS, undefined, undefined, handleResponseGetCoursesByUser);
        setLoading(false);
    };
  
    useFocusEffect(
        useCallback(() => {
            setCourses([]);
            onRefresh();
            //return () => unsubscribe();
        }, [])
    );

    return (
        <View style={styles.container}>
            <ScrollView>
                {courses.length === 0 && (
                    <Text style={styles.courseText}>Create new courses to list your courses here.</Text>
                )}
                {courses.map((item) => (
                    <View style={styles.coursesCardWrapper}>
                        {console.log(item.id)}
                    <TouchableOpacity
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
                                        <Image source={{uri: item.profile_picture}} style={styles.courseCardImage} />
                                    </View>
                                    <View style={styles.courseTitleWrapper}>
                                        <Text style={styles.courseTitlesTitle}>
                                            {item.name}
                                        </Text>
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
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
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
    courseText: {
        marginTop: 15,
        marginLeft: 10,
        fontWeight: '300',
        fontSize: 16,
        paddingBottom: 5,
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

export default MenuCreatedCoursesScreen;