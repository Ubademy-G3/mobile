import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, Button, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView, TextInput } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { app } from '../app/app';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import ExamsFilterComponent from '../components/ExamsFilterComponent';

Feather.loadFont();
MaterialCommunityIcons.loadFont();
MaterialIcons.loadFont();

const ListExamsScreen = (props) => {
    const param_course_id = props.route.params ? props.route.params.course_id : 'defaultID';
    const param_view_as = props.route.params.view_as;
    const [loading, setLoading] = useState(false);
    const [exams, setExams] = useState([]);
    const [solutions, setSolutions] = useState([]);
    const [filtersVisible, setFiltersVisible] = useState(false);

    const handleResponseGetExam = async (response) => {
        console.log("[List Exams screen] get exam info: ", response.content())
        if (!response.hasError()) {
            for (let [idx, solution] of solutions.entries()) {
                if (solution.exam_template_id === response.content().id) {
                    const _solutions = [...solutions];
                    _solutions[idx].exam_name = response.content().name;
                    setSolutions(_solutions);
                }
            }
        } else {
            console.log("[List Exams screen] error", response.content().message);
        }        
    }

    const handleResponseGetProfile = async (response) => {
        console.log("[List Exams screen] get user profile: ", response.content())
        if (!response.hasError()) {
            for (let [idx, solution] of solutions.entries()) {
                if (solution.user_id === response.content().id) {
                    const _solutions = [...solutions];
                    _solutions[idx].user_name = response.content().firstName;
                    setSolutions(_solutions);
                }
            }
        } else {
            console.log("[List Exams screen] error", response.content().message);
        }        
    }

    const handleResponseGetAllSolutions = async (response) => {
        console.log("[List Exams screen] get solutions: ", response.content())
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
            console.log("[List Exams screen] error", response.content().message);
        }        
    }

    const handleResponseGetAllExams = async (response) => {
        console.log("[List Exams screen] get all exams: ", response.content())
        if (!response.hasError()) {
            setExams(response.content().exam_templates);
            let tokenLS = await app.getToken();
            for (let exam of response.content().exam_templates) {
                await app.apiClient().getAllSolutionsByExamId({token: tokenLS}, exam.id, handleResponseGetAllSolutions);
            }
        } else {
            console.log("[List Exams screen] error", response.content().message);
        }
    }

    const handleResponseGetSolvedExams = async (response) => {
        console.log("[List Exams screen] get solved exams: ", response.content())
        if (!response.hasError()) {
            setExams([]);
            setSolutions(response.content().exam_solutions)
        } else {
            console.log("[List Exams screen] error", response.content().message);
        }
    }

    const getData = async () => {
        let tokenLS = await app.getToken();
        for (let solution of solutions) {
            if (solution.user_name === "") {
                await app.apiClient().getProfile({token: tokenLS}, solution.user_id, handleResponseGetProfile);
            }
            if (solution.exam_name === "") {
                await app.apiClient().getExamsById({token: tokenLS}, solution.exam_template_id, handleResponseGetExam);
            }
        }
    };

    const onRefresh = async () => {
        console.log("[List Exams screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        console.log("[List Exams screen] token:", tokenLS); 
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
        console.log("[List Exams screen] entro a useEffect");
        getData();
    }, [solutions]);

    const filterExams = async (query) => {
        setLoading(true);
        let filters = {};
        if (query.graded) {
          const graded = query.graded.filter((g) => g.isChecked);
          console.log(graded)
          if (graded.length > 0) {
            if (graded[0].isChecked) {
              filters.graded = true;
            }
            if (graded[0].isChecked && graded[0].name === 'Not yet graded') {
              filters.graded = false;
            }
          }
        }
        if (query.approved) {
            const approved = query.approved.filter((a) => a.isChecked);
            console.log(approved);
            if (approved.length > 0) {
              if (approved[0].isChecked) {
                filters.approval_state = true;
              }
              if (approved[0].isChecked && approved[0].name === 'Failed') {
                filters.approval_state = false;
              }
            }
        }
        filters.user_type = 'corrector';
        const idLS = await app.getId();
        const tokenLS = await app.getToken();
        await app.apiClient().getSolvedExams({ token: tokenLS }, idLS, filters, handleResponseGetSolvedExams);
        setLoading(false);
      }

    return (
        <View style={styles.container}>
            <ScrollView>
                {loading && (
                    <ActivityIndicator color="lightblue" style={{ margin: "50%" }}/>
                )}
                {!loading && (
                    <>
                        {exams.length === 0 && solutions.length === 0 ? (
                            <View style={{display:'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <Image source={require("../assets/images/magnifyingGlass.png")} style={{ width: 100, height: 100, marginTop: "50%" }} />
                                <Text style={styles.examsText}>Seems like you haven't created any exams yet</Text>
                                <Text style={styles.examsText}>Create exams in this course to edit them here.</Text>
                            </View>
                        ) : (
                            <>
                                <View>
                                    <TouchableOpacity
                                        onPress={() => { setFiltersVisible(!filtersVisible) }}
                                        style={{ display:'flex', flexDirection: 'row', justifyContent: 'flex-end', marginRight: 10 }}
                                    >
                                        <Feather name="filter" color={"#444"} size={18} />
                                        <Text>Filters</Text>
                                    </TouchableOpacity>
                                </View>
                                {filtersVisible && (
                                    <ExamsFilterComponent updateExams={filterExams} />
                                )}
                                {exams.map(item => (
                                    <TouchableOpacity
                                        onPress={() => {props.navigation.navigate('Edit Exam', {
                                            exam_id: item.id
                                            })}}
                                        style={styles.fadedButton}
                                        key={item.id}
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
                            </>
                        )}
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
                    </>
                )}
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

export default ListExamsScreen;
