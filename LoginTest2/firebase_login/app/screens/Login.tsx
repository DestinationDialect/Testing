import {
  View,
  TextInput,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  ImageBackground,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import styles from "./Styles";
import { flattenedRouteData } from "./Route";

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
      const user = auth.currentUser;
      if (user) {
        const user_id = user.uid;
        await setDoc(doc(FIRESTORE_DB, "user_data", user_id), {});
        let i = 0;
        while (flattenedRouteData[i]) {
          setDoc(
            doc(FIRESTORE_DB, "user_data", user_id),
            {
              [flattenedRouteData[i].id]: {
                name: flattenedRouteData[i].title,
                stars: 0,
                unlocked: flattenedRouteData[i].isUnlocked,
              },
            },
            { merge: true }
          );
          i = i + 1;
        }
      }
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
    <ImageBackground
      source={require("../../assets/LoginScreen.png")}
      resizeMode="cover"
      style={styles.imgBackground}
    >
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

          {loading ? (
            <ActivityIndicator size="large" color="0000ff" />
          ) : (
            <>
              <TouchableOpacity style={styles.Button} onPress={signIn}>
                <Text style={styles.Text}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.Button} onPress={signUp}>
                <Text style={styles.Text}>Sign Up</Text>
              </TouchableOpacity>
            </>
          )}
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

export default Login;
