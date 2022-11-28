import { StyleSheet, } from 'react-native'
import { Avatar, ListItem, Text } from '@rneui/themed'
import { memo, useState } from 'react'

const UserListItem = ({ id, username, createChat, photoURL, email, input, setSelectedUsers }) =>
{

    const [checked, setChecked] = useState(false)

    return (
        <ListItem key={id} bottomDivider onPress={() => !input && createChat(id, username, email, photoURL)}>
            <Avatar
                rounded
                source={{
                    uri: photoURL || 'https://st4.depositphotos.com/4329009/19956/v/600/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg'
                }}
            />
            <ListItem.Content  >
                <ListItem.Title style={{ fontWeight: "800" }}>
                    {username}
                </ListItem.Title>
                <ListItem.Subtitle
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >

                </ListItem.Subtitle>
            </ListItem.Content>
            {input && <ListItem.CheckBox
                center

                iconRight
                iconType="material"
                checkedIcon="clear"
                uncheckedIcon="add"
                checkedColor="red"
                checked={checked}
                onPress={(e) =>
                {
                    e.stopPropagation();
                    setChecked(!checked)
                    setSelectedUsers((users =>
                    {
                        if (users.includes(email))
                        {
                           users.pop(email)

                            return users
                        }
                        else
                        {
                            return [...users, email]
                        }
                    }))
                }}
            />}
        </ListItem>
    )
}

export default memo(UserListItem)

const styles = StyleSheet.create({})