import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import tw from 'tailwind-rn'

const Match = () => {

    const nav = useNavigation()
    const { params } = useRoute()

    const {myFullProfile, userSwiped} = params;

  return (
<View style={[tw("h-full bg-red-500 pt-20"), { opacity: 0.89 }]}>
      <View style={tw("justify-center px-10 pt-20")}>
        <Image
          style={[tw("h-20 w-full"), { resizeMode: "contain" }]}
          source={{uri: 'https://links.papareact.com/mg9'}}
        />
      </View>
      <Text style={tw("text-white text-center mt-5")}>
        You and {userSwiped.name} have liked each other.
      </Text>
      <View style={tw("flex-row justify-evenly mt-5")}>
        <Image
          style={tw("h-32 w-32 rounded-full")}
          source={{ uri: myFullProfile.photoUrl }}
        />
        <Image
          style={tw("h-32 w-32 rounded-full")}
          source={{ uri: userSwiped.photoUrl }}
        />
      </View>
      <TouchableOpacity
        style={tw("bg-white m-5 px-10 py-8 rounded-full mt-20")}
        onPress={() => {
          nav.goBack();
          nav.navigate("Chat");
        }}
      >
        <Text style={tw("text-center")}>Send a Message</Text>
      </TouchableOpacity>
    </View>

  )
}

export default Match