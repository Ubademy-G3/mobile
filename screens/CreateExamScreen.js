import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView, TextInput, Alert, KeyboardAvoidingView } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { app } from '../app/app';
import Feather from 'react-native-vector-icons/Feather'
import NumberPlease from "react-native-number-please";

Feather.loadFont();
MaterialCommunityIcons.loadFont();
MaterialIcons.loadFont();

const CreateExamScreen = (props) => {

    const param_course_id = props.route.params ? props.route.params.id : 'defaultID';

    const [nameSaved, setNameSaved] = useState(false);

    const [questionSaved, setQuestionSaved] = useState(false);
    
    const [questionMC, setQuestionMC] = useState("");

    const [finishedMC, setFinishedMC] = useState(false);

    /*const initialValues = [{ id: "points", value: 1 }];
    
    const [points, setPoints] = useState(initialValues);
    
    const valueNumbers = [{ id: "points", min: 1, max: 100 }];*/

    const [inputs, setInputs] = useState([{
        id: "", 
        question: "",
        question_saved: false,
        is_written: false,
        is_media: false,
        is_multiple_choice: false,
        question_type: "",
        options: [],
        correct: 0,
        value: 1,
    }]);

    const [exam, setExam] = useState({
        id: "",
        name: "",
        course_id: "",
        state: "draft",
        max_score: 0,
        has_multiple_choice: false,
        has_written: false,
        has_media: false,
        max_attempts: 1
    });

    //const [showButtons, setShowButtons] = useState(true);

    const handleResponseUpdateExam = (response) => {
        console.log("[Create Exam screen] update: ", response.content())
        if (!response.hasError()) {
            setExam(response.content());
            console.log("[Create Exam screen] courses: ", exam);
        } else {
            console.log("[Create Exam screen] error", response.content().message);
        }
    }

    const handleApiResponseCreateExam = (response) => {
        console.log("[Create Exam screen] content: ", response.content())
        if (!response.hasError()) {
            setExam(response.content());
            setNameSaved(true);
            console.log("[Create Exam screen] courses: ", exam);
        } else {
            console.log("[Create Exam screen] error", response.content().message);
        }
    }

    const handleApiResponseUpdateQuestion = (response) => {
        console.log("[Create Exam screen] update: ", response.content())
        if (!response.hasError()) {
            console.log("[Create Exam screen] courses: ", exam);
        } else {
            console.log("[Create Exam screen] error", response.content().message);
        }
    }

    const handleApiResponseDeleteQuestion = (response) => {
        console.log("[Create Exam screen] delete question: ", response.content())
        if (!response.hasError()) {
        } else {
            console.log("[Create Exam screen] error", response.content().message);
        }        
    }

    const handleApiResponseCreateQuestion = (response) => {
        console.log("[Create Exam screen] content: ", response.content())
        if (!response.hasError()) {
            setInputs(inputs => [...inputs, {
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
            console.log("[Create Exam screen] response sucessfull");
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
        /* const _inputs = [...inputs];
        _inputs.push({
            key: '',
            question: "",
            question_saved: false,
            is_written: false,
            is_media: false,
            is_multiple_choice: false,
            question_type: "",
            options: [],
            correct: 0,
            value: 1,
        });
        setInputs(_inputs); */
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
        //_inputs[key].key = key;
        setInputs(_inputs);
        setQuestionSaved(false);
    }

    const handleSubmitEditQuestion = (key) => {
        const _inputs = [...inputs];
        _inputs[key].question_saved = false;
        setFinishedMC(false);
        setInputs(_inputs);
    }

    const handleMultipleChoicePressed = (key) => {
        const _inputs = [...inputs];
        //_inputs[key].is_multiple_choice = true;
        _inputs[key].question_type = "multiple_choice";
        setFinishedMC(false);
        setInputs(_inputs);
    }

    const handleDevelopPressed = (key) => {
        const _inputs = [...inputs];
        setFinishedMC(false);
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
        //llamar al back y guardar la pregunta
        /* await app.apiClient().createQuestion(
            {
                token: tokenLS, 
                exam_id: exam.id,
                question: inputs[key].question,
                question_type: inputs[key].question_type,
                options: inputs[key].options,
                correct: inputs[key].correct,
                value: inputs[key].value,
            }, exam.id, handleApiResponseCreateQuestion); */
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
        setInputs(_inputs);
        setQuestionSaved(true);
    }

    const handleMultipleChoiceOption = (key) => {
        const _inputs = [...inputs];
        _inputs[key].options.push(questionMC);
        console.log("options:", _inputs)
        setInputs(_inputs);
        setQuestionMC("");
    }

    const handleSaveMC = () => {
        setFinishedMC(true);
    } 

    const handleSubmitValue = (value, key) => {
        //setPoints(value);
        const _inputs = [...inputs];
        _inputs[key].value = value;
        console.log("change value: ",value);
        setInputs(_inputs);
    }

    const setCorrect = (key, idx) => {
        const _inputs = [...inputs];
        _inputs[key].correct = idx;
        setInputs(_inputs);
    }

    const saveExam = async () => {
        let tokenLS = await app.getToken();
        var total_score = 0
        for (let question of inputs) {
            console.log("total scrore", total_score);
            total_score = total_score + +question.value;
        }
        console.log("total scrore final", total_score);
        await app.apiClient().updateExam(
            {
                token: tokenLS,
                name: exam.name,
                max_score: total_score,
                max_attempts: exam.max_attempts

            }, exam.id, handleResponseUpdateExam)
        /*Alert.alert(
            "Exam saved.",
            [
              { text: "OK", onPress: () => {} }
            ]
        );*/
        props.navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.inputsContainer}>
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
                                    {/* <View>
                                        <Text>Points assigned to this question</Text>
                                        <NumberPlease
                                            digits={valueNumbers}
                                            values={points}
                                            onChange={(values) => handleSubmitValue(key, values)}
                                            pickerStyle={styles.numberPicker}
                                        />
                                    </View> */}
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
                                                backgroundColor: input.question_type === "written" ? "green" : "white"
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
                                    {input.question_type === "written" && (
                                        <Text style={styles.choiceText}>The answer will be a free text response.</Text>
                                    )}
                                    {(input.question_type === "multiple_choice" && (!finishedMC)) && (
                                        <>
                                            <Text style={styles.choiceText}>The answer will be a multiple choice response.</Text>
                                            <Text style={styles.choiceText}>Fill the multiple answers:</Text>
                                            <View style={styles.wrapperOptionsInChoice}>
                                                {/* <KeyboardAvoidingView> */}
                                                    <TextInput 
                                                    placeholder={"Enter Option"}
                                                    multiline = {true}
                                                    value={questionMC} 
                                                    onChangeText={(text)=>setQuestionMC(text)}
                                                    style={styles.input}
                                                    />
                                                {/* </KeyboardAvoidingView> */}
                                                {/*<View style={styles.buttonsRightWrapper}>*/}
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
                                                {/*</View>*/}
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
                                                    {/*<MaterialCommunityIcons
                                                        name="check-bold"
                                                        size={20}
                                                        color={'black'}
                                                    />*/}
                                                    <Text style={styles.buttonText}>Save Multiple Choice</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </>
                                    )}
                                    {(input.question_type === "multiple_choice" && (finishedMC)) && (
                                        <>
                                            <Text style={styles.choiceText}>Options filled, choose the right answer:</Text>
                                            <SelectDropdown
                                                data={input.options}
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
                    <View style={[styles.container, {paddingTop: 0}]}>
                        <View style={[styles.courseCardWrapper, {backgroundColor: '#87ceeb', justifyContent: 'center'}]}>
                            <TouchableOpacity
                                onPress = {()=> {addHandler()}}
                                disabled={!questionSaved}
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
            { nameSaved && (
                <View style={styles.buttonWrapper}>
                    {/* <TouchableOpacity
                        onPress={() => {addHandler()}}
                        disabled={!questionSaved}
                        style={[styles.button, 
                            {
                                backgroundColor: questionSaved ? `#87ceeb` : `#d3d3d3`,
                                //marginLeft: item.id === '1' ? 5 : 0,
                            }
                        ]}
                    >
                        <Text style={styles.buttonText}>Add Question</Text>
                    </TouchableOpacity> */}
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
        //backgroundColor: `#87ceeb`,
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
})

export default CreateExamScreen;
