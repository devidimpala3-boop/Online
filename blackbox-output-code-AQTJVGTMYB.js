// --- Login/Signup Page Logic ---
const studentLoginBtn = document.getElementById('studentLoginBtn');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginTitle = document.getElementById('loginTitle');
const showSignupLink = document.getElementById('showSignupLink');
const showLoginLink = document.getElementById('showLoginLink');

const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

const signupUsernameInput = document.getElementById('signupUsername');
const signupPasswordInput = document.getElementById('signupPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');

let currentLoginType = 'student'; // Default to student login

// --- Credentials (for demonstration ONLY - NOT SECURE) ---
const ADMIN_USERNAME = 'Public@2025';
const ADMIN_PASSWORD = 'Public@20';

// These will be used for the *simulated* student login
// In a real app, these would come from a database.
let STUDENT_USERNAME = 'krishna@2011'; 
let STUDENT_PASSWORD = 'Krishna@123';
// ---------------------------------------------------------

// Function to switch between login and signup forms
function showLoginForm() {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    loginTitle.textContent = 'Login to Bright Future Public School';
    usernameInput.value = '';
    passwordInput.value = '';
}

function showSignupForm() {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    loginTitle.textContent = 'Student Sign Up';
    signupUsernameInput.value = '';
    signupPasswordInput.value = '';
    confirmPasswordInput.value = '';
    // Ensure student login button is active when showing signup
    studentLoginBtn.classList.add('active');
    adminLoginBtn.classList.remove('active');
    currentLoginType = 'student'; // Signup is only for students
}

showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSignupForm();
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});


studentLoginBtn.addEventListener('click', () => {
    currentLoginType = 'student';
    studentLoginBtn.classList.add('active');
    adminLoginBtn.classList.remove('active');
    showLoginForm(); // Always show login form when switching to student login
});

adminLoginBtn.addEventListener('click', () => {
    currentLoginType = 'admin';
    adminLoginBtn.classList.add('active');
    studentLoginBtn.classList.remove('active');
    showLoginForm(); // Always show login form when switching to admin login
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const enteredUsername = usernameInput.value;
    const enteredPassword = passwordInput.value;

    if (currentLoginType === 'student') {
        if (enteredUsername === STUDENT_USERNAME && enteredPassword === STUDENT_PASSWORD) {
            isLoggedIn = true;
            userRole = 'student';
            alert('Student Login Successful! Redirecting to Admission Form.');
            showPage('admission-form'); // showPage is defined in script.js
        } else {
            alert('Invalid Student Username or Password.');
        }
    } else if (currentLoginType === 'admin') {
        if (enteredUsername === ADMIN_USERNAME && enteredPassword === ADMIN_PASSWORD) {
            isLoggedIn = true;
            userRole = 'admin';
            alert('Admin Login Successful! Redirecting to Admin Dashboard.');
            showPage('admin-dashboard'); // showPage is defined in script.js
        } else {
            alert('Invalid Admin Username or Password.');
        }
    }
    usernameInput.value = ''; // Clear fields after attempt
    passwordInput.value = '';
});

// Simulated Signup Form Submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newUsername = signupUsernameInput.value;
    const newPassword = signupPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    if (newPassword.length < 6) { // Basic password strength check
        alert('Password must be at least 6 characters long.');
        return;
    }

    // --- SIMULATED SIGNUP ---
    // In a real application, this is where you'd send data to a backend
    // to create a new user in a database.
    // For this static page, we'll just update the hardcoded student credentials.
    STUDENT_USERNAME = newUsername;
    STUDENT_PASSWORD = newPassword;
    // ------------------------

    alert('Signup successful! You can now log in with your new credentials.');
    showLoginForm(); // Redirect to login page after successful signup
});