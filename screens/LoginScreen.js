import { useNavigation } from '@react-navigation/native'
import { Button, Image, Input } from '@rneui/themed'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { auth, signInWithEmailAndPassword } from '../firebase'

const LoginScreen = () =>
{
    const navigation = useNavigation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    useEffect(() =>
    {
        const unsubscribe = auth.onAuthStateChanged((authUser) =>
        {
            if (authUser)
            {
                // console.log(authUser)
                navigation.replace('Home')
            }
        })
        return unsubscribe
    }, [])
    const signIn = () =>
    {
        signInWithEmailAndPassword(auth, email, password).catch(err => alert(err.message))

    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView behavior='padding' style={styles.container} >
                <StatusBar style='light' />
                <Image source={{
                    uri: 'https://logos-download.com/wp-content/uploads/2020/06/Signal_Logo-700x700.png',
                }}
                    style={styles.logo}
                />

                <View style={styles.inputContainer}>
                    <Input placeholder="Email" autoFocus
                        value={email}
                        onChangeText={text => setEmail(text)}
                        type="email"
                    />
                    <Input placeholder="Password"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry
                        type="password"
                        onSubmitEditing={signIn}
                    />

                </View>
                <Button
                    disabled={!email || !password}
                    containerStyle={styles.button}
                    title={'Login'}
                    onPress={signIn}
                />
                <Button

                    containerStyle={styles.button}
                    type="outline"
                    title={'Register'}
                    onPress={() => navigation.navigate('Register')}
                />
                <View style={{ height: 100 }} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    logo: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    inputContainer: {
        width: 300,
        marginTop: 20,

    },
    button: {
        width: 200,
        marginTop: 10,
    }
})