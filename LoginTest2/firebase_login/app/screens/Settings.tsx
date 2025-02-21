import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Switch,
  ImageBackground,
  Pressable,
  Image, 
} from "react-native";
import { useState } from "react";
import styles from "./Styles";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

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
    // <SafeAreaView style={{ flex: 1, backgroundColor: "#f6f6f6" }}>
      <ImageBackground
        source={require("../../assets/SettingsPage.png")}
        resizeMode='cover'
        style={styles.imgBackground}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Image
            style={styles.backButtonIcon}
            source={require("../../assets/backArrow.png")}
          />
        </Pressable>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Update your Preferences Here</Text>
          </View>

          {SECTIONS.map(({ header, items }) => (
            <View style={styles.section} key={header}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{header}</Text>
              </View>

              <View style={styles.sectionBody}>
                {items.map(({ label, id, type, icon }, index) => (
                  <View
                    style={[
                      styles.rowWrapper,
                      index === 0 && { borderTopWidth: 0 },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        if (id === "contact") {
                          navigation.navigate("ContactUs");
                        }
                      }}
                      key={id}
                    >
                      <View style={styles.row}>
                        <FeatherIcon
                          name={icon}
                          color="white"
                          size={22}
                          style={{ marginRight: 12 }}
                        />
                        <Text style={styles.rowLabel}>{label}</Text>

                        <View style={styles.rowSpacer} />

                        {type === "select" && (
                          <Text style={styles.rowValue}>
                            {form[id as keyof FormState]}
                          </Text>
                        )}

                        {type === "toggle" && (
                          <Switch
                            value={Boolean(form[id as keyof FormState])}
                            onValueChange={(value) =>
                              setForm({ ...form, [id as keyof FormState]: value })
                            }
                          />
                        )}

                        {["select", "link"].includes(type) && (
                          <FeatherIcon
                            name="chevron-right"
                            color="white"
                            size={22}
                          />
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
