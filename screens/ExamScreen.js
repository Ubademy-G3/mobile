import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView, TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { app } from '../app/app';
import QuestionComponent from '../components/QuestionComponent';
import SelectDropdown from 'react-native-select-dropdown'
import { GetAllSolutionsByExamIdEndpoint } from '../communication/endpoints/GetAllSolutionsByExamIdEndpoint';
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
        console.log("[Edit Exam screen] create new solution: ", response.content())
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
        console.log("[Edit Exam screen] create new answer: ", response.content())
        if (!response.hasError()) {
            console.log("[Edit Exam screen] create new answer sucessfull");
        } else {
            console.log("[Edit Exam screen] error", response.content().message);
        }  
    }

    const handleResponseGetCourse = async (response) => {
        console.log("[Edit Exam screen] create new answer: ", response.content())
        if (!response.hasError()) {
            let tokenLS = await app.getToken();
            let idLS = await app.getId();
            await app.apiClient().createNewExamSolution({ token: tokenLS, course_id: param_course_id, user_id: idLS, max_score: response.content().max_score }, param_exam_id, handleResponseCreateNewSolution);
        } else {
            console.log("[Edit Exam screen] error", response.content().message);
        }  
    }

    const handleResponseGetAllQuestions = async (response) => {
        console.log("[Edit Exam screen] get questions: ", response.content())
        if (!response.hasError()) {
            /*for (let question of response.content().question_templates) {
                setQuestions(questions => [...questions, {
                saved_question: true,
                correct: question.correct,
                exam_id: question.exam_id,
                id: question.id,
                options: question.options,
                question: question.question,
                question_type: question.question_type,
                value: question.value}]);
                console.log("course_id:", param_course_id);
                setAnswer(answer => [...answer, {
                    answer: "",
                    question_template_id: question.id,
                }]);
            }*/
            setQuestions(response.content().question_templates);
        } else {
            console.log("[Edit Exam screen] error", response.content().message);
        }        
    }

    const handleResponseGetAllSolutions = async (response) => {
        console.log("[Exam screen] get solutions: ", response.content())
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
        let tokenLS = await app.getToken();
        console.log("ANSWERS")
        console.log(answer)
        for (let asw of answer) {
            await app.apiClient().createNewExamAnswer({token: tokenLS, answer: asw.answer, question_template_id: asw.question_template_id }, param_exam_id, solutionId, handleResponseCreateNewAnswer);
        }
        props.navigation.goBack();
    }

    const handleSubmitSetAnswer = (key, asw, question_id) => {
        const _answer = answer;
        _answer[key] = { answer: asw, question_template_id: question_id };
        setAnswer(_answer);
        console.log("Set answer", _answer);
    }

    const getSolution = async () => {
        let tokenLS = await app.getToken();
        await app.apiClient().getAllSolutionsByExamId({token: tokenLS}, param_exam_id, handleResponseGetAllSolutions);
    }

    const onRefresh = async () => {
        console.log("[Exam screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        console.log("[Exam screen] token:", tokenLS);
        await app.apiClient().getExamsById({token: tokenLS}, param_exam_id, handleResponseGetCourse);
        await app.apiClient().getAllQuestionsByExamId({token: tokenLS}, param_exam_id, handleResponseGetAllQuestions);
        setLoading(false);
    };

    useEffect(() => {
        setQuestions([]);
        console.log("[Exam screen] entro a useEffect");
        onRefresh();
        console.log("[Exam screen] questions", questions);
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
                    {console.log("BLOCKED")}
                    {console.log(blocked)}
                    {loading && (
                        <ActivityIndicator color="lightblue" style={{ margin: "50%" }}/>
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
                                                <Text style={styles.examsText}>Approved</Text>
                                            )}
                                            {!solution.approval_state && (
                                                <Text style={styles.examsText}>Failed</Text>
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
                                                        {/* Chequear que funcione esto -> parece funcionar */}
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
            {!blocked && (
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

export default ExamScreen;
