import { View, Text, Button, ImageBackground, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { AuthOpen } from '../hooks/useAuth'
import { useNavigation } from '@react-navigation/native'
import tw from 'tailwind-rn'

const Login = () => {

  const { signInWithGoogle } = AuthOpen()
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [])

  return (
    <View style={{flex: 1, justifyContent: 'center' }} >
    
      <ImageBackground resizeMode="cover" style={{flex: 1}} source={{ uri: 'https://tinder.com/static/tinder.png' }}/>

      {/* <TouchableOpacity 
        onPress={signInWithGoogle}
        style={{ position: 'absolute', bottom: 100, width: 142 , padding: 10 , backgroundColor:'white', borderRadius: 20,left:'35%'}}
        >
          <Text style={{textAlign:'center', fontWeight:'500'}} >Let's get started</Text>
      </TouchableOpacity> */}

      <TouchableOpacity
          style={[
            tw("absolute bottom-40 w-52 bg-white p-4 rounded-2xl"),
            { marginHorizontal: "25%" },
          ]}
        >
          <Text
            style={tw("font-semibold text-center")}
            onPress={signInWithGoogle}
          >
            Sign In & Get Swiping
          </Text>
        </TouchableOpacity>
      
    </View>
  )
}

export default Login