import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { app } from '../app/app';
import { firebase } from '../firebase';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';

const db = firebase.default.firestore();
const chatsRef = db.collection('users');

const MessagesScreen = (props) => {
    const param_other_user_id = props.route.params ? props.route.params.id : 'defaultID';
    const [messages, setMessages] = useState([]);
    const [id, setId] = useState(0);

    const onRefresh = async() => {
        const myId = await app.getId();
        setId(myId);
        const docid  = param_other_user_id > myId ? myId + "-" + param_other_user_id : param_other_user_id + "-" + myId;
        const messageRef = chatsRef.doc(myId)
            .collection('messages')
            .orderBy('createdAt',"desc")
        messageRef.onSnapshot((querySnap)=>{
            const allmsg = querySnap.docs.map(docSanp => {
                const data = docSanp.data()
                if (data.createdAt) {
                    return {
                        ...docSanp.data(),
                        createdAt: docSanp.data().createdAt.toDate()
                        }
                } else {
                    return {
                        ...docSanp.data(),
                        createdAt: new Date()
                    }
                }
            })
            setMessages(allmsg);
        })
    }

    useEffect(() => {
        onRefresh();
    }, []);

    const onSend = (messageArray) => {
        const msg = messageArray[0];
        const mymsg = {
            ...msg,
            sentBy: id,
            sentTo: param_other_user_id,
            createdAt: new Date()
        };
        setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg));
        const docid  = param_other_user_id > id ? id + "-" + param_other_user_id : param_other_user_id + "-" + id;
        
        chatsRef.doc(param_other_user_id)
         .collection('messages')
         .add({ ...mymsg, createdAt: firebase.default.firestore.FieldValue.serverTimestamp() });

        chatsRef.doc(id)
         .collection('messages')
         .add({ ...mymsg, createdAt: firebase.default.firestore.FieldValue.serverTimestamp() });

        console.log("expoPushToken:", chatsRef.doc(param_other_user_id).get());
        sendPushNotification(chatsRef.doc(param_other_user_id).get());
    }

    const sendPushNotification = async (expoPushToken) => {
        const message = {
          to: expoPushToken,
          sound: 'default',
          title: 'New message',
          body: 'And here is the body!',
          data: { someData: 'goes here' },
        };
      
        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });
    }

    return(
        <View style={{flex:1,backgroundColor:"#f5f5f5"}}>
           <GiftedChat
                messages={messages}
                onSend={text => onSend(text)}
                user={{
                    _id: id,
                }}
                
                renderInputToolbar={(props)=>{
                    return <InputToolbar {...props}
                    />
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({});

export default MessagesScreen;