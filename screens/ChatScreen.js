import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { firebase } from '../firebase';
import { app } from '../app/app';

const db = firebase.default.firestore();

const ChatScreen = (props) => {
    const [users, setUsers] = useState(null);

    const handleApiResponseProfile = async (response) => {
        if (!response.hasError()) {
            const usersTmp = [];
            const userData = {
                id: response.content().id,
                firstName: response.content().firstName,
                lastName: response.content().lastName,
                profilePicture: response.content().profilePictureUrl
            }
            usersTmp.push(userData);
            setUsers(usersTmp);
        } else {
            console.log("[Chat screen] error", response.content().message);
        }
    }

    const getUsers = async () => {
        const id = await app.getId();
        const token = await app.getToken();
        await db.collection('users').doc(id).collection('messages').onSnapshot((snapshot) => {
            const userData = [];
            snapshot.forEach((doc) => userData.push({ ...doc.data(), id: doc.id }));
            const usersIds = []
            userData.forEach((msg) => {
                if (msg.user._id !== id && !usersIds.includes(msg.user._id)) {
                    usersIds.push(msg.user._id);
                } else if (msg.user._id === id && !usersIds.includes(msg.sentTo)) {
                    usersIds.push(msg.sentTo);
                }
            });
            usersIds.forEach(async (user) => {
                await app.apiClient().getProfile({id: user, token: token}, user, handleApiResponseProfile);
            })
        });
    }

    useEffect(() => {
        getUsers();
    }, []);

    const RenderCard = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => props.navigation.navigate('Direct Message', { id: item.id })}>
            <View style={styles.mycard}>
                <Image source={{ uri: item.profilePicture }} style={styles.img} />
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
            <FlatList 
              data={users}
              renderItem={({ item }) => { return <RenderCard item={item} /> }}
              keyExtractor={(item) => item.id}
            />
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
})

export default ChatScreen;