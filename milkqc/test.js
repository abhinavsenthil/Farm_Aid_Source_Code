import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity,
  Animated,
  PanResponder,
  SafeAreaView,
} from 'react-native';
import { Button } from './Button';
import PixelColor from 'react-native-pixel-color';
import * as ImagePicker from 'react-native-image-picker';

// export default function App() {
//   const [response, setResponse] = React.useState(null);
//   const [cordX, setX] = React.useState(0);
//   const [cordY, setY] = React.useState(0);
//   const [pixelColor, setColor] = React.useState(0);

export default class App extends Component {

  state = {
    pixelColor: 'transparent',
    width: 1,
    height: 1,
    response: null
  }

  animations = {
    handlePosition: new Animated.ValueXY({ x: 0, y: 0 })
  }

  panResponders = {
    handle: PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (e, gestureState) => {
        this.animations.handlePosition.setOffset({ x: this.lastHandlePosition.x, y: this.lastHandlePosition.y });
        this.animations.handlePosition.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (e, gestureState) => {
        const { width, height } = this.state;

        PixelColor.getHex(response.uri, { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY, width, height })
          .then(pixelColor => this.setState({ pixelColor }))
          .catch(console.error);

        return this.animations.handlePosition.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (e, { vx, vy }) => this.animations.handlePosition.flattenOffset()
    })
  }

  lastHandlePosition = {
    x: 0,
    y: 0
  }

  componentWillMount() {
    this.animations.handlePosition.x.addListener(({ value }) => this.lastHandlePosition.x = value);
    this.animations.handlePosition.y.addListener(({ value }) => this.lastHandlePosition.y = value);
  }

  onLayout({ nativeEvent }) {
    this.setState({ width: nativeEvent.layout.width, height: nativeEvent.layout.height });
  }

  handlePress = (evt, uri) => {
    const x = evt.nativeEvent.locationX;
    const y = evt.nativeEvent.locationY;
    console.log(uri);
    console.log(`location x: ${x} y: ${y}`);
    PixelColor.getHex(uri, { x: x, y: y })
      .then(pixelColor => setColor(pixelColor))
      .catch(console.error);
    // console.log(`Pixel Data ${data}`);
  }

  render() {
    const { pixelColor, response } = this.state;
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
                  this.setState({ response });
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
                  this.setState({ response });
                },
              )
            }
          />

          <Button
            title="Take video"
            onPress={() =>
              ImagePicker.launchCamera({ mediaType: 'video' }, (response) => {
                this.setState({ response });
              })
            }
          />

          <Button
            title="Select video"
            onPress={() =>
              ImagePicker.launchImageLibrary({ mediaType: 'video' }, (response) => {
                this.setState({ response });
              })
            }
          />

          {/* <View style={styles.response}>
          <Text>Res: {JSON.stringify(response)}</Text>
        </View> */}

          {response?.uri && (
            <View style={styles.container}>
              <Image
                style={{ height: 200, width: 200, backgroundColor: 'red', resizeMode: 'contain' }}
                source={{ uri: response.uri }}
                onLayout={this.onLayout.bind(this)}
              >
                <Animated.View
                  style={[styles.handle, { transform: this.animations.handlePosition.getTranslateTransform(), backgroundColor: pixelColor }]}
                  {...this.panResponders.handle.panHandlers}
                />
              </Image>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
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
  handle: {
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'black',
    height: 40,
    width: 40
  }
});