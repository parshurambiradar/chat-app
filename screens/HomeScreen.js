import { useIsFocused, useNavigation } from '@react-navigation/native'
import { Avatar, Badge } from '@rneui/themed'
import { useEffect, useLayoutEffect, useState } from 'react'
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { } from 'react-native-safe-area-context'
import CustomListItem from '../components/CustomListItem'
import { auth, db, collection, getDocs, onSnapshot, query, orderBy, where } from '../firebase'
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons'

import getRecipientEmail from '../utils/getRecipientEmail'
import getGroupChat from '../utils/getGroupChat'
const HomeScreen = () =>
{
    const navigation = useNavigation();
    const [chats, setChats] = useState([])


    useEffect(() =>
    {
        const unsub = onSnapshot(
            query(
                collection(
                    db,
                    'chats'

                ),
                where('users', 'array-contains', auth.currentUser.email),

            ),
            (snapshot) =>
            {
                setChats(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                );
            }
        );
        return unsub;

    }, [])

    useLayoutEffect(() =>
    {
        navigation.setOptions({
            title: "Signal",
            headerStyle: { backgroundColor: '#fff' },
            headerTitleStyle: { color: "black" },
            headerTintColor: "black",
            headerLeft: () => (<View style={{ marginLeft: 20 }}>
                <TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
                    <Avatar
                        title={auth.currentUser.displayName}
                        rounded
                        source={{ uri: auth.currentUser.photoURL || 'https://st4.depositphotos.com/4329009/19956/v/600/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg' }} />

                </TouchableOpacity>
                <Text
                    numberOfLines={1}
                    style={{ position: 'absolute', top: 5, left: 40, fontSize: Platform.OS === 'android' ? 8 : 10 }}>{auth.currentUser.displayName}</Text>

            </View>),
            headerRight: () =>
            (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: 80,
                    marginRight: 20
                }}>
                    <TouchableOpacity activeOpacity={0.5}>
                        <AntDesign name='camerao' size={24} color='black' />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5}>
                        <SimpleLineIcons
                            onPress={() => navigation.navigate("AddChat")}
                            name='pencil' size={24} color='black' />
                    </TouchableOpacity>
                </View>
            )
        })
    }, [navigation])

    const signOutUser = () =>
    {
        auth.signOut().then(() => navigation.replace("Login"))
    }
    const enterChat = (id, chatName, users) =>
    {

        let isGroupChat = getGroupChat(users, auth.currentUser.email);

        navigation.navigate('Chat', { chatName: isGroupChat ? chatName : getRecipientEmail(users, auth.currentUser.email), id, isGroupChat })
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                {
                    chats.map(({ id, data: { chatName, users, } }) => (
                        <CustomListItem key={id} id={id} users={users} chatName={chatName} enterChat={enterChat} />
                    ))
                }
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: "100%"
    }
})