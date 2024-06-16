import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, Button } from 'react-native';
import { handleregister } from '../services/DbService';

function SignUpScreen({ navigation }) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        if (name.trim() && surname.trim() && email.trim() && password.trim()) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [name, surname, email, password]);

    const register = async () => {
        if (!isFormValid) {
            Alert.alert("Validation Error", "Please fill all the required fields.");
            return;
        }

        const items = { name, surname, email, password };
        const success = await handleregister(items);

        if (success) {
            Alert.alert("Success", "User registered successfully.");
            // navigation.goBack();
        } else {
            Alert.alert("Error", "Failed to create new user. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Image style={styles.app_name} source={require('../assets/app_name.png')} />
            <TextInput
                style={styles.input}
                placeholder="Name"
                onChangeText={setName}
                value={name}
            />
            <TextInput
                style={styles.input}
                placeholder="Surname"
                onChangeText={setSurname}
                value={surname}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
            />
            <TouchableOpacity style={styles.cta_btn} onPress={register} disabled={!isFormValid}>
                <Text style={styles.cta_btn_text}>REGISTER</Text>
            </TouchableOpacity>
            <Button title="Already have an account? Login Here." onPress={() => navigation.navigate('LoginScreen')} />
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
    app_name: {
        marginBottom: 80,
    },
    input: {
        fontSize: 25,
        backgroundColor: '#8D99AF',
        width: '70%',
        borderRadius: 10,
        marginBottom: 20,
    },
    cta_btn: {
        backgroundColor: '#22DFED',
        width: '70%',
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    cta_btn_text: {
        fontSize: 30,
        color: '#D24DB7',
        fontWeight: 'bold',
    },
});

export default SignUpScreen;