import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { app } from '../app/app';
import { ActivityIndicator } from 'react-native-paper';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const CourseMetricsScreen = (props) => {
    const param_id = props.route.params ? props.route.params.id : 'defaultId';
    const [loading, setLoading] = useState(false);
    const [metrics, setMetrics] = useState({});

    const handleApiResponseGetMetrics = (response) => {
        console.log("[Anothers Profile Screen] categories content: ", response.content())
        if (!response.hasError()) {
            setMetrics(response.content().metrics.metrics);
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
            {loading && (
                <View style={{flex:1, justifyContent: 'center'}}>
                    <ActivityIndicator style={{ margin: '50%' }} color="lightblue" animating={loading} size="large" />
                </View>
            )}
            {!loading && (
                <ScrollView>
                    <View style={styles.locationWrapper}>
                        <MaterialCommunityIcons
                            name="account-group" 
                            size={40} 
                            color="black"
                        />
                        <Text style={styles.locationTitle}>Total users:</Text>
                        <Text style={styles.location}>{metrics.total_users}</Text>
                    </View>
                    <View style={styles.locationWrapper}>
                        <MaterialCommunityIcons
                            name="check-decagram" 
                            size={40} 
                            color="black"
                        />
                        <Text style={styles.locationTitle}>Users approved:</Text>
                        <Text style={styles.location}>{metrics.users_approved}</Text>
                    </View>
                    <View style={styles.locationWrapper}>
                        <MaterialCommunityIcons
                            name="book-open" 
                            size={40} 
                            color="black"
                        />
                        <Text style={styles.locationTitle}>Users currently studing:</Text>
                        <Text style={styles.location}>{metrics.users_currently_studying}</Text>
                    </View>
                    <View style={styles.locationWrapper}>
                        <MaterialCommunityIcons
                            name="text-box-multiple" 
                            size={40} 
                            color="black"
                        />
                        <Text style={styles.locationTitle}>Exams taken:</Text>
                        <Text style={styles.location}>{metrics.exams_amount}</Text>
                    </View>
                    <View style={styles.locationWrapper}>
                        <MaterialCommunityIcons
                            name="chart-line" 
                            size={40} 
                            color="black"
                        />
                        <Text style={styles.locationTitle}>Exams average score:</Text>
                        <Text style={styles.location}>{metrics.average_score}</Text>
                    </View>
                    <View style={styles.locationWrapper}>
                        <MaterialCommunityIcons
                            name="text-box-check" 
                            size={40} 
                            color="black"
                        />
                        <Text style={styles.locationTitle}>Approval rate:</Text>
                        <Text style={styles.location}>{metrics.approval_rate}</Text>
                    </View>
                    <View style={styles.locationWrapper}>
                        <MaterialCommunityIcons
                            name="text-box-search" 
                            size={40} 
                            color="black"
                        />
                        <Text style={styles.locationTitle}>Graded exams:</Text>
                        <Text style={styles.location}>{metrics.graded_exams}</Text>
                    </View>
                    <View style={styles.locationWrapper}>
                        <MaterialCommunityIcons
                            name="file-check" 
                            size={40} 
                            color="black"
                        />
                        <Text style={styles.locationTitle}>Passed exams:</Text>
                        <Text style={styles.location}>{metrics.passed_exams}</Text>
                    </View>
                </ScrollView>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop: 15,
        alignItems: "center",
        justifyContent: "center"
    },
    locationWrapper:{
        paddingHorizontal: 15,
        flexDirection: "row",
        // paddingVertical: 10,
        paddingBottom: 10,
        marginTop: 5,
    },
    location: {
        marginTop: 8,
        marginLeft: 2,
        fontSize: 24,
        fontWeight: '500',
    },
    locationTitle: {
        marginTop: 7,
        marginLeft: 5,
        fontWeight: '500',
        fontSize: 24,
        marginRight: 5,
        //color: '#87ceeb',
    },
})

export default CourseMetricsScreen;