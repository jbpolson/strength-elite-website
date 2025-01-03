// Store user answers
let userAnswers = {
    gender: null,
    dob: null,
    primaryGoal: null,
    trainingFrequency: null,
    sportsBackground: null,
    previousCompetitions: null,
    fiveKmPB: null,
    chinUps: null
};

// Survey questions data
const surveyQuestions = [
    {
        step: 1,
        question: "What is your gender?",
        options: ["Male", "Female"],
        key: "gender"
    },
    {
        step: 2,
        question: "What is your Date of Birth?",
        type: "date",
        key: "dob"
    },
    {
        step: 3,
        question: "What is your primary fitness goal?",
        options: ["Train for event", "Build muscle", "Get fit"],
        key: "primaryGoal"
    },
    {
        step: 4,
        question: "How often do you train?",
        options: ["Less than 3 times per week", "3-5 times per week", "6 or more times per week"],
        key: "trainingFrequency"
    },
    {
        step: 5,
        question: "What's your sports background?",
        options: ["Endurance", "Strength", "New to training"],
        key: "sportsBackground"
    },
    {
        step: 6,
        question: "Have you competed before?",
        options: ["Endurance events", "Strength events", "No competitions"],
        key: "previousCompetitions"
    },
    {
        step: 7,
        question: "What's your 5km PB?",
        options: ["Sub 16 mins", "16-20 mins", "20-25 mins", "25+ mins"],
        key: "fiveKmPB"
    },
    {
        step: 8,
        question: "How many chin-ups can you do?",
        options: ["0-5", "5-10", "10-15", "15+"],
        key: "chinUps"
    },
    {
        step: 9,
        question: "Almost there! Please provide your contact details",
        type: "contact",
        key: "contact"
    }
];

// Add this constant at the top of the file
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxHOilkqUXcr57Y3R_o2hdOFNdOy4Ib1ZJRTkmETFyszu5xa-EjTud-vqHCFz0p-oSP/exec';

// Add these variables to store the selected program and level
let selectedProgram = '';
let selectedLevel = '';
let lastClickedProgram = '';

// Add these constants at the top of the file with the other constants
const PROGRAM_URLS = {
    'Hyrox': 'https://share.newie.app/offerings/EFA35DBE-7FA3-42AA-8560-907EFDCA567B',
    'Mass': 'https://share.newie.app/offerings/1C6A39F9-5200-4618-BD3C-1B7595C687A0',
    'Fit': 'https://share.newie.app/offerings/5582A194-23C4-46BD-A061-2143F4D1ABBA'
};

// Initialize survey functionality
document.addEventListener('DOMContentLoaded', function() {
    const findProgramBtns = document.querySelectorAll('.button');
    const modal = document.getElementById('surveyModal');
    const closeBtn = document.querySelector('.survey-close-btn');
    
    // Open modal on button click
    findProgramBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openSurvey();
        });
    });
    
    // Close modal on button click
    closeBtn.addEventListener('click', closeSurvey);
    
    // Close modal on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeSurvey();
        }
    });
    
    // Sticky CTA visibility control
    const stickyCta = document.querySelector('.sticky-cta');
    const heroSection = document.querySelector('.hero');
    
    function toggleStickyCta() {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight;
        
        if (scrollPosition > heroBottom) {
            stickyCta.classList.add('visible');
        } else {
            stickyCta.classList.remove('visible');
        }
    }
    
    // Initial check
    toggleStickyCta();
    
    // Check on scroll
    window.addEventListener('scroll', toggleStickyCta);
    
    // Smooth scroll to programs section when clicking the sticky button
    document.querySelector('.sticky-button').addEventListener('click', function(e) {
        e.preventDefault();
        const programsSection = document.querySelector('#programs');
        programsSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Level choice modal functionality
    const programLinks = document.querySelectorAll('.program-link');
    const levelChoiceModal = document.querySelector('.level-choice-modal');
    const levelChoiceClose = document.querySelector('.level-choice-close');
    const levelButtons = document.querySelectorAll('.level-btn');
    const surveyStartBtn = document.querySelector('.survey-start-btn');

    // Open level choice modal when clicking "Choose Program"
    programLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            lastClickedProgram = this.closest('.program').querySelector('.program-title').textContent;
            levelChoiceModal.classList.add('active');
        });
    });

    // Close modal
    levelChoiceClose.addEventListener('click', () => {
        levelChoiceModal.classList.remove('active');
    });

    // Close on outside click
    levelChoiceModal.addEventListener('click', function(e) {
        if (e.target === levelChoiceModal) {
            levelChoiceModal.classList.remove('active');
        }
    });

    // Handle direct level selection
    levelButtons.forEach(button => {
        button.addEventListener('click', function() {
            selectedLevel = this.dataset.level;
            selectedProgram = lastClickedProgram;
            
            // Log to verify values are being set
            console.log('Setting Program:', selectedProgram);
            console.log('Setting Level:', selectedLevel);
            
            // Close level choice modal
            levelChoiceModal.classList.remove('active');
            
            // Show contact capture modal
            showContactCapture();
        });
    });

    // Handle survey start
    surveyStartBtn.addEventListener('click', function() {
        levelChoiceModal.classList.remove('active');
        openSurvey();
    });

    // Survey modal close functionality
    const surveyModal = document.getElementById('surveyModal');
    document.querySelectorAll('.survey-close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.closest('.survey-modal')) {
                closeSurvey();
            } else if (this.closest('.level-choice-modal')) {
                levelChoiceModal.classList.remove('active');
            }
        });
    });

    // Add this to your existing DOMContentLoaded event listener
    const navbar = document.querySelector('.navbar');

    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Initial check
    updateNavbar();

    // Listen for scroll
    window.addEventListener('scroll', updateNavbar);
});

// Survey functions
function openSurvey() {
    const modal = document.getElementById('surveyModal');
    modal.classList.add('active');
    loadStep(1);
}

function closeSurvey() {
    const modal = document.getElementById('surveyModal');
    modal.classList.remove('active');
}

function loadStep(stepNumber) {
    const question = surveyQuestions[stepNumber - 1];
    const modalContent = document.querySelector('.survey-modal-content');
    
    let stepHtml = `
        <button class="survey-close-btn">&times;</button>
        <div class="survey-step" data-step="${stepNumber}">
            <h3 class="survey-question">${question.question}</h3>
            <div class="survey-options">
    `;
    
    if (question.type === 'date') {
        stepHtml += `<input type="date" class="survey-date-input" id="${question.key}Input">`;
    } else if (question.type === 'contact') {
        stepHtml += `
            <input type="text" class="survey-text-input" id="nameInput" placeholder="Your Name" required>
            <input type="email" class="survey-email-input" id="emailInput" placeholder="Your Email" required>
        `;
    } else {
        question.options.forEach(option => {
            stepHtml += `
                <label class="survey-option">
                    <input type="radio" name="${question.key}" value="${option}">
                    <span class="option-text">${option}</span>
                </label>
            `;
        });
    }
    
    stepHtml += `
            </div>
            <div class="survey-nav">
                <div class="survey-progress">Step ${stepNumber} of 9</div>
                <div class="survey-buttons">
                    ${stepNumber > 1 ? '<button class="survey-prev-btn">Previous</button>' : ''}
                    <button class="survey-next-btn">${stepNumber === 9 ? 'Next' : 'Next'}</button>
                </div>
            </div>
        </div>
    `;
    
    modalContent.innerHTML = stepHtml;
    
    // Reattach close button listener
    const closeBtn = modalContent.querySelector('.survey-close-btn');
    closeBtn.addEventListener('click', closeSurvey);
    
    setupStepListeners(stepNumber);
}

// Setup listeners for step navigation and answer storage
function setupStepListeners(stepNumber) {
    const nextBtn = document.querySelector('.survey-next-btn');
    const prevBtn = document.querySelector('.survey-prev-btn');
    const question = surveyQuestions[stepNumber - 1];

    // Previous button handler
    if (prevBtn) {
        prevBtn.addEventListener('click', () => loadStep(stepNumber - 1));
    }

    // Next button handler
    nextBtn.addEventListener('click', () => {
        if (saveStepAnswer(stepNumber)) {
            if (stepNumber === 9) {
                loadFinalStep();
            } else {
                loadStep(stepNumber + 1);
            }
        }
    });
}

// Save the answer for current step
function saveStepAnswer(stepNumber) {
    const question = surveyQuestions[stepNumber - 1];
    
    if (question.type === 'date') {
        const dateInput = document.getElementById(`${question.key}Input`);
        if (!dateInput.value) {
            alert('Please select a date');
            return false;
        }
        userAnswers[question.key] = dateInput.value;
    } else if (question.type === 'contact') {
        const nameInput = document.getElementById('nameInput');
        const emailInput = document.getElementById('emailInput');
        
        if (!nameInput.value || !emailInput.value) {
            alert('Please fill in both name and email');
            return false;
        }
        if (!isValidEmail(emailInput.value)) {
            alert('Please enter a valid email address');
            return false;
        }
        
        userAnswers.name = nameInput.value;
        userAnswers.email = emailInput.value;
    } else {
        const selectedOption = document.querySelector(`input[name="${question.key}"]:checked`);
        if (!selectedOption) {
            alert('Please select an option');
            return false;
        }
        userAnswers[question.key] = selectedOption.value;
    }
    return true;
}

// Add email validation helper
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Calculate recommended program and level
function calculateProgram() {
    let program = 'Fit'; // Default program
    let level = 'Intermediate'; // Default level
    
    // Determine program based on primary goal
    switch (userAnswers.primaryGoal) {
        case 'Train for event':
            program = 'Hyrox';
            break;
        case 'Build muscle':
            program = 'Mass';
            break;
        case 'Get fit':
            program = 'Fit';
            break;
    }
    
    // Calculate level based on multiple factors
    let points = 0;
    
    // Training frequency points
    if (userAnswers.trainingFrequency === '6 or more times per week') points += 3;
    else if (userAnswers.trainingFrequency === '3-5 times per week') points += 2;
    else points += 1;
    
    // Sports background points
    if (userAnswers.sportsBackground !== 'New to training') points += 2;
    
    // Competition history points
    if (userAnswers.previousCompetitions !== 'No competitions') points += 2;
    
    // 5km PB points
    if (userAnswers.fiveKmPB === 'Sub 16 mins') points += 3;
    else if (userAnswers.fiveKmPB === '16-20 mins') points += 2;
    
    // Chin-ups points
    if (userAnswers.chinUps === '15+') points += 3;
    else if (userAnswers.chinUps === '10-15') points += 2;
    
    // Determine level based on points
    if (points >= 10) level = 'Elite';
    else if (points >= 6) level = 'Advanced';
    else level = 'Intermediate';
    
    return { program, level };
}

// Load the final recommendation step
function loadFinalStep() {
    const { program, level } = calculateProgram();
    const modalContent = document.querySelector('.survey-modal-content');
    
    const finalStepHtml = `
        <button class="survey-close-btn">&times;</button>
        <div class="survey-step final-step">
            <h3 class="survey-question">Your Recommended Program</h3>
            <div class="recommendation">
                <p class="program-recommendation">
                    Based on your responses, we recommend:
                    <strong>${program} Program</strong> at <strong>${level} Level</strong>
                </p>
                
                <div class="level-override">
                    <p>You can adjust your level if you prefer:</p>
                    <select id="levelOverride">
                        <option value="Elite" ${level === 'Elite' ? 'selected' : ''}>Elite</option>
                        <option value="Advanced" ${level === 'Advanced' ? 'selected' : ''}>Advanced</option>
                        <option value="Intermediate" ${level === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
                    </select>
                </div>
            </div>
            <div class="survey-nav">
                <button class="survey-prev-btn">Previous</button>
                <button class="survey-confirm-btn">Confirm & Continue</button>
            </div>
        </div>
    `;
    
    modalContent.innerHTML = finalStepHtml;
    
    // Reattach close button listener
    const closeBtn = modalContent.querySelector('.survey-close-btn');
    closeBtn.addEventListener('click', closeSurvey);
    
    setupFinalStepListeners();
}

// Setup listeners for the final step
function setupFinalStepListeners() {
    const prevBtn = document.querySelector('.survey-prev-btn');
    const confirmBtn = document.querySelector('.survey-confirm-btn');
    const closeBtn = document.querySelector('.survey-close-btn');
    
    prevBtn.addEventListener('click', () => loadStep(9));
    confirmBtn.addEventListener('click', confirmAndRedirect);
    closeBtn.addEventListener('click', closeSurvey);
}

// Handle final confirmation and redirect
async function confirmAndRedirect() {
    const selectedLevel = document.getElementById('levelOverride').value;
    const { program, level } = calculateProgram();
    
    // Prepare the data for submission
    const submissionData = {
        name: userAnswers.name,
        email: userAnswers.email,
        gender: userAnswers.gender,
        dob: userAnswers.dob,
        primaryGoal: userAnswers.primaryGoal,
        trainingFrequency: userAnswers.trainingFrequency,
        sportsBackground: userAnswers.sportsBackground,
        previousCompetitions: userAnswers.previousCompetitions,
        fiveKmPB: userAnswers.fiveKmPB,
        chinUps: userAnswers.chinUps,
        recommendedProgram: program,
        recommendedLevel: level,
        finalLevel: selectedLevel
    };

    try {
        // Show loading state
        const confirmBtn = document.querySelector('.survey-confirm-btn');
        const originalText = confirmBtn.textContent;
        confirmBtn.textContent = 'Submitting...';
        confirmBtn.disabled = true;

        // Submit data to Google Sheet
        const response = await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            body: JSON.stringify(submissionData),
            mode: 'no-cors' // Required for Google Apps Script
        });

        // Since we're using no-cors, we can't actually read the response
        // We'll assume success if no error was thrown
        
        // Store final selection if needed
        userAnswers.finalLevel = selectedLevel;
        
        // Get the correct URL for the recommended program
        const redirectUrl = PROGRAM_URLS[program] || PROGRAM_URLS['Fit'];
        
        // Redirect to the specific program URL
        window.location.href = redirectUrl;

    } catch (error) {
        console.error('Error submitting survey:', error);
        
        // Show error message to user
        alert('There was an error submitting your response. Please try again.');
        
        // Reset button state
        confirmBtn.textContent = originalText;
        confirmBtn.disabled = false;
    }
}

// Add these new functions
function showContactCapture() {
    const modal = document.querySelector('.contact-capture-modal');
    
    // Update the display with selected program and level
    modal.querySelector('.selected-program-display').textContent = selectedProgram;
    modal.querySelector('.selected-level-display').textContent = selectedLevel;
    
    // Set the correct level in the select dropdown
    const levelSelect = modal.querySelector('#directLevelSelect');
    levelSelect.value = selectedLevel;
    
    // Show the modal
    modal.classList.add('active');
    
    // Setup listeners
    const closeBtn = modal.querySelector('.contact-capture-close');
    const submitBtn = modal.querySelector('.contact-submit-btn');
    const levelAdjust = modal.querySelector('#directLevelSelect');
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Update level display when selection changes
    levelAdjust.addEventListener('change', (e) => {
        selectedLevel = e.target.value;
        modal.querySelector('.selected-level-display').textContent = selectedLevel;
    });
    
    submitBtn.addEventListener('click', handleDirectSubmission);
}

async function handleDirectSubmission() {
    const nameInput = document.getElementById('directNameInput');
    const emailInput = document.getElementById('directEmailInput');
    const finalLevel = document.getElementById('directLevelSelect').value;
    
    // Validate inputs
    if (!nameInput.value || !emailInput.value) {
        alert('Please fill in both name and email');
        return;
    }
    if (!isValidEmail(emailInput.value)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Prepare the data
    const submissionData = {
        name: nameInput.value,
        email: emailInput.value,
        program: selectedProgram.trim(),
        level: finalLevel,
        selectionMethod: 'direct',
        timestamp: new Date().toISOString()
    };
    
    try {
        // Show loading state
        const submitBtn = document.querySelector('.contact-submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        console.log('Submitting data:', submissionData);
        
        // Submit to Google Sheet
        const response = await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            body: JSON.stringify(submissionData),
            mode: 'no-cors'
        });
        
        // Get the correct URL for the selected program
        const redirectUrl = PROGRAM_URLS[selectedProgram.trim()] || PROGRAM_URLS['Fit'];
        
        // Redirect to the specific program URL
        window.location.href = redirectUrl;
        
    } catch (error) {
        console.error('Error submitting contact:', error);
        alert('There was an error submitting your information. Please try again.');
        
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
} 