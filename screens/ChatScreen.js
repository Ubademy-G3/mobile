import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { firebase } from '../firebase';
import { app } from '../app/app';
import image from "../assets/images/profilePic.jpg"
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';

const db = firebase.default.firestore();

const ChatScreen = (props) => {
    const [users, setUsers] = useState([]);

    const[loading, setLoading] = useState(false);

    const handleGetProfileFromList = (response) => {
        console.log("[Chat screen] Get Profiles From List", response.content());
        if (!response.hasError()) {
            setUsers(response.content());
        } else {
            console.log("[Chat screen] error", response.content().message);
        }
    }

    const getUsers = async () => {
        setLoading(true);
        const id = await app.getId();
        db.collection('users').doc(id).collection('messages').onSnapshot((snapshot) => {
            const userData = [];
            snapshot.forEach((doc) => userData.push({ ...doc.data(), id: doc.id }));
            const usersIds = []
            userData.forEach((msg) => {
                if (msg.user && msg.user._id !== id && !usersIds.includes(msg.user._id)) {
                    usersIds.push(msg.user._id);
                } else if (msg.user && msg.user._id === id && !usersIds.includes(msg.sentTo)) {
                    usersIds.push(msg.sentTo);
                }
            });
            getProfiles(usersIds);
            console.log("USER IDS list: ", usersIds);
        });
        setLoading(false);
    }

    const getProfiles = async (ids) => {
        const token = await app.getToken();
        await app.apiClient().getAllUsersFromList({token: token}, ids,handleGetProfileFromList);
    }

    useFocusEffect(
        useCallback(() => {
            getUsers();
            console.log("USERS LENGHT", users, users.length);
        }, [])
    );

    const RenderCard = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => props.navigation.navigate('Direct Message', { id: item.id, firstName: item.firstName, lastName: item.lastName })}>
                <View style={styles.mycard}>
                    <Image source={item.profilePictureUrl ? { uri: item.profilePictureUrl } : image} style={styles.img} />
                    <View>
                        <Text style={styles.text}>
                            {`${item.firstName} ${item.lastName}`}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    
    return (
        <View style={{ flex:1 }}>
            {
            loading ? 
                <View style={{flex:1, justifyContent: 'center'}}>
                    <ActivityIndicator style={{ margin: '50%' }} color="lightblue" animating={loading} size="large" />
                </View>
            :
                <>
                {users && (
                    <View style={{ flex:1 }}>
                        <FlatList 
                            data={users}
                            renderItem={({ item }) => { return <RenderCard item={item} /> }}
                            keyExtractor={(item) => item.id}
                        />
                    </View>
                )}
                {users.lenght === 0 && (
                    <Text style={styles.courseText}>Start a hat with someone to see your chats here.</Text>
                )}
                </>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: `#87ceeb`,
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        paddingTop: 10,
        marginBottom: 8,
    },
    img: {
        width: 60,
        height: 60,
        borderRadius: 30
    },
    text:{
        fontSize:18,
        marginLeft:15,
        marginTop: 15
    },
    mycard:{
        flexDirection:"row",
        margin:3,
        padding:4,
        backgroundColor:"white",
        borderBottomWidth:1,
        borderBottomColor:'grey'
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor:"white"
    },
    courseText: {
        marginTop: 15,
        marginLeft: 10,
        fontWeight: '300',
        fontSize: 16,
        paddingBottom: 5,
    },
})

export default ChatScreen;