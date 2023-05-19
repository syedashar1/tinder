import { View, Text } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/Home';
import Chat from './screens/Chat';
import Login from './screens/Login';
import { AuthOpen } from './hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import Modal from './screens/Modal';
import Match from './screens/Match';
import MessageScreen from './screens/Message';

const StackNavigator = () => {

  const Stack = createNativeStackNavigator();
  const { user , setUser } = AuthOpen()
  const navigation = useNavigation();

  return (
    <Stack.Navigator  
      screenOptions={{
        headerShown:false
      }}
    > 

    {
      user ? ( 
        <>
          <Stack.Group>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="Message" component={MessageScreen} />
          </Stack.Group>
          <Stack.Group screenOptions={{presentation:'modal'}}>
            <Stack.Screen name="Modal" component={Modal} />
          </Stack.Group>
          <Stack.Group screenOptions={{presentation:'transparentModal'}}>
            <Stack.Screen name="Match" component={Match} />
          </Stack.Group>

        </>
      ) : (
          <Stack.Screen name="Login" component={Login} />
      )
    }


    </Stack.Navigator>
  )
}

export default StackNavigator