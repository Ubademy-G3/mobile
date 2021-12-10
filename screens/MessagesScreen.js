import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { set } from 'react-native-reanimated';
import { GetAllExamsByCourseIdEndpoint } from '../communication/endpoints/GetAllExamsByCourseIdEndpoint';
import {app} from '../app/app';
import { firebase } from '../firebase';
import { GiftedChat } from 'react-native-gifted-chat'

const MessagesScreen = (props) => {
    const param_other_user_id = props.route.params ? props.route.params.id : 'defaultID';
    
    const [messages, setMessages] = useState([]);

    const [id, setId] = useState(0);

    const getMyId = async () => {
        let myId = await app.getId();
        setId(myId);
    }

    useEffect(() => {
        getMyId();
    }, [])

    /* useEffect(() => {
        const docid  = param_other_user_id > id ? id+ "-" + param_other_user_id : param_other_user_id+"-"+id;
        const messageRef = firestore().collection('chatrooms')
        .doc(docid)
        .collection('messages')
        .orderBy('createdAt',"desc")
        const unsubscribe = messageRef.onSnapshot((querySnapshot) => {
            const messagesFirestore = querySnapshot
                .docChanges()
                .filter(({ type }) => type === 'added')
                .map(({ doc }) => {
                    const message = doc.data()
                    //createdAt is firebase.firestore.Timestamp instance
                    //https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
                    return { ...message, createdAt: message.createdAt.toDate() }
                })
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            appendMessages(messagesFirestore)
        })
        return () => unsubscribe()
    }, []); */

    useEffect(() => {
        const docid  = param_other_user_id > id ? id+ "-" + param_other_user_id : param_other_user_id+"-"+id;
        const messageRef = firebase.default.firestore().collection('chatrooms')
        .doc(docid)
        .collection('messages')
        .orderBy('createdAt',"desc")
  
        const unSubscribe = messageRef.onSnapshot((querySnap)=>{
              const allmsg = querySnap.docs.map(docSanp=>{
               const data = docSanp.data()
               if(data.createdAt){
                   return {
                      ...docSanp.data(),
                      createdAt:docSanp.data().createdAt.toDate()
                    }
               }else {
                  return {
                      ...docSanp.data(),
                      createdAt:new Date()
                  }
               }
                  
              })
              setMessages(allmsg)
          })
          return ()=>{
            unSubscribe()
          }

        }, []);

    const appendMessages = useCallback(
        (messages) => {
            setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
        },
        [messages]
    )

    /* async function handleSend(messages) {
        const writes = messages.map((m) => chatsRef.add(m))
        await Promise.all(writes)
    } */

    const onSend =(messageArray) => {
        const msg = messageArray[0]
        const mymsg = {
            ...msg,
            sentBy:id,
            sentTo:param_other_user_id,
            createdAt:new Date()
        }
       setMessages(previousMessages => GiftedChat.append(previousMessages,mymsg))
       const docid  = param_other_user_id > id ? id+ "-" + param_other_user_id : param_other_user_id+"-"+id 
 
       firebase.default.firestore().collection('chatrooms')
       .doc(docid)
       .collection('messages')
       .add({...mymsg,createdAt:firebase.default.firestore.FieldValue.serverTimestamp()})
    }

    return(
        <View style={{flex:1,backgroundColor:"#f5f5f5"}}>
            <GiftedChat messages={messages} user={param_other_user_id} onSend={onSend} />
        </View>
    );
}

const styles = StyleSheet.create({});

export default MessagesScreen;