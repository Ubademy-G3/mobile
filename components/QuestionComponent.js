import React, {Component, useEffect, useState, useCallback} from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, HelperText, Alert, ActivityIndicator } from 'react-native';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import Feather from 'react-native-vector-icons/Feather';
import SelectDropdown from 'react-native-select-dropdown'

Feather.loadFont();

const QuestionComponent = ({ item }) => {

    console.log("item:", item);

    const [loading, setLoading] = useState(false);

    const [answer, setAnswer] = useState({
        answer: "",
        question_template_id: item.id
    });

    const [optionsMC, setOptionsMC] = useState(item.options);

    const [selectedMC, setSelectedMC] = useState(0);

    return(
        <TouchableOpacity
        key={item.id}
        onPress={() => {}}
        style={styles.container}
        >
            <View>
                <Text style={styles.questionText}>{item.question}</Text>
                {item.question_type === "written" && (
                    <>
                        <TextInput
                            placeholder="Write your answer"
                            multiline = {true}
                            onChangeText={text => setAnswer({
                                ...answer,
                                answer: text})}
                            value={answer.answer}
                            style={styles.input}
                        />
                    </>
                )}
                {item.question_type === "multiple_choice" && (
                    <>
                        <SelectDropdown
                            data={optionsMC}
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
                    </>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 10,
        marginTop: 10,
        marginRight: 10,
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
})

export default QuestionComponent;