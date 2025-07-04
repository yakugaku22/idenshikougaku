let quizData;
let allData;
let currentIndex = 0;
let score = 0;
let answered = false;
let wrongAnswers = [];
let isReviewMode = false;
let currentFile = "";
let selectedAnswers = [];

function startQuiz() {
  const selected = document.getElementById('quiz-select').value;
  currentFile = selected;
  score = 0;
  currentIndex = 0;
  answered = false;
  isReviewMode = false;
  wrongAnswers = [];
  document.getElementById('mode-select').classList.add('hidden');
  document.getElementById('quiz-area').classList.remove('hidden');
  document.getElementById('result').classList.add('hidden');
  document.getElementById('restart-btn').classList.add('hidden');
  document.getElementById('review-btn').classList.add('hidden');
  document.getElementById('feedback').textContent = "";

  fetch(currentFile)
    .then(res => res.json())
    .then(data => {
      allData = data;
      quizData = [...allData];
      if (!quizData.length) {
        alert("問題データが空です。JSONの読み込みに失敗している可能性があります。");
        return;
      }
      shuffleArray(quizData);
      showQuestion();
    })
    .catch(err => {
      console.error("JSON読み込みエラー:", err);
      alert("問題の読み込みに失敗しました。ファイル名または構文を確認してください。");
    });
}

function showQuestion() {
  const quiz = quizData[currentIndex];
  if (!quiz) return;

  selectedAnswers = [];
  answered = false;

  const questionElem = document.getElementById('question');
  const optionsDiv = document.getElementById('options');
  const imageElem = document.getElementById('structure-img');

  questionElem.textContent = `Q${currentIndex + 1}. ${quiz.question}`;
  document.getElementById('progress').textContent = `(${currentIndex + 1} / ${quizData.length})`;
  optionsDiv.innerHTML = '';
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = '';

  if (quiz.image) {
    imageElem.src = quiz.image;
    imageElem.classList.remove('hidden');
  } else {
    imageElem.classList.add('hidden');
  }

  const correctAnswers = Array.isArray(quiz.answer) ? quiz.answer : [quiz.answer];
  const options = [...quiz.choices];

  options.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.onclick = () => {
      if (answered) return;

      if (selectedAnswers.includes(option)) return;

      if (!correctAnswers.includes(option)) {
        document.getElementById('feedback').textContent = `不正解... 正解は：${correctAnswers.join(" / ")}`;
        document.getElementById('feedback').className = "incorrect";
        btn.classList.add("selected-wrong");
        answered = true;
        wrongAnswers.push(quiz);
        disableAllButtons();
        return;
      }

      selectedAnswers.push(option);
      btn.classList.add("selected-answer");
      btn.disabled = true;

      const allCorrectSelected = correctAnswers.every(ans => selectedAnswers.includes(ans));
      if (allCorrectSelected) {
        document.getElementById('feedback').textContent = "正解！";
        document.getElementById('feedback').className = "correct";
        score++;
        answered = true;
        disableAllButtons();
      }
    };
    optionsDiv.appendChild(btn);
  });
}

function disableAllButtons() {
  const buttons = document.getElementById('options').querySelectorAll('button');
  buttons.forEach(b => b.disabled = true);
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < quizData.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function pauseQuiz() {
  document.getElementById('quiz-area').classList.add('hidden');
  document.getElementById('mode-select').classList.remove('hidden');
  document.getElementById('result').classList.remove('hidden');
  document.getElementById('result').textContent = `途中中断：${currentIndex}問中${score}問正解でした。`;
}

function showResult() {
  document.getElementById('quiz-area').classList.add('hidden');
  document.getElementById('result').classList.remove('hidden');
  document.getElementById('restart-btn').classList.remove('hidden');
  document.getElementById('review-btn').classList.toggle('hidden', wrongAnswers.length === 0);
  document.getElementById('result').textContent = `${quizData.length}問中${score}問正解でした。お疲れさま！`;
}

function goToStart() {
  quizData = [...allData];
  currentIndex = 0;
  score = 0;
  answered = false;
  wrongAnswers = [];
  isReviewMode = false;
  document.getElementById('mode-select').classList.remove('hidden');
  document.getElementById('result').classList.add('hidden');
  document.getElementById('restart-btn').classList.add('hidden');
  document.getElementById('review-btn').classList.add('hidden');
  document.getElementById('quiz-area').classList.add('hidden');
  document.getElementById('feedback').textContent = '';
}

function startReview() {
  if (wrongAnswers.length === 0) return;
  quizData = [...wrongAnswers];
  currentIndex = 0;
  score = 0;
  answered = false;
  isReviewMode = true;
  wrongAnswers = [];
  document.getElementById('result').classList.add('hidden');
  document.getElementById('restart-btn').classList.add('hidden');
  document.getElementById('review-btn').classList.add('hidden');
  document.getElementById('quiz-area').classList.remove('hidden');
  document.getElementById('feedback').textContent = '';
  showQuestion();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

  
