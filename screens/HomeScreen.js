import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {getSetting} from "../Settings";
import Feather from 'react-native-vector-icons/Feather'
import categoriesData from '../assets/data/categoriesData'

Feather.loadFont();


const HomeScreen = (props) => {
    const renderCategoryItem = ({ item }) => {
        return (
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
        );
      };    
    return (
        <View style={styles.container}>
            {/* Logo */}
            <SafeAreaView>
                <View style={styles.headerWrapper}>
                    <Image
                        source={require("../assets/images/logo.png")}
                        style={styles.logoImage}
                    />
                </View>
            </SafeAreaView>

            {/* Search */}
            <View style={styles.searchWrapper}>
                <Feather name="search" size={16} />
                <View style={styles.search}>
                    <TextInput 
                    placeholder="Search"
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
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
    },
    headerWrapper: {
        paddingTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: 75,
        height: 75,
        borderRadius: 40,
    },
    searchWrapper: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        marginTop: 20,
        //backgroundColor: "white",
    },
    search: {
        flex: 1,
        marginLeft: 10,
        borderBottomColor: "grey",
        borderBottomWidth: 2,
    },
    searchText: {
        fontSize: 14,
        marginBottom: 5,
        color: "grey",
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
        marginRight: 20,
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
});

export default HomeScreen;