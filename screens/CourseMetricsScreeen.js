import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import forYouData from '../assets/data/forYouData'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import image from "../assets/images/profilePic.jpg"
import { app } from '../app/app';
import CourseComponent from '../components/CourseComponent';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const CourseMetricsScreen = (props) => {
    const param_id = props.route.params ? props.route.params.id : 'defaultId';
    
    const [loading, setLoading] = useState(false);
    
    const [metrics, setMetrics] = useState({});

    const handleApiResponseGetMetrics = (response) => {
        console.log("[Anothers Profile Screen] categories content: ", response.content())
        if (!response.hasError()) {
            setMetrics(response.content().metrics);
        } else {
            console.log("[Anothers Profile Screen] error", response.content().message);
        }
    }
    
    const onRefresh = async () => {
        console.log("[Anothers Profile screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        await app.apiClient().getCourseMetrics({token: tokenLS}, param_id, handleApiResponseGetMetrics);
        setLoading(false);
    };

    useEffect(() => {
        console.log("[Anothers Profile screen] entro a useEffect"); 
        console.log("[Anothers Profile screen] param id:", param_id);
        console.log("[Anothers Profile screen] params: ", props.route.params)
        onRefresh();
    }, [props]);

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.locationWrapper}>
                    <Text style={styles.locationTitle}>Total users:</Text>
                    <Text style={styles.location}>{metrics.total_users}</Text>
                </View>
                <View style={styles.locationWrapper}>
                    <Text style={styles.locationTitle}>Users approved:</Text>
                    <Text style={styles.location}>{metrics.users_approved}</Text>
                </View>
                <View style={styles.locationWrapper}>
                    <Text style={styles.locationTitle}>Users currently studing:</Text>
                    <Text style={styles.location}>{metrics.users_currently_studying}</Text>
                </View>
                <View style={styles.locationWrapper}>
                    <Text style={styles.locationTitle}>Exams taken:</Text>
                    <Text style={styles.location}>{metrics.exams_amount}</Text>
                </View>
                <View style={styles.locationWrapper}>
                    <Text style={styles.locationTitle}>Exams average score:</Text>
                    <Text style={styles.location}>{metrics.average_score}</Text>
                </View>
                <View style={styles.locationWrapper}>
                    <Text style={styles.locationTitle}>Approval rate:</Text>
                    <Text style={styles.location}>{metrics.approval_rate}</Text>
                </View>
                <View style={styles.locationWrapper}>
                    <Text style={styles.locationTitle}>Graded exams:</Text>
                    <Text style={styles.location}>{metrics.graded_exams}</Text>
                </View>
                <View style={styles.locationWrapper}>
                    <Text style={styles.locationTitle}>Passed exams:</Text>
                    <Text style={styles.location}>{metrics.passed_exams}</Text>
                </View>
            </ScrollView>
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
    titleWrapper: {
        paddingVertical:35,
        paddingHorizontal: 10,
        flex: 1, 
        flexWrap: 'wrap',
        flexDirection: "row",
    },
    titlesTitle: {
        fontSize: 24,
        color: '#87ceeb',
        textAlign: 'justify',        
    },
    descriptionWrapper: {
        paddingHorizontal: 15,
        // paddingVertical: 10,
        paddingBottom: 10,
    },
    description: {
        fontSize: 16,
    },
    locationWrapper:{
        paddingHorizontal: 15,
        flexDirection: "row",
        // paddingVertical: 10,
        paddingBottom: 10,
        marginTop: 5,
    },
    location: {
        fontSize: 16,
    },
    locationTitle: {
        fontWeight: '500',
        fontSize: 16,
        marginRight: 5,
    },
    interestsWrapper:{
        paddingHorizontal: 15,
        // paddingVertical: 10,
        paddingBottom: 10,
        marginTop: 5,
    },
    interestsTitle: {
        fontWeight: '500',
        fontSize: 16,
        marginRight: 5,
    },
    categoriesWrapper: {
        //marginTop: 10,
        paddingTop: 20,
        paddingLeft: 20,
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
    categoriesText: {
        fontSize: 20,
        //paddingHorizontal: 20,
    },
    categoriesListWrapper: {
        paddingTop: 15,
        paddingBottom: 20,
        flexDirection: "row",
    },
    categoryItemWrapper: {
        backgroundColor: '#F5CA48',
        marginRight: 10,
        borderRadius: 20,
        shadowColor: 'black',
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
    favoriteWrapper: {
        marginBottom: 15,
        marginLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        backgroundColor: '#87ceeb',
        borderRadius: 10,
        width: '50%',
        paddingVertical: 10,
        paddingHorizontal: 10,
        //flexDirection: 'row',
    },
    buttonWrapper: {
        alignItems: 'center',
    },
})

export default CourseMetricsScreen;