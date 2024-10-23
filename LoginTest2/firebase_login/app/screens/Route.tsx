import {
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import styles from "./Styles";
import React from "react";
import { NavigationProp } from "@react-navigation/native";

//Move these to a function probably:
import { doc, getDoc, setDoc} from 'firebase/firestore';
import {FIRESTORE_DB } from '../../FirebaseConfig'; //our config file
import { FIREBASE_AUTH } from "../../FirebaseConfig";
const auth = FIREBASE_AUTH;

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Route = ({ navigation }: RouterProps) => {
  //this checks the database for a specific scenario and will navigate
  //to it if it's unlocked
  const databaseConnection = async(scenarioName: string) =>{
    const user = auth.currentUser;
      if(user){
        const user_id = user.uid;
        const ref = doc(FIRESTORE_DB, "user_data", user_id);
        const docSnap = await getDoc(ref);
        const docData =  docSnap.data()
        if (docData){
          const scenario = docData[scenarioName]
          if(scenario && scenario.unlocked){
            navigation.navigate(scenarioName)
          }
        }
      }
  }
  return (
    <ImageBackground
      source={require("../../assets/routeScreen.png")}
      resizeMode="cover"
      style={styles.imgBackground}
    >
      <ScrollView style={styles.scroller}>
        <Text style={styles.titleText}>Route</Text>

          <TouchableOpacity
              style={styles.airport}
          //Change this to the function at the top and make sure to navigate
          //with that function
              onPress={() => databaseConnection("AirportScenario")}
            >
            <Text>Airport</Text>
          </TouchableOpacity>
        

        <TouchableOpacity
          style={styles.restaurant}
          onPress={() => databaseConnection("RestaurantScenario")}
        >
          <Text>Restaurant</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

export default Route;
