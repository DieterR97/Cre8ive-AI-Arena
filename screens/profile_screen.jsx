import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { customHeaderOptions } from '../utilities/headerUtils.js';

const Profile_screen = ({ navigation }) => {

    useLayoutEffect(() => {
        navigation.setOptions(customHeaderOptions);
    }, [navigation]);


  return (
    <View>
      <Text>profile_screen</Text>
    </View>
  )
}

export default Profile_screen

const styles = StyleSheet.create({})