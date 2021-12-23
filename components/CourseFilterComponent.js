import React, { useEffect, useState } from 'react';
import { StyleSheet, CheckBox, Text, View, FlatList, Modal, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { app } from '../app/app';
import subs from '../assets/data/subscriptionTypeCourses';

Feather.loadFont();

const CourseFilterComponent = (props) => {
    const [categories, setCategories] = useState(null);
    const [subscriptions, setSubscriptions] = useState(subs);
    const [loading, setLoading] = useState(false);

    const handleGetAllCategories = (response) => {
        if (!response.hasError()) {
            let cats = response.content();
            cats = cats.map((c) => {
                c.isChecked = false;
                return c;
            });
            setCategories(cats);
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
        props.updateCourses(query);
        props.setVisible(false);
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
              <Text>{item.name}</Text>
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
              <Text>{item.name}</Text>            
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
                    <Feather name="x" size={20} style={styles.cancelButton} onPress={() => { props.setVisible(false) }}/>
                    <Text style={styles.title}>Categories</Text>
                    <FlatList
                        data={categories}
                        renderItem={renderCategoryItem}
                        keyExtractor={(item) => item.id.toString()}
                    />
                    <Text style={styles.title}>Subscription type</Text>
                    <FlatList
                        data={subscriptions}
                        renderItem={renderSubscriptionItem}
                        keyExtractor={(item) => item.id}
                    />
                    <TouchableOpacity
                        onPress={() => { setFilter() }}
                        style={styles.button}
                    >
                        <Text style={styles.description}>Filter</Text>
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
    description: {
        fontSize: 16,
        textAlign: "center",
        color:'black',
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
    title: {
        color: 'black',
        fontSize: 20,
        textAlign: 'left',
        marginLeft: 20,
        marginBottom: 10
    },
    dialog: {  
        justifyContent: 'flex-start',  
        alignItems: 'flex-start',   
        backgroundColor : "white",
        height: '80%' ,  
        width: '100%',  
        borderRadius:10,  
        borderWidth: 1,  
        borderColor: '#fff',
        marginTop: 50
    },
    cancelButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        marginRight: 5
    },
    listItem: {
        flexDirection: 'row',
        marginLeft: 20
    }
})

export default CourseFilterComponent;