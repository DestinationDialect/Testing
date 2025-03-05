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
  FlatList,
} from "react-native";
import styles from "./Styles";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { NavigationProp } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { translateText } from "../../translate";
import { languages } from "./Scenarios/RestaurantScenario";
import { setDoc, doc } from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
interface RouterProps {
  navigation: NavigationProp<any, any>;
}
export interface Vocab {
  learnedText: string;
  translation: string;
}

const initialVocab: Vocab[] = [{ learnedText: "", translation: "" }];
const scenarioVocabs = [
  "Airport",
  "Restaurant",
  "Hotel",
  "Museum",
  "Zoo",
  "Farmer's Market",
  "Hospital",
];
const ScenarioVocabulary = ({ vocab }: { vocab: Vocab[] }) => {
  return (
    <ScrollView>
      {vocab && vocab.length > 0 ? (
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
  );
};
const Vocabulary = () => {
  // sets current section from user selection
  const [currentSection, setCurrentSection] = useState("Airport");
  // storing vocabulary array of objects for each scenario section
  const [airportVocabulary, setAirportVocabulary] = useState(initialVocab);
  const [restaurantVocabulary, setRestaurantVocabulary] =
    useState(initialVocab);
  const [hotelVocabulary, setHotelVocabulary] = useState(initialVocab);
  const [museumVocabulary, setMuseumVocabulary] = useState(initialVocab);
  const [zooVocabulary, setZooVocabulary] = useState(initialVocab);
  const [farmerVocabulary, setFarmerVocabulary] = useState(initialVocab);
  const [hospitalVocabulary, setHospitalVocabulary] = useState(initialVocab);

  // gets vocabulary for each section from async (if stored/ scenario complete)
  useEffect(() => {
    const getVocab = async (itemName: string) => {
      try {
        const vocabJSON = await AsyncStorage.getItem(itemName);
        if (vocabJSON != null) {
          const vocab = JSON.parse(vocabJSON);
          return vocab;
        }
      } catch (error) {
        console.error("Error retrieving vocabulary: ", error);
      }
    };
    const fetchVocab = async () => {
      const airportvocab = await getVocab("airportVocabulary");
      if (airportvocab) {
        setAirportVocabulary(airportvocab);
      }
      const restaurantvocab = await getVocab("restaurantVocabulary");
      if (restaurantvocab) {
        setRestaurantVocabulary(restaurantvocab);
      }
      const hotelvocab = await getVocab("hotelVocabulary");
      if (hotelvocab) {
        setHotelVocabulary(hotelvocab);
      }
      const museumvocab = await getVocab("museumVocabulary");
      if (museumvocab) {
        setMuseumVocabulary(museumvocab);
      }
      const zoovocab = await getVocab("zooVocabulary");
      if (zoovocab) {
        setZooVocabulary(zoovocab);
      }
      const farmervocab = await getVocab("farmerVocabulary");
      if (farmervocab) {
        setFarmerVocabulary(farmervocab);
      }
      const hospitalvocab = await getVocab("hospitalVocabulary");
      if (hospitalvocab) {
        setHospitalVocabulary(hospitalvocab);
      }
    };
    fetchVocab();
  }, []);

  return (
    <View style={notebookStyles.page}>
      <View style={notebookStyles.sections}>
        {scenarioVocabs.map((item, index) => (
          <Pressable
            key={index}
            style={
              item == currentSection
                ? notebookStyles.selectedSectionHeader
                : notebookStyles.sectionHeader
            }
            onPress={() => setCurrentSection(item)}
          >
            <Text>{item}</Text>
          </Pressable>
        ))}
      </View>
      {currentSection == "Airport" && (
        <ScenarioVocabulary vocab={airportVocabulary} />
      )}
      {currentSection == "Restaurant" && (
        <ScenarioVocabulary vocab={restaurantVocabulary} />
      )}
      {currentSection == "Hotel" && (
        <ScenarioVocabulary vocab={hotelVocabulary} />
      )}
      {currentSection == "Museum" && (
        <ScenarioVocabulary vocab={museumVocabulary} />
      )}
      {currentSection == "Zoo" && <ScenarioVocabulary vocab={zooVocabulary} />}
      {currentSection == "Farmer's Market" && (
        <ScenarioVocabulary vocab={farmerVocabulary} />
      )}
      {currentSection == "Hospital" && (
        <ScenarioVocabulary vocab={hospitalVocabulary} />
      )}
    </View>
  );
};

const PersonalTranslations = () => {
  const [personalVocab, setPersonalVocab] = useState<Vocab[]>([]);
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [learningLanguage, setLearningLanguage] = useState("");
  const [firstLanguage, setFirstLanguage] = useState("");

  const getLearningLanguage = async () => {
    // attempts to get target language from async storage
    try {
      const lang = await AsyncStorage.getItem("newLanguage");
      console.log("learningLanguage: ", lang);
      return lang;
    } catch (error) {
      console.error("Error retrieving data from AsyncStorage:", error);
      return null; // Return null in case of an error
    }
  };

  const getFirstLanguage = async () => {
    // attempts to get target language from async storage
    try {
      const lang = await AsyncStorage.getItem("originLanguage");
      return lang;
    } catch (error) {
      console.error("Error retrieving data from AsyncStorage:", error);
      return null; // Return null in case of an error
    }
  };

  const storeLanguage = async () => {
    // stores result of attempt to get language in variable and sets language to that if successful
    const lang = await getLearningLanguage();
    if (lang) {
      setLearningLanguage(lang);
    }
    const firstLang = await getFirstLanguage();
    if (firstLang) {
      setFirstLanguage(firstLang);
    }
  };

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
    storeLanguage(); // gets user languages from async
  }, []);

  // Call Google Translate API when user types a word
  const handleTranslation = async (text: string) => {
    setWord(text);
    setLoading(true);
    console.log(word);
    console.log(text);
    try {
      const translatedText = await translateText(
        word,
        languages[learningLanguage].tag,
        languages[firstLanguage].tag
      );

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
      const user = FIREBASE_AUTH.currentUser;
        if (user) {
          const user_id = user.uid;
          await setDoc(doc(FIRESTORE_DB, "user_personal_notebook", user_id), {
            Vocab: updatedVocab
          },
          { merge: true }); 
        }
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
      const user = FIREBASE_AUTH.currentUser;
        if (user) {
          const user_id = user.uid;
          await setDoc(doc(FIRESTORE_DB, "user_personal_notebook", user_id), {
            Vocab: updatedVocab
          },
          { merge: true }); 
        }
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
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={notebookStyles.addButton}
        >
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
              <TouchableOpacity
                onPress={() => openEditModal(index)}
                style={notebookStyles.editButton}
              >
                <FontAwesome name="edit" size={24} color="black" />
              </TouchableOpacity>

              {/* Delete Button */}
              <TouchableOpacity
                onPress={() => deleteWord(index)}
                style={notebookStyles.deleteButton}
              >
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

            <View style={notebookStyles.inputOutputContainer}>
              {/* Input Field */}
              <TextInput
                style={notebookStyles.input}
                placeholder="Enter a word"
                value={word}
                onChangeText={setWord}
              />
              <Text style={notebookStyles.output}>
                {translation || "translation"}
              </Text>
            </View>

            {/* Buttons */}
            <View style={notebookStyles.buttonRow}>
              <Pressable
                onPress={() => handleTranslation(word)}
                style={notebookStyles.translateButton}
              >
                <Text style={notebookStyles.buttonText}>Translate</Text>
              </Pressable>
              <TouchableOpacity
                style={notebookStyles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={notebookStyles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={notebookStyles.saveButton}
                onPress={saveWord}
              >
                <Text style={notebookStyles.buttonText}>
                  {editIndex !== null ? "Update" : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const PersonalNotes = () => {};

const Personal = () => {
  const [currentSection, setCurrentSection] = useState("Translations");
  return (
    <View style={notebookStyles.page}>
      <View style={notebookStyles.sections}>
        <Pressable
          style={
            currentSection == "Translations"
              ? notebookStyles.selectedSectionHeader
              : notebookStyles.sectionHeader
          }
          onPress={() => setCurrentSection("Translations")}
        >
          <Text>Translations</Text>
        </Pressable>
        <Pressable
          style={
            currentSection == "Notes"
              ? notebookStyles.selectedSectionHeader
              : notebookStyles.sectionHeader
          }
          onPress={() => setCurrentSection("Notes")}
        >
          <Text>Notes</Text>
        </Pressable>
      </View>
      {currentSection == "Translations" && <PersonalTranslations />}
    </View>
  );
};

const Notebook = ({ navigation }: RouterProps) => {
  const [currentTab, setCurrentTab] = useState("vocabulary");
  const [vocabulary, setVocabulary] = useState(initialVocab);

  return (
    <ImageBackground
      source={require("../../assets/SettingsPage.png")}
      resizeMode="cover"
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
          {currentTab == "vocabulary" && <Vocabulary />}
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
    marginLeft: 20,
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
  sections: {
    flexDirection: "row",
  },
  sectionHeader: {
    borderRadius: 10,
    backgroundColor: "#ccc",
    padding: 8,
    margin: 5,
    maxHeight: 40,
  },
  selectedSectionHeader: {
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 8,
    margin: 5,
    borderWidth: 2,
    borderColor: "#000",
    maxHeight: 40,
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
  inputOutputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  output: {
    height: 40,
    borderColor: "black",
    borderWidth: 2,
    marginLeft: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 5,
    textAlignVertical: "center",
    color: "gray",
    flex: 1,
    lineHeight: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
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
  translateButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginRight: 5,
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
