import {
  View,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  ImageBackground,
  TouchableOpacity,
  Text,
  Modal,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import styles from "./Styles";
import { flattenedRouteData, initialRouteData, RouteItem } from "./Route";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface StarData {
  id: number;
  stars: number;
}

const availableLanguages = ["English", "Spanish", "French", "German"];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [firstLanguage, setFirstLanguage] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [stars, setStars] = useState([{ id: 0, stars: 0 }]);
  const auth = FIREBASE_AUTH;

  // set vocab items to empty string on login mount, before user logs in
  useEffect(() => {
    const clearAsync = async (itemName: string) => {
      try {
        await AsyncStorage.removeItem(itemName);
        console.log(`${itemName} storage cleared`);
      } catch (error) {
        console.error(`Error clearing async item ${itemName}:`, error);
      }
    };
    // removing vocabulary from async because they are only set on login, not sign up
    clearAsync("airportVocabulary");
    clearAsync("farmerVocabulary");
    clearAsync("restaurantVocabulary");
    clearAsync("hotelVocabulary");
    clearAsync("museumVocabulary");
    clearAsync("zooVocabulary");
    clearAsync("hospitalVocabulary");
    clearAsync("personalVocab");
    clearAsync("personalNotes");
    // removing settings from async because they are only set on login, not sign up
    clearAsync("darkMode");
    clearAsync("backgroundMusic");
    clearAsync("buttonSound");
  }, []);

  // stores stars in async storage
  const storeStars = async (stars: StarData[]) => {
    try {
      await AsyncStorage.setItem("stars", JSON.stringify(stars));
      console.log("stars: ", stars);
    } catch (error) {
      console.error("Error storing stars in AsyncStorage: ", error);
    }
  };

  // stores languages in async storage
  const asyncLanguageStorage = async (firstL: string, newL: string) => {
    try {
      await AsyncStorage.setItem("originLanguage", firstL);
      await AsyncStorage.setItem("newLanguage", newL);
      // Store Language
    } catch (error) {
      console.error("Error storing languages in AsyncStorage:", error);
    }
  };

  // unlocks level with id matching id parameter
  const unlockLevel = (id: number, data: RouteItem[]): RouteItem[] => {
    return data.map((item) => {
      if (item.id === id) {
        return { ...item, isUnlocked: true };
      }
      if (item.children) {
        return { ...item, children: unlockLevel(id, item.children) };
      }
      return item;
    });
  };

  // gets route data from database on log in, updates stars for each level
  const getRouteData = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const user_id = user.uid;
      const ref = doc(FIRESTORE_DB, "user_data", user_id);
      const docSnap = await getDoc(ref);
      const docData = docSnap.data();
      let i = 1;
      let updatedData = [...initialRouteData];
      console.log("user found");
      if (docData) {
        let scenarioID = docData[i];
        let updatedStars: StarData[] = [];
        while (scenarioID) {
          if (scenarioID && scenarioID.unlocked == true) {
            updatedData = unlockLevel(i, updatedData);
          }
          updatedStars.push({ id: i, stars: scenarioID.stars });
          i = i + 1;
          scenarioID = docData[i];
        }
        console.log("updatedStars: ", updatedStars);
        storeStars(updatedStars);
        return updatedData;
      }
    }
  };

  // sets route data in async storage on sign up or log in
  const setRouteData = async (storedRouteData: RouteItem[]) => {
    const routeData = JSON.stringify(storedRouteData);
    try {
      await AsyncStorage.setItem("routeData", routeData); // store stringified route data
    } catch (error) {
      console.error("Error storing route data in AsyncStorage:", error);
    }
  };

  const setLanguage = async () => {
    // function to fetch user languages from database and save in async storage on sign in
    const user = FIREBASE_AUTH.currentUser;
    let firstL = "English";
    let newL = "Spanish";
    if (user) {
      const user_id = user.uid;
      const ref = doc(FIRESTORE_DB, "user_language", user_id);
      const docSnap = await getDoc(ref);
      const docData = docSnap.data();
      console.log("user found");
      if (docData) {
        firstL = docData.firstLanguage;
        newL = docData.newLanguage;
      }
      await AsyncStorage.setItem("originLanguage", firstL);
      await AsyncStorage.setItem("newLanguage", newL);
    }
    // store data from variables in async storage
    asyncLanguageStorage(firstL, newL);
  };

  // stores notebook data in async storage
  const asyncNotebookStorage = async (title: string, notes: string) => {
    try {
      await AsyncStorage.setItem(title, notes);
      //Store language
    } catch (error) {
      console.error("Error storing languages in AsyncStorage:", error);
    } finally {
      console.log("Title: ", title, "Notebook JSON: ", notes);
    }
  };

  // gets notebook data from database
  const setNotebook = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const user_id = user.uid;
      const ref = doc(FIRESTORE_DB, "user_vocab_notebook", user_id);
      const docSnap = await getDoc(ref);
      const docData = docSnap.data();
      console.log("user found");
      if (docData) {
        Object.keys(docData).forEach((key) => {
          const note = docData[key];
          if (note && note.title && note.vocab) {
            asyncNotebookStorage(note.title, note.vocab);
            console.log(`${note.title}: ${note.vocab}`);
          }
        });
      }
      const refP = doc(FIRESTORE_DB, "user_personal_notebook", user_id);
      const docSnapP = await getDoc(refP);
      const docDataP = docSnapP.data();
      if (docDataP) {
        let updatedVocab = [];
        let i = 0;
        while (docDataP.Vocab[i]) {
          if (
            docDataP.Vocab[i] &&
            docDataP.Vocab[i].learnedText &&
            docDataP.Vocab[i].translation
          ) {
            updatedVocab.push({
              learnedText: docDataP.Vocab[i].learnedText,
              translation: docDataP.Vocab[i].translation,
            });
            console.log(
              docDataP.Vocab[i].learnedText,
              docDataP.Vocab[i].translation
            );
          }
          i++;
        }
        await AsyncStorage.setItem(
          "personalVocab",
          JSON.stringify(updatedVocab)
        );
      }
    }
  };

  const setSettings = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const user_id = user.uid;
      const ref = doc(FIRESTORE_DB, "user_settings", user_id);
      const docSnap = await getDoc(ref);
      const docData = docSnap.data();
      console.log("user found");
      if (docData) {
        if (
          docData.darkMode &&
          docData.backgroundMusic &&
          docData.buttonSound
        ) {
          let dm = docData.darkMode;
          let bm = docData.backgroundMusic;
          let bs = docData.buttonSound;
          await AsyncStorage.setItem("darkMode", dm);
          await AsyncStorage.setItem("backgroundMusic", bm);
          await AsyncStorage.setItem("buttonSound", bs);
          console.log(
            " darkMode: " +
              dm +
              " backgroundMusic: " +
              bm +
              " buttonSound: " +
              bs
          );
        }
      }
    }
  };

  // function called when user clicks log in, fetches all user data and stores in async
  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      setLanguage();
      setNotebook();
      setSettings();
      const routeData = await getRouteData();
      if (routeData) {
        setRouteData(routeData);
      }
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed" + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true); // edit function to add languages to database
    //Add another collection to store user_languages and change name of user_data to user_route
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
        let updatedStars: StarData[] = [];
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
          updatedStars.push({ id: flattenedRouteData[i].id, stars: 0 });
          i = i + 1;
        }
        setStars(updatedStars);
        storeStars(updatedStars);
        await setDoc(doc(FIRESTORE_DB, "user_language", user_id), {
          firstLanguage: firstLanguage,
          newLanguage: newLanguage,
        });
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

  const handleLanguageSelection = () => {
    // store languages in async storage
    if (firstLanguage && newLanguage && firstLanguage != newLanguage) {
      // stores languages in async
      asyncLanguageStorage(firstLanguage, newLanguage);

      // stores initial route data in async
      setRouteData(initialRouteData);

      // stores number of stars

      // close Modal
      setLanguageModalVisible(false);

      // complete sign up
      signUp();
    } else if (!firstLanguage || !newLanguage) {
      setErrorMessage("Must select languages");
    } else if (firstLanguage == newLanguage) {
      setErrorMessage("Must select different languages");
    }
  };

  const handleSignUp = () => {
    // display modal for language selection
    setLanguageModalVisible(true);
  };

  return (
    <ImageBackground
      source={require("../../assets/LoginScreen.png")}
      resizeMode="cover"
      style={styles.imgBackground}
    >
      <View style={styles.loginContainer}>
        <Modal visible={languageModalVisible} transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>
                Select your language settings
              </Text>
              <View style={styles.modalLanguages}>
                <View style={styles.modalLanguage}>
                  <Text>First Language:</Text>
                  {availableLanguages.map((language, index) => (
                    <Pressable
                      key={index}
                      style={
                        language === firstLanguage
                          ? styles.selectedModalLanguageButton
                          : styles.modalLanguageButton
                      }
                      onPress={() => setFirstLanguage(language)}
                    >
                      <Text>{language}</Text>
                    </Pressable>
                  ))}
                </View>
                <View style={styles.modalLanguage}>
                  <Text>Language to learn:</Text>
                  {availableLanguages.map((language, index) => (
                    <Pressable
                      key={index}
                      style={
                        language === newLanguage
                          ? styles.selectedModalLanguageButton
                          : styles.modalLanguageButton
                      }
                      onPress={() => setNewLanguage(language)}
                    >
                      <Text>{language}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <Pressable
                onPress={() => handleLanguageSelection()}
                style={styles.continueButton}
              >
                <Text>Continue to Home</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
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
              <TouchableOpacity style={styles.Button} onPress={handleSignUp}>
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
