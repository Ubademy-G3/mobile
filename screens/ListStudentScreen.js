import {app} from '../app/app';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import image from "../assets/images/profilePic.jpg";


const ListStudentScreen = (props) => {

  const param_id = props.route.params ? props.route.params.course_id: '';

  const [loading, setLoading] = useState(false); 
  //const [students, setStudents] = useState([]);
  const [studentsData, setStudentsData] = useState([]);

  const handleApiResponseProfile = (response) => {
      console.log("[ListStudent Screen] content: ", response.content())
      if (!response.hasError()) {
              setStudentsData(studentsData => [...studentsData, response.content()]);
      } else {
          console.log("[ListStudent Screen] error", response.content().message);
      }
  }
  
  const handleGetAllUsersInCourse = async (response) => {
      console.log("[ListStudent Screen] content: ", response.content())
      if (!response.hasError()) {
          let tokenLS = await app.getToken();
          for(let student of response.content().users){
            await app.apiClient().getProfile({token: tokenLS}, student.user_id, handleApiResponseProfile);
          }
      } else {
          console.log("[ListStudent Screen] error", response.content().message);
      }
  }

  const onRefresh = async () => {
      console.log("[Student screen] entro a onRefresh"); 
      setLoading(true);
      let tokenLS = await app.getToken();
      console.log("[Student screen] token:", tokenLS); 
      await app.apiClient().getAllUsersInCourse({token: tokenLS}, param_id, "Student",handleGetAllUsersInCourse);
      setLoading(false);
  };

  useEffect(() => {
      console.log("[Student screen] entro a useEffect");
      onRefresh();
  }, []);

  const renderStudentItem = ({ item }) => {
    return (
      <TouchableOpacity
      key={item.id}
      onPress={() => {
        props.navigation.navigate('Anothers Profile', {
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
          {/*<View>*/}
          <View style={styles.profilesTitleWrapper}>
            <Image source={image} style={styles.profilesCardImage} />
          {/*</View>*/}
            <Text style={styles.profilesTitle}>{item.firstName} {item.lastName}</Text>  
          </View>
          <View style={styles.profilesDescriptionWrapper}>
            <Text style={styles.profilesDescription}>{item.description}</Text>
          </View>              
        </View>
      </TouchableOpacity>
    );
  }; 


  return (
    <View style={styles.cardWrapper}>
        <FlatList  
          data={studentsData}
          renderItem={renderStudentItem}
          keyExtractor={(item) => item.id}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
        />
    </View>
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
  },
  profilesTitleWrapper: {
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilesDescriptionWrapper : {
    //paddingTop: 5,
    marginBottom: 10,
    marginRight: 5,
    marginLeft: 5,
  },
})

export default ListStudentScreen;




