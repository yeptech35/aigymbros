// Firebase Auth Helper Functions

const auth = firebase.auth();
const db = firebase.firestore();

// Check authentication state
function checkAuth(callback) {
    auth.onAuthStateChanged((user) => {
        if (!user) {
            // User not logged in, redirect to login
            window.location.href = 'login.html';
        } else {
            callback(user);
        }
    });
}

// Get current user
function getCurrentUser() {
    return auth.currentUser;
}

// Save user data to Firestore
async function saveUserData(userId, data) {
    try {
        await db.collection('users').doc(userId).update(data);
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
}

// Load user data from Firestore
async function loadUserData(userId) {
    try {
        const doc = await db.collection('users').doc(userId).get();
        if (doc.exists) {
            return doc.data();
        }
        return null;
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

// Logout
async function logout() {
    try {
        await auth.signOut();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

// Get user profile
async function getUserProfile(userId) {
    try {
        const doc = await db.collection('users').doc(userId).get();
        return doc.data();
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
}
