import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { app } from '../app/app';
import ProfilesListComponent from "../components/ProfilesListComponent";

Feather.loadFont();
MaterialCommunityIcons.loadFont();

const EditCourseScreen = (props) => {
    const { item } = props.route.params;

    const [loading, setLoading] = useState(false);

    const [rating, setRating] = useState(0);

    const handleResponseGetCourseRating = (response) => {
        console.log("[Course screen] get rating: ", response.content())
        if (!response.hasError()) {
            setRating(response.content().rating);
        } else {
            console.log("[Course screen] error", response.content().message);
        }        
    }

    const onRefresh = async () => {
        console.log("[Course screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        console.log("[Course screen] token:", tokenLS); 
        await app.apiClient().getCourseRating({token: tokenLS}, item.id, handleResponseGetCourseRating);
        setLoading(false);
    };
  
    useEffect(() => {
        console.log("[Course screen] entro a useEffect");
        onRefresh();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.titlesWrapper}>
                    <View>
                        <Image source={{uri: item.profile_picture}} style={styles.titlesImage} />
                    </View>
                    <View style={styles.titleWrapper}>
                        <Text style={styles.titlesTitle}>{item.name}</Text>
                        <View style={styles.titlesRating}>
                            <MaterialCommunityIcons
                                name="star"
                                size={18}
                                color={'black'}
                            />
                            <Text style={styles.rating}>{rating}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.buttonsWrapper}>
                    <TouchableOpacity
                        onPress={() => {}}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Edit Modules</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {props.navigation.navigate('Edit Exam', {
                            id: item.id,
                            })}}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Edit Exams</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {props.navigation.navigate('Edit Exam', {
                            id: item.id,
                            })}}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Grade Exams</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {props.navigation.navigate('Create New Exam', {
                            id: item.id,
                            })}}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Create New Exam</Text>
                    </TouchableOpacity>
                </View>
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
    titlesWrapper: {
        flexDirection: "row",
        paddingVertical:25,
        paddingHorizontal: 15,
        //paddingTop: 5,
        //paddingLeft: 10,
        //justifyContent: 'center',
        //alignItems: 'center',
    },
    titlesImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    titleWrapper: {
        //paddingVertical:25,
        paddingHorizontal: 10,
        flexDirection: "column"
    },
    titlesTitle: {
        flex: 1, 
        flexWrap: 'wrap',
        fontSize: 24,
    },
    titlesRating: {
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontSize: 18,
    },
    button: {
        backgroundColor: `#87ceeb`,
        width: "80%",
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color:'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonsWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
});

export default EditCourseScreen;
