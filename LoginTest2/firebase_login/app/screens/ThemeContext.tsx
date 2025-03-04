import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

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
      await AsyncStorage.setItem("darkMode", value.toString());
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
