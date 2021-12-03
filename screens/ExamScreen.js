import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView, TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { app } from '../app/app';
import QuestionComponent from '../components/QuestionComponent';
import SelectDropdown from 'react-native-select-dropdown'

const ExamScreen = (props) => {

    const param_exam_id = props.route.params ? props.route.params.id : 'defaultID';

    const param_course_id = props.route.params ? props.route.params.course_id : 'defaultID';

    const [loading, setLoading] = useState(false);

    const [questions, setQuestions] = useState([]);

    const [answer, setAnswer] = useState([{
        answer: "",
        question_template_id: 0,
    }]);

    const [selectedMC, setSelectedMC] = useState(0);

    const handleResponseGetAllQuestions = (response) => {
        console.log("[Edit Exam screen] get questions: ", response.content())
        if (!response.hasError()) {
            for(let question of response.content().question_templates) {
                setQuestions(instructors => [...instructors, {
                saved_question: true,
                correct: question.correct,
                exam_id: question.exam_id,
                id: question.id,
                options: question.options,
                question: question.question,
                question_type: question.question_type,
                value: question.value}]);
                const _answer = [...answer];
                _answer.push({
                    answer: "",
                    question_template_id: question.id,
                });
                setAnswer(_answer);
            }
        } else {
            console.log("[Edit Exam screen] error", response.content().message);
        }        
    }

    const handleSubmitSave = () => {
        /*for asw in answer:
        await app.apiClient().createNewExamSolution({token: tokenLS}, data, handleResponseCreateNewSolution);
         dentro del handleResponseCreateNewSolution hago:
            obtengo el solutionId
            await app.apiClient().createNewExamAnswer({token: tokenLS}, data, handleResponseCreateNewAnswer);*/

    }

    const handleSubmitSetAnswer = (key, asw, question_id) => {
        const _answer = [...answer];
        _answer[key].answer = asw;
        _answer[key].question_template_id = question_id;
        setAnswer(_answer);
        console.log(answer);
    }

    const onRefresh = async () => {
        console.log("[Exam screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        console.log("[Exam screen] token:", tokenLS); 
        await app.apiClient().getAllQuestionsByExamId({token: tokenLS}, param_exam_id, handleResponseGetAllQuestions);
        setLoading(false);
    };

    useEffect(() => {
        setQuestions([]);
        console.log("[Exam screen] entro a useEffect");
        onRefresh();
        console.log("[Exam screen] questions", questions);
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
                {questions.length === 0 && (
                    <Text style={styles.examsText}>This exam has no questions</Text>
                )}
                {questions.map((item, idx) => (
                    /*<QuestionComponent
                        item={item}
                    />*/
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
                                    {/* Chequear que funcione esto */}
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
            </ScrollView>
            <View style={styles.saveButtonWrapper}>
                <TouchableOpacity onPress={() => handleSubmitSave()}> 
                    <View style={styles.saveWrapper}>
                        <Text style={styles.saveText}>Save</Text>
                    </View>
                </TouchableOpacity> 
            </View>  
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
