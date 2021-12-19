import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView, TextInput } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { app } from '../app/app';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SelectDropdown from 'react-native-select-dropdown';

Feather.loadFont();
MaterialCommunityIcons.loadFont();
MaterialIcons.loadFont();

const EditExamScreen = (props) => {
    const param_exam_id = props.route.params ? props.route.params.exam_id : 'defaultID';
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [questionMC, setQuestionMC] = useState("");
    const [finishedMC, setFinishedMC] = useState(false);
    const [initialState, setInitialState] = useState("");
    const [selectedExam, setSelectedExam] = useState({
        id: 0,
        has_media: false,
        has_multiple_choice: false,
        has_written: false,
        max_attempts: 1,
        max_score: 10,
        name: "",
        state: "",
        approval_score: 0,
    });

    const handleApiResponseUpdateExam = (response) => {
        console.log("[Edit Exam screen] update exam: ", response.content())
        if (!response.hasError()) {
        } else {
            console.log("[Edit Exam screen] error", response.content().message);
        }        
    }

    const handleResponseGetExam = (response) => {
        console.log("[Edit Exam screen] get exam: ", response.content())
        if (!response.hasError()) {
            setSelectedExam({
                id: response.content().id,
                name: response.content().name,
                course_id: response.content().course_id,
                state: response.content().state,
                max_score: response.content().max_score,
                has_multiple_choice: response.content().has_multiple_choice,
                has_written: response.content().has_written,
                has_media: response.content().has_media,
                max_attempts: response.content().max_attempts,
                approval_score: response.content().approval_score,
            });
            setInitialState(response.content().state);
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

    const selectExam = async () => {
        console.log("[Edit Exam screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        console.log("[Edit Exam screen] token:", tokenLS); 
        await app.apiClient().getExamsById({token: tokenLS}, param_exam_id, handleResponseGetExam);
        await app.apiClient().getAllQuestionsByExamId({token: tokenLS}, param_exam_id, handleResponseGetAllQuestions);
        setLoading(false);
    };

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
        setFinishedMC(false);
        setQuestionMC("");
        _questions[key].options = [];
        _questions[key].question_type = "written";
        setQuestions(_questions);
    }

    const handleSubmitValue = (value, key) => {
        const _questions = [...questions];
        _questions[key].value = value;
        console.log("change value: ",value);
        setQuestions(_questions);
    }

    const handleSubmitApprovalScore = (value) => {
        const tmp = selectedExam;
        tmp.approval_score = value;
        setSelectedExam(tmp);
    }

    const handleSubmitChangeState = () => {
        console.log("[Edit Exam screen] state:", selectedExam.state); 
        if (initialState === "draft") {
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
        } else if (initialState === "active") {
            if (selectedExam.state === "inactive") {
                console.log("[Edit Exam screen] seteo en active"); 
                setSelectedExam({
                    ...selectedExam,
                    state: "active",
                });
            } else {
                console.log("[Edit Exam screen] seteo en inactive"); 
                setSelectedExam({
                    ...selectedExam,
                    state: "inactive",
                });
            }
        } else if (initialState === 'inactive') {
            if (selectedExam.state === 'active') {
                console.log("[Edit Exam screen] seteo en inactive"); 
                setSelectedExam({
                    ...selectedExam,
                    state: "inactive",
                });
            } else {
                console.log("[Edit Exam screen] seteo en active"); 
                setSelectedExam({
                    ...selectedExam,
                    state: "active",
                });
            }
        }
    }

    const handleSubmitSave = async() => {
        let tokenLS = await app.getToken();
        var total_score = 0
        for (let question of questions) {
            console.log("total scrore", total_score);
            total_score = total_score + +question.value;
        }
        await app.apiClient().updateExam(
            {
                token: tokenLS,
                state: selectedExam.state,
                max_score: total_score,
                approval_score: selectedExam.approval_score,

            }, 
        selectedExam.id, handleApiResponseUpdateExam);
        props.navigation.goBack();
    }

    useEffect(() => {
        selectExam();
    }, []);

    const setCorrect = (key, idx) => {
        const _inputs = [...questions];
        _inputs[key].correct = idx;
        console.log(_inputs);
        setQuestions(_inputs);
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <>
                <View style={styles.container}>
                    <Text style={styles.examTitle}>{selectedExam.name}</Text>
                    <View style={[styles.stateCardWrapper,
                        {
                            backgroundColor: selectedExam.state==="active" ? '#87ceeb': "white",
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
                    </View>
                    {selectedExam.state === "active" && (
                        <Text style={styles.examDescription}>This exam is published and the students can resolve it.</Text>
                    )}
                    {selectedExam.state === "inactive" && (
                        <Text style={styles.examDescription}>This exam is inactive and the students can't resolve it.</Text>
                    )}
                    {selectedExam.state === "draft" && (
                        <>
                        <Text style={[styles.textAnswer, {color:'#87ceeb', marginTop: 5},]}>Maximum points: {selectedExam.max_score}</Text>
                        <Text style={styles.textAnswer}>Points needed to approve:</Text>
                        <TextInput 
                            placeholder={`${selectedExam.approval_score}`}
                            value={selectedExam.approval_score} 
                            onChangeText={(text) => handleSubmitApprovalScore(text.replace(/[^0-9]/g, ''))}
                            style={[styles.input,{marginBottom:10}]}
                        />
                        {questions.map((item,key) => (
                            <>
                            {item.saved_question === true && (
                                <View style={styles.courseCardWrapper} key={item.id}>
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
                        </>
                    )}
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
            </ScrollView>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity
                    onPress={() => {handleSubmitSave()}}
                    style={[styles.button,{backgroundColor:`#87ceeb`}]}
                >
                    <Text style={styles.buttonText}>Save Exam</Text>
                </TouchableOpacity>
            </View>
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
