import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { app } from '../app/app';

const EditExamScreen = (props) => {

    const param_course_id = props.route.params ? props.route.params.id : 'defaultID';

    const [loading, setLoading] = useState(false);

    const [exams, setExams] = useState([]);

    const handleResponseGetAllExams = (response) => {
        console.log("[Edit Exam screen] get exams: ", response.content())
        if (!response.hasError()) {
            setExams(response.content().exam_templates);
        } else {
            console.log("[Edit Exam screen] error", response.content().message);
        }        
    }

    const onRefresh = async () => {
        console.log("[Edit Exam screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        console.log("[Edit Exam screen] token:", tokenLS); 
        await app.apiClient().getAllExamsByCourseId({token: tokenLS}, param_course_id, handleResponseGetAllExams);
        setLoading(false);
    };

    useEffect(() => {
        console.log("[Edit Exam screen] entro a useEffect");
        onRefresh();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
                {exams.length === 0 && (
                    <Text style={styles.examsText}>Create exams in this course to edit it's exams here.</Text>
                )}
                {exams.length != 0 && (
                    <Text style={styles.examsText}>Select the exam you want to edit:</Text>
                )}
                {exams.map(item => (
                <TouchableOpacity
                    onPress={() => {}}
                    style={[styles.fadedButton]}
                >
                    <Text style={styles.buttonFadedText}>{item.name}</Text>
                </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
      );
};

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        //width:'90%',
        //paddingTop: 25,
        //paddingLeft: 15,
    },
    fadedButton: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 5,
    },
    buttonFadedText: {
        color:'#87ceeb',
        fontWeight: '700',
        fontSize: 16,
        //textDecorationLine: 'underline',
    },
    examsText: {
        marginTop: 15,
        fontWeight: '300',
        fontSize: 16,
        paddingBottom: 5,
        marginLeft: 5,
    },
});

export default EditExamScreen;
