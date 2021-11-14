import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Button } from 'react-native';
import forYouData from '../assets/data/forYouData'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const MenuChangeSubscription = (props) => {
    return (
        <View style={styles.container}>
            <View>        
                <Button
                    title="Free"
                    //onPress={() => Alert.alert('Simple Button pressed')}
                    />
                <Text style={styles.description}>
                Free description.
                </Text>
            </View>
            <View>        
                <Button
                    title="Gold"
                    //onPress={() => Alert.alert('Simple Button pressed')}
                    />
                <Text style={styles.description}>
                Gold description.
                </Text>
            </View>
            <View>        
                <Button
                    title="Platinum"
                    //onPress={() => Alert.alert('Simple Button pressed')}
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