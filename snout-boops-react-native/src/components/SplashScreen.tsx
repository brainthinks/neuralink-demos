import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Animated, View } from 'react-native';

import Logo from './Logo';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default function SplashScreen (props) {
  // Initial value for opacity: 0
  const fadeOpacity = useRef(new Animated.Value(0)).current;
  const fadeInDuration = 0.5;
  const fadeOutDuration = 0.5;

  function fadeIn () {
    return Animated.timing(
      fadeOpacity,
      {
        useNativeDriver: true,
        toValue: 1,
        duration: fadeInDuration * 1000,
      },
    );
  }

  function fadeOut () {
    return Animated.timing(
      fadeOpacity,
      {
        useNativeDriver: true,
        toValue: 0,
        duration: fadeOutDuration * 1000,
      },
    );
  }

  React.useEffect(() => {
    Animated.sequence([
      fadeIn(),
      fadeOut(),
    ]).start(props.onFinished);
  }, [fadeOpacity]);

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          opacity: fadeOpacity, // Bind opacity to animated value
        },
      ]}
    >
      <Logo />
    </Animated.View>
  );
}
