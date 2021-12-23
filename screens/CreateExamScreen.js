import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Modal, Pressable } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { app } from '../app/app';
import Feather from 'react-native-vector-icons/Feather';

Feather.loadFont();
MaterialCommunityIcons.loadFont();
MaterialIcons.loadFont();

const CreateExamScreen = (props) => {

    const param_course_id = props.route.params ? props.route.params.id : 'defaultID';
    const [modalVisible, setModalVisible] = useState(false);
    const [nameSaved, setNameSaved] = useState(false);
    const [questionSaved, setQuestionSaved] = useState(true);
    const [questionMC, setQuestionMC] = useState("");
    const [inputs, setInputs] = useState([]);
    const [exam, setExam] = useState({
        id: "",
        name: "",
        course_id: "",
        state: "draft",
        max_score: 0,
        has_multiple_choice: false,
        has_written: false,
        has_media: false,
        max_attempts: 1,
        approval_score: 0,
    });

    const handleResponseUpdateExam = (response) => {
        if (!response.hasError()) {
            setExam(response.content());
        } else {
            console.log("[Create Exam screen] error", response.content().message);
        }
    }

    const handleApiResponseCreateExam = (response) => {
        if (!response.hasError()) {
            setExam({
                id: response.content().id,
                name: response.content().name,
                course_id: response.content().course_id,
                state: response.content().state,
                max_score: 0,
                has_multiple_choice: false,
                has_written: false,
                has_media: false,
                max_attempts: response.content().max_attempts,
                approval_score: 0,
            });
            setNameSaved(true);
        } else {
            console.log("[Create Exam screen] error", response.content().message);
        }
    }

    const handleApiResponseUpdateQuestion = (response) => {
        if (!response.hasError()) {
            console.log("[Create Exam screen] ok");
        } else {
            console.log("[Create Exam screen] error", response.content().message);
        }
    }

    const handleApiResponseDeleteQuestion = (response) => {
        if (!response.hasError()) {
            console.log("[Create Exam screen] ok");
        } else {
            console.log("[Create Exam screen] error", response.content().message);
        }        
    }

    const handleApiResponseCreateQuestion = (response) => {
        if (!response.hasError()) {
            setInputs(inputs => [...inputs, {
                id: response.content().id,
                question_saved: false,
                correct: response.content().correct,
                exam_id: response.content().exam_id,
                id: response.content().id,
                options: response.content().options,
                question: response.content().question,
                question_type: response.content().question_type,
                value: response.content().value,
            }]);
        } else {
            console.log("[Create Exam screen] error", response.content().message);
        }
    }

    const addHandler = async () => {
        let tokenLS = await app.getToken();
        await app.apiClient().createQuestion(
            {
                token: tokenLS, 
                exam_id: exam.id,
                id: 0,
                question: "",
                question_type: "written",
                options: [],
                correct: 0,
                value: 1,
            }, exam.id, handleApiResponseCreateQuestion);
        setQuestionSaved(false);
    }
    
    const deleteHandler = async (key) => {
        let tokenLS = await app.getToken();
        await app.apiClient().deleteQuestion({token: tokenLS}, exam.id, inputs[key].id, handleApiResponseDeleteQuestion);
        const _inputs = inputs.filter((input,index) => index != key);
        setInputs(_inputs);
        setQuestionSaved(true);
    }

    const inputHandler = (text, key) => {
        const _inputs = [...inputs];
        _inputs[key].question = text;
        setInputs(_inputs);
        setQuestionSaved(false);
    }

    const handleSubmitEditQuestion = (key) => {
        const _inputs = [...inputs];
        _inputs[key].question_saved = false;
        setInputs(_inputs);
    }

    const handleMultipleChoicePressed = (key) => {
        const _inputs = [...inputs];
        _inputs[key].question_type = "multiple_choice";
        setInputs(_inputs);
    }

    const handleDevelopPressed = (key) => {
        const _inputs = [...inputs];
        setQuestionMC("");
        _inputs[key].options = [];
        _inputs[key].question_type = "written";
        setInputs(_inputs);
    }

    const handleSaveName = async () => {
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        await app.apiClient().createExam(
            {
                token: tokenLS,
                name: exam.name,
                course_id: param_course_id,
                creator_id: idLS,
            }, handleApiResponseCreateExam);
        
    }

    const handleSaveQuestion = async (key) => {
        const _inputs = [...inputs]; 
        _inputs[key].question_saved = true;
        let tokenLS = await app.getToken();
        await app.apiClient().updateQuestion(
        {
            token: tokenLS, 
            question: inputs[key].question,
            question_type: inputs[key].question_type,
            options: inputs[key].options,
            correct: inputs[key].correct,
            value: inputs[key].value,
        }, 
        exam.id, inputs[key].id, handleApiResponseUpdateQuestion);
        var total_score = exam.max_score + +_inputs[key].value;
        setExam({...exam, max_score: total_score});
        setInputs(_inputs);
        setQuestionSaved(true);
    }

    const handleMultipleChoiceOption = (key) => {
        const _inputs = [...inputs];
        _inputs[key].options.push(questionMC);
        setInputs(_inputs);
        setQuestionMC("");
    }
    const handleSubmitValue = (value, key) => {
        const _inputs = [...inputs];
        _inputs[key].value = value;
        setInputs(_inputs);
    }
    
    const handleSubmitApprovalScore = (value) => {
        setExam({...exam, approval_score: value});
    }

    const saveExam = async () => {
        let tokenLS = await app.getToken();
        await app.apiClient().updateExam(
            {
                token: tokenLS,
                name: exam.name,
                max_score: exam.max_score,
                max_attempts: exam.max_attempts,
                approval_score: exam.approval_score,

            }, exam.id, handleResponseUpdateExam)
        setModalVisible(true);
    }

    return (
        <View style={styles.centeredView}>
            {modalVisible && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                    setModalVisible(!modalVisible);
                    }}
                >
                    <View style={[styles.centeredView, {justifyContent: "center", alignItems: "center"}]}>
                        <View style={styles.modalView}>
                            <View style={{ display:'flex', flexDirection: 'row' }}>
                                <MaterialCommunityIcons
                                    name="check-circle-outline"
                                    size={30}
                                    color={"#9acd32"}
                                    style={{ position: 'absolute', top: -6, left: -35}}
                                />
                                <Text style={styles.modalText}>Success:</Text>
                            </View>
                            <Text style={styles.modalText}>Exam saved!</Text>
                            <Pressable
                            style={[styles.buttonModal, styles.buttonClose]}
                            onPress={() => {
                                props.navigation.goBack(); 
                                setModalVisible(!modalVisible)}}
                            >
                                <Text style={styles.textStyle}>Ok</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            )}
            <ScrollView style={styles.inputsContainer}>
                <KeyboardAvoidingView
                    style={styles.containerWrapper}
                    behavior={Platform.OS === "ios" ? "padding" : "padding"}
                > 
                { !nameSaved && (
                    <View style={styles.nameWrapper}>
                        <TextInput 
                            placeholder={"Exam name"}
                            value={exam.name} 
                            onChangeText={(text) => setExam({
                                ...exam,
                                name: text,
                            })}
                            style={styles.inputName}
                        />
                        <TouchableOpacity
                            onPress = {()=> {handleSaveName()}}
                            style={styles.buttonName}
                        >
                            <Text style={styles.buttonInputText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                )}
                { nameSaved && (
                    <>
                    <Text style={[styles.textAnswer, {color:'#87ceeb', marginTop: 5},]}>Maximum points: {exam.max_score}</Text>
                    <Text style={styles.textAnswer}>Points needed to approve:</Text>
                    <TextInput 
                        placeholder={"Points needed to approve"}
                        value={exam.approval_score} 
                        onChangeText={(text) => handleSubmitApprovalScore(text.replace(/[^0-9]/g, ''))}
                        style={[styles.input,{marginBottom:10}]}
                    />
                    {inputs.map((input, key)=>(
                        <>
                            { !input.question_saved && (
                                <>
                                    <View style={styles.inputContainer}>
                                            <TextInput 
                                                placeholder={"Enter Question"}
                                                multiline = {true}
                                                value={input.question} 
                                                onChangeText={(text)=>inputHandler(text,key)}
                                                style={styles.input}
                                            />
                                        <View style={styles.buttonsRightWrapper}>
                                            <TouchableOpacity
                                                onPress = {()=> {handleSaveQuestion(key)}}
                                                style={styles.buttonSaveIconRight}
                                            >
                                                <MaterialCommunityIcons
                                                    name="content-save"
                                                    size={20}
                                                    color={'black'}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                            onPress = {()=> deleteHandler(key)}
                                            style={styles.buttonInputIcon}
                                        >
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
                                            placeholder={"Points assigned to this question"}
                                            value={input.value} 
                                            onChangeText={(text) => handleSubmitValue(text.replace(/[^0-9]/g, ''),key)}
                                            style={[styles.input,{marginBottom:10}]}
                                        />
                                    <Text style={styles.textAnswer}>Answer</Text>
                                    <View style={styles.buttonInputWrapper}>
                                        <TouchableOpacity
                                            onPress = {()=> {handleMultipleChoicePressed(key)}}
                                            style={[styles.buttonInputIcon,{
                                                backgroundColor: input.question_type === "multiple_choice" ? "green" : "white"
                                            }]}
                                        >
                                            <MaterialCommunityIcons
                                                name="format-list-numbered"
                                                size={20}
                                                color={'black'}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress = {()=> {handleDevelopPressed(key)}}
                                            style={[styles.buttonInputIcon,{
                                                backgroundColor: input.question_type === "written" ? "green" : "white"
                                            }]}
                                        >
                                            <MaterialCommunityIcons
                                                name="text"
                                                size={20}
                                                color={'black'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {input.question_type === "written" && (
                                        <Text style={styles.choiceText}>The answer will be a free text response.</Text>
                                    )}
                                    {input.question_type === "multiple_choice" && (
                                        <>
                                            <Text style={styles.choiceText}>The answer will be a multiple choice response.</Text>
                                            <Text style={styles.choiceText}>Fill the multiple answers:</Text>
                                            <View style={styles.wrapperOptionsInChoice}>
                                                    <TextInput 
                                                    placeholder={"Enter Option"}
                                                    multiline = {true}
                                                    value={questionMC} 
                                                    onChangeText={(text)=>setQuestionMC(text)}
                                                    style={styles.input}
                                                    />
                                                <TouchableOpacity
                                                    onPress = {()=> {handleMultipleChoiceOption(key)}}
                                                    style={styles.buttonSaveIconRight}
                                                >
                                                    <MaterialCommunityIcons
                                                        name="check-bold"
                                                        size={20}
                                                        color={'black'}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </>
                                    )}
                                </>
                            )}
                            { input.question_saved && (
                                <>
                                <View style={styles.courseCardWrapper}>
                                    <TouchableOpacity
                                        onPress = {()=> {handleSubmitEditQuestion(key)}}
                                        style={styles.questionWrapper}
                                    >
                                        <View style={styles.questionView}>
                                            <Text numberOfLines={1} style={styles.examQuestion}>{input.question}</Text>
                                        </View>
                                        <MaterialIcons
                                            name="edit"
                                            size={20}
                                            color={'black'}
                                            style={styles.buttonEditIconRight}
                                        />
                                    </TouchableOpacity>
                                </View>
                                </>
                            )}
                        </>
                    ))}
                    {questionSaved && (
                    <View style={[styles.container, {paddingTop: 0}]}>
                        <View style={[styles.courseCardWrapper, {backgroundColor: '#87ceeb', justifyContent: 'center'}]}>
                            <TouchableOpacity
                                onPress = {()=> {addHandler()}}
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
                    )}
                    </>
                )}
                </KeyboardAvoidingView>
            </ScrollView>
            { nameSaved && (
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity
                        onPress={() => {saveExam()}}
                        style={[styles.button,{backgroundColor:`#87ceeb`}]}
                    >
                        <Text style={styles.buttonText}>Save Exam</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15, 
    },
    containerWrapper: {
        flex: 1,
    },
    numberPicker: {
        width: 50,
        height: 5,
        marginLeft: 10,
    },
    addQuestionView: {
        flexDirection: 'row',
    },
    buttonWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
        padding: 15,
        borderRadius: 10,
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
        padding: 15,
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
    },
    textAnswer: {
        fontWeight: '700',
        fontSize: 16,
        paddingBottom: 5,
    },
    choiceText: {
        fontWeight: '300',
        fontSize: 16,
        paddingBottom: 5,
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
        flex: 1, 
        flexWrap: 'wrap',
        flexDirection: "row",
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
    questionWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    examQuestion: {
        color:'black',
        fontWeight: '400',
        fontSize: 16,
        marginTop:5,
        width:250,
    },
    questionView: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonEditIconRight: {
        marginLeft: 10,
    },
    stateCardWrapper: {
        backgroundColor: '#87ceeb',
        width: 200,
        borderRadius: 25,
        paddingVertical: 8,
        marginBottom: 5,
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    examDescription: {
        color:'black',
        fontWeight: '400',
        fontSize: 16,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    buttonModal: {
        borderRadius: 20,
        paddingHorizontal: 40,
        paddingVertical: 15,
        elevation: 2
    },
    buttonClose: {
        backgroundColor: "#9acd32",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    centeredView: {
        flex: 1,
    },
})

export default CreateExamScreen;
