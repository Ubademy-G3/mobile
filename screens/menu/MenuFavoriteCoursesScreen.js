import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import forYouData from '../../assets/data/forYouData'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const MenuFavoriteCoursesScreen = (props) => {
    /*const param_favoriteCoursesIds = props.route.params ? props.route.params.favoriteCourses : null;

    const [favoriteCoursesId, setFavoriteCoursesId] = useState(param_favoriteCoursesIds);
    
    var favoriteCoursesArray = [];

    const handleApiResponseGetCourse = (response) => {
        console.log("[Menu screen] content: ", response.content())
        if (!response.hasError()) {
            favoriteCoursesArray.push(response.content());
        } else {
            console.log("[Menu screen] error", response.content().message);
        }
    }

    const onRefresh = async () => {
        console.log("[Menu screen] entro a onRefresh"); 
        setLoading(true);
        let tokenLS = await app.getToken();
        console.log("[Profile screen] token:",tokenLS);
        if (favoriteCoursesId != null) {
            for (id in favoriteCoursesId) {
                await app.apiClient.getCourse({id: id, token: tokenLS}, id, handleApiResponseGetCourse)
            }
        }
        console.log("Menu screen] id:", idLS);
        setLoading(false);
    };

    useEffect(() => {
        console.log("[Menu screen] entro a useEffect");
        onRefresh();
    }, []);*/

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.coursesCardWrapper}>
                    {forYouData.map((item) => (
                        <TouchableOpacity
                        key={item.id}
                        onPress={() =>
                            props.navigation.navigate('Course Screen', {
                            item: item,
                            })
                        }>
                        <View
                            style={[
                            styles.courseCardWrapper,
                            {
                                marginTop: item.id == 1 ? 10 : 20,  //ESTO YA NO FUNCA
                            },
                            ]}>
                            <View>
                            <View style={styles.courseCardTop}>
                                <View>
                                <Image source={item.image} style={styles.courseCardImage} />
                                </View>
                                <View style={styles.courseTitleWrapper}>
                                <Text style={styles.courseTitlesTitle}>
                                    {item.title}
                                </Text>
                                <View style={styles.courseTitlesRating}>
                                    <MaterialCommunityIcons
                                    name="star"
                                    size={10}
                                    color={'black'}
                                    />
                                    <Text style={styles.rating}>{item.rating}</Text>
                                </View>
                                </View>
                            </View>
                            <View style={styles.courseDescriptionWrapper}>
                                <Text style={styles.courseTitleDescription}>
                                {item.description}
                                </Text>
                            </View>
                            <View style={styles.forYouButtons} >
                                {/*<View style={styles.addCourseButton}>
                                    eather name={item.subscribed ? "check" : "plus"} size={16} color={'black'} />
                                </View>*/}
                                <View style={styles.favoriteCourseButton}>
                                    <MaterialCommunityIcons name="heart" size={16} color={'black'} />
                                    {/*<MaterialCommunityIcons name={item.favorited ? "heart" : "heart-outline"} size={16} color={'black'} />*/}
                                </View>
                            </View>  
                            </View>
                        </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    description: {
        fontSize: 16,
    },
    coursesCardWrapper: {
        paddingHorizontal: 20,
      },
    coursesTitle: {
        fontSize: 20,
    },
    courseCardWrapper: {
        backgroundColor: 'white',
        borderRadius: 25,
        paddingTop: 20,
        paddingLeft: 20,
        flexDirection: 'row',
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,  
    },
    courseTitleWrapper: {
        marginLeft: 5,
        flexDirection: 'column',
    },
    courseTitlesTitle: {
        fontSize: 16,
        color: 'black'
    },
    courseTitlesRating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    forYouButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addCourseButton: {
        marginTop: 20,
        marginLeft: -20,
        backgroundColor: '#87ceeb',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderTopRightRadius: 25,
        borderBottomLeftRadius: 25,
    },
    favoriteCourseButton: {
        backgroundColor: '#87ceeb',
        marginTop: 20,
        marginLeft: 183,
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderTopLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    rating: {
        fontSize: 12,
        color: 'black',
        marginLeft: 5,
    },
    courseCardTop: {
        //marginLeft: 20,
        //paddingRight: 40,
        flexDirection: 'row',
        alignItems: 'center',
        //marginRight: 80,
    },
    courseCardImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
})

export default MenuFavoriteCoursesScreen;