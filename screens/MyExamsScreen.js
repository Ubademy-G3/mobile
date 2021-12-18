import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

const MyExamsScreen = (props) => {
    const courseId = props.route.params.course_id;
    const rol = props.route.params.view_as;

    return (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
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
        //marginTop: 5,
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