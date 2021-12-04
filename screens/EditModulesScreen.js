import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { app } from '../app/app';

Feather.loadFont();
MaterialCommunityIcons.loadFont();

const EditModulesScreen = (props) => {
    const { item } = props.route.params;

    const [loading, setLoading] = useState(false);

    const onRefresh = async () => {
    };
  
    useEffect(() => {
        console.log("[Edit Course screen] entro a useEffect");
        onRefresh();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text>Hola</Text>
            </ScrollView>
        </View>
      );
};

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        
    },
});

export default EditModulesScreen;