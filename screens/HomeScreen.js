import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, TextInput, FlatList, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import StarRating from 'react-native-star-rating';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import courseImage from '../assets/images/generic_course.png';
import { app } from '../app/app';
import CoursesFilterComponent from '../components/CourseFilterComponent';
import CourseComponent from '../components/CourseComponent';

MaterialCommunityIcons.loadFont();
Feather.loadFont();

const HomeScreen = (props) => {
  const [courses, setCourses] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [indexCarousel, setIndexCarousel] = React.useState(0);
  const [filtered, setFiltered] = useState(false);

  const handleGetRating = (response) => {
    if (!response.hasError()) {
        return response.content();
    } else {
        console.log("[Home screen] error", response.content().message);
    }
  }

  const handleGetAllCourses = async (response) => {
    if (!response.hasError()) {
        const tokenLS = await app.getToken();
        let courses = response.content().courses;
        courses = await Promise.all(
          courses.map(async (course) => {
            const rating = await app.apiClient().getCourseRating({ token: tokenLS }, course.id, handleGetRating);
            course.rating = rating;
            return course;
          })
        );
        setCourses(courses);
    } else {
        console.log("[Home screen] error", response.content().message);
    }
  }

  const handleSearchCourses = async (response) => {
    if (!response.hasError()) {
        const tokenLS = await app.getToken();
        let courses = response.content().courses;
        courses = await Promise.all(
          courses.map(async (course) => {
            const rating = await app.apiClient().getCourseRating({ token: tokenLS }, course.id, handleGetRating);
            course.rating = rating;
            return course;
          })
        );
        setCourses(courses);
    } else {
        console.log("[Search by subscription screen] error", response.content().message);
    }
  }

  const onRefresh = async () => {
      console.log("[Home screen] entro a onRefresh");
      setLoading(true);
      let tokenLS = await app.getToken();
      console.log("[Home screen] token:", tokenLS);
      app.apiClient().getAllCourses({ token: tokenLS }, handleGetAllCourses);
      setLoading(false);
  };

  useEffect(() => {
      console.log("[Home screen] entro a useEffect");
      onRefresh();
  }, []);

  const getBestRatedCourses = () => {
    const bestRated = courses.filter((course) => course.rating.rating >= 4);
    return bestRated.slice(0, 10);
  }

  const filterCoursesByText = async (text) => {
    setLoading(true);
    let tokenLS = await app.getToken();
    const query = {
      text: text
    }
    await app.apiClient().searchCourse({ token: tokenLS }, query, handleSearchCourses);
    if (text !== "") {
      setFiltered(true);
    } else {
      setFiltered(false);
    }
    setLoading(false);
  }

  const filterCourses = async (query) => {
    setLoading(true);
    let q = {};
    if (query.category) {
      const cat = query.category.filter((p) => p.isChecked);
      q.category = cat.map((c) => c.id);
    }
    if (query.subscription_type) {
      const subs = query.subscription_type.filter((s) => s.selected);
      q.subscription_type = subs.map((s) => s.name);
    }

    let tokenLS = await app.getToken();
    await app.apiClient().searchCourse({ token: tokenLS }, q, handleSearchCourses);
    setFiltered(true);
    setLoading(false);
  }

  const renderVerticalCourseItem = ({ item }) => {
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => {
          props.navigation.navigate('Course Screen', {
            item: item,
          });
        }}
      >
        <View style={styles.verticalCourseItemWrapper}>
          <Image
            source={item.profile_picture ? { uri: item.profile_picture } : courseImage}
            style={styles.image}
          />
          <View style={{ width: '70%', marginLeft: 10 }}>
            <Text style={styles.courseTitle}>{item.name}</Text>
            <Text numberOfLines={2}>{item.description}</Text>
            <View style={{ display:'flex', flexDirection: 'row' }}>
              <Text style={{ color: 'gold' }}>{item.rating.rating}</Text>
              <StarRating
                disabled={true}
                maxStars={5}
                rating={item.rating.rating}
                containerStyle={{ width: '40%', marginLeft: 5 }}
                //starStyle={{ color: 'gold' }}
                starSize={20}
                fullStarColor='gold'
              />
              <Text style={{ marginLeft: 5 }}>{`(${item.rating.amount})`}</Text>
            </View>
            <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>{item.subscription_type.charAt(0).toUpperCase()+item.subscription_type.slice(1)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const renderHorizontalCourseItem = ({ item }) => {
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => {
          props.navigation.navigate('Course Screen', {
            item: item,
          });
        }}
      >
        <View style={styles.horizontalCourseItemWrapper}>
          <Image
            source={item.profile_picture ? { uri: item.profile_picture } : courseImage}
            style={styles.image}
          />
          <View style={{ width: '90%', marginLeft: 10 }}>
            <Text style={styles.courseTitle}>{item.name}</Text>
            <Text numberOfLines={2}>{item.description}</Text>
            <View style={{ display:'flex', flexDirection: 'row' }}>
              <Text style={{ color: 'gold' }}>{item.rating.rating}</Text>
              <StarRating
                disabled={true}
                maxStars={5}
                rating={item.rating.rating}
                containerStyle={{ width: '40%', marginLeft: 5 }}
                //starStyle={{ color: 'gold' }}
                starSize={20}
                fullStarColor='gold'
              />
              <Text style={{ marginLeft: 5 }}>{`(${item.rating.amount})`}</Text>
            </View>
            <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>{item.subscription_type.charAt(0).toUpperCase()+item.subscription_type.slice(1)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  return (
      <View style={styles.container}>
        {loading && (
          <ActivityIndicator color="lightblue" style={{marginTop: "50%"}} />
        )}
        {!loading && (
          <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}>
            {/* Filter */}
            {modalVisible && (
              <CoursesFilterComponent setVisible={setModalVisible} visible={modalVisible} updateCourses={filterCourses} />
            )}
            
            {/* Logo */}
            <SafeAreaView>
                <View style={styles.headerWrapper}>
                    <Image
                        source={require("../assets/images/logo_toc.png")}
                        style={styles.logoImage}
                    />
                    <View style={{ position: 'absolute', top: 10, right: 30 }}>
                      <TouchableOpacity
                        onPress={() => { setModalVisible(true) }}
                      >
                        <Feather name="filter" color={"#444"} size={18} />
                      </TouchableOpacity>
                    </View>
                    {filtered && (
                      <View style={{ position: 'absolute', top: 10, left: 10 }}>
                        <Feather name="arrow-left" color={"#444"} size={25} onPress={() => { filterCoursesByText("") }}/>
                      </View>
                    )}
                </View>
            </SafeAreaView>

            {/* Search */}
            <View style={styles.searchWrapper}>
                <Feather name="search" size={16}/>
                <View style={styles.search}>
                    <TextInput 
                      placeholder="Search course"
                      onSubmitEditing={(e) => { filterCoursesByText(e.nativeEvent.text) }}
                      style={styles.searchText}
                    />
                </View>
            </View>

            {courses && (
              <>
                {!filtered && (
                  <View>
                    <Text style={styles.title}>Best rated</Text>
                    <Carousel
                      data={getBestRatedCourses()}
                      renderItem={renderHorizontalCourseItem}
                      sliderWidth={530}
                      itemWidth={500}
                      onSnapToItem={(index) => setIndexCarousel(index)}
                      useScrollView={true}
                    />
                    <Pagination
                      dotsLength={getBestRatedCourses().length}
                      activeDotIndex={indexCarousel}
                      //carouselRef={isCarousel}
                      dotStyle={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        marginHorizontal: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.92)'
                      }}
                      inactiveDotOpacity={0.4}
                      inactiveDotScale={0.6}
                      tappableDots={true}
                    />
                  </View>
                )}
                <View>
                  {!filtered && (
                    <Text style={styles.title}>All courses</Text>
                  )}
                  <FlatList 
                    data={courses}
                    renderItem={renderVerticalCourseItem}
                    keyExtractor={(item) => item.id}
                  />
                </View>
              </>
            )}
        </ScrollView>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex : 1,      
  },
  headerWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  coursesCardWrapper: {
    paddingHorizontal: 15,
  },
  logoImage: {
    width: 155,
    height: 85,
  },
  searchWrapper: {
    flexDirection: "row",
    width:'90%',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 10,
    marginLeft: 18,
    backgroundColor:'white',
  },
  search: {
    marginLeft: 10,
    alignItems: "center",
  },
  searchText: {
    fontSize: 14,
    color: "grey",
    alignItems: "center",
  },
  image: {
    width: 75,
    height: 75,
    marginLeft: 20
  },
  verticalCourseItemWrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    paddingBottom: 20,
    paddingTop: 15,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    color: 'black',
    flex: 1, 
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 20
  },
  courseTitle: {
    fontSize: 14,
    color: 'black',
    flex: 1, 
    flexWrap: 'wrap',
    flexDirection: 'row',
    fontWeight: 'bold'
  },
  horizontalCourseItemWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 10,
    paddingBottom: 20,
    paddingTop: 15,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    width: '73%'
  },



  categoriesWrapper: {
    marginTop: 20,
  },
  categoriesText: {
    fontSize: 16,
    paddingHorizontal: 20,
  },
  categoriesListWrapper: {
    paddingTop: 15,
    paddingBottom: 20,
  },
  categoryItemWrapper: {
    backgroundColor: '#F5CA48',
    marginRight: 10,
    borderRadius: 20,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  categoryItemImage: {
    width: 60,
    height: 60,
    marginTop: 15,
    alignSelf: 'center',
    marginHorizontal: 20,
  },
  categoryItemTitle: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5
  },
  categorySelectWrapper: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: 26,
    height: 26,
    borderRadius: 26,
    marginBottom: 20,
  },
  categorySelectIcon: {
    alignSelf: 'center',
  },
  forYouWrapper: {
    paddingHorizontal: 20,
  },
  forYouText: {
    fontSize: 16,
  },
  forYouCardWrapper: {
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
  forYouTitleWrapper: {
    marginLeft: 5,
    flexDirection: 'column',
  },
  forYouTitlesTitle: {
    fontSize: 16,
    color: 'black',
    flex: 1, 
    flexWrap: 'wrap',
    flexDirection: "row",
  },
  forYouTitlesRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forYouTitlesDescription: {
    fontSize: 12,
    color: 'grey',
    marginTop: 7,
    paddingRight: 40,
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
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  rating: {
    fontSize: 12,
    color: 'black',
    marginLeft: 5,
  },
  forYouCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forYouCardImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  buttonContainer: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 17,
    flexDirection: 'row'
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
  }
});

export default HomeScreen;