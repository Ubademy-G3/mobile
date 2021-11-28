import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native';
import forYouData from '../../assets/data/forYouData'
import SelectDropdown from 'react-native-select-dropdown'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { app } from '../../app/app';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const subscriptions = ["free", "platinum", "gold"];
const levels = ["easy", "medium", "hard"];

const MenuCreateNewCourseScreen = (props) => {
    const [courseData, setData] = useState({
        user_id: "",
        name: "",
        description: "",
        category: 0,
        subscription_type: "",
        location: "",
        profile_picture: "",
        duration: "",
        language: "",
        level: "",
        modules: [],
    });

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(false);

    const setCategorySelected = (name, idx) => {
        console.log("[Create Course screen] name: ", name);
        console.log("[Create Course screen] idx: ", idx);
        console.log("[Create Course screen] categories array: ", categories[idx]);
        category_id = categories[idx].id;
        console.log("[Create Course screen] category id: ", category_id);
        //set category
    }

    const handleApiResponseCreateCourse = (response) => {
        console.log("[Create Course screen] response content: ", response.content())
        if (!response.hasError()) {
            Alert.alert(
                "Create Course Succesfull",
                response.content().message,
                [
                { text: "OK", onPress: () => {} }
                ]
            );
        } else {
            Alert.alert(
                "Create Course Unsuccesfull",
                response.content().message,
                [
                { text: "Retry", onPress: () => {} }
                ]
            );
            console.log("[Create Course screen] error", response.content().message);
        }
    }

    const handleApiResponseGetCategories = (response) => {
        console.log("[Create Course screen] response content: ", response.content())
        if (!response.hasError()) {
            setCategories(response.content())
        } else {
            Alert.alert(
                "Create Course Unsuccesfull:",
                response.content().message,
                [
                { text: "Retry", onPress: () => {} }
                ]
            );
            console.log("[Create Course screen] error", response.content().message);
        }
    }

    const handleSubmitCreateNewCourse = async () =>{
        console.log("[Create Course screen] entro a submit edit profile")
        setLoading(true);
        console.log("[Create Course screen] data:", courseData)
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        console.log("[Create Course screen] token:",tokenLS);
        //await app.apiClient().
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
            token: tokenLS}, handleApiResponseCreateCourse);
        setData({
            user_id: idLS,
            name: "",
            description: "",
            category: 0,
            subscription_type: "",
            location: "",
            profile_picture: "",
            duration: "",
            language: "",
            level: "",
            modules: [],
        })
        setLoading(false);
        console.log("[Create Course screen] termino submit signup")
    }

    const onRefresh = async () => {
        console.log("[Create Course screen]v entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        console.log("[Create Course screen] token:", tokenLS);
        await app.apiClient().getAllCategories({token: tokenLS}, handleApiResponseGetCategories);
        setLoading(false);
    };

    useEffect(() => {
        console.log("[Create Course screen] entro a useEffect");
        onRefresh();
    }, []);

    return (
        <ScrollView>
            <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                {/*<View>
                        <Image source={image} style={styles.titlesImage} />
                </View>*/}
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
                        value={courseData.subscription_type}
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

                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => handleSubmitCreateNewCourse()}
                        style={styles.button}
                        disabled={loading}
                    >
                        {
                            loading ? <ActivityIndicator animating={loading} /> : <Text style={styles.buttonText}>Create New Course</Text>
                        }
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //paddingTop: 5,
    },
    /*logoImage: {
        width: 75,
        height: 75,
        borderRadius: 40,
    },*/
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
        //paddingVertical: 5,
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
})

export default MenuCreateNewCourseScreen;