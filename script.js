let allSubtopics = [];

async function loadTopics() {
  const response = await fetch('data.json');
  const data = await response.json();
  const container = document.getElementById('topics');

  data.topics.forEach(topic => {
    const topicDiv = document.createElement('div');
    topicDiv.className = 'topic';

    const title = document.createElement('h3');
    title.textContent = topic.name;
    topicDiv.appendChild(title);

    topic.subtopics.forEach(sub => {
      allSubtopics.push(sub);

      const div = document.createElement('div');
      div.className = 'subtopic';
      div.textContent = sub;

      if (localStorage.getItem(sub) === 'done') {
        div.classList.add('completed');
      }

      div.addEventListener('click', () => {
        div.classList.toggle('completed');

        if (div.classList.contains('completed')) {
          localStorage.setItem(sub, 'done');
          updateStreak();
        } else {
          localStorage.removeItem(sub);
        }

        updateProgress();
        updateFocus();
      });

      topicDiv.appendChild(div);
    });

    container.appendChild(topicDiv);
  });

  updateProgress();
  updateFocus();
  updateStreak();
}

// 📊 Progress tracker
function updateProgress() {
  const completed = allSubtopics.filter(
    t => localStorage.getItem(t) === 'done'
  ).length;

  const percent = Math.round((completed / allSubtopics.length) * 100);

  document.getElementById("progress").textContent =
    `${percent}% complete (${completed}/${allSubtopics.length})`;
}

// 🎯 Weak topic detection
function updateFocus() {
  const incomplete = allSubtopics.filter(
    t => !localStorage.getItem(t)
  );

  const random = incomplete[Math.floor(Math.random() * incomplete.length)];

  document.getElementById("focus").textContent =
    incomplete.length > 0
      ? `Focus on: ${random}`
      : "All topics completed 🎉";
}

// 🔥 Streak tracker
function updateStreak() {
  const today = new Date().toDateString();
  const last = localStorage.getItem("lastStudy");

  let streak = parseInt(localStorage.getItem("streak")) || 0;

  if (last !== today) {
    streak += 1;
    localStorage.setItem("streak", streak);
    localStorage.setItem("lastStudy", today);
  }

  document.getElementById("streak").textContent =
    `${streak} day streak`;
}

// 🧠 Quiz generator
const questions = [
  {
    q: "Name the type of joint at the knee.",
    a: "Hinge joint"
  },
  {
    q: "What is the role of the alveoli?",
    a: "Gas exchange"
  },
  {
    q: "Define aerobic exercise.",
    a: "Exercise with oxygen over long duration"
  },
  {
    q: "What does FITT stand for?",
    a: "Frequency, Intensity, Time, Type"
  },
  {
    q: "Name one intrinsic feedback example.",
    a: "Feeling movement internally"
  }
];

function generateQuiz() {
  const q = questions[Math.floor(Math.random() * questions.length)];

  document.getElementById("quiz").innerHTML = `
    <p><strong>${q.q}</strong></p>
    <button onclick="this.nextElementSibling.style.display='block'">
      Show Answer
    </button>
    <p style="display:none">${q.a}</p>
  `;
}

// 📅 Countdown (same as before)
function updateCountdown() {
  const paper1Date = new Date("2026-05-15T09:00:00");
  const paper2Date = new Date("2026-05-22T09:00:00");
  const now = new Date();

  function getTimeRemaining(date) {
    const diff = date - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} days`;
  }

  document.getElementById("paper1").textContent =
    "Paper 1: " + getTimeRemaining(paper1Date);

  document.getElementById("paper2").textContent =
    "Paper 2: " + getTimeRemaining(paper2Date);
}

loadTopics();
updateCountdown();
setInterval(updateCountdown, 60000);
