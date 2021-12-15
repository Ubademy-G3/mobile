import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { app } from '../app/app';
import { firebase } from '../firebase';
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import { createIconSetFromFontello } from 'react-native-vector-icons';

const db = firebase.default.firestore();
const chatsRef = db.collection('users');

const MessagesScreen = (props) => {
    const param_other_user_id = props.route.params ? props.route.params.id : 'defaultID';
    /* const param_other_user_first_name = props.route.params ? props.route.params.firstName : 'defaultID';
    const param_other_user_last_name = props.route.params ? props.route.params.lastName : 'defaultID'; */
    console.log(props.route.params)
    const [messages, setMessages] = useState([]);
    const [id, setId] = useState(null);
    const [name, setName] = useState({
        firstName: "",
        lastName: "",
    });

    const handleApiResponseProfile = (response) => {
        if (!response.hasError()) {
            setName({firstName: response.content().firstName, lastName: response.content().lastName})
        } else {
            console.log("[ListStudent Screen] error", response.content().message);
        }
    }

    const onRefresh = async() => {
        const myId = await app.getId();
        setId(myId);
        let tokenLS = await app.getToken();
        await app.apiClient().getProfile({ id: myId, token: tokenLS }, myId, handleApiResponseProfile);
        console.log("MY ID:", myId);
        //console.log("OTHERS ID:", param_other_user_id, param_other_user_first_name);
        const messageRef = chatsRef.doc(myId)
            .collection('messages')
            .orderBy('createdAt', "desc")
        messageRef.onSnapshot((querySnap)=>{
            let allmsg = querySnap.docs.map(docSanp => {
                const data = docSanp.data()
                if (data.createdAt && (data.sentBy == param_other_user_id || data.sentTo == param_other_user_id)) {
                    return {
                        ...docSanp.data(),
                        createdAt: docSanp.data().createdAt.toDate()
                    }
                } else {
                    if (data.sentBy == param_other_user_id || data.sentTo == param_other_user_id) {
                        return {
                            ...docSanp.data(),
                            createdAt: new Date()
                        }
                    }
                }
                return null;
            })
            allmsg = allmsg.filter((msg) => msg !== null);
            setMessages(allmsg);
        })
    }

    useEffect(() => {
        onRefresh();
    }, []);

    const onSend = async (messageArray) => {
        const msg = messageArray[0];
        const mymsg = {
            ...msg,
            sentBy: id,
            sentTo: param_other_user_id,
            createdAt: new Date()
        };
        setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg));
        
        chatsRef.doc(param_other_user_id)
         .collection('messages')
         .add({ ...mymsg, createdAt: firebase.default.firestore.FieldValue.serverTimestamp() });

        chatsRef.doc(id)
         .collection('messages')
         .add({ ...mymsg, createdAt: firebase.default.firestore.FieldValue.serverTimestamp() });

        let expoPushToken = await chatsRef.doc(param_other_user_id).get();
        console.log("expoPushToken:", expoPushToken.data().expoPushToken);
        sendPushNotification(expoPushToken.data().expoPushToken, msg.text);
    }

    const sendPushNotification = async (expoPushToken, text) => {
        const message = {
          to: expoPushToken,
          sound: 'default',
          title: `${name.firstName} ${name.lastName}`,
          body: text,
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
        <View style={{ flex:1, backgroundColor:"#f5f5f5" }}>
            {id && (
                <>
                    <GiftedChat
                        messages={messages}
                        onSend={text => onSend(text)}
                        user={{
                            _id: id,
                        }}
                        
                        renderInputToolbar={(props) => {
                            return <InputToolbar {...props}
                            />
                        }}
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({});

export default MessagesScreen;