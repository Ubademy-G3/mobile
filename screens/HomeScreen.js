import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {getSetting} from "../Settings";
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import categoriesData from '../assets/data/categoriesData'
import forYouData from '../assets/data/forYouData'
import subscriptionTypeData from '../assets/data/subscriptionTypeCourses';
import { app } from '../app/app';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const HomeScreen = (props) => {

  const [categories, setCategories] = useState([]);

  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(false);

  const handleGetAllCategories = (response) => {
      console.log("[Home screen] content: ", response.content())
      if (!response.hasError()) {
          setCategories(response.content());
          console.log("[Home screen] categories: ", categories);
      } else {
          console.log("[Home screen] error", response.content().message);
      }
  }

  const onRefresh = async () => {
      console.log("[Home screen] entro a onRefresh"); 
      setLoading(true);
      let tokenLS = await app.getToken();
      console.log("[Home screen] token:", tokenLS);       
      await app.apiClient().getAllCategories({token: tokenLS}, handleGetAllCategories);
      setLoading(false);
  };

  useEffect(() => {
      console.log("[Home screen] entro a useEffect");
      onRefresh();
  }, []);

  const renderCategoryItem = ({ item }) => {
      return (
        <TouchableOpacity
        key={item.id}
        onPress={() => {
          props.navigation.navigate('Search Courses', {
            searchKey: item.id,
            keyType: "category"
          });}
        }>
          <View
            style={[
              styles.categoryItemWrapper,
              {
                backgroundColor: item.selected ? '#87ceeb' : 'white',
                marginLeft: item.id == 0 ? 20 : 0,
              },
            ]}>
            {/*<Image source={item.image} style={styles.categoryItemImage}/>*/ }
            <Text style={styles.categoryItemTitle}>{item.name}</Text>            
          </View>
        </TouchableOpacity>
      );
    };

    const renderSubscriptionItem = ({ item }) => {
        return (
          <TouchableOpacity
          key={item.id}
          onPress={() => {
            props.navigation.navigate('Search Courses', {
              searchKey: item.name,
              keyType: "subscription"
            });}
          }>
            <View
              style={[
                styles.categoryItemWrapper,
                {
                  backgroundColor: item.selected ? '#87ceeb' : 'white',
                  marginLeft: item.id == 0 ? 20 : 0,
                },
              ]}>
              {<Image source={item.image} style={styles.categoryItemImage}/>}
              <Text style={styles.categoryItemTitle}>{item.name}</Text>            
            </View>
          </TouchableOpacity>
        );
      };    
  return (
      <View style={styles.container}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}>
          {/* Logo */}
          <SafeAreaView>
              <View style={styles.headerWrapper}>
                  <Image
                      source={require("../assets/images/logo_toc.png")}
                      style={styles.logoImage}
                  />
              </View>
          </SafeAreaView>                   

          {/* Search */}
          <View style={styles.searchWrapper}>
              <Feather name="search" size={16}/>
              <View style={styles.search}>
                  <TextInput 
                  placeholder="Search course"
                  onChangeText={text => {setSearchText(text)}}
                  //value={}
                  style={styles.searchText}
                  />
              </View>              
          </View>
          <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => {props.navigation.navigate('Search Courses', {
                        searchKey: searchText,
                        keyType:"text"
                      });}}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>
          </View>
          

          {/* Categories */}
          <View style={styles.categoriesWrapper}>
              <Text style={styles.categoriesText}>Categories</Text>
              <View style={styles.categoriesListWrapper}>
                  <FlatList  
                    data={categories}
                    renderItem={renderCategoryItem}
                    keyExtractor={(item) => item.id}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  />
              </View>
          </View>

          {/* Subscription */}
          <View style={styles.categoriesWrapper}>
              <Text style={styles.categoriesText}>Subscriptions</Text>
              <View style={styles.categoriesListWrapper}>
                  <FlatList  
                    data={subscriptionTypeData}
                    renderItem={renderSubscriptionItem}
                    keyExtractor={(item) => item.id}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  />
              </View>
          </View>
        </ScrollView>        
      </View>
      
  );
}

const styles = StyleSheet.create({
  container: {
      flex : 1,      
  },
  headerWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    //width: 155,
    //height: 90,
    //borderRadius: 40,
    width: 155,
    height: 85,
  },
  searchWrapper: {
    flexDirection: "row",
    width:'90%',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 10,
    marginLeft: 18,
    backgroundColor:'white',
  },
  search: {
    marginLeft: 10,
    alignItems: "center",
},
  searchText: {
    fontSize: 14,
    color: "grey",
    alignItems: "center",
},
  categoriesWrapper: {
    marginTop: 20,
  },
  categoriesText: {
    fontSize: 16,
    paddingHorizontal: 20,
  },
  categoriesListWrapper: {
    paddingTop: 15,
    paddingBottom: 20,
  },
  categoryItemWrapper: {
    backgroundColor: '#F5CA48',
    marginRight: 10,
    borderRadius: 20,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  categoryItemImage: {
    width: 60,
    height: 60,
    marginTop: 15,
    alignSelf: 'center',
    marginHorizontal: 20,
  },
  categoryItemTitle: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5
  },
  categorySelectWrapper: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: 26,
    height: 26,
    borderRadius: 26,
    marginBottom: 20,
  },
  categorySelectIcon: {
    alignSelf: 'center',
  },
  forYouWrapper: {
    paddingHorizontal: 20,
  },
  forYouText: {
    fontSize: 16,
  },
  forYouCardWrapper: {
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
  forYouTitleWrapper: {
    marginLeft: 5,
    flexDirection: 'column',
  },
  forYouTitlesTitle: {
    fontSize: 16,
    color: 'black',
    flex: 1, 
    flexWrap: 'wrap',
    flexDirection: "row",
  },
  forYouTitlesRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forYouTitlesDescription: {
    fontSize: 12,
    color: 'grey',
    marginTop: 7,
    paddingRight: 40,
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
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  rating: {
    fontSize: 12,
    color: 'black',
    marginLeft: 5,
  },
  forYouCardTop: {
    //marginLeft: 20,
    //paddingRight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    //marginRight: 80,
  },
  forYouCardImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  buttonContainer: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 17,
    flexDirection: 'row'
  },
  button: {
      backgroundColor: `#87ceeb`,
      width: '100%',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
  },
  buttonText: {
      color:'white',
      fontWeight: '700',
      fontSize: 16,
  }
});

export default HomeScreen;