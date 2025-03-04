import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

class AudioManager {
  private static backgroundMusic: Audio.Sound | null = null;
  private static buttonSound: Audio.Sound | null = null;
  private static isMusicPlaying = false;

  // Initialize Audio on App Start
  static async initialize() {
    try {
      const musicEnabled = await AsyncStorage.getItem("backgroundMusic");
      const soundEnabled = await AsyncStorage.getItem("buttonSound");

      if (musicEnabled === "true") {
        await this.playBackgroundMusic();
      }
      if (soundEnabled === "true") {
        await this.playButtonSound(); 
      }
    } catch (error) {
      console.error("Error initializing audio settings:", error);
    }
  }

  // Load and Play Background Music
  static async playBackgroundMusic() {
    try {
      const musicEnabled = await AsyncStorage.getItem("backgroundMusic");
      if (musicEnabled === "true") {
        if (!this.isMusicPlaying) {
          if (this.backgroundMusic === null) {
            this.backgroundMusic = new Audio.Sound();
            await this.backgroundMusic.loadAsync(
              require("../../assets/backgroundMusic.mp3"),
              { isLooping: true }
            );
          }
          await this.backgroundMusic.playAsync();
          this.isMusicPlaying = true;
        }
      }
    } catch (error) {
      console.error("Error playing background music:", error);
    }
  }

  // Stop Background Music
  static async stopBackgroundMusic() {
    try {
      if (this.backgroundMusic) {
        await this.backgroundMusic.stopAsync();
        await this.backgroundMusic.unloadAsync();
        this.backgroundMusic = null;
        this.isMusicPlaying = false;
      }
    } catch (error) {
      console.error("Error stopping background music:", error);
    }
  }

  // Load and Play Button Click Sound
  static async playButtonSound() {
    try {
      const soundEnabled = await AsyncStorage.getItem("buttonSound");
      if (soundEnabled === "true") {
        if (this.buttonSound === null) {
          this.buttonSound = new Audio.Sound();
          await this.buttonSound.loadAsync(require("../../assets/click.mp3"));
        }
        await this.buttonSound.replayAsync();
      }
    } catch (error) {
      console.error("Error playing button sound:", error);
    }
  }
}

export default AudioManager;
