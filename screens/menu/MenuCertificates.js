import React, {useCallback, useState} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { app } from '../../app/app';
import CertificateComponent from "../../components/CertificateComponent";
import { ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const MenuCertificates = (props) => {
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState(null);
    const [certificates, setCertificates] = useState(null);

    const handleResponseCourseResponse = (response) => {
        if (!response.hasError()) {
            setCourses(response.content().courses);
        } else {
            console.log("[Menu Certificated Screen] error", response.content().message);
        }
    }

    const handleGetCertificatesResponse = (response) => {
        if (!response.hasError()) {
            setCertificates(response.content().certificates);
        } else {
            console.log("[Menu Certificated Screen] error", response.content().message);
        }
    }

    const onRefresh = async () => {
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        await app.apiClient().getAllCoursesByUser({ token: tokenLS }, idLS, { user_type: 'student', aprobal_state: true }, handleResponseCourseResponse);
        await app.apiClient().getAllCertificates({ token: tokenLS }, idLS, handleGetCertificatesResponse)
        setLoading(false);
    };
  
    useFocusEffect(
        useCallback(() => {
            onRefresh();
        }, [])
    );

    const getCourseById = (id) => {
        let course = courses.filter((c) => {
            return c.id === id;
        });
        return course[0];
    }

    return (
        <View style={styles.container}>
            {loading ? 
                <View style={{flex:1, justifyContent: 'center'}}>
                    <ActivityIndicator style={{ margin: '50%' }} color="lightblue" animating={loading} size="large" />
                </View>
            :
                <>
                <ScrollView>
                    <View style={styles.coursesCardWrapper}>
                    {!loading && (!courses || !certificates || certificates.length === 0) && (
                        <View style={{ display:'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Image source={require("../../assets/images/magnifyingGlass.png")} style={{ width: 100, height: 100, marginTop: "50%" }} />
                            <Text style={styles.examsText}>You have not completed any course yet</Text>
                        </View>
                    )}
                    {!loading && courses && certificates && certificates.map((item) => (
                        <TouchableOpacity
                            key={item.course_id}
                            onPress={() => {
                                props.navigation.navigate('My Certificate', { item: getCourseById(item.course_id), pdf: item.pdf_path });
                            }}
                        >
                            <CertificateComponent 
                                item={getCourseById(item.course_id)}
                                key={item.course_id}
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

export default MenuCertificates;