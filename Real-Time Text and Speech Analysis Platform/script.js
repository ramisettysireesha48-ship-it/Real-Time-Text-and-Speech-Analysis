```javascript
// ===============================
// GET HTML ELEMENTS
// ===============================

const textInput = document.getElementById("textInput");

const wordCount = document.getElementById("wordCount");
const charCount = document.getElementById("charCount");
const sentenceCount = document.getElementById("sentenceCount");

const sentiment = document.getElementById("sentiment");
const keywords = document.getElementById("keywords");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");

const speechStatus = document.getElementById("speechStatus");
const speechResult = document.getElementById("speechResult");


// ===============================
// REAL-TIME TEXT ANALYSIS
// ===============================

textInput.addEventListener("input", function () {

    const text = textInput.value.trim();

    analyzeText(text);

});


// ===============================
// TEXT ANALYSIS FUNCTION
// ===============================

function analyzeText(text) {

    // Character count
    charCount.textContent = text.length;


    // Word count
    if (text.length === 0) {

        wordCount.textContent = 0;

    } else {

        const words = text.split(/\s+/);
        wordCount.textContent = words.length;

    }


    // Sentence count
    if (text.length === 0) {

        sentenceCount.textContent = 0;

    } else {

        const sentences = text
            .split(/[.!?]+/)
            .filter(sentence => sentence.trim().length > 0);

        sentenceCount.textContent = sentences.length;

    }


    // Sentiment analysis
    detectSentiment(text);


    // Keyword analysis
    findKeywords(text);

}


// ===============================
// SENTIMENT ANALYSIS
// ===============================

function detectSentiment(text) {

    const positiveWords = [
        "good",
        "great",
        "happy",
        "excellent",
        "amazing",
        "love",
        "wonderful",
        "fantastic",
        "best",
        "nice",
        "awesome",
        "success",
        "thank",
        "beautiful",
        "enjoy"
    ];


    const negativeWords = [
        "bad",
        "sad",
        "angry",
        "hate",
        "terrible",
        "worst",
        "awful",
        "poor",
        "problem",
        "failure",
        "wrong",
        "disappointed",
        "boring",
        "difficult",
        "error"
    ];


    const words = text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/);


    let positiveScore = 0;
    let negativeScore = 0;


    words.forEach(function (word) {

        if (positiveWords.includes(word)) {
            positiveScore++;
        }

        if (negativeWords.includes(word)) {
            negativeScore++;
        }

    });


    if (positiveScore > negativeScore) {

        sentiment.textContent = "😊 Positive";

    } else if (negativeScore > positiveScore) {

        sentiment.textContent = "😟 Negative";

    } else {

        sentiment.textContent = "😐 Neutral";

    }

}


// ===============================
// KEYWORD EXTRACTION
// ===============================

function findKeywords(text) {

    if (text.length === 0) {

        keywords.innerHTML =
            "<span>Waiting for text...</span>";

        return;

    }


    const stopWords = [
        "the",
        "is",
        "a",
        "an",
        "and",
        "or",
        "to",
        "of",
        "in",
        "on",
        "for",
        "with",
        "this",
        "that",
        "it",
        "i",
        "you",
        "we",
        "are",
        "was",
        "be",
        "my",
        "your",
        "our",
        "from",
        "have",
        "has",
        "had"
    ];


    const words = text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/);


    const frequency = {};


    words.forEach(function (word) {

        if (
            word.length > 3 &&
            !stopWords.includes(word)
        ) {

            if (frequency[word]) {

                frequency[word]++;

            } else {

                frequency[word] = 1;

            }

        }

    });


    const sortedWords = Object.keys(frequency)
        .sort(function (a, b) {
            return frequency[b] - frequency[a];
        })
        .slice(0, 6);


    if (sortedWords.length === 0) {

        keywords.innerHTML =
            "<span>No keywords found</span>";

        return;

    }


    keywords.innerHTML = "";


    sortedWords.forEach(function (word) {

        const tag = document.createElement("span");

        tag.textContent = word;

        keywords.appendChild(tag);

    });

}


// ===============================
// SPEECH RECOGNITION
// ===============================

let recognition;


// Check browser support

if (
    "SpeechRecognition" in window ||
    "webkitSpeechRecognition" in window
) {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    recognition = new SpeechRecognition();


    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang = "en-US";


    recognition.onstart = function () {

        speechStatus.textContent =
            "🎙️ Listening... Speak now";

        speechResult.textContent =
            "Listening";

        startBtn.disabled = true;

    };


    recognition.onresult = function (event) {

        let finalTranscript = "";
        let interimTranscript = "";


        for (
            let i = event.resultIndex;
            i < event.results.length;
            i++
        ) {

            const transcript =
                event.results[i][0].transcript;


            if (event.results[i].isFinal) {

                finalTranscript += transcript + " ";

            } else {

                interimTranscript += transcript;

            }

        }


        if (finalTranscript) {

            textInput.value += finalTranscript;

            analyzeText(textInput.value.trim());

        }


        speechResult.textContent =
            interimTranscript || "Voice detected";

    };


    recognition.onerror = function (event) {

        speechStatus.textContent =
            "Speech error: " + event.error;

        speechResult.textContent =
            "Error";

        startBtn.disabled = false;

    };


    recognition.onend = function () {

        speechStatus.textContent =
            "Microphone is ready";

        speechResult.textContent =
            "Not active";

        startBtn.disabled = false;

    };


} else {

    startBtn.disabled = true;

    speechStatus.textContent =
        "Speech recognition is not supported in this browser.";

}


// ===============================
// START SPEECH
// ===============================

startBtn.addEventListener("click", function () {

    if (recognition) {

        recognition.start();

    }

});


// ===============================
// STOP SPEECH
// ===============================

stopBtn.addEventListener("click", function () {

    if (recognition) {

        recognition.stop();

    }

});


// ===============================
// COPY TEXT
// ===============================

copyBtn.addEventListener("click", function () {

    const text = textInput.value;


    if (text.length === 0) {

        alert("There is no text to copy.");

        return;

    }


    navigator.clipboard.writeText(text);


    copyBtn.textContent = "✓ Copied";


    setTimeout(function () {

        copyBtn.textContent = "📋 Copy";

    }, 1500);

});


// ===============================
// CLEAR TEXT
// ===============================

clearBtn.addEventListener("click", function () {

    textInput.value = "";

    analyzeText("");

    speechResult.textContent = "Not active";

    speechStatus.textContent =
        "Microphone is ready";

});


// ===============================
// INITIAL ANALYSIS
// ===============================

analyzeText("");
```
