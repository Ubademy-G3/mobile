import React from 'react';
import { Image, StyleSheet, Text,View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const CertificateComponent = ({ item }) => {
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
                        </View>
                    </View>
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
      fontSize: 18,
      color: 'black',
      flexWrap: 'wrap',
      flexDirection: 'row',
      fontWeight: 'bold',
    },
    courseTitleWrapper: {
      marginLeft: 5,
      marginTop: 5,
      flexDirection: 'column',
      marginBottom: 20,
    },
})

export default CertificateComponent;