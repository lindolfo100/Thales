document.addEventListener('DOMContentLoaded', () => {
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

    function displayQuestion() {
        questionText.textContent = questions[currentQuestionIndex];
        speak(questions[currentQuestionIndex]);
    }

    function nextQuestion() {
        currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
        displayQuestion();
    }

    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        speechSynthesis.speak(utterance);
    }

    nextQuestionButton.addEventListener('click', nextQuestion);

    // Load character and display first question
    characterImage.src = 'https://via.placeholder.com/300/007BFF/FFFFFF?Text=Personagem'; // Placeholder
    displayQuestion();
});
