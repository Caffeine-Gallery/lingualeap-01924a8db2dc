import { backend } from 'declarations/backend';

const inputText = document.getElementById('inputText');
const languageSelect = document.getElementById('languageSelect');
const translationOutput = document.getElementById('translationOutput');
const speakButton = document.getElementById('speakButton');
const historyList = document.getElementById('historyList');
const clearHistoryButton = document.getElementById('clearHistoryButton');

let currentTranslation = '';

async function translateText() {
    const text = inputText.value;
    const targetLang = languageSelect.value;

    if (text.trim() === '') {
        translationOutput.textContent = '';
        return;
    }

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        currentTranslation = data.responseData.translatedText;
        translationOutput.textContent = currentTranslation;

        // Add translation to history
        await backend.addTranslation(text, currentTranslation, targetLang);
        updateTranslationHistory();
    } catch (error) {
        console.error('Translation error:', error);
        translationOutput.textContent = 'Translation error occurred.';
    }
}

function speakTranslation() {
    if (currentTranslation) {
        const utterance = new SpeechSynthesisUtterance(currentTranslation);
        utterance.lang = languageSelect.value;
        speechSynthesis.speak(utterance);
    }
}

async function updateTranslationHistory() {
    const history = await backend.getTranslationHistory();
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.original} -> ${item.translated} (${item.language})`;
        historyList.appendChild(li);
    });
}

async function clearTranslationHistory() {
    await backend.clearTranslationHistory();
    updateTranslationHistory();
}

inputText.addEventListener('input', translateText);
languageSelect.addEventListener('change', translateText);
speakButton.addEventListener('click', speakTranslation);
clearHistoryButton.addEventListener('click', clearTranslationHistory);

// Initial update of translation history
updateTranslationHistory();
