import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';

export default function ChatSupport({ navigation }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Good morning, My name is NIthish Kumar',
      sender: 'support',
      time: '11:30am',
      date: 'Yesterday',
    },
    {
      id: 2,
      text: 'Hi Nithish',
      sender: 'user',
      time: '09:30am',
      date: 'Yesterday',
    },
    {
      id: 3,
      text: 'Hello',
      sender: 'support',
      time: '09:30am',
      date: 'Today',
    },
  ]);

  const scrollViewRef = useRef();

  useEffect(() => {
    // Scroll to bottom when new messages are added
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message.trim(),
        sender: 'user',
        time: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }).toLowerCase(),
        date: 'Today',
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      Keyboard.dismiss();
    }
  };

  const renderMessagesByDate = () => {
    const messagesByDate = {};
    messages.forEach((msg) => {
      if (!messagesByDate[msg.date]) {
        messagesByDate[msg.date] = [];
      }
      messagesByDate[msg.date].push(msg);
    });

    return Object.keys(messagesByDate).map((date) => (
      <View key={date}>
        <View className="items-center my-4">
          <Text className="text-sm text-gray-900 font-dm">{date}</Text>
        </View>
        {messagesByDate[date].map((msg) => renderMessage(msg))}
      </View>
    ));
  };

  const renderMessage = (msg) => {
    const isSupport = msg.sender === 'support';
    
    return (
      <View
        key={msg.id}
        className={`mb-3 px-5 ${isSupport ? 'items-start' : 'items-end'}`}
      >
        <View
          className={`max-w-[75%] rounded-3xl px-5 py-3 ${
            isSupport
              ? 'bg-gray-200 rounded-tl-none'
              : 'bg-red-100 rounded-tr-none'
          }`}
        >
          <Text className="text-base text-gray-900 font-dm">{msg.text}</Text>
        </View>
        <View className="flex-row items-center mt-1 px-2">
          <Text className="text-xs text-gray-500 font-dm">{msg.time}</Text>
          {!isSupport && (
            <Ionicons name="checkmark-done" size={16} color="#DC2626" className="ml-1" />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
          >
            <Ionicons name="arrow-back-outline" size={24} color="#000" />
          </TouchableOpacity>
          
          <Text className="text-xl font-semibold text-gray-900 font-dm flex-1 text-center">
            Keplix support
          </Text>
          
          <TouchableOpacity
            onPress={() => {/* Handle call */}}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="call" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 bg-white"
          contentContainerStyle={{ paddingVertical: 10 }}
          showsVerticalScrollIndicator={false}
        >
          {renderMessagesByDate()}
        </ScrollView>

        {/* Input Area */}
        <View className="bg-gray-100 px-3 py-3 border-t border-gray-200">
          <View className="flex-row items-center bg-white rounded-full px-4 py-2">
            <TouchableOpacity className="mr-2">
              <Ionicons name="add" size={28} color="#374151" />
            </TouchableOpacity>
            
            <TextInput
              className="flex-1 text-base font-dm text-gray-900 py-2"
              placeholder="Message"
              placeholderTextColor="#9CA3AF"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />
            
            <TouchableOpacity className="mr-2">
              <Ionicons name="mic" size={24} color="#374151" />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleSend}
              className="w-12 h-12 bg-red-600 rounded-full items-center justify-center"
              disabled={!message.trim()}
            >
              <Ionicons name="send" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
