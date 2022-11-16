import { StyleSheet, } from 'react-native'
import { Avatar, ListItem, Text } from '@rneui/themed'
import { useEffect, useState } from 'react';
import { collection, db, query, orderBy, onSnapshot } from '../firebase'
const UserListItem = ({ id, username, createChat, photoURL, email }) =>
{
    return (
        <ListItem key={id} bottomDivider onPress={() => createChat(id, username, email, photoURL)}>
            <Avatar
                rounded
                source={{
                    uri: photoURL || 'https://st4.depositphotos.com/4329009/19956/v/600/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg'
                }}
            />
            <ListItem.Content >
                <ListItem.Title style={{ fontWeight: "800" }}>
                    {username}
                </ListItem.Title>
                <ListItem.Subtitle
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >

                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )
}

export default UserListItem

const styles = StyleSheet.create({})