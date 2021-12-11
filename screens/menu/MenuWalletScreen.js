import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Image, Pressable, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { app } from '../../app/app';

const MenuWalletScreen = (props) => {
    const [loading, setLoading] = useState(false);
    const [wallet, setWallet] = useState(null);

    const handleApiResponseCreateWallet = (response) => {
        console.log("[Create Wallet screen] response content: ", response.content())
        if (!response.hasError()) {
            Alert.alert(
                "Creation Succesfull:",
                response.content().message,
                [
                  { text: "OK", onPress: () => {} }
                ]
            );
            onRefresh();
        } else {
            console.log("[Create Wallet screen] error", response.content().message);
        }
    };

    const handleSubmitCreateWallet = async() => {
        console.log("[Create Wallet screen] entro a submit")
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        console.log("[Create Wallet screen] token:", tokenLS);
        await app.apiClient().createWallet({ token: tokenLS }, idLS, handleApiResponseCreateWallet);
        setLoading(false);
        console.log("[Create Wallet screen] termino submit")
    };

    const handleResponseGetWallet = (response) => {
        console.log("[Wallet Screen] wallet content: ", response.content())
        if (!response.hasError()) {
            setWallet(response.content());
        } else {
            console.log("[Wallet Screen] error", response.content().message);
        }
    };

    const handleApiResponseUser = async (response) => {
        if (!response.hasError()) {
            let tokenLS = await app.getToken();
            let idLS = await app.getId();
            if (response.content().walletId) {
                await app.apiClient().getWalletById({ token: tokenLS }, idLS, handleResponseGetWallet);
            }
        } else {
            console.log("[Wallet screen] error", response.content().message);
        }
    };

    const onRefresh = async () => {
        console.log("[Menu Wallet screen] entro a onRefresh");
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        await app.apiClient().getProfile({ id: idLS, token: tokenLS }, idLS, handleApiResponseUser);
        setLoading(false);
        console.log("[Menu Wallet screen] salgo del onRefresh");
    };

    useFocusEffect(
        useCallback(() => {
            onRefresh();
            //return () => unsubscribe();
        }, [])
    );

    return (
      <View style={styles.container}>
        {wallet ? (
          <>
            <Text style={styles.titleBalance}>Balance</Text>
            <Image source={require("../../assets/images/balance.png")} style={styles.image} />
            <Text style={styles.subtitleBalance}>$ {wallet.balance}</Text>
            <Text style={styles.subtitle} selectable={true}>Address: {wallet.address}</Text>
          </>
        ) : (
          <>
            <Text style={styles.title}>Wallet for course subscriptions</Text>
            <Text style={styles.subtitle}>Get a wallet to access exclusive courses</Text>
            <Image source={require("../../assets/images/wallet.png")} style={styles.image} />
            <Pressable style={styles.createButton} onPress={() => { handleSubmitCreateWallet(); }} >
                <Text style={styles.buttonText}>
                    Create a wallet
                </Text>
            </Pressable>
           </>
        )}
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        textAlign: 'center',
        fontSize: 30,
        marginTop: 30,
        backgroundColor: '#87ceeb',
        color: 'white'
    },
    titleBalance: {
        textAlign: 'center',
        fontSize: 30,
        marginTop: 30,
        backgroundColor: 'green',
        color: 'white'
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 20,
        margin: 20
    },
    subtitleBalance: {
        textAlign: 'center',
        fontSize: 50,
        margin: 20
    },
    image: {
        width: 150,
        height: 160,
        marginLeft: 120,
        marginTop: 50
    },
    createButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#87ceeb',
        marginTop: 50,
        width: '60%',
        marginLeft: 80
    },
    buttonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    }
})

export default MenuWalletScreen;