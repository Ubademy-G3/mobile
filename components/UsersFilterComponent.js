import React, { useState } from 'react';
import { StyleSheet, CheckBox, Text, View, FlatList, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

MaterialCommunityIcons.loadFont();

const data = {
    progress: [
        {
            id: '0',
            name: '0%',
            value: '0',
            isChecked: false
        },
        {
            id: '1',
            name: '25%',
            value: '25',
            isChecked: false
        },
        {
            id: '2',
            name: '50%',
            value: '50',
            isChecked: false
        },
        {
            id: '3',
            name: '75%',
            value: '75',
            isChecked: false
        }
    ],
    approval: [
        {
            id: '0',
            name: 'Passed',
            value: true,
            isChecked: false
        },
        {
            id: '1',
            name: 'Not approved',
            value: false,
            isChecked: false
        }
    ]
}

const UsersFilterComponent = (props) => {
    const [progress, setProgress] = useState(data.progress);
    const [approved, setApproved] = useState(data.approval);

    const cleanFilters = () => {
        setApproved(data.approval);
        setProgress(data.progress);
    }

    const setFilter = () => {
        const query = {
          progress: progress,
          approved: approved
        };
        cleanFilters();
        props.updateUsers(query);
    };

    const addProgress = (item) => {
        for (let i = 0; i < progress.length; i++) {
            if (progress[i].isChecked === true && progress[i].id !== item.id) {
                return;
            }
        }
        let temp = progress.map((s) => {
            if (item.id === s.id) {
              return { ...s, isChecked: !s.isChecked };
            }
            return s;
          });
        setProgress(temp);
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

    const renderProgressItem = ({ item }) => {
        return (
            <View style={styles.listItem}>
              <CheckBox
                value={item.isChecked}
                onValueChange={() => { addProgress(item); }}
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
                <>
                    <View>
                        <Text style={styles.title}>{`Progress \ngreater than`}</Text>
                        <FlatList
                            data={progress}
                            renderItem={renderProgressItem}
                            keyExtractor={(item) => item.id}
                        />
                    </View>
                    <View>
                        <Text style={styles.title}>{`Approval\n`}</Text>
                        <FlatList
                            data={approved}
                            renderItem={renderApprovedItem}
                            keyExtractor={(item) => item.id}
                        />
                    </View>
                </>
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

export default UsersFilterComponent;