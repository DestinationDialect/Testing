import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";

// Create the context
const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: (value: boolean) => {},
});

// Provider Component
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(systemColorScheme === "dark");

  useEffect(() => {
    // Load Dark Mode setting from AsyncStorage
    const loadDarkMode = async () => {
      try {
        const storedMode = await AsyncStorage.getItem("darkMode");
        if (storedMode !== null) {
          setDarkMode(storedMode === "true");
        }
      } catch (error) {
        console.error("Error loading dark mode preference:", error);
      }
    };
    loadDarkMode();
  }, []);

  const toggleDarkMode = async (value: boolean) => {
    setDarkMode(value);
    try {
      let strValue = value.toString()
      await AsyncStorage.setItem("darkMode", strValue);
      const user = FIREBASE_AUTH.currentUser;
        if (user) {
          const user_id = user.uid;
          await setDoc(
            doc(FIRESTORE_DB, "user_settings", user_id), 
            {
              darkMode: strValue,
            }, { merge: true }
          )
        }
    } catch (error) {
      console.error("Error saving dark mode preference:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use Dark Mode
export const useTheme = () => useContext(ThemeContext);
