import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Button, Input, Text } from '@rneui/themed'
import { useNavigation } from '@react-navigation/native'
import { auth, serverTimestamp, createUserWithEmailAndPassword, updateProfile, setDoc, db, doc, addDoc, collection } from '../firebase'


const RegisterScreen = () =>
{
    const navigation = useNavigation()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [imageUrl, setImageUrl] = useState('')


    const register = async () =>
    {
        try
        {
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            await updateProfile(auth.currentUser, {
                displayName: name,
                photoURL: imageUrl || 'https://st4.depositphotos.com/4329009/19956/v/600/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg',
            });

            await addDoc(collection(db, "users"), {
                username: name,
                email: email,
                photoURL: imageUrl || 'https://st4.depositphotos.com/4329009/19956/v/600/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg',
                timestamp: serverTimestamp(),
            })
        } catch (err)
        {
            alert(err.message);
        }



    }
    return (
        <SafeAreaView style={{
            flex: 1,

        }}>

            <KeyboardAvoidingView style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : -150}

            >
                <StatusBar style='light' />
                <ScrollView
                    keyboardShouldPersistTaps={'always'}
                    contentContainerStyle={{

                        alignItems: 'center',
                        justifyContent: 'center',

                        padding: 10,
                    }}>
                    <Text h3 style={styles.title}>Create a Signal account</Text>
                    <View style={styles.inputContainer}>
                        <Input
                            placeholder='Full Name'
                            autoFocus
                            type="text"
                            value={name}
                            onChangeText={text => setName(text)}
                        />
                        <Input
                            placeholder='Email'
                            keyboardType='email-address'
                            type="email"
                            value={email}
                            onChangeText={text => setEmail(text)}
                        />
                        <Input
                            placeholder='Password'
                            secureTextEntry
                            type="text"
                            value={password}
                            onChangeText={text => setPassword(text)}
                        />
                        <Input
                            placeholder='Profile picture URL (optional) '
                            type="text"
                            value={imageUrl}
                            onChangeText={text => setImageUrl(text)}
                            onSubmitEditing={register}
                        />
                    </View>
                    <Button
                        disabled={!name || !email || !password}
                        containerStyle={styles.button}
                        raised onPress={register} title='Register' />
                    <Button
                        containerStyle={[styles.button, { marginTop: 15, }]}
                        type="outline"
                        onPress={() => navigation.goBack()} title='Back to Login' />
                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView >
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: '#fff'
    },
    title: {
        marginBottom: 50
    },
    inputContainer: {
        width: 300
    }, button: {
        width: 200,
        marginTop: 10
    }
})