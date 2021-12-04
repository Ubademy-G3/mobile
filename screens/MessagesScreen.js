import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';

const MessagesScreen = (props) => {
    const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          //uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
          uri: 'https://firebasestorage.googleapis.com/v0/b/ubademy-mobile.appspot.com/o/bbc1a3dc-f982-4cd7-ba6a-a6d6a593b754.mp4?alt=media&token=341a0345-88c7-4450-88e2-65c5e6704c61',
        }}
        resizeMode="contain"
        isLooping
        useNativeControls={true}
        shouldPlay={true}
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <View style={styles.buttons}>
        <Button
          title={status.isPlaying ? 'Pause' : 'Play'}
          onPress={() =>
            status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessagesScreen;