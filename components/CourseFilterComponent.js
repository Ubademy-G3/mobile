import React, {Component, useEffect, useState, useCallback} from 'react';
import { StyleSheet, CheckBox, Text, View, Button, Image, TextInput, FlatList, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import Feather from 'react-native-vector-icons/Feather';
import SelectDropdown from 'react-native-select-dropdown';
import { app } from '../app/app';
import subs from '../assets/data/subscriptionTypeCourses';

Feather.loadFont();

const CourseFilterComponent = (props) => {
    const [categories, setCategories] = useState(null);
    const [subscriptions, setSubscriptions] = useState(subs);
    const [loading, setLoading] = useState(false);

    const handleGetAllCategories = (response) => {
        // console.log("[Home screen] categories content: ", response.content())
        if (!response.hasError()) {
            let cats = response.content();
            cats = cats.map((c) => {
                c.isChecked = false;
                return c;
            });
            setCategories(cats);
            console.log("[Home screen] categories: ", categories);
        } else {
            console.log("[Home screen] error", response.content().message);
        }
    }

    const onRefresh = async () => {
        setLoading(true);
        let tokenLS = await app.getToken();
        app.apiClient().getAllCategories({ token: tokenLS }, handleGetAllCategories);
        setLoading(false);
    };

    useEffect(() => {
        onRefresh();
    }, []);

    const setFilter = () => {
        const query = {
          category: categories,
          subscription_type: subscriptions,
        };
        console.log(query);
        props.updateCourses(query);
        props.setVisible(false);
        //p.updateCourses(query);
    };

    const addCategory = (category) => {
        let temp = categories.map((c) => {
            if (category.id === c.id) {
              return { ...c, isChecked: !c.isChecked };
            }
            return c;
          });
        setCategories(temp);
    }

    const addSubscription = (subscription) => {
        let temp = subscriptions.map((s) => {
            if (subscription.id === s.id) {
              return { ...s, selected: !s.selected };
            }
            return s;
          });
        setSubscriptions(temp);
    }

    const renderCategoryItem = ({ item }) => {
        return (
            <View style={styles.listItem}>
              <CheckBox
                value={item.isChecked}
                onValueChange={() => { addCategory(item); }}
              />
              <Text style={{color: 'black'}}>{item.name}</Text>            
            </View>
        );
    };

    const renderSubscriptionItem = ({ item }) => {
        return (
            <View style={styles.listItem}>
              <CheckBox
                value={item.selected}
                onValueChange={() => { addSubscription(item); }}
              />
              <Text style={{color: 'black'}}>{item.name}</Text>            
            </View>
        );
    };

    return (
        <View style={{backgroundColor: 'rgba(0, 0, 0, 0.8)', height: '100%'}}>
            <Modal 
                animationType="slide"
                transparent={true}
                visible={props.visible}
                onRequestClose={() => {
                    props.setVisible(!props.visible);
                }}
            >
                <View style={styles.dialog}>
                    <Text>Categories</Text>
                    <FlatList
                        data={categories}
                        renderItem={renderCategoryItem}
                        keyExtractor={(item) => item.id.toString()}
                    />
                    <Text>Subscription type</Text>
                    <FlatList
                        data={subscriptions}
                        renderItem={renderSubscriptionItem}
                        keyExtractor={(item) => item.id}
                    />
                    <TouchableOpacity
                        onPress={() => { setFilter() }}
                        style={styles.button}
                    >
                        <Text>Filter</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
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
        height: '80%' ,  
        width: '100%',  
        borderRadius:10,  
        borderWidth: 1,  
        borderColor: '#fff',
        marginTop: 50
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
    listItem: {
        flexDirection: 'row'
    }
})

export default CourseFilterComponent;