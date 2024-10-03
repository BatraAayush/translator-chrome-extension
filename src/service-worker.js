async function callMicrosoftTranslator(text, target_lang, source_lang) {
  const API_KEY = "5f40d2685dmshf19ff16ff6fadadp10d2a1jsna689ab42313d";
  const API_URL = "https://microsoft-translator-text.p.rapidapi.com/translate";

  const headers = new Headers();
  headers.append("content-type", "application/json");
  headers.append("x-rapidapi-key", API_KEY);
  headers.append("x-rapidapi-host", "microsoft-translator-text.p.rapidapi.com");

  const body = JSON.stringify([{ text: text }]);
  const queryParams = `?to=${target_lang}&api-version=3.0&profanityAction=NoAction&textType=plain`;

  const options = {
    method: "POST",
    headers: headers,
    body: body,
  };

  try {
    const response = await fetch(API_URL + queryParams, options);
    const json = await response.json();
    if (json.message) {
      return `Microsoft Translator message: ${json.message}`;
    }
    return json[0].translations[0].text;
  } catch (err) {
    return `Microsoft Translator message: ${err.message}`;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { text, from, to } = request;
  callMicrosoftTranslator(text, to, from)
    .then((translation) => {
      sendResponse({ translatedText: translation });
    })
    .catch((error) => {
      console.error("Error in translation:", error);
      sendResponse({
        translatedText: error.message || "Error in translation.",
      });
    });

  return true;
});
