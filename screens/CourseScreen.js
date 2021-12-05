import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { app } from '../app/app';
import ProfilesListComponent from "../components/ProfilesListComponent";

Feather.loadFont();
MaterialCommunityIcons.loadFont();

const CourseScreen = (props) => {
    const { item } = props.route.params;

    const [loading, setLoading] = useState(false);

    const [subscribed, setSubscribed] = useState(false);
    
    const [favorited, setFavorited] = useState(false);

    const [rating, setRating] = useState(0);

    const [instructors, setInstructors] = useState([]);

    const [favoriteCoursesList, setFavoriteCoursesList] = useState([]);

    const [exams, setExams] = useState([]);

    const removeElement = (arr, value) => { 
        return arr.filter(function(ele){ 
            return ele != value; 
        });
    }

    const handleResponseGetAllExams = (response) => {
        console.log("[Course screen] get exams: ", response.content())
        if (!response.hasError()) {
            setExams(response.content().exam_templates);
        } else {
            console.log("[Course screen] error", response.content().message);
        }        
    }

    const handleResponseSubscribeToCourse = (response) => {
        console.log("[Course screen] subscribe content: ", response.content())
        if (!response.hasError()) {
            setSubscribed(true);
        } else {
            console.log("[Course screen] error", response.content().message);
        }
    }

    const handleResponseUnsubscribeToCourse = (response) => {
        console.log("[Course screen] unsubscribe content: ", response.content())
        if (!response.hasError()) {
            setSubscribed(false);
        } else {
            console.log("[Course screen] error", response.content().message);
        }
    }

    const handleResponseUnfavorite = (response) => {
        console.log("[Course screen] unfavorite content: ", response.content())
        if (!response.hasError()) {
            setFavorited(false);
            //setFavoriteCoursesList(response.content().favoriteCourses);
        } else {
            console.log("[Course screen] error", response.content().message);
        }
    }

    const handleResponseFavorited = (response) => {
        console.log("[Course screen] favorited content: ", response.content())
        if (!response.hasError()) {
            setFavorited(true);
            //setFavoriteCoursesList(response.content().favoriteCourses);
        } else {
            console.log("[Course screen] error", response.content().message);
        }
    }

    const handleApiResponseProfile = (response) => {
        console.log("[Course screen] content: ", response.content());
        if (!response.hasError()) {  
            setInstructors(instructors => [...instructors, response.content()]);
        } else {
            console.log("[Course screen] error", response.content().message);
        }
    }

    const handleResponseGetProfile = (response) => {
        console.log("[Course screen] content: ", response.content());
        if (!response.hasError()) {
            setFavoriteCoursesList(response.content().favoriteCourses);
            for (let courseId of response.content().favoriteCourses){
                if (courseId === item.id){
                    setFavorited(true);
                }
            }
        } else {
            console.log("[Course screen] error", response.content().message);
        }
    }

    const handleResponseGetAllUsersInCourses = async (response) => {
        console.log("[Course screen] content: ", response.content())
        if (!response.hasError()) {
            let idLS = await app.getId();
            let tokenLS = await app.getToken();
            for (let course of response.content().users){
                if (course.user_id === idLS){
                    setSubscribed(true);
                }
                if (course.user_type === 'instructor') {
                    await app.apiClient().getProfile({id: course.user_id, token: tokenLS}, course.user_id, handleApiResponseProfile);
                }
            }
        } else {
            console.log("[Course screen] error", response.content().message);
        }
    }

    const handleResponseGetCourseRating = (response) => {
        console.log("[Course screen] get rating: ", response.content())
        if (!response.hasError()) {
            setRating(response.content().rating);
        } else {
            console.log("[Course screen] error", response.content().message);
        }        
    }
    
    const handleSubmitSubscribe = async () => {
        console.log("[Course screen] entro submit button"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        console.log("[Course screen] token:", tokenLS); 
        await app.apiClient().subscribeCourse({token: tokenLS, user_id: idLS, user_type: "Student"}, item.id, handleResponseSubscribeToCourse);
        setLoading(false);
    }

    const handleSubmitUnsubscribe = async () => {
        console.log("[Course screen] unsubcribe");
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        await app.apiClient().unsubscribeCourse({token: tokenLS}, item.id, idLS, handleResponseUnsubscribeToCourse);
        setLoading(false);
    }

    const handleSubmitUnfavorite = async() => {
        console.log("[Course screen] unfavorite");
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        let newList = removeElement(favoriteCoursesList, item.id);
        console.log("[Course screen] new list:", newList);
        await app.apiClient().editProfile({token: tokenLS, favoriteCourses: newList }, idLS, handleResponseUnfavorite);
        setFavoriteCoursesList(newList);
        setLoading(false);
    }

    const handleSubmitFavorited = async () => {
        console.log("[Course screen] unfavorite");
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        const newList = [...favoriteCoursesList];
        newList.push(item.id);
        console.log("[Course screen] new list:", newList);
        await app.apiClient().editProfile({token: tokenLS, favoriteCourses: newList }, idLS, handleResponseFavorited);
        setFavoriteCoursesList(newList);
        setLoading(false);
    }

    const onRefresh = async () => {
        console.log("[Course screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        console.log("[Course screen] token:", tokenLS); 
        await app.apiClient().getCourseRating({token: tokenLS}, item.id, handleResponseGetCourseRating);
        await app.apiClient().getAllUsersInCourse({token: tokenLS}, item.id, null, handleResponseGetAllUsersInCourses);
        await app.apiClient().getProfile({token: tokenLS}, idLS, handleResponseGetProfile);
        await app.apiClient().getAllExamsByCourseId({token: tokenLS}, item.id, handleResponseGetAllExams);
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
                {subscribed === false && (
                <>
                    <View style={styles.descriptionWrapper}>
                        <Text style={styles.description}>{item.description}</Text>
                    </View>

                    <View style={styles.featuresWrapper}>
                        <View style={styles.featuresListWrapper}>
                            <Text style={styles.featuresItemTitle}>Language: {item.language}</Text>
                            <Text style={styles.featuresItemTitle}>Level: {item.level}</Text>
                            <Text style={styles.featuresItemTitle}>Duration: {item.duration} days</Text>
                        </View>
                        <Text style={styles.instructorsTitle}>Instructors:</Text>
                        {instructors.map(item => (
                            <ProfilesListComponent 
                            item={item}
                            navigation={props.navigation}/>
                        ))}
                        <TouchableOpacity
                            onPress={() => {
                                props.navigation.navigate('Student List', {
                                course_id: item.id
                            });}}
                            style={[styles.fadedButton]}
                        >
                            <Text style={styles.buttonFadedText}>Student List</Text>
                        </TouchableOpacity>
                    </View>
                </>
                )}
                {subscribed === true && (
                <>
                    {exams.length === 0 && (
                        <Text style={styles.examsText}>This course doesn't have exams</Text>
                    )}
                    {exams.map(item_exam => (
                        <>
                        {item_exam.state === "active" && (
                            <View style={styles.examsList}>
                                <TouchableOpacity
                                    onPress={() => {props.navigation.navigate('Exam Screen', {
                                        id: item_exam.id,
                                        course_id : item.id,
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
            </ScrollView>
            <View style={styles.buttonsWrapper}>
                {subscribed === false && (
                <>
                    <TouchableOpacity onPress={() => handleSubmitSubscribe()}> 
                        <View style={styles.subscribeWrapper}>
                            <Feather name="plus" size={18} color="black" />
                            <Text style={styles.subscribeText}>Subscribe</Text>
                        </View>
                    </TouchableOpacity>            
                </>
                )}
                {subscribed === true && (
                <>
                <TouchableOpacity onPress={() => handleSubmitUnsubscribe()}> 
                    <View style={styles.subscribeWrapper}>
                        <Feather name="x" size={18} color="black" />
                        <Text style={styles.unsubscribeText}>Unsubscribe</Text>
                    </View>
                </TouchableOpacity>            
                </>
                )}
                {favorited === false && (
                <>
                    <TouchableOpacity onPress={() => handleSubmitFavorited()}> 
                        <View style={styles.favoriteWrapper}>
                            <MaterialCommunityIcons name="heart-outline" size={18} color="black" />
                        </View>
                    </TouchableOpacity>            
                </>
                )}
                {favorited === true && (
                <>
                    <TouchableOpacity onPress={() => handleSubmitUnfavorite()}> 
                        <View style={styles.favoriteWrapper}>
                            <MaterialCommunityIcons name="heart" size={18} color="black" />
                        </View>
                    </TouchableOpacity>            
                </>
                )}
            </View>
        </View>
        /*<View style={styles.container}>
          <SafeAreaView>
            <View style={styles.headerWrapper}>
              <TouchableOpacity onPress={() => props.navigation.goBack()}>
                <View style={styles.headerLeft}>
                  <Feather name="chevron-left" size={12} color={colors.textDark} />
                </View>
              </TouchableOpacity>
              <View style={styles.headerRight}>
                <MaterialCommunityIcons
                  name="star"
                  size={12}
                  color={colors.white}
                />
              </View>
            </View>
          </SafeAreaView>
        </View> */
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
    instructorsTitle: {
        fontSize: 16,
        color: 'black',
        fontWeight: "500",
    },
    buttonsWrapper: {
        flexDirection: 'row',

    },
    rating: {
        fontSize: 18,
    },
    descriptionWrapper: {
        paddingHorizontal: 15,
        //paddingVertical: 10,
    },
    description: {
        fontSize: 16,
    },
    featuresWrapper: {
        marginTop: 10,
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
    featuresTitle: {
        //paddingHorizontal: 10,
        fontSize: 16,
    },
    featuresListWrapper: {
        paddingVertical: 10,
    },
    featuresItemWrapper: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginRight: 10,
        borderRadius: 15,
        shadowColor: 'black',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    featuresItemTitle: {
        fontSize: 16,
        marginTop: 5,
    },
    featuresItemText: {},
    subscribeWrapper: {
        marginBottom: 15,
        marginLeft: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        backgroundColor: '#87ceeb',
        borderRadius: 50,
        width: '70%',
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
    },
    favoriteWrapper: {
        marginBottom: 15,
        marginLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        backgroundColor: '#87ceeb',
        borderRadius: 10,
        width: '70%',
        paddingVertical: 10,
        paddingHorizontal: 10,
        //flexDirection: 'row',
    },
    subscribeText: {
        fontSize: 14,
        marginRight: 10,        
    },
    unsubscribeText: {
        fontSize: 14,
        marginRight: 1,        
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
        //padding: 15,
        borderRadius: 10,
        //alignItems: 'center',
    },
    examsList: {
        marginBottom: 5,
        marginLeft: 10,
    },
});

export default CourseScreen;
