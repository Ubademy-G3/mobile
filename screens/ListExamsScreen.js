import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity } from 'react-native';
import { app } from '../app/app';

const ListExamsScreen = (props) => {
    const param_course_id = props.route.params ? props.route.params.course_id: '';

    const [loading, setLoading] = useState(false);

    const [exams, setExams] = useState([]);

    const handleResponseGetAllExams = (response) => {
        console.log("[Course screen] get exams: ", response.content())
        if (!response.hasError()) {
            setExams(response.content().exam_templates);
        } else {
            console.log("[Course screen] error", response.content().message);
        }        
    }

    const onRefresh = async () => {
        console.log("[Course screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        console.log("[Course screen] token:", tokenLS); 
        await app.apiClient().getAllExamsByCourseId({token: tokenLS}, param_course_id, handleResponseGetAllExams);
        setLoading(false);
    };

    useEffect(() => {
        console.log("[Course screen] entro a useEffect");
        onRefresh();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.coursesCardWrapper}>
                    {exams.length === 0 && (
                        <Text style={styles.examsText}>This course doesn't have exams</Text>
                    )}
                    {exams.map(item_exam => (
                        <>
                        {(item_exam.state === "active" || item_exam.state === "inactive") && (
                            <TouchableOpacity
                                onPress={() => {props.navigation.navigate('Exam Screen', {
                                    id: item_exam.id,
                                    course_id : param_course_id,
                                })}}
                                style={[styles.fadedButton]}
                            >
                            <View
                                style={styles.courseCardWrapper}
                            >
                                <Text style={styles.buttonText}>{item_exam.name}</Text>
                            </View>
                            </TouchableOpacity>
                        )}
                        </>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    coursesCardWrapper: {
        paddingHorizontal: 15,
        /* justifyContent: 'center',
        alignItems: 'center', */
    },
    fadedButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    courseText: {
        marginTop: 15,
        fontWeight: '300',
        fontSize: 16,
        paddingBottom: 5,
    },
    courseCardWrapper: {
        backgroundColor: '#87ceeb',
        width: '90%',
        borderRadius: 25,
        paddingVertical: 8,
        paddingLeft: 20,
        marginTop: 20,
        flexDirection: 'row',
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color:'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ListExamsScreen;