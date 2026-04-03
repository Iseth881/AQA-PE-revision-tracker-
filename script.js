let allSubtopics = [];

// Load topics from data.json
async function loadTopics() {
  try {
    const response = await fetch('./data.json');
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

        // Restore saved progress
        if (localStorage.getItem(sub) === 'done') {
          div.classList.add('completed');
        }

        div.addEventListener('click', () => {
          div.classList.toggle('completed');
          if (div.classList.contains('completed')) {
            localStorage.setItem(sub, 'done');
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
  } catch (error) {
    console.error("Error loading topics:", error);
    document.body.innerHTML += "<p style='color:red'>Error loading topics</p>";
  }
}

// Update progress %
function updateProgress() {
  const completed = allSubtopics.filter(t => localStorage.getItem(t) === 'done').length;
  const percent = Math.round((completed / allSubtopics.length) * 100);
  document.getElementById('progress').textContent = `${percent}% complete (${completed}/${allSubtopics.length})`;
}

// Suggest focus area (one incomplete subtopic)
function updateFocus() {
  const incomplete = allSubtopics.filter(t => !localStorage.getItem(t));
  if (incomplete.length === 0) {
    document.getElementById('focus').textContent = "All topics completed 🎉";
  } else {
    const random = incomplete[Math.floor(Math.random() * incomplete.length)];
    document.getElementById('focus').textContent = `Focus on: ${random}`;
  }
}

// Countdown for Paper 1 & Paper 2
function updateCountdown() {
  const paper1Date = new Date("2026-05-15T09:00:00");
  const paper2Date = new Date("2026-05-22T09:00:00");
  const now = new Date();

  function getTimeRemaining(date) {
    const diff = date - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} days`;
  }

  document.getElementById("paper1").textContent = "Paper 1: " + getTimeRemaining(paper1Date);
  document.getElementById("paper2").textContent = "Paper 2: " + getTimeRemaining(paper2Date);
}

// Initialize
loadTopics();
updateCountdown();
setInterval(updateCountdown, 60000);
