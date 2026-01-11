import React from 'react';
import {StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface GradientBackgroundProps {
  children: React.ReactNode;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
}) => {
  return (
    <LinearGradient
      colors={['#FFF0F3', '#FFDDE4', '#FFE8EC']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.container}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
