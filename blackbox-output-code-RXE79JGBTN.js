// Global state variables
let currentPage = 'home'; // Track current page
let isLoggedIn = false;
let userRole = null; // 'student' or 'admin'

// Function to show a specific page and hide others
function showPage(pageName) {
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => {
        if (page.dataset.page === pageName) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });
    currentPage = pageName;

    // Update header links visibility based on login status
    updateNavLinks();

    // Scroll to top when changing pages
    window.scrollTo(0, 0);
}

function updateNavLinks() {
    const logoutNavLink = document.getElementById('logoutNavLink');
    const loginNavLink = document.querySelector('nav ul li a[onclick="showPage(\'login\')"]').parentNode;

    if (isLoggedIn) {
        loginNavLink.style.display = 'none';
        logoutNavLink.style.display = 'list-item';
    } else {
        loginNavLink.style.display = 'list-item';
        logoutNavLink.style.display = 'none';
    }
}

function logout() {
    isLoggedIn = false;
    userRole = null;
    alert('Logged out successfully!');
    showPage('login'); // Redirect to login page after logout
}

// Initial page load
document.addEventListener('DOMContentLoaded', () => {
    showPage('home');
    updateNavLinks();
});

// --- Admission Form Logic (EmailJS) ---
document.getElementById('admissionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Basic form validation
    const studentName = document.getElementById('studentName').value;
    const dob = document.getElementById('dob').value;
    const fatherName = document.getElementById('fatherName').value;
    const email = document.getElementById('email').value; // Student's email
    const phone = document.getElementById('phone').value;
    const applyingFor = document.getElementById('applyingFor').value;
    const gender = document.querySelector('input[name="gender"]:checked');

    if (!studentName || !dob || !fatherName || !email || !phone || !applyingFor || !gender) {
        alert('Please fill all required fields (marked with *)');
        return;
    }

    // Collect all form data
    const formData = {
        studentName: studentName,
        dob: dob,
        gender: gender ? gender.value : 'N/A',
        bloodGroup: document.getElementById('bloodGroup').value,
        nationality: document.getElementById('nationality').value,
        religion: document.getElementById('religion').value,
        fatherName: fatherName,
        fatherOccupation: document.getElementById('fatherOccupation').value,
        motherName: document.getElementById('motherName').value,
        motherOccupation: document.getElementById('motherOccupation').value,
        email: email, // Student's email for confirmation
        phone: phone,
        address: document.getElementById('address').value,
        emergencyContactName: document.getElementById('emergencyContactName').value,
        emergencyContactPhone: document.getElementById('emergencyContactPhone').value,
        applyingFor: applyingFor,
        previousSchool: document.getElementById('previousSchool').value,
        previousGrade: document.getElementById('previousGrade').value,
        medicalHistory: document.getElementById('medicalHistory').value,
        hobbies: document.getElementById('hobbies').value,
    };

    // Collect checked documents and file names
    const checkedDocuments = Array.from(document.querySelectorAll('input[name="documents"]:checked'))
                                .map(cb => cb.value)
                                .join(', ');
    formData.checkedDocuments = checkedDocuments || 'None selected';

    const fileInputs = [
        { id: 'birthCertificateFile', name: 'Birth Certificate' },
        { id: 'aadhaarFile', name: 'Aadhaar Card' },
        { id: 'transferCertificateFile', name: 'Transfer Certificate' },
        { id: 'photosFile', name: 'Passport Size Photos' },
        { id: 'reportCardFile', name: 'Previous Report Card' },
        { id: 'otherDocumentsFile', name: 'Other Documents' }
    ];

    let uploadedFilesInfo = '';
    fileInputs.forEach(input => {
        const fileElement = document.getElementById(input.id);
        if (fileElement && fileElement.files.length > 0) {
            if (fileElement.multiple) {
                Array.from(fileElement.files).forEach(file => {
                    uploadedFilesInfo += `${input.name}: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)\n`;
                });
            } else {
                const file = fileElement.files[0];
                uploadedFilesInfo += `${input.name}: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)\n`;
            }
        }
    });
    formData.uploadedFilesInfo = uploadedFilesInfo || 'No files uploaded.';

    console.log('Form Data:', formData); // For debugging

    // Send email to Admin
    // IMPORTANT: Replace "template_admin_notification" with your actual EmailJS Template ID for admin notifications.
    emailjs.send("service_76vz6z2", "template_admin_notification", formData) 
        .then(function(response) {
            console.log('Admin Email SUCCESS!', response.status, response.text);

            // Send confirmation email to the student
            // IMPORTANT: Replace "template_student_confirmation" with your actual EmailJS Template ID for student confirmations.
            return emailjs.send("service_76vz6z2", "template_student_confirmation", formData);
        })
        .then(function(studentResponse) {
            console.log('Student Confirmation Email SUCCESS!', studentResponse.status, studentResponse.text);
            alert('Thank you for your application! We have received your details and sent a confirmation email to your provided address. Please check your inbox.');
            document.getElementById('admissionForm').reset(); // Clear the form
            showPage('home'); // Redirect to home after successful submission
            logout(); // Log out after submission
        })
        .catch(function(error) {
            console.log('Email sending FAILED...', error);
            // Differentiate error messages based on which email failed, if possible
            if (error.status === 400 && error.text.includes("template_admin_notification")) {
                alert('Failed to send admin notification. Please check your EmailJS setup for the admin template. Application not fully processed.');
            } else if (error.status === 400 && error.text.includes("template_student_confirmation")) {
                alert('Your application was submitted, but we could not send a confirmation email to you. Please check your email address or contact support at T.Gmoney@outlook.com.');
                // Still proceed with form reset and logout if admin email likely succeeded
                document.getElementById('admissionForm').reset();
                showPage('home');
                logout();
            } else {
                alert('An unexpected error occurred while sending your application. Please try again later or contact support at T.Gmoney@outlook.com.');
            }
        });
});