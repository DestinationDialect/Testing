const cloudTranslationConfig = {
    key: "AIzaSyBDwY92NFxvYEjzwRU3zqLy-cy-IFGRM4o",
    projectId: "axial-matter-449315-i9",
  };
  
  export const translateText = async (text, targetLanguage) => {
    const url = "https://translation.googleapis.com/language/translate/v2?key=${cloudTranslationConfig.key}";
    const body = JSON.stringify({
      q: text,
      target: targetLanguage,
      source: "es",
    });
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        return data.data.translations[0].translatedText;
      } else {
        console.error("Error translating text:", data.error);
        throw new Error(data.error.message);
      }
    } catch (error) {
      console.error("Error with translation request:", error);
      throw error;
    }
  };