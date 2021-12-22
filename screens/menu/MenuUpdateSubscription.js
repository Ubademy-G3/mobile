import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, SafeAreaView, Pressable, Modal, ActivityIndicator, Alert } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { app } from '../../app/app';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const MenuChangeSubscription = (props) => {
    const [loading, setLoading] = useState(false);
    const [modalErrorVisible, setModalErrorVisible] = useState(false);
    const [modalErrorText, setModalErrorText] = useState("");
    const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const [subscriptionExpDate, setSubscriptionExpDate] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selected, setSelected] = useState(null);
    const [downgrade, setDowngrade] = useState(false);
    const [modalSuccessText, setModalSuccessText] = useState("")

    const handleApiResponseUpdate = (response) => {
        console.log("[Subscription screen] content: ", response.content())
        if (!response.hasError()) {
            console.log("Update successful");
        } else {
            console.log("[Subscription screen] error", response.content().message);
        }
    }

    const handleApiResponseDeposit = async (response) => {
        console.log("[Subscription screen] content: ", response.content())
        if (!response.hasError()) {
            let tokenLS = await app.getToken();
            let user_id = await app.getId();
            await app.apiClient().editProfile({ subscription: selected, token: tokenLS }, user_id, handleApiResponseUpdate);
            setSubscription(selected);
            setModalSuccessText(response.content().message)
            setModalSuccessVisible(true);
            /* Alert.alert(
                "Deposit Successful",
                response.content().message,
                [
                  { text: "OK", onPress: () => {} }
                ]
            ); */
        } else {
            console.log("[Subscription screen] error", response.content().message);
            if (response.content().message.includes("insufficient funds")) {
                setModalErrorText("Insufficient funds for transaction");
                setModalErrorVisible(true);
                /* Alert.alert("Insufficient funds for transaction"); */
            } else {
                setModalErrorText("Please, try again in a few minutes");
                setModalErrorVisible(true);
                /* Alert.alert("Please, try again in a few minutes"); */
            }
        }
    }

    const handleConfirmSubscription = async () => {
        console.log("[Subscription screen] entro al confirm")
        let tokenLS = await app.getToken();
        let user_id = await app.getId();
        if (!downgrade) {
            if (subscription == 'free') {
                let amount = selected == 'gold' ? "0.000001" : "0.000002";
                await app.apiClient().makeDeposit({ amount: amount, token: tokenLS }, user_id, handleApiResponseDeposit)
            }
            if (subscription == 'gold') {
                let amount = "0.000002";
                await app.apiClient().makeDeposit({ amount: amount, token: tokenLS }, user_id, handleApiResponseDeposit)
            }
        }
        setModalVisible(!modalVisible);
        console.log("[Subscription screen] termino confirm")
    }

    const handleUpdateSubscription = (subscriptionSelected) => {
        setSelected(subscriptionSelected);
        if ((subscriptionSelected === 'gold' && subscription === 'platinum') || subscriptionSelected === 'free') {
            setModalVisible(true);
            setDowngrade(true);
        } else if (subscriptionSelected === 'gold' || subscriptionSelected === 'platinum') {
            setModalVisible(true);
            setDowngrade(false);
        }
    }

    const handleApiResponseUser = async (response) => {
        if (!response.hasError()) {
            if (response.content().subscription) {
                setSubscription(response.content().subscription);
            }
            if (response.content().subscriptionExpirationDate) {
                setSubscriptionExpDate(response.content().subscriptionExpirationDate);
            }
        } else {
            console.log("[Subscription screen] error", response.content().message);
        }
    };

    const onRefresh = async () => {
        console.log("[Menu Update Subscription screen] entro a onRefresh");
        setLoading(true);
        let tokenLS = await app.getToken();
        let idLS = await app.getId();
        await app.apiClient().getProfile({ id: idLS, token: tokenLS }, idLS, handleApiResponseUser);
        setLoading(false);
        console.log("[Menu Update Subscription screen] salgo del onRefresh");
    };

    /* useEffect(() => {
        onRefresh();
    }, []); */

    useFocusEffect(
        useCallback(() => {
            onRefresh();
        }, [])
    );

    return (
        <View style={styles.centeredView}>
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
                                <Text style={styles.modalText}>Deposit Unsuccesfull:</Text>
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
                                <Text style={styles.modalText}>Deposit Successful:</Text>
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
            {
            loading ? 
                <View style={{flex:1, justifyContent: 'center'}}>
                    <ActivityIndicator color="#696969" animating={loading} size="large" /> 
                </View>
            :
                <>
                <SafeAreaView style={styles.containerWrapper}>
                    {modalVisible && (
                        <View style={{backgroundColor: 'rgba(0, 0, 0, 0.8)', height: '100%'}}>
                            <Modal 
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => {
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <View style={styles.dialog}>
                                    {selected == 'gold' && !downgrade && (
                                        <Text style={styles.description}>You are transferring $5 to Ubademy Account</Text>
                                    )}
                                    {selected == 'platinum' && !downgrade && (
                                        <Text style={styles.description}>You are transferring $8 to Ubademy Account</Text>
                                    )}
                                    {downgrade ? (
                                        <>
                                            <Text style={styles.description}>
                                                {`You're choosing to downgrade your plan.\nDon't worry, your current subscription will be available until ${subscriptionExpDate.substring(0, 10)}`}
                                            </Text>
                                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 50 }}>
                                                <Pressable
                                                    onPress={() => setModalVisible(false)}
                                                    style={styles.confirmButton}
                                                >
                                                    <Text>OK</Text>
                                                </Pressable>
                                            </View>
                                        </>
                                    ) : (
                                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 50 }}>
                                            <Pressable
                                                onPress={() => setModalVisible(!modalVisible)}
                                                style={styles.cancelButton}
                                            >
                                                <Text>Cancel</Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={() => handleConfirmSubscription()}
                                                style={styles.confirmButton}
                                            >
                                                <Text>Confirm</Text>
                                            </Pressable>
                                        </View>
                                    )}
                                </View>
                            </Modal>
                        </View>
                    )}
                    <ScrollView style={styles.info}>
                        {subscription && (
                            <Text style={styles.title} >
                                You are currently a {subscription} member
                            </Text>
                        )}
                        {subscriptionExpDate && !(subscription === 'free') && (
                            <Text style={{color: 'black', marginLeft: 50}}>
                                Subscription valid until {subscriptionExpDate.substring(0,10)}
                            </Text>
                        )}
                        {subscription !== 'free' && (
                            <View style={styles.buttonContainer}>
                                <Text style={styles.description}>
                                    {`+100 courses available for\nFREE`}
                                </Text>
                                <Image style={styles.image} source={require("../../assets/images/free_subscription.jpg")} />
                                <TouchableOpacity
                                    onPress={() => {handleUpdateSubscription("free")}}
                                    style={styles.button}
                                    disabled={loading}
                                >
                                    {
                                        loading ? <ActivityIndicator animating={loading} /> : <Text style={styles.buttonText}>Get FREE Subscription</Text>
                                    }
                                </TouchableOpacity>
                            </View>
                        )}
                        {subscription !== 'gold' && (
                            <View style={styles.buttonContainer}>
                                <Text style={styles.description}>
                                    +250 courses available for
                                </Text>
                                <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                                    $5
                                </Text>
                                <Image style={styles.image} source={require("../../assets/images/gold_subscription.jpg")} />
                                <TouchableOpacity
                                    onPress={() => {handleUpdateSubscription("gold")}}
                                    style={styles.button}
                                    disabled={loading}
                                >
                                    {
                                        loading ? <ActivityIndicator animating={loading} /> : <Text style={styles.buttonText}>Get GOLD Subscription</Text>
                                    }
                                </TouchableOpacity>
                            </View>
                        )}
                        {subscription !== 'platinum' && (
                            <View style={styles.buttonContainer}>
                                <Text style={styles.description}>
                                    Access to every course in Ubademy for
                                </Text>
                                <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                                    $8
                                </Text>
                                <Image style={styles.image} source={require("../../assets/images/platinum_subscription.jpg")} />
                                <TouchableOpacity
                                    onPress={() => {handleUpdateSubscription("platinum")}}
                                    style={styles.button}
                                    disabled={loading}
                                >
                                    {
                                        loading ? <ActivityIndicator animating={loading} /> : <Text style={styles.buttonText}>Get PLATINUM Subscription</Text>
                                    }
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                </SafeAreaView>
            </>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    info: {
        width: '100%',
        marginLeft: 80
    },
    description: {
        fontSize: 16,
        textAlign: "center",
        color:'black',
        fontWeight: '700',
        paddingBottom: 5,
    },
    buttonContainer: {
        flex: 1,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: 'lightblue',
        backgroundColor: 'white',
        padding: 10
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
    image: {
        width: 100,
        height: 100
    },
    title: {
        color: 'black',
        fontSize: 35,
        textAlign: 'center',
        marginRight: 70
    },
    dialog: {  
        justifyContent: 'center',  
        alignItems: 'center',   
        backgroundColor : "white",
        height: 300 ,  
        width: '80%',  
        borderRadius:10,  
        borderWidth: 1,  
        borderColor: '#fff',    
        marginTop: 200,  
        marginLeft: 40
    },
    cancelButton: {
        backgroundColor: '#FBFBFB',
        color: 'white',
        padding: 15,
        borderRadius: 10,
        marginTop: 60,
        marginRight: 50
    },
    confirmButton: {
        backgroundColor: '#39C0ED',
        padding: 15,
        borderRadius: 10,
        marginTop: 60,
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

export default MenuChangeSubscription;