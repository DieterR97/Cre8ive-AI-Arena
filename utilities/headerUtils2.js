import React from 'react';
import { StyleSheet, ImageBackground, Text } from 'react-native';

export const customHeaderOptions2 = {
    headerStyle: {
        backgroundColor: '#6200ea', // Set header background to purple
    },
    headerTitleStyle: {
        color: 'white', // Set header title color to white
    },
    headerBackground: () => (
        <ImageBackground
            source={require('../assets/banner/banner2.png')}
            style={StyleSheet.absoluteFill}
        />
    ),
    headerTitle: () => <Text style={{ color: 'white' }}>Details</Text>, // Customize header title if needed
};
