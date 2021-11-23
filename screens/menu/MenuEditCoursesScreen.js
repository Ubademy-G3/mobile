import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import forYouData from '../../assets/data/forYouData'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const MenuEditCoursesScreen = (props) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => {props.navigation.navigate('Create New Exam')}}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Create New Exam</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
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
})

export default MenuEditCoursesScreen;