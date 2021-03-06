import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, ScrollView, TextInput, Modal, Pressable } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { app } from '../app/app';
import ProfilesListComponent from "../components/ProfilesListComponent";
import { Video } from 'expo-av';
import { ActivityIndicator } from 'react-native-paper';
import StarRating from 'react-native-star-rating';
import ProgressCircle from 'react-native-progress-circle'

Feather.loadFont();
MaterialCommunityIcons.loadFont();
MaterialIcons.loadFont();

const CourseScreen = (props) => {
    const { item } = props.route.params;
    const [loading, setLoading] = useState(false);
    const [modalErrorVisible, setModalErrorVisible] = useState(false);
    const [modalErrorTitle, setModalErrorTitle] = useState("");
    const [modalErrorText, setModalErrorText] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [favorited, setFavorited] = useState(false);
    const [rating, setRating] = useState({});
    const [starCount, setStarCount] = useState(0);
    const [opinion, setOpinion] = useState("");
    const [approved, setApproved] = useState(false);
    const [instructors, setInstructors] = useState([]);
    const [favoriteCoursesList, setFavoriteCoursesList] = useState([]);
    const [exams, setExams] = useState([]);
    const [modules, setModules] = useState(null); 
    const [media, setMedia] = useState(null);
    const [updatingModules, setUpdatingModules] = useState(false);
    const [rol, setRol] = useState(null);
    const [progress, setProgress] = useState(0);
    const [showOpinion, setShowOpinion] = useState(true);
    const [studentsOpinions, setStudentsOpinions] = useState([]);
    const [subscriptionType, setSubscriptionType] = useState("");
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});

    const handleGetMedia = async (response) => {
        if (!response.hasError()) {
            setMedia(response.content().course_media);
        } else {
            console.log("[ Course screen] error", response.content().message);
        }   
    }

    const handleGetAllModules = async (response) => {
        if (!response.hasError()) {           
            setModules(response.content().modules);
            setUpdatingModules(true);          
        } else {
            console.log("[Course screen] error", response.content().message);
        }   
    }

    const removeElement = (arr, value) => {
        return arr.filter(function(ele) {
            return ele != value;
        });
    }

    const handleResponseGetAllExams = (response) => {
        if (!response.hasError()) {
            setExams(response.content().exam_templates);
        } else {
            console.log("[Course screen] error", response.content().message);
        }
    }

    const handleResponseSubscribeToCourse = (response) => {
        if (!response.hasError()) {
            setSubscribed(true);
        } else {
            if(response.content().message === "Can't subscribe user because of subscription type") {
                setModalErrorTitle("Subscription error:");
                setModalErrorText(`You can't subscribe to a ${item.subscription_type} course with subscription type ${subscriptionType}`);
                setModalErrorVisible(true);
            }
            console.log("[Course screen] error", response.content().message);
        }
    }

    const handleResponseAddRating = (response) => {
        if (!response.hasError()) {
            console.log("[Course screen] ok");
        } else {
            console.log("[Course screen] error", response.content().message);
        }
    }

    const handleResponseUnsubscribeToCourse = (response) => {
        if (!response.hasError()) {
            setSubscribed(false);
        } else {
            console.log("[Course screen] error", response.content().message);
        }
    }

    const handleResponseUnfavorite = (response) => {
        if (!response.hasError()) {
            setFavorited(false);
        } else {
            console.log("[Course screen] error", response.content().message);
        }
    }

    const handleResponseGetUserFromCourse = (response) => {
        if (!response.hasError()) {
            setRol(response.content().user_type);
            if (response.content().approval_state) {
                setApproved(true);
            }
        } else {
            if (response.content().status === 404) {
                setRol('student');
            }
            console.log("[Course screen] error", response.content().message);
        }
    }

    const handleResponseFavorited = (response) => {
        if (!response.hasError()) {
            setFavorited(true);
        } else {
            console.log("[Course screen] error", response.content().message);
        }
    }

    const handleApiResponseProfile = (response) => {
        if (!response.hasError()) {  
            setInstructors(instructors => [...instructors, response.content()]);
        } else {
            console.log("[Course screen] error", response.content().message);
        }
    }

    const handleResponseGetProfile = (response) => {
        if (!response.hasError()) {
            setFavoriteCoursesList(response.content().favoriteCourses);
            setSubscriptionType(response.content().subscription);
            //setRol(response.content().rol);
            for (let courseId of response.content().favoriteCourses){
                if (courseId === item.id){
                    setFavorited(true);
                }
            }
        } else {
            console.log("[Course screen] error", response.content().message);
        }
    }

    const handleGetRatings = async (response) => {
        if (!response.hasError()) {
            let idLS = await app.getId();
            const m = response.content().reviews.filter((m) => {
                return m.user_id === idLS;
            });
            if (m.length === 0) {
                setShowOpinion(true);
            } else {
                setShowOpinion(false);
            }
            setStudentsOpinions(response.content().reviews.slice(0,6));
        } else {
            console.log("[Course screen] error", response.content().message);
        }
    }

    const handleResponseGetAllUsersInCourses = async (response) => {
        if (!response.hasError()) {
            let idLS = await app.getId();
            let tokenLS = await app.getToken();
            for (let course of response.content().users){
                if (course.user_id === idLS){
                    setSubscribed(true);
                    setProgress(course.progress);
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
        if (!response.hasError()) {
            setRating(response.content());
        } else {
            console.log("[Course screen] error", response.content().message);
        }        
    }
    
    const handleSubmitSubscribe = async () => {
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        await app.apiClient().subscribeCourse({token: tokenLS, user_id: idLS, user_type: "student"}, item.id, handleResponseSubscribeToCourse);
        setLoading(false);
    }

    const handleSubmitUnsubscribe = async () => {
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        await app.apiClient().unsubscribeCourse({token: tokenLS}, item.id, idLS, handleResponseUnsubscribeToCourse);
        setLoading(false);
    }

    const handleSubmitUnfavorite = async() => {
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        let newList = removeElement(favoriteCoursesList, item.id);
        await app.apiClient().editProfile({token: tokenLS, favoriteCourses: newList }, idLS, handleResponseUnfavorite);
        setFavoriteCoursesList(newList);
        setLoading(false);
    }

    const handleSubmitFavorited = async () => {
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        const newList = [...favoriteCoursesList];
        newList.push(item.id);
        await app.apiClient().editProfile({token: tokenLS, favoriteCourses: newList }, idLS, handleResponseFavorited);
        setFavoriteCoursesList(newList);
        setLoading(false);
    }

    const handleSumbitSendOpinion = async () => {
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        await app.apiClient().addRatingToCourse({token: tokenLS, user_id: idLS, score: starCount, opinion: opinion}, item.id, handleResponseAddRating);
        setShowOpinion(false);
        setLoading(false);
    }

    const onRefresh = async () => { 
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        await app.apiClient().getCourseRating({token: tokenLS}, item.id, handleResponseGetCourseRating);
        await app.apiClient().getAllUsersInCourse({token: tokenLS}, item.id, {}, handleResponseGetAllUsersInCourses);
        await app.apiClient().getProfile({token: tokenLS}, idLS, handleResponseGetProfile);
        await app.apiClient().getUserFromCourse({token: tokenLS}, item.id, idLS, handleResponseGetUserFromCourse);
        await app.apiClient().getAllExamsByCourseId({token: tokenLS}, item.id, {}, handleResponseGetAllExams);
        await app.apiClient().getAllModules({token: tokenLS}, item.id, handleGetAllModules);
        await app.apiClient().getAllMedia({token: tokenLS}, item.id, handleGetMedia);
        await app.apiClient().getRatingFromCourse({token: tokenLS}, item.id, handleGetRatings);
        setLoading(false);
    };

    useEffect(() => {
        setInstructors([]);
        onRefresh();
    }, []);

    const getNav = () => {
        if (rol === 'student') {
            return 'Exams';
        } else {
            return 'Course Exams';
        }
    };

    const getMediaFromModule = (id) => {
        const m = media.filter((m) => {
            return m.module_id === id
        });
        
        return m;
    };

    const onStarRatingPress = (rating) => {
        setStarCount(rating);
    }

    const renderOpinionItem = ({ item }) => {
        return (
            <View
              key={item.id}
              style={[styles.opinionItemWrapper, { maxWidth: "90%"}]}>
              <Text style={styles.categoryItemTitle}>{item.opinion}</Text>            
            </View>
        );
    };

    return (
        <View style={styles.centeredView}>
            {modalErrorVisible && (
                <View style={[styles.centeredView, {justifyContent: "center", alignItems: "center",}]}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalErrorVisible}
                    onRequestClose={() => {
                    setModalErrorVisible(!modalErrorVisible);
                    }}
                >
                    <View style={[styles.centeredView, {justifyContent: "center", alignItems: "center",}]}>
                        <View style={styles.modalView}>
                            <View style={{ display:'flex', flexDirection: 'row' }}>
                                <MaterialCommunityIcons
                                    name="close-circle-outline"
                                    size={30}
                                    color={"#ff6347"}
                                    style={{ position: 'absolute', top: -6, left: -35}}
                                />
                                <Text style={styles.modalText}>{modalErrorTitle}</Text>
                            </View>
                            <Text style={styles.modalText}>{modalErrorText}</Text>
                            <Pressable
                            style={[styles.buttonModal, styles.buttonClose]}
                            onPress={() => setModalErrorVisible(!modalErrorVisible)}
                            >
                                <Text style={styles.textStyle}>Ok</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                </View>
            )}
            <ScrollView>
                {loading && (
                    <View style={{flex:1, justifyContent: 'center'}}>
                        <ActivityIndicator style={{ margin: '50%' }} color="lightblue" animating={loading} size="large" />
                    </View>
                )}
                {!loading && (
                    <>
                        <View style={styles.titlesWrapper}>
                            <View>
                                <Image source={{uri: item.profile_picture}} style={styles.titlesImage} />
                            </View>
                            <View style={styles.titleWrapper}>
                                <View style={{marginRight: 55, marginBottom:10}}>
                                    <Text style={styles.titlesTitle}>{item.name}</Text>
                                </View>
                                <View style={{ display:'flex', flexDirection: 'row' }}>
                                    <StarRating
                                        disabled={true}
                                        maxStars={5}
                                        rating={rating.rating}
                                        containerStyle={{ width: 115}}
                                        starSize={20}
                                        fullStarColor='gold'
                                    />
                                    <Text style={{ position: 'absolute', left: 120, fontSize: 16 }}>{`(${rating.amount})`}</Text>
                                    {subscribed && rol === "student" && (
                                        <>
                                        <View style={{position: 'absolute', left: 180, right: 0, top: -12, bottom: 0}}>
                                        <ProgressCircle
                                            percent={progress}
                                            radius={25}
                                            borderWidth={3}
                                            color="#228b22"
                                            shadowColor="#999"
                                            bgColor="#fff"
                                        >
                                            <Text style={{ fontSize: 16 }}>{`${progress}%`}</Text>
                                        </ProgressCircle>
                                        </View>
                                        </>
                                    )}
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                borderBottomColor: 'grey',
                                borderBottomWidth: 0.5,
                                marginBottom: 5
                            }}
                        />
                        {!subscribed && (
                            <TouchableOpacity
                                onPress={() => {
                                    props.navigation.navigate('Student List', {
                                    course_id: item.id,
                                    filter: false,
                                    view_as: rol
                                });}}
                                style={{flexDirection: 'row', alignItems: 'center'}}
                            >
                                <Image source={require("../assets/images/studentsButton.png")} style={{ width: 70, height: 70, marginLeft: 20 }} />
                                <Text style={{color: 'grey', textAlign: 'center', marginLeft: 5}}>Students</Text>
                            </TouchableOpacity>
                        )}
                        {subscribed && (
                            <>
                                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            props.navigation.navigate('Student List', {
                                            course_id: item.id,
                                            view_as: rol
                                        });}}
                                        style={[styles.buttonWithImage]}
                                    >
                                        <Image source={require("../assets/images/studentsButton.png")} style={styles.buttonImage} />
                                        <Text style={{color: 'grey', textAlign: 'center'}}>Students</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            props.navigation.navigate(getNav(), {
                                            course_id: item.id,
                                            view_as: rol,
                                            exams: exams
                                        });}}
                                        style={[styles.buttonWithImage]}
                                    >
                                        <Image source={require("../assets/images/examButton.png")} style={styles.buttonImage} />
                                        <Text style={{color: 'grey', textAlign: 'center'}}>Exams</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            props.navigation.navigate('Collaborators List', {
                                            course_id: item.id,
                                            filter: false,
                                            view_as: rol
                                        });}}
                                        style={[styles.buttonWithImage]}
                                    >
                                        <Image source={require("../assets/images/collaboratorsButton.png")} style={{ width: 70, height: 70, marginLeft: 20 }} />
                                        <Text style={{color: 'grey', textAlign: 'center', marginLeft: 5}}>Collaborators</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                        <>
                            <View style={styles.studentListWrapper}>
                                <Text style={styles.instructorsTitle}>About this course</Text>
                                <View style={styles.descriptionWrapper}>
                                    <Text style={styles.description}>{item.description}</Text>
                                </View>

                                <View style={styles.featuresWrapper}>
                                    <View style={styles.featuresListWrapper}>
                                        <Text style={styles.featuresItemTitle}>Language: {item.language}</Text>
                                        <Text style={styles.featuresItemTitle}>Level: {item.level}</Text>
                                        <Text style={styles.featuresItemTitle}>Duration: {item.duration} days</Text>
                                    </View>
                                </View>
                            </View>
                        </>
                        {subscribed && approved && (
                            <View style={{paddingHorizontal: 15}}>
                                {showOpinion && (
                                    <>
                                    <Text style={styles.opinionTitle}>Give your opinion about this course</Text>
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    <StarRating
                                        disabled={false}
                                        maxStars={5}
                                        rating={starCount}
                                        selectedStar={(rating) => onStarRatingPress(rating)}
                                        containerStyle={{ width: "80%", paddingVertical: 10}}
                                        starSize={35}
                                        fullStarColor='gold'
                                    />
                                    </View>
                                    <KeyboardAvoidingView
                                        behavior={Platform.OS === "ios" ? "padding" : "padding"}
                                    >
                                        <TextInput
                                            placeholder={opinion}
                                            onChangeText={text => setOpinion(text)}
                                            value={opinion}
                                            multiline={true}
                                            style={styles.inputText}
                                        />
                                    </KeyboardAvoidingView>
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        <TouchableOpacity
                                            onPress={() => {handleSumbitSendOpinion()}}
                                            style={[styles.button, {marginBottom: 10}]}>
                                            <Text style={styles.buttonText}>Send opinion</Text>
                                        </TouchableOpacity>
                                    </View>
                                    </>
                                )}
                                {!showOpinion && (
                                    <Text style={styles.opinionTitle}>Thank you for your feedback!</Text>
                                )}
                            </View>
                        )}
                        <View style={styles.studentListWrapper}>
                            <Text style={styles.instructorsTitle}>Instructor</Text>
                            {instructors.map(item => (
                                <ProfilesListComponent 
                                item={item}
                                navigation={props.navigation}
                                key={item.id}/>
                            ))}
                        </View>
                        <View style={styles.studentListWrapper}>
                            {studentsOpinions.length === 0 && (
                                <Text style={[styles.instructorsTitle, {marginBottom: 10}]}>There are no opinions about this course</Text>
                            )}
                            {studentsOpinions.length !== 0 && (
                                <View>
                                    <Text style={[styles.instructorsTitle, {marginBottom: 10}]}>Opinions about this course</Text>
                                    <FlatList  
                                        data={studentsOpinions}
                                        renderItem={renderOpinionItem}
                                        keyExtractor={(item) => item.id}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                    />
                                </View>
                            )}
                        </View>
                        {subscribed && (modules.length !== 0) && media && (
                            <View style={styles.studentListWrapper}>
                                <Text style={styles.instructorsTitle}>Units</Text>
                                {modules.map((item, key) => (
                                    <View key={item.id}>            
                                        <View style={styles.courseCardWrapper}>                         
                                            <View style={styles.moduleView}>
                                                <Text style={styles.moduleTitle}>{item.title}</Text>
                                            </View>
                                            <View style={styles.moduleView}>
                                                <Text style={styles.moduleContent}>{item.content}</Text>
                                            </View>                          
                                        </View>
                                        {getMediaFromModule(item.id).map((media_item, media_key) => (
                                            <View style={styles.containerVideo} key={media_item.id}>
                                                <Video
                                                    ref={video}
                                                    style={styles.video}
                                                    source={{uri: media_item.url}}
                                                    resizeMode="contain"
                                                    useNativeControls={true}
                                                    shouldPlay={false}
                                                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                                                />
                                            </View>
                                        ))} 
                                    </View>
                                ))}
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
            {!loading && rol === 'student' && (
                <View style={styles.buttonsWrapper}>
                    {!subscribed && (
                        <>
                            <TouchableOpacity onPress={() => handleSubmitSubscribe()}> 
                                <View style={styles.subscribeWrapper}>
                                    <Feather name="plus" size={18} color="black" />
                                    <Text style={styles.subscribeText}>Subscribe</Text>
                                </View>
                            </TouchableOpacity>            
                        </>
                    )}
                    {subscribed && (
                        <>
                            <TouchableOpacity onPress={() => handleSubmitUnsubscribe()}> 
                                <View style={styles.subscribeWrapper}>
                                    <Feather name="x" size={18} color="black" />
                                    <Text style={styles.unsubscribeText}>Unsubscribe</Text>
                                </View>
                            </TouchableOpacity>            
                        </>
                    )}
                    {!favorited && (
                    <>
                        <TouchableOpacity onPress={() => handleSubmitFavorited()}> 
                            <View style={styles.favoriteWrapper}>
                                <MaterialCommunityIcons name="heart-outline" size={18} color="black" />
                            </View>
                        </TouchableOpacity>            
                    </>
                    )}
                    {favorited && (
                    <>
                        <TouchableOpacity onPress={() => handleSubmitUnfavorite()}> 
                            <View style={styles.favoriteWrapper}>
                                <MaterialCommunityIcons name="heart" size={18} color="black" />
                            </View>
                        </TouchableOpacity>            
                    </>
                    )}
                </View>
            )}
        </View>
      );
};

const styles = new StyleSheet.create({
    container: {
        flex: 1,
    },
    titlesWrapper: {
        flexDirection: "row",
        paddingVertical: 25,
        paddingHorizontal: 15,
    },
    containerVideo: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    video: {
        alignSelf: 'center',
        width: 320,
        height: 200,
    },
    titlesImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    titleWrapper: {
        paddingHorizontal: 10,
        flexDirection: "column",
    },
    titlesTitle: {
        flexWrap: 'wrap',
        fontSize: 24,
        width: '90%',
        color: 'black',
        flexDirection: 'row',
    },
    titlesRating: {
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    instructorsTitle: {
        fontSize: 16,
        color: 'black',
        fontWeight: "bold",
        marginTop: 10
    },
    buttonsWrapper: {
        flexDirection: 'row',

    },
    rating: {
        fontSize: 18,
    },
    descriptionWrapper: {
        paddingHorizontal: 15,
    },
    description: {
        fontSize: 16,
    },
    featuresWrapper: {
        paddingHorizontal: 15,
    },
    featuresTitle: {
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
    opinionTitle: {
        fontSize: 16,
        marginTop: 10,
        fontWeight: "bold",
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
        borderRadius: 10,
    },
    examsList: {
        marginBottom: 5,
        marginLeft: 10,
    },
    buttonImage: {
        width: 70,
        height: 70
    },
    buttonWithImage: {
        marginTop: 10,
        borderRadius: 10,
    },
    studentListWrapper: {
        paddingHorizontal: 15,
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
    courseCardWrapper: {
        backgroundColor: 'white',
        width: 320,
        borderRadius: 25,
        paddingVertical: 8,
        paddingLeft: 20,
        marginTop: 10,
        flexDirection: 'column',
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2, 
    },
    moduleContent: {
        fontSize: 16
    },
    moduleTitle: {
        fontWeight: '600',
        fontSize: 18
    },
    centeredView: {
        flex: 1,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    buttonModal: {
        borderRadius: 20,
        paddingHorizontal: 40,
        paddingVertical: 15,
        elevation: 2
    },
    buttonClose: {
        backgroundColor: "#ff6347",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    inputText: {
        backgroundColor:'white',
        paddingHorizontal: 15,
        paddingVertical: 35,
        borderRadius: 10,
        marginTop: 5,
    },
    opinionItemWrapper: {
        backgroundColor: '#F5CA48',
        marginRight: 10,
        borderRadius: 20,
        shadowColor: 'black',
        paddingHorizontal: 10,
        paddingVertical: 10,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    categoryItemTitle: {
        textAlign: 'center',
        fontSize: 14,
        marginTop: 5,
        marginBottom: 5
    },
});

export default CourseScreen;
