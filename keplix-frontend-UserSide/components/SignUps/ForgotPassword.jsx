import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons"


export default function ForgotPassword({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const isFormFilled = email.trim()!==''; 
  const isFormFilled = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email.trim());

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backcontainer}>
      <TouchableOpacity onPress={()=> navigation.goBack()}>
        <Ionicons name={"arrow-back-outline"} style={styles.icon} />
      </TouchableOpacity>
       </View>


      <Text style={styles.title}>Forgot Password</Text>

      <View>
      <Text style={styles.enter}>Enter your email address</Text>
      <TextInput
        style={styles.input}
        placeholder="Eg: xyz@gmail.com"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      </View>

      <TouchableOpacity style={[styles.button,
        {backgroundColor: isFormFilled ? 'red': 'grey'}
      ]} onPress={()=> navigation.navigate("ResetPassword")}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.createAccountText}>
          or Reset the password via 
          <Text style={{color: 'red', fontWeight: 'bold'}}>
            {" "}phone number
          </Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  backcontainer:{
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 40,
  },
  icon: {
    fontSize: 30, 
    borderColor:'#E2E2E2',
    borderWidth:2,
    color :"black",
    borderRadius:50,
  },
  text: {
    fontSize: 24, 
    marginRight:30,
    color:"#0000008F",
    fontFamily:'DM',
  },
  titleContainer: {
  flex: 1, 
  alignItems: 'center',
  },
  title: {
    fontWeight:500,
    color: 'black',
    fontSize: 32,
    marginBottom: 40,
    fontFamily:'DM',
  },
  enter:{
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
    fontFamily:'DM',
  },
  input: {
    color:'black',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 2,
    borderRadius: 70,
    marginBottom: 350,
    paddingHorizontal: 10,
    fontSize: 16, 
    fontFamily:'DM', 
  },
  button: {
    backgroundColor: 'red',
    borderRadius: 70,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 500,
    fontFamily:'DM',
  },
  createAccountText: {
    borderRadius:70,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    borderColor:'#E2E2E2',
    borderWidth:2,
    padding:15,
    fontFamily:'DM',
  },
});
