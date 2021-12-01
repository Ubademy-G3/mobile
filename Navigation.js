//import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import MessagesScreen from './screens/MessagesScreen';
import SignupScreen from './screens/SignUpScreen';
import CourseScreen from './screens/CourseScreen';
import MenuScreen from './screens/menu/MenuScreen';
import { createDrawerNavigator} from '@react-navigation/drawer';
import MenuFavoriteCoursesScreen from './screens/menu/MenuFavoriteCoursesScreen';
import MenuCompletedCoursesScreen from './screens/menu/MenuCompletedCoursesScreen';
import MenuSubscribedCoursesScreen from './screens/menu/MenuSubscribedCoursesScreen';
import MenuCollaborationsScreen from './screens/menu/MenuCollaborationsScree';
import MenuEditProfileScreen from './screens/menu/MenuEditProfileScreen';
import MenuCreatedCoursesScreen from './screens/menu/MenuCreatedCoursesScreen';
import MenuCreateNewCourseScreen from './screens/menu/MenuCreateNewCourseScreen';
import MenuUpdateSubscription from './screens/menu/MenuUpdateSubscription';
import SearchCoursesScreen from './screens/SearchCoursesScreen';
import MenuEditCoursesScreen from './screens/menu/MenuEditCoursesScreen';
import ListStudentScreen from './screens/ListStudentScreen';
import CreateExamScreen from './screens/CreateExamScreen';
import AnothersProfileScreen from './screens/AnothersProfileScreen';
import EditCourseScreen from './screens/EditCourseScreen';
import EditExamScreen from './screens/EditExamScreen';


Entypo.loadFont();
MaterialCommunityIcons.loadFont();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = ({route, navigation}) => {
  return(
    <Drawer.Navigator 
    initialRouteName="Profile"
    drawerContent={props => <MenuScreen {...props} />}>
          <Drawer.Screen 
            name="Profile" 
            initialParams={{ params: route.params }}
            component={ProfileScreen} 
            options={{headerShown: true, headerTitle: ""}}
            />
          <Drawer.Screen name="Favorite Courses" component={MenuFavoriteCoursesScreen} />
          <Drawer.Screen name="Completed Courses" component={MenuCompletedCoursesScreen} />
          <Drawer.Screen name="Subscribed Courses" component={MenuSubscribedCoursesScreen} />
          <Drawer.Screen name="Update Subscription" component={MenuUpdateSubscription} />
          <Drawer.Screen name="Collaborations" component={MenuCollaborationsScreen} />
          <Drawer.Screen name="Edit Profile" component={MenuEditProfileScreen} />
          <Drawer.Screen name="Created Courses" component={MenuCreatedCoursesScreen} />
          <Drawer.Screen name="Create New Course" component={MenuCreateNewCourseScreen} />
          <Drawer.Screen name="Edit Courses" component={MenuEditCoursesScreen} />
    </Drawer.Navigator>
  );
}

const TabNavigator = () => {
    return (
      <Tab.Navigator
        initialRouteName="Drawer"
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor:'#87ceeb',
          tabBarInactiveTintColor: 'gray',
          tabBarShowLabel: false,
        }}>
        <Tab.Screen
          name="Drawer"
          component={DrawerNavigator}
          options={{
            headerShown:false,
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="account" size={32} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Explorer"
          component={HomeScreen}
          options={{ 
            headerShown:false,
            tabBarIcon: ({color}) => (
              <Entypo name="magnifying-glass" size={32} color={color} />
            ),
          }}
        />
        {/*<Tab.Screen
          name='Menu'
          component={DrawerNavigator}
        />*/}
        <Tab.Screen
          name="Messages"
          component={MessagesScreen}
          options={{
            tabBarIcon: ({color}) => (
              <Entypo name="chat" size={30} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  };

const Navigation = () => {
      return (
          <NavigationContainer>
              <Stack.Navigator>
                  <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
                  <Stack.Screen options={{headerShown: false}} name="Signup" component={SignupScreen} />
                  <Stack.Screen options={{headerShown: false}} name="TabNavigator" component={TabNavigator} />
                  <Stack.Screen options={{headerShown: true, title: null, headerTintColor: 'white', headerStyle: {backgroundColor: '#87ceeb'}}} name="Course Screen" component={CourseScreen} />
                  <Stack.Screen options={{headerShown: true}} name="Search Courses" component={SearchCoursesScreen} />
                  <Stack.Screen options={{headerShown: true}} name="Student List" component={ListStudentScreen} />
                  <Stack.Screen options={{headerShown: true}} name="Create New Exam" component={CreateExamScreen} />
                  <Stack.Screen options={{headerShown: true, title: null}} name="Anothers Profile" component={AnothersProfileScreen} />
                  <Stack.Screen options={{headerShown: true}} name="Edit Course" component={EditCourseScreen} />
                  <Stack.Screen options={{headerShown: true}} name="Edit Exam" component={EditExamScreen} />
              </Stack.Navigator>
          </NavigationContainer>
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default Navigation;