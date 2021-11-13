import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Drawer } from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import image from "../assets/images/profilePic.jpg"

Icons.loadFont();
Icon.loadFont();


const MenuScreen = (props) => {
    console.log("[Menu Screen] props: ", props.routes)
    //const param_id = props.route.params ? props.route.params.id : 'defaultId';//'45f517a2-a988-462d-9397-d9cb3f5ce0e0';

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
                                <Text style={styles.title}>Name LastName</Text>
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
                            onPress={() => {props.navigation.navigate('Profile')}} //, { id: param_id })}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icons 
                                name="heart-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Favorite courses"
                            onPress={() => {props.navigation.navigate('Favorite Courses')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icons 
                                name="check" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Completed courses"
                            onPress={() => {}}//{props.navigation.navigate('Profile')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon
                                name="event-note" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Subscribed courses"
                            onPress={() => {}}//{props.navigation.navigate('BookmarkScreen')}}
                        />
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
                            onPress={() => {}}//{props.navigation.navigate('SettingsScreen')}}
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
                    onPress={() => {}}//{signOut()}}
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