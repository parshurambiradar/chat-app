import { useIsFocused, useNavigation } from '@react-navigation/native'
import { Avatar } from '@rneui/themed'
import { useEffect, useLayoutEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { } from 'react-native-safe-area-context'
import CustomListItem from '../components/CustomListItem'
import { auth, db, collection, getDocs } from '../firebase'
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons'
const HomeScreen = () =>
{
    const navigation = useNavigation();
    const [chats, setChats] = useState([])
    const isFocused = useIsFocused()
    useLayoutEffect(() =>
    {
        (async () =>
        {
            try
            {
                if (isFocused)
                {
                    const querySnapshot = await getDocs(collection(db, "chats"));

                    setChats(querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data()
                    })))
                }
            } catch (err)
            {
                console.log(err)
            }
        })()


        


    }, [isFocused])

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
                        rounded
                        source={{ uri: auth.currentUser.photoURL || 'https://st4.depositphotos.com/4329009/19956/v/600/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg' }} />
                </TouchableOpacity>
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
    const enterChat = (id, chatName) =>
    {
        navigation.navigate('Chat', { chatName, id })
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                {
                    chats.map(({ id, data: { chatName } }) => (
                        <CustomListItem key={id} id={id} chatName={chatName} enterChat={enterChat} />
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