import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from 'react-native-vector-icons';
import { useNavigationState, getFocusedRouteNameFromRoute } from '@react-navigation/native';

import SignUpScreen from './screens/sign_up_screen';
import LoginScreen from './screens/login_screen';
import HomeScreen from './screens/home_screen';
import ExploreScreen from './screens/explore_screen.jsx';
import Profile_screen from './screens/profile_screen.jsx';
import Winners_screen from './screens/winners_screen.jsx';
import SubmissionScreen from './screens/SubmissionScreen';
import CompetitionListScreen from './screens/CompetitionListScreen';
import DetailsScreen from './screens/details_screen.jsx';

import { customHeaderOptions } from './utilities/headerUtils'; // Correct import

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CustomIcon = ({ name, focused, color, size = 26 }) => {
  return <MaterialIcons name={name} size={size} color={focused ? color : 'black'} />;
};

const HomeStack = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen 
    name="CompetitionList" 
    component={CompetitionListScreen}
      options={{
        headerStyle: {
          backgroundColor: '#6200ea',
        },
        headerTintColor: 'white',  // Set back button and back text color to white
        headerTitleStyle: {
          color: 'white',  // Set header title color to white
        },
      }} 
    />
    <Stack.Screen 
    name="Submission" 
    component={SubmissionScreen} 
      options={{
        headerStyle: {
          backgroundColor: '#6200ea',
        },
        headerTintColor: 'white',  // Set back button and back text color to white
        headerTitleStyle: {
          color: 'white',  // Set header title color to white
        },
        headerTitle: () => <></>,
      }} 
    />
    {/* <Stack.Screen name="Explore" component={ExploreScreen} /> */}
  </Stack.Navigator>
);

const ExploreStack = () => (
  <Stack.Navigator initialRouteName="Explore">
    <Stack.Screen name="Explore" component={ExploreScreen} options={{ headerShown: false }} />
    <Stack.Screen
      name="Details"
      component={DetailsScreen}
      options={{
        headerStyle: {
          backgroundColor: '#6200ea',
        },
        headerTintColor: 'white',  // Set back button and back text color to white
        headerTitleStyle: {
          color: 'white',  // Set header title color to white
        },
      }}
    />
  </Stack.Navigator>
);


const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {loggedIn ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarStyle: { display: getFocusedRouteNameFromRoute(route) === 'Details' ? 'none' : 'flex' }, // Hide the tab bar on the Details screen
          })}
        >
          <Tab.Screen
            name="HomeStack"
            options={{
              title: 'Home',
              headerShown: false,
              tabBarActiveTintColor: '#6200ea',
              tabBarIcon: ({ color, focused }) => (
                <CustomIcon name="home" focused={focused} color={'#6200ea'} />
              ),
            }}
            component={HomeStack}
          />
          <Tab.Screen
            name="ExploreStack"
            options={{
              title: 'Explore',
              headerShown: false,
              tabBarActiveTintColor: '#6200ea',
              tabBarIcon: ({ color, focused }) => (
                <CustomIcon name="explore" focused={focused} color={'#6200ea'} />
              ),
            }}
            component={ExploreStack}
          />
          <Tab.Screen
            name="Winners"
            options={{
              title: 'Winners',
              tabBarActiveTintColor: '#6200ea',
              tabBarIcon: ({ color, focused }) => (
                <CustomIcon name="leaderboard" focused={focused} color={'#6200ea'} />
              ),
            }}
            component={Winners_screen}
          />
          <Tab.Screen
            name="Profile"
            options={{
              title: 'Profile',
              tabBarActiveTintColor: '#6200ea',
              tabBarIcon: ({ color, focused }) => (
                <CustomIcon name="person" focused={focused} color={'#6200ea'} />
              ),
            }}
            component={Profile_screen}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ title: 'LOGIN', headerStyle: { backgroundColor: '#000000' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }}
          />
          <Stack.Screen
            name="SignUpScreen"
            component={SignUpScreen}
            options={{ title: 'SIGN UP', headerStyle: { backgroundColor: '#000000' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default App;
