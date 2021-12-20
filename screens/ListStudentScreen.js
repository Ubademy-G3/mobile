import { app } from '../app/app';
import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import ProfilesListComponent from '../components/ProfilesListComponent';
import { ActivityIndicator } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import UsersFilterComponent from '../components/UsersFilterComponent';

Feather.loadFont();
MaterialCommunityIcons.loadFont();
MaterialIcons.loadFont();

const ListStudentScreen = (props) => {
  const param_id = props.route.params.course_id;
  const view_as = props.route.params.view_as;

  const [loading, setLoading] = useState(false); 
  const [studentsData, setStudentsData] = useState([]);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const handleGetProfileFromList = (response) => {
    console.log("[List Student Screen] content: ", response.content())
    if (!response.hasError()) {
      setStudentsData(response.content());
    } else {
      console.log("[List Student Screen] error", response.content().message);
    }
  }

  const handleGetAllUsersInCourse = async (response) => {
      console.log("[List Student Screen] get all users content: ", response.content())
      if (!response.hasError()) {
          const colaboratorsIds = [];
          for(let user of response.content().users){
            colaboratorsIds.push(user.user_id)
          }
          let tokenLS = await app.getToken();
          await app.apiClient().getAllUsersFromList({token: tokenLS}, colaboratorsIds, handleGetProfileFromList); 
      } else {
          console.log("[List Student Screen] error", response.content().message);
      }
  }

  const onRefresh = async () => {
    console.log("[Student screen] entro a onRefresh"); 
    setLoading(true);
    let tokenLS = await app.getToken();
    console.log("[Student screen] token:", tokenLS); 
    await app.apiClient().getAllUsersInCourse({ token: tokenLS }, param_id, { user_type: 'student' }, handleGetAllUsersInCourse);
    setLoading(false);
  };

  useEffect(() => {
      console.log("[Student screen] entro a useEffect");
      setStudentsData([]);
      onRefresh();
  }, []);

  const filterUsers = async (query) => {
    setLoading(true);
    let filters = {
        user_type: 'student'
    };
    if (query.approved) {
        const approved = query.approved.filter((s) => s.isChecked);
        if (approved.length > 0) {
            approved.forEach((st) => {
                if (st.isChecked) {
                  filters.approval_state = st.value;
                }
            })
        }
    }
    if (query.progress) {
      const progress = query.progress.filter((s) => s.isChecked);
      if (progress.length > 0) {
        progress.forEach((st) => {
            if (st.isChecked) {
              filters.progress = st.value;
            }
        })
      }
    }
    const tokenLS = await app.getToken();
    setStudentsData([]);
    await app.apiClient().getAllUsersInCourse({ token: tokenLS }, param_id, filters, handleGetAllUsersInCourse);
    setLoading(false);
  }

  return (
    <ScrollView style={styles.cardWrapper}>
      {loading && (
        <ActivityIndicator color="lightblue" style={{ margin: "50%" }}/>
      )}
      {!loading && view_as === 'student' && studentsData.length > 0 && (
        <>
          {studentsData.map(item => (
            <ProfilesListComponent 
              item={item}
              navigation={props.navigation}
            />
          ))}
        </>
      )}
      {!loading && view_as !== 'student' && (
        <>
          {studentsData.length === 0 ? (
            <View style={{ display:'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Image source={require("../assets/images/magnifyingGlass.png")} style={{ width: 100, height: 100, marginTop: "50%" }} />
              <Text style={styles.examsText}>Oops.. could not find any students in this course</Text>
            </View>
          ) : (
            <>
              <View>
                <TouchableOpacity
                    onPress={() => { setFiltersVisible(!filtersVisible) }}
                    style={{ display:'flex', flexDirection: 'row', justifyContent: 'flex-end', marginRight: 10, marginTop: 10 }}
                >
                    <Feather name="filter" color={"#444"} size={18} />
                    <Text>Filters</Text>
                </TouchableOpacity>
              </View>
              {filtersVisible && (
                  <UsersFilterComponent updateUsers={filterUsers} />
              )}
              {studentsData.map(item => (
                <ProfilesListComponent 
                  item={item}
                  navigation={props.navigation}
                />
              ))}
            </>
          )}
        </>
      )}
    </ScrollView>
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




