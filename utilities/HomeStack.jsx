import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/home_screen';
import CompetitionListScreen from './screens/CompetitionListScreen';
import SubmissionScreen from './screens/SubmissionScreen';
import { customHeaderOptions } from './utilities/headerUtils';

const Stack = createNativeStackNavigator();

const HomeStack = () => (
    <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
            name="Home"
            component={HomeScreen}
            // options={customHeaderOptions}
            options={{ headerShown: false }}
        />
        <Stack.Screen name="CompetitionList" component={CompetitionListScreen} />
        <Stack.Screen name="Submission" component={SubmissionScreen} />
    </Stack.Navigator>
);

export default HomeStack;
