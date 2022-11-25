import { useNavigation } from '@react-navigation/native'
import { Button, Image, Input } from '@rneui/themed'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { auth, signInWithEmailAndPassword } from '../firebase'
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';


WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () =>
{
    const [googleRequest, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
        expoClientId: '1040963286452-riaiapblksihm3j8r2bt60dn7dcjlo46.apps.googleusercontent.com',
        iosClientId: '1040963286452-43ofmpctg2tsskek1frchc56d51544aj.apps.googleusercontent.com',
        androidClientId: '1040963286452-udft2484a6slnbkpu3cs0nta2abvsua4.apps.googleusercontent.com',
        webClientId: '1040963286452-riaiapblksihm3j8r2bt60dn7dcjlo46.apps.googleusercontent.com',
    });
    const [facebookRequest, facebookResponse, promptFacebookAsync] = Facebook.useAuthRequest({
        clientId: '916236759344404',

        redirectUri: 'https://auth.expo.io/@batabhilash/signal-clone-yt'

    });

    const navigation = useNavigation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    useEffect(() =>
    {
        if (googleResponse?.type === 'success')
        {
            const { authentication: { accessToken } } = googleResponse;

            if (accessToken)
            {
                fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`)
                    .then(res => res.json()).
                    then(data =>
                    {
                        console.log(data)
                    }).catch(err => console.log(err))
            }
        }
    }, [googleResponse]);
    useEffect(() =>
    {
        // console.log(facebookResponse)
        if (facebookResponse?.type === 'success')
        {
            const { access_token } = facebookResponse.params;


            if (access_token)
            {
                fetch(`https://graph.facebook.com/me?fields= name,email,picture&access_token=${access_token}`).then(res => res.json()).then(data =>
                {
                    console.log(data)
                }).catch(err => console.log(err))
            }
        }

    }, [facebookResponse]);
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
                <Button

                    containerStyle={styles.button}

                    title={'Login with Google'}
                    onPress={() => promptGoogleAsync()}
                />
                <Button

                    containerStyle={styles.button}
                    type="outline"
                    title={'Login with Facebook'}
                    onPress={() => promptFacebookAsync()}
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