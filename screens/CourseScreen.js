import React from 'react';
import { Text, View, Button, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

Feather.loadFont();
MaterialCommunityIcons.loadFont();

const CourseScreen = (props) => {
    const { item } = props.route.params;
    
    const renderFeaturesItem = ({ item }) => {
        return (
            <View style={[
                styles.featuresItemWrapper,
                {
                  marginLeft: item.id === '1' ? 5 : 0,
                },
            ]}>
                <Text style={styles.featuresItemTitle}>{item.key}</Text>
                <Text style={styles.featuresItemText}>{item.name}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.titlesWrapper}>
                    <View>
                        <Image source={item.image} style={styles.titlesImage} />
                    </View>
                    <View style={styles.titleWrapper}>
                        <Text style={styles.titlesTitle}>{item.title}</Text>
                        <View style={styles.titlesRating}>
                            <MaterialCommunityIcons
                                name="star"
                                size={18}
                                color={'black'}
                            />
                        <Text style={styles.rating}>{item.rating}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.descriptionWrapper}>
                    <Text style={styles.description}>{item.description}</Text>
                </View>

                <View style={styles.featuresWrapper}>
                    <Text style={styles.featuresTitle}>Features</Text>
                    <View style={styles.featuresListWrapper}>
                    <FlatList
                        data={item.features}
                        renderItem={renderFeaturesItem}
                        keyExtractor={(item) => item.id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                    </View>
                </View>
            </ScrollView>
            <TouchableOpacity onPress={() => {}}> 
                <View style={styles.subscribeWrapper}>
                    <Feather name="plus" size={18} color="black" />
                    <Text style={styles.subscribeText}>Subscribe</Text>
                </View>
            </TouchableOpacity>
        </View>
        /*<View style={styles.container}>
          <SafeAreaView>
            <View style={styles.headerWrapper}>
              <TouchableOpacity onPress={() => props.navigation.goBack()}>
                <View style={styles.headerLeft}>
                  <Feather name="chevron-left" size={12} color={colors.textDark} />
                </View>
              </TouchableOpacity>
              <View style={styles.headerRight}>
                <MaterialCommunityIcons
                  name="star"
                  size={12}
                  color={colors.white}
                />
              </View>
            </View>
          </SafeAreaView>
        </View> */
      );
};

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        //width:'90%',
        //paddingTop: 25,
        //paddingLeft: 15,
    },
    titlesWrapper: {
        flexDirection: "row",
        paddingVertical:25,
        paddingHorizontal: 15,
        //paddingTop: 5,
        //paddingLeft: 10,
        //justifyContent: 'center',
        //alignItems: 'center',
    },
    titlesImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    titleWrapper: {
        //paddingVertical:25,
        paddingHorizontal: 10,
    },
    titlesTitle: {
        fontSize: 24,
    },
    titlesRating: {
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontSize: 18,
    },
    descriptionWrapper: {
        paddingHorizontal: 15,
        //paddingVertical: 10,
    },
    description: {
        fontSize: 16,
    },
    featuresWrapper: {
        marginTop: 10,
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
    featuresTitle: {
        //paddingHorizontal: 10,
        fontSize: 16,
    },
    featuresListWrapper: {
        paddingVertical: 10,
    },
    featuresItemWrapper: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginRight: 10,
        borderRadius: 15,
        shadowColor: 'black',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    featuresItemTitle: {
        fontSize: 16,
    },
    featuresItemText: {},
    subscribeWrapper: {
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 95,
        backgroundColor: '#87ceeb',
        borderRadius: 50,
        width: '50%',
        paddingVertical: 10,
        paddingHorizontal: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    subscribeText: {
        fontSize: 14,
        marginRight: 10,
    },
});

export default CourseScreen;
