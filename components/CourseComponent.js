import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text,View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { app } from '../app/app';
import StarRating from 'react-native-star-rating';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const CourseComponent = ({ item }) => {

    console.log("[Course component] item", item);

    const [loading, setLoading] = useState(false);

    //const [subscribed, setSubscribed] = useState(false);

    const [rating, setRating] = useState({});

    const handleResponseGetCourseRating = (response) => {
        console.log("[Course component] get rating: ", response.content())
        if (!response.hasError()) {
            setRating(response.content());
        } else {
            console.log("[Course component] error", response.content().message);
        }        
    }

    const onRefresh = async () => {
        console.log("[Course component] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        console.log("[Course component] token:", tokenLS); 
        await app.apiClient().getCourseRating({token: tokenLS}, item.id, handleResponseGetCourseRating);
        setLoading(false);
    };
  
    useEffect(() => {
        console.log("[Course component] entro a useEffect");
        onRefresh();
    }, []);

    return(
        <View style={styles.verticalCourseItemWrapper}>
                <View>
                    <View style={{ width: '70%', /* marginLeft: 10, */ flexDirection: 'row', alignItems: 'center',}}>
                        <View style={{alignItems: 'center', justifyContent: 'center',}}>
                            <Image
                                source={item.profile_picture ? { uri: item.profile_picture } : courseImage}
                                style={styles.image}
                            />
                        </View>
                        <View style={styles.courseTitleWrapper}>
                            <Text style={styles.courseTitle}>{item.name}</Text>
                            <View style={{ display:'flex', flexDirection: 'row' }}>
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    rating={rating.rating}
                                    containerStyle={{ width: 110}}
                                    starSize={20}
                                    fullStarColor='gold'
                                />
                                <Text style={{position: 'absolute', left: 115, top: 1,}}>{`(${rating.amount})`}</Text>
                            </View>
                            <Text style={{ /* textAlign: 'right', */ marginTop: 10, fontWeight: 'bold' }}>{item.subscription_type.charAt(0).toUpperCase()+item.subscription_type.slice(1)}</Text>
                        </View>
                    </View>
                    {item.description != "" && (
                        <View style={styles.courseDescriptionWrapper}>
                            <Text numberOfLines={2}>{item.description}</Text>
                        </View>
                    )}
                </View>
            </View>
        /* </TouchableOpacity> */
    );
}

const styles = StyleSheet.create({
    image: {
      width: 75,
      height: 75,
      marginLeft: 20,
      marginRight: 10,
    },
    verticalCourseItemWrapper: {
      //display: 'flex',
      flexDirection: 'row',
      marginTop: 10,
      paddingBottom: 10,
      paddingTop: 15,
      marginRight: 10,
      borderRadius: 20,
      backgroundColor: 'white',
      shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    courseTitle: {
      fontSize: 14,
      color: 'black',
      //flex: 1, 
      marginBottom: 10,
      flexWrap: 'wrap',
      flexDirection: 'row',
      fontWeight: 'bold',
    },
    rating: {
      fontSize: 12,
      color: 'black',
      marginLeft: 5,
    },
    courseDescriptionWrapper : {
      paddingTop: 5,
      marginBottom: 10,
      marginRight: 5,
      marginLeft: 15,
    },
    courseTitleWrapper: {
      marginLeft: 5,
      marginTop: 5,
      flexDirection: 'column',
      marginBottom: 20,
    },
})

export default CourseComponent;