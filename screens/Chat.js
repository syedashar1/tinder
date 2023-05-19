import { useNavigation } from "@react-navigation/core";
import React from "react";
import { SafeAreaView } from "react-native";
import ChatList from "../components/ChatList";
import Header from "../components/Header";

const Chat = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <Header title="Chat" />
      <ChatList />
    </SafeAreaView>
  );
};

export default Chat;
