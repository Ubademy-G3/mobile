import {app} from '../app/app';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import ProfilesListComponent from '../components/ProfilesListComponent';
import MultiSelect from 'react-native-multiple-select';

const categories = [""]

const ListStudentScreen = (props) => {

  const param_id = props.route.params ? props.route.params.course_id: '';

  const param_filter = props.route.params ? props.route.params.filter: '';

  const [loading, setLoading] = useState(false); 

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
      await app.apiClient().getAllUsersInCourse({token: tokenLS}, param_id, "student", handleGetAllUsersInCourse);
      setLoading(false);
  };

  useEffect(() => {
      console.log("[Student screen] entro a useEffect");
      onRefresh();
  }, []);

  return (
    <View style={styles.cardWrapper}>
      {param_filter && (
        <>
          {/* <MultiSelect
            hideTags
            items={categories}
            uniqueKey="id"
            onSelectedItemsChange={onSelectedItemsChange}
            selectedItems={selectedItems}
            selectText="Search students with filter"
            searchInputPlaceholderText="Select some filters..."
            onChangeInput={(text) => console.log(text)}
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            styleMainWrapper={styles.inputMultiSelect}
            searchInputStyle={{color: '#CCC'}}
            submitButtonColor="#48d22b"
            submitButtonText="Submit"
          /> */}
        </>
      )}
      {studentsData.map(item => (
        <ProfilesListComponent 
        item={item}
        navigation={props.navigation}/>
      ))}
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




