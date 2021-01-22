import React from 'react';
import {View, Image, Animated} from 'react-native';
import {styles} from '../style/Styles';

export default function Loading() {
  return (
    <View style={styles.loadingBox}>
      <Animated.Image
        className="loading"
        source={require('../icons/loading.png')}
        style={styles.loadIcon}
      />
    </View>
  );
}
