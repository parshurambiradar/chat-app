import { useNavigation } from '@react-navigation/native'
import { Button, Input } from '@rneui/themed'
import { useLayoutEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/FontAwesome'
import { db, addDoc, collection } from '../firebase'
const AddChatScreen = () =>
{
    const navigation = useNavigation()
    const [input, setInput] = useState('')
    useLayoutEffect(() =>
    {
        navigation.setOptions({
            title: "Add a new Chat",

        })
    }, [navigation])
    const createChat = async () =>
    {

        try
        {
            const docRef = await addDoc(collection(db, "chats"), {
                chatName: input
            });
            // console.log("Document written with ID: ", docRef.id);
            navigation.goBack();
        } catch (e)
        {
            console.error("Error adding document: ", e);
        }

    }
    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Input placeholder="Enter a chat name" value={input} onChangeText={text => setInput(text)}
                    leftIcon={<Icon name="wechat" type="antdesign" size={24} color="black" />}

                    onSubmitEditing={createChat} />
                <Button disabled={!input} title={'Create new Chat'} onPress={createChat} />
            </View>
        </SafeAreaView>
    )
}

export default AddChatScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 30,
        height: '100%'
    }
})