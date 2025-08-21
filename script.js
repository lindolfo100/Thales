document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const startButton = document.getElementById('start-button');
    const nav = document.querySelector('nav');
    const navButtons = document.querySelectorAll('.nav-button');
    const pages = document.querySelectorAll('.page');
    const mainContent = document.querySelector('.main-content');
    const characterContainer = document.getElementById('character-container');
    const chatContainer = document.getElementById('chat-container');
    const characterLottie = document.getElementById('character-lottie');
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
            nextQuestionButton.style.display = 'block';
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
                    setTimeout(nextQuestion, 5000);
                }
            } else {
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

    function loadCharacterAnimation() {
        const animationUrl = "https://assets1.lottiefiles.com/packages/lf20_v4isjbj5.json";
        characterLottie.load(animationUrl);
    }

    function showPage(pageId) {
        pages.forEach(page => {
            page.style.display = page.id === pageId ? 'block' : 'none';
        });
        navButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.page === pageId);
        });
    }

    function startApp() {
        const welcomeMessage = document.querySelector('#welcome-screen h1').textContent + ' ' + document.querySelector('#welcome-screen p').textContent;

        welcomeScreen.style.display = 'none';
        nav.style.display = 'block';
        showPage('chat-page'); // Show chat page by default

        setupSpeechRecognition();
        loadCharacterAnimation();

        speak(welcomeMessage, () => {
            displayQuestion();
        });
    }

    startButton.addEventListener('click', startApp);
    nextQuestionButton.addEventListener('click', nextQuestion);
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            showPage(button.dataset.page);
        });
    });

    const messageCards = document.querySelectorAll('.message-card');
    messageCards.forEach(card => {
        card.addEventListener('click', () => {
            const text = card.querySelector('p').textContent;
            speak(text);
        });
    });

    const scheduleCards = document.querySelectorAll('.schedule-card');
    scheduleCards.forEach(card => {
        card.addEventListener('click', () => {
            const text = card.querySelector('p').textContent;
            speak(text);
        });
    });
});
