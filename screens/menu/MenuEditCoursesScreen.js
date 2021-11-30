import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import forYouData from '../../assets/data/forYouData'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { app } from '../../app/app';
import CourseComponent from "../../components/CourseComponent"

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const MenuEditCoursesScreen = (props) => {

    const [loading, setLoading] = useState(false);
    
    const [courses, setCourses] = useState([]);

    const handleResponseCourseResponse = (response) => {
        console.log("[Menu Edit Courses Screen] content: ", response.content())
        if (!response.hasError()) {
               setCourses(courses => [...courses, response.content()]);
        } else {
            console.log("[Menu Edit Courses Screen] error", response.content().message);
        }
    }

    const handleResponseGetCoursesByUser = async (response) => {
        console.log("[Menu Edit Courses screen] content: ", response.content())
        if (!response.hasError()) {
            let tokenLS = await app.getToken();
            for(let course of response.content().courses){
                await app.apiClient().getCourseById({token: tokenLS}, course.course_id, handleResponseCourseResponse)
            }
            console.log("[Menu Edit Courses screen] response: ", courses);
        } else {
            console.log("[Menu Edit Courses screen] error", response.content().message);
        }
    }

    const onRefresh = async () => {
        console.log("[Menu Edit Courses screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        console.log("[Menu Edit Courses screen] token:",tokenLS);
        await app.apiClient().getAllCoursesByUser({token: tokenLS}, idLS, undefined, handleResponseGetCoursesByUser);
        setLoading(false);
    };

    useEffect(() => {
        console.log("[Menu Edit Courses screen] entro a useEffect");
        onRefresh();
    }, []);

    return (
        <View style={styles.container}>
            {courses.length === 0 && (
                <Text style={styles.courseText}>Create new courses to edit your courses here.</Text>
            )}
            {courses.map((item) => (
                <CourseComponent 
                item={item}
                navigation={props.navigation}/>
            ))}
            {/*<TouchableOpacity
                onPress={() => {props.navigation.navigate('Create New Exam')}}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Create New Exam</Text>
            </TouchableOpacity>*/}
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
})

export default MenuEditCoursesScreen;