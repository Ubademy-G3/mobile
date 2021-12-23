import React from 'react';
import { Image, StyleSheet, Text,View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import StarRating from 'react-native-star-rating';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const CourseComponent = ({ item }) => {
    return(
        <View style={styles.verticalCourseItemWrapper}>
                <View>
                    <View style={{ width: '70%', flexDirection: 'row', alignItems: 'center',}}>
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
                                    rating={item.rating_avg}
                                    containerStyle={{ width: 110}}
                                    starSize={20}
                                    fullStarColor='gold'
                                />
                                <Text style={{position: 'absolute', left: 115, top: 1,}}>{`(${item.rating_amount})`}</Text>
                            </View>
                            <Text style={{ marginTop: 10, fontWeight: 'bold' }}>{item.subscription_type.charAt(0).toUpperCase()+item.subscription_type.slice(1)}</Text>
                        </View>
                    </View>
                    {item.description != "" && (
                        <View style={styles.courseDescriptionWrapper}>
                            <Text numberOfLines={2}>{item.description}</Text>
                        </View>
                    )}
                </View>
            </View>
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