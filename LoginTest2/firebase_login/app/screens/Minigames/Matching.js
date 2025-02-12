import {
    Text,
    TouchableOpacity,
    ImageBackground,
    Image,
    View,
    FlatList,
    Pressable,
  } from "react-native";
  import { useNavigation } from "@react-navigation/native";
  import React, { useState, useEffect } from 'react';
import {
	 Button, StyleSheet,
	 Animated, Easing
} from 'react-native';
  
  import styles from "../Styles";


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
      <ImageBackground
        source={require("../../../assets/homeScreen.png")}
        resizeMode="cover"
        style={styles.imgBackground}
      >
        <Pressable onPress={() => navigation.goBack()}>
            <Image
              style={styles.backButtonIcon}
              source={require("../../../assets/backArrow.png")}
            />
          </Pressable>
      <View style={styles2.container}>
			<Text style={styles2.header1}>Memory Pair Game</Text>
			<Text style={styles2.matchText}>{msg}</Text>
			{gameWon ? (
				<View style={styles2.winMessage}>
					<View style={styles2.winMessageContent}>
						<Text style={styles2.winText}>Congratulations! You Won!</Text>
					</View>
					<Button
						title="Restart"
						onPress={() => {
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
							style={[styles2.card, card.isFlipped && styles2.cardFlipped]}
							onPress={() => cardClickFunction(card)}
						>
							{card.isFlipped ? (
								<Text style={styles2.cardText}>{card.symbol}</Text>
							) : null}
						</TouchableOpacity>
					))}
				</View>
			)}
		</View>
      </ImageBackground>
    );
  };

  const styles2 = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
    },
    header1: {
      fontSize: 36,
      marginBottom: 10,
      color: 'green',
    },
    matchText: {
      fontSize: 18,
      color: 'black',
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    card: {
      width: 80,
      height: 80,
      margin: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFD700',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'black',
    },
    cardFlipped: {
      backgroundColor: 'white',
    },
    cardText: {
      fontSize: 24,
      color: 'blue',
      fontWeight: 'bold',
    },
    winMessage: {
      position: 'absolute',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    winText: {
      fontSize: 36,
      color: 'white',
    },
  });
  
  export default Matching;