import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, Button, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView, TextInput } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { app } from '../app/app';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useFocusEffect } from '@react-navigation/native';

Feather.loadFont();
MaterialCommunityIcons.loadFont();
MaterialIcons.loadFont();

const ListEditExamsScreen = (props) => {

    const param_course_id = props.route.params ? props.route.params.course_id : 'defaultID';

    const [loading, setLoading] = useState(false);

    const [exams, setExams] = useState([]);

    const [solutions, setSolutions] = useState([]);

    const handleResponseGetExam = async (response) => {
        console.log("[List Edit Exams screen] get exam info: ", response.content())
        if (!response.hasError()) {
            for (let [idx, solution] of solutions.entries()) {
                if(solution.exam_template_id === response.content().id) {
                    const _solutions = [...solutions];
                    _solutions[idx].exam_name = response.content().name;
                    setSolutions(_solutions);
                }
            }
        } else {
            console.log("[List Edit Exams screen] error", response.content().message);
        }        
    }

    const handleResponseGetProfile = async (response) => {
        console.log("[List Edit Exams screen] get user profile: ", response.content())
        if (!response.hasError()) {
            for (let [idx, solution] of solutions.entries()) {
                if(solution.user_id === response.content().id) {
                    const _solutions = [...solutions];
                    _solutions[idx].user_name = response.content().firstName;
                    setSolutions(_solutions);
                }
            }
        } else {
            console.log("[List Edit Exams screen] error", response.content().message);
        }        
    }

    const handleResponseGetAllSolutions = async (response) => {
        console.log("[List Edit Exams screen] get solutions: ", response.content())
        if (!response.hasError()) {
            for (let solution of response.content().exam_solutions) {
                setSolutions(solutions => [...solutions,{
                    id: solution.id,
                    course_id: solution.course_id,
                    user_id: solution.user_id,
                    user_name: "",
                    exam_template_id: solution.exam_template_id,
                    exam_name: "",
                    corrector_id: solution.corrector_id,
                    graded: solution.graded,
                    score: solution.score,
                    max_score: solution.max_score,
                    approval_state: solution.approval_state,
                }]);
            }
        } else {
            console.log("[List Edit Exams screen] error", response.content().message);
        }        
    }

    const handleResponseGetAllExams = async (response) => {
        console.log("[List Edit Exams screen] get all exams: ", response.content())
        if (!response.hasError()) {
            setExams(response.content().exam_templates);
            let tokenLS = await app.getToken();
            for (let exam of response.content().exam_templates) {
                await app.apiClient().getAllSolutionsByExamId({token: tokenLS}, exam.id, handleResponseGetAllSolutions);
            }
        } else {
            console.log("[List Edit Exams screen] error", response.content().message);
        }        
    }

    const getData = async () => {
        let tokenLS = await app.getToken();
        for (let solution of solutions) {
            if (solution.user_name === ""){
                await app.apiClient().getProfile({token: tokenLS}, solution.user_id, handleResponseGetProfile);
            }
            if (solution.exam_name === ""){
                await app.apiClient().getExamsById({token: tokenLS}, solution.exam_template_id, handleResponseGetExam);
            }
        }
    };

    const onRefresh = async () => {
        console.log("[List Edit Exams screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        console.log("[List Edit Exams screen] token:", tokenLS); 
        await app.apiClient().getAllExamsByCourseId({token: tokenLS}, param_course_id, handleResponseGetAllExams);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            setSolutions([]);
            onRefresh();
        }, [])
    );

    useEffect(() => {
        //setSolutions([]);
        console.log("[List Edit Exams screen] entro a useEffect");
        getData();
    }, [solutions]);

    return (
        <View style={styles.container}>
            <ScrollView>
                <>
                    {exams.length === 0 && (
                        <Text style={styles.examsText}>Create exams in this course to edit it's exams here.</Text>
                    )}
                    {exams.map(item => (
                        <TouchableOpacity
                            onPress={() => {props.navigation.navigate('Edit Exam', {
                                exam_id: item.id
                                })}}
                            style={styles.fadedButton}
                        >
                            <View
                                style={styles.courseCardWrapper}
                            >
                                <View style={styles.courseCardTop}>
                                    <Text style={styles.buttonFadedText}>{item.name}</Text>
                                </View>
                                <View style={styles.courseDescriptionWrapper}>
                                    <Text style={styles.courseTitleDescription}>points: {item.max_score}</Text>
                                    <Text style={styles.courseTitleDescription}>{item.state}</Text>
                                </View> 
                            </View>
                        </TouchableOpacity>
                    ))}
                    {solutions.map(item => (
                        <TouchableOpacity
                            onPress={() => {props.navigation.navigate('Exam Correction', {
                                param_solution: item,
                            })}}
                            style={styles.fadedButton}
                        >
                            <View
                                style={styles.courseCardWrapper}
                            >
                                <View style={styles.courseCardTop}>
                                    <Text style={styles.buttonFadedText}>{item.exam_name} - {item.user_name}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                    {/* <View style={[styles.newExamWrapper, {paddingBottom: 20}]}> */}
                    <TouchableOpacity
                        onPress = {()=> {props.navigation.navigate('Create New Exam', {
                            id: param_course_id,
                            })}}
                        style={styles.questionWrapper}
                    >
                        <View style={[styles.courseCardWrapper, {backgroundColor: '#87ceeb', justifyContent: 'center'}]}>
                                <View style={styles.addQuestionView}>
                                    <Text style={styles.buttonText}>Create New Exam</Text>
                                    <Feather
                                        name="plus"
                                        size={20}
                                        color={'white'}
                                        style={styles.buttonEditIconRight}
                                    />
                                </View>
                        </View>
                    </TouchableOpacity>
                    {/* </View> */}
                </>
            </ScrollView>
        </View>
    );
};

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        paddingLeft: 10,
    },
    newExamWrapper: {
        flex: 1,
        paddingTop: 10,
        paddingLeft: 10,
    },
    examsText: {
        marginTop: 15,
        fontWeight: '300',
        fontSize: 16,
        paddingBottom: 5,
        marginLeft: 5,
    },
    fadedButton: {
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        //marginBottom: 5,
    },
    courseCardWrapper: {
        backgroundColor: 'white',
        width: 320,
        borderRadius: 25,
        paddingVertical: 8,
        paddingLeft: 20,
        //marginTop: 5,
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
    courseCardTop: {
        //marginLeft: 20,
        //paddingRight: 40,
        marginTop: 8,
        alignItems: 'center',
        //marginRight: 80,
    },
    courseDescriptionWrapper: {
        paddingLeft: 10,
        //paddingRight: 40,
        flexDirection: 'column',
        alignItems: 'flex-end',
        //marginRight: 80,
    },
    courseTitleDescription: {
        paddingBottom: 3,
        color:'black',
        fontWeight: '300',
        fontSize: 12,
    },
    questionWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10,
    },
    addQuestionView: {
        flexDirection: 'row',
        marginTop: 8,
        alignItems: 'center',
    },
    buttonText: {
        color:'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonEditIconRight: {
        marginLeft: 10,
    },
});

export default ListEditExamsScreen;
