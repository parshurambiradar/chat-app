import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import MEMBERS from '../utils/members.json'
import UserListItem from '../components/UserListItem'
import { SearchBar } from '@rneui/themed'
import { doc, db, getDoc, auth } from '../firebase'
import { useRoute } from '@react-navigation/native'
const Members = () =>
{

    const { params: { id } } = useRoute()
    const [members, setMembers] = useState([])
    const [search, setSearch] = useState("");
    useEffect(() =>
    {

        (async () =>
        {
            const docRef = doc(db, 'chats', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists())
            {

                setMembers(
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
    const updateSearch = (search) =>
    {
        setSearch(search);

    };
    const getMembers = useCallback(members.filter((member) => 
    {


        if (search)
        {
            return member.username.toLowerCase().includes(search.toLowerCase())
        }
        else
        {
            return member
        }

    }), [search, members])
    const CustomSearchBar = () =>
    {
        return (



            <SearchBar
                placeholder="Type Here..."
                onChangeText={updateSearch}
                value={search}


                lightTheme

                containerStyle={{
                    backgroundColor: 'white',
                    borderWidth: 1,
                }}
                inputStyle={{
                    backgroundColor: 'white'

                }}
                inputContainerStyle={{ backgroundColor: 'white', }}
                style={{
                    backgroundColor: 'white',

                }}
            />
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ marginBottom: 50 }}>
                <CustomSearchBar />
            </View>
            <FlatList
                keyExtractor={(item) => item.id}
                data={getMembers}
                renderItem={({ item }) => (
                    <UserListItem {...item}
                        createChat={(e) => console.log(e)}
                    />
                )}

            />
        </View>
    )
}

export default Members



const styles = StyleSheet.create({})