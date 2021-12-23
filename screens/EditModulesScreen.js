import React, { useState, useEffect } from 'react';
import { Modal, Pressable, Text, View, Button, Image, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { app } from '../app/app';
import { Video } from 'expo-av';
import * as ImagePicker from "expo-image-picker";
import { firebase } from '../firebase';
import { ActivityIndicator } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';

Feather.loadFont();
MaterialCommunityIcons.loadFont();
MaterialIcons.loadFont();

const levels = ["easy", "medium", "hard"];

const EditModulesScreen = (props) => {
    const param_course = props.route.params.course;
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [modalAttentionVisible, setModalAttentionVisible] = useState(false);
    const [modalAttentionTitle, setModalAttentionTitle] = useState("");
    const [modalAttentionText, setModalAttentionText] = useState("");
    const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
    const [modalSuccessText, setModalSuccessText] = useState("");
    const [loading, setLoading] = useState(false);
    const [modules, setModules] = useState(null);
    const [media, setMedia] = useState(null);
    //const [modulesIds, setModulesIds] = useState([]);
    const [updatingModules, setUpdatingModules] = useState(false);
    const [updatingModules2, setUpdatingModules2] = useState(false);
    const [course, setCourse] = useState(param_course);
    
    const handleApiResponseCreateModule = (response) => {
        console.log("[Edit Modules screen] create module: ", response.content())
        if (!response.hasError()) {
            setModules(modules => [...modules, {
                id: response.content().id,
                saved_module: false,
                new_module: true,
                title: response.content().title,
                content: response.content().content,
                media_id: response.content().media_id,
                media_url: []
            }]);
        } else {
            console.log("[Edit Modules screen] error", response.content().message);
        }   
    }

    const handleDeleteMedia = (response) => {
        console.log("[Edit Modules screen] delete media by id: ", response.content())
        if (!response.hasError()) {
            setMedia(response.content().course_media);
        } else {
            console.log("[Edit Modules screen] error", response.content().message);
        }   
    }

    const handleGetMedia = async (response) => {
        console.log("[Edit Modules screen] get media by module: ", response.content())
        if (!response.hasError()) {
            /*let centinela = 0;            
            for(let module of modules){                
                if(module.id === response.content().module_id){
                    const newmodule = [...modules];
                    newmodule[centinela].media_url = response.content().course_media;
                    setModules(newmodule);
                }
                centinela = centinela + 1;
            }*/
            console.log("RESPONSE:")
            console.log(response.content().course_media)
            setMedia(response.content().course_media);
        } else {
            console.log("[Edit Modules screen] error", response.content().message);
        }   
    }

    const handleCreateMedia = (response) => {
        console.log("[Edit Modules screen] create media by module: ", response.content())
        if (response.hasError()) {
            console.log("[Edit Modules screen] error", response.content().message);
        }
    }    

    const handleGetModules = async (response) => {
        console.log("[Edit Modules screen] set module: ", response.content())
        if (!response.hasError()) {           
            /*setModules(modules => [...modules, {
                id: response.content().id,      
                saved_module: true,
                new_module: false,
                title: response.content().title,
                media_id: response.content().media_id,
                media_url: [],
                content: response.content().content
            }            
            ]);*/
            let mod = response.content().modules;
            console.log(mod);
            mod = mod.map(element => {
                element.saved_module = true,
                element.new_module = false;
                return element;
            });
            setModules(mod);
            setUpdatingModules(true);                 
        } else {
            console.log("[Edit Modules screen] error", response.content().message);
        }   
    }

    /*const funcionauxiliar = async () => {
        let tokenLS = await app.getToken();
        for(let module of modules){
            if (module.media_url.length === 0){                 
                await app.apiClient().getMediaByModule({token: tokenLS}, param_course_id, module.id, handleGetMedia);                
                
            }
        }
    }*/

    useEffect(() => {
        onRefresh()
        setUpdatingModules2(false);              
    }, [updatingModules2]);

    const handleUpdateCourse = (response) => {
        console.log("[Edit Modules screen] update course: ", response.content());
        if (!response.hasError()) {
            console.log("[Edit Modules Screen] ok");
        } else {
            console.log("[Edit Modules Screen] error", response.content().message);
        } 
    }

    const handleApiResponseUpdateModule = (response) => {
        console.log("[Edit Modules screen] update module: ", response.content())
        if (!response.hasError()) {
            console.log("[Edit Modules Screen] ok");
        } else {
            console.log("[Edit Modules Screen] error", response.content().message);
        }   
    }

    const handleApiResponseDeleteModule = (response) => {
        console.log("[Edit Modules screen] delete module: ", response.content())
        if (!response.hasError()) {
            console.log("[Edit Modules Screen] ok");
        } else {
            console.log("[Edit Modules Screen] error", response.content().message);
        }   
    }

    /*const handleGetCourseData = (response) => {
        console.log("[Edit Modules Screen] content: ", response.content())
        if (!response.hasError()) {
               setModulesIds(response.content().modules);
               setCourse(response.content());
        } else {
            console.log("[Edit Modules Screen] error", response.content().message);
        }
    }*/

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
            }, param_course.id, _modules[key].id, handleApiResponseUpdateModule); 
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
            }, param_course.id, handleApiResponseCreateModule);        
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
        await app.apiClient().deleteModule({token: tokenLS}, param_course.id, modules[key].id, handleApiResponseDeleteModule);
        const _modules = modules.filter((input,index) => index != key);
        setModules(_modules);
    } 

    const handleSubmitEditCourse = async () => {
        let tokenLS = await app.getToken();
        await app.apiClient().updateCourse(
            {
                token: tokenLS,
                name: course.name,
                description: course.description,
                profile_picture: course.profile_picture,
                location: course.location,
                duration: course.duration,
                lenguage: course.lenguage,
                level: course.level,
            }, param_course.id, handleUpdateCourse);
    }

    const onRefresh = async () => {
        setLoading(true);
        let tokenLS = await app.getToken();
        console.log("[Edit Modules] token:", tokenLS);
        await app.apiClient().getAllModules({ token: tokenLS }, param_course.id, handleGetModules);
        console.log("MODULES SALE BIEN")
        await app.apiClient().getAllMedia({ token: tokenLS }, param_course.id, handleGetMedia);
        console.log("COURSESS", course);
        setLoading(false);
    };

    /*const getAllModules = async () => {
        let tokenLS = await app.getToken();
        for (let module_id of modulesIds){
            await app.apiClient().getModuleById({token: tokenLS}, param_course_id, module_id, handleGetModule);          
        }
    }*/

    /*useEffect(() => {
        console.log("[Edit Modules screen] useEffect modulesIds");
        console.log("[Edit Modules] modules:", modulesIds);
        getAllModules();
    }, [modulesIds]);*/
  
    useEffect(() => {
        console.log("[Edit Modules screen] entro a useEffect");
        onRefresh();
    }, []);    

    const deleteMedia = async (id, module_key) => {
        let tokenLS = await app.getToken();
        await app.apiClient().deleteMediaFromCourse({token: tokenLS}, param_course.id, id, handleDeleteMedia)
        const newmodule = [...modules];
        newmodule[module_key].media_url = [];
        setModules(newmodule);
        setUpdatingModules2(true);
        setModalSuccessText("Your video was deleted succesfully");
        setModalSuccessVisible(true);
        /* Alert.alert(
            'Video deleted',
            ''
        ); */
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
        setModalAttentionTitle("Please wait:");
        setModalAttentionText("Your video is uploading");
        setModalAttentionVisible(true);
        /* Alert.alert(
            'Please wait',
            'Your video is uploading'
        ); */

        try {
            const response = await fetch(uploadUri);
            const blob = await response.blob();
            const task = firebase.default.storage().ref(filename);
            await task.put(blob);
            const newURL = await task.getDownloadURL();          
            console.log("NUEVO URL:", newURL);
            let tokenLS = await app.getToken();
            await app.apiClient().addMedia({token: tokenLS, url: newURL, module_id: modules[key].id},param_course.id, handleCreateMedia)//crear media
            const newmodule = [...modules];
            newmodule[key].media_url = [];
            setModules(newmodule);
            setUpdatingModules2(true);
            setModalAttentionTitle("Video Uploaded:");
            setModalAttentionText("Your video has been uploaded");
            setModalAttentionVisible(true);
            /* Alert.alert(
                'Video Uploaded',
                'Your video has been uploaded'
            ); */
        } catch(err) {
            console.log("Error en el firebase storage:", err);
        }
    }

    const choosePhotoFromLibrary = async () => {
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
          });
        console.log("CARGO UNA IMAGEN:", pickerResult);
        const mediaUri = Platform.OS === 'ios' ? pickerResult.uri.replace('file://', '') : pickerResult.uri;
        console.log("MedsePhotoFroma URi:", mediaUri);  
        uploadPhotoOnFirebase(mediaUri);
    }
    
    const uploadPhotoOnFirebase = async (mediaUri) => {
        const uploadUri = mediaUri;
        console.log("uploadUri:", uploadUri);
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
        console.log("filename:", filename); 
        setModalAttentionTitle("Please wait:");
        setModalAttentionText("Your image is uploading");
        setModalAttentionVisible(true); 

        try {
            const response = await fetch(uploadUri);
            const blob = await response.blob();
            const task = firebase.default.storage().ref(filename);
            await task.put(blob);
            const newURL = await task.getDownloadURL();          
            console.log("NUEVO URL:", newURL);
            setCourse({
                ...course,
                profile_picture: newURL,
            })            
            setModalAttentionTitle("Image Uploaded:");
            setModalAttentionText("Your image has been uploaded");
            setModalAttentionVisible(true);
            /* Alert.alert(
                'Image Uploaded',
                'Your image has been uploaded'
            ); */
        } catch(err) {
            console.log("Error en el firebase storage:", err);
        }
    }

    const getMediaFromModule = (id) => {
        const m = media.filter((m) => {
            return m.module_id === id
        });
        return m;
    };

    return (
        <View style={styles.centeredView}>
            {(modalSuccessVisible || modalAttentionVisible) && (
                <View style={{justifyContent: 'center', alignItems: 'center',}}>
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
                                <Text style={styles.modalText}>Successfull deleted video:</Text>
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
                                <Text style={styles.modalText}>{modalAttentionTitle}</Text>
                            </View>
                            <Text style={styles.modalText}>{modalAttentionText}</Text>
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
            <ScrollView>
                {loading && (
                    <ActivityIndicator style={{ margin: '50%' }} color="lightblue" />
                )}
                {!loading && modules && media && (
                    <>
                        <View style={styles.courseContainer}>
                            <TouchableOpacity
                                onPress={() => {choosePhotoFromLibrary()}}
                                disabled={loading}
                            >
                                <View style={{ display:'flex', flexDirection: 'row' }}>
                                    <Image source={{uri: course.profile_picture}} style={styles.titlesImage} />
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
                                    placeholder={course.name}
                                    onChangeText={text => setCourse({
                                        ...course,
                                        name: text,
                                    })}
                                    value={course.name}
                                    multiline={true}
                                    style={styles.inputCourse}
                                />
                                <Text style={styles.inputText}>Description</Text>
                                <TextInput
                                    placeholder={course.description}
                                    onChangeText={text => setCourse({
                                        ...course,
                                        description: text,
                                    })}
                                    value={course.description}
                                    multiline={true}
                                    style={styles.inputCourse}
                                />
                                <Text style={styles.inputText}>Location</Text>
                                <TextInput
                                    placeholder={course.location}
                                    onChangeText={text => setCourse({
                                        ...course,
                                        location: text,
                                    })}
                                    value={course.location}
                                    style={styles.inputCourse}
                                />
                                <Text style={styles.inputText}>Duration</Text>
                                <TextInput
                                    placeholder={`${course.duration}`}
                                    onChangeText={text => setCourse({
                                        ...course,
                                        duration: text.replace(/[^0-9]/g, ''),
                                    })}
                                    value={`${course.duration}`}
                                    style={styles.inputCourse}
                                />
                                <Text style={styles.inputText}>Language</Text>
                                <TextInput
                                    placeholder={course.language}
                                    onChangeText={text => setCourse({
                                        ...course,
                                        language: text,
                                    })}
                                    value={course.language}
                                    style={styles.inputCourse}
                                />
                                <Text style={styles.inputText}>Level</Text>
                                <SelectDropdown
                                    data={levels}
                                    onSelect={(selectedItem, index) => setCourse({
                                        ...course,
                                        level: selectedItem,
                                    })}
                                    value={course.level}
                                    defaultButtonText={"Select a level type"}
                                    buttonStyle={styles.buttonDropdown}
                                    buttonTextStyle={styles.textDropdown}
                                    renderDropdownIcon={() => {
                                        return (
                                        <Feather name="chevron-down" color={"#444"} size={18} />
                                        );
                                    }}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={() => {handleSubmitEditCourse()}}
                                style={styles.button}
                                disabled={loading}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginLeft: 20}}>
                            <Text style={styles.titlesTitle}>Edit units</Text>
                            <>
                                {modules.map((item, key) => (
                                    <View key={item.id}>
                                        {item.saved_module && (
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
                                        {!item.saved_module && (
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
                                                            value={item.content} 
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
                                                {getMediaFromModule(item.id).map((media_item, media_key) => (
                                                    <View style={styles.containerVideo}>
                                                        {console.log("MEDIA ITEM")}
                                                        {console.log(media_item)}
                                                        <Video
                                                            ref={video}
                                                            style={styles.video}
                                                            source={{uri: media_item.url}}
                                                            resizeMode="contain"
                                                            useNativeControls={true}
                                                            shouldPlay={false}
                                                            onPlaybackStatusUpdate={status => setStatus(() => status)}
                                                        />
                                                    <View style={styles.buttons}>
                                                        <Button
                                                            title={"Delete"}
                                                            onPress={() => {deleteMedia(media_item.id, key)}}
                                                        />
                                                        </View>
                                                    </View>
                                                ))}
                                            </>
                                        )}
                                    </View>
                                ))}
                            </>
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
                        </View>
                    </>
                )}
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
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `#87ceeb`,
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
    titlesImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    /* inputContainer: {
        width:'80%',
    }, */
    inputCourse: {
        backgroundColor:'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    inputMultiSelect : {
        backgroundColor:'white',
        paddingHorizontal: 15,
        //paddingVertical: 5,
        borderRadius: 10,
        marginTop: 5,
    },
    inputText: {
        color:'#87ceeb',
        fontWeight: '700',
        fontSize: 16,
        //paddingVertical: 5,
        paddingTop:10,
    },
    courseContainer: {
        //paddingLeft: 15,
        paddingBottom:15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: {
        flex: 1,
        /* justifyContent: "center",
        alignItems: "center" */
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

export default EditModulesScreen;




