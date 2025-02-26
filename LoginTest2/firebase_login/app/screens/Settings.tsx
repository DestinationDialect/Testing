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
} from "react-native";
import { useState, useEffect } from "react";
import styles from "./Styles";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "./ThemeContext"; 

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
  const { darkMode, toggleDarkMode } = useTheme();
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation<NativeStackNavigationProp<InsideStackParamList>>();

  const asyncLanguageStorage = async () => {
    try {
      await AsyncStorage.setItem("originLanguage", firstLanguage);
      await AsyncStorage.setItem("newLanguage", newLanguage);
    } catch (error) {
      console.error("Error storing languages in AsyncStorage:", error);
    }
  };

  const setLanguage = async () => {
    // function to fetch user languages from database and save in async storage on sign in
    // replace language setting with database call data
    setFirstLanguage("English");
    setNewLanguage("Spanish");

    // store data from variables in async storage
    asyncLanguageStorage();
  };

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed" + error.message);
      setLoginError(true);
     } finally {
      if (!loginError) {
        setLanguage(); // function to fetch user languages from database and save in async storage
      }
      setLoading(false);
    }
  };

  const handleLanguageSelection = () => {
    // store languages in async storage
    asyncLanguageStorage();
  
    // close Modal
    setLanguageModalVisible(false);
  
    // // complete sign up
    // signUp();
  };
  
  const handleSignUp = () => {
    // display modal for language selection
    setLanguageModalVisible(true);
  };

  const [form, setForm] = useState<FormState>({
    darkMode: false,
    language: "English",
    backgroundMusic: true,
    buttonSound: true,
    notifications: true,
  });

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
      <Pressable onPress={() => navigation.goBack()}>
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
                      if (id === "contact") {
                        navigation.navigate("ContactUs");
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
                          }}
                        />
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
