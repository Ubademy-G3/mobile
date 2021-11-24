import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import forYouData from '../assets/data/forYouData'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { app } from '../app/app';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const SearchCoursesScreen = (props) => {
    const searchKey = props.route.params ? props.route.params.searchKey : null;
    const keyType = props.route.params ? props.route.params.keyType : null;
    
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearchCourses = (response) => {
        console.log("[Search by subscription screen] content: ", response.content())
        if (!response.hasError()) {
            setCourses(response.content().courses);
            console.log("[Search by subscription screen] response: ", courses);
        } else {
            console.log("[Search by subscription screen] error", response.content().message);
        }
    }

    const onRefresh = async () => {
        console.log("[Search by subscription screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        await app.apiClient().searchCourse({token: tokenLS}, searchKey, keyType, handleSearchCourses);
        setLoading(false);
    };

    useEffect(() => {
        console.log("[Search by subscription screen] entro a useEffect");
        onRefresh();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>                
                <View style={styles.coursesCardWrapper}>
                    <Text style={styles.coursesTitle}>Courses</Text>
                    {courses.map(item => (
                        <TouchableOpacity
                        key={item.id}
                        onPress={() =>
                            props.navigation.navigate('Course Screen', {
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
                                    size={10}
                                    color={'black'}
                                    />
                                    <Text style={styles.rating}>{item.rating}</Text>
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
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    titlesWrapper: {
        flexDirection: "row",
        //paddingVertical:25,
        paddingHorizontal: 15,
        //paddingTop: 5,
        //paddingLeft: 10,
        //justifyContent: 'center',
        //alignItems: 'center',
    },
    titlesImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    titleWrapper: {
        //paddingVertical:35,
        paddingHorizontal: 10,
        flex: 1, 
        flexWrap: 'wrap',
        flexDirection: "row",
    },
    titlesTitle: {
        fontSize: 24,
        color: '#87ceeb',
        textAlign: 'justify',        
    },
    titlesRating: {
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontSize: 18,
    },
    descriptionWrapper: {
        paddingHorizontal: 15,
        // paddingVertical: 10,
        paddingBottom: 10,
    },
    description: {
        fontSize: 16,
    },
    coursesCardWrapper: {
        paddingHorizontal: 20,
      },
      coursesTitle: {
        fontSize: 20,
      },
      courseCardWrapper: {
        backgroundColor: 'white',
        borderRadius: 25,
        paddingTop: 20,
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
      },
      courseTitlesTitle: {
        fontSize: 16,
        color: 'black'
      },
      courseTitlesRating: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      forYouTitlesDescription: {
        fontSize: 12,
        color: 'grey',
        marginTop: 7,
        paddingRight: 40,
      },
      forYouButtons: {
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
      ratingWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
      },
      rating: {
        fontSize: 12,
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
        resizeMode: 'contain',
      },
})

export default SearchCoursesScreen;