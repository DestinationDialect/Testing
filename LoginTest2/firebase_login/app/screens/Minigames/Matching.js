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
  } from "react-native";
  import { useNavigation } from "@react-navigation/native";
  import React, { useState, useEffect } from 'react';
  import styles from "../Styles";
  import { useTheme } from "../ThemeContext";
  import AudioManager from "../AudioManager";

  const randomArrFunction = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  
  const termPairs = {
    "Cat": "Gato",
    "Mouse": "Raton",
    "Hola": "Hello",
    "Adios": "Goodbye",
    "Por Favor": "Please",
    "Gracias": "Thank you",
  };
  const gameCardsFunction = () => {

  
    let termList = Object.entries(termPairs).flat();
    const shuffledTerms = randomArrFunction(termList);
  
    return shuffledTerms.map((term, index) => ({
      id: index,
      symbol: term,
      isFlipped: false,
    }));
  };
  
  
  const Matching = () => {
    const navigation = useNavigation();

    const [cards, setCards] = useState(gameCardsFunction());
    const [selectedCards, setSelectedCards] = useState([]);
    const [matches, setMatches] = useState(0);
    const [winMessage, setWinMessage] = useState(new Animated.Value(0));
    const [gameWon, setGameWon] = useState(false);
    const { darkMode } = useTheme(); // Get Dark Mode from context
  
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
          const isMatch = termPairs[firstCard.symbol] === secondCard.symbol ||
                          termPairs[secondCard.symbol] === firstCard.symbol;
    
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
                updatedSelectedCards.some((s) => s.id === c.id) ? { ...c, isFlipped: false } : c
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
      <SafeAreaView style={styles2.container}> 
        <ImageBackground
              source={
                darkMode
                  ? require("../../../assets/DarkModeBackground.jpg") // Dark mode image
                  : require("../../../assets/homeScreen.png") // Light mode image
              }
              resizeMode="cover"
              style={styles.imgBackground}
            >
              <Pressable 
                onPress={() => { 
                  AudioManager.playButtonSound(); 
                  navigation.goBack()
                }}>
                <Image
                  style={styles.backButtonIcon}
                  source={
                    darkMode
                      ? require("../../../assets/whiteBackArrow.png")
                      : require("../../../assets/backArrow.png")
                  }
                />
              </Pressable>
        <View style={styles2.container}>
			    <Text style={[styles2.header1, darkMode && styles2.darkHeader1]}>Memory Pair Game</Text>
			    <Text style={[styles2.matchText, darkMode && styles2.darkMatchText]}>{msg}</Text>       
			    {gameWon ? (
				    <View style={[styles2.winMessage, darkMode && styles2.darkWinMessage]}>
					    <Text style={[styles2.winText, darkMode && styles2.darkWinText]}>Congratulations! You Won!</Text>
					    <Button
						    title="Restart"
						    onPress={() => {
                  AudioManager.playButtonSound();
							    setCards(gameCardsFunction());
							    setSelectedCards([]);
							    setMatches(0);
							    setWinMessage(new Animated.Value(0));
							    setGameWon(false);
						    }}
					    />  
            </View> 
			    ) : (  
				<View style={styles2.grid}>
					{cards.map((card) => (
						<TouchableOpacity
							key={card.id}
							style={[styles2.card, darkMode && styles2.darkCard, card.isFlipped && styles2.cardFlipped, darkMode && styles2.darkCardIsFlipped]}
							onPress={() => cardClickFunction(card)}
						>
							{card.isFlipped ? (
								<Text style={[styles2.cardText, darkMode && styles2.darkCardText]}>{card.symbol}</Text>
							) : null}
						</TouchableOpacity>
					))}
				</View>
			  )}
		    </View>
        </ImageBackground>
      </SafeAreaView>
    );
  };

  const styles2 = StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      height: "100%", 
      alignItems: 'center',
    },
    imgBackground: { 
      flex: 1,
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },

    //---------------
    darkHeader1: {
      fontSize: 36,
      marginBottom: 10,
      color: "rgb(241, 236, 215)",
    },
    header1: {
      fontSize: 36,
      marginBottom: 10,
      color: "black",
    },
    //---------------

    //---------------
    darkMatchText: {
      fontSize: 18,
      color: "rgb(241, 236, 215)",
    },
    matchText: {
      fontSize: 18,
      color: 'black',
    },
    //----------------

    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },

    //----------------
    darkCard: {
      width: 90,
      height: 90,
      margin: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'darkgreen',
      borderRadius: 10,
      borderWidth: 2,
      borderColor: 'rgb(241, 236, 215)',
    },
    card: {
      width: 90,
      height: 90,
      margin: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'green',
      borderRadius: 10,
      borderWidth: 2,
      borderColor: 'white',
    },
    //-----------------

    //-----------------
    darkCardFlipped: {
      backgroundColor: '#d8a208',
    },
    cardFlipped: {
      backgroundColor: '#ffc82c',
    },
    //-----------------

    //-----------------
    darkCardText: {
      fontSize: 20,
      color: 'white',
      fontWeight: 'bold',
    },
    cardText: {
      fontSize: 20,
      color: 'white',
      fontWeight: 'bold',
    },
    //-----------------

    //-----------------
    darkWinMessage: {
      position: 'absolute',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      margin: 0,
      padding: 0,
    },
    winMessage: {
      position: 'absolute',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      margin: 0,
      padding: 0,
    },
    //------------------

    //------------------
    darkWinText: {
      fontSize: 36,
      color: 'rgb(241, 236, 215)',
    },
    winText: {
      fontSize: 36,
      color: 'white',
    },
    //------------------
  });
  
  export default Matching;