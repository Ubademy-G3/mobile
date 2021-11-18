import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Drawer } from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import image from "../../assets/images/profilePic.jpg"
import { useState, useEffect } from 'react';
import {app} from '../../app/app';

Icons.loadFont();
Icon.loadFont();
Ionicons.loadFont();


const MenuScreen = (props) => {
    //console.log("[Menu Screen] props: ", props.routes)
    const [loading, setLoading] = useState(false);
    const [userId, setId] = useState('');
    const [userData, setData] = useState({
        firstName: "Name",
        lastName: "Last name",
        favoriteCourses: [],
        rol: '',
    });

    const handleApiResponseProfile = (response) => {
        console.log("[Menu screen] content: ", response.content())
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
        console.log("[Menu screen] entro a onRefresh"); 
        setLoading(true);
        let idLS = await app.getId();
        let tokenLS = await app.getToken();
        await app.apiClient().getProfile({id: idLS, token: tokenLS}, idLS, handleApiResponseProfile);
        console.log("Menu screen] id:", idLS);
        setId(idLS);
        setLoading(false);
    };

    useEffect(() => {
        console.log("[Menu screen] entro a useEffect");
        onRefresh();
    }, []);

    const signOut = async () => {
        console.log("[Menu screen] entro a signOut"); 
        await app.signOutUser();
        console.log("[Menu screen] voy a login screen"); 
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
                                <Icons 
                                name="account-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Profile"
                            onPress={() => {props.navigation.navigate('Profile', { id: userId })}}
                        />
                        {userData.rol === "Student" && (
                            <>
                            <DrawerItem 
                                icon={({color, size}) => (
                                    <Icons 
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
                                    <Icons 
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
                                    <Icon
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
                                    <Icons
                                    name="diamond-stone"
                                    color={color}
                                    size={size}
                                    />
                                )}
                                label="Update Subscription"
                                onPress={() => {props.navigation.navigate('Update Subscription')}}
                            />
                            </>
                        )}
                        {userData.rol === "Instructor" && (
                            <>
                            <DrawerItem 
                                icon={({color, size}) => (
                                    <Icons 
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
                                    <Icon
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
                                    <Icons
                                    name="file-edit-outline" 
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
                                <Icon 
                                //name="text-box-search-outline" 
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
                                <Icons
                                //name="settings-outline"
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
                        <Icons 
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