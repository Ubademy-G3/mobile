import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView, TextInput } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { app } from '../app/app';

const ExamCorrectionScreen = (props) => {

    const { solution } = props.route.params;

    console.log("solution", solution);

    const [loading, setLoading] = useState(false);

    const [answers, setAnswers] = useState([]);

    const handleResponseGetQuestion = (response) => {
        console.log("[Exam Correction screen] get question: ", response.content())
        if (!response.hasError()) {
            for (let [idx, answer] of answers.entries()) {
                if(answer.question_template_id === response.content().id) {
                    const _answers = [...answers];
                    _answers[idx].question = response.content().question;
                    _answers[idx].question_type = response.content().question_type;
                    _answers[idx].options = response.content().options;
                    _answers[idx].correct = response.content().correct;
                    _answers[idx].value = response.content().value;
                    setSolutions(_answers);
                }
            }
        } else {
            console.log("[Exam Correction screen] error", response.content().message);
        }        
    }

    const handleResponseGetAllAnswers = (response) => {
        console.log("[Exam Correction screen] get all answers: ", response.content())
        if (!response.hasError()) {
            for (let answer of response.content().question_solutions) {
                setAnswers(answers => [...answers,{
                    id: answer.id,
                    answer: answer.answer,
                    score: answer.score,
                    exam_solution_id: answer.exam_solution_id,
                    question_template_id: answer.question_template_id,
                    question: "",
                    question_type: "",
                    options: [],
                    correct: 0,
                    value: 0,
                }]);
            }
        } else {
            console.log("[Exam Correction screen] error", response.content().message);
        }
    }

    const getQuestions = async () => {
        console.log("[Exam Correction screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        console.log("[Exam Correction screen] token:", tokenLS);
        for( let answer of answers){
            if(answer.question === ""){
                await app.apiClient().getQuestionById({token: tokenLS}, solution.exam_template_id, answer.question_template_id, handleResponseGetQuestion);
            }
        }
        setLoading(false);
    };

    const onRefresh = async () => {
        console.log("[Exam Correction screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        console.log("[Exam Correction screen] token:", tokenLS);
        await app.apiClient().getAllAnswersByExamId({token: tokenLS}, solution.exam_template_id, solution.id, handleResponseGetAllAnswers);
        setLoading(false);
    };

    useEffect(() => {
        console.log("[Exam screen] entro a useEffect");
        onRefresh();
    }, []);

    useEffect(() => {
        console.log("[Exam screen] entro a useEffect");
        getQuestions();
    }, [answers]);

    return (
        <View style={styles.container}>
            <ScrollView>
                {answers.length === 0 && (
                    <Text style={styles.examsText}>This exam has no questions</Text>
                )}
                {solution.graded && (
                    <>
                        <Text style={styles.examsText}>The exam was already corrected.</Text>
                        <Text style={styles.examsText}>Total score: {solution.score}</Text>
                        {solution.aprobal_state && (
                            <Text style={styles.examsText}>Approved{solution.score}</Text>
                        )}
                        {!solution.aprobal_state && (
                            <Text style={styles.examsText}>Failed{solution.score}</Text>
                        )}
                    </>
                )}
                {!solution.graded && (
                    <>
                    {answers.map((item, idx) => (
                            <View>
                                <Text style={styles.questionText}>{item.question}</Text>
                                {item.question_type === "written" && (
                                    <>
                                        <Text style={styles.questionText}>{item.answer}</Text>
                                    </>
                                )}
                                {item.question_type === "multiple_choice" && (
                                    <>
                                        <Text style={styles.questionText}>{item.answer}</Text>
                                    </>
                                )}
                            </View>
                    ))}
                    </>
                )}
            </ScrollView>
            {!solution.graded && (
            <View style={styles.saveButtonWrapper}>
                <TouchableOpacity onPress={() => handleSubmitSave()}> 
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
        //width:'90%',
        //paddingTop: 25,
        //paddingLeft: 15,
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
        //textDecorationLine: 'underline',
    },
    examsText: {
        marginTop: 15,
        fontWeight: '300',
        fontSize: 16,
        paddingBottom: 5,
        marginLeft: 5,
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
        //paddingVertical: 5,
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
    },
    saveWrapper: {
        marginBottom: 15,
        //marginLeft: 35,
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

export default ExamCorrectionScreen;
