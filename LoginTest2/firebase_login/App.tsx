import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./app/screens/Login";
import Home from "./app/screens/Index";
import Route from "./app/screens/Route";
import Notebook from "./app/screens/Notebook";
import Settings from "./app/screens/Settings";
import Minigames from "./app/screens/Minigames";
import AirportScenario from "./app/screens/Scenarios/AirportScenario";
import RestaurantScenario from "./app/screens/Scenarios/RestaurantScenario";
import HotelScenario from "./app/screens/Scenarios/HotelScenario";
import MuseumScenario from "./app/screens/Scenarios/MuseumScenario"; 
import ZooScenario from "./app/screens/Scenarios/ZooScenario";
import FarmersMarketScenario from "./app/screens/Scenarios/FarmersMarketScenario";
import HospitalScenario from "./app/screens/Scenarios/HospitalScenario";
import Flashcards from "./app/screens/Minigames/Flashcards";
import Matching from "./app/screens/Minigames/Matching";
import ContactUs from "./app/screens/ContactUs";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { FIREBASE_AUTH } from "./FirebaseConfig";
import { ThemeProvider } from "../firebase_login/app/screens/ThemeContext";
import AudioManager from "./app/screens/AudioManager";

const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <InsideStack.Screen
        name="Route"
        component={Route}
        options={{ headerShown: false }}
      />
      <InsideStack.Screen
        name="Settings"
        component={Settings}
        options={{ headerShown: false }}
      />
      <InsideStack.Screen
        name="Notebook"
        component={Notebook}
        options={{ headerShown: false }}
      />
      <InsideStack.Screen
        name="Minigames"
        component={Minigames}
        options={{ headerShown: false }}
      />
      <InsideStack.Screen
        name="AirportScenario"
        component={AirportScenario}
        options={{ headerShown: false }}
      />
      <InsideStack.Screen
        name="RestaurantScenario"
        component={RestaurantScenario}
        options={{ headerShown: false }}
      />
      <InsideStack.Screen
        name="HotelScenario"
        component={HotelScenario}
        options={{ headerShown: false }}
      />
      <InsideStack.Screen
        name="MuseumScenario"
        component={MuseumScenario}
        options={{ headerShown: false }}
      />
      <InsideStack.Screen
        name="ZooScenario"
        component={ZooScenario}
        options={{ headerShown: false }}
      />
      <InsideStack.Screen
        name="FarmersMarketScenario"
        component={FarmersMarketScenario}
        options={{ headerShown: false }}
      />
      <InsideStack.Screen
        name="HospitalScenario"
        component={HospitalScenario}
        options={{ headerShown: false }}
      />
      <InsideStack.Screen
        name="Flashcards"
        component={Flashcards}
        options={{ headerShown: false }}
      />
      <InsideStack.Screen
        name="Matching"
        component={Matching}
        options={{ headerShown: false }}
      />
      <InsideStack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{ headerShown: false }}
      />
    </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("user", user);
      setUser(user);
    });

    if (!isAudioInitialized) {
      AudioManager.initialize(); // Load audio settings on startup
      setIsAudioInitialized(true);
    }
  }, []);
  return (
    <ThemeProvider> 
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          {user ? (
            <Stack.Screen
              name="Inside"
              component={InsideLayout}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
