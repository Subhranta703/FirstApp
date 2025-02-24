import React, { useState } from "react";
import { View, TextInput, Button, Text, ScrollView, StyleSheet } from "react-native";
import axios from "axios";

const API_KEY = "AIzaSyAF7MBAQrGMyjJ86Lf4QaxIchF6KoDSzTQ"; // 🔹 Replace with your actual Gemini API Key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message to chat
    const userMessage = { text: inputText, sender: "user" };
    setMessages([...messages, userMessage]);
    setInputText("");

    try {
      const response = await axios.post(
        API_URL,
        {
          contents: [{ role: "user", parts: [{ text: inputText }] }],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const botReply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
      const botMessage = { text: botReply, sender: "bot" };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching Gemini response:", error);
      setMessages((prevMessages) => [...prevMessages, { text: "Error getting response.", sender: "bot" }]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatContainer}>
        {messages.map((msg, index) => (
          <View key={index} style={[styles.message, msg.sender === "user" ? styles.userMessage : styles.botMessage]}>
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Type a message..."
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  chatContainer: {
    flex: 1,
    marginBottom: 10,
  },
  message: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#4CAF50",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#2196F3",
  },
  messageText: {
    color: "#fff",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
});

export default App;
