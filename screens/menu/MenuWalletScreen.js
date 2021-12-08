import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { app } from '../../app/app';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const MenuWalletScreen = (props) => {
    const [loading, setLoading] = useState(false);
    
    const onRefresh = async () => {
        console.log("[Menu Wallet screen] entro a onRefresh"); 
        setLoading(true); 
        setLoading(false);
        console.log("[Menu Wallet screen] salgo del onRefresh");
    }

    useEffect(() => {
        onRefresh();
    }, [props]);

    return (
        <View style={styles.container}>
            <Text>Wallet Screen!!!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
})

export default MenuWalletScreen;