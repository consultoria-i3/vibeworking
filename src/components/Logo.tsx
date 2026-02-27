import { Image, StyleSheet, View, Platform } from 'react-native';

interface LogoProps {
  size?: number;
  style?: object;
}

export function Logo({ size = 64, style }: LogoProps) {
  const source =
    Platform.OS === 'web'
      ? { uri: '/logo.png' }
      : require('../../assets/logo.png');

  return (
    <View style={[styles.wrap, { width: size, height: size }, Platform.OS === 'web' && { filter: 'grayscale(1)' }, style]}>
      <Image
        source={source}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
