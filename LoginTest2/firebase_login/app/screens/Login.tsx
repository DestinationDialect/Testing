import {
  View,
  TextInput,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import styles from "./Styles";
import { View, TextInput, ActivityIndicator, Button, KeyboardAvoidingView, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from "../styles";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed" + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(response);
      alert("Check your emails!");
    } catch (error: any) {
      console.log(error);
      alert("Sign up failed" + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.loginContainer}>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        ></TextInput>
        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text)}
        ></TextInput>
    return (
        <ImageBackground
            source={require("../../assets/LoginScreen.png")}
            resizeMode='cover'
            style={styles.imgBackground}
        >
            <View style={styles.container}>
                <KeyboardAvoidingView behavior='padding'>
                    <TextInput value={email} style={styles.input} placeholder='Email' autoCapitalize='none' onChangeText={(text)=>setEmail(text)}></TextInput>
                    <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder='Password' autoCapitalize='none' onChangeText={(text)=>setPassword(text)}></TextInput>

        {loading ? (
          <ActivityIndicator size="large" color="0000ff" />
        ) : (
          <>
            <Button title="Login" onPress={signIn} />
            <Button title="Create Account" onPress={signUp} />
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
                    { loading ? (<ActivityIndicator size='large' color='0000ff' />
                    ) : (
                        <>
                        <Button title="Login"  onPress={signIn} /> 
                        <Button title="Create Account"  onPress={signUp} /> 
                    </>)}
                </KeyboardAvoidingView>
            </View>
        </ImageBackground>
    ); 
};

export default Login;

