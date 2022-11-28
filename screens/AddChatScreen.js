import { async } from '@firebase/util'
import { useNavigation } from '@react-navigation/native'
import { Button, Input } from '@rneui/themed'
import { useEffect, useLayoutEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import UserListItem from '../components/UserListItem'
import { db, auth, addDoc, getDocs, orderBy, collection, onSnapshot, serverTimestamp } from '../firebase'
const AddChatScreen = () =>
{
    const navigation = useNavigation()
    const [input, setInput] = useState('')
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useLayoutEffect(() =>
    {
        navigation.setOptions({
            title: "Add a new Chat",

        })
    }, [navigation])
    useEffect(() =>
    {
        const unsub = onSnapshot(collection(db, "users"), (snapshot) =>
        {
            setUsers(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
        });
        return unsub;
    }, []);

    // const createChat = async () =>
    // {

    //     try
    //     {
    //         await addDoc(collection(db, "chats"), {
    //             chatName: input,
    //             // users: [auth.currentUser.email, email],
    //             createdAt: serverTimestamp(),
    //         });
    //         // console.log("Document written with ID: ", docRef.id);
    //         navigation.goBack();
    //     } catch (e)
    //     {
    //         console.error("Error adding document: ", e);
    //     }

    // }
    const createChat = async (id, chatName, email, photoURL,) =>
    {
        try
        {

            let chats = await getDocs(
                collection(
                    db,
                    "chats",
                ),
                orderBy("createdAt")
            )

            let find = chats.docs.find((doc) => doc.data().users.includes(email) && doc.data().users.includes(auth.currentUser.email))
            if (!find)
            {
                await addDoc(collection(db, 'chats'), {
                    chatName: chatName ? chatName : input,
                    users: [auth.currentUser.email, email ? email : '', ...selectedUsers],
                    createdAt: serverTimestamp(),

                });
                input && setInput('')
                navigation.goBack()
            }
            else
            {
                alert('already exists');
            }



        } catch (e)
        {
            console.error("Error adding document: ", e);
        }
    }
    return (
        <SafeAreaView>
            <View style={styles.container}>
                <View style={{ padding: 30 }}>
                    <Input placeholder="Enter a chat name" value={input} onChangeText={text => setInput(text)}
                        leftIcon={<Icon name="wechat" type="antdesign" size={24} color="black" />}

                        onSubmitEditing={() => createChat()} />
                    <Button disabled={!input} title={'Create new Chat'} onPress={() => createChat()} />
                </View>
                <ScrollView style={{ height: '100%' }} keyboardShouldPersistTaps={'always'}>
                    {
                        users.map(({ id, data: { username, photoURL, email } }) =>
                        {
                            console.log(auth.currentUser.uid !== id)
                            return auth.currentUser.email !== email &&
                                <UserListItem key={id} id={id} username={username}
                                    photoURL={photoURL}
                                    email={email}
                                    createChat={createChat}
                                    input={input}
                                    setSelectedUsers={setSelectedUsers}
                                    
                                />
                        }
                        )
                    }
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default AddChatScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',


    }
})