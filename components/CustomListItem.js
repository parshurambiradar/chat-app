import { StyleSheet, } from 'react-native'
import { Avatar, ListItem, Text } from '@rneui/themed'
import { useEffect, useState } from 'react';
import { collection, db, query, orderBy, onSnapshot, auth } from '../firebase'
import getRecipientEmail from '../utils/getRecipientEmail';
const CustomListItem = ({ id, chatName, enterChat, users, }) =>
{

    const [chatMessages, setChatMessages] = useState([])



    return (
        <ListItem key={id} bottomDivider onPress={() => enterChat(id, chatName, users,)}>
            <Avatar
                rounded
                source={{
                    uri: chatMessages?.[0]?.photoURL || 'https://st4.depositphotos.com/4329009/19956/v/600/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg'
                }}
            />
            <ListItem.Content >
                <ListItem.Title style={{ fontWeight: "800" }}>
                    {getRecipientEmail(users, auth.currentUser.email) || chatName}
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