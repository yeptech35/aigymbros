// Import Firebase config
// Note: Add <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"></script>
// and other Firebase scripts to index.html

let currentUser = null;
const auth = firebase.auth();
const db = firebase.firestore();

// Check authentication on page load
auth.onAuthStateChanged(async (user) => {
    if (!user) {
        window.location.href = 'login.html';
    } else {
        currentUser = user;
        await loadUserProfile(user.uid);
        initializeApp();
    }
});

// Load user profile from Firestore
async function loadUserProfile(userId) {
    try {
        const doc = await db.collection('users').doc(userId).get();
        if (doc.exists) {
            const userData = doc.data();
            Object.assign(userData, userData);
            updateUIFromFirestore(userData);
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Update UI from Firestore data
function updateUIFromFirestore(userData) {
    document.getElementById('userName').textContent = userData.name || 'User';
    document.getElementById('dailyBudget').textContent = `RM${(userData.dailyBudget || 20).toFixed(2)}`;
    document.getElementById('currentWeight').textContent = userData.currentWeight || 75.4;
    document.getElementById('streakCount').textContent = userData.streak || 0;
    document.getElementById('totalWorkouts').textContent = userData.totalWorkouts || 0;
    document.getElementById('totalDays').textContent = userData.totalDays || 0;
}

// Save user data to Firestore
async function saveUserToFirestore(data) {
    if (!currentUser) return;
    try {
        await db.collection('users').doc(currentUser.uid).update(data);
    } catch (error) {
        console.error('Error saving to Firestore:', error);
    }
}

// Logout handler
function setupLogoutButton() {
    const logoutBtn = document.querySelector('button:contains("Log Keluar")');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await auth.signOut();
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Logout error:', error);
            }
        });
    }
}

// Initialize app after auth check
function initializeApp() {
    setupLogoutButton();
    // ... rest of existing app code
}
