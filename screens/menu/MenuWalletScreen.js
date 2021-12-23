import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, Image, TouchableOpacity, Modal, ActivityIndicator} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { app } from '../../app/app';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

MaterialCommunityIcons.loadFont();

const MenuWalletScreen = (props) => {
    const [loading, setLoading] = useState(false);
    const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
    const [modalSuccessText, setModalSuccessText] = useState("");
    const [modalErrorVisible, setModalErrorVisible] = useState(false);
    const [modalErrorText, setModalErrorText] = useState("");
    const [wallet, setWallet] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    const handleApiResponseCreateWallet = (response) => {
        console.log("[Create Wallet screen] response content: ", response.content())
        if (!response.hasError()) {
            setModalSuccessText(response.content().message);
            setModalSuccessVisible(true);
            /* Alert.alert(
                "Creation Succesfull:",
                response.content().message,
                [
                  { text: "OK", onPress: () => {} }
                ]
            ); */
            onRefresh();
        } else {
            setModalErrorText(response.content().message);
            setModalErrorVisible(true);
            console.log("[Create Wallet screen] error", response.content().message);
        }
    };

    const handleSubmitCreateWallet = async() => {
        setSubmitLoading(true)
        console.log("[Create Wallet screen] entro a submit")
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        console.log("[Create Wallet screen] token:", tokenLS);
        await app.apiClient().createWallet({ token: tokenLS }, idLS, handleApiResponseCreateWallet);
        setLoading(false);
        console.log("[Create Wallet screen] termino submit")
        setSubmitLoading(false)
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
      <ScrollView>
      <View style={styles.container}>
        {(modalSuccessVisible || modalErrorVisible) && (
            <View style={{justifyContent: 'center', alignItems: 'center',}}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalErrorVisible}
                onRequestClose={() => {
                setModalErrorVisible(!modalErrorVisible);
                }}
            >
                <View style={[styles.centeredView, {justifyContent: 'center', alignItems: 'center',}]}>
                    <View style={styles.modalView}>
                        <View style={{ display:'flex', flexDirection: 'row' }}>
                            <MaterialCommunityIcons
                                name="close-circle-outline"
                                size={30}
                                color={"#ff6347"}
                                style={{ position: 'absolute', top: -6, left: -35}}
                            />
                            <Text style={styles.modalText}>Creation Unsuccesfull:</Text>
                        </View>
                        <Text style={styles.modalText}>{modalErrorText}</Text>
                        <Pressable
                        style={[styles.buttonModal, styles.buttonClose]}
                        onPress={() => setModalErrorVisible(!modalErrorVisible)}
                        >
                            <Text style={styles.textStyle}>Ok</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalSuccessVisible}
                onRequestClose={() => {
                setModalSuccessVisible(!modalSuccessVisible);
                }}
            >
                <View style={[styles.centeredView, {justifyContent: 'center', alignItems: 'center',}]}>
                    <View style={styles.modalView}>
                        <View style={{ display:'flex', flexDirection: 'row' }}>
                            <MaterialCommunityIcons
                                name="check-circle-outline"
                                size={30}
                                color={"#9acd32"}
                                style={{ position: 'absolute', top: -6, left: -35}}
                            />
                            <Text style={styles.modalText}>Creation Succesfull::</Text>
                        </View>
                        <Text style={styles.modalText}>{modalSuccessText}</Text>
                        <Pressable
                        style={[styles.buttonModal, {backgroundColor: "#9acd32"}]}
                        onPress={() => {
                            setModalSuccessVisible(!modalSuccessVisible)}}
                        >
                            <Text style={styles.textStyle}>Ok</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            </View>
        )}
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
            <TouchableOpacity style={styles.createButton} onPress={() => { handleSubmitCreateWallet(); }} >
                
                {submitLoading ? (
                    <ActivityIndicator style={{ margin: '50%' }} color="lightblue" animating={submitLoading} />
                ) : (
                    <Text style={styles.buttonText}>
                        Create a wallet
                    </Text>
                )}
            </TouchableOpacity>
           </>
        )}
      </View>
      </ScrollView>
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
    },
    centeredView: {
        flex: 1,
        /* justifyContent: "center",
        alignItems: "center" */
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        paddingHorizontal: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    buttonModal: {
        borderRadius: 20,
        paddingHorizontal: 40,
        paddingVertical: 15,
        elevation: 2
    },
    buttonClose: {
        backgroundColor: "#ff6347",
    },
    buttonAttention: {
        backgroundColor: "#87ceeb",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
})

export default MenuWalletScreen;