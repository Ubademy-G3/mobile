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

const MyExamTemplatesScreen = (props) => {
    const param_course_id = props.route.params ? props.route.params.course_id : 'defaultID';

    const [loading, setLoading] = useState(false);
    const [exams, setExams] = useState([]);
    const [filtersVisible, setFiltersVisible] = useState(false);

    const handleResponseGetAllExams = async (response) => {
        console.log("[List Exams screen] get all exams: ", response.content())
        if (!response.hasError()) {
            setExams(response.content().exam_templates);
        } else {
            console.log("[List Exams screen] error", response.content().message);
        }
    }

    const onRefresh = async () => {
        console.log("[List Exams screen] entro a onRefresh");
        setLoading(true);
        let tokenLS = await app.getToken();
        console.log("[List Exams screen] token:", tokenLS);
        await app.apiClient().getAllExamsByCourseId({token: tokenLS}, param_course_id, {}, handleResponseGetAllExams);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            onRefresh();
        }, [])
    );

    const filterExams = async (query) => {
        setLoading(true);
        let templateFilters = {
            state: []
        };
        if (query.state) {
            const state = query.state.filter((s) => s.isChecked);
            if (state.length > 0) {
                state.forEach((st) => {
                    if (st.isChecked && st.name == 'Active') {
                        templateFilters.state.push('active');
                    }
                    if (st.isChecked && st.name == 'Draft') {
                        templateFilters.state.push('draft');
                    }
                    if (st.isChecked && st.name == 'Inactive') {
                        templateFilters.state.push('inactive');
                    }
                })
            }
        }
        const idLS = await app.getId();
        const tokenLS = await app.getToken();
        await app.apiClient().getAllExamsByCourseId({token: tokenLS}, param_course_id, templateFilters, handleResponseGetAllExams);
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
                        {exams.length === 0 ? (
                            <View style={{ display:'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Image source={require("../assets/images/magnifyingGlass.png")} style={{ width: 100, height: 100, marginTop: "50%" }} />
                                <Text style={styles.examsText}>Oops.. could not find any exam</Text>
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
                                    <ExamsFilterComponent updateExams={filterExams} type="template" />
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
    },
    courseCardWrapper: {
        backgroundColor: 'white',
        width: 320,
        borderRadius: 25,
        paddingVertical: 8,
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
    courseCardTop: {
        marginTop: 8,
        alignItems: 'center',
    },
    courseDescriptionWrapper: {
        paddingLeft: 10,
        flexDirection: 'column',
        alignItems: 'flex-end',
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

export default MyExamTemplatesScreen;