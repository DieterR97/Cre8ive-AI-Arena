// utilities/headerUtils.js
import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';

export const customHeaderOptions = {
    headerBackground: () => (
        <ImageBackground
            source={require('../assets/banner/banner2.png')}
            style={StyleSheet.absoluteFill}
        />
    ),
    headerTitle: () => <></>, // This hides the header title
};