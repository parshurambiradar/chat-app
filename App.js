import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddChatScreen from './screens/AddChatScreen';
import ChatScreen from './screens/ChatScreen';
import HomeScreen from './screens/HomeScreen';
import ImageCapture from './screens/ImageCapture';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

const Stack = createNativeStackNavigator();
const globalScreenOptions = {
  headerStyle: { backgroundColor: "#2C6BED" },
  headerTitleStyle: { color: 'white' },
  headerTitleAlign: 'center',
  headerTintColor: 'white',


}

const App = () =>
{

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions} initialRouteName='Login'>
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Register' component={RegisterScreen} />
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='AddChat' component={AddChatScreen} />
        <Stack.Screen name='Chat' component={ChatScreen} />
        <Stack.Screen name='ImageCapture' component={ImageCapture} />
      </Stack.Navigator>

    </NavigationContainer>

  );
}
export default App

