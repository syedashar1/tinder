import { useRoute } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingViewBase,
  PlatformColor,
  Platform,
  TouchableWithoutFeedbackBase,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import Header from "../components/Header";
import { AuthOpen } from "../hooks/useAuth";
import getMatchedUserInfo from "../utils/getMatchedUserInfo";
import tw from "tailwind-rn";
import ReceiverMessage from "../components/ReceiverMessage";
import SenderMessage from "../components/SenderMessage";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "@firebase/firestore";
import { db } from "../firbase";

const MessageScreen = () => {
  const { user } = AuthOpen();
  const { params } = useRoute();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState("");

  const { matchDetails } = params;

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "matches", matchDetails.id, "messages"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
    );
  }, [matchDetails, db]);

  const sendMessage = () => {
    if (input != "") {
      addDoc(collection(db, "matches", matchDetails.id, "messages"), {
        timestamp: serverTimestamp(),
        userId: user.id,
        name: user.name,
        photoURL: matchDetails.users[user.id].photoUrl,
        message: input,
      });

      setInput("");
    }
  };

  return (
    <View style={tw("flex-1")}>
      <Header
        title={getMatchedUserInfo(matchDetails.users, user.id).name}
        callEnabled
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw("flex-1")}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            data={messages}
            inverted={-1}
            style={tw("pl-4")}
            keyExtractor={(item) => item.id}
            renderItem={({ item: message }) =>
              message.userId === user.id ? (
                <SenderMessage key={messages.id} message={message} />
              ) : (
                <ReceiverMessage key={message.id} message={message} />
              )
            }
          />
        </TouchableWithoutFeedback>
        <View
          style={tw(
            "flex-row justify-between items-center border-t border-gray-200 px-5 py-2"
          )}
        >
          <TextInput
            multiline={true}
            style={tw("flex-1 h-10 text-lg")}
            placeholder="Send a message"
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            value={input}
          />
          <Button title="Send" color="#FF5864" onPress={sendMessage} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default MessageScreen;
