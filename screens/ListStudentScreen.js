import {app} from '../app/app';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';


const ListStudentScreen = (props) => {

    const param_id = props.route.params ? props.route.params.course_id: '';

    const [loading, setLoading] = useState(false); 
    const [students, setStudents] = useState([]);
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
            setStudents(
                response.content().users
            )
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
        console.log("STUDENTS!!!!", students);
        for(let student of students){
            await app.apiClient().getProfile({token: tokenLS}, student.id, handleApiResponseProfile);
        }

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
            /*props.navigation.navigate('ListStudent Screen', {
              subscription_type: item.title,
            });*/}
          }>
            <View
              style={[
                styles.categoryItemWrapper,
                {
                  backgroundColor: item.selected ? '#87ceeb' : 'white',
                  marginLeft: item.id == 1 ? 20 : 0,
                },
              ]}>
              <Image source={item.image} style={styles.categoryItemImage} />
              <Text style={styles.categoryItemTitle}>{item.firstName}</Text>              
            </View>
          </TouchableOpacity>
        );
      }; 


    return (
        <View style={styles.forYouWrapper}>
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
    }    
})

export default ListStudentScreen;




