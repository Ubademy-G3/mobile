import React, { useState } from 'react';
import { StyleSheet, CheckBox, Text, View, Image, TextInput, FlatList, Modal, TouchableOpacity, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

MaterialCommunityIcons.loadFont();

const data = {
    state: [
        {
            id: '0',
            name: 'Draft',
            isChecked: false
        },
        {
            id: '1',
            name: 'Active',
            isChecked: false
        },
        {
            id: '2',
            name: 'Inactive',
            isChecked: false
        }
    ],
    graded: [
        {
            id: 0,
            name: 'Graded',
            isChecked: false
        },
        {
            id: 1,
            name: 'Not yet graded',
            isChecked: false
        }
    ],
    approval: [
        {
            id: 0,
            name: 'Passed',
            isChecked: false
        },
        {
            id: 1,
            name: 'Failed',
            isChecked: false
        }
    ]
}

const ExamsFilterComponent = (props) => {
    const type = props.type;
    const [state, setState] = useState(data.state);
    const [graded, setGraded] = useState(data.graded);
    const [approved, setApproved] = useState(data.approval);

    const cleanFilters = () => {
        setGraded(data.graded);
        setApproved(data.approval);
        setState(data.state);
    }

    const setFilter = () => {
        const query = {
          state: state,
          graded: graded,
          approved: approved
        };
        cleanFilters();
        props.updateExams(query);
    };

    const addGraded = (item) => {
        for (let i = 0; i < graded.length; i++) {
            if (graded[i].isChecked === true && graded[i].id !== item.id) {
                return;
            }
        }
        let temp = graded.map((g) => {
            if (item.id === g.id) {
              return { ...g, isChecked: !g.isChecked };
            }
            return g;
          });
        setGraded(temp);
    }

    const addState = (item) => {
        let temp = state.map((s) => {
            if (item.id === s.id) {
              return { ...s, isChecked: !s.isChecked };
            }
            return s;
          });
        setState(temp);
    }

    const addApproved = (item) => {
        for (let i = 0; i < approved.length; i++) {
            if (approved[i].isChecked === true && approved[i].id !== item.id) {
                return;
            }
        }
        let temp = approved.map((a) => {
            if (item.id === a.id) {
              return { ...a, isChecked: !a.isChecked };
            }
            return a;
          });
        setApproved(temp);
    }

    const renderStateItem = ({ item }) => {
        return (
            <View style={styles.listItem}>
              <CheckBox
                value={item.isChecked}
                onValueChange={() => { addState(item); }}
              />
              <Text>{item.name}</Text>
            </View>
        );
    };

    const renderGradedItem = ({ item }) => {
        return (
            <View style={styles.listItem}>
              <CheckBox
                value={item.isChecked}
                onValueChange={() => { addGraded(item); }}
              />
              <Text>{item.name}</Text>            
            </View>
        );
    };

    const renderApprovedItem = ({ item }) => {
        return (
            <View style={styles.listItem}>
              <CheckBox
                value={item.isChecked}
                onValueChange={() => { addApproved(item); }}
              />
              <Text>{item.name}</Text>            
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.dialog}>
                {type && type === 'template' && (
                    <View>
                        <Text style={styles.title}>State</Text>
                        <FlatList
                            data={state}
                            renderItem={renderStateItem}
                            keyExtractor={(item) => item.id}
                        />
                    </View>
                )}
                {type && type === 'solved' && (
                    <>
                        <View>
                            <Text style={styles.title}>Graded</Text>
                            <FlatList
                                data={graded}
                                renderItem={renderGradedItem}
                                keyExtractor={(item) => item.id}
                            />
                        </View>
                        <View>
                            <Text style={styles.title}>Approval</Text>
                            <FlatList
                                data={approved}
                                renderItem={renderApprovedItem}
                                keyExtractor={(item) => item.id}
                            />
                        </View>
                    </>
                )}
            </View>
            <TouchableOpacity
                onPress={() => { setFilter() }}
                style={styles.button}
            >
                <Text style={styles.description}>Filter</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor : "white",
        borderRadius: 10,
        marginBottom: 20,
        marginTop: 10
    },
    description: {
        fontSize: 15,
        textAlign: "center",
        color:'black',
    },
    button: {
        backgroundColor: `#87ceeb`,
        width: '30%',
        padding: 5,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10
    },
    title: {
        color: 'black',
        fontSize: 17,
        textAlign: 'left',
        marginLeft: 25,
        marginBottom: 10
    },
    dialog: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%'
    },
    listItem: {
        flexDirection: 'row',
        marginLeft: 20
    }
})

export default ExamsFilterComponent;