import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Logo from './Logo';

const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
});

export default function Header () {
  return (
    <>
      <View style={{ width: '20%' }}>
        <Logo />
      </View>
      <View style={{ width: '80%', justifyContent: 'center', alignItems: 'flex-end' }}>
        <Text style={styles.text}>Link 1</Text>
        <Text style={styles.text}>78% - 2 hours remaining</Text>
      </View>
    </>
  );
}
