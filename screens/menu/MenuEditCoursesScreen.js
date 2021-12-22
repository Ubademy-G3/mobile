import React, {useCallback, useEffect, useState} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import forYouData from '../../assets/data/forYouData'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { app } from '../../app/app';
import CourseComponent from "../../components/CourseComponent"
import { useFocusEffect } from '@react-navigation/native';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const MenuEditCoursesScreen = (props) => {

    const [loading, setLoading] = useState(false);
    
    const [courses, setCourses] = useState([]);

    const handleResponseGetCoursesByUser = async (response) => {
        console.log("[Menu Edit Courses screen] content: ", response.content())
        if (!response.hasError()) {
            setCourses(response.content().courses)
        } else {
            console.log("[Menu Edit Courses screen] error", response.content().message);
        }
    }

    const onRefresh = async () => {
        console.log("[Menu Edit Courses screen] entro a onRefresh"); 
        setLoading(true);
        const tokenLS = await app.getToken();
        const idLS = await app.getId();
        console.log("[Menu Edit Courses screen] token:",tokenLS);
        await app.apiClient().getAllCoursesByUser({token: tokenLS}, idLS, {user_type: 'instructor'}, handleResponseGetCoursesByUser);
        setLoading(false);
    };

    /* useEffect(() => {
        setCourses([]);
        console.log("[Menu Edit Courses screen] entro a useEffect");
        onRefresh();
    }, [props.navigate]); */

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
                    <ActivityIndicator color="#696969" animating={loading} size="large" /> 
                </View>
            :
            <>
                <ScrollView>
                    {courses.length === 0 && (
                        <Text style={styles.courseText}>Create new courses to edit your courses here.</Text>
                    )}
                    {courses.map((item) => (
                        <View style={styles.coursesCardWrapper} key={item.id}>
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => {
                                props.navigation.navigate('Edit Course', {item: item});
                                }}
                            >
                                <CourseComponent 
                                item={item}
                                key={item.id}
                                />
                            </TouchableOpacity>
                        </View>
                    ))}
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

export default MenuEditCoursesScreen;