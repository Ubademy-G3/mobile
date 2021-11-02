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


Entypo.loadFont();
MaterialCommunityIcons.loadFont();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor:'#87ceeb',
          tabBarInactiveTintColor: 'gray',
          tabBarShowLabel: false,
        }}>
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
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="account" size={32} color={color} />
            ),
          }}
        />
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