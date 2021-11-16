import React, {useState} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Button, Alert } from 'react-native';
import forYouData from '../../assets/data/forYouData'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {app} from '../../app/app';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const MenuChangeSubscription = (props) => {
    const [loading, setLoading] = useState(false);

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
    
        await app.apiClient().editProfile({subscription: subscription, token: tokenLS}, user_id, handleApiResponseUpdate);        
        console.log("[Subscription screen] termino update")
    }
    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Text style={styles.description}>
                    Free description.
                </Text>
                <TouchableOpacity
                    onPress={() => {handleUpdateSubscription("Free")}}
                    style={styles.button}
                    disabled={loading}
                >
                    {
                        loading ? <ActivityIndicator animating={loading} /> : <Text style={styles.buttonText}>Get Free Subscription</Text>
                    }
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <Text style={styles.description}>
                    Platinum description.
                </Text>
                <TouchableOpacity
                    onPress={() => {handleUpdateSubscription("Platinnum")}}
                    style={styles.button}
                    disabled={loading}
                >
                    {
                        loading ? <ActivityIndicator animating={loading} /> : <Text style={styles.buttonText}>Get Platinum Subscription</Text>
                    }
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <Text style={styles.description}>
                    Gold description.
                </Text>
                <TouchableOpacity
                    onPress={() => {handleUpdateSubscription("Gold")}}
                    style={styles.button}
                    disabled={loading}
                >
                    {
                        loading ? <ActivityIndicator animating={loading} /> : <Text style={styles.buttonText}>Get Gold Subscription</Text>
                    }
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: "center",
        color:'black',
        fontWeight: '700',
        paddingBottom: 5,
    },
    buttonContainer: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: `#87ceeb`,
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color:'white',
        fontWeight: '700',
        fontSize: 16,
    },
    
})

export default MenuChangeSubscription;