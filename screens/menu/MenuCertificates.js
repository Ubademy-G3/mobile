import React, {useCallback, useEffect, useState} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { app } from '../../app/app';
import CourseComponent from "../../components/CourseComponent"
import { useFocusEffect } from '@react-navigation/native';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const MenuCertificates = (props) => {
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState(null);
    const [Certificates, setCertificates] = useState(null);

    const handleResponseCourseResponse = (response) => {
        console.log("[Menu Created Courses Screen] content: ", response.content())
        if (!response.hasError()) {
            console.log("COURSES:", response.content().courses);
            setCourses(response.content().courses);
        } else {
            console.log("[Menu Created Courses Screen] error", response.content().message);
        }
    }

    /*const handleResponseGetCoursesByUser = async (response) => {
        console.log("[Menu Created Courses screen] content: ", response.content())
        if (!response.hasError()) {
            let tokenLS = await app.getToken();
            for (let course of response.content().courses) {
                await app.apiClient().getCourseById({token: tokenLS}, course.course_id, handleResponseCourseResponse);
            }
            console.log("[Menu Created Courses screen] response: ", courses);
        } else {
            console.log("[Menu Created Courses screen] error", response.content().message);
        }
    }*/

    const onRefresh = async () => {
        console.log("[Menu Certificates screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        console.log("[Menu Certificates screen] token:",tokenLS);
        await app.apiClient().getAllCoursesByUser({ token: tokenLS }, idLS, {}, handleResponseCourseResponse);
        setLoading(false);
    };
  
    useFocusEffect(
        useCallback(() => {
            onRefresh();
        }, [])
    );

    return (
        <View style={styles.container}>
            {loading ? 
                <View style={{flex:1, justifyContent: 'center'}}>
                    <ActivityIndicator color="#696969" animating={loading} size="large" /> 
                </View>
            :
                <>
                <ScrollView>
                    <View style={styles.coursesCardWrapper}>
                    {!loading && courses && (
                        <Text style={styles.courseText}>Create new courses to list your courses here.</Text>
                    )}
                    {!loading && courses && courses.map((item) => (
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
                </ScrollView>
                </>
            }
        </View>
    );
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

export default MenuCertificates;