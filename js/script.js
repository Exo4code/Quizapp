// Variablen für die Quiz-Daten
let correctAnswersCount = 0;
let currentQuestionIndex = 0;
let userAnswers = [];
let questions = [];

// DOM-Elemente
const resultContainer = document.getElementById('result-container');
const resultScore = document.getElementById('result-score');
const resultGrade = document.getElementById('result-grade');
const nextButton = document.getElementById('next-button');
const prevButton = document.getElementById('prev-button');
const navContainer = document.getElementById('question-navigation');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const startButton = document.getElementById('start-button');
const questionContainerElement = document.getElementById('question-container');
const currentCategoryElement = document.getElementById('current-category');
const infoContainer = document.getElementById('info-container');
const quizContainer = document.getElementById('quiz-container');
const startContainer = document.getElementById('start-container');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');



// Fisher-Yates Shuffle-Algorithmus
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Mischen der Fragen und Antworten
function shuffleQuestionsAndAnswers(questions) {
    console.log('Vor dem Mischen:', JSON.stringify(questions));
    shuffle(questions);
    questions.forEach(question => shuffle(question.answers));
    console.log('Nach dem Mischen:', JSON.stringify(questions));
}

// Bewertet das Ergebnis und zeigt die Note und eine Nachricht an
function evaluateResult() {
    const score = Math.min((correctAnswersCount / questions.length) * 100, 100);
    let grade, note, message;

    if (score >= 90) {
        grade = 'Sehr Gut';
        note = 1;
        message = "Spitze! Das war echt klasse!";
    } else if (score >= 80) {
        grade = 'Gut';
        note = 2;
        message = "Super gemacht! Fast perfekt!";
    } else if (score >= 60) {
        grade = 'Befriedigend';
        note = 3;
        message = "Gut dabei! Noch ein bisschen mehr und du bist top!";
    } else if (score >= 40) {
        grade = 'Ausreichend';
        note = 4;
        message = "Du schaffst das! Ein bisschen mehr Mühe und es wird!";
    } else if (score >= 20) {
        grade = 'Mangelhaft';
        note = 5;
        message = "Nicht schlecht, da geht aber noch mehr!";
    } else {
        grade = 'Ungenügend';
        note = 6;
        message = "Kopf hoch! Aller Anfang ist schwer, aber du packst das!";
    }

    resultScore.innerText = `Ergebnis: ${score.toFixed(2)}%`;
    resultGrade.innerHTML = `Note: ${note} (${grade})<br><br><em>${message}</em>`;
}

// Zeigt die nächste Frage an oder das Ergebnis
nextButton.addEventListener('click', () => {
    console.log(`Next button clicked, currentQuestionIndex: ${currentQuestionIndex}`);
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        console.log(`Showing question index: ${currentQuestionIndex}`);
        showQuestion(questions[currentQuestionIndex]);
    } else {
        evaluateResult();
        questionContainerElement.style.display = 'none';
        navContainer.style.display = 'none';
        resultContainer.style.display = 'block';
    }
    updateQuestionCounter();
});

// Zeigt die vorherige Frage an
prevButton.addEventListener('click', () => {
    console.log(`Prev button clicked, currentQuestionIndex: ${currentQuestionIndex}`);
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        console.log(`Showing question index: ${currentQuestionIndex}`);
        showQuestion(questions[currentQuestionIndex]);
    }
    updateQuestionCounter();
});


// Zeigt die aktuelle Frage und die Antwortmöglichkeiten an
function showQuestion(question) {
        if (!question) {
            console.error('Keine Frage verfügbar');
            return;
        }
    console.log(`Showing question: ${question.question}`);
    questionElement.innerText = question.question;
    answerButtonsElement.innerHTML = '';

    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        button.dataset.index = index;
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }

        if (userAnswers[currentQuestionIndex] !== undefined && userAnswers[currentQuestionIndex].index === index) {
            button.classList.add(userAnswers[currentQuestionIndex].correct ? 'correct' : 'wrong');
            button.disabled = true;
        }

        console.log('Button added with answer: ', answer.text);
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });

    if (currentQuestionIndex === 0) {
        prevButton.style.display = 'none';
    } else {
        prevButton.style.display = 'inline-block';
    }

    if (currentQuestionIndex === questions.length - 1) {
        nextButton.innerText = 'Ergebnisse anzeigen';
    } else {
        nextButton.innerText = 'Nächste Frage';
    }

    navContainer.style.display = 'block';
    updateQuestionCounter(); // Aktualisiere den Fragenzähler
}

// Handhabt die Auswahl einer Antwort, wertet sie aus und speichert sie
function selectAnswer(e) {
    console.log("Button clicked");
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    const index = parseInt(selectedButton.dataset.index);
    const currentCategory = currentCategoryElement.textContent;

    // Überprüfen, ob die Frage bereits zweimal beantwortet wurde
    if (userAnswers[currentQuestionIndex] && userAnswers[currentQuestionIndex].attempts >= 2) {
        return; // Beendet die Funktion, falls die Antwort bereits zweimal geändert wurde
    }

    if (userAnswers[currentQuestionIndex]) {
        // Wenn die Antwort falsch war und die neue Antwort richtig ist
        if (!userAnswers[currentQuestionIndex].correct && correct) {
            correctAnswersCount++; // Zähle eine richtige Antwort dazu
        }
        // Wenn die Antwort richtig war und die neue Antwort falsch ist
        else if (userAnswers[currentQuestionIndex].correct && !correct) {
            correctAnswersCount--; // Ziehe eine richtige Antwort ab
        }

        userAnswers[currentQuestionIndex].index = index; // Aktualisiere den Index der Antwort
        userAnswers[currentQuestionIndex].correct = correct; // Aktualisiere, ob die Antwort korrekt ist
        userAnswers[currentQuestionIndex].attempts++; // Erhöhe den Zähler der Versuche
    } else {
        userAnswers[currentQuestionIndex] = { index: index, correct: correct, attempts: 1 };
        if (correct) {
            correctAnswersCount++; // Zähle eine richtige Antwort dazu
        }
    }

    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === 'true') {
            button.classList.add('correct');
        } else {
            button.classList.add('wrong');
        }
        button.disabled = true; // Deaktiviert alle Buttons nach der Auswahl
    });

    navContainer.style.display = 'block';
}

// Startet das Spiel und zeigt die erste Frage
function startGame() {
    startButton.style.display = 'none';
    questionContainerElement.style.display = 'block';
    navContainer.style.display = 'none';
    resultContainer.style.display = 'none';
    correctAnswersCount = 0;
    currentQuestionIndex = 0;
    userAnswers = [];
    shuffleQuestionsAndAnswers(questions);
    showQuestion(questions[currentQuestionIndex]);
    updateQuestionCounter(); // Aktualisiere den Fragenzähler
}

// Logik zum Anzeigen und Laden der Kategorie-Dateien
document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.getElementById('burger-menu');
    const navLinks = document.getElementById('nav-links');
    const infoContainer = document.getElementById('info-container');
    const quizContainer = document.getElementById('quiz-container');

    burgerMenu.addEventListener('click', function() {
        navLinks.classList.toggle('show');
    });

// Logik für das Anzeigen des Info-Containers je nach Lernfeld
document.addEventListener('DOMContentLoaded', function() {
    const lernfeldLinks = document.querySelectorAll('.lernfeld-link');
    const categoryLinks = document.querySelectorAll('.category-link');
    const infoContainer = document.getElementById('info-container');
    const quizContainer = document.getElementById('quiz-container');
    const startContainer = document.getElementById('start-container');

    lernfeldLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const lernfeld = this.dataset.lernfeld;

            // Zeigt den Info-Container für alle Lernfelder an
            infoContainer.style.display = 'block';
            quizContainer.style.display = 'none';
            startContainer.style.display = 'none';
            
            // Lädt die entsprechende Lernfeld-Datei dynamisch
            loadLernfeldContent(lernfeld);

            navLinks.classList.remove('show'); // Dropdown-Menü schließen
        });
    });

        // Zeigt den Info-Container nur für die Lernfelder 1 bis 5 an
        if (["1", "2", "3", "4", "5"].includes(lernfeld)) {
            infoContainer.style.display = 'block';
            quizContainer.style.display = 'none';
            startContainer.style.display = 'none'; // Versteckt den Start-Container, falls sichtbar
            navLinks.classList.remove('show'); // Dropdown-Menü schließen
        }
    });
});


    // Logik für das dynamisches Laden der Fragen-Dateien und Start des Quiz
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const file = this.dataset.file;
            const categoryText = this.textContent; // Extrahiere den Text der Kategorie

            // Setze den Kategorienamen im Category Counter
            currentCategoryElement.textContent = categoryText;

            // Dynamisch das entsprechende JS-File laden
            const script = document.createElement('script');
            script.src = `/json/${file}`;
            script.onload = function() {
                infoContainer.style.display = 'none';
                startContainer.style.display = 'block'; // Zeigt den "Test beginnen"-Button an
                quizContainer.style.display = 'none'; // Versteckt den Quiz-Container
            };
            document.body.appendChild(script);
            navLinks.classList.remove('show'); // Dropdown-Menü schließen
        });
    });
    
// Event-Listener für den Start-Quiz-Button
document.addEventListener('DOMContentLoaded', function() {
    const startQuizButton = document.getElementById('start-quiz-button');
    const startContainer = document.getElementById('start-container');
    const quizContainer = document.getElementById('quiz-container');
    const infoContainer = document.getElementById('info-container');

    startQuizButton.addEventListener('click', function() {
        startContainer.style.display = 'none';
        quizContainer.style.display = 'block';
        startGame();
    });
});

// Funktion zum Laden einer JSON-Datei (synchron)
function loadJSON(file) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `/json/${file}`, false);
    xhr.send();
    if (xhr.status === 200) {
        return JSON.parse(xhr.responseText);
    } else {
        console.error('Fehler beim Laden der JSON-Datei:', xhr.status);
        return null;
    }
}

// Funktion zum Laden einer JSON-Datei (asynchron, mit Callback)
function loadJSON(file, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `/json/${file}`, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        } else {
            callback(null);
        }
    };
    xhr.send();
}

// Überprüft und zeigt Quiz-Set-Buttons an
function checkAndDisplayQuizSetButtons(categoryNumber) {
    const quizSetButtons = document.querySelectorAll('.quiz-set-button');
    quizSetButtons.forEach(button => {
        const selectedSet = button.dataset.set;
        const key = `${categoryNumber}_${selectedSet}`;
        const file = `${categoryNumber.replace(/\./g, '_')}.json`;

        loadJSON(file, function(data) {
            if (data && data[key]) {
                button.style.display = 'inline-block';
            } else {
                button.style.display = 'none';
            }
        });
    });
}

// Event-Listener für die Auswahl der Quiz-Sets
document.querySelectorAll('.category-link').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const file = this.dataset.file;
        const categoryText = this.textContent;

        currentCategoryElement.textContent = categoryText;

        const categoryNumber = categoryText.split(' ')[0];
        checkAndDisplayQuizSetButtons(categoryNumber);

        infoContainer.style.display = 'none';
        startContainer.style.display = 'block';
        quizContainer.style.display = 'none';
    });
});

// Event-Listener für die Quiz-Set-Buttons
const quizSetButtons = document.querySelectorAll('.quiz-set-button');
quizSetButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        const selectedSet = this.dataset.set;
        const currentCategory = currentCategoryElement.textContent;
        const categoryNumber = currentCategory.split(' ')[0];
        const key = `${categoryNumber}_${selectedSet}`;
        const file = `${categoryNumber.replace(/\./g, '_')}.json`;

        loadJSON(file, function(data) {
            if (data && data[key]) {
                questions = data[key];
                infoContainer.style.display = 'none';
                startContainer.style.display = 'none';
                quizContainer.style.display = 'block';
                startGame();
            } else {
                console.error(`Fragenblock ${key} nicht gefunden.`);
                alert(`Fehler beim Laden der Fragen. Bitte versuchen Sie es später erneut.`);
            }
        });
    });
});

// Funktion zum Aktualisieren des Fragenzählers
function updateQuestionCounter() {
    if (questions.length > 0) {
        currentQuestionElement.textContent = currentQuestionIndex + 1;
        totalQuestionsElement.textContent = questions.length;
        document.querySelector('.question-counter').style.display = 'block';
    } else {
        document.querySelector('.question-counter').style.display = 'none';
    }
}

// Event-Listener für den Start-Button
startButton.addEventListener('click', startGame);
