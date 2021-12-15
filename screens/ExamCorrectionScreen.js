import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView, TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { app } from '../app/app';

MaterialCommunityIcons.loadFont();

const ExamCorrectionScreen = (props) => {

    const { param_solution } = props.route.params;

    console.log("solution", solution);

    const [loading, setLoading] = useState(false);

    const [solution, setSolution] = useState(param_solution);
    console.log("solution", solution);

    const [answers, setAnswers] = useState([]);

    const getAnswerMC = (key) => {
        const _answers = [...answers];
        return _answers[key].options[_answers[key].answer];
    }

    const handleResponseUpdateSolution = (response) => {
        console.log("[Exam Correction screen] update solution: ", response.content())
        if (!response.hasError()) {
            console.log("[Exam Correction screen] ok");
        } else {
            console.log("[Exam Correction screen] error", response.content().message);
        }        
    }

    const handleResponseUpdateAnswer = (response) => {
        console.log("[Exam Correction screen] update answer: ", response.content())
        if (!response.hasError()) {
            console.log("[Exam Correction screen] ok");
        } else {
            console.log("[Exam Correction screen] error", response.content().message);
        }        
    }

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
                    setAnswers(_answers);
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

    const handleSumbitAddScore = async (key) => {
        const _answers = [...answers];
        _answers[key].score = _answers[key].value;
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        await app.apiClient().updateAnswer({token: tokenLS, score: _answers[key].score}, solution.exam_template_id, _answers[key].exam_solution_id, _answers[key].id, handleResponseUpdateAnswer);
        var total_score = 0
        for (let answ of _answers) {
            console.log("total scrore", total_score);
            total_score = total_score + +answ.score;
        }
        await app.apiClient().updateSolution({token: tokenLS, score: total_score, corrector_id: idLS}, solution.exam_template_id, _answers[key].exam_solution_id, handleResponseUpdateSolution);
        setAnswers(_answers);
        setSolution({...solution, score: total_score});
    };

    const handleSumbitRemoveScore = async (key) => {
        const _answers = [...answers];
        _answers[key].score = 0;
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        await app.apiClient().updateAnswer({token: tokenLS, score: _answers[key].score}, solution.exam_template_id, _answers[key].exam_solution_id, _answers[key].id, handleResponseUpdateAnswer);
        var total_score = 0
        for (let answ of _answers) {
            console.log("total scrore", total_score);
            total_score = total_score + +answ.score;
        }
        await app.apiClient().updateSolution({token: tokenLS, score: total_score, corrector_id: idLS}, solution.exam_template_id, solution.id, handleResponseUpdateSolution);
        setAnswers(_answers);
        setSolution({...solution, score: total_score});
    };

    const handleSubmitChangeState = async () => {
        let tokenLS = await app.getToken();
        if(solution.approval_state){
            await app.apiClient().updateSolution({token: tokenLS, approval_state: false}, solution.exam_template_id, solution.id, handleResponseUpdateSolution);
            setSolution({
                ...solution,
                approval_state: false,
            });
        } else {
            await app.apiClient().updateSolution({token: tokenLS, approval_state: true}, solution.exam_template_id, solution.id, handleResponseUpdateSolution);
            setSolution({
                ...solution,
                approval_state: true,
            });
        }
    };

    const handleSubmitSave = async () => {
        //updeatear solution y poner graded: true
        let tokenLS = await app.getToken();
        await app.apiClient().updateSolution({token: tokenLS, graded: true}, solution.exam_template_id, solution.id, handleResponseUpdateSolution);
        setSolution({...solution, graded: true});
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
                        <Text style={styles.examsText}>This exam is corrected.</Text>
                        <Text style={styles.examsText}>Total score: {solution.score}/{solution.max_score}</Text>
                        {solution.approval_state && (
                            <Text style={styles.examsText}>Approved</Text>
                        )}
                        {!solution.approval_state && (
                            <Text style={styles.examsText}>Failed</Text>
                        )}
                    </>
                )}
                {!solution.graded && (
                    <>
                    <View style={[styles.stateCardWrapper,
                        {
                            backgroundColor: solution.approval_state ? "white": '#87ceeb',
                        }]}>
                        <View style={styles.examDescritpionWrapper}>
                            <TouchableOpacity
                                onPress = {()=> {handleSubmitChangeState()}}
                                style={styles.questionWrapper}
                            >
                                <View style={styles.questionView}>
                                {solution.approval_state && (
                                    <Text style={styles.examDescription}>Approved: {solution.score}/{solution.max_score}</Text>
                                )}
                                {!solution.approval_state && (
                                    <Text style={styles.examDescription}>Failed: {solution.score}/{solution.max_score}</Text>
                                )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {answers.map((item, idx) => (
                            <View>
                                <Text style={styles.questionTitle}>Question:</Text>
                                <Text style={styles.questionText}>{item.question}</Text>
                                {item.question_type === "written" && (
                                    <>
                                        <Text style={styles.questionTitle}>Answer:</Text>
                                        <Text style={styles.questionText}>{item.answer}</Text>
                                        <View style={styles.buttonInputWrapper}>
                                            <TouchableOpacity
                                                onPress = {()=> {handleSumbitAddScore(idx)}}
                                                style={[styles.buttonInputIcon,{
                                                    backgroundColor: item.score === 0 ? "white" : "green"
                                                }]}
                                            >
                                                <MaterialCommunityIcons
                                                    name="check"
                                                    size={20}
                                                    color={'black'}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress = {()=> {handleSumbitRemoveScore(idx)}}
                                                style={[styles.buttonInputIcon,{
                                                    backgroundColor: item.score === 0 ? "red" : "white"
                                                }]}
                                            >
                                                <MaterialCommunityIcons
                                                    name="close"
                                                    size={20}
                                                    color={'black'}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )}
                                {item.question_type === "multiple_choice" && (
                                    <>
                                        <Text style={styles.questionTitle}>Answer:</Text>
                                        <Text style={styles.questionText}>{getAnswerMC(idx)}</Text>
                                        <View style={styles.buttonInputWrapper}>
                                            <TouchableOpacity
                                                onPress = {()=> {handleSumbitAddScore(idx)}}
                                                style={[styles.buttonInputIcon,{
                                                    backgroundColor: item.score === 0 ? "white" : "green"
                                                }]}
                                            >
                                                <MaterialCommunityIcons
                                                    name="check"
                                                    size={20}
                                                    color={'black'}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress = {()=> {handleSumbitRemoveScore(idx)}}
                                                style={[styles.buttonInputIcon,{
                                                    backgroundColor: item.score === 0 ? "red" : "white"
                                                }]}
                                            >
                                                <MaterialCommunityIcons
                                                    name="close"
                                                    size={20}
                                                    color={'black'}
                                                />
                                            </TouchableOpacity>
                                        </View>
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
        paddingTop: 10,
        paddingLeft: 10,
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
    questionTitle: {
        marginTop: 15,
        fontWeight: '700',
        fontSize: 18,
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
    },
    buttonInputIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `#87ceeb`,
        padding: 10,
        borderRadius: 10,
        marginRight: 5,
        marginHorizontal: 20,
    },
    buttonInputWrapper: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        //marginHorizontal: 10,
    },
    stateCardWrapper: {
        backgroundColor: '#87ceeb',
        width: 150,
        borderRadius: 25,
        paddingVertical: 8,
        paddingLeft: 20,
        marginTop: 10,
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,  
    },
    examDescritpionWrapper: {
        //marginTop:5,
        justifyContent: 'center',
    },
    questionWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    questionView: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    examDescription: {
        color:'black',
        fontWeight: '400',
        fontSize: 16,
        //marginTop:5,
    },
});

export default ExamCorrectionScreen;
