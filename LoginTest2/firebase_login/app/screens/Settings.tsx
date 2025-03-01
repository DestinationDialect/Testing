import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Switch,
  ImageBackground,
  Pressable,
  Image, 
  useColorScheme,
  Modal, 
} from "react-native";
import React, { useState, useEffect } from "react";
import styles from "./Styles";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "./ThemeContext"; 
import AudioManager from "./AudioManager";

type InsideStackParamList = {
  Settings: undefined;
  ContactUs: undefined;
};

const availableLanguages = ["English", "Spanish", "French", "German"];

interface SettingItem {
  id: string;
  icon: string;
  label: string;
  type: "select" | "toggle" | "link";
}

interface Sections {
  header: string;
  items: SettingItem[];
}

const SECTIONS: Sections[] = [
  {
    header: "Preferences",
    items: [
      { 
        id: "language", 
        icon: "globe", 
        label: "Language", 
        type: "select" 
      },
      { 
        id: 
        "darkMode", 
        icon: "moon", 
        label: "Dark Mode", 
        type: "toggle" 
      },
      {
        id: "backgroundMusic",
        icon: "headphones",
        label: "Background Music",
        type: "toggle",
      },
      {
        id: "buttonSound",
        icon: "volume-2",
        label: "Button Sound",
        type: "toggle",
      },
      {
        id: "notifications",
        icon: "message-circle",
        label: "Notifications",
        type: "toggle",
      },
    ],
  },
  {
    header: "Help",
    items: [
      { 
        id: "bug", 
        icon: "flag", 
        label: "Bug Report", 
        type: "link" 
      },
      { 
        id: "contact", 
        icon: "mail", 
        label: "Contact Us", 
        type: "link" 
      },
    ],
  },
];

interface FormState {
  darkMode: boolean;
  language: string;
  backgroundMusic: boolean;
  buttonSound: boolean;
  notifications: boolean;
}

export default function Settings() {
  //const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [firstLanguage, setFirstLanguage] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English"); 
  const [errorMessage, setErrorMessage] = useState("");
  const { darkMode, toggleDarkMode } = useTheme();
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation<NativeStackNavigationProp<InsideStackParamList>>();

  const asyncLanguageStorage = async (firstL: string, newL: string) => {
    try {
      await AsyncStorage.setItem("originLanguage", firstL);
      await AsyncStorage.setItem("newLanguage", newL);
      //Store language
    } catch (error) {
      console.error("Error storing languages in AsyncStorage:", error);
    } finally {
      console.log(
        "Stored Languages - firstLanguage: ",
        firstL,
        "newLanguage: ",
        newL
      );
    }
  };

  const setLanguage = async () => {
    // function to fetch user languages from database and save in async storage on sign in
    // replace language setting with database call data
    const user = FIREBASE_AUTH.currentUser;
    let firstL = "English"
    let newL = "Spanish"
      if (user) {
        const user_id = user.uid;
        const ref = doc(FIRESTORE_DB, "user_language", user_id);
        const docSnap = await getDoc(ref);
        const docData = docSnap.data();
        console.log("user found");
        if (docData) {
          firstL = docData.firstLanguage
          newL = docData.newLanguage
        }
      }
    // store data from variables in async storage
    asyncLanguageStorage(firstL, newL);
  };

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      setLanguage();
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed" + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageSelection = () => {
    // store languages in async storage
    if (firstLanguage && newLanguage && firstLanguage != newLanguage) {
      asyncLanguageStorage(firstLanguage, newLanguage);

      // close Modal
      setLanguageModalVisible(false);
    }
  };

  const [form, setForm] = useState<FormState>({
    darkMode: false,
    language: "English", 
    backgroundMusic: true,
    buttonSound: true,
    notifications: true,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedButtonSound = await AsyncStorage.getItem("buttonSound");
        const savedBackgroundMusic = await AsyncStorage.getItem("backgroundMusic");
        const savedFirstLanguage = await AsyncStorage.getItem("originLanguage");
        const savedNewLanguage = await AsyncStorage.getItem("newLanguage");
  
        setForm((prevState) => ({
          ...prevState,
          buttonSound: savedButtonSound === "true",
          backgroundMusic: savedBackgroundMusic === "true",
        }));
  
        if (savedFirstLanguage && savedNewLanguage) {
          setFirstLanguage(savedFirstLanguage);
          setNewLanguage(savedNewLanguage);
        }
      } catch (error) {
        console.error("Error loading settings from AsyncStorage:", error);
      }
    };
  
    loadSettings();

    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("selectedLanguage");
        if (savedLanguage) {
          setSelectedLanguage(savedLanguage);
        }
      } catch (error) {
        console.error("Error loading language from AsyncStorage:", error);
      }
    };
    loadLanguage();

  }, []);  

  return (
    <ImageBackground
      source={
        darkMode
          ? require("../../assets/DarkModeBackground.jpg") // Use dark mode image
          : require("../../assets/homeScreen.png") // Default light mode
      }
      resizeMode="cover"
      style={[styles.imgBackground, darkMode && styles.darkImgBackground]} // Apply different styles
    > 
      <Pressable 
        onPress={async () => { 
          await AudioManager.playButtonSound();
          navigation.goBack();
        }}
      >
        <Image
          style={styles.backButtonIcon}
          source={
            darkMode 
            ? require("../../assets/whiteBackArrow.png")
            : require("../../assets/backArrow.png")
          }
        />
      </Pressable>
      <ScrollView contentContainerStyle={[styles.container, darkMode && styles.darkContainer]}>
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
              <Text>{errorMessage}</Text>
              <Pressable
                style={[styles.continueButton, darkMode && styles.darkContinueButton]}
                onPress={async () => {
                  AudioManager.playButtonSound();
                  await AsyncStorage.setItem("originLanguage", firstLanguage);
                  await AsyncStorage.setItem("newLanguage", newLanguage);
                  setLanguageModalVisible(false);
                }}
              >
                <Text style={styles.continueButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </Modal>


        <View style={styles.header}>
          <Text style={[styles.title, darkMode && styles.darkTitle]}>Settings</Text>
          <Text style={[styles.subtitle, darkMode && styles.darkSubtitle]}>Update your Preferences Here</Text>
        </View>

        {SECTIONS.map(({ header, items }) => (
          <View style={styles.section} key={header}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionHeaderText, darkMode && styles.darkSectionHeaderText]}>{header}</Text>
            </View>

            <View style={styles.sectionBody}>
              {items.map(({ label, id, type, icon }, index) => (
                <View
                  style={[
                    styles.rowWrapper, darkMode && styles.darkRowWrapper,
                    index === 0 && { borderTopWidth: 0 },
                  ]}
                  key={id}
                >
                  <TouchableOpacity
                    onPress={() => {  
                    AudioManager.playButtonSound();   
                      if (id === "contact") {
                        navigation.navigate("ContactUs");
                      }
                      if (id === "language") {
                        setLanguageModalVisible(true);
                      }
                    }}
                  >
                    <View style={styles.row}>
                      <FeatherIcon style={[styles.featherIcon, darkMode && styles.darkFeatherIcon]}
                        name={icon}
                        size={22}
                      />
                      <Text style={[styles.rowLabel, darkMode && styles.darkRowLabel]}>{label}</Text>
                      <View style={styles.rowSpacer} />

                      {/* Only show toggle switches for specific settings */}
                      {["darkMode", "backgroundMusic", "buttonSound", "notifications"].includes(id) && (
                        <Switch
                          value={id === "darkMode" ? darkMode : Boolean(form[id as keyof FormState])}
                          onValueChange={(value) => {
                            if (id === "darkMode") {
                              toggleDarkMode(value); 
                            }else {
                              setForm({ ...form, [id as keyof FormState]: value })
                            }

                            // Handle Audio Toggles
                            if (id === "backgroundMusic") {
                              setForm((prevState) => ({ ...prevState, backgroundMusic: value }));
                              AsyncStorage.setItem("backgroundMusic", value.toString()).then(() => {
                                if (value) {
                                  AudioManager.playBackgroundMusic();
                                } else {
                                  AudioManager.stopBackgroundMusic();
                                }
                              });
                            }                            
                            
                            if (id === "buttonSound") {
                              setForm((prevState) => ({ ...prevState, buttonSound: value }));
                              AsyncStorage.setItem("buttonSound", value.toString());
                            }                            

                          }}
                        />
                      )}

                      {/* Show selected language next to Language option */}
                      {id === "language" && (
                        <Text style={styles.selectedLanguageText}>
                          {firstLanguage} ➞ {newLanguage}
                        </Text>
                      )}

                      {/* Show arrow for "select" and "link" types */}
                      {["select", "link"].includes(type) && (
                        <FeatherIcon name="chevron-right" color="white" size={22} />
                      )}

                    </View>
                  </TouchableOpacity> 
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </ImageBackground>  
  );
}
