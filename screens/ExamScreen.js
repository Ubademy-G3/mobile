import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { app } from '../app/app';
import SelectDropdown from 'react-native-select-dropdown'
import { ActivityIndicator } from 'react-native-paper';

const ExamScreen = (props) => {

    const param_exam_id = props.route.params.id;
    const param_course_id = props.route.params.course_id;

    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [answer, setAnswer] = useState([]);
    const [solutionId, setSolutionId] = useState(0);
    const [blocked, setBlocked] = useState(false);
    const [solution, setSolution] = useState({});
    
    const handleResponseCreateNewSolution = async (response) => {
        if (!response.hasError()) {
            setSolutionId(response.content().id);
        } else {
            console.log("[Edit Exam screen] error", response.content().message);
            if (response.content().message === "This user already reached the maximum amount of attempts for this exam") {
                setBlocked(true);
            }
        }
    }

    const handleResponseCreateNewAnswer =  (response) => {
        if (!response.hasError()) {
            console.log("[Edit Exam screen] create new answer sucessfull");
        } else {
            console.log("[Edit Exam screen] error", response.content().message);
        }  
    }

    const handleResponseGetCourse = async (response) => {
        if (!response.hasError()) {
            let tokenLS = await app.getToken();
            let idLS = await app.getId();
            await app.apiClient().createNewExamSolution({ token: tokenLS, course_id: param_course_id, user_id: idLS, max_score: response.content().max_score }, param_exam_id, handleResponseCreateNewSolution);
        } else {
            console.log("[Edit Exam screen] error", response.content().message);
        }  
    }

    const handleResponseGetAllQuestions = async (response) => {
        if (!response.hasError()) {
            setQuestions(response.content().question_templates);
        } else {
            console.log("[Edit Exam screen] error", response.content().message);
        }        
    }

    const handleResponseGetAllSolutions = async (response) => {
        if (!response.hasError()) {
            for (let solution of response.content().exam_solutions) {
                setSolution({
                    id: solution.id,
                    corrector_id: solution.corrector_id,
                    graded: solution.graded,
                    score: solution.score,
                    approval_state: solution.approval_state,
                    max_score: solution.max_score,
                });
            }
        } else {
            console.log("[Exam screen] error", response.content().message);
        }        
    }

    const handleSubmitSave = async () => {
        setLoading(true);
        let tokenLS = await app.getToken();
        for (let asw of answer) {
            await app.apiClient().createNewExamAnswer({token: tokenLS, answer: asw.answer, question_template_id: asw.question_template_id }, param_exam_id, solutionId, handleResponseCreateNewAnswer);
        }
        props.navigation.goBack();
        setLoading(false);
    }

    const handleSubmitSetAnswer = (key, asw, question_id) => {
        const _answer = answer;
        _answer[key] = { answer: asw, question_template_id: question_id };
        setAnswer(_answer);
    }

    const getSolution = async () => {
        setLoading(true);
        let tokenLS = await app.getToken();
        await app.apiClient().getAllSolutionsByExamId({token: tokenLS}, param_exam_id, handleResponseGetAllSolutions);
        setLoading(false);
    }

    const onRefresh = async () => {
        setLoading(true);
        let tokenLS = await app.getToken();
        await app.apiClient().getExamsById({token: tokenLS}, param_exam_id, handleResponseGetCourse);
        await app.apiClient().getAllQuestionsByExamId({token: tokenLS}, param_exam_id, handleResponseGetAllQuestions);
        setLoading(false);
    };

    useEffect(() => {
        setQuestions([]);
        onRefresh();
    }, []);

    useEffect(() => {
        if (blocked){
            getSolution();
        }
    }, [blocked]);

    return (
        <View style={styles.container}>
            <ScrollView>
                <>
                    {loading && (
                        <View style={{flex:1, justifyContent: 'center'}}>
                            <ActivityIndicator style={{ margin: '50%' }} color="lightblue" animating={loading} size="large" />
                        </View>
                    )}
                    {!loading && (
                        <>
                            {questions.length === 0 && (
                                <Text style={styles.examsText}>This exam has no questions</Text>
                            )}
                            {blocked && (
                                <>
                                    {solution.graded && (
                                        <>
                                            <Text style={styles.examsText}>Total score: {solution.score}/{solution.max_score}</Text>
                                            {solution.approval_state && (
                                                <View style={{ display:'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <Image source={require("../assets/images/verified.png")} style={{ width: 100, height: 100, marginTop: 10 }} />
                                                    <Text style={styles.examsText}>Approved</Text>
                                                </View>
                                            )}
                                            {!solution.approval_state && (
                                                <View style={{ display:'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <Image source={require("../assets/images/failed.jpeg")} style={{ width: 100, height: 100, marginTop: 10 }} />
                                                    <Text style={styles.examsText}>Failed</Text>
                                                </View>
                                            )}
                                        </>
                                    )}
                                    {!solution.graded && (
                                        <Text style={styles.examsText}>You reached the maximum amount of attempts for this exam</Text>
                                    )}
                                </>
                            )}
                            {!blocked && (
                                <>
                                    {questions.map((item, idx) => (
                                        <TouchableOpacity
                                            key={item.id}
                                            onPress={() => {}}
                                            style={styles.containerQuestions}
                                        >
                                            <View>
                                                <Text style={styles.questionText}>{item.question}</Text>
                                                {item.question_type === "written" && (
                                                    <>
                                                        <TextInput
                                                            placeholder="Write your answer"
                                                            multiline = {true}
                                                            onChangeText={text => handleSubmitSetAnswer(idx, text, item.id)}
                                                            value={answer.answer}
                                                            style={styles.input}
                                                        />
                                                    </>
                                                )}
                                                {item.question_type === "multiple_choice" && (
                                                    <>
                                                        <SelectDropdown
                                                            data={item.options}
                                                            onSelect={(selectedItem, index) => handleSubmitSetAnswer(idx, `${index}`, item.id)}
                                                            defaultButtonText={"Select an option"}
                                                            buttonStyle={styles.buttonDropdown}
                                                            buttonTextStyle={styles.textDropdown}
                                                            renderDropdownIcon={() => {
                                                                return (
                                                                <Feather name="chevron-down" color={"#444"} size={18} />
                                                                );
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </>
            </ScrollView>
            {!loading && !blocked && (
            <View style={styles.saveButtonWrapper}>
                <TouchableOpacity
                onPress={() => handleSubmitSave()}> 
                    <View style={styles.saveWrapper}>
                        <Text style={styles.saveText}>Save</Text>
                    </View>
                </TouchableOpacity> 
            </View>  
            )}
        </View>
    );
};

const styles = new StyleSheet.create({
    container: {
        flex: 1,
    },
    containerQuestions: {
        flex: 1,
        marginLeft: 10,
        marginTop: 10,
        marginRight: 10,
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
    },
    examsText: {
        marginTop: 15,
        fontWeight: 'bold',
        fontSize: 20,
        paddingBottom: 5,
        marginLeft: 5,
        textAlign: 'center'
    },
    questionText: {
        marginTop: 15,
        fontWeight: '300',
        fontSize: 16,
        paddingBottom: 5,
    },
    inputContainer: {
        width:'80%',
    },
    input: {
        backgroundColor:'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    inputText: {
        color:'#87ceeb',
        fontWeight: '700',
        fontSize: 16,
        paddingTop:10,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: `#87ceeb`,
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color:'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonDropdown: {
        width:'100%',
        height: 40,
        backgroundColor:'white',
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    textDropdown: {
        color: "#444",
        fontSize: 14,
        textAlign: 'left',
        flex: 1, 
        flexWrap: 'wrap',
        flexDirection: "row",
    },
    saveWrapper: {
        marginBottom: 15,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#87ceeb',
        borderRadius: 50,
        width: 200,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
    },
    saveText: {
        color:'white',
        fontWeight: '700',
        fontSize: 16,       
    },
    saveButtonWrapper:{
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default ExamScreen;
