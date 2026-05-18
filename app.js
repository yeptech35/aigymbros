// ===== FIREBASE & AUTH CHECK =====
let currentUser = null;
let isAuthReady = false;

// Wait for Firebase auth before doing anything
auth.onAuthStateChanged(async (user) => {
    if (!user) {
        window.location.href = 'login.html';
    } else {
        currentUser = user;
        isAuthReady = true;
        
        // Load user data from Firestore
        try {
            const doc = await db.collection('users').doc(user.uid).get();
            if (doc.exists) {
                Object.assign(userData, doc.data());
            }
        } catch (error) {
            console.log('Firestore load error:', error);
        }
        
        // Initialize all functionality AFTER auth is ready
        initializeAllFeatures();
    }
});

// ===== PAGE NAVIGATION =====
function initializeAllFeatures() {
    initializePageNavigation();
    initializeChatFeature();
    initializeMealTracking();
    loadInitialData();
}

function initializePageNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const pageContents = document.querySelectorAll('.page-content');
    
    if (navButtons.length === 0) return; // Safety check
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetPage = btn.getAttribute('data-page');
            navigateTo(targetPage, navButtons, pageContents);
        });
    });
    
    // Load last visited page
    const lastPage = localStorage.getItem('lastPage') || 'homePage';
    navigateTo(lastPage, navButtons, pageContents);
}

function navigateTo(pageId, navButtons, pageContents) {
    // Hide all pages
    pageContents.forEach(page => page.classList.add('hidden'));
    
    // Remove active class from all nav buttons
    navButtons.forEach(btn => {
        btn.classList.remove('active', 'text-emerald-400');
        btn.classList.add('text-gray-500', 'hover:text-gray-300');
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
        activeBtn.classList.remove('text-gray-500', 'hover:text-gray-300');
        activeBtn.classList.add('active', 'text-emerald-400');
    }
    
    // Save preference
    localStorage.setItem('lastPage', pageId);
}

// ===== CHAT FUNCTIONALITY =====
function initializeChatFeature() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!chatInput || !sendBtn) return; // Safety check
    
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
        "Minum air banyak-banyak, jangan lepas!",
        "Konsisten bro! Seminggu 4 kali gym dah cukup!",
        "Jangan skip leg day! Legs ada banyak muscles!",
        "Sleep 8 hours! Recovery is growth, bro!",
        "Track your macros! Protein, carbs, fats important!",
    ];
    
    sendBtn.addEventListener('click', () => sendMessage(chatInput, chatMessages, coachResponses));
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage(chatInput, chatMessages, coachResponses);
    });
    
    loadChat(chatMessages);
}

function sendMessage(chatInput, chatMessages, coachResponses) {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // User message
    const userMsg = document.createElement('p');
    userMsg.className = 'text-sm bg-emerald-600/30 p-3 rounded-xl rounded-br-none border-r-4 border-emerald-500 text-gray-100 ml-auto w-4/5';
    userMsg.textContent = message;
    chatMessages.appendChild(userMsg);
    
    // Clear input
    chatInput.value = '';
    
    // Save to Firestore
    if (currentUser) {
        db.collection('users').doc(currentUser.uid).update({
            lastMessage: message,
            lastMessageTime: new Date()
        }).catch(e => console.log('Save error:', e));
    }
    
    // Coach response (simulate delay)
    setTimeout(() => {
        const randomResponse = coachResponses[Math.floor(Math.random() * coachResponses.length)];
        const coachMsg = document.createElement('p');
        coachMsg.className = 'text-sm bg-gray-900/80 p-3 rounded-xl rounded-tl-none border-l-4 border-emerald-500 italic text-gray-200';
        coachMsg.textContent = '"' + randomResponse + '"';
        chatMessages.appendChild(coachMsg);
        
        // Auto scroll
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Save chat to localStorage
        saveChat(chatMessages);
    }, 500);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function saveChat(chatMessages) {
    const chatContent = chatMessages.innerHTML;
    localStorage.setItem('chatHistory', chatContent);
}

function loadChat(chatMessages) {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
        chatMessages.innerHTML = saved;
    }
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
    name: 'User',
    height: 175,
    age: 25,
    bmi: 24.6
};

function updateUI() {
    const elements = {
        'dailyBudget': `RM${userData.dailyBudget.toFixed(2)}`,
        'currentWeight': userData.currentWeight,
        'streakCount': userData.streak,
        'calorieProgress': `${userData.dailyCalories}/${userData.targetCalories}`,
        'weightProgress': `${userData.currentWeight}/${userData.targetWeight}`,
        'totalWorkouts': userData.totalWorkouts,
        'totalDays': userData.totalDays,
        'userName': userData.name,
        'statWeight': `${userData.currentWeight} `,
        'statHeight': `${userData.height} `,
        'statBMI': userData.bmi.toFixed(1),
        'statAge': userData.age
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    });
}

// ===== MEAL TRACKING =====
function initializeMealTracking() {
    const mealCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    
    mealCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const mealCard = e.target.closest('.bg-gradient-to-br');
            if (mealCard) {
                if (e.target.checked) {
                    mealCard.classList.add('opacity-60');
                    showNotification('✅ Meal logged!');
                } else {
                    mealCard.classList.remove('opacity-60');
                }
            }
            saveMealData();
        });
    });
    
    loadMealData();
}

function saveMealData() {
    const meals = {
        breakfast: document.getElementById('breakfastCheck')?.checked || false,
        lunch: document.getElementById('lunchCheck')?.checked || false,
        dinner: document.getElementById('dinnerCheck')?.checked || false
    };
    
    if (currentUser) {
        db.collection('users').doc(currentUser.uid).update({
            meals: meals
        }).catch(e => console.log('Error:', e));
    }
    
    localStorage.setItem('meals', JSON.stringify(meals));
}

function loadMealData() {
    const saved = localStorage.getItem('meals');
    if (saved) {
        const meals = JSON.parse(saved);
        
        const mealIds = {
            breakfast: 'breakfastCheck',
            lunch: 'lunchCheck',
            dinner: 'dinnerCheck'
        };
        
        Object.entries(meals).forEach(([key, checked]) => {
            const checkbox = document.getElementById(mealIds[key]);
            if (checkbox && checked) {
                checkbox.checked = true;
                const card = checkbox.closest('.bg-gradient-to-br');
                if (card) card.classList.add('opacity-60');
            }
        });
    }
}

// ===== NOTIFICATIONS =====
function showNotification(message) {
    const notif = document.createElement('div');
    notif.className = 'fixed top-4 right-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/50 z-50 animate-slideUp';
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.remove();
    }, 2000);
}

// ===== DATA SYNC WITH FIRESTORE =====
function loadInitialData() {
    updateUI();
}

// Auto-save to Firestore every 30 seconds
setInterval(() => {
    if (currentUser && isAuthReady) {
        db.collection('users').doc(currentUser.uid).update(userData)
            .catch(e => console.log('Auto-save error:', e));
    }
}, 30000);
