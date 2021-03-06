import React, {useState, useCallback} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Modal, Pressable } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { app } from '../../app/app';
import * as ImagePicker from "expo-image-picker";
import { firebase } from '../../firebase';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const subscriptions = ["free", "gold", "platinum"];
const levels = ["easy", "medium", "hard"];

const MenuCreateNewCourseScreen = (props) => {
    const [courseData, setData] = useState({
        user_id: "",
        name: "",
        description: "",
        category: 0,
        subscription_type: "",
        location: "",
        profile_picture: "https://firebasestorage.googleapis.com/v0/b/ubademy-mobile.appspot.com/o/icon.png?alt=media&token=7fd2278c-dd3d-443c-9a86-bacca98ef702",
        duration: "",
        language: "",
        level: "",
        modules: [],
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalAttentionVisible, setModalAttentionVisible] = useState(false);
    const [modalErrorVisible, setModalErrorVisible] = useState(false);
    const [modalErrorText, setModalErrorText] = useState(false);
    const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
    const [modalSuccessText, setModalSuccessText] = useState(false);

    const choosePhotoFromLibrary = async () => {
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
          });
        const mediaUri = Platform.OS === 'ios' ? pickerResult.uri.replace('file://', '') : pickerResult.uri;
        uploadMediaOnFirebase(mediaUri);
    }
    
    const uploadMediaOnFirebase = async (mediaUri) => {
        const uploadUri = mediaUri;
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

        try{
            const response = await fetch(uploadUri);
            const blob = await response.blob();
            const task = firebase.default.storage().ref(filename);
            await task.put(blob);
            const newURL = await task.getDownloadURL();
            setData({
                ...courseData,
                profile_picture: newURL,
            })
            setModalAttentionVisible(true);
        } catch(err) {
            console.log("Error en el firebase storage:", err);
        }
    }

    const setCategorySelected = (name, idx) => {
        let category_id = categories[idx].id;
        setData({
            ...courseData,
            category: category_id,
        });
    }

    const handleApiResponseCreateCourse = (response) => {
        if (!response.hasError()) {
            setModalSuccessText(response.content().message);
            setModalSuccessVisible(true);
        } else {
            if (response.content().status === 422) {
                setModalErrorText("Invalid fields");
            } else{
                setModalErrorText(response.content().message);
            }
            setModalErrorVisible(true);
            console.log("[Create Course screen] error", response.content().message);
        }
    }

    const handleApiResponseGetCategories = (response) => {
        if (!response.hasError()) {
            setCategories(response.content())
        } else {
            setModalErrorText(response.content().message);
            setModalErrorVisible(true);
            console.log("[Create Course screen] error", response.content().message);
        }
    }

    const handleSubmitCreateNewCourse = async () =>{
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        await app.apiClient().createCourse({
            user_id: idLS,
            name: courseData.name,
            description: courseData.description,
            category: courseData.category,
            subscription_type: courseData.subscription_type,
            location: courseData.location,
            profile_picture: courseData.profile_picture,
            duration: courseData.duration,
            language: courseData.language,
            level: courseData.level,
            modules: courseData.modules,
            total_exams: courseData.total_exams,
            token: tokenLS}, handleApiResponseCreateCourse);
        setData({
            user_id: idLS,
            name: "",
            description: "",
            category: 0,
            subscription_type: "",
            location: "",
            profile_picture: "https://firebasestorage.googleapis.com/v0/b/ubademy-mobile.appspot.com/o/icon.png?alt=media&token=7fd2278c-dd3d-443c-9a86-bacca98ef702",
            duration: "",
            language: "",
            level: "",
            modules: [],
            total_exams: 0,
        })
        setLoading(false);
    }

    const onRefresh = async () => { 
        setLoading(true);
        let tokenLS = await app.getToken();
        await app.apiClient().getAllCategories({token: tokenLS}, handleApiResponseGetCategories);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            onRefresh();
        }, [])
    );
    
    return (
        <View style={styles.centeredView}>
            {(modalSuccessVisible || modalErrorVisible || modalAttentionVisible) && (
                <View style={{justifyContent: 'center', alignItems: 'center',}}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalErrorVisible}
                    onRequestClose={() => {
                    setModalErrorVisible(!modalErrorVisible);
                    }}
                >
                    <View style={[styles.centeredView, {justifyContent: 'center', alignItems: 'center',}]}>
                        <View style={styles.modalView}>
                            <View style={{ display:'flex', flexDirection: 'row' }}>
                                <MaterialCommunityIcons
                                    name="close-circle-outline"
                                    size={30}
                                    color={"#ff6347"}
                                    style={{ position: 'absolute', top: -6, left: -35}}
                                />
                                <Text style={styles.modalText}>Create Course Unsuccesfull:</Text>
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
                    <View style={[styles.centeredView, {justifyContent: 'center', alignItems: 'center',}]}>
                        <View style={styles.modalView}>
                            <View style={{ display:'flex', flexDirection: 'row' }}>
                                <MaterialCommunityIcons
                                    name="check-circle-outline"
                                    size={30}
                                    color={"#9acd32"}
                                    style={{ position: 'absolute', top: -6, left: -35}}
                                />
                                <Text style={styles.modalText}>Create Course Succesfull:</Text>
                            </View>
                            <Text style={styles.modalText}>{modalSuccessText}</Text>
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
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalAttentionVisible}
                    onRequestClose={() => {
                    setModalAttentionVisible(!modalAttentionVisible);
                    }}
                >
                    <View style={[styles.centeredView,{justifyContent: 'center', alignItems: 'center',}]}>
                        <View style={styles.modalView}>
                            <View style={{ display:'flex', flexDirection: 'row' }}>
                                <MaterialCommunityIcons
                                    name="alert-circle-outline"
                                    size={30}
                                    color={"#87ceeb"}
                                    style={{ position: 'absolute', top: -6, left: -35}}
                                />
                                <Text style={styles.modalText}>Image Uploaded:</Text>
                            </View>
                            <Text style={styles.modalText}>Your image has been uploaded</Text>
                            <Pressable
                            style={[styles.buttonModal, styles.buttonAttention]}
                            onPress={() => setModalAttentionVisible(!modalAttentionVisible)}
                            >
                                <Text style={styles.textStyle}>Ok</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                </View>
            )}
            {
            loading ? 
                <View style={{flex:1, justifyContent: 'center'}}>
                    <ActivityIndicator style={{ margin: '50%' }} color="lightblue" animating={loading} size="large" />
                </View>
            :
                <>
                <ScrollView>
                <KeyboardAvoidingView
                style={styles.containerWrapper}
                behavior={Platform.OS === "ios" ? "padding" : "padding"}
                >
                    <TouchableOpacity
                        onPress={() => {choosePhotoFromLibrary()}}
                        disabled={loading}
                    >
                        <View style={{ display:'flex', flexDirection: 'row' }}>
                            <Image source={{uri: courseData.profile_picture}} style={styles.logoImage} />
                            <MaterialCommunityIcons
                                name="camera-outline"
                                size={25}
                                color={'grey'}
                                style={{position: 'absolute', right: -8, bottom: 0,}}
                            />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputText}>Course Name</Text>
                        <TextInput
                            placeholder={courseData.name}
                            onChangeText={text => setData({
                                ...courseData,
                                name: text,
                            })}
                            value={courseData.name}
                            style={styles.input}
                        />
                        <Text style={styles.inputText}>Description</Text>
                        <TextInput
                            placeholder={courseData.description}
                            onChangeText={text => setData({
                                ...courseData,
                                description: text,
                            })}
                            value={courseData.description}
                            style={styles.input}
                        />
                        <Text style={styles.inputText}>Category</Text>
                        <SelectDropdown
                            data={categories.map(function(item, idx) {return item.name;})}
                            onSelect={(selectedItem, index) => setCategorySelected(selectedItem, index)}
                            defaultButtonText={"Select a category"}
                            buttonStyle={styles.buttonDropdown}
                            buttonTextStyle={styles.textDropdown}
                            renderDropdownIcon={() => {
                                return (
                                <Feather name="chevron-down" color={"#444"} size={18} />
                                );
                            }}
                        />
                        <Text style={styles.inputText}>Subscription Type</Text>
                        <SelectDropdown
                            data={subscriptions}
                            onSelect={(selectedItem, index) => setData({
                                ...courseData,
                                subscription_type: selectedItem,
                            })}
                            value={courseData.subscription_type}
                            defaultButtonText={"Select a subscription type"}
                            buttonStyle={styles.buttonDropdown}
                            buttonTextStyle={styles.textDropdown}
                            renderDropdownIcon={() => {
                                return (
                                <Feather name="chevron-down" color={"#444"} size={18} />
                                );
                            }}
                        />
                        <Text style={styles.inputText}>Location</Text>
                        <TextInput
                            placeholder={courseData.location}
                            onChangeText={text => setData({
                                ...courseData,
                                location: text,
                            })}
                            value={courseData.location}
                            style={styles.input}
                        />
                        <Text style={styles.inputText}>Duration</Text>
                        <TextInput
                            placeholder={courseData.duration}
                            onChangeText={text => setData({
                                ...courseData,
                                duration: text.replace(/[^0-9]/g, ''),
                            })}
                            value={courseData.duration}
                            style={styles.input}
                        />
                        <Text style={styles.inputText}>Language</Text>
                        <TextInput
                            placeholder={courseData.language}
                            onChangeText={text => setData({
                                ...courseData,
                                language: text,
                            })}
                            value={courseData.language}
                            style={styles.input}
                        />
                        <Text style={styles.inputText}>Level</Text>
                        <SelectDropdown
                            data={levels}
                            onSelect={(selectedItem, index) => setData({
                                ...courseData,
                                level: selectedItem,
                            })}
                            value={courseData.level}
                            defaultButtonText={"Select a level type"}
                            buttonStyle={styles.buttonDropdown}
                            buttonTextStyle={styles.textDropdown}
                            renderDropdownIcon={() => {
                                return (
                                <Feather name="chevron-down" color={"#444"} size={18} />
                                );
                            }}
                        />
                        <Text style={styles.inputText}>Number of exams</Text>
                        <TextInput
                            placeholder={""}
                            onChangeText={text => setData({
                                ...courseData,
                                total_exams: text,
                            })}
                            value={courseData.total_exams}
                            style={styles.input}
                        />

                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={() => handleSubmitCreateNewCourse()}
                            style={styles.button}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>Create New Course</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
                </ScrollView>
                </>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    inputContainer: {
        width:'80%',
    },
    input: {
        backgroundColor:'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    inputText: {
        color:'#87ceeb',
        fontWeight: '700',
        fontSize: 16,
        paddingTop:10,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
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
    buttonDropdown: {
        width:'100%',
        height: 40,
        backgroundColor:'white',
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    textDropdown: {
        color: "#444",
        fontSize: 14,
        textAlign: 'left',
    },
    centeredView: {
        flex: 1,
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
})

export default MenuCreateNewCourseScreen;