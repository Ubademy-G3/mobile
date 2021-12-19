import React, {useState, useEffect, useCallback} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import forYouData from '../../assets/data/forYouData';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CourseComponent from '../../components/CourseComponent';
import { app } from '../../app/app';
import { useFocusEffect } from '@react-navigation/native';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const MenuFavoriteCoursesScreen = (props) => {

    const [courses, setCourses] = useState([]);
    
    const [loading, setLoading] = useState(false);

    const handleResponseCourseResponse = (response) => {
        console.log("[Menu Subscribed Courses Screen] content: ", response.content())
        if (!response.hasError()) {
               setCourses(courses => [...courses, response.content()]);
        } else {
            console.log("[Menu Subscribed Courses Screen] error", response.content().message);
        }
    }

    const handleApiResponseGetProfile = async (response) => {
        console.log("[Menu Subscribed Courses screen] content: ", response.content())
        if (!response.hasError()) {
            let tokenLS = await app.getToken();
            for(let id of response.content().favoriteCourses){
                await app.apiClient().getCourseById({token: tokenLS}, id, handleResponseCourseResponse)
            }
            console.log("[Profile screen] error", response.content().message);
        }
    }

    const onRefresh = async () => {
        console.log("[Menu Favorite Courses screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        console.log("[Menu Favorite Courses screen] token:",tokenLS);
        await app.apiClient().getProfile({token: tokenLS}, idLS, handleApiResponseGetProfile);
        console.log("[Menu Favorite Courses screen] id:", idLS);
        setLoading(false);
    };

    /* useEffect(() => {
        setCourses([]);
        console.log("[Menu Favorite Courses screen] entro a useEffect");
        onRefresh();
    }, [props]); */

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
                    <View style={styles.coursesCardWrapper}>
                        {courses.length === 0 && (
                            <Text style={styles.courseText}>Favorite courses to see your courses here.</Text>
                        )}
                        {courses.map((item) => (
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
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    coursesCardWrapper: {
        paddingHorizontal: 15,
    },
    courseText: {
        marginTop: 15,
        fontWeight: '300',
        fontSize: 16,
        paddingBottom: 5,
    },
})

export default MenuFavoriteCoursesScreen;