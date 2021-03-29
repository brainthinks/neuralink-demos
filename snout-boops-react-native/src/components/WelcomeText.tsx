import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Animated, View } from 'react-native';

export default function WelcomeText (props) {
  const valueA = useRef(new Animated.Value(0)).current;
  const [translateYValueAInterpolated, setTranslateYValueAInterpolated] = useState<null|Animated.AnimatedInterpolation>(null);

  const valueB = useRef(new Animated.Value(0)).current;
  const [translateYValueBInterpolated, setTranslateYValueBInterpolated] = useState<null|Animated.AnimatedInterpolation>(null);

  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
  const [isWillConfigureVisible, setIsWillConfigureVisible] = useState(true);
  const [isConnectPromptVisible, setIsConnectPromptVisible] = useState(false);
  const [isTapAnywhereVisible, setIsTapAnywhereVisible] = useState(false);

  const styles = StyleSheet.create({
    shared: {
      position: 'absolute',
      height: '100%',
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 40,
    },
  });

  const USER_NAME = 'Gertie';
  const ANIMATION_DURATION = 0.5;
  const TEXT_PAUSE = 1;

  enum TransitionType {
    in = 'in',
    out = 'out',
  };

  /**
   * Make text transition in or out
   *
   * @param type
   *   Transition the text in or out.
   * @param duration
   *   Transition duration in seconds.
   * @returns Promise
   *   Resolves when transition is complete.
   */
  function transition (value: Animated.Value, type: TransitionType, duration = ANIMATION_DURATION) {
    const toValue = type === TransitionType.in ? 1 : 0;

    return new Promise((resolve, reject) => {
      Animated.parallel([
        Animated.timing(
          value,
          {
            useNativeDriver: true,
            toValue,
            duration: duration * 1000,
          },
        ),
        Animated.timing(
          value,
          {
            useNativeDriver: true,
            toValue,
            duration: duration * 1000,
          },
        ),
      ]).start(resolve);
    });
  }

  /**
   * Helper to delay the next animation asynchronously.
   *
   * @param delay
   *   Amount of time to delay next animation in seconds.
   * @returns Promise
   *   Resolves when the delay animation is finished.
   */
  function delay (delay = 0) {
    return new Promise((resolve, reject) => {
      Animated.delay(delay * 1000).start(resolve);
    });
  }

  async function animate () {
    // Welcome
    setTranslateYValueAInterpolated(valueA.interpolate({
      inputRange: [0, 1],
      outputRange: [30, 1],
    }));

    await transition(valueA, TransitionType.in);

    setTranslateYValueAInterpolated(valueA.interpolate({
      inputRange: [0, 1],
      outputRange: [-30, 1],
    }));

    await delay(TEXT_PAUSE);
    await transition(valueA, TransitionType.out);
    setIsWelcomeVisible(false);

    // Will Configure
    setTranslateYValueBInterpolated(valueB.interpolate({
      inputRange: [0, 1],
      outputRange: [30, 1],
    }));

    await transition(valueB, TransitionType.in);

    setTranslateYValueBInterpolated(valueB.interpolate({
      inputRange: [0, 1],
      outputRange: [-30, 1],
    }));

    setIsConnectPromptVisible(true);
    await delay(TEXT_PAUSE);
    await transition(valueB, TransitionType.out);
    setIsWillConfigureVisible(false);

    // Connect Prompt
    setTranslateYValueAInterpolated(valueA.interpolate({
      inputRange: [0, 1],
      outputRange: [30, 1],
    }));

    await transition(valueA, TransitionType.in);

    setTranslateYValueAInterpolated(valueA.interpolate({
      inputRange: [0, 1],
      outputRange: [-30, 1],
    }));

    setIsTapAnywhereVisible(true);
    await delay(TEXT_PAUSE);
    await transition(valueA, TransitionType.out);
    setIsConnectPromptVisible(false);

    // Tap Anywhere
    setTranslateYValueBInterpolated(valueB.interpolate({
      inputRange: [0, 1],
      outputRange: [30, 1],
    }));

    await transition(valueB, TransitionType.in);

    setTranslateYValueBInterpolated(valueB.interpolate({
      inputRange: [0, 1],
      outputRange: [-30, 1],
    }));

    await delay(TEXT_PAUSE);
    await transition(valueB, TransitionType.out);
    setIsTapAnywhereVisible(false);
  }

  React.useEffect(() => {
    animate();
  }, [
    valueA,
    valueB,
    translateYValueAInterpolated,
    translateYValueBInterpolated,
  ]);

  if (translateYValueAInterpolated === null || translateYValueBInterpolated === null) {
    return <></>;
  }

  return (
    <>
      { isWelcomeVisible &&
        <Animated.Text style={[
          styles.shared,
          {
            fontSize: 65,
            opacity: valueA,
            transform: [
              {
                translateY: translateYValueAInterpolated,
              },
            ],
          },
        ]}>
          Welcome, {USER_NAME}!
        </Animated.Text>
      }
      { isWillConfigureVisible &&
        <Animated.Text style={[
          styles.shared,
          {
            opacity: valueB,
            transform: [
              {
                translateY: translateYValueBInterpolated,
              },
            ],
          },
        ]}>
          This app will help you configure and calibrate your new Neural Lace(s)
        </Animated.Text>
      }
      { isConnectPromptVisible &&
        <Animated.Text style={[
          styles.shared,
          {
            opacity: valueA,
            transform: [
              {
                translateY: translateYValueAInterpolated,
              },
            ],
          },
        ]}>
          First, let&apos;s make sure we can connect to your Nerual Lace(s).
        </Animated.Text>
      }
      { isTapAnywhereVisible &&
        <Animated.Text style={[
          styles.shared,
          {
            opacity: valueB,
            transform: [
              {
                translateY: translateYValueBInterpolated,
              },
            ],
          },
        ]}>
          Tap anywhere on the screen to start.
        </Animated.Text>
      }
    </>
  );
}
