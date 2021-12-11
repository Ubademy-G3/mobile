import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView, TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { app } from '../app/app';
import { Video, AVPlaybackStatus } from 'expo-av';
import * as ImagePicker from "expo-image-picker";
import { DeleteMediaEndpoint } from '../communication/endpoints/DeleteMediaEndpoint';

Feather.loadFont();
MaterialCommunityIcons.loadFont();

const EditModulesScreen = (props) => {
    const param_course_id = props.route.params ? props.route.params.id : 'defaultID';

    const param_course_name = props.route.params ? props.route.params.course_name : 'defaultName';

    const [loading, setLoading] = useState(false);

    const [modules, setModules] = useState([]);

    const video = React.useRef(null);
    
    const [status, setStatus] = React.useState({});

    //const [mediaUrl, setMediaUrl] = useState(['http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4','https://firebasestorage.googleapis.com/v0/b/ubademy-mobile.appspot.com/o/bbc1a3dc-f982-4cd7-ba6a-a6d6a593b754.mp4?alt=media&token=341a0345-88c7-4450-88e2-65c5e6704c61']);

    const handleApiResponseCreateModule = () => {
        console.log("[Edit Modules screen] create module: ", response.content())
        if (!response.hasError()) {
            setModules(modules => [...modules, {
                saved_module: false,
                new_module: true,
                id: response.content().id,
                title: response.content().title,
                content: response.content().content,
                media_id: response.content().media_id,
            }]);
        } else {
            console.log("[Edit Modules screen] error", response.content().message);
        }   
    }

    const handleApiResponseUpdateModule = () => {
        console.log("[Edit Modules screen] update module: ", response.content())
        if (!response.hasError()) {
        } else {
            console.log("[Edit Modules screen] error", response.content().message);
        }   
    }

    const handleApiResponseDeleteModule = () => {
        console.log("[Edit Modules screen] delete module: ", response.content())
        if (!response.hasError()) {
        } else {
            console.log("[Edit Modules screen] error", response.content().message);
        }   
    }

    const handleSaveModule = async (key) => {
        //pegar al back y updeatear
        let tokenLS = await app.getToken();
        const _modules = [...modules];
        _modules[key].saved_module = false,
        await app.apiClient().updateModule(
            {
                token: tokenLS,
                title: _modules[key].title,
                media_id: _modules[key].media_id,
                content: _modules[key].content,
            }, param_course_id, _modules[key].id, handleApiResponseUpdateModule); 
        setModules(_modules)
    }

    const addModule = async () => {
        let tokenLS = await app.getToken();
        await app.apiClient().createNewModule(
            {
                token: tokenLS,
                title: "",
                media_id: [],
                content: "",
            }, param_course_id, handleApiResponseCreateModule);

        //pega al back y crea
        /*setModules(modules => [...modules, {
        saved_module: false,
        new_module: true,
        title: "",
        content: "",
        media_id: [],
        }]);*/
    }

    const editModule = (key) => {
        const _modules = [...modules];
        _modules[key].saved_module = false;
        setModules(_modules);
    }

    const handleInputTitle = (text, key) => {
        const _modules = [...modules];
        _modules[key].title = text;
        setModules(_modules);
    }

    const handleInputDescription = (text, key) => {
        const _modules = [...modules];
        _modules[key].content = text;
        setModules(_modules);
    }

    const deleteModule = async(key) => {
        let tokenLS = await app.getToken();
        //pegar al back y borrar
        await app.apiClient().deleteModule({token: tokenLS}, param_course_id, modules[key].id, handleApiResponseDeleteModule);
        const _modules = modules.filter((input,index) => index != key);
        setModules(_modules);
    }

    const onRefresh = async () => {
    };
  
    useEffect(() => {
        console.log("[Edit Modules screen] entro a useEffect");
        onRefresh();
    }, []);

    const deleteMedia = async (key) => {
        let tokenLS = await app.getToken();
        await app.apiClient.deleteMediaFromCourse({token: tokenLS}, param_course_id, )
    }

    const chooseVideoFromLibrary = async (key) => {
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        });
        console.log("CARGO UNA IMAGEN:", pickerResult);
        const mediaUri = Platform.OS === 'ios' ? pickerResult.uri.replace('file://', '') : pickerResult.uri;
        console.log("Media URi:", mediaUri);  
        uploadMediaOnFirebase(mediaUri, key);
    }
    
    const uploadMediaOnFirebase = async (mediaUri, key) => {
        const uploadUri = mediaUri;
        console.log("uploadUri:", uploadUri);
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
        console.log("filename:", filename); 
        
        Alert.alert(
            'Please wait',
            'Your image is uploading'
        );

        try{
            const response = await fetch(uploadUri);
            const blob = await response.blob();
            const task = firebase.default.storage().ref(filename);
            await task.put(blob);
            const newURL = await task.getDownloadURL();          
            console.log("NUEVO URL:", newURL);
            const _modules = [...modules];
            const newList = _modules[key].media_id;
            newList.push(newURL);
            _modules[key].media_id = newList;
            setModules(_modules);
            Alert.alert(
                'Image Uploaded',
                'Your image has been uploaded'
            );
        } catch(err) {
            console.log("Error en el firebase storage:", err);
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.titlesTitle}>{param_course_name}</Text>
                {modules.map((item, key) => (
                    <>
                    {item.saved_module === true && (
                        <View style={styles.courseCardWrapper}>
                            <TouchableOpacity
                                onPress = {()=> {editModule(key)}}
                                style={styles.moduleWrapper}
                            >
                                <View style={styles.moduleView}>
                                    <Text style={styles.examModule}>{item.title}</Text>
                                </View>
                                <MaterialIcons
                                    name="edit"
                                    size={20}
                                    color={'black'}
                                    style={styles.buttonEditIconRight}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                    {item.saved_module === false && (
                        <>
                            <View style={styles.moduleContainer}>
                                <View style={styles.inputContainer}>
                                    <TextInput 
                                        placeholder={"Enter Title"}
                                        value={item.title} 
                                        onChangeText={(text) => handleInputTitle(text,key)}
                                        style={styles.inputTitle}
                                    />
                                    <TextInput 
                                        placeholder={"Enter Description"}
                                        multiline = {true}
                                        value={item.module} 
                                        onChangeText={(text) => handleInputDescription(text,key)}
                                        style={styles.input}
                                    />
                                </View>
                                <View style={styles.buttonsRightWrapper}>
                                    <TouchableOpacity
                                        onPress = {() => handleSaveModule(key)}
                                        style={styles.buttonSaveIconRight}
                                    >
                                        <MaterialCommunityIcons
                                            name="content-save"
                                            size={20}
                                            color={'black'}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                            onPress = {()=> {chooseVideoFromLibrary(key)}}
                                            style={[styles.buttonSaveIconRight]}
                                        >
                                            <MaterialCommunityIcons
                                                name="video-plus-outline"
                                                size={20}
                                                color={'black'}
                                            />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress = {()=> deleteModule(key)}
                                        style={styles.buttonInputIcon}
                                    >
                                        <MaterialCommunityIcons
                                            name="trash-can-outline"
                                            size={20}
                                            color={'black'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {mediaUrl.map((media_item,media_key) => (
                                <View style={styles.containerVideo}>
                                    <Video
                                        ref={video}
                                        style={styles.video}
                                        source={{uri: media_item}}
                                        resizeMode="contain"
                                        isLooping
                                        useNativeControls={true}
                                        shouldPlay={true}
                                        onPlaybackStatusUpdate={status => setStatus(() => status)}
                                    />
                                <View style={styles.buttons}>
                                    <Button
                                    title={"Delete"}
                                    onPress={deleteMedia(key, media_key)}
                                    />
                                    </View>
                                </View>
                            ))}
                        </>
                    )}
                    </>
                ))}
                <View style={[styles.container, {paddingTop: 0}]}>
                    <View style={[styles.courseCardWrapper, {backgroundColor: '#87ceeb', justifyContent: 'center'}]}>
                        <TouchableOpacity
                            onPress = {()=> {addModule()}}
                            style={styles.moduleWrapper}
                        >
                            <View style={styles.addModuleView}>
                                <Text style={styles.buttonText}>Add Unit</Text>
                                <Feather
                                    name="plus"
                                    size={20}
                                    color={'white'}
                                    style={styles.buttonEditIconRight}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
      );
};

const styles = new StyleSheet.create({
    container: {
        flex: 1,
    },
    titlesTitle: {
        flex: 1, 
        flexWrap: 'wrap',
        color:'#87ceeb',
        fontWeight: '700',
        fontSize: 24,
    },
    container: {
        flex: 1,
        paddingTop: 10,
        paddingLeft: 10,
        //width:'90%',
        //paddingTop: 25,
        //paddingLeft: 15,
    },
    moduleView: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    addModuleView: {
        flexDirection: 'row',
    },
    fadedButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 5,
    },
    buttonFadedText: {
        color:'#87ceeb',
        fontWeight: '700',
        fontSize: 16,
        //textDecorationLine: 'underline',
    },
    examTitle: {
        color:'#87ceeb',
        fontWeight: '700',
        fontSize: 24,
    },
    examsText: {
        marginTop: 15,
        fontWeight: '300',
        fontSize: 16,
        paddingBottom: 5,
        marginLeft: 5,
    },
    examDescritpionWrapper: {
        //marginTop:5,
        justifyContent: 'center',
    },
    examDescription: {
        color:'black',
        fontWeight: '400',
        fontSize: 16,
        //marginTop:5,
    },
    examModule: {
        color:'black',
        fontWeight: '400',
        fontSize: 16,
        marginTop:5,
        width:250,
    },
    courseCardWrapper: {
        backgroundColor: 'white',
        width: 320,
        borderRadius: 25,
        paddingVertical: 8,
        paddingLeft: 20,
        marginTop: 10,
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
    stateCardWrapper: {
        backgroundColor: '#87ceeb',
        width: 150,
        borderRadius: 25,
        paddingVertical: 8,
        paddingLeft: 20,
        marginTop: 10,
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,  
    },
    courseCardTop: {
        //marginLeft: 20,
        //paddingRight: 40,
        marginTop: 8,
        alignItems: 'center',
        //marginRight: 80,
    },
    courseDescriptionWrapper: {
        paddingLeft: 120,
        //paddingRight: 40,
        flexDirection: 'column',
        alignItems: 'flex-end',
        //marginRight: 80,
    },
    courseTitleDescription: {
        paddingBottom: 3,
        color:'black',
        fontWeight: '300',
        fontSize: 12,
    },
    buttonEditIconRight: {
        marginLeft: 10,
    },
    moduleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonWrapper: {
        marginBottom: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: `#87ceeb`,
        width: '45%',
        padding: 15,
        borderRadius: 30,
        marginHorizontal: 10,
    },
    buttonText: {
        color:'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonSaveMC: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
    },
    inputsContainer: {
        //flex: 1, 
        //marginBottom: 20,
    },
    moduleContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
    },
    inputContainer: {
        flexDirection: 'column',
        width: '80%',
    },
    wrapperOptionsInChoice: {
        flexDirection: 'row',
    },
    input: {
        backgroundColor:'white',
        paddingHorizontal: 15,
        paddingVertical: 62,
        borderRadius: 10,
        marginTop: 5,
        textAlignVertical: 'top'
    },
    inputTitle: {
        backgroundColor:'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    inputName: {
        width:'80%',
        backgroundColor:'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 15,
        
    },
    buttonDelete: {
        color: "red",
        fontSize: 16,
        fontWeight: '400',
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginTop: 5,
    },
    buttonInputWrapper: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        //marginHorizontal: 10,
    },
    buttonInputIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `#87ceeb`,
        padding: 10,
        borderRadius: 10,
        marginRight: 5,
        marginHorizontal: 20,
    },
    buttonSaveIconRight: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        backgroundColor: `#87ceeb`,
        padding: 10,
        borderRadius: 10,
        marginRight: 5,
        marginHorizontal: 20,
    },
    buttonInput: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `#87ceeb`,
        width: '45%',
        padding: 10,
        borderRadius: 10,
        marginRight: 5,
    },
    buttonInputText: {
        color:'white',
        fontWeight: '400',
        fontSize: 16,
    },
    buttonsRightWrapper: {
        flexDirection: 'column',
        //alignItems: 'center',
        //justifyContent: 'center',
    },
    textAnswer: {
        fontWeight: '700',
        fontSize: 16,
        paddingBottom: 5,
    },
    choiceText: {
        fontWeight: '300',
        fontSize: 16,
        paddingTop: 5,
    },
    buttonName: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `#87ceeb`,
        width: '45%',
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 10,
        
    },
    nameWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        //flexDirection: 'column',
        paddingVertical: 15,
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
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EditModulesScreen;