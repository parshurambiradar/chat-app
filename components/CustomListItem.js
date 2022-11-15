import { StyleSheet, } from 'react-native'
import { Avatar, ListItem, Text } from '@rneui/themed'
import { useEffect, useState } from 'react';
import { collection, db, query, orderBy, onSnapshot } from '../firebase'
const CustomListItem = ({ id, chatName, enterChat }) =>
{
    const [chatMessages, setChatMessages] = useState([])
    useEffect(() =>
    {
        let unsubscribe;
        const liveUpdate = async () =>
        {
            const messagesRef = collection(db, "chats", id, "messages")
            const queryObj = query(messagesRef, orderBy("timestamp", 'desc'));
            unsubscribe = onSnapshot(queryObj, (querySnapshot) =>
            {

                setChatMessages(querySnapshot.docs.map((doc) => ({ ...doc.data() })
                ));

            });
        }
        liveUpdate()
        return unsubscribe;
    }, [chatMessages])

    return (
        <ListItem key={id} bottomDivider onPress={() => enterChat(id, chatName)}>
            <Avatar
                rounded
                source={{
                    uri: chatMessages?.[0]?.photoURL || 'https://st4.depositphotos.com/4329009/19956/v/600/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg'
                }}
            />
            <ListItem.Content >
                <ListItem.Title style={{ fontWeight: "800" }}>
                    {chatName}
                </ListItem.Title>
                <ListItem.Subtitle
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {chatMessages?.[0]?.displayName}: {chatMessages?.[0]?.message}
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )
}

export default CustomListItem

const styles = StyleSheet.create({})