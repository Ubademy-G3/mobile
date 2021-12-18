import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
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

const SolvedExamsScreen = (props) => {
    const param_course_id = props.route.params.course_id;
    const [loading, setLoading] = useState(false);
    const [solutions, setSolutions] = useState([]);
    const [filtersVisible, setFiltersVisible] = useState(false);

    const handleResponseGetProfile = async (response) => {
        //console.log("[Solved Exams screen] get user profile: ")
        if (!response.hasError()) {
            for (let [idx, solution] of solutions.entries()) {
                if (solution.user_id === response.content().id) {
                    const _solutions = [...solutions];
                    _solutions[idx].user_name = response.content().firstName;
                    setSolutions(_solutions);
                }
            }
        } else {
            console.log("[Solved Exams screen] error", response.content().message);
        }
    }

    const handleResponseGetExam = async (response) => {
        //console.log("[Solved Exams screen] get exam info: ")
        if (!response.hasError()) {
            for (let [idx, solution] of solutions.entries()) {
                if (solution.exam_template_id === response.content().id) {
                    const _solutions = [...solutions];
                    _solutions[idx].exam_name = response.content().name;
                    setSolutions(_solutions);
                }
            }
        } else {
            console.log("[Solved Exams screen] error", response.content().message);
        }
    }

    const handleResponseGetSolvedExams = async (response) => {
        //console.log("[Solved Exams screen] get solved exams: ")
        if (!response.hasError()) {
            setSolutions(response.content().exam_solutions);
        } else {
            console.log("[Solved Exams screen] error", response.content().message);
        }
    }

    const getData = async () => {
        let tokenLS = await app.getToken();
        let examIds = [];
        for (let solution of solutions) {
            if (!solution.user_name) {
                await app.apiClient().getProfile({token: tokenLS}, solution.user_id, handleResponseGetProfile);
            }
            if (!solution.exam_name && !examIds.includes(solution.exam_template_id)) {
                examIds.push(solution.exam_template_id)
            }
        }
        for (let id of examIds) {
            await app.apiClient().getExamsById({token: tokenLS}, id, handleResponseGetExam);
        }
        setLoading(false);
    };

    const onRefresh = async () => {
        console.log("[Solved Exams screen] entro a onRefresh");
        setLoading(true);
        let tokenLS = await app.getToken();
        console.log("[Solved Exams screen] token:", tokenLS);
        app.apiClient().getSolvedExamsByCourse({ token: tokenLS }, param_course_id, {}, handleResponseGetSolvedExams)
            .then(() => {
                getData();
            })
    };

    useFocusEffect(
        useCallback(() => {
            onRefresh();
        }, [])
    );

    useEffect(() => {
        getData();
    }, [solutions]);

    const filterExams = async (query) => {
        setLoading(true);
        let solvedFilters = {};

        if (query.graded) {
          const graded = query.graded.filter((g) => g.isChecked);
          if (graded.length > 0) {
            if (graded[0].isChecked) {
              solvedFilters.graded = true;
            }
            if (graded[0].isChecked && graded[0].name === 'Not yet graded') {
              solvedFilters.graded = false;
            }
          }
        }
        if (query.approved) {
            const approved = query.approved.filter((a) => a.isChecked);
            if (approved.length > 0) {
              if (approved[0].isChecked) {
                solvedFilters.approval_state = true;
              }
              if (approved[0].isChecked && approved[0].name === 'Failed') {
                solvedFilters.approval_state = false;
              }
            }
        }
        const tokenLS = await app.getToken();
        await app.apiClient().getSolvedExamsByCourse({ token: tokenLS }, param_course_id, solvedFilters, handleResponseGetSolvedExams);
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
                        {solutions.length === 0 ? (
                            <View style={{ display:'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Image source={require("../assets/images/magnifyingGlass.png")} style={{ width: 100, height: 100, marginTop: "50%" }} />
                                <Text style={styles.examsText}>Oops.. could not find any solved exam</Text>
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
                                    <ExamsFilterComponent updateExams={filterExams} type="solved" />
                                )}
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

export default SolvedExamsScreen;
