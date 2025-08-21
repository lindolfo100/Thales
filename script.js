document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const startButton = document.getElementById('start-button');
    const mainContent = document.querySelector('.main-content');
    const characterContainer = document.getElementById('character-container');
    const chatContainer = document.getElementById('chat-container');
    const characterImage = document.getElementById('character-image');
    const questionText = document.getElementById('question-text');
    const nextQuestionButton = document.getElementById('next-question-button');

    const questions = [
        "Qual é a sua cor favorita?",
        "Qual é o seu animal favorito?",
        "O que você gosta de fazer para se divertir?",
        "Qual é a sua comida favorita?",
        "Você tem um super-herói favorito? Qual é?"
    ];

    let currentQuestionIndex = 0;
    let recognition;

    function setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error("Speech Recognition not available");
            nextQuestionButton.style.display = 'block'; // Show button if recognition is not available
            return;
        }

        recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onend = () => {
            nextQuestion();
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            // In case of error, we can still proceed to the next question or show the button
            nextQuestion();
        };
    }

    function speak(text, callback) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            utterance.onend = callback;
            speechSynthesis.speak(utterance);
        } else {
            console.error("Speech Synthesis not available");
            if (callback) {
                callback();
            }
        }
    }

    function displayQuestion() {
        questionText.textContent = questions[currentQuestionIndex];
        speak(questions[currentQuestionIndex], () => {
            if (recognition) {
                try {
                    recognition.start();
                } catch(e) {
                    console.error("Could not start recognition", e);
                    // If recognition fails to start, move to next question after a delay
                    setTimeout(nextQuestion, 5000);
                }
            } else {
                // If recognition is not set up, show the button
                nextQuestionButton.style.display = 'block';
            }
        });
    }

    function nextQuestion() {
        if (recognition && recognition.recognizing) {
            recognition.stop();
        }
        currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
        displayQuestion();
    }

    function generateCharacterImage() {
        const prompt = "a 3D Disney-style childish character face on a white background";
        const encodedPrompt = encodeURIComponent(prompt);
        const width = 512;
        const height = 512;
        const seed = Math.floor(Math.random() * 100000);
        const nologo = true;
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=${nologo}`;
        characterImage.src = imageUrl;
    }

    function startApp() {
        const welcomeMessage = document.querySelector('#welcome-screen h1').textContent + ' ' + document.querySelector('#welcome-screen p').textContent;

        mainContent.style.display = 'flex';
        characterContainer.style.display = 'block';
        chatContainer.style.display = 'flex';
        welcomeScreen.style.display = 'none';
        nextQuestionButton.style.display = 'none'; // Hide button by default

        setupSpeechRecognition();
        generateCharacterImage();

        speak(welcomeMessage, () => {
            displayQuestion();
        });
    }

    startButton.addEventListener('click', startApp);
    nextQuestionButton.addEventListener('click', nextQuestion);
});
