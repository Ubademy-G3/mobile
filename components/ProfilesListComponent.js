import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ProfilesListComponent = ({ item, navigation }) => {
    return (
      <TouchableOpacity
      key={item.id}
      onPress={() => {
        navigation.navigate('Anothers Profile', {
          id: item.id,
        });
      }}>
        <View
        style={[
          styles.profilesCardWrapper,
          {
            backgroundColor: item.selected ? '#87ceeb' : 'white',
            marginLeft: item.id == 1 ? 20 : 0,
          },
        ]}>
          <View style={styles.profilesTitleWrapper}>
            <Image source={{uri: item.profilePictureUrl}} style={styles.profilesCardImage} />
            <Text style={styles.profilesTitle}>{item.firstName} {item.lastName}</Text>  
          </View>
        </View>
      </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    container: {
      flex : 1,
    },
    cardWrapper: {
      paddingHorizontal: 20,
    },
    profilesCardWrapper: {
      backgroundColor: 'white',
      borderRadius: 25,
      paddingTop: 15,
      paddingLeft: 20,
      marginTop: 10,
      marginBottom: 5,
      flexDirection: 'column',
      shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    profilesTitle: {
      fontSize: 16,
      color: 'black'
    },
    profilesCardImage: {
      width: 60,
      height: 60,
      borderRadius: 15,
      resizeMode: 'contain',
      marginRight: 10,
    },
    profilesTitleWrapper: {
      marginLeft: 5,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    profilesDescriptionWrapper : {
      marginBottom: 10,
      marginRight: 5,
      marginLeft: 5,
    },
  })
  
export default ProfilesListComponent;