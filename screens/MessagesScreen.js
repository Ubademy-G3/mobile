import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { app } from '../app/app';
import { firebase } from '../firebase';
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat';

const db = firebase.default.firestore();
const chatsRef = db.collection('users');

const MessagesScreen = (props) => {
    const param_other_user_id = props.route.params ? props.route.params.id : 'defaultID';
    const [messages, setMessages] = useState([]);
    const [id, setId] = useState(null);

    const onRefresh = async() => {
        const myId = await app.getId();
        setId(myId);
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

    const onSend = (messageArray) => {
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