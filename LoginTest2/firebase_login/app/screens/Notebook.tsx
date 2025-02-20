import {
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import styles from "./Styles";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { NavigationProp } from "@react-navigation/native";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}
export interface Vocab {
  learnedText: string;
  translation: string;
}

const initialVocab: Vocab[] = [{ learnedText: "", translation: "" }];

const Vocabulary = ({ vocab }: { vocab: Vocab[] }) => {
  return (
    <View style={notebookStyles.page}>
      <ScrollView>
        {vocab.length > 0 ? (
          vocab.map((item, index) => (
            <View style={notebookStyles.vocabItem} key={index}>
              <Text style={notebookStyles.vocabText}>{item.learnedText}</Text>
              <Text style={notebookStyles.vocabText}>{item.translation}</Text>
            </View>
          ))
        ) : (
          <Text>No Vocabulary Unlocked</Text>
        )}
      </ScrollView>
    </View>
  );
};

const Personal = () => {
  return (
    <View>
      <Text>Personal</Text>
    </View>
  );
};

const Notebook = ({ navigation }: RouterProps) => {
  const [currentTab, setCurrentTab] = useState("vocabulary");
  const [vocabulary, setVocabulary] = useState(initialVocab);

  useEffect(() => {
    const getVocab = async () => {
      try {
        const vocabJSON = await AsyncStorage.getItem("vocabulary");
        if (vocabJSON != null) {
          const vocab = JSON.parse(vocabJSON);
          if (Array.isArray(vocab)) {
            setVocabulary(vocab);
          } else {
            console.log("vocab is not an array: ", vocab);
          }
        }
      } catch (error) {
        console.error("Error retrieving vocabulary: ", error);
      }
    };
    getVocab();
  }, []);

  return (
    <View style={notebookStyles.screen}>
      <Pressable onPress={() => navigation.goBack()}>
        <Image
          style={styles.backButtonIcon}
          source={require("../../assets/backArrow.png")}
        />
      </Pressable>

      <View style={notebookStyles.titleContainer}>
        <Text style={notebookStyles.titleText}>Notebook</Text>
      </View>
      <View style={notebookStyles.tabs}>
        <Pressable
          style={notebookStyles.tab}
          onPress={() => setCurrentTab("vocabulary")}
        >
          <Text style={notebookStyles.tabTitle}>Vocabulary</Text>
        </Pressable>
        <Pressable
          style={notebookStyles.tab}
          onPress={() => setCurrentTab("personal")}
        >
          <Text style={notebookStyles.tabTitle}>Personal</Text>
        </Pressable>
      </View>
      <View style={notebookStyles.folder}>
        {currentTab == "vocabulary" && <Vocabulary vocab={vocabulary} />}
        {currentTab == "personal" && <Personal></Personal>}
      </View>
    </View>
  );
};

const notebookStyles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    paddingTop: 20,
    flex: 1,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 1,
    paddingBottom: 5,
  },
  titleText: {
    color: "black",
    fontSize: 30,
  },
  tabs: {
    flexDirection: "row",
  },
  tab: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white",
    borderColor: "#f7e1a3",
    borderWidth: 5,
    marginHorizontal: 5,
    padding: 10,
  },
  tabTitle: {
    fontSize: 18,
  },
  folder: {
    backgroundColor: "#f7e1a3",
    flex: 1,
    padding: 15,
  },
  page: {
    backgroundColor: "white",
    flex: 1,
    padding: 10,
  },
  vocabItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  vocabText: {
    width: "40%",
  },
});

export default Notebook;
