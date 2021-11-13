import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import forYouData from '../assets/data/forYouData'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const MenuCompletedCoursesScreen = (props) => {
    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.coursesCardWrapper}>
                    {forYouData.map((item) => (
                        <TouchableOpacity
                        key={item.id}
                        onPress={() =>
                            props.navigation.navigate('UnsubscribedCourse', {
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
                                <Image source={item.image} style={styles.courseCardImage} />
                                </View>
                                <View style={styles.courseTitleWrapper}>
                                <Text style={styles.courseTitlesTitle}>
                                    {item.title}
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
                            <View style={styles.forYouButtons} >
                                <View style={styles.addCourseButton}>
                                <Feather name={item.subscribed ? "check" : "plus"} size={16} color={'black'} />
                                </View>
                                <View style={styles.favoriteCourseButton}>
                                <MaterialCommunityIcons name={item.favorited ? "heart" : "heart-outline"} size={16} color={'black'} />
                                </View>
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

export default MenuCompletedCoursesScreen;