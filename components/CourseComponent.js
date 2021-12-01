import React, {Component, useEffect, useState, useCallback} from 'react';
import { Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, HelperText, Alert, ActivityIndicator } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { app } from '../app/app';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const CourseComponent = ({ item, navigation }) => {

    const [loading, setLoading] = useState(false);

    //const [subscribed, setSubscribed] = useState(false);

    const [rating, setRating] = useState(0);

    const handleResponseGetCourseRating = (response) => {
        console.log("[Course component] get rating: ", response.content())
        if (!response.hasError()) {
            setRating(response.content().rating);
        } else {
            console.log("[Course component] error", response.content().message);
        }        
    }

    const onRefresh = async () => {
        console.log("[Course component] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        console.log("[Course component] token:", tokenLS); 
        await app.apiClient().getCourseRating({token: tokenLS}, item.id, handleResponseGetCourseRating);
        setLoading(false);
    };
  
    useEffect(() => {
        console.log("[Course component] entro a useEffect");
        onRefresh();
    }, []);

    return(
        <TouchableOpacity
            key={item.id}
            onPress={() =>
                navigation.navigate('Course Screen', {
                item: item,
                })
            }>
            <View
                style={[
                styles.courseCardWrapper,
                {
                    marginTop: item.id == 1 ? 10 : 20,
                },
                ]}>
                <View>
                    <View style={styles.courseCardTop}>
                        <View>
                            <Image source={{uri: item.profile_picture}} style={styles.courseCardImage} />
                        </View>
                        <View style={styles.courseTitleWrapper}>
                            <Text style={styles.courseTitlesTitle}>
                                {item.name}
                            </Text>
                            <View style={styles.courseTitlesRating}>
                                <MaterialCommunityIcons
                                name="star"
                                size={20}
                                color={'black'}
                                />
                                <Text style={styles.rating}>{rating}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.courseDescriptionWrapper}>
                        <Text style={styles.courseTitleDescription}>
                        {item.description}
                        </Text>
                    </View> 
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    coursesCardWrapper: {
        paddingHorizontal: 20,
    },
    courseCardWrapper: {
        backgroundColor: 'white',
        borderRadius: 25,
        paddingTop: 15,
        paddingLeft: 20,
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
    courseTitleWrapper: {
        marginLeft: 5,
        flexDirection: 'column',
        marginBottom: 20,
    },
    courseTitlesTitle: {
        fontSize: 16,
        color: 'black'
    },
    courseTitlesRating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addCourseButton: {
        marginTop: 20,
        marginLeft: -20,
        backgroundColor: '#87ceeb',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderTopRightRadius: 25,
        borderBottomLeftRadius: 25,
    },
    favoriteCourseButton: {
        backgroundColor: '#87ceeb',
        marginTop: 20,
        marginLeft: 183,
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderTopLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    rating: {
        fontSize: 16,
        color: 'black',
        marginLeft: 5,
    },
    courseCardTop: {
        //marginLeft: 20,
        //paddingRight: 40,
        flexDirection: 'row',
        alignItems: 'center',
        //marginRight: 80,
    },
    courseCardImage: {
        width: 60,
        height: 60,
        borderRadius: 15,
        resizeMode: 'contain',
    },
    courseDescriptionWrapper : {
        paddingTop: 5,
        marginBottom: 10,
        marginRight: 5,
    },
})

export default CourseComponent;