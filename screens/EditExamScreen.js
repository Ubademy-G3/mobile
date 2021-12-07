import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView, TextInput } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { app } from '../app/app';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

Feather.loadFont();
MaterialCommunityIcons.loadFont();
MaterialIcons.loadFont();

const EditExamScreen = (props) => {

    const param_course_id = props.route.params ? props.route.params.id : 'defaultID';

    const [loading, setLoading] = useState(false);

    const [exams, setExams] = useState([]);
    
    const [questions, setQuestions] = useState([]);

    const [questionMC, setQuestionMC] = useState("");

    const [finishedMC, setFinishedMC] = useState(false);

    const [selectedExam, setSelectedExam] = useState({
        id: 0,
        has_media: false,
        has_multiple_choice: false,
        has_written: false,
        max_attempts: 1,
        max_score: 10,
        name: "",
        state: "",
    });
    
    const [selected, setSelected] = useState(false);

    const handleApiResponseUpdateExam = (response) => {
        console.log("[Edit Exam screen] update exam: ", response.content())
        if (!response.hasError()) {
        } else {
            console.log("[Edit Exam screen] error", response.content().message);
        }        
    }

    const handleResponseGetAllExams = (response) => {
        console.log("[Edit Exam screen] get exams: ", response.content())
        if (!response.hasError()) {
            setExams(response.content().exam_templates);
        } else {
            console.log("[Edit Exam screen] error", response.content().message);
        }        
    }

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
                value: question.value}])
            }
        } else {
            console.log("[Edit Exam screen] error", response.content().message);
        }        
    }

    const handleApiResponseUpdateQuestion = (response) => {
        console.log("[Edit Exam screen] update question: ", response.content())
        if (!response.hasError()) {
        } else {
            console.log("[Edit Exam screen] error", response.content().message);
        }        
    }

    const handleApiResponseDeleteQuestion = (response) => {
        console.log("[Edit Exam screen] delete question: ", response.content())
        if (!response.hasError()) {
        } else {
            console.log("[Edit Exam screen] error", response.content().message);
        }        
    }

    const handleApiResponseCreateQuestion = (response) => {
        console.log("[Edit Exam screen] content: ", response.content())
        if (!response.hasError()) {
            setQuestions(questions => [...questions, {
                id: response.content().id,
                saved_question: false,
                correct: response.content().correct,
                exam_id: response.content().exam_id,
                id: response.content().id,
                options: response.content().options,
                question: response.content().question,
                question_type: response.content().question_type,
                value: response.content().value
            }]);
            console.log("[Edit Exam screen] response sucessfull");
        } else {
            console.log("[Edit Exam screen] error", response.content().message);
        }
    }

    const onRefresh = async () => {
        console.log("[Edit Exam screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        console.log("[Edit Exam screen] token:", tokenLS); 
        await app.apiClient().getAllExamsByCourseId({token: tokenLS}, param_course_id, handleResponseGetAllExams);
        setLoading(false);
    };

    const selectExam = async () => {
        console.log("[Edit Exam screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        console.log("[Edit Exam screen] token:", tokenLS); 
        await app.apiClient().getAllQuestionsByExamId({token: tokenLS}, selectedExam.id, handleResponseGetAllQuestions);
        setLoading(false);
    };

    const handleSubmitselectExam = (item) => {
        setSelectedExam({
            ...selectedExam,
            id: item.id,
            has_media: item.has_media,
            has_multiple_choice: item.has_multiple_choice,
            has_written: item.has_written,
            max_attempts: item.max_attempts,
            max_score: item.max_score,
            name: item.name,
            state: item.state,
        });
        setSelected(true);
    }

    const handleSaveQuestion = async (key) => {
        const _questions = [...questions];
        _questions[key].saved_question = true;
        let tokenLS = await app.getToken();
        await app.apiClient().updateQuestion(
        {
            token: tokenLS, 
            question: questions[key].question,
            question_type: questions[key].question_type,
            options: questions[key].options,
            correct: questions[key].correct,
            value: questions[key].value,
        }, 
        selectedExam.id, questions[key].id, handleApiResponseUpdateQuestion);
        setQuestions(_questions);
        //setQuestionSaved(true);
    }

    const handleInput = (text, key) => {
        const _questions = [...questions];
        _questions[key].question = text;
        setQuestions(_questions);
        
    }

    const handleSubmitEditQuestion = (key) => {
        const _questions = [...questions];
        _questions[key].saved_question = false;
        setQuestions(_questions);
    }

    const deleteHandler = async(key) => {
        let tokenLS = await app.getToken();
        await app.apiClient().deleteQuestion({token: tokenLS}, selectedExam.id, questions[key].id, handleApiResponseDeleteQuestion);
        const _questions = questions.filter((input,index) => index != key);
        setQuestions(_questions);
        //setQuestionSaved(true);
    }

    const addQuestion = async () => {
        let tokenLS = await app.getToken();
        await app.apiClient().createQuestion(
            {
                token: tokenLS,
                correct: 0,
                exam_id: selectedExam.id,
                id: 0,
                options: [],
                question: "",
                question_type: "written",
                value: 1
            }, selectedExam.id, handleApiResponseCreateQuestion);
    }

    const handleMultipleChoicePressed = (key) => {
        const _questions = [...questions];
        //_questions[key].is_multiple_choice = true;
        //_questions[key].is_written = false;
        _questions[key].question_type = "multiple_choice";
        setQuestions(_questions);
    }

    const handleSaveMC = () => {
        setFinishedMC(true);
    } 

    const handleMultipleChoiceOption = (key) => {
        const _questions = [...questions];
        _questions[key].options.push(questionMC);
        console.log("options:", _questions)
        setQuestions(_questions);
        setQuestionMC("");
    }

    const handleDevelopPressed = (key) => {
        const _questions = [...questions];
        //_questions[key].is_multiple_choice = false;
        setFinishedMC(false);
        setQuestionMC("");
        _questions[key].options = [];
        //_questions[key].is_written = true;
        _questions[key].question_type = "written";
        setQuestions(_questions);
    }

    const handleSubmitValue = (value, key) => {
        //setPoints(value);
        const _questions = [...questions];
        _questions[key].value = value;
        console.log("change value: ",value);
        setQuestions(_questions);
    }

    const handleSubmitChangeState = () => {
        console.log("[Edit Exam screen] state:", selectedExam.state); 
        if (selectedExam.state === "draft") {
            console.log("[Edit Exam screen] seteo en active"); 
            setSelectedExam({
                ...selectedExam,
                state: "active",
            });
        } else {
            console.log("[Edit Exam screen] seteo en draft"); 
            setSelectedExam({
                ...selectedExam,
                state: "draft",
            });
        }
    }

    const handleSubmitSave = async() => {
        let tokenLS = await app.getToken();
        var total_score = 0
        for (let question of inputs) {
            console.log("total scrore", total_score);
            total_score = total_score + +question.value;
        }
        await app.apiClient().updateExam(
            {
                token: tokenLS,
                state: selectedExam.state,
                max_score: total_score,
            }, 
        selectedExam.id, handleApiResponseUpdateExam);
        props.navigation.goBack();
    }

    useEffect(() => {
        console.log("[Edit Exam screen] entro a useEffect");
        onRefresh();
    }, []);

    useEffect(() => {
        console.log("[Edit Exam screen] entro a useEffect");
        if (selected === true){
            selectExam();
        }
    }, [selected]);

    return (
        <View style={styles.container}>
            <ScrollView>
                {selected === false && (
                    <>
                    {exams.length === 0 && (
                        <Text style={styles.examsText}>Create exams in this course to edit it's exams here.</Text>
                    )}
                    {exams.length != 0 && (
                        <Text style={styles.examsText}>Select the exam you want to edit:</Text>
                    )}
                    {exams.map(item => (
                            <TouchableOpacity
                                onPress={() => {handleSubmitselectExam(item)}}
                                style={styles.fadedButton}
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
                {selected === true && (
                    <>
                    <View style={styles.container}>
                        <Text style={styles.examTitle}>{selectedExam.name}</Text>
                        <View style={[styles.stateCardWrapper,
                            {
                                backgroundColor: selectedExam.state==="draft" ? "white": '#87ceeb',
                            }]}>
                            <View style={styles.examDescritpionWrapper}>
                                <TouchableOpacity
                                    onPress = {()=> {handleSubmitChangeState()}}
                                    style={styles.questionWrapper}
                                >
                                    <View style={styles.questionView}>
                                        <Text style={styles.examDescription}>State: {selectedExam.state}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {/* <Text style={styles.examDescription}>Max Points: {selectedExam.max_score}</Text> */}
                        </View>
                        {questions.map((item,key) => (
                            <>
                            {item.saved_question === true && (
                                <View style={styles.courseCardWrapper}>
                                    <TouchableOpacity
                                        onPress = {()=> {handleSubmitEditQuestion(key)}}
                                        style={styles.questionWrapper}
                                    >
                                        <View style={styles.questionView}>
                                            <Text numberOfLines={1} style={styles.examQuestion}>{item.question}</Text>
                                        </View>
                                        <MaterialIcons
                                            name="edit"
                                            size={20}
                                            color={'black'}
                                            style={styles.buttonEditIconRight}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                            {item.saved_question === false && (
                                <>
                                    <View style={styles.inputContainer}>
                                        <TextInput 
                                            placeholder={"Enter Question"}
                                            multiline = {true}
                                            value={item.question} 
                                            onChangeText={(text) => handleInput(text,key)}
                                            style={styles.input}
                                        />
                                        <View style={styles.buttonsRightWrapper}>
                                            <TouchableOpacity
                                                onPress = {() => {handleSaveQuestion(key)}}
                                                style={styles.buttonSaveIconRight}
                                            >
                                                <MaterialCommunityIcons
                                                    name="content-save"
                                                    size={20}
                                                    color={'black'}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                    onPress = {()=> {}}
                                                    style={[styles.buttonSaveIconRight]}
                                                >
                                                    <MaterialCommunityIcons
                                                        name="image-plus"
                                                        size={20}
                                                        color={'black'}
                                                    />
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                onPress = {()=> deleteHandler(key)}
                                                style={styles.buttonInputIcon}
                                            >
                                            {/*<Text style={styles.buttonDelete}>Delete</Text>*/}
                                                <MaterialCommunityIcons
                                                    name="trash-can-outline"
                                                    size={20}
                                                    color={'black'}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <Text style={styles.textAnswer}>Points:</Text>
                                    <TextInput 
                                        placeholder={`${item.value}`}
                                        value={item.value} 
                                        onChangeText={(text)=>handleSubmitValue(text.replace(/[^0-9]/g, ''),key)}
                                        style={[styles.input,{marginBottom:10}]}
                                    />
                                    <Text style={styles.textAnswer}>Answer</Text>
                                    <View style={styles.buttonInputWrapper}>
                                        <TouchableOpacity
                                            onPress = {()=> {handleMultipleChoicePressed(key)}}
                                            style={[styles.buttonInputIcon,{
                                                backgroundColor: item.question_type === "multiple_choice" ? "green" : "white"
                                            }]}
                                        >
                                            {/*<Text style={styles.buttonInputText}>Multiple Choice</Text>*/}
                                            <MaterialCommunityIcons
                                                name="format-list-numbered"
                                                size={20}
                                                color={'black'}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress = {()=> {handleDevelopPressed(key)}}
                                            style={[styles.buttonInputIcon,{
                                                backgroundColor: item.question_type === "written" ? "green" : "white"
                                            }]}
                                        >
                                        {/*<Text style={styles.buttonInputText}>Develop</Text>*/}
                                            <MaterialCommunityIcons
                                                name="text"
                                                size={20}
                                                color={'black'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {item.question_type === "written" && (
                                        <Text style={styles.choiceText}>The answer will be a free text response.</Text>
                                    )}
                                    {(item.question_type === "multiple_choice" && (!finishedMC)) && (
                                        <>
                                            <Text style={styles.choiceText}>The answer will be a multiple choice response.</Text>
                                            <Text style={styles.choiceText}>Fill the multiple answers:</Text>
                                            <View style={styles.wrapperOptionsInChoice}>
                                                <TextInput 
                                                placeholder={"Enter Option"}
                                                multiline = {true}
                                                value={questionMC} 
                                                onChangeText={(text) => setQuestionMC(text)}
                                                style={styles.input}
                                                />
                                                <TouchableOpacity
                                                    onPress = {() => {handleMultipleChoiceOption(key)}}
                                                    style={styles.buttonSaveIconRight}
                                                >
                                                    <MaterialCommunityIcons
                                                        name="check-bold"
                                                        size={20}
                                                        color={'black'}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.buttonSaveMC}>
                                                <TouchableOpacity
                                                    onPress={() => {handleSaveMC()}}
                                                    style={[styles.button,
                                                        {
                                                            backgroundColor:`#87ceeb`, 
                                                            width:'70%',
                                                        }]}
                                                >
                                                    <Text style={styles.buttonText}>Save Multiple Choice</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </>
                                    )}
                                    {(item.question_type === "multiple_choice" && (finishedMC)) && (
                                        <>
                                            <Text style={styles.choiceText}>Options filled, choose the right answer:</Text>
                                            <SelectDropdown
                                                data={item.options}
                                                onSelect={(selectedItem, index) => {setCorrect(key, index)}}
                                                defaultButtonText={"Select the correct answer"}
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
                                </>
                            )}
                            </>
                        ))}
                    </View>
                    <View style={[styles.container, {paddingTop: 0}]}>
                        <View style={[styles.courseCardWrapper, {backgroundColor: '#87ceeb', justifyContent: 'center'}]}>
                            <TouchableOpacity
                                onPress = {()=> {addQuestion()}}
                                style={styles.questionWrapper}
                            >
                                <View style={styles.addQuestionView}>
                                    <Text style={styles.buttonText}>Add Question</Text>
                                    <Feather
                                        name="plus"
                                        size={20}
                                        color={'white'}
                                        style={styles.buttonEditIconRight}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    </>
                )}
            </ScrollView>
            {selected === true && (
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity
                        onPress={() => {handleSubmitSave()}}
                        style={[styles.button,{backgroundColor:`#87ceeb`}]}
                    >
                        <Text style={styles.buttonText}>Save Exam</Text>
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
        //width:'90%',
        //paddingTop: 25,
        //paddingLeft: 15,
    },
    questionView: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    addQuestionView: {
        flexDirection: 'row',
    },
    fadedButton: {
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
    examTitle: {
        color:'#87ceeb',
        fontWeight: '700',
        fontSize: 24,
    },
    examsText: {
        marginTop: 15,
        fontWeight: '300',
        fontSize: 16,
        paddingBottom: 5,
        marginLeft: 5,
    },
    examDescritpionWrapper: {
        //marginTop:5,
        justifyContent: 'center',
    },
    examDescription: {
        color:'black',
        fontWeight: '400',
        fontSize: 16,
        //marginTop:5,
    },
    examQuestion: {
        color:'black',
        fontWeight: '400',
        fontSize: 16,
        marginTop:5,
        width:250,
    },
    courseCardWrapper: {
        backgroundColor: 'white',
        width: 320,
        borderRadius: 25,
        paddingVertical: 8,
        paddingLeft: 20,
        marginTop: 10,
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
    buttonEditIconRight: {
        marginLeft: 10,
    },
    questionWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonWrapper: {
        marginBottom: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: `#87ceeb`,
        width: '45%',
        padding: 15,
        borderRadius: 30,
        marginHorizontal: 10,
    },
    buttonText: {
        color:'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonSaveMC: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
    },
    inputsContainer: {
        //flex: 1, 
        //marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
    },
    wrapperOptionsInChoice: {
        flexDirection: 'row',
    },
    input: {
        width:'80%',
        backgroundColor:'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        textAlignVertical: 'top'
    },
    inputName: {
        width:'80%',
        backgroundColor:'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 15,
        
    },
    buttonDelete: {
        color: "red",
        fontSize: 16,
        fontWeight: '400',
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginTop: 5,
    },
    buttonInputWrapper: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        //marginHorizontal: 10,
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
    buttonSaveIconRight: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        backgroundColor: `#87ceeb`,
        padding: 10,
        borderRadius: 10,
        marginRight: 5,
        marginHorizontal: 20,
    },
    buttonInput: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `#87ceeb`,
        width: '45%',
        padding: 10,
        borderRadius: 10,
        marginRight: 5,
    },
    buttonInputText: {
        color:'white',
        fontWeight: '400',
        fontSize: 16,
    },
    buttonsRightWrapper: {
        flexDirection: 'column',
        //alignItems: 'center',
        //justifyContent: 'center',
    },
    textAnswer: {
        fontWeight: '700',
        fontSize: 16,
        paddingBottom: 5,
    },
    choiceText: {
        fontWeight: '300',
        fontSize: 16,
        paddingTop: 5,
    },
    buttonName: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `#87ceeb`,
        width: '45%',
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 10,
        
    },
    nameWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        //flexDirection: 'column',
        paddingVertical: 15,
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

export default EditExamScreen;
