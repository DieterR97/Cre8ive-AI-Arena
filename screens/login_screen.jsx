import React, { useState } from 'react'

import { StyleSheet, Text, View, TextInput, Button, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import home_screen from './home_screen.jsx';

import { handlelogin } from '../services/authService.js'

function LoginScreen({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const login = () => {
        handlelogin(email, password);
    }

    // const handleLogin = () => {
    //     // If login is successful, navigate to the home screen
    //     navigation.navigate('Root', { screen: 'HomeScreen' });
    // };

    return (

            <View style={styles.container} >
                <Image style={styles.app_name} source={require('../assets/app_name.png')} />

                {/* <Text style={styles.white}>Login Screen</Text> */}
                <TextInput
                    style={styles.input}
                    placeholder="Enter Email"
                    onChangeText={newText => setEmail(newText)}
                    defaultValue={email}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter Password"
                    onChangeText={newText => setPassword(newText)}
                    defaultValue={password}
                />

                <TouchableOpacity style={styles.cta_btn} onPress={login} >
                    <Text style={styles.cta_btn_text}>LOG IN</Text>
                </TouchableOpacity>

                <Button title="New? Create acount here." onPress={() => navigation.navigate('SignUpScreen')} style={styles.cta_btn} />

            </View>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    white: {
        color: 'white',
    },
    app_name: {
        marginBottom: 80,
    },
    input: {
        fontSize: 25,
        backgroundColor: '#8D99AF',
        width: '50%',
        borderRadius: 10,
        marginBottom: 20,
    },
    cta_btn: {
        // fontSize: 30,
        backgroundColor: '#22DFED',
        width: '50%',
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',

    },
    cta_btn_text: {
        fontSize: 30,
        // backgroundColor: '#8D99AF',
        width: '50%',
        color: '#D24DB7',
        fontWeight: 'bold',

        // borderRadius: 10,
        // marginBottom: 20,
    },
});


export default LoginScreen;
