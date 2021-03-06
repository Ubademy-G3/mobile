import React, { useCallback } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Drawer } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/Ionicons';
import image from "../../assets/images/profilePic.jpg"
import { useState } from 'react';
import { app } from '../../app/app';
import { useFocusEffect } from '@react-navigation/native';

MaterialCommunityIcons.loadFont();
MaterialIcons.loadFont();
Icons.loadFont();


const MenuScreen = (props) => {
    const [loading, setLoading] = useState(false);
    const [userId, setId] = useState('');
    const [userData, setData] = useState({
        firstName: "Name",
        lastName: "Last name",
        favoriteCourses: [],
        rol: '',
    });

    const handleApiResponseProfile = (response) => {
        if (!response.hasError()) {
            setData({
                firstName: response.content().firstName,
                lastName: response.content().lastName,
                rol: response.content().rol,
                favoriteCourses: response.content().favoriteCourses,
            });
        } else {
            console.log("[Menu screen] error", response.content().message);
        }
    }

    const onRefresh = async () => {
        setLoading(true);
        let idLS = await app.getId();
        let tokenLS = await app.getToken();
        await app.apiClient().getProfile({id: idLS, token: tokenLS}, idLS, handleApiResponseProfile);
        setId(idLS);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            onRefresh();
        }, [])
    );

    const signOut = async () => {
        await app.signOutUser(); 
        props.navigation.replace('Login');
    }

    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: 15}}>
                            <Image 
                                source={{image}}
                                size={20}
                            />
                            <View style={{marginLeft:15, flexDirection:'column'}}>
                                <Text style={styles.title}>{userData.firstName} {userData.lastName}</Text>
                            </View>
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem 
                            icon={({color, size}) => (
                                <MaterialCommunityIcons 
                                name="account-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Profile"
                            onPress={() => {props.navigation.navigate('Profile', { id: userId })}}
                        />
                        {userData.rol === "student" && (
                            <>
                            <DrawerItem 
                                icon={({color, size}) => (
                                    <MaterialCommunityIcons 
                                    name="heart-outline" 
                                    color={color}
                                    size={size}
                                    />
                                )}
                                label="Favorite Courses"
                                onPress={() => {props.navigation.navigate('Favorite Courses', {favoriteCourses: userData.favoriteCourses})}}
                            />
                            <DrawerItem 
                                icon={({color, size}) => (
                                    <MaterialCommunityIcons 
                                    name="check" 
                                    color={color}
                                    size={size}
                                    />
                                )}
                                label="Completed Courses"
                                onPress={() => {props.navigation.navigate('Completed Courses')}}
                            />
                            <DrawerItem 
                                icon={({color, size}) => (
                                    <MaterialIcons
                                    name="event-note" 
                                    color={color}
                                    size={size}
                                    />
                                )}
                                label="Subscribed Courses"
                                onPress={() => {props.navigation.navigate('Subscribed Courses')}}
                            />
                            <DrawerItem 
                                icon={({color, size}) => (
                                    <MaterialCommunityIcons
                                    name="diamond-stone"
                                    color={color}
                                    size={size}
                                    />
                                )}
                                label="Update Subscription"
                                onPress={() => {props.navigation.navigate('Update Subscription')}}
                            />
                            <DrawerItem 
                                icon={({color, size}) => (
                                    <Icons
                                    name="wallet-outline"
                                    color={color}
                                    size={size}
                                    />
                                )}
                                label="Wallet"
                                onPress={() => { props.navigation.navigate('Wallet') }}
                            />
                            <DrawerItem 
                                icon={({color, size}) => (
                                    <Icons
                                    name="newspaper-outline"
                                    color={color}
                                    size={size}
                                    />
                                )}
                                label="My Certificates"
                                onPress={() => { props.navigation.navigate('My Certificates') }}
                            />
                            </>
                        )}
                        {userData.rol === "instructor" && (
                            <>
                            <DrawerItem 
                                icon={({color, size}) => (
                                    <MaterialCommunityIcons 
                                    name="check" 
                                    color={color}
                                    size={size}
                                    />
                                )}
                                label="Created Courses"
                                onPress={() => {props.navigation.navigate('Created Courses')}}
                            />
                            <DrawerItem 
                                icon={({color, size}) => (
                                    <MaterialIcons
                                    name="event-note" 
                                    color={color}
                                    size={size}
                                    />
                                )}
                                label="Create New Course"
                                onPress={() => {props.navigation.navigate('Create New Course')}}
                            />
                            <DrawerItem 
                                icon={({color, size}) => (
                                    <MaterialCommunityIcons
                                    name="file-document-edit-outline"
                                    color={color}
                                    size={size}
                                    />
                                )}
                                label="Edit Courses"
                                onPress={() => {props.navigation.navigate('Edit Courses')}}
                            />
                            </>
                        )}
                        <DrawerItem 
                            icon={({color, size}) => (
                                <MaterialIcons 
                                name="work-outline"
                                color={color}
                                size={size}
                                />
                            )}
                            label="Collaborations"
                            onPress={() => {props.navigation.navigate('Collaborations')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <MaterialCommunityIcons
                                name="account-edit-outline"
                                color={color}
                                size={size}
                                />
                            )}
                            label="Edit Profile"
                            onPress={() => {props.navigation.navigate('Edit Profile')}}
                        />
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem 
                    icon={({color, size}) => (
                        <MaterialCommunityIcons 
                        name="exit-to-app" 
                        color={color}
                        size={size}
                        />
                    )}
                    label="Sign Out"
                    onPress={() => {signOut()}}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });

export default MenuScreen;