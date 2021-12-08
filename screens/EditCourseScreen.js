import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView, Alert, TextInput } from 'react-native';
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

    const [rol, setRol] = useState("");

    const [addCollaborator, setAddCollaborator] = useState(false);

    const [removeCollaborator, setRemoveCollaborator] = useState(false);

    const [collaboratorsData, setCollaboratorsData] = useState([]);

    const [email, setEmail] = useState("");

    const handleResponseGetCourseRating = (response) => {
        console.log("[Edit Course screen] get rating: ", response.content())
        if (!response.hasError()) {
            setRating(response.content().rating);
        } else {
            console.log("[Edit Course screen] error", response.content().message);
        }        
    }

    const  handleResponseGetProfile = (response) => {
        console.log("[Edit Course screen] get profile: ", response.content())
        if (!response.hasError()) {
            setRol(response.content().rol);
        } else {
            console.log("[Edit Course screen] error", response.content().message);
        }        
    }

    const handleApiResponseProfile = (response) => {
        console.log("[Edit Course Screen] content: ", response.content())
        if (!response.hasError()) {
                setCollaboratorsData(collaboratorsData => [...collaboratorsData, response.content()]);
        } else {
            console.log("[Edit Course Screen] error", response.content().message);
        }
    }

    const handleGetAllUsersInCourse = async (response) => {
        console.log("[Edit Course Screen] content: ", response.content())
        if (!response.hasError()) {
            let tokenLS = await app.getToken();
            for(let student of response.content().users){
              await app.apiClient().getProfile({token: tokenLS}, student.user_id, handleApiResponseProfile);
            }
        } else {
            console.log("[Edit Course Screen] error", response.content().message);
        }
    }
    
    const handleResponseSubscribeToCourse = (response) => {
        console.log("[Edit Course screen] subscribe to course: ", response.content())
        if (!response.hasError()) {
            Alert.alert(
                "Successful:",
                "Collaborator's updated in course",
                [
                  { text: "OK", onPress: () => {} }
                ]
            );
        } else {
            if (response.content().message == "Course already acquired by this user") {
                Alert.alert(
                    "Error: User is subscribe to this course",
                    "Unable to make this user a collaborator",
                    [
                      { text: "OK", onPress: () => {} }
                    ]
                );
            }
            console.log("[Edit Course screen] error", response.content().message);
        }        
    }

    const handleResponseGetUsersByEmailSubscribe = async (response) => {
        console.log("[Edit Course screen] get user by emaill: ", response.content())
        if (!response.hasError()) {
            console.log("content lenght: ", response.content().length);
            if(response.content().length === 1) {
                console.log("ENTRO AL IF: ");
                let tokenLS = await app.getToken();
                console.log("USER ID: ", response.content()[0].id);
                await app.apiClient().subscribeCourse({token: tokenLS, user_id: response.content()[0].id, user_type: "collaborator"}, item.id, handleResponseSubscribeToCourse)
            } else {
                console.log("ENTRO AL ELSE: ");
                Alert.alert(
                    "Error:",
                    "Unable to find a user with given email",
                    [
                      { text: "OK", onPress: () => {} }
                    ]
                )
            }
        } else {
            console.log("[Edit Course screen] error", response.content().message);
        }        
    }

    const handleResponseGetUsersByEmailUnsubscribe = async (response) => {
        console.log("[Edit Course screen] get user by emaill: ", response.content())
        if (!response.hasError()) {
            console.log("content lenght: ", response.content().length);
            if(response.content().length === 1) {
                console.log("ENTRO AL IF: ");
                let tokenLS = await app.getToken();
                console.log("USER ID: ", response.content()[0].id);
                await app.apiClient().unsubscribeCourse({token: tokenLS}, item.id, response.content()[0].id, handleResponseSubscribeToCourse)
            } else {
                console.log("ENTRO AL ELSE: ");
                Alert.alert(
                    "Error:",
                    "Unable to find a user with given email",
                    [
                      { text: "OK", onPress: () => {} }
                    ]
                )
            }
        } else {
            console.log("[Edit Course screen] error", response.content().message);
        }        
    }

    const addNewCollaborator = async () => {
        let tokenLS = await app.getToken();
        await app.apiClient().getUsersByEmail({token: tokenLS}, email, handleResponseGetUsersByEmailSubscribe);
        setAddCollaborator(false);
    }

    const removeNewCollaborator = async () => {
        let tokenLS = await app.getToken();
        await app.apiClient().getUsersByEmail({token: tokenLS}, email, handleResponseGetUsersByEmailUnsubscribe);
        setRemoveCollaborator(false);
    }

    const onRefresh = async () => {
        console.log("[Edit Course screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        await app.apiClient().getCourseRating({token: tokenLS}, item.id, handleResponseGetCourseRating);
        await app.apiClient().getAllUsersInCourse({token: tokenLS}, item.id, "collaborator", handleGetAllUsersInCourse);
        await app.apiClient().getProfile({token: tokenLS}, idLS, handleResponseGetProfile);
        setLoading(false);
    };
  
    useEffect(() => {
        setCollaboratorsData([]);
        console.log("[Edit Course screen] entro a useEffect");
        onRefresh();
    }, [addCollaborator,removeCollaborator]);

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
                <View style={styles.descriptionWrapper}>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
                {addCollaborator && (
                    <>
                    <View style={styles.searchWrapper}>
                        <Feather name="search" size={16}/>
                        <View style={styles.search}>
                            <TextInput 
                            placeholder="Search collaborator by email"
                            onChangeText={text => {setEmail(text)}}
                            //value={}
                            style={styles.searchText}
                            />
                        </View>              
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={() => {addNewCollaborator()}}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Search</Text>
                        </TouchableOpacity>
                    </View>
                    </>
                )}
                {removeCollaborator && (
                    <>
                    <View style={styles.searchWrapper}>
                        <Feather name="search" size={16}/>
                        <View style={styles.search}>
                            <TextInput 
                            placeholder="Search collaborator by email"
                            onChangeText={text => {setEmail(text)}}
                            //value={}
                            style={styles.searchText}
                            />
                        </View>              
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={() => {removeNewCollaborator()}}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Search</Text>
                        </TouchableOpacity>
                    </View>
                    </>
                )}
                <View style={styles.buttonsWrapper}>
                    {rol === "instructor" && (
                        <>
                        <View style={styles.buttonsContainer}>
                            {!addCollaborator && (
                                <TouchableOpacity
                                    onPress={() => {setAddCollaborator(true)}}
                                    style={styles.buttonIcon}
                                >
                                    <MaterialCommunityIcons
                                        name="account-plus-outline"
                                        size={25}
                                        color={'black'}
                                    />
                                    {/* <Text style={styles.buttonText}>Add a collaborator</Text> */}
                                </TouchableOpacity>
                            )}
                            {!removeCollaborator && (
                                <TouchableOpacity
                                    onPress={() => {setRemoveCollaborator(true)}}
                                    style={styles.buttonIcon}
                                >
                                    <MaterialCommunityIcons
                                        name="account-remove-outline"
                                        size={25}
                                        color={'black'}
                                    />
                                    {/* <Text style={styles.buttonText}>Remove a collaborator</Text> */}
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={() => {props.navigation.navigate('Edit Modules', {
                                    id: item.id,
                                    course_name: item.name
                                    })}}
                                style={styles.buttonIcon}
                            >
                                <MaterialCommunityIcons
                                    name="pencil"
                                    size={25}
                                    color={'black'}
                                />
                                {/* <Text style={styles.buttonText}>Edit Modules</Text> */}
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {props.navigation.navigate('Course Metrics', {
                                    id: item.id,
                                    })}}
                                style={styles.buttonIcon}
                            >
                                <MaterialCommunityIcons
                                    name="chart-bar"
                                    size={25}
                                    color={'black'}
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={() => {props.navigation.navigate('Edit Exam', {
                                id: item.id,
                                })}}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Edit Exams</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {props.navigation.navigate('Create New Exam', {
                                id: item.id,
                                })}}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Create New Exam</Text>
                        </TouchableOpacity>
                        </>
                    )}
                    <TouchableOpacity
                        onPress={() => {}}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Grade Exams</Text>
                    </TouchableOpacity>
                </View>
                <Text>Collaborators:</Text>
                <View style={styles.cardWrapper}>
                    {collaboratorsData.map(item => (
                        <ProfilesListComponent 
                        item={item}
                        navigation={props.navigation}/>
                    ))}
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
    descriptionWrapper: {
        paddingHorizontal: 15,
        //paddingVertical: 10,
    },
    description: {
        fontSize: 16,
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
    cardWrapper: {
        paddingHorizontal: 20,
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
    buttonContainer: {
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginLeft: 17,
        flexDirection: 'row'
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
    buttonIcon: {
        backgroundColor: `#87ceeb`,
        width: "15%",
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        marginLeft: 15,
    },
    buttonsContainer: {
        flexDirection: 'row',
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
    searchWrapper: {
        flexDirection: "row",
        width:'90%',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginTop: 10,
        marginLeft: 18,
        backgroundColor:'white',
    },
    search: {
        marginLeft: 10,
        alignItems: "center",
    },
    searchText: {
        fontSize: 14,
        color: "grey",
        alignItems: "center",
    },
});

export default EditCourseScreen;
