import React, {useState} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import forYouData from '../../assets/data/forYouData'
import SelectDropdown from 'react-native-select-dropdown'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const subscriptions = ["Free", "Platinum", "Gold"];

const MenuCreateNewCourseScreen = (props) => {
    /*name": "string",
  "description": "string",
  "category": 0,
  "kind": "string",
  "subscription_type": "string",
  "location": "string",
  "info": {},
  "profile_picture": "string" */
    const [courseData, setData] = useState({
        name: "",
        description: "",
        category: "",
        subscription_type: "",
        location: "",
        profile_picture: "",
    });

    const [loading, setLoading] = useState(false);

    /*const handleApiResponseEditProfile = (response) => {
        console.log("[Edit Profile screen] response content: ", response.content())
        if (!response.hasError()) {
            Alert.alert(
                "Update Succesfull:",
                response.content().message,
                [
                { text: "OK", onPress: () => {} }
                ]
            );
        } else {
            console.log("[Edit Profile screen] error", response.content().message);
        }
    }

    const handleSubmitCreateNewCourse = async () =>{
        console.log("[Edit Profile screen] entro a submit edit profile")
        setLoading(true);
        console.log("[Edit Profile screen] data:", courseData)
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        console.log("[Edit Profile screen] token:",tokenLS);
        await app.apiClient().editProfile({firstName: courseData.firstName,
            lastName: courseData.lastName,
            location: courseData.location,
            //profilePicture: "",
            //description: courseData.description, 
            token: tokenLS}, idLS, handleApiResponseEditProfile);
        setLoading(false);
        console.log("[Edit Profile screen] termino submit signup")
    }

    const handleApiResponseProfile = (response) => {
        console.log("[Edit Profile screen] content: ", response.content())
        if (!response.hasError()) {
            setData({
                firstName: response.content().firstName,
                lastName: response.content().lastName,
                location: response.content().location,
                profilePicture: response.content().profilePicture,
                //description: response.content().description,
            });
        } else {
            console.log("[Edit Profile screen] error", response.content().message);
        }
    }

    const onRefresh = async () => {
        console.log("[Edit Profile screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        console.log("[Edit Profile screen] token:",tokenLS);
        await app.apiClient().getProfile({id: idLS, token: tokenLS}, idLS, handleApiResponseProfile);
        setLoading(false);
    };

    useEffect(() => {
        console.log("[Edit Profile screen] entro a useEffect"); 
        console.log("[Edit Profile screen] params: ", props.route.params)
        onRefresh();
    }, []);*/

    return (
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
                {/*
                <Text style={styles.inputText}>Category</Text>
                <SelectDropdown
                    data={category}
                    onSelect={(selectedItem, index) => setData({
                        ...courseData,
                        category: selectedItem,
                    })}
                    value={courseData.subscription_type}
                    defaultButtonText={"Select a category"}
                    buttonStyle={styles.buttonDropdown}
                    buttonTextStyle={styles.textDropdown}
                    renderDropdownIcon={() => {
                        return (
                          <Feather name="chevron-down" color={"#444"} size={18} />
                        );
                    }}
                />*/}
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

            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => {}} //handleSubmitCreateNewCourse()}}
                    style={styles.button}
                    disabled={loading}
                >
                    {
                        loading ? <ActivityIndicator animating={loading} /> : <Text style={styles.buttonText}>Create New Course</Text>
                    }
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
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