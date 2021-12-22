import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, FlatList, Modal, TouchableOpacity, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Checkbox } from 'react-native-paper';

MaterialCommunityIcons.loadFont();

const data = {
    progress: [
        {
            id: '0',
            name: '10 exams',
            value: '10',
            isChecked: false
        },
        {
            id: '1',
            name: '20 exams',
            value: '20',
            isChecked: false
        },
        {
            id: '2',
            name: '40 exams',
            value: '40',
            isChecked: false
        },
        {
            id: '3',
            name: '80 exams',
            value: '80',
            isChecked: false
        }
    ],
}

const CollaboratorsFilterComponent = (props) => {
    const [progress, setProgress] = useState(data.progress);

    const cleanFilters = () => {
        setProgress(data.progress);
    }

    const setFilter = () => {
        const query = {
          progress: progress,
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

    const renderProgressItem = ({ item }) => {
        return (
            <View style={styles.listItem}>
              {/* <CheckBox
                value={item.isChecked}
                onValueChange={() => { addProgress(item); }}
              /> */}
            <Checkbox
                status={item.isChecked}
                onPress={() => { addProgress(item); }}
            />
              <Text>{item.name}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.dialog}>
                <View>
                    <Text style={styles.title}>{`The amount of exams graded is \ngreater than`}</Text>
                    <FlatList
                        data={progress}
                        renderItem={renderProgressItem}
                        keyExtractor={(item) => item.id}
                    />
                </View>
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

export default CollaboratorsFilterComponent;