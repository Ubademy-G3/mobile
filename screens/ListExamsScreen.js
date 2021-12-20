import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { app } from '../app/app';
import { ActivityIndicator } from 'react-native-paper';

const ListExamsScreen = (props) => {

    const param_course_id = props.route.params.course_id;
    const [loading, setLoading] = useState(false);
    const [exams, setExams] = useState([]);

    const handleResponseGetAllExams = async (response) => {
        console.log("[List Exams screen] get all exams: ", response.content())
        if (!response.hasError()) {
            setExams(response.content().exam_templates);
        } else {
            console.log("[List Edit Exams screen] error", response.content().message);
        }        
    }

    const onRefresh = async () => {
        console.log("[List Exams screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        console.log("[List Exams screen] token:", tokenLS); 
        await app.apiClient().getAllExamsByCourseId({token: tokenLS}, param_course_id, {state: 'active'}, handleResponseGetAllExams);
        setLoading(false);
    };

    useEffect(() => {
        console.log("[List Exams screen] entro a useEffect");
        onRefresh();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
                <>
                    {loading && (
                        <ActivityIndicator color="lightblue" style={{ margin: "50%" }}/>
                    )}
                    {!loading && (
                        <View style={styles.coursesCardWrapper}>
                            {exams.length === 0 && (
                                <Text style={styles.examsText}>This course doesn't have exams.</Text>
                            )}
                            {exams.map(item_exam => (
                                <View key={item_exam.id}>
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
                                </View>
                            ))}
                        </View>
                    )}
                </>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    coursesCardWrapper: {
        paddingHorizontal: 15,
    },
    fadedButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    examsText: {
        marginTop: 15,
        fontWeight: '300',
        fontSize: 16,
        paddingBottom: 5,
        marginLeft: 5,
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
    },
    buttonText: {
        color:'white',
        fontWeight: '700',
        fontSize: 16,
    },
});

export default ListExamsScreen;
