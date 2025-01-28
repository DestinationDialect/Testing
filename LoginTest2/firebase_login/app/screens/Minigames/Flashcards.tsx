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
  
  
  import styles from "../Styles";
  
  const Flashcards = () => {
    const navigation = useNavigation();
  
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
      </ImageBackground>
    );
  };
  
  export default Flashcards;