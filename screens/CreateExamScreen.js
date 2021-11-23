import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView, TextInput } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { app } from '../app/app';
import Feather from 'react-native-vector-icons/Feather'

Feather.loadFont();
MaterialCommunityIcons.loadFont();

const CreateExamScreen = (props) => {

    const param_course_id = props.route.params ? props.route.params.id : '278f684b-69e2-4ad2-9d23-b64f971cf874';

    const [nameSaved, setNameSaved] = useState(true);

    const [questionSaved, setQuestionSaved] = useState(false);
    
    const [questionMC, setQuestionMC] = useState("");

    const [finishedMC, setFinishedMC] = useState(false);

    const [inputs, setInputs] = useState([{
        key: '', 
        /*value: '', 
        showButtons: true,*/
        question: "",
        is_written: false,
        is_media: false,
        is_multiple_choice: false,
        options: [],
        correct: 0,
        value: 0,
    }]);

    const [exam, setExam] = useState({
        id: "",
        name: "",
        course_id: "",
        active: "",
    });

    //const [showButtons, setShowButtons] = useState(true);

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

    const addHandler = () => {
        const _inputs = [...inputs];
        _inputs.push({
            key: '',
            question: "",
            is_written: false,
            is_media: false,
            is_multiple_choice: false,
            options: [],
            correct: 0,
            value: 0,
        });
        setInputs(_inputs);
        setQuestionSaved(false);
    }
    
    const deleteHandler = (key) => {
        //chequear si la pregunta estaba guardada hay que borrarla en el back tambien
        const _inputs = inputs.filter((input,index) => index != key);
        setInputs(_inputs);
        setQuestionSaved(true);
    }

    const inputHandler = (text, key) => {
        const _inputs = [...inputs];
        _inputs[key].question = text;
        _inputs[key].key   = key;
        setInputs(_inputs);
        
    }

    const handleMultipleChoicePressed = (key) => {
        const _inputs = [...inputs];
        _inputs[key].is_multiple_choice = true;
        setInputs(_inputs);
    }

    const handleDevelopPressed = (key) => {
        const _inputs = [...inputs];
        _inputs[key].is_written = true;
        setInputs(_inputs);
    }

    const handleSaveName = async () => {
        let tokenLS = await app.getToken();
        await app.apiClient().createExam({token: tokenLS, name: exam.name, course_id: param_course_id}, handleApiResponseCreateExam);
    }

    const handleSaveQuestion = () => {
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
                                        onPress = {()=> {handleSaveQuestion()}}
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
                            <Text style={styles.textAnswer}>Answer</Text>
                            {!(input.is_multiple_choice || input.is_written )&& (
                                <View style={styles.buttonInputWrapper}>
                                    <TouchableOpacity
                                        onPress = {()=> {handleMultipleChoicePressed(key)}}
                                        style={styles.buttonInputIcon}
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
                                        style={styles.buttonInputIcon}
                                    >
                                    {/*<Text style={styles.buttonInputText}>Develop</Text>*/}
                                        <MaterialCommunityIcons
                                            name="text"
                                            size={20}
                                            color={'black'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                            {input.is_written && (
                                <Text style={styles.choiceText}>The answer will be a free text response.</Text>
                            )}
                            {(input.is_multiple_choice && (!finishedMC)) && (
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
                                        <View style={styles.buttonsRightWrapper}>
                                            <TouchableOpacity
                                                onPress = {()=> {handleMultipleChoiceOption(key)}}
                                                style={styles.buttonSaveIconRight}
                                            >
                                                <MaterialCommunityIcons
                                                    name="content-save"
                                                    size={20}
                                                    color={'black'}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => {handleSaveMC()}}
                                                style={styles.buttonSaveIconRight}
                                            >
                                                <MaterialCommunityIcons
                                                    name="check-bold"
                                                    size={20}
                                                    color={'black'}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </>
                            )}
                            {finishedMC && (
                                <>
                                    <Text style={styles.choiceText}>Options filled, choose the right answer:</Text>
                                    <SelectDropdown
                                        data={input.options}
                                        onSelect={(selectedItem, index) => setInputs({
                                            ...inputs,
                                            correct: index,
                                        })}
                                        value={inputs.correct}
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
                    ))}
                    </>
                )}
            </ScrollView>
            { nameSaved && (
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity
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
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {}}
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
})

export default CreateExamScreen;
