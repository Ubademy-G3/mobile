import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Button, Alert } from 'react-native';
import forYouData from '../assets/data/forYouData'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {app} from '../app/app';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const MenuChangeSubscription = (props) => {

    const handleApiResponseUpdate = (response) => {
        console.log("[Subscription screen] content: ", response.content())
        if (!response.hasError()) {
            Alert.alert(
                "Update Succesfull:",
                response.content().message,
                [
                  { text: "OK", onPress: () => {} }
                ]
            );
        } else {
            console.log("[Subscription screen] error", response.content().message);
        }
    }

    const handleUpdateSubscription = async (subscription) => {
        console.log("[Subscription screen] entro al update")  
        let tokenLS = await app.getToken();
        let user_id = await app.getId();
    
        await app.apiClient().updateSubscription({subscription: subscription, token: tokenLS}, user_id, handleApiResponseUpdate);        
        console.log("[Subscription screen] termino update")
    }

    return (
        <View style={styles.container}>
            <View>        
                <Button
                    title="Free"
                    onPress={() => {handleUpdateSubscription("Free")}}
                    />
                <Text style={styles.description}>
                Free description.
                </Text>
            </View>
            <View>        
                <Button
                    title="Gold"
                    onPress={() => {handleUpdateSubscription("Gold")}}
                    />
                <Text style={styles.description}>
                Gold description.
                </Text>
            </View>
            <View>        
                <Button
                    title="Platinum"
                    onPress={() => {handleUpdateSubscription("Platinum")}}
                    />
                <Text style={styles.description}>
                Platinum description.
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    description: {
        fontSize: 16,
        textAlign: "center"
    } 
    
})

export default MenuChangeSubscription;