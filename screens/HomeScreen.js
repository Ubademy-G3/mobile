import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {getSetting} from "../Settings";
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import categoriesData from '../assets/data/categoriesData'
import forYouData from '../assets/data/forYouData'
import subscriptionTypeData from '../assets/data/subscriptionTypeCourses';

MaterialCommunityIcons.loadFont();
Feather.loadFont();


const HomeScreen = (props) => {
  /*const handleOnPressSubscription = ({ item }) => {
    item.selected = true;
    props.navigation.navigate('Course Screen', {
      item: item,
    });

  }*/
  const renderCategoryItem = ({ item }) => {
      return (
        <TouchableOpacity
        key={item.id}
        onPress={() => {
          props.navigation.navigate('Search by subscription', {
            //item: item,
            subscription_type: item.title,
          });}
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
            <Text style={styles.categoryItemTitle}>{item.title}</Text>
            {/*<View
              style={[
                styles.categorySelectWrapper,
                {
                  backgroundColor: item.selected ? 'white' : '#87ceeb',
                },
              ]}>
                <Feather
                name="plus"
                size={8}
                style={styles.categorySelectIcon}
                color={item.selected ? 'black' : 'white'}
              />
            </View>*/}
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
                  placeholder="Search course|"
                  onChangeText={text => {}}
                  //value={}
                  style={styles.searchText}
                  />
              </View>
          </View>

          {/* Categories */}
          <View style={styles.categoriesWrapper}>
              <Text style={styles.categoriesText}>Categories</Text>
              <View style={styles.categoriesListWrapper}>
                  <FlatList  
                    data={categoriesData}
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
                    renderItem={renderCategoryItem}
                    keyExtractor={(item) => item.id}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  />
              </View>
          </View>

          {/*For You */}
          <View style={styles.forYouWrapper}>
            <Text style={styles.forYouText}>Courses</Text>
            {forYouData.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  props.navigation.navigate('Course Screen', {
                    item: item,
                  })
                }>
                <View
                  style={[
                    styles.forYouCardWrapper,
                    {
                      marginTop: item.id == 1 ? 10 : 20,
                    },
                  ]}>
                  <View>
                    <View style={styles.forYouCardTop}>
                      <View>
                        <Image source={item.image} style={styles.forYouCardImage} />
                      </View>
                      <View style={styles.forYouTitleWrapper}>
                        <Text style={styles.forYouTitlesTitle}>
                          {item.title}
                        </Text>
                        <View style={styles.forYouTitlesRating}>
                          <MaterialCommunityIcons
                            name="star"
                            size={10}
                            color={'black'}
                          />
                          <Text style={styles.rating}>{item.rating}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.forYouDescriptionWrapper}>
                      <Text style={styles.forYouTitleDescription}>
                        {item.description}
                      </Text>
                    </View>
                    <View style={styles.forYouButtons} >
                      <View style={styles.addCourseButton}>
                        <Feather name="plus" size={16} color={'black'} />
                      </View>
                      <View style={styles.favoriteCourseButton}>
                        <Feather name="heart" size={16} color={'black'} />
                      </View>
                    </View>  
                  </View>
                </View>
              </TouchableOpacity>
            ))}
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
    marginBottom: 5,
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
    color: 'black'
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
});

export default HomeScreen;