import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import tw from "tailwind-rn";
import { Foundation, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";

const Header = ({ title, callEnabled }) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <View style={tw("p-2 flex-row items-center justify-between")}>
        <View style={tw("flex flex-row items-center")}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw("p-2")}
          >
            <Ionicons name="chevron-back-outline" size={34} color="#FF5864" />
          </TouchableOpacity>
          <Text style={tw("text-2xl font-bold pl-2")}>{title}</Text>
        </View>
        {callEnabled && (
          <TouchableOpacity style={tw("rounded-full mr-4 p-3 bg-red-200")}>
            <Foundation
              style={tw("rounded-full")}
              name="telephone"
              size={20}
              color="red"
            />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Header;
