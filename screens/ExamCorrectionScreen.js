import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { app } from '../app/app';
import { ActivityIndicator } from 'react-native-paper';

MaterialCommunityIcons.loadFont();

const ExamCorrectionScreen = (props) => {
    const { param_solution } = props.route.params;

    const [loading, setLoading] = useState(false);
    const [solution, setSolution] = useState(param_solution);
    const [answers, setAnswers] = useState(null);
    const [questions, setQuestions] = useState(null);
    const [amountExams, setAmountExams] = useState(0);
    const [amountExamsApproved, setAmountExamsApproved] = useState(null);
    const [approvalScore, setApprovalScore] = useState(0);
    const [username, setUsername] = useState("");

    const getAnswerMC = (key, questionId) => {
        const _answers = [...answers];
        const question = questions.filter((q) => {
            return q.id === questionId;
        });
        const options = question[0].options;
        return options[_answers[key].answer];
    }

    const handleResponseUpdateSolution = (response) => {
        if (!response.hasError()) {
            console.log("[Exam Correction screen] ok");
        } else {
            console.log("[Exam Correction screen] error", response.content().message);
        }
    }

    const handleResponseUpdateAnswer = (response) => {
        if (!response.hasError()) {
            console.log("[Exam Correction screen] ok");
        } else {
            console.log("[Exam Correction screen] error", response.content().message);
        }
    }

    const handleResponseUpdateUserFromCourse = (response) => {
        if (!response.hasError()) {
            console.log("[Exam Correction screen] ok");
        } else {
            console.log("[Exam Correction screen] error", response.content().message);
        }
    }

    const handleResponseGetAllExamsByCourse = (response) => {
        if (!response.hasError()) {
            setAmountExams(response.content().total_exams);
        } else {
            console.log("[Exam Correction screen] error", response.content().message);
        }
    }

    const handleResponseGetExam = (response) => {
        if (!response.hasError()) {
            setApprovalScore(response.content().approval_score);
        } else {
            console.log("[Exam Correction screen] error", response.content().message);
        }
    }

    const handleResponseGetSolvedExams = (response) => {
        if (!response.hasError()) {
            setAmountExamsApproved(response.content().amount);
        } else {
            console.log("[Exam Correction screen] error", response.content().message);
        }
    }

    const handleResponseGetProfile = (response) => {
        if (!response.hasError()) {
            setUsername(`${response.content().firstName} ${response.content().lastName}`);
        } else {
            console.log("[Exam Correction screen] error", response.content().message);
        }
    }

    const handleResponseGetAllQuestions = (response) => {
        if (!response.hasError()) {
            setQuestions(response.content().question_templates);
        } else {
            console.log("[Exam Correction screen] error", response.content().message);
        }        
    }

    const handleResponseGetAllAnswers = (response) => {
        if (!response.hasError()) {
            setAnswers(response.content().question_solutions);
        } else {
            console.log("[Exam Correction screen] error", response.content().message);
        }
    }

    const handleSumbitAddScore = async (key, questionId) => {
        const _answers = [...answers];
        const question = questions.filter((q) => {
            return q.id === questionId;
        });
        _answers[key].score = question[0].value;
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        await app.apiClient().updateAnswer({token: tokenLS, score: _answers[key].score}, solution.exam_template_id, _answers[key].exam_solution_id, _answers[key].id, handleResponseUpdateAnswer);
        var total_score = 0
        for (let answ of _answers) {
            total_score = total_score + answ.score;
        }
        if (total_score < approvalScore) {
            await app.apiClient().updateSolution({token: tokenLS, score: total_score, corrector_id: idLS, approval_state: false}, solution.exam_template_id, solution.id, handleResponseUpdateSolution);
            setSolution({...solution, score: total_score, approval_state: false});
        } else {
            await app.apiClient().updateSolution({token: tokenLS, score: total_score, corrector_id: idLS, approval_state: true}, solution.exam_template_id, solution.id, handleResponseUpdateSolution);
            setSolution({...solution, score: total_score, approval_state: true});
        }
        setAnswers(_answers);
    };

    const handleSumbitRemoveScore = async (key) => {
        const _answers = [...answers];
        _answers[key].score = 0;
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        await app.apiClient().updateAnswer({token: tokenLS, score: _answers[key].score}, solution.exam_template_id, _answers[key].exam_solution_id, _answers[key].id, handleResponseUpdateAnswer);
        var total_score = 0
        for (let answ of _answers) {
            total_score = total_score + answ.score;
        }
        if (total_score < approvalScore) {
            await app.apiClient().updateSolution({token: tokenLS, score: total_score, corrector_id: idLS, approval_state: false}, solution.exam_template_id, solution.id, handleResponseUpdateSolution);
            setSolution({...solution, score: total_score, approval_state: false});
        } else {
            await app.apiClient().updateSolution({token: tokenLS, score: total_score, corrector_id: idLS, approval_state: true}, solution.exam_template_id, solution.id, handleResponseUpdateSolution);
            setSolution({...solution, score: total_score, approval_state: true});
        }
        setAnswers(_answers);
    };

    const handleSubmitSave = async () => {
        //updeatear solution y poner graded: true
        let tokenLS = await app.getToken();
        await app.apiClient().updateSolution({token: tokenLS, graded: true}, solution.exam_template_id, solution.id, handleResponseUpdateSolution);
        setSolution({...solution, graded: true});
        await app.apiClient().getSolvedExamsByUserFromCourse({token: tokenLS}, solution.course_id, solution.user_id, {graded: true, approval_state: true, user_type: "user"}, handleResponseGetSolvedExams);   
    }

    const getQuestions = async () => { 
        setLoading(true);
        let tokenLS = await app.getToken();
        await app.apiClient().getAllQuestionsByExamId({token: tokenLS}, solution.exam_template_id, handleResponseGetAllQuestions)
        setLoading(false);
    };

    const onRefresh = async () => {
        setLoading(true);
        let tokenLS = await app.getToken();
        await app.apiClient().getAllAnswersByExamId({token: tokenLS}, solution.exam_template_id, solution.id, handleResponseGetAllAnswers);
        await app.apiClient().getCourseById({token: tokenLS}, solution.course_id, handleResponseGetAllExamsByCourse);
        await app.apiClient().getExamsById({token: tokenLS}, solution.exam_template_id, handleResponseGetExam);
        await app.apiClient().getProfile({token: tokenLS}, solution.user_id, handleResponseGetProfile);
        setLoading(false);
    };

    const setProgress = async () => {
        setLoading(true);
        let tokenLS = await app.getToken();
        let new_progress = Math.round(((amountExamsApproved/amountExams) * 100));
        await app.apiClient().updateUserFromCourse({token: tokenLS, progress: new_progress}, solution.course_id, solution.user_id, {username: username},handleResponseUpdateUserFromCourse);
        setLoading(false);
    }

    useEffect(() => {
        onRefresh();
    }, []);

    useEffect(() => {
        getQuestions();
    }, [answers]);

    useEffect(() => {
        if (amountExamsApproved != null){
            setProgress();
        }
    }, [amountExamsApproved])

    const getQuestionById = (id) => {
        let question = questions.filter((q) => {
            return q.id === id;
        });
        return question[0].question;
    };

    const isQuestionTypeWritten = (id) => {
        let question = questions.filter((q) => {
            return q.id === id;
        });
        return question[0].question_type === 'written';
    }

    const isQuestionTypeMultipleChoice = (id) => {
        let question = questions.filter((q) => {
            return q.id === id;
        });
        return question[0].question_type === 'multiple_choice';
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                {loading && (
                    <View style={{flex:1, justifyContent: 'center'}}>
                        <ActivityIndicator style={{ margin: '50%' }} color="lightblue" animating={loading} size="large" />
                    </View>
                )}
                {!loading && answers && questions && (
                    <>
                    {answers.length === 0 && !solution.graded && (
                        <View style={{ display:'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Image source={require("../assets/images/magnifyingGlass.png")} style={{ width: 100, height: 100, marginTop: "50%" }} />
                            <Text style={styles.examsText}>This exam has no answers</Text>
                        </View>
                    )}
                    {solution.graded && (
                        <>
                            <Text style={styles.examsText}>This exam is corrected</Text>
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
                    {!solution.graded && answers.length > 0 && (
                        <>
                        <View style={[styles.stateCardWrapper,
                            {
                                backgroundColor: solution.approval_state ? "white": '#87ceeb',
                            }]}>
                            <View style={styles.examDescritpionWrapper}>
                                    <View style={styles.questionView}>
                                    {solution.approval_state && (
                                        <Text style={styles.examDescription}>Approved: {solution.score}/{solution.max_score}</Text>
                                    )}
                                    {!solution.approval_state && (
                                        <Text style={styles.examDescription}>Failed: {solution.score}/{solution.max_score}</Text>
                                    )}
                                    </View>
                            </View>
                        </View>
                        {answers.map((item, idx) => (
                                <View>
                                    <Text style={styles.questionTitle}>Question:</Text>
                                    <Text style={styles.questionText}>{getQuestionById(item.question_template_id)}</Text>
                                    {isQuestionTypeWritten(item.question_template_id) && (
                                        <>
                                            <Text style={styles.questionTitle}>Answer:</Text>
                                            <Text style={styles.questionText}>{item.answer}</Text>
                                            <View style={styles.buttonInputWrapper}>
                                                <TouchableOpacity
                                                    onPress = {()=> {handleSumbitAddScore(idx, item.question_template_id)}}
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
                                    {isQuestionTypeMultipleChoice(item.question_template_id) && (
                                        <>
                                            <Text style={styles.questionTitle}>Answer:</Text>
                                            <Text style={styles.questionText}>{getAnswerMC(idx, item.question_template_id)}</Text>
                                            <View style={styles.buttonInputWrapper}>
                                                <TouchableOpacity
                                                    onPress = {()=> {handleSumbitAddScore(idx, item.question_template_id)}}
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
                    </>
                )}
            </ScrollView>
            {!loading && !solution.graded && (
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
        flexDirection: 'row',
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
    },
});

export default ExamCorrectionScreen;
