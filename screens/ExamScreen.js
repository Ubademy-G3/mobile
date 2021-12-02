import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { app } from '../app/app';
import QuestionComponent from '../components/QuestionComponent';

const ExamScreen = (props) => {

    const param_exam_id = props.route.params ? props.route.params.id : 'defaultID';

    const [loading, setLoading] = useState(false);

    const [questions, setQuestions] = useState([]);

    /*const [answer, setAnswer] = useState({
        answer: "",
        question_template_id: 0
    });

    //const [optionsMC, setOptionsMC] = useState(item.options);

    const [selectedMC, setSelectedMC] = useState(0);*/


    const handleResponseGetQuestion = (response) => {
        console.log("[Exam screen] get QUESTIONN: ", response.content());
        if (!response.hasError()) {
            setQuestions(questions => [...questions, response.content()]);
        } else {
            console.log("[Exam screen] error", response.content().message);
        }        
    }

    const handleResponseGetAllQuestions = async (response) => {
        console.log("[Exam screen] get questions: ", response.content().question_templates)
        if (!response.hasError()) {
            let tokenLS = await app.getToken();
            for(let question of response.content().question_templates) {
                console.log("[Exam screen] question", question);
                //setQuestions(questions => [...questions, question]);
                console.log("[Exam screen] question id", question.id)
                await app.apiClient().getQuestionById({token: tokenLS}, param_exam_id ,question.id, handleResponseGetQuestion);
            }
        } else {
            console.log("[Exam screen] error", response.content().message);
        }        
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
                {questions.map(item => (
                    <QuestionComponent
                        item={item}
                    />
                ))}
                    {/*<View
                    key={item.id}
                    >
                        <Text style={styles.questionText}>{item.question}</Text>
                        <Text style={styles.questionText}>Hola</Text>
                        {item.question_type === "written" && (
                            <TextInput
                                placeholder={answer}
                                onChangeText={text => setAnswer({
                                    ...answer,
                                    answer: text,
                                    question_template_id: item.id
                                })}
                                value={answer}
                                style={styles.input}
                            />
                        )}
                        {item.question_type === "multiple_choice" && (
                            <SelectDropdown
                                data={item.options}
                                onSelect={(selectedItem, index) => setSelectedMC(index)}
                                value={selectedMC}
                                defaultButtonText={"Select an option"}
                                buttonStyle={styles.buttonDropdown}
                                buttonTextStyle={styles.textDropdown}
                                renderDropdownIcon={() => {
                                    return (
                                    <Feather name="chevron-down" color={"#444"} size={18} />
                                    );
                                }}
                            />
                        )}
                            </>*/}
            </ScrollView>
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
});

export default ExamScreen;
