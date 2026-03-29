/* ==================================================
   NEET PREP WEBSITE - Complete JavaScript
   Made with love for someone special
   ================================================== */

// ==================== DOM READY ====================
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroParticles();
  initDaysCounter();
  initPlanner();
  initSubjectTabs();
  initAccordions();
  initTimer();
  initProgress();
  initQuotes();
  initPersonalMessages();
  initSurprise();
  initBackToTop();
  initScrollAnimations();
});

// ==================== NAVBAR ====================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');

  // Scroll effect - add shadow on scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile menu on link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          allNavLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  });
}

// ==================== HERO PARTICLES ====================
function initHeroParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  // Create floating particles (hearts and circles)
  const symbols = ['\u2665', '\u2764', '\u2661', '\u2726', '\u2022'];
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    particle.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      font-size: ${Math.random() * 20 + 10}px;
      opacity: ${Math.random() * 0.3 + 0.1};
      animation-delay: ${Math.random() * 6}s;
      animation-duration: ${Math.random() * 4 + 4}s;
      color: rgba(255, 255, 255, ${Math.random() * 0.4 + 0.1});
    `;
    container.appendChild(particle);
  }
}

// ==================== DAYS COUNTER ====================
// Shows how many days since a start date (you can customize this)
function initDaysCounter() {
  const statDays = document.getElementById('statDays');
  if (!statDays) return;

  // Set your special date here (when you started dating or any meaningful date)
  const startDate = new Date('2024-01-01');
  const today = new Date();
  const diff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

  // Animate the counter
  let count = 0;
  const increment = Math.ceil(diff / 60);
  const timer = setInterval(() => {
    count += increment;
    if (count >= diff) {
      count = diff;
      clearInterval(timer);
    }
    statDays.textContent = count;
  }, 30);
}

// ==================== DAILY STUDY PLANNER ====================
function initPlanner() {
  const taskInput = document.getElementById('taskInput');
  const taskSubject = document.getElementById('taskSubject');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const tasksList = document.getElementById('tasksList');
  const tasksCount = document.getElementById('tasksCount');
  const clearCompletedBtn = document.getElementById('clearCompletedBtn');

  // Load tasks from localStorage
  let tasks = JSON.parse(localStorage.getItem('neet-tasks') || '[]');

  // Check if tasks are from today, otherwise clear them
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem('neet-tasks-date');
  if (savedDate !== today) {
    // Save yesterday's completed count for weekly view before clearing
    saveWeeklyData(tasks);
    tasks = [];
    localStorage.setItem('neet-tasks-date', today);
  }

  renderTasks();
  initWeeklyBars();

  // Add task
  addTaskBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({
      id: Date.now(),
      text: text,
      subject: taskSubject.value,
      completed: false
    });

    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
  }

  function renderTasks() {
    if (tasks.length === 0) {
      tasksList.innerHTML = '<li class="empty-tasks">No tasks yet. Add some above! You can do this!</li>';
    } else {
      tasksList.innerHTML = tasks.map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} />
          <span class="task-text">${escapeHtml(task.text)}</span>
          <span class="task-subject-tag tag-${task.subject}">${task.subject}</span>
          <button class="task-delete" title="Delete task">&times;</button>
        </li>
      `).join('');

      // Add event listeners
      tasksList.querySelectorAll('.task-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => {
          const id = parseInt(e.target.closest('.task-item').dataset.id);
          const task = tasks.find(t => t.id === id);
          if (task) {
            task.completed = e.target.checked;
            saveTasks();
            renderTasks();
          }
        });
      });

      tasksList.querySelectorAll('.task-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = parseInt(e.target.closest('.task-item').dataset.id);
          tasks = tasks.filter(t => t.id !== id);
          saveTasks();
          renderTasks();
        });
      });
    }

    // Update count
    const completed = tasks.filter(t => t.completed).length;
    tasksCount.textContent = `${completed} / ${tasks.length}`;
  }

  function saveTasks() {
    localStorage.setItem('neet-tasks', JSON.stringify(tasks));
    localStorage.setItem('neet-tasks-date', new Date().toDateString());
  }

  // Clear completed tasks
  clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
  });

  // Save weekly data for the bar chart
  function saveWeeklyData(oldTasks) {
    const weeklyData = JSON.parse(localStorage.getItem('neet-weekly') || '{}');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const key = yesterday.toDateString();
    weeklyData[key] = oldTasks.filter(t => t.completed).length;

    // Keep only last 7 days
    const keys = Object.keys(weeklyData);
    if (keys.length > 7) {
      keys.sort((a, b) => new Date(a) - new Date(b));
      keys.slice(0, keys.length - 7).forEach(k => delete weeklyData[k]);
    }

    localStorage.setItem('neet-weekly', JSON.stringify(weeklyData));
  }
}

// ==================== WEEKLY BARS ====================
function initWeeklyBars() {
  const container = document.getElementById('weeklyBars');
  if (!container) return;

  const weeklyData = JSON.parse(localStorage.getItem('neet-weekly') || '{}');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIndex = new Date().getDay();

  container.innerHTML = '';

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = date.toDateString();
    const dayName = days[date.getDay()];
    const isToday = i === 0;

    // For today, count current tasks
    let count = 0;
    if (isToday) {
      const tasks = JSON.parse(localStorage.getItem('neet-tasks') || '[]');
      count = tasks.filter(t => t.completed).length;
    } else {
      count = weeklyData[key] || 0;
    }

    const maxHeight = 100;
    const height = Math.min(count * 15, maxHeight);

    const bar = document.createElement('div');
    bar.className = 'weekly-bar';
    bar.innerHTML = `
      <div class="bar-fill ${isToday ? 'today' : ''}" style="height: ${height}px;"></div>
      <span class="bar-count">${count}</span>
      <span class="bar-day ${isToday ? 'today-label' : ''}">${isToday ? 'Today' : dayName}</span>
    `;
    container.appendChild(bar);
  }
}

// ==================== SUBJECT TABS ====================
function initSubjectTabs() {
  const tabs = document.querySelectorAll('.subject-tab');
  const contents = document.querySelectorAll('.subject-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const subject = tab.dataset.subject;

      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show corresponding content
      contents.forEach(c => c.classList.remove('active'));
      document.getElementById(`${subject}-content`).classList.add('active');
    });
  });
}

// ==================== ACCORDIONS ====================
function initAccordions() {
  const headers = document.querySelectorAll('.accordion-header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('open');

      // Close all accordions in same parent
      item.parentElement.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('open');
      });

      // Toggle clicked one
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

// ==================== POMODORO TIMER ====================
function initTimer() {
  const display = document.getElementById('timerDisplay');
  const label = document.getElementById('timerLabel');
  const startBtn = document.getElementById('timerStartBtn');
  const resetBtn = document.getElementById('timerResetBtn');
  const circle = document.getElementById('timerCircle');
  const sessionCount = document.getElementById('sessionCount');
  const sessionHearts = document.getElementById('sessionHearts');
  const modeBtns = document.querySelectorAll('.timer-mode');

  let totalSeconds = 25 * 60;
  let remainingSeconds = totalSeconds;
  let timerInterval = null;
  let isRunning = false;
  let sessions = parseInt(localStorage.getItem('neet-sessions') || '0');

  // Check if sessions are from today
  const sessionDate = localStorage.getItem('neet-session-date');
  if (sessionDate !== new Date().toDateString()) {
    sessions = 0;
    localStorage.setItem('neet-sessions', '0');
    localStorage.setItem('neet-session-date', new Date().toDateString());
  }

  updateSessionDisplay();

  // Circle circumference
  const circumference = 2 * Math.PI * 90; // radius = 90
  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = 0;

  // Mode buttons
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isRunning) return; // Don't switch while running

      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const minutes = parseInt(btn.dataset.minutes);
      totalSeconds = minutes * 60;
      remainingSeconds = totalSeconds;

      // Update label
      if (minutes === 25) label.textContent = 'Focus Time';
      else if (minutes === 5) label.textContent = 'Short Break';
      else label.textContent = 'Long Break';

      updateDisplay();
      updateCircle();
    });
  });

  // Start / Pause
  startBtn.addEventListener('click', () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  // Reset
  resetBtn.addEventListener('click', () => {
    pauseTimer();
    remainingSeconds = totalSeconds;
    updateDisplay();
    updateCircle();
  });

  function startTimer() {
    isRunning = true;
    startBtn.textContent = 'Pause';
    startBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';

    timerInterval = setInterval(() => {
      remainingSeconds--;

      if (remainingSeconds <= 0) {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.textContent = 'Start';
        startBtn.style.background = '';
        remainingSeconds = 0;

        // Session complete
        const activeMode = document.querySelector('.timer-mode.active');
        if (activeMode && activeMode.dataset.minutes === '25') {
          sessions++;
          localStorage.setItem('neet-sessions', sessions.toString());
          localStorage.setItem('neet-session-date', new Date().toDateString());
          updateSessionDisplay();
        }

        // Alert with sweet message
        showTimerComplete();
      }

      updateDisplay();
      updateCircle();
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.textContent = 'Start';
    startBtn.style.background = '';
  }

  function updateDisplay() {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function updateCircle() {
    const progress = remainingSeconds / totalSeconds;
    const offset = circumference * (1 - progress);
    circle.style.strokeDashoffset = offset;
  }

  function updateSessionDisplay() {
    sessionCount.textContent = sessions;
    sessionHearts.textContent = ' ' + '\u2665'.repeat(Math.min(sessions, 10));
  }

  function showTimerComplete() {
    const messages = [
      "Great job, baby! You're one step closer to your dream!",
      "Session done! You're absolutely crushing it!",
      "Time for a break! You deserve it, superstar!",
      "Another session conquered! So proud of you!",
      "You're unstoppable! Take a breather now."
    ];
    const msg = messages[Math.floor(Math.random() * messages.length)];

    // Try to play a notification sound (browsers may block this)
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;
      oscillator.start();
      setTimeout(() => {
        oscillator.frequency.value = 1000;
        setTimeout(() => {
          oscillator.frequency.value = 1200;
          setTimeout(() => oscillator.stop(), 200);
        }, 200);
      }, 200);
    } catch (e) {
      // Audio not supported, that's fine
    }

    alert(msg);
  }
}

// ==================== PROGRESS TRACKER ====================
function initProgress() {
  const checkboxes = document.querySelectorAll('.chapter-check');
  const overallCircle = document.getElementById('overallCircle');
  const overallPercent = document.getElementById('overallPercent');
  const physicsFill = document.getElementById('physicsFill');
  const chemistryFill = document.getElementById('chemistryFill');
  const biologyFill = document.getElementById('biologyFill');
  const physicsPercent = document.getElementById('physicsPercent');
  const chemistryPercent = document.getElementById('chemistryPercent');
  const biologyPercent = document.getElementById('biologyPercent');

  // Load saved progress
  const savedProgress = JSON.parse(localStorage.getItem('neet-progress') || '{}');

  // Apply saved state to checkboxes
  checkboxes.forEach((cb, index) => {
    if (savedProgress[index]) {
      cb.checked = true;
    }

    cb.addEventListener('change', () => {
      savedProgress[index] = cb.checked;
      localStorage.setItem('neet-progress', JSON.stringify(savedProgress));
      updateProgressBars();
    });
  });

  // Checklist tabs
  const checklistTabs = document.querySelectorAll('.checklist-tab');
  const checklistContents = document.querySelectorAll('.checklist-content');

  checklistTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      checklistTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      checklistContents.forEach(c => c.classList.remove('active'));
      document.getElementById(tab.dataset.target).classList.add('active');
    });
  });

  updateProgressBars();

  function updateProgressBars() {
    // Count by subject
    const subjects = { physics: { total: 0, done: 0 }, chemistry: { total: 0, done: 0 }, biology: { total: 0, done: 0 } };

    checkboxes.forEach(cb => {
      const subject = cb.dataset.subject;
      if (subjects[subject]) {
        subjects[subject].total++;
        if (cb.checked) subjects[subject].done++;
      }
    });

    // Calculate percentages
    const physPct = subjects.physics.total ? Math.round((subjects.physics.done / subjects.physics.total) * 100) : 0;
    const chemPct = subjects.chemistry.total ? Math.round((subjects.chemistry.done / subjects.chemistry.total) * 100) : 0;
    const bioPct = subjects.biology.total ? Math.round((subjects.biology.done / subjects.biology.total) * 100) : 0;

    const totalDone = subjects.physics.done + subjects.chemistry.done + subjects.biology.done;
    const totalAll = subjects.physics.total + subjects.chemistry.total + subjects.biology.total;
    const overallPct = totalAll ? Math.round((totalDone / totalAll) * 100) : 0;

    // Update bars
    physicsFill.style.width = physPct + '%';
    chemistryFill.style.width = chemPct + '%';
    biologyFill.style.width = bioPct + '%';

    physicsPercent.textContent = physPct + '%';
    chemistryPercent.textContent = chemPct + '%';
    biologyPercent.textContent = bioPct + '%';

    // Update overall circular progress
    overallPercent.textContent = overallPct + '%';
    const circumference = 2 * Math.PI * 70; // radius = 70
    const offset = circumference * (1 - overallPct / 100);
    overallCircle.style.strokeDashoffset = offset;
  }
}

// ==================== MOTIVATIONAL QUOTES ====================
function initQuotes() {
  const quoteText = document.getElementById('quoteText');
  const quoteAuthor = document.getElementById('quoteAuthor');
  const newQuoteBtn = document.getElementById('newQuoteBtn');

  const quotes = [
    // -- Discipline & Consistency --
    { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
    { text: "It's not about being the best. It's about being better than you were yesterday.", author: "NEET Mantra" },
    { text: "Small daily improvements are the key to staggering long-term results.", author: "NEET Mantra" },
    { text: "Champions don't show up to get everything they want. They show up every day even when they don't.", author: "NEET Mantra" },
    { text: "You don't need motivation every day. You need discipline every day.", author: "NEET Mantra" },
    { text: "The difference between a 600 and a 700 score is what you do when you don't feel like studying.", author: "NEET Mantra" },

    // -- Hard Work & Sacrifice --
    { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
    { text: "There are no shortcuts to any place worth going.", author: "Beverly Sills" },
    { text: "Sacrifice today what others won't, so tomorrow you can live like others can't.", author: "NEET Mantra" },
    { text: "NCERT 10 times > any shortcut. Master the basics, crack the exam.", author: "NEET Mantra" },
    { text: "The pain of discipline weighs ounces. The pain of regret weighs tons.", author: "Jim Rohn" },
    { text: "One year of focused, honest hard work can change the next 30 years of your life.", author: "NEET Mantra" },

    // -- Focus & Time Management --
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Focus on the process, not the pressure. Results will follow.", author: "NEET Mantra" },
    { text: "Every hour wasted today is a mark lost tomorrow. Study now.", author: "NEET Mantra" },
    { text: "Put the phone down. Open the book. Your future self will thank you.", author: "NEET Mantra" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "You have the same 24 hours as every NEET topper. How you use them decides everything.", author: "NEET Mantra" },

    // -- Success & Goals --
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "A goal without a plan is just a wish. Plan your syllabus. Execute it daily.", author: "Antoine de Saint-Exupery" },
    { text: "Your rank is being decided right now \u2014 in this very hour of study.", author: "NEET Mantra" },
    { text: "Toppers are not born. They are made \u2014 one solved question at a time.", author: "NEET Mantra" },

    // -- NEET Specific --
    { text: "720 marks. 180 questions. One dream. Infinite effort. Start now.", author: "NEET Mantra" },
    { text: "Biology won't memorize itself. Chemistry won't balance itself. Physics won't solve itself. Get to work.", author: "NEET Mantra" },
    { text: "Every NCERT line you read is one step closer to that MBBS seat.", author: "NEET Mantra" },
    { text: "Previous year papers are not practice. They are prophecy. Solve them.", author: "NEET Mantra" },
    { text: "Revision is not optional. It is the difference between remembering and forgetting on exam day.", author: "NEET Mantra" },
    { text: "The white coat doesn't come to the talented. It comes to the relentless.", author: "NEET Mantra" },
    { text: "One chapter a day. One test a week. One dream in sight. Stay locked in.", author: "NEET Mantra" },
    { text: "Don't count the days. Make the days count.", author: "Muhammad Ali" }
  ];

  let currentIndex = -1;

  function showQuote() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * quotes.length);
    } while (newIndex === currentIndex && quotes.length > 1);
    currentIndex = newIndex;

    const quote = quotes[currentIndex];

    // Fade animation
    quoteText.style.opacity = '0';
    quoteAuthor.style.opacity = '0';

    setTimeout(() => {
      quoteText.textContent = quote.text;
      quoteAuthor.textContent = `\u2014 ${quote.author}`;
      quoteText.style.opacity = '1';
      quoteAuthor.style.opacity = '1';
    }, 300);
  }

  // Show first quote
  showQuote();

  // Auto-change every 10 seconds
  setInterval(showQuote, 10000);

  // Manual change
  newQuoteBtn.addEventListener('click', showQuote);
}

// ==================== PERSONAL MESSAGES ====================
function initPersonalMessages() {
  const grid = document.getElementById('messagesGrid');
  if (!grid) return;

  const messages = [
    { emoji: "\uD83D\uDD25", text: "Every tough question you solve today is one less question that can surprise you on exam day. Keep grinding." },
    { emoji: "\u2615", text: "Take a sip of water, stretch for 2 minutes, and get back to work. Breaks are part of the strategy, not weakness." },
    { emoji: "\uD83C\uDFAF", text: "NEET rewards the consistent, not the last-minute cramers. One chapter a day keeps failure away." },
    { emoji: "\uD83D\uDCAA", text: "You've already covered so much syllabus. Don't you dare think of giving up now. The finish line is closer than you think." },
    { emoji: "\uD83E\uDDE0", text: "Your brain is a muscle. The more you revise, the stronger it gets. Revision today = Recall on exam day." },
    { emoji: "\uD83D\uDCDA", text: "Every NEET topper once sat where you're sitting right now. The only difference? They didn't stop." }
  ];

  grid.innerHTML = messages.map(msg => `
    <div class="message-card">
      <div class="message-emoji">${msg.emoji}</div>
      <p class="message-text">${msg.text}</p>
    </div>
  `).join('');
}

// ==================== SURPRISE POPUP ====================
function initSurprise() {
  const overlay = document.getElementById('surpriseOverlay');
  const closeBtn = document.getElementById('surpriseClose');
  const surpriseHearts = document.getElementById('surpriseHearts');
  const surpriseMessage = document.getElementById('surpriseMessage');

  // All surprise trigger buttons
  const triggerBtns = [
    document.getElementById('surpriseNavBtn'),
    document.getElementById('surpriseHeroBtn')
  ];

  const surpriseMessages = [
    "NEET preparation is tough \u2014 but so are you. Every chapter you finish, every mock test you take, every mistake you learn from is building the future doctor inside you. Don't stop now.",
    "Reminder: You're not just preparing for an exam. You're preparing to save lives. Every hour you study today is an hour that will matter to someone's life tomorrow. That's powerful.",
    "When it gets hard (and it will), remember why you started. Imagine the day you see your name on that merit list. Imagine walking into a medical college. That feeling is worth every sacrifice.",
    "The difference between those who crack NEET and those who don't? It's not talent \u2014 it's consistency. Show up every single day. Solve one more question. Read one more page. That's it.",
    "Close your eyes for 10 seconds. Take a deep breath. Now open them and attack the next chapter with everything you've got. You have the ability. You just need the discipline to use it.",
    "Fun fact: The human brain can store approximately 2.5 petabytes of information. You have more than enough capacity to master the entire NEET syllabus. Trust the process. Keep revising."
  ];

  let messageIndex = 0;

  function openSurprise() {
    // Cycle through messages
    surpriseMessage.textContent = surpriseMessages[messageIndex];
    messageIndex = (messageIndex + 1) % surpriseMessages.length;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Create floating hearts
    createFloatingHearts();
  }

  function closeSurprise() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    surpriseHearts.innerHTML = '';
  }

  triggerBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', openSurprise);
  });

  closeBtn.addEventListener('click', closeSurprise);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSurprise();
  });

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSurprise();
  });

  function createFloatingHearts() {
    surpriseHearts.innerHTML = '';
    const hearts = ['\u2B50', '\uD83D\uDD25', '\u2728', '\uD83C\uDFAF', '\uD83D\uDCAA'];

    for (let i = 0; i < 15; i++) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.cssText = `
        left: ${Math.random() * 100}%;
        bottom: -20px;
        font-size: ${Math.random() * 20 + 15}px;
        animation-delay: ${Math.random() * 2}s;
        animation-duration: ${Math.random() * 2 + 2}s;
      `;
      surpriseHearts.appendChild(heart);
    }
  }
}

// ==================== BACK TO TOP ====================
function initBackToTop() {
  const btn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
  // Simple intersection observer for fade-in animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  // Observe cards and sections
  document.querySelectorAll('.planner-card, .overview-card, .timer-card, .study-tips-card, .progress-card, .quote-card, .message-card, .about-image-wrapper, .about-text, .about-highlight-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ==================== UTILITY FUNCTIONS ====================

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
