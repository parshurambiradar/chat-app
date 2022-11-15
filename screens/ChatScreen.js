import { useNavigation, useRoute } from '@react-navigation/native';
import { Avatar, Text } from '@rneui/themed';
import { useLayoutEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { addDoc, db, serverTimestamp, auth, doc, collection, onSnapshot, orderBy, query } from '../firebase'
import { StatusBar } from 'expo-status-bar';



const ChatScreen = () =>
{
    const navigation = useNavigation();
    const { params: { chatName, id } } = useRoute();
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    useLayoutEffect(() =>
    {
        navigation.setOptions({
            title: chatName,
            headerTitleAlign: 'left',
            headerBackTitleVisible: false,
            headerTitle: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar
                        rounded
                        source={{ uri: messages[0]?.data?.photoURL }} />


                    <Text
                        style={{ color: 'white', marginLeft: 10, fontWeight: "700" }}
                    >{chatName}</Text>
                </View>
            ),
            headerRight: () => (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: 80,
                    marginRight: 20
                }}>
                    <TouchableOpacity>
                        <FontAwesome name='video-camera' size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name='call' size={24} color="white" />
                    </TouchableOpacity>
                </View>
            )
        })


    }, [navigation, messages])

    const sendMessage = async () =>
    {

        try
        {
            Keyboard.dismiss();
            // const docref = doc(collection(db, 'chats'));
            // const colref = collection(docref, 'messages');
            // await addDoc(colref, {
            //     message: input,
            //     timestamp: serverTimestamp(),
            //     displayName: auth.currentUser.displayName,
            //     email: auth.currentUser.email,
            //     photoURL: auth.currentUser.photoURL
            // });

            const messagesRef = collection(db, "chats", id, "messages")
            await addDoc(messagesRef, {
                message: input,
                timestamp: serverTimestamp(),
                displayName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                photoURL: auth.currentUser.photoURL
            })


            setInput('');

        } catch (e)
        {
            console.error("Error adding document: ", e);
        }
    }

    useLayoutEffect(() =>
    {
        let unsubscribe;
        const liveUpdate = async () =>
        {
            const messagesRef = collection(db, "chats", id, "messages")
            const queryObj = query(messagesRef, orderBy("timestamp", 'desc'));
            unsubscribe = onSnapshot(queryObj, (querySnapshot) =>
            {

                setMessages(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })
                ));

            });
        }
        liveUpdate()
        return unsubscribe;
    }, [chatName, id])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} >
            <StatusBar style='light' />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={160}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                    <>
                        <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
                            {/* {chat goes here} */}
                            {messages.map(({ id, data: { message, email, photoURL, displayName, timestamp } }) => (
                                email === auth.currentUser.email ? (
                                    <View key={id} style={styles.reciever}>
                                        <Avatar
                                            rounded
                                            //web
                                            containerStyle={{
                                                position: 'absolute',
                                                bottom: -15,
                                                right: -5
                                            }}
                                            position='absolute'
                                            bottom={-15}
                                            right={-5}
                                            source={{ uri: photoURL }}
                                        />
                                        <Text style={styles.recieverText}>{message}</Text>

                                    </View>
                                ) : (
                                    <View key={id} style={styles.sender}>
                                        <Avatar
                                            rounded
                                            //web
                                            containerStyle={{
                                                position: 'absolute',
                                                bottom: -15,
                                                left: -5
                                            }}
                                            position='absolute'
                                            bottom={-15}
                                            left={-5}
                                            source={{ uri: photoURL }}
                                        />
                                        <Text style={styles.senderText} >{message}</Text>
                                        <Text style={styles.senderName} >{displayName}</Text>
                                    </View>
                                )

                            ))}
                        </ScrollView>
                        <View style={styles.footer}>
                            <TextInput
                                placeholder='Signal Message' style={styles.textInput}
                                value={input}
                                onChangeText={text => setInput(text)}
                                onSubmitEditing={sendMessage}
                            />
                            <TouchableOpacity activeOpacity={0.5}
                                onPress={sendMessage}
                            >
                                <Ionicons name='send' size={24} color='#2B68E6' />
                            </TouchableOpacity>
                        </View>
                    </>
                </TouchableWithoutFeedback>

            </KeyboardAvoidingView>
        </SafeAreaView >
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    reciever: {
        padding: 15,
        backgroundColor: '#ECECEC',
        alignSelf: 'flex-end',
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: '80%',
        position: 'relative'
    },
    sender: {
        padding: 15,
        backgroundColor: '#2B68E6',
        alignSelf: 'flex-start',
        borderRadius: 20,
        margin: 15,
        maxWidth: '80%',
        position: 'relative'
    },
    senderText: {
        color: 'white',
        fontWeight: '500',
        marginLeft: 10,
        marginBottom: 15
    },
    recieverText: {
        color: 'black',
        fontWeight: '500',
        marginLeft: 10,

    },
    senderName: {
        left: 10,
        paddingRight: 10,
        fontSize: 10,
        color: 'white'
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 15
    },
    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,

        backgroundColor: '#ECECEC',

        padding: 10,
        color: 'gray',
        borderRadius: 30
    },


})