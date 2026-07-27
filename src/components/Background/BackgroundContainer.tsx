import React from "react";
import { ImageBackground, StyleSheet, ViewStyle } from "react-native";

interface BackgroundContainerProps {
  children: React.ReactNode;
  image: any;
  style?: ViewStyle;
}

export default function BackgroundContainer({ children, image, style }: BackgroundContainerProps) {
  return (
    <ImageBackground source={image} resizeMode="cover" style={[styles.container, style]}>
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});