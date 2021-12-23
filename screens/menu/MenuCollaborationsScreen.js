import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CourseComponent from '../../components/CourseComponent';
import { app } from '../../app/app';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const MenuCollaborationsScreen = (props) => {
    const [loading, setLoading] = useState(false);
    
    const [courses, setCourses] = useState([]);

    const handleResponseGetCoursesByUser = async (response) => {
        if (!response.hasError()) {
            setCourses(response.content().courses);
        } else {
            console.log("[Menu Collaborations Courses screen] error", response.content().message);
        }
    }

    const onRefresh = async () => { 
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        await app.apiClient().getAllCoursesByUser({token: tokenLS}, idLS, { user_type: 'collaborator' }, handleResponseGetCoursesByUser);
        setLoading(false);
    }
    
    useFocusEffect(
        useCallback(() => {
            setCourses([]);
            onRefresh();
        }, [])
    );

    return (
        <View style={styles.container}>
            {
                loading ? 
                <View style={{flex:1, justifyContent: 'center'}}>
                    <ActivityIndicator style={{ margin: '50%' }} color="lightblue" animating={loading} size="large" />
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
        flexDirection: 'row',
        alignItems: 'center',
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
        flexDirection: 'row',
        alignItems: 'center',
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