import { app } from '../app/app';
import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import ProfilesListComponent from '../components/ProfilesListComponent';
import { ActivityIndicator } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CollaboratorsFilterComponent from '../components/CollaboratorsFilterComponent';

Feather.loadFont();
MaterialCommunityIcons.loadFont();
MaterialIcons.loadFont();

const ListCollaboratorsScreen = (props) => {
  const param_id = props.route.params.course_id;
  const view_as = props.route.params.view_as;

  const [loading, setLoading] = useState(false); 
  const [collaboratorsData, setCollaboratorsData] = useState([]);
  const [filter, setFilter] = useState (0);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const handleGetProfileFromList = (response) => {
    console.log("[List Collaborators Screen] content: ", response.content())
    if (!response.hasError()) {
      setCollaboratorsData(response.content());
    } else {
      console.log("[List Collaborators Screen] error", response.content().message);
    }
  }

  const handleGetAllUsersInCourse = async (response) => {
      console.log("[List Collaborators Screen] get all users content: ", response.content())
      if (!response.hasError()) {
          const colaboratorsIds = [];
          for(let user of response.content().users){
            colaboratorsIds.push(user.user_id)
          }
          let tokenLS = await app.getToken();
          await app.apiClient().getAllUsersFromList({token: tokenLS}, colaboratorsIds, handleGetProfileFromList); 
      } else {
          console.log("[List Collaborators Screen] error", response.content().message);
      }
  }

  const onRefresh = async () => {
    console.log("[Student screen] entro a onRefresh"); 
    setLoading(true);
    let tokenLS = await app.getToken();
    console.log("[Student screen] token:", tokenLS); 
    await app.apiClient().getAllUsersInCourse({ token: tokenLS }, param_id, { user_type: 'collaborator' }, handleGetAllUsersInCourse);
    setLoading(false);
  };

  useEffect(() => {
      console.log("[Student screen] entro a useEffect");
      setCollaboratorsData([]);
      onRefresh();
  }, []);

  const filterCollaborators = async (query) => {
    setLoading(true);
    if (query.progress) {
      const progress = query.progress.filter((s) => s.isChecked);
      if (progress.length > 0) {
        progress.forEach((st) => {
            if (st.isChecked) {
              setFilter(st.value);
            }
        })
      }
    }
    setCollaboratorsData([]);
    setLoading(false);
  }

  const getAmountFromExams = (id, key) => {
    let _collaborators = [...collaboratorsData];
    const c = exams_graded.filter((c) => {
        let a = (c.corrector_id === id);
        if (a) {
          _collaborators[key].amount_graded  += 1;
        }
      return a;
    });
    setCollaboratorsData(_collaborators);
    var uniq = [ ...new Set(c) ]; 
    uniq.filter((r) => r.amount === filter || r.amount > filter);
    return uniq;
};

  return (
    <ScrollView style={styles.cardWrapper}>
      {loading && (
        <ActivityIndicator color="lightblue" style={{ margin: "50%" }}/>
      )}
      {!loading && view_as === 'student' && collaboratorsData.length > 0 && (
        <>
          {collaboratorsData.length === 0 && (
            <View style={{ display:'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Image source={require("../assets/images/magnifyingGlass.png")} style={{ width: 100, height: 100, marginTop: "50%" }} />
              <Text style={styles.examsText}>Oops.. could not find any collaborators in this course</Text>
            </View>
          )}
          {collaboratorsData.map(item => (
            <ProfilesListComponent 
              item={item}
              navigation={props.navigation}
            />
          ))}
        </>
      )}
      {!loading && view_as !== 'student' && (
        <>
          {collaboratorsData.length === 0 ? (
            <View style={{ display:'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Image source={require("../assets/images/magnifyingGlass.png")} style={{ width: 100, height: 100, marginTop: "50%" }} />
              <Text style={styles.examsText}>Oops.. could not find any collaborators in this course</Text>
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
                  <CollaboratorsFilterComponent updateUsers={filterCollaborators} />
              )}
              {collaboratorsData.map((item, key) => (
                <View key={item.id}>
                {getAmountFromExams(item.id, key).map(item_list => (
                  <ProfilesListComponent 
                    item={item_list}
                    navigation={props.navigation}
                  />
                ))}
                </View>
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
  listText: {
    marginTop: 15,
    fontWeight: '300',
    fontSize: 16,
    paddingBottom: 5,
    marginLeft: 5,
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

export default ListCollaboratorsScreen;




