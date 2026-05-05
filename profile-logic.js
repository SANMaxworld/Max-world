// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAE_oP6wv4A1UxfEdcT82f4KZkhSBzfH3M",
  authDomain: "mw-hub-59e96.firebaseapp.com",
  projectId: "mw-hub-59e96",
  storageBucket: "mw-hub-59e96.firebasestorage.app",
  messagingSenderId: "1084767566489",
  appId: "1:1084767566489:web:5913fcac03c2947c9b1608",
  measurementId: "G-K44QJG0GTM"
};

// Initialize
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// Login Function
function loginUser() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(err => alert("Login Failed: " + err.message));
}

// Logout Function
function logoutUser() {
    if(confirm("Logout karna chahte ho?")) {
        auth.signOut().then(() => location.reload());
    }
}

// Observe Auth State
auth.onAuthStateChanged((user) => {
    const loginUI = document.getElementById('login-state');
    const logoutUI = document.getElementById('logout-state');

    if (user) {
        loginUI.style.display = 'block';
        logoutUI.style.display = 'none';
        
        // Set Profile Info
        document.getElementById('u-name').innerText = user.displayName;
        document.getElementById('u-img').src = user.photoURL;
        document.getElementById('u-email').innerText = user.email;
        
        // Fetch History from Realtime Database
        fetchHistory(user.uid);
    } else {
        loginUI.style.display = 'none';
        logoutUI.style.display = 'block';
    }
});

// History Fetcher
function fetchHistory(uid) {
    const historyRef = db.ref('users/' + uid + '/watchHistory');
    historyRef.orderByChild('timestamp').limitToLast(10).once('value', (snapshot) => {
        const container = document.getElementById('history-container');
        const data = snapshot.val();

        if (!data) {
            container.innerHTML = '<p style="color:#555;">Abhi tak kuch nahi dekha.</p>';
            return;
        }

        container.innerHTML = ''; // Clear loading
        // Reverse object to show latest first
        const keys = Object.keys(data).reverse();
        
        keys.forEach(animeKey => {
            const item = data[animeKey];
            const animeName = animeKey.replace(/_/g, ' ');
            
            container.innerHTML += `
                <a href="anime/${animeKey}.html" class="history-item">
                    <div style="flex-grow: 1;">
                        <h4 style="color:#fff; font-size:14px; margin-bottom:2px;">${animeName}</h4>
                        <span style="color:#ff0000; font-size:11px; font-weight:bold;">LAST WATCHED: EPISODE ${item.episode}</span>
                    </div>
                    <span style="font-size:18px;">▶️</span>
                </a>
            `;
        });
    });
    }
