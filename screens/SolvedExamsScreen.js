import React, { useState, useRef, useCallback } from 'react';
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
    const mounted = useRef(false);
    const param_course_id = props.route.params.course_id;
    const [loading, setLoading] = useState(false);
    const [solutions, setSolutions] = useState([]);
    const [users, setUsers] = useState(null);
    const [templates, setTemplates] = useState(null);
    const [filtersVisible, setFiltersVisible] = useState(false);

    const handleGetUsers = async (response) => {
        if (!response.hasError()) {
            setUsers(response.content())
        } else {
            console.log("[Solved Exams screen] error", response.content().message);
        }
    }

    const handleResponseGetSolvedExams = async (response) => {
        //console.log("[Solved Exams screen] get solved exams: ")
        if (!response.hasError()) {
            setSolutions(response.content().exam_solutions);
            let tokenLS = await app.getToken();
            if (response.content().exam_solutions.length > 0) {
                let userIds = response.content().exam_solutions.map((sol) => sol.user_id);
                userIds = [ ...new Set(userIds) ];
                await app.apiClient().getAllUsersFromList({ token: tokenLS }, userIds, handleGetUsers)
            }
        } else {
            console.log("[Solved Exams screen] error", response.content().message);
        }
    }

    const handleGetExamTemplates = async (response) => {
        if (!response.hasError()) {
            setTemplates(response.content().exam_templates);
        } else {
            console.log("[Solved Exams screen] error", response.content().message);
        }
    }

    const onRefresh = async () => {
        console.log("[Solved Exams screen] entro a onRefresh");
        setLoading(true);
        let tokenLS = await app.getToken();
        console.log("[Solved Exams screen] token:", tokenLS);
        await app.apiClient().getAllExamsByCourseId({ token: tokenLS }, param_course_id, {}, handleGetExamTemplates);
        await app.apiClient().getSolvedExamsByCourse({ token: tokenLS }, param_course_id, {}, handleResponseGetSolvedExams);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            mounted.current = true;
            onRefresh();
            return() => {
                mounted.current = false;
            }
        }, [])
    );

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
                solvedFilters.graded = true;
              }
              if (approved[0].isChecked && approved[0].name === 'Failed') {
                solvedFilters.approval_state = false;
                solvedFilters.graded = true;
              }
            }
        }
        const tokenLS = await app.getToken();
        await app.apiClient().getSolvedExamsByCourse({ token: tokenLS }, param_course_id, solvedFilters, handleResponseGetSolvedExams);
        setLoading(false);
      }

    const getStudentName = (id) => {
        const u = users.filter((u) => u.id === id);
        return `${u[0].firstName} ${u[0].lastName}`;
    }

    const getExamName = (id) => {
        const e = templates.filter((e) => e.id === id);
        return e[0].name;
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                {loading && (
                    <View style={{flex:1, justifyContent: 'center'}}>
                        <ActivityIndicator style={{ margin: '50%' }} color="lightblue" animating={loading} size="large" />
                    </View>
                )}
                {!loading && users && templates && solutions && (
                    <>
                        {(solutions.length === 0 || users.length === 0 || templates.length === 0) ? (
                            <View style={{ display:'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Image source={require("../assets/images/magnifyingGlass.png")} style={{ width: 100, height: 100, marginTop: "50%" }} />
                                <Text style={styles.examsText}>Oops.. could not find any exam</Text>
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
                                        key={item.id}
                                    >
                                        {console.log("ITEM:")}
                                        {console.log(item)}
                                        <View
                                            style={styles.courseCardWrapper}
                                        >
                                            <View style={styles.courseCardTop}>
                                                <Text style={styles.buttonFadedText}>{getExamName(item.exam_template_id)}</Text>
                                            </View>
                                            <View>
                                                <Text>{`Solved by ${getStudentName(item.user_id)}`}</Text>
                                                {item.graded && (
                                                    <>
                                                        {/*<Text>{`Corrected by ${item.user_name} ${item.user_last_name}`}</Text>
                                                        */}
                                                        <Text>{`Score: ${item.score}`}</Text>
                                                    </>
                                                )}
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </>
                        )}
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
        flexDirection: 'column',
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
        alignItems: 'flex-start',
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
    buttonFadedText: {
        fontWeight: 'bold'
    },
    buttonEditIconRight: {
        marginLeft: 10,
    },
});

export default SolvedExamsScreen;