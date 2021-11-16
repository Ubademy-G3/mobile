import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import forYouData from '../assets/data/forYouData'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { app } from '../app/app';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const SubscriptionCoursesScreen = (props) => {
    //const param_item = props.route.params ? props.route.params.item : null;
    const param_subscription_type = props.route.params ? props.route.params.subscription_type : null;
    
    const [loading, setLoading] = useState(false);
    
    var courses = [];

    const handleSearchBySubscription = (response) => {
        console.log("[Search by subscription screen] content: ", response.content())
        if (!response.hasError()) {
            courses = response.content();
            console.log("[Search by subscription screen] response: ", courses);
        } else {
            console.log("[Search by subscription screen] error", response.content().message);
        }
    }

    const onRefresh = async () => {
        console.log("[Search by subscription screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        if (param_subscription_type === "Free"){
            console.log("[Search by subscription screen] entro a Free");
            await app.apiClient().searchCourseBySubscription({token: tokenLS}, "free", handleSearchBySubscription);    
        } else if (param_subscription_type === "Platinum"){
            await app.apiClient().searchCourseBySubscription({token: tokenLS}, "platinum", handleSearchBySubscription);
        } else if (param_subscription_type === "Gold"){
            await app.apiClient().searchCourseBySubscription({token: tokenLS}, "gold", handleSearchBySubscription);
        }
        //await app.apiClient().searchCourseBySubscription({token: tokenLS}, param_subscription_type, handleSearchBySubscription);
        setLoading(false);
    };

    useEffect(() => {
        console.log("[Search by subscription screen] entro a useEffect");
        onRefresh();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.coursesCardWrapper}>
                    {courses.map((item) => (
                        <TouchableOpacity
                        key={item.id}
                        onPress={() =>
                            props.navigation.navigate('Course Screen', {
                            item: item,
                            })
                        }>
                        <View
                            style={[
                            styles.courseCardWrapper,
                            {marginTop: 15,},
                            ]}>
                            <View>
                                <View style={styles.courseCardTop}>
                                    <View>
                                        <Image source={item.profile_picture} style={styles.courseCardImage} />
                                    </View>
                                    <View style={styles.courseTitleWrapper}>
                                        <Text style={styles.courseTitlesTitle}>
                                            {item.name}
                                        </Text>
                                        {/*<View style={styles.courseTitlesRating}>
                                            <MaterialCommunityIcons
                                            name="star"
                                            size={10}
                                            color={'black'}
                                            />
                                            <Text style={styles.rating}>{item.rating}</Text>
                                        </View>*/}
                                    </View>
                                </View>
                                <View style={styles.courseDescriptionWrapper}>
                                    <Text style={styles.courseTitleDescription}>
                                    {item.description}
                                    </Text>
                                </View>
                                <View style={styles.forYouButtons} >
                                    {/*<View style={styles.addCourseButton}>
                                        eather name={item.subscribed ? "check" : "plus"} size={16} color={'black'} />
                                    </View>*/}
                                    <View style={styles.favoriteCourseButton}>
                                        {/*<MaterialCommunityIcons name="heart" size={16} color={'black'} />
                                        <MaterialCommunityIcons name={item.favorited ? "heart" : "heart-outline"} size={16} color={'black'} />*/}
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

export default SubscriptionCoursesScreen;