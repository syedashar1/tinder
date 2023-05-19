import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { AuthOpen } from "../hooks/useAuth";
import getMatchedUserInfo from "../utils/getMatchedUserInfo";
import tw from "tailwind-rn";
import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { db } from "../firbase";

const ChatRow = ({ matchDetails }) => {
  const navigation = useNavigation();
  const { user } = AuthOpen();
  const [matchedUserInfo, setMatchedUserInfo] = useState(null);
  const [lastMessage, setLastmessage] = useState("");

  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.id));
  }, [matchDetails, user]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches", matchDetails.id, "messages"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setLastmessage(snapshot.docs[0]?.data()?.message)
      ),
    [matchDetails, db]
  );

  console.log("Matched User Info: " + matchedUserInfo);

  return (
    <TouchableOpacity
      style={[
        tw("flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg"),
        styles.cardShadow,
      ]}
      onPress={() =>
        navigation.navigate("Message", {
          matchDetails,
        })
      }
    >
      <Image
        style={tw("rounded-full h-16 w-16 mr-4")}
        source={{ uri: matchedUserInfo?.photoUrl }}
      />
      <View>
        <Text style={tw("text-lg font-bold")}>
          {matchedUserInfo?.name}
        </Text>
        <Text style={tw("font-light")}>
          {lastMessage?.length > 34
            ? lastMessage?.substring(0, 34) + "..."
            : lastMessage || "Say Hi!"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

export default ChatRow;
