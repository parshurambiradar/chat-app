import { useNavigation, useRoute } from '@react-navigation/native';
import { Avatar, Image, Input, Text, Tab, TabView, SearchBar } from '@rneui/themed';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, TouchableWithoutFeedback, Linking, Alert, FlatList, Pressable } from 'react-native'
import { FontAwesome, Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import { addDoc, db, serverTimestamp, auth, doc, collection, onSnapshot, orderBy, query, ref, uploadBytes, getStorage, getDownloadURL, where, updateDoc, arrayRemove, getDoc } from '../firebase'
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { format } from 'date-fns';
import Autolink from 'react-native-autolink';



const ChatScreen = () =>
{
    const navigation = useNavigation();
    const { params: { chatName, id, email, photoURL, users, isGroupChat } } = useRoute();
    console.log(id)
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const dates = new Set();
    const [modalVisible, setModalVisible] = useState(false);
    const [active, setActive] = useState(true);
    const [members, setMembers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([]);
    const scrollViewRef = useRef()


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
                    width: '20%',


                }}>

                    {isGroupChat && active && <TouchableOpacity
                        onPress={exitFromChat}
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name={'exit-outline'} size={24} color="white" />
                        <Text style={{ color: 'red', marginLeft: 5 }}>Exit</Text>
                    </TouchableOpacity>}
                    {/* <TouchableOpacity onPress={pickDocument}>
                        <FontAwesome5 name='file-upload' size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pickImage}>
                        <Ionicons name='attach' size={24} color="white" />
                    </TouchableOpacity> */}
                </View>
            )
        })


    }, [navigation, messages, active])

    const exitFromChat = async () =>
    {
        try
        {
            const docRef = doc(db, 'chats', id);
            const result = await updateDoc(docRef, {
                users: arrayRemove(auth.currentUser.email)
            });
            setFilteredUsers(filteredUsers.map(user => user.email !== auth.currentUser.email))
            setActive(false)
        } catch (error)
        {
            console.log(error);
        }
    }


    const getUserSuggestions = (keyword) =>
    {
        if (Array.isArray(users))
        {
            if (keyword.slice(1) === '')
            {
                setFilteredUsers([...users]);
            } else
            {
                const userDataList = users.filter(
                    (obj) => obj.username.toLowerCase().indexOf(keyword.slice(1)) !== -1
                );
                setFilteredUsers([...userDataList]);
            }
        }
    };
    const handleMention = (username) =>
    {
        setInput((current) => current.slice(0, current.lastIndexOf('@') + 1) + username + ' ');
        setModalVisible(false);
    };

    // const downloadFile = async (uri, filename) =>
    // {
    //     try
    //     {
    //         let fileUri = FileSystem.documentDirectory + filename;
    //         console.log(uri,filename)
    //         let downloadPath = await FileSystem.downloadAsync(uri, fileUri)
    //         const { status } = await MediaLibrary.requestPermissionsAsync();

    //         if (status === "granted")
    //         {
    //             const asset = await MediaLibrary.createAssetAsync(downloadPath.uri);

    //             await MediaLibrary.createAlbumAsync("Download", asset, false);
    //             Alert.alert("Success", "Image was successfully downloaded!");
    //         }
    //     } catch (error)
    //     {
    //         console.log(error)
    //     }
    // }



    const pickDocument = async () =>
    {
        try
        {
            let result = await DocumentPicker.getDocumentAsync({
                // type: "application/pdf",
            });
            console.log(result)
            if (result !== null)
            {

                let type = result.mimeType.split('/')[0]
                let uri = result.uri
                let filename = uri.split("/");
                filename = filename[filename.length - 1];
                const r = await fetch(uri);
                const b = await r.blob();

                uri = uri.substring(uri.lastIndexOf('/') + 1);

                // create a file ref
                const fileRef = ref(getStorage(), uri);

                //upload image to firebase storage 
                await uploadBytes(fileRef, b,);

                //get image url
                let fileurl = await getDownloadURL(fileRef);
                //save image url as text in message field
                await sendMessage(fileurl, type, filename)
            }
        } catch (error)
        {
            console.log(error)
        }
    };

    const pickImage = async () =>
    {
        try
        {

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [5, 4],
                quality: 1,
            });

            console.log(result);

            if (!result.canceled)
            {
                let source = result?.assets[0]?.uri;
                let type = result?.assets[0]?.type || 'image';


                let filename = source.split("/");
                filename = filename[filename.length - 1];
                const response = await fetch(source);
                let blob = await response.blob();
                // remove last slash from local file path
                source = source.substring(source.lastIndexOf('/') + 1);

                // create a file ref
                const fileRef = ref(getStorage(), source);

                //upload image to firebase storage 
                await uploadBytes(fileRef, blob,);

                //get image url
                let fileurl = await getDownloadURL(fileRef);
                //save image url as text in message field
                await sendMessage(fileurl, type, filename)
            }
        } catch (error)
        {
            console.log(error)
        }
    };
    const sendMessage = async (fileurl = null, type = 'text', filename = undefined) =>
    {
        try
        {
            input && Keyboard.dismiss()

            let doc = {
                message: fileurl || input,
                type: type,

                timestamp: serverTimestamp(),
                email: auth.currentUser.email,
                username: auth.currentUser.displayName,
                photoURL: auth.currentUser.photoURL
            }
            if (filename)
            {
                doc.filename = filename
            }
            await addDoc(
                collection(
                    db,
                    "chats",
                    id,
                    "messages"
                ),
                doc
            );



        } catch (error)
        {
            console.log(error);
        } finally
        {
            modalVisible && setModalVisible(false)
            input && setInput("");
        }

    };
    useLayoutEffect(() =>
    {

        const unsub = onSnapshot(
            query(
                collection(
                    db,
                    "chats",
                    id,
                    "messages"
                ),
                orderBy("timestamp")
            ),
            (snapshot) =>
            {
                setMessages(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                );
            }
        );

        return unsub;

    }, []);
    useEffect(() =>
    {

        (async () =>
        {
            const docRef = doc(db, 'chats', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists())
            {
                setMembers(docSnap.data().users)
                setFilteredUsers(
                    docSnap.data().users
                        .map((user, index) => ({ email: user, username: user.substring(0, user.indexOf('@')), id: index.toString() }))
                        .filter(user => user.email != auth.currentUser.email))
                // console.log("Document data:", docSnap.data());
            } else
            {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }


        })()



    }, []);

    const renderDate = (date) =>
    {


        if (date)
        {
            dates.add(date)
            return < >
                <Text style={{ color: '#ffffff', padding: 10, borderRadius: 10, backgroundColor: 'grey', alignSelf: 'center', marginVertical: 10 }}>{date}</Text>
            </>
        }
    }
    const handleText = (value) =>
    {

        setInput(value);
        if (isGroupChat)
        {
            const lastChar = value.substr(value.length - 1);
            const currentChar = value.substr(value.length - 1);
            const spaceCheck = /[^@A-Za-z_]/g;


            if (value.length === 0)
            {
                setModalVisible(false);
            } else
            {
                if (spaceCheck.test(lastChar) && currentChar != '@')
                {
                    setModalVisible(false);
                } else
                {
                    const checkSpecialChar = currentChar.match(/[^@A-Za-z_]/);
                    if (checkSpecialChar === null || currentChar === '@')
                    {
                        const pattern = new RegExp(`\\B@[a-z0-9_-]+|\\B@`, `gi`);
                        const matches = value.match(pattern) || [];
                        if (matches.length > 0)
                        {
                            getUserSuggestions(matches[matches.length - 1]);
                            if (value.endsWith('@')) setModalVisible(true);
                        } else
                        {
                            setModalVisible(false);
                        }
                    } else if (checkSpecialChar != null)
                    {
                        setModalVisible(false);
                    }
                }
            }
        }
    }

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



                        <ScrollView contentContainerStyle={{ paddingTop: 15 }}
                            ref={scrollViewRef}
                            onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}

                        >
                            {/* {chat goes here} */}
                            {messages.map(({ id, data: { message, email, photoURL, filename, username, timestamp, type } }) =>
                            {
                                let reciever = email === auth.currentUser.email ? true : false;
                                let msg;

                                let date = timestamp && format(new Date(timestamp?.toDate()), 'dd/MM/yyyy')
                                switch (type)
                                {
                                    case 'image':
                                        msg = <Image

                                            source={{ uri: message }}
                                            style={{ width: 200, height: 200, }}
                                        />

                                        break;
                                    case 'application':

                                    // msg = <View

                                    //     style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                                    // >
                                    //     <Text
                                    //         onPress={async () =>
                                    //         {
                                    //             let res = await Linking.canOpenURL(message)
                                    //             if (res)
                                    //             {
                                    //                 Linking.openURL(message)
                                    //             }
                                    //         }}
                                    //         numberOfLines={3}
                                    //         style={[styles[reciever ? 'recieverText' : 'senderText'], { width: '80%' }]}>{message}</Text>
                                    //     {/* {
                                    //         !reciever && <MaterialCommunityIcons
                                    //             onPress={() => downloadFile(message, filename)}
                                    //             name='download-circle-outline' size={30} color='white' />} */}
                                    // </View>
                                    // break;

                                    default: msg = <Autolink
                                        // Required: the text to parse for links
                                        text={message}
                                        // Optional: enable email linking
                                        email
                                        // Optional: enable hashtag linking to instagram
                                        hashtag="instagram"
                                        // // Optional: enable @username linking to twitter
                                        mention={false}
                                        // Optional: enable phone linking
                                        phone
                                        // Optional: enable URL linking
                                        url
                                        // Optional: custom linking matchers
                                        // matchers={[MyCustomTextMatcher]}
                                        showAlert
                                        textProps={{ selectable: true }}
                                        stripPrefix={false}
                                        matchers={[
                                            {

                                                pattern: /(^|\W)@\b([-a-zA-Z0-9._]{3,25})\b/g,
                                                style: { color: 'blue' },
                                                getLinkText: (replacerArgs) =>
                                                {

                                                    return `${replacerArgs[0]}`
                                                },
                                                onPress: (match) =>
                                                {
                                                    console.log(match.getReplacerArgs())
                                                    navigation.navigate('UserProfile', { userId: match.getReplacerArgs()[2] });
                                                },
                                            },
                                        ]}
                                    />


                                        break;
                                }

                                return (
                                    <View key={id}>
                                        {
                                            dates.has(date) ? null : renderDate(date)
                                        }

                                        <View style={styles[reciever ? 'reciever' : 'sender']}>
                                            {/* {reciever ? <Avatar
                                            rounded

                                            //web
                                            containerStyle={{
                                                position: 'absolute',
                                                bottom: -15,
                                                right: -5,
                                            }}
                                            position='absolute'
                                            bottom={-15}
                                            right={5}


                                            source={{ uri: photoURL }}
                                        /> : <Avatar
                                            rounded
                                            onPress={openChat}
                                            //web
                                            containerStyle={{
                                                position: 'absolute',
                                                bottom: -15,
                                                left: -5,
                                            }}
                                            position='absolute'
                                            bottom={-15}
                                            left={5}
                                            source={{ uri: photoURL }}
                                        />} */}
                                            {auth.currentUser.displayName !== username && <Text style={{ color: 'blue', marginBottom: 2 }}>{username}</Text>}
                                            {msg}
                                            {timestamp && <Text style={{ color: !reciever ? 'black' : 'black', alignSelf: 'flex-end', paddingTop: 2, marginLeft: 5 }}>{format(new Date(timestamp?.toDate()), 'hh:mm a')}</Text>}

                                        </View>

                                    </View>



                                )
                            })}
                        </ScrollView>

                        {modalVisible && (
                            <View style={{ position: 'absolute', bottom: 50, width: '90%' }}>
                                <View style={styles.modalView}>
                                    <FlatList
                                        keyboardShouldPersistTaps={'always'}
                                        keyExtractor={({ id }) => id}
                                        showsVerticalScrollIndicator={false}
                                        data={filteredUsers}
                                        renderItem={({ item: { username } }) => (
                                            <Pressable
                                                onPress={() => handleMention(username)}
                                                style={{ marginVertical: 6, backgroundColor: '#f8f8f8' }}>
                                                <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center', }}>
                                                    <Avatar size={30} source={{ uri: 'https://st4.depositphotos.com/4329009/19956/v/600/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg' }} />
                                                    <Text style={{ marginLeft: 10, fontSize: 14, fontWeight: '700' }}>{username}</Text>
                                                </View>
                                            </Pressable>
                                        )}
                                    />
                                </View>
                            </View>
                        )}

                        {active && <View style={styles.footer}>
                            <TextInput
                                placeholder='Signal Message' style={[styles.textInput, {

                                }]}

                                value={input}
                                onChangeText={text => handleText(text)}
                                onSubmitEditing={() => input && sendMessage()}

                            />
                            <TouchableOpacity onPress={pickDocument} style={{ position: 'absolute', right: input ? 160 : 130 }}>
                                <Ionicons name='attach' size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={pickImage} style={{ position: 'absolute', right: input ? 120 : 90 }}>
                                <Ionicons name='images' size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() =>
                            {
                                navigation.navigate('ImageCapture', { id })
                            }} style={{ position: 'absolute', right: input ? 70 : 50 }}>
                                <Ionicons name='camera' size={24} color="black" />
                            </TouchableOpacity>
                            {input && <TouchableOpacity
                                disabled={!input}
                                activeOpacity={0.5}
                                onPress={() => sendMessage()}
                            >
                                <Ionicons name='send' size={24} color={!input ? 'grey' : '#2B68E6'} />
                            </TouchableOpacity>}
                        </View>}







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
        width: '80%',
        position: 'relative'
    },
    sender: {
        padding: 15,
        backgroundColor: '#ECECEC',
        // alignSelf: 'flex-start',
        borderRadius: 20,
        margin: 15,
        width: '80%',
        position: 'relative'
    },
    senderText: {
        color: 'black',
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
    modalView: {
        marginHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 5,
        // alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        maxHeight: 200,
    },

})