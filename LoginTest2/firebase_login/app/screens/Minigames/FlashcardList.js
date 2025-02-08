import React from 'react';
import { View, FlatList, StyleSheet } from "react-native";
import Flashcard from './Flashcard';

export default function FlashcardList({ flashcards }) {
  return (
    <FlatList
      data={flashcards}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <Flashcard flashcard={item} />}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: { 
    alignItems: "center", 
    paddingBottom: 20 
  },
});