import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRoute } from '@react-navigation/native'
import ChatScreen from '../screens/ChatScreen';
import { Ionicons } from '@expo/vector-icons';
import MediaAndDocuments from '../screens/MediaAndDocuments';
import Members from '../screens/Members';

const Tab = createMaterialTopTabNavigator();

const ChatTabs = ({ navigation }) =>
{
    const { params: { params: { chatName,id } } } = useRoute()
    // console.log("params",params.params)
    useLayoutEffect(() =>
    {
        navigation.setOptions({

            title: chatName,
            headerTitleAlign: 'center',
            headerBackTitleVisible: false,

            headerRight: () => (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '20%',


                }}>

                    <TouchableOpacity

                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name={'ellipsis-vertical'} size={24} color="white" />

                    </TouchableOpacity>

                </View>
            )
        })


    }, [navigation, chatName])
    return (
        <Tab.Navigator

            initialRouteName="Discussion"
            screenOptions={{
                // tabBarActiveTintColor: '#e91e63',
                tabBarLabelStyle: { fontSize: 12, },
                // tabBarStyle: { backgroundColor: 'powderblue' },

            }}



        >
            <Tab.Screen
                name="Discussion"
                component={ChatScreen}
                options={{ tabBarLabel: 'Discussion', tabBarLabelStyle: { textTransform: 'capitalize' },lazy:true }}
            
            />
            <Tab.Screen
                name="Media&Documents"
                component={MediaAndDocuments}
                options={{ tabBarLabel: 'Media & Documents', tabBarLabelStyle: { textTransform: 'capitalize' },lazy:true }}
            />
            <Tab.Screen
                name="Members"
                component={Members}
                initialParams={{id}}
                options={{ tabBarLabel: 'Members', tabBarLabelStyle: { textTransform: 'capitalize' },lazy:true }}
            />
        </Tab.Navigator>
    )
}

export default ChatTabs





const styles = StyleSheet.create({})