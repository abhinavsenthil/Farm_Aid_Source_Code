import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Button } from './Button';
import PixelColor from 'react-native-pixel-color';
import * as ImagePicker from 'react-native-image-picker';

export default function App() {
  const [response, setResponse] = React.useState(null);
  const [cordX, setX] = React.useState(0);
  const [cordY, setY] = React.useState(0);
  const [pixelColor, setColor] = React.useState(0);

  const handlePress = (evt, uri) => {
    const x = evt.nativeEvent.locationX;
    const y = evt.nativeEvent.locationY;
    console.log(uri);
    console.log(`location x: ${x} y: ${y}`);
    PixelColor.getHex(uri, { x: x, y: y, height: 200, width: 200 })
      .then(pixelColor => setColor(pixelColor))
      .catch(console.error);
    // console.log(`Pixel Data ${data}`);
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <Button
          title="Take image"
          onPress={() =>
            ImagePicker.launchCamera(
              {
                mediaType: 'photo',
                includeBase64: true,
                maxHeight: 200,
                maxWidth: 200,
              },
              (response) => {
                setResponse(response);
              },
            )
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
                console.log(response);
                setResponse(response);
              },
            )
          }
        />

        <Button
          title="Take video"
          onPress={() =>
            ImagePicker.launchCamera({ mediaType: 'video' }, (response) => {
              setResponse(response);
            })
          }
        />

        <Button
          title="Select video"
          onPress={() =>
            ImagePicker.launchImageLibrary({ mediaType: 'video' }, (response) => {
              setResponse(response);
            })
          }
        />

        {/* <View style={styles.response}>
          <Text>Res: {JSON.stringify(response)}</Text>
        </View> */}

        {response?.uri && (
          <View style={styles.image}>
            <TouchableOpacity onPress={(evt) => handlePress(evt, response.uri)}>
              <Image
                style={{ width: 200, height: 200 }}
                source={{ uri: response.uri }}
              />
            </TouchableOpacity>
          </View>
        )}
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
  },
});