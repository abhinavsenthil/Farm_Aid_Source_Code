import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  PermissionsAndroid
} from 'react-native';
import { Button } from './Button';
import GetPixelColor from 'react-native-get-pixel-color';
import * as ImagePicker from 'react-native-image-picker';

export default function App() {
  const [response, setResponse] = React.useState(null);
  const [pixelColor, setColor] = React.useState(0);

  const handlePress = async (evt, uri) => {
    const x = evt.nativeEvent.locationX;
    const y = evt.nativeEvent.locationY;
    console.log(`location x: ${x} y: ${y}`);
    const imageSet = await GetPixelColor.setImage(uri);
    console.log(imageSet);
    const pixelColor = await GetPixelColor.pickColorAt(parseInt(x), parseInt(y));
    console.log(pixelColor);
    setColor(pixelColor);
  }

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission given");
        ImagePicker.launchCamera(
          {
            mediaType: 'photo',
            includeBase64: true,
            maxHeight: 200,
            maxWidth: 200,
          },
          (response) => {
            setResponse(response);
          }, (error) => {
            console.log("Error", error)
          }
        )
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Button
          title="Take image"
          onPress={async () => {
            console.log("launching camera");
            await requestCameraPermission();
          }
          }
        />
        <Button
          title="Select image"
          onPress={() =>
            ImagePicker.launchImageLibrary(
              {
                mediaType: 'photo',
                includeBase64: true,
                maxHeight: 200,
                maxWidth: 200,
              },
              (response) => {
                console.log(response.base64);
                setResponse(response);
              },
            )
          }
        />


        {response?.uri && (
          <>
            <View style={styles.image}>
              <TouchableOpacity onPress={(evt) => handlePress(evt, response.base64)}>
                <Image
                  style={{ width: 200, height: 200 }}
                  source={{ uri: `data:image/jpeg;base64,${response.base64}` }}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.response}>
              <Text>Color: {pixelColor} </Text>
              <View style={{ height: 20, width: 20, backgroundColor: pixelColor }} />
            </View>
          </>
        )
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    marginVertical: 24,
    marginHorizontal: 24,
  },
  image: {
    marginVertical: 24,
    alignItems: 'center',
  },
  response: {
    marginVertical: 16,
    marginHorizontal: 8,
    flexDirection: 'row',
  },
});