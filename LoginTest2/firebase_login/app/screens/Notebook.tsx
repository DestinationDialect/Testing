import {
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import styles from "./Styles";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { NavigationProp } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import { translateText } from "../../translate";

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
  const [personalVocab, setPersonalVocab] = useState<Vocab[]>([]);
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const targetLanguage = "es"; // Set to desired target language
  const sourceLanguage = "en"; // Default source language

  // Load saved vocab when the component mounts
  useEffect(() => {
    const loadPersonalVocab = async () => {
      try {
        //DATABASE EVENTUALLY
        const savedVocab = await AsyncStorage.getItem("personalVocab");
        if (savedVocab) {
          setPersonalVocab(JSON.parse(savedVocab));
        }
      } catch (error) {
        console.error("Error loading personal vocabulary:", error);
      }
    };
    loadPersonalVocab();
  }, []);

  // Call Google Translate API when user types a word
  const handleTranslation = async (text: string) => {
    setWord(text);
    setLoading(true);
    
    try {
      const translatedText = await translateText(text, targetLanguage, sourceLanguage);
      if (translatedText && translatedText.length > 0) {
        setTranslation(translatedText[0].translatedText); // Extract translated text
      } else {
        setTranslation("Translation not available");
      }
    } catch (error) {
      console.error("Error translating text:", error);
      setTranslation("Error in translation");
    }

    setLoading(false);
  };


  // Function to save a new or edited word
  const saveWord = async () => {
    if (word.trim() === "" || translation.trim() === "") {
      Alert.alert("Error", "Field must be filled.");
      return;
    }

    let updatedVocab = [...personalVocab];

    if (editIndex !== null) {
      // Editing existing word
      updatedVocab[editIndex] = { learnedText: word, translation };
      setEditIndex(null);
    } else {
      // Adding a new word
      updatedVocab.push({ learnedText: word, translation });
    }

    try {
      await AsyncStorage.setItem("personalVocab", JSON.stringify(updatedVocab));
      setPersonalVocab(updatedVocab);
      setWord(""); // Clear input fields
      setTranslation("");
      setModalVisible(false); // Close the modal
    } catch (error) {
      console.error("Error saving word:", error);
    }
  };

  // Function to delete a word
  const deleteWord = async (index: number) => {
    const updatedVocab = personalVocab.filter((_, i) => i !== index);
    try {
      await AsyncStorage.setItem("personalVocab", JSON.stringify(updatedVocab));
      setPersonalVocab(updatedVocab);
    } catch (error) {
      console.error("Error deleting word:", error);
    }
  };

  // Open edit modal with existing word data
  const openEditModal = (index: number) => {
    setWord(personalVocab[index].learnedText);
    setTranslation(personalVocab[index].translation);
    setEditIndex(index);
    setModalVisible(true);
  };

  return (
    <View style={notebookStyles.page}>
      {/* Header with Add Button */}
      <View style={notebookStyles.header}>
        <Text style={notebookStyles.sectionTitle}>Personal Vocabulary</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={notebookStyles.addButton}>
          <Text style={notebookStyles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Display Saved Words with Edit & Delete */}
      <ScrollView>
        {personalVocab.length > 0 ? (
          personalVocab.map((item, index) => (
            <View style={notebookStyles.vocabItem} key={index}>
              <Text style={notebookStyles.vocabText}>{item.learnedText}</Text>
              <Text style={notebookStyles.vocabText}>{item.translation}</Text>

              {/* Edit Button */}
              <TouchableOpacity onPress={() => openEditModal(index)} style={notebookStyles.editButton}>
                <FontAwesome name="edit" size={24} color="black" />
              </TouchableOpacity>

              {/* Delete Button */}
              <TouchableOpacity onPress={() => deleteWord(index)} style={notebookStyles.deleteButton}>
                <FontAwesome name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text>No personal vocabulary added.</Text>
        )}
      </ScrollView>

      {/* Modal for Adding or Editing Words */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={notebookStyles.modalOverlay}>
          <View style={notebookStyles.modalView}>
            <Text style={notebookStyles.modalTitle}>
              {editIndex !== null ? "Edit Word" : "Add New Word"}
            </Text>

            {/* Input Field */}
            <TextInput
              style={notebookStyles.input}
              placeholder="Enter a word"
              value={word}
              onChangeText={handleTranslation}
            />

            {/* Buttons */}
            <View style={notebookStyles.buttonRow}>
              <TouchableOpacity style={notebookStyles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={notebookStyles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={notebookStyles.saveButton} onPress={saveWord}>
                <Text style={notebookStyles.buttonText}>{editIndex !== null ? "Update" : "Save"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const Notebook = ({ navigation }: RouterProps) => {
  const [currentTab, setCurrentTab] = useState("vocabulary");
  const [vocabulary, setVocabulary] = useState(initialVocab);

  useEffect(() => {
    const getVocab = async () => {
      try {
        //pull vocab from database
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
      <View style={notebookStyles.screen}>
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
    </ImageBackground>  
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
    borderColor: "green",
    borderWidth: 5,
    marginHorizontal: 20,
    padding: 10,
  },
  tabTitle: {
    fontSize: 18,
  },
  folder: {
    backgroundColor: "green",
    flex: 1,
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  page: {
    backgroundColor: "white",
    flex: 1,
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  vocabItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  vocabText: {
    width: "40%",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "green",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalView: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginRight: 5,
  },
  saveButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  editButton: {
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  deleteButton: {
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
});

export default Notebook;
