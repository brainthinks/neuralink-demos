import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import SplashScreen from './components/SplashScreen';
import WelcomeText from './components/WelcomeText';

const styles = StyleSheet.create({
  splashScreen: {
    flex: 1,
    padding: '5%',
    backgroundColor: 'black',
    color: 'white',
  },
  welcomeText: {
    flex: 1,
    padding: '5%',
    backgroundColor: 'black',
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    height: '90%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function App () {
  const [splashScreenFinished, setSplashScreenFinished] = useState(false);
  const [welcomeTextFinished, setWelcomeTextFinished] = useState(false);

  // if (!splashScreenFinished) {
  //   return (
  //     <View style={styles.splashScreen}>
  //       <SplashScreen onFinished={() => {
  //         setSplashScreenFinished(true);
  //       }}/>
  //     </View>
  //   );
  // }

  // if (!welcomeTextFinished) {
  return (
      <View style={styles.welcomeText}>
        <WelcomeText onFinished={() => {
          setWelcomeTextFinished(true);
        }}/>
      </View>
  );
  // }
}
