import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

const MyExamsScreen = (props) => {
    const courseId = props.route.params.course_id;
    const rol = props.route.params.view_as;
    const exams = props.route.params.exams;

    return (
        <>
            {rol !== 'student' && (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    {rol === "instructor" && (
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.navigate('My Exam Templates', {
                            course_id: courseId,
                            view_as: rol
                        });}}
                        style={[styles.button, styles.buttonOutlined, {marginBottom: 10,}]}
                    >
                        <Text style={styles.buttonOutlineText}>Exam Templates</Text>
                    </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.navigate('Solved Exams', {
                            course_id: courseId,
                            view_as: rol
                        });}}
                        style={[styles.button, styles.buttonOutlined, {marginBottom: 10,}]}
                    >
                        <Text style={styles.buttonOutlineText}>Solved Exams</Text>
                    </TouchableOpacity>
                </View>
            )}
            {rol === 'student' && (
                <>
                    {exams.length === 0 && (
                        <Text style={styles.examsText}>This course doesn't have any exams</Text>
                    )}
                    {exams.map(item_exam => (
                        <>
                            {(item_exam.state === "active" || item_exam.state === "inactive") && (
                                <View style={styles.examsList} key={item_exam.id}>
                                    <TouchableOpacity
                                        onPress={() => {props.navigation.navigate('Exam Screen', {
                                            id: item_exam.id,
                                            course_id : courseId,
                                        })}}
                                        style={[styles.fadedButton]}
                                    >
                                        <Text style={styles.buttonFadedText}>{item_exam.name}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </>
                    ))}
                </>
            )}
        </>
    );
}

const styles = new StyleSheet.create({
    container: {
        flex: 1,
    },
    description: {
        fontSize: 16,
    },
    buttonFadedText: {
        color:'#87ceeb',
        fontWeight: '700',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    fadedButton: {
        marginTop: 10,
        width: '100%',
        borderRadius: 10,
    },
    buttonImage: {
        width: 100,
        height: 100
    },
    buttonWithImage: {
        marginTop: 10,
        borderRadius: 10,
    },
    button: {
        backgroundColor: `#87ceeb`,
        width: '90%',
        padding: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        marginTop: 20,
    },
    buttonText: {
        color:'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlined: {
        backgroundColor:'white',
        borderColor: '#87ceeb',
        borderWidth:2,
    },
    buttonOutlineText: {
        color:'#87ceeb',
        fontWeight: '700',
        fontSize: 16,
    },
});

export default MyExamsScreen;