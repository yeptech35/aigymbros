// ===== PAGE NAVIGATION =====
const navButtons = document.querySelectorAll('.nav-btn');
const pageContents = document.querySelectorAll('.page-content');

navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const targetPage = btn.getAttribute('data-page');
        navigateTo(targetPage);
    });
});

function navigateTo(pageId) {
    // Hide all pages
    pageContents.forEach(page => page.classList.add('hidden'));
    
    // Remove active class from all nav buttons
    navButtons.forEach(btn => btn.classList.remove('active', 'text-emerald-400'));
    navButtons.forEach(btn => {
        if (btn.getAttribute('data-page') !== pageId) {
            btn.classList.add('text-gray-500', 'hover:text-gray-300');
        }
    });
    
    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.remove('hidden');
        selectedPage.classList.add('animate-fadeIn');
    }
    
    // Update nav button styling
    const activeBtn = document.querySelector(`[data-page="${pageId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active', 'text-emerald-400');
        activeBtn.classList.remove('text-gray-500', 'hover:text-gray-300');
    }
    
    // Save preference
    localStorage.setItem('lastPage', pageId);
}

// Load last visited page
window.addEventListener('load', () => {
    const lastPage = localStorage.getItem('lastPage') || 'homePage';
    navigateTo(lastPage);
});

// ===== CHAT FUNCTIONALITY =====
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');

const coachResponses = [
    "Bagus bro! Jangan lupa warm-up sebelum mula!",
    "Kau tu malas ke? Bangun awal-awal pergi gym!",
    "Aku tengok kau ni dedikasi tinggi! Teruskan bro!",
    "Makan yang betul, jangan makan makanan sampah!",
    "Cardio jangan lupa! Jangan jadi tong sampah je!",
    "Rest day pun penting bro! Otot berkembang masa tidur!",
    "Minum air banyak-banyak! Jangan sampai dehidrasi!",
    "Protein penting bro! Makan telur, ayam, ikan!",
    "Progress lambat-lambat tapi pasti! Sabar je lah!",
    "Aku proud kat kau! Teruskan effort ni!",
];

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // User message
    const userMsg = document.createElement('p');
    userMsg.className = 'text-sm bg-emerald-600/30 p-3 rounded-xl rounded-br-none border-r-4 border-emerald-500 text-gray-100 ml-auto w-4/5';
    userMsg.textContent = message;
    chatMessages.appendChild(userMsg);
    
    // Clear input
    chatInput.value = '';
    
    // Coach response (simulate delay)
    setTimeout(() => {
        const randomResponse = coachResponses[Math.floor(Math.random() * coachResponses.length)];
        const coachMsg = document.createElement('p');
        coachMsg.className = 'text-sm bg-gray-900/80 p-3 rounded-xl rounded-tl-none border-l-4 border-emerald-500 italic text-gray-200';
        coachMsg.textContent = '"' + randomResponse + '"';
        chatMessages.appendChild(coachMsg);
        
        // Auto scroll
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 300);
    
    // Save chat
    saveChat();
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ===== DATA MANAGEMENT =====
const userData = {
    dailyBudget: 20.00,
    currentWeight: 75.4,
    targetWeight: 70,
    dailyCalories: 1175,
    targetCalories: 2000,
    streak: 3,
    totalWorkouts: 32,
    totalDays: 45,
    name: 'Bro Gym',
    height: 175,
    age: 25,
    bmi: 24.6
};

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('userData');
    if (saved) {
        Object.assign(userData, JSON.parse(saved));
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('userData', JSON.stringify(userData));
    updateUI();
}

// Update UI with data
function updateUI() {
    document.getElementById('dailyBudget').textContent = `RM${userData.dailyBudget.toFixed(2)}`;
    document.getElementById('currentWeight').textContent = userData.currentWeight;
    document.getElementById('streakCount').textContent = userData.streak;
    document.getElementById('calorieProgress').textContent = `${userData.dailyCalories}/${userData.targetCalories}`;
    document.getElementById('weightProgress').textContent = `${userData.currentWeight}/${userData.targetWeight}`;
    document.getElementById('totalWorkouts').textContent = userData.totalWorkouts;
    document.getElementById('totalDays').textContent = userData.totalDays;
    document.getElementById('userName').textContent = userData.name;
    document.getElementById('statWeight').textContent = `${userData.currentWeight} `;
    document.getElementById('statHeight').textContent = `${userData.height} `;
    document.getElementById('statBMI').textContent = userData.bmi.toFixed(1);
    document.getElementById('statAge').textContent = userData.age;
}

// Save chat
function saveChat() {
    const chatContent = chatMessages.innerHTML;
    localStorage.setItem('chatHistory', chatContent);
}

// Load chat
function loadChat() {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
        chatMessages.innerHTML = saved;
    }
}

// ===== MEAL TRACKING =====
const mealCheckboxes = document.querySelectorAll('input[type="checkbox"]');

mealCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
        const mealCard = e.target.closest('.bg-gradient-to-br');
        if (e.target.checked) {
            mealCard.classList.add('opacity-60');
            showNotification('✅ Meal logged!');
        } else {
            mealCard.classList.remove('opacity-60');
        }
        saveMealData();
    });
});

function saveMealData() {
    const meals = {
        breakfast: document.getElementById('breakfastCheck')?.checked || false,
        lunch: document.getElementById('lunchCheck')?.checked || false,
        dinner: document.getElementById('dinnerCheck')?.checked || false
    };
    localStorage.setItem('meals', JSON.stringify(meals));
}

function loadMealData() {
    const saved = localStorage.getItem('meals');
    if (saved) {
        const meals = JSON.parse(saved);
        if (meals.breakfast && document.getElementById('breakfastCheck')) {
            document.getElementById('breakfastCheck').checked = true;
            document.getElementById('breakfastCheck').closest('.bg-gradient-to-br')?.classList.add('opacity-60');
        }
        if (meals.lunch && document.getElementById('lunchCheck')) {
            document.getElementById('lunchCheck').checked = true;
            document.getElementById('lunchCheck').closest('.bg-gradient-to-br')?.classList.add('opacity-60');
        }
        if (meals.dinner && document.getElementById('dinnerCheck')) {
            document.getElementById('dinnerCheck').checked = true;
            document.getElementById('dinnerCheck').closest('.bg-gradient-to-br')?.classList.add('opacity-60');
        }
    }
}

// ===== NOTIFICATIONS =====
function showNotification(message) {
    const notif = document.createElement('div');
    notif.className = 'fixed top-4 right-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-3 rounded-xl shadow-lg shadow-emerald-500/50 z-50 animate-slideUp';
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.remove();
    }, 2000);
}

// ===== INIT =====
window.addEventListener('load', () => {
    loadData();
    loadChat();
    loadMealData();
    updateUI();
    navigateTo('homePage');
});

// Auto-save every 30 seconds
setInterval(saveData, 30000);
