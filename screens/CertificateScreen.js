import React, {useRef} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Share,
} from 'react-native';

import QRCode from 'react-native-qrcode-svg';

const CertificateScreen = (props) => {
  const pdfUrl = props.route.params.pdf;
  const courseName = props.route.params.item.name;
  let myQRCode = useRef();

  const shareQRCode = () => {
    myQRCode.toDataURL((dataURL) => {
      let shareImageBase64 = {
        title: `${courseName} Certificate`,
        message: `data:image/png;base64,${dataURL}`,
        subject: 'Share Link',
      };
      Share.share(shareImageBase64).catch((error) => console.log(error));
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.titleStyle}>
          Get your certificate
        </Text>
        <QRCode
          getRef={(ref) => (myQRCode = ref)}
          value={pdfUrl}
          size={250}
          color="black"
        />
      </View>
    </SafeAreaView>
  );
};

export default CertificateScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: 10,
    },
    titleStyle: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
      marginBottom: 20
    },
    textStyle: {
      textAlign: 'center',
      margin: 10,
    },
    textInputStyle: {
      flexDirection: 'row',
      height: 40,
      marginTop: 20,
      marginLeft: 35,
      marginRight: 35,
      margin: 10,
    },
    buttonStyle: {
      backgroundColor: 'lightblue',
      borderWidth: 0,
      color: '#FFFFFF',
      borderColor: '#51D8C7',
      alignItems: 'center',
      borderRadius: 5,
      marginTop: 30,
      padding: 10,
    },
    buttonTextStyle: {
      color: '#FFFFFF',
      paddingVertical: 10,
      fontSize: 16,
    },
  });