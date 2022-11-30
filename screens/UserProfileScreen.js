import { SafeAreaView, StyleSheet, View } from 'react-native'
import React, { useLayoutEffect, useEffect, useState } from 'react'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { Text, Avatar } from '@rneui/themed';
import { db, query, collection, where, getDocs } from '../firebase'

const UserProfileScreen = () =>
{
    const navigation = useNavigation();
    const { params: { userId } } = useRoute()
    const [userDetails, setUserDetails] = useState(null)
    const focused = useIsFocused()
    useLayoutEffect(() =>
    {

        if (focused)
        {
            (async () =>
            {
                const q = query(collection(db, "users"), where("email", "==", userId + '@gmail.com'));
                const querySnapshot = await getDocs(q);
                console.log(querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                }))[0])

                setUserDetails(querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                }))[0])
            })()
        }

    }, [focused])
    useLayoutEffect(() =>
    {

        navigation.setOptions({
            headerTitle: 'Profile'
        })

    }, [userDetails])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            {userDetails

                ?
                <View style={{ alignItems: 'center', marginTop: 28 }}>
                    <Avatar rounded size={100} source={{ uri: userDetails?.photoURL }} />
                    <Text style={{ fontSize: 20, marginVertical: 10, fontWeight: '800' }}>{userDetails?.username}</Text>
                    <Text style={{ fontSize: 16, }}>{userDetails?.email}</Text>
                </View>
                :
                <View style={{ marginTop: 28, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 16, marginVertical: 10, fontWeight: '800' }}>User not found</Text>
                </View>}
        </SafeAreaView>
    )
}

export default UserProfileScreen

const styles = StyleSheet.create({})