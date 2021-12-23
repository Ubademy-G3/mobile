import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, Pressable, TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { app } from '../app/app';
import ProfilesListComponent from "../components/ProfilesListComponent";
import StarRating from 'react-native-star-rating';
import { ActivityIndicator } from 'react-native-paper';

Feather.loadFont();
MaterialCommunityIcons.loadFont();

const EditCourseScreen = (props) => {
    const { item } = props.route.params;

    const [loading, setLoading] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [modalErrorVisible, setModalErrorVisible] = useState(false);
    const [modalErrorText, setModalErrorText] = useState("");
    const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
    const [rating, setRating] = useState({});
    const [rol, setRol] = useState("");
    const [addCollaborator, setAddCollaborator] = useState(false);
    const [removeCollaborator, setRemoveCollaborator] = useState(false);
    const [collaboratorsData, setCollaboratorsData] = useState([]);

    const [email, setEmail] = useState("");

    const handleResponseGetCourseRating = (response) => {
        console.log("[Edit Course screen] get rating: ", response.content())
        if (!response.hasError()) {
            setRating(response.content());
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

    const handleGetProfileFromList = (response) => {
        console.log("[Edit Course Screen] content: ", response.content())
        if (!response.hasError()) {
            setCollaboratorsData(response.content());
        } else {
            console.log("[Edit Course Screen] error", response.content().message);
        }
    }

    const handleGetAllUsersInCourse = async (response) => {
        console.log("[Edit Course Screen] get all users content: ", response.content())
        if (!response.hasError()) {
            const colaboratorsIds = [];
            for(let user of response.content().users){
              colaboratorsIds.push(user.user_id)
            }
            let tokenLS = await app.getToken();
            await app.apiClient().getAllUsersFromList({token: tokenLS}, colaboratorsIds, handleGetProfileFromList); 
        } else {
            console.log("[Edit Course Screen] error", response.content().message);
        }
    }
    
    const handleResponseSubscribeToCourse = (response) => {
        console.log("[Edit Course screen] subscribe to course: ", response.content())
        if (!response.hasError()) {
            setModalSuccessVisible(true);
            /* Alert.alert(
                "Successful:",
                "Collaborator's updated in course",
                [
                  { text: "OK", onPress: () => {} }
                ]
            ); */
        } else {
            if (response.content().message == "Course already acquired by this user") {
                setModalErrorText("User is subscribe to this course. Unable to make this user a collaborator");
                setModalErrorVisible(true);
                /* Alert.alert(
                    "Error: User is subscribe to this course",
                    "Unable to make this user a collaborator",
                    [
                      { text: "OK", onPress: () => {} }
                    ]
                ); */
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
                setModalErrorText("Unable to find a user with given email");
                setModalErrorVisible(true);
                /* Alert.alert(
                    "Error:",
                    "Unable to find a user with given email",
                    [
                      { text: "OK", onPress: () => {} }
                    ]
                ) */
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
                setModalErrorText("Unable to find a user with given email");
                setModalErrorVisible(true);
                /* Alert.alert(
                    "Error:",
                    "Unable to find a user with given email",
                    [
                      { text: "OK", onPress: () => {} }
                    ]
                ) */
            }
        } else {
            console.log("[Edit Course screen] error", response.content().message);
        }        
    }

    const handleSubmitRemoveCollaborator = () => {
        if (removeCollaborator){
            setRemoveCollaborator(false);
        } else {
            setRemoveCollaborator(true);
        }
    }

    const handleSubmitAddCollaborator = () => {
        if (addCollaborator){
            setAddCollaborator(false);
        } else {
            setAddCollaborator(true);
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
        await app.apiClient().getAllUsersInCourse({token: tokenLS}, item.id, { user_type: 'collaborator' }, handleGetAllUsersInCourse);
        await app.apiClient().getProfile({token: tokenLS}, idLS, handleResponseGetProfile);
        setLoading(false);
    };

    const getCollaborators = async () => {
        setSpinner(true);
        let tokenLS = await app.getToken();
        await app.apiClient().getAllUsersInCourse({token: tokenLS}, item.id, { user_type: 'collaborator' }, handleGetAllUsersInCourse);
        setSpinner(false);
    }
  
    useEffect(() => {
        //setCollaboratorsData([]);
        console.log("[Edit Course screen] entro a useEffect");
        onRefresh();
    }, []);

    useEffect(() => {
        setCollaboratorsData([]);
        getCollaborators();
    }, [addCollaborator,removeCollaborator]);

    return (
        <View style={styles.centeredView}>
            {(modalSuccessVisible || modalErrorVisible) && (
                <>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalErrorVisible}
                    onRequestClose={() => {
                    setModalErrorVisible(!modalErrorVisible);
                    }}
                >
                    <View style={[styles.centeredView, {justifyContent: "center", alignItems: "center"}]}>
                        <View style={styles.modalView}>
                            <View style={{ display:'flex', flexDirection: 'row' }}>
                                <MaterialCommunityIcons
                                    name="close-circle-outline"
                                    size={30}
                                    color={"#ff6347"}
                                    style={{ position: 'absolute', top: -6, left: -35}}
                                />
                                <Text style={styles.modalText}>Error:</Text>
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
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalSuccessVisible}
                    onRequestClose={() => {
                    setModalSuccessVisible(!modalSuccessVisible);
                    }}
                >
                    <View style={[styles.centeredView, {justifyContent: "center", alignItems: "center"}]}>
                        <View style={styles.modalView}>
                            <View style={{ display:'flex', flexDirection: 'row' }}>
                                <MaterialCommunityIcons
                                    name="check-circle-outline"
                                    size={30}
                                    color={"#9acd32"}
                                    style={{ position: 'absolute', top: -6, left: -35}}
                                />
                                <Text style={styles.modalText}>Success:</Text>
                            </View>
                            <Text style={styles.modalText}>Collaborator's updated in course</Text>
                            <Pressable
                            style={[styles.buttonModal, {backgroundColor: "#9acd32"}]}
                            onPress={() => {
                                setModalSuccessVisible(!modalSuccessVisible)}}
                            >
                                <Text style={styles.textStyle}>Ok</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                </>
            )}
            {loading && (
                <View style={{flex:1, justifyContent: 'center'}}>
                    <ActivityIndicator style={{ margin: '50%' }} color="lightblue" animating={loading} size="large" />
                </View>
            )}
            {!loading && (
                <ScrollView>
                    <View style={styles.titlesWrapper}>
                        <View>
                            <Image source={{uri: item.profile_picture}} style={styles.titlesImage} />
                        </View>
                        <View style={styles.titleWrapper}>
                            <Text style={styles.titlesTitle}>{item.name}</Text>
                            <View style={{ display:'flex', flexDirection: 'row' }}>
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    rating={rating.rating}
                                    containerStyle={{ width: '30%'}}
                                    starSize={20}
                                    fullStarColor='gold'
                                />
                                <Text style={{ position: 'absolute', left: 100, top: 0, fontSize: 16 }}>{`(${rating.amount})`}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.descriptionWrapper}>
                        <Text style={styles.description}>{item.description}</Text>
                    </View>
                    <View style={styles.buttonsWrapper}>
                        {rol === "instructor" && (
                            <>
                            <View style={styles.buttonsContainer}>
                                <TouchableOpacity
                                    onPress={() => {handleSubmitAddCollaborator()}}
                                    style={styles.buttonIcon}
                                >
                                    <MaterialCommunityIcons
                                        name="account-plus-outline"
                                        size={25}
                                        color={'black'}
                                    />
                                    {/* <Text style={styles.buttonText}>Add a collaborator</Text> */}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {handleSubmitRemoveCollaborator()}}
                                    style={styles.buttonIcon}
                                >
                                    <MaterialCommunityIcons
                                        name="account-remove-outline"
                                        size={25}
                                        color={'black'}
                                    />
                                    {/* <Text style={styles.buttonText}>Remove a collaborator</Text> */}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {props.navigation.navigate('Edit Modules', {
                                        course: item,
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
                            </>
                        )}
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
                    <View style={{paddingHorizontal: 5}}>
                        <Text style={styles.collaboratorTitle}>Collaborators:</Text>
                        {collaboratorsData.length === 0 && (
                            <>
                            {spinner && (
                                <ActivityIndicator style={{ margin: '50%' }} color="lightblue" animating={spinner} />
                            )}
                            {!spinner && (
                                <Text style={styles.collaboratorText}>This course doesn't have any collaborators add one to see them here.</Text>
                            )}
                            </>
                        )}
                    </View>
                    <View style={styles.cardWrapper}>
                        {spinner && (
                            <ActivityIndicator style={{ margin: '50%' }} color="lightblue" animating={spinner} />
                        )}
                        {!spinner && (
                            <>
                            {collaboratorsData.map(item => (
                                <ProfilesListComponent 
                                item={item}
                                navigation={props.navigation}/>
                            ))}
                            </>
                        )}
                    </View>
                </ScrollView>
            )}
        </View>
      );
};

const styles = new StyleSheet.create({
    container: {
        flex: 1,
    },
    descriptionWrapper: {
        paddingHorizontal: 15,
    },
    description: {
        fontSize: 16,
    },
    titlesWrapper: {
        flexDirection: "row",
        paddingVertical:25,
        paddingHorizontal: 15,
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
    examsList: {
        marginBottom: 5,
        marginLeft: 10,
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
    collaboratorTitle:{
        fontSize: 16,
        color: 'black',
        fontWeight: "bold",
        marginTop: 10,
    },
    collaboratorText: {
        marginTop: 15,
        fontWeight: '300',
        fontSize: 16,
        paddingBottom: 5,
    },
    centeredView: {
        flex: 1,
        //flexDirection: 'column',
        //marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        paddingHorizontal: 35,
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
    buttonAttention: {
        backgroundColor: "#87ceeb",
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
});

export default EditCourseScreen;
