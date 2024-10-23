import { Image, StyleSheet, Platform } from 'react-native';
import { Text, SafeAreaView, View, Pressable, Alert, ImageBackground } from 'react-native';
import { SetStateAction, useEffect, useState} from 'react';
import { doc, getDoc, setDoc} from 'firebase/firestore';
import {FIRESTORE_DB, FIREBASE_AUTH } from '../../FirebaseConfig'; //our config file


/*
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
*/

const backgroundImage = require('../../assets/insideRestaurant2.jpg');

const QUESTIONS = [
  {
    question: "What does juevos mean?",
    options: ["egg", "sun", "dog", "house"],
    correctAnswer: "egg",
  },
  {
    question:"What does caballo mean?",
    options: ["sandwich","fish", "eggs", "horse"],
    correctAnswer:"horse",
  }
]


export default function App() {
  const [currentquestionindex, setcurrentquestionindex] = useState(0);
  const [selectedOption, setselectedOption] = useState("");
  const [isCorrect, setisCorrect] = useState(false);
  const [score, setScore] = useState(2)

  //Need these for getting the user id to connect to database
  const auth = FIREBASE_AUTH;
  const user = auth.currentUser;

  const checkAnswer = (pressedOption: string)=>{
    setselectedOption(pressedOption);

    const isAnswerCorrect = QUESTIONS[currentquestionindex].correctAnswer === pressedOption;
    setisCorrect(isAnswerCorrect);

    if(isAnswerCorrect){
      Alert.alert("Correct!");
    } else{
      Alert.alert("Incorrect :(");
      setScore(score - 1);
    }
  }

  const nextQuestion = () =>{
    if(currentquestionindex === QUESTIONS.length - 1){
      setcurrentquestionindex(0);
      if(score > 1){
        if(user){
          const user_id = user.uid;
          const ref = doc(FIRESTORE_DB, "user_data", user_id);
          setDoc(ref, {
              "RestaurantScenario": {stars: 1, unlocked: true},
              "AirportScenario": {stars: 0, unlocked: true}
          }, {merge: true});
        }
      }
      
      return;
    }
    setisCorrect(false);
    setcurrentquestionindex(currentquestionindex + 1);
  }

  

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={backgroundImage} 
        style={styles.imageBackground}
        resizeMode="cover"
      >
      </ImageBackground>
    <View style={styles.overlay}>
      <Text style={styles.question}>{QUESTIONS[currentquestionindex].question}</Text>
      
      {QUESTIONS[currentquestionindex].options.map((option, index) =>(
        //<View style={styles.option}>
        <Pressable key={index} onPress={()=> checkAnswer(option)}>
        <Text style={[styles.option, isCorrect ? styles.correctAnswer:styles.option]}>{option}</Text>
        </Pressable>
        //</View>
      ))}
    

      <Pressable onPress={nextQuestion} style={styles.nextButton}>
        <Text style={styles.buttonText}>Next Question</Text>
      </Pressable>
      

    </View>
    
    
    </SafeAreaView>
    
  );
}


const styles = StyleSheet.create({
  container: {
   flex:1,
   backgroundColor:'black',
   alignItems:'center'
  },
  overlay:{
  paddingVertical:50,
   backgroundColor:'green',
   color:'white',
   position:'absolute',
   bottom:0,
   height:'50%',
   width:'100%',
   justifyContent: 'center',
   borderColor: 'white',
   borderWidth:5,
   borderRadius:25,
  },
  imageBackground: {
    width: '100%',
    height: '75%', 
    resizeMode: 'cover',
  },
  question:{
    color:'white',
    padding:15,
    marginBottom:4,
    marginTop:6,
    fontSize:30,
  },
  option:{
    color:'white',
    borderColor:'white',
    borderBlockColor:'white',
    borderWidth: 3,
    borderRadius:5,
    marginVertical:4,
    marginHorizontal:5,
    fontSize:25,
    paddingLeft:10,
  },
  correctAnswer:{
    borderWidth: 3,
    borderRadius:5,
    marginVertical:4,
    marginHorizontal:5,
    backgroundColor:'chartreuse',
    color:'white',
  },
  nextButton: {
  padding: 10,
  backgroundColor: 'red',
  borderRadius: 5,
  marginTop: 20,
  alignItems: 'center',
  borderColor:'white',
  borderWidth: 3,

},
buttonText: {
  color: 'white',
  fontSize: 18,
},

 
});


/*export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
*/
