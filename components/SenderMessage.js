import React from "react";
import { View, Text } from "react-native";
import tw from "tailwind-rn";

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

const SenderMessage = ({ message }) => {

  const date2 = new Date(message?.timestamp?.toDate());
  const numericTimestamp = date2?.getTime();
  const x = numericTimestamp ? timeAgo.format(numericTimestamp, 'mini') : ''

  var displayTime = "";
  if (message.timestamp !== null) {
    var date =
      message.timestamp.toDate().toLocaleDateString().substring(3, 5) +
      "/" +
      message.timestamp.toDate().toLocaleDateString().substring(0, 2) +
      "/" +
      message.timestamp.toDate().toLocaleDateString().substring(6, 8);
    var hours =
      message.timestamp.toDate().getHours() > 12
        ? message.timestamp.toDate().getHours() - 12
        : message.timestamp.toDate().getHours();
    var am_pm = message.timestamp.toDate().getHours() >= 12 ? "PM" : "AM";
    hours = hours < 10 ? "0" + hours : hours;
    var minutes =
      message.timestamp.toDate().getMinutes() < 10
        ? "0" + message.timestamp.toDate().getMinutes()
        : message.timestamp.toDate().getMinutes();
    var time = hours + ":" + minutes + " " + am_pm;
    displayTime = date + " at " + time;
  }

  return (
    <View
      style={[
        tw("bg-purple-600 rounded-lg rounded-tr-none px-5 py-3 mx-3 my-2"),
        { alignSelf: "flex-start", marginLeft: "auto" },
      ]}
    >
      <Text style={tw("text-white")}>{message.message}</Text>
      <Text style={{color:'rgba(0,0,0,0.5)',fontSize:10}}> { x ? x + ' ago' : 'sending...' }</Text>
    </View>
  );
};

export default SenderMessage;
