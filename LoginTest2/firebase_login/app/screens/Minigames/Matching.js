import {
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  View,
  FlatList,
  Pressable,
  Button,
  StyleSheet,
  Animated,
  Easing,
  SafeAreaView,
  Modal,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import styles from "../Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const randomArrFunction = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const initialTermPairs = {
  Cat: "Gato",
  Mouse: "Raton",
  Hola: "Hello",
  Adios: "Goodbye",
  "Por Favor": "Please",
  Gracias: "Thank you",
};
const gameCardsFunction = (terms) => {
  let termList = Object.entries(terms).flat();
  const shuffledTerms = randomArrFunction(termList);

  return shuffledTerms.map((term, index) => ({
    id: index,
    symbol: term,
    isFlipped: false,
  }));
};

const Matching = () => {
  const navigation = useNavigation();

  const [cards, setCards] = useState(gameCardsFunction(initialTermPairs));
  const [selectedCards, setSelectedCards] = useState([]);
  const [matches, setMatches] = useState(0);
  const [winMessage, setWinMessage] = useState(new Animated.Value(0));
  const [gameWon, setGameWon] = useState(false);

  const [modalVisible, setModalVisible] = useState(false); // controls topic selection modal visibility
  const [availableScenarios, setAvailableScenarios] = useState([]); // stores which scenarios vocab is unlocked
  const [availablePersonal, setAvailablePersonal] = useState([]); // stores available personal vocab sets
  const [topic, setTopic] = useState("Airport"); // stores topic of flashcards selected by user

  // useState variables to store
  // stores vocab from scenarios
  const [airportVocabulary, setAirportVocabulary] = useState({});
  const [restaurantVocabulary, setRestaurantVocabulary] = useState({});
  const [hotelVocabulary, setHotelVocabulary] = useState({});
  const [museumVocabulary, setMuseumVocabulary] = useState({});
  const [zooVocabulary, setZooVocabulary] = useState({});
  const [farmerVocabulary, setFarmerVocabulary] = useState({});
  const [hospitalVocabulary, setHospitalVocabulary] = useState({});

  // stores vocab from personal translations
  const [personalVocab, setPersonalVocab] = useState({});

  // returns set of terms based on selected topic
  function handleTopic() {
    if (topic == "Airport") {
      return airportVocabulary;
    } else if (topic == "Restaurant") {
      return restaurantVocabulary;
    } else if (topic == "Hotel") {
      return hotelVocabulary;
    } else if (topic == "Museum") {
      return museumVocabulary;
    } else if (topic == "Zoo") {
      return zooVocabulary;
    } else if (topic == "Farmer's Market") {
      return farmerVocabulary;
    } else if (topic == "Hospital") {
      return hospitalVocabulary;
    } else if (topic == "Personal") {
      return personalVocab;
    }
  }

  function formatVocab(vocabList) {
    return vocabList.reduce((acc, { learnedText, translation }) => {
      acc[learnedText] = translation;
      return acc;
    }, {});
  }

  // runs when component mounts
  useEffect(() => {
    let storedScenarios = [];
    let storedPersonal = [];
    // function to get each vocab set
    const getVocab = async (itemName) => {
      try {
        const vocabJSON = await AsyncStorage.getItem(itemName);
        if (vocabJSON != null) {
          const vocab = JSON.parse(vocabJSON);
          const formattedVocab = formatVocab(vocab);
          return formattedVocab;
        }
      } catch (error) {
        console.error(`Error retrieving ${itemName} vocabulary: `, error);
      }
    };
    // fetching vocab for each scenario and personal set
    const fetchVocab = async () => {
      // personal
      const personal = await getVocab("personalVocab");
      if (personal) {
        setPersonalVocab(personal);
        storedPersonal.push("Personal");
      }
      // scenarios
      const airportvocab = await getVocab("airportVocabulary");
      if (airportvocab) {
        setAirportVocabulary(airportvocab);
        storedScenarios.push("Airport");
        setCards(gameCardsFunction(airportvocab)); // if airport vocab available, set by default
      }
      const restaurantvocab = await getVocab("restaurantVocabulary");
      if (restaurantvocab) {
        setRestaurantVocabulary(restaurantvocab);
        storedScenarios.push("Restaurant");
      }
      const hotelvocab = await getVocab("hotelVocabulary");
      if (hotelvocab) {
        setHotelVocabulary(hotelvocab);
        storedScenarios.push("Hotel");
      }
      const museumvocab = await getVocab("museumVocabulary");
      if (museumvocab) {
        setMuseumVocabulary(museumvocab);
        storedScenarios.push("Museum");
      }
      const zoovocab = await getVocab("zooVocabulary");
      if (zoovocab) {
        setZooVocabulary(zoovocab);
        storedScenarios.push("Zoo");
      }
      const farmervocab = await getVocab("farmerVocabulary");
      if (farmervocab) {
        setFarmerVocabulary(farmervocab);
        storedScenarios.push("Farmer's Market");
      }
      const hospitalvocab = await getVocab("hospitalVocabulary");
      if (hospitalvocab) {
        setHospitalVocabulary(hospitalvocab);
        storedScenarios.push("Hospital");
      }
      setAvailableScenarios(storedScenarios);
      setAvailablePersonal(storedPersonal);
    };
    fetchVocab();
  }, []);

  const cardClickFunction = (card) => {
    if (!gameWon && selectedCards.length < 2 && !card.isFlipped) {
      const updatedSelectedCards = [...selectedCards, card];
      const updatedCards = cards.map((c) =>
        c.id === card.id ? { ...c, isFlipped: true } : c
      );
      setSelectedCards(updatedSelectedCards);
      setCards(updatedCards);

      if (updatedSelectedCards.length === 2) {
        const [firstCard, secondCard] = updatedSelectedCards;
        currentTermPairs = handleTopic(topic);
        const isMatch =
          currentTermPairs[firstCard.symbol] === secondCard.symbol ||
          currentTermPairs[secondCard.symbol] === firstCard.symbol;
        if (isMatch) {
          setMatches(matches + 1);
          setSelectedCards([]);
          if (matches + 1 === cards.length / 2) {
            winGameFunction();
            setGameWon(true);
          }
        } else {
          setTimeout(() => {
            const flippedCards = updatedCards.map((c) =>
              updatedSelectedCards.some((s) => s.id === c.id)
                ? { ...c, isFlipped: false }
                : c
            );
            setSelectedCards([]);
            setCards(flippedCards);
          }, 1000);
        }
      }
    }
  };

  const winGameFunction = () => {
    Animated.timing(winMessage, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (matches === cards.length / 2) {
      winGameFunction();
      setGameWon(true);
    }
  }, [matches]);

  const msg = `Matches: ${matches} / ${cards.length / 2}`;

  return (
    <SafeAreaView style={matchingStyles.container}>
      <ImageBackground
        source={require("../../../assets/homeScreen.png")}
        resizeMode="cover"
        style={matchingStyles.imgBackground}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Image
            style={styles.backButtonIcon}
            source={require("../../../assets/backArrow.png")}
          />
        </Pressable>
        <View style={matchingStyles.container}>
          <Text style={matchingStyles.header1}>Memory Pair Game</Text>
          <Text style={matchingStyles.matchText}>{msg}</Text>
          {gameWon ? (
            <View style={matchingStyles.winMessage}>
              {/* <View style={styles2.winMessageContent}></View> */}
              <Text style={matchingStyles.winText}>
                Congratulations! You Won!
              </Text>
              <Pressable
                onPress={() => setModalVisible(true)}
                style={matchingStyles.input}
              >
                <Text style={{ color: "white" }}>Select Topic</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setCards(gameCardsFunction(handleTopic(topic)));
                  setSelectedCards([]);
                  setMatches(0);
                  setWinMessage(new Animated.Value(0));
                  setGameWon(false);
                }}
              >
                <Text>Restart</Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ alignItems: "center" }}>
              <Pressable
                onPress={() => setModalVisible(true)}
                style={matchingStyles.input}
              >
                <Text style={{ color: "white" }}>Select Topic</Text>
              </Pressable>
              <ScrollView style={{ maxHeight: "60vh" }}>
                <View style={matchingStyles.grid}>
                  {cards.map((card) => (
                    <TouchableOpacity
                      key={card.id}
                      style={[
                        matchingStyles.card,
                        card.isFlipped && matchingStyles.cardFlipped,
                      ]}
                      onPress={() => cardClickFunction(card)}
                    >
                      {card.isFlipped ? (
                        <Text style={matchingStyles.cardText}>
                          {card.symbol}
                        </Text>
                      ) : null}
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
          <Modal visible={modalVisible} transparent={true}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>
                  Select your flashcard topic
                </Text>
                <View style={styles.modalLanguages}>
                  <View style={styles.modalLanguage}>
                    <Text>Scenario Vocabulary:</Text>
                    {availableScenarios.map((scenario, index) => (
                      <Pressable
                        key={index}
                        style={
                          scenario === topic
                            ? styles.selectedModalLanguageButton
                            : styles.modalLanguageButton
                        }
                        onPress={() => setTopic(scenario)}
                      >
                        <Text>{scenario}</Text>
                      </Pressable>
                    ))}
                  </View>
                  <View style={styles.modalLanguage}>
                    <Text>Personal Vocabulary:</Text>
                    {availablePersonal.map((vocab, index) => (
                      <Pressable
                        key={index}
                        style={
                          vocab === topic
                            ? styles.selectedModalLanguageButton
                            : styles.modalLanguageButton
                        }
                        onPress={() => setTopic(vocab)}
                      >
                        <Text>{vocab}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Pressable
                    onPress={() => {
                      setCards(gameCardsFunction(handleTopic(topic)));
                      setMatches(0);
                      setModalVisible(false);
                    }}
                    style={styles.continueButton}
                  >
                    <Text>Confirm</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setModalVisible(false);
                    }}
                    style={styles.cancelButton}
                  >
                    <Text>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const matchingStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  imgBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  header1: {
    fontSize: 36,
    marginBottom: 10,
    color: "green",
  },
  matchText: {
    fontSize: 18,
    color: "black",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    width: 90,
    height: 90,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
  },
  cardFlipped: {
    backgroundColor: "#ffc82c",
  },
  cardText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  winMessage: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    margin: 0,
    padding: 0,
  },
  winText: {
    fontSize: 36,
    color: "white",
  },
  input: {
    borderWidth: 2,
    borderColor: "white",
    padding: 10,
    width: 100,
    textAlign: "center",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "green",
    color: "white",
  },
});

export default Matching;
