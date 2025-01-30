document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Check if programs section exists
    const programsSection = document.getElementById('programs');
    console.log('Programs section exists:', !!programsSection);
    
    // Use event delegation instead of individual listeners
    document.addEventListener('click', function(e) {
        // Find closest anchor tag if clicked element is nested
        const link = e.target.closest('a');
        
        if (link && link.getAttribute('href') && link.getAttribute('href').includes('#programs')) {
            e.preventDefault();
            console.log('Program link clicked');
            
            if (programsSection) {
                // Force scroll position calculation
                const rect = programsSection.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const targetPosition = rect.top + scrollTop - 120; // Account for header
                
                console.log('Scrolling to position:', targetPosition);
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });

    // Add scroll handler for navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) { // Add scrolled class after 50px scroll
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Constants
    const PROGRAM_URLS = {
        'Hyrox': 'https://share.newie.app/offerings/EFA35DBE-7FA3-42AA-8560-907EFDCA567B',
        'Mass': 'https://share.newie.app/offerings/1C6A39F9-5200-4618-BD3C-1B7595C687A0',
        'Fit': 'https://share.newie.app/offerings/5582A194-23C4-46BD-A061-2143F4D1ABBA'
    };

    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxtawnh7ODv7G_p772156fion8IazSjec_Kr3_T07YL165-2sLI6XrC9EhjXHcsBNG_/exec';

    const SURVEY_CONFIG = {
        hyrox: {
            title: "HYROX Level Assessment",
            description: "Let's determine your ideal HYROX program level based on your current fitness and experience.",
            questions: [
                {
                    id: 'run_time',
                    text: "What's your current 5km run time?",
                    options: [
                        { text: 'Under 20 mins', value: 'elite' },
                        { text: '20-25 mins', value: 'advanced' },
                        { text: 'Over 25 mins', value: 'intermediate' }
                    ]
                },
                // ... rest of your questions
            ]
        },
        mass: {
            // ... mass config
        },
        fit: {
            // ... fit config
        }
    };

    // Program Modal Handling
    function initializeProgramModals() {
        console.log('Initializing program modals');
        
        document.querySelectorAll('.program-button').forEach(button => {
            console.log('Found program button:', button.dataset.program);
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const programType = button.dataset.program;
                console.log('Button clicked for program:', programType);
                
                const modal = document.getElementById(`${programType}-modal`);
                if (modal) {
                    console.log('Opening modal for:', programType);
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                } else {
                    console.error('Modal not found for:', programType);
                }
            });
        });

        document.querySelectorAll('.modal-close').forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.program-modal');
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        document.querySelectorAll('.program-modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        document.querySelectorAll('.find-program-trigger').forEach(button => {
            button.addEventListener('click', () => {
                const programModal = button.closest('.program-modal');
                const programType = programModal.id.replace('-modal', '');
                
                // Close program info modal
                programModal.classList.remove('active');
                document.body.style.overflow = '';
                
                // Open corresponding assessment modal
                const assessmentModal = document.getElementById(`${programType}-assessment`);
                if (assessmentModal) {
                    assessmentModal.classList.add('active');
                    initializeProgramAssessment(programType);
                }
            });
        });
    }

    // Handle general Find Program button
    document.querySelector('.programs-cta .button').addEventListener('click', (e) => {
        e.preventDefault();
        openGeneralSurvey();
    });

    // Initialize modals
    initializeProgramModals();

    // Add close button handlers for assessment modals
    document.querySelectorAll('.survey-modal .survey-close-btn').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.survey-modal');
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Add click outside to close for assessment modals
    document.querySelectorAll('.survey-modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Add contact capture submission handler
    const submitBtn = document.querySelector('.contact-submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const nameInput = document.getElementById('directNameInput');
            const emailInput = document.getElementById('directEmailInput');
            const programDisplay = document.querySelector('.selected-program-display');
            const levelSelect = document.getElementById('directLevelSelect');
            
            // Validate inputs
            if (!nameInput.value || !emailInput.value) {
                alert('Please fill in both name and email');
                return;
            }
            
            try {
                // Show loading state
                submitBtn.textContent = 'Processing...';
                submitBtn.disabled = true;
                
                // Get program name and convert to lowercase for config lookup
                const programName = programDisplay.textContent.toLowerCase();
                
                // Get answers from stored survey answers
                const answers = window.surveyAnswers || [];
                
                const submissionData = {
                    name: nameInput.value,
                    email: emailInput.value,
                    program: programDisplay.textContent, // Keep original case for display
                    level: levelSelect.value,
                    answers: answers,
                    timestamp: new Date().toISOString()
                };

                console.log('Submitting data:', submissionData);
                
                // Submit to Google Sheet
                const response = await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(submissionData)
                });

                // Since we're using no-cors, we can't check the response
                console.log('Submission completed');
                
                // Get the program URL and redirect
                const programUrl = PROGRAM_URLS[submissionData.program];
                if (programUrl) {
                    console.log('Redirecting to:', programUrl);
                    
                    // Add a small delay to ensure the submission completes
                    setTimeout(() => {
                        window.location.href = programUrl;
                    }, 500);
                } else {
                    throw new Error('Program URL not found');
                }
                
            } catch (error) {
                console.error('Submission error:', error);
                alert('There was an error submitting your information. Please try again.');
                submitBtn.textContent = 'Continue to Program';
                submitBtn.disabled = false;
            }
        });
    }

    // Add close button handler for contact capture modal
    const contactModal = document.querySelector('.contact-capture-modal');
    const contactCloseBtn = contactModal.querySelector('.survey-close-btn');
    
    if (contactCloseBtn) {
        contactCloseBtn.addEventListener('click', () => {
            contactModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Also add click outside to close for contact capture modal
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Add this to your existing DOMContentLoaded event listener
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    menuToggle.addEventListener('click', () => {
        body.classList.toggle('menu-open');
    });

    // Close menu when clicking menu items
    document.querySelectorAll('.mobile-menu-item').forEach(item => {
        item.addEventListener('click', () => {
            body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            body.classList.remove('menu-open');
        }
    });
});

// Add scroll event listener to verify scrolling
window.addEventListener('scroll', function() {
    console.log('Page scrolled to:', window.scrollY);
});

function initializeProgramAssessment(programType) {
    const config = SURVEY_CONFIG[programType];
    const modal = document.getElementById(`${programType}-assessment`);
    const questionContainer = modal.querySelector('.survey-question-container');
    let currentQuestionIndex = 0;
    let answers = [];

    // Show first question
    renderQuestion(programType, currentQuestionIndex, questionContainer);

    // Add navigation handlers
    const nextBtn = modal.querySelector('.survey-next-btn');
    const backBtn = modal.querySelector('.survey-back-btn');

    nextBtn.addEventListener('click', () => {
        const selectedOption = modal.querySelector('input[name="question"]:checked');
        if (!selectedOption) {
            alert('Please select an option to continue');
            return;
        }

        // Store answer
        answers[currentQuestionIndex] = selectedOption.value;

        if (currentQuestionIndex === config.questions.length - 1) {
            // Last question - show results
            const level = determineLevel(answers);
            modal.classList.remove('active');
            document.body.style.overflow = '';
            showResults(programType, level, answers);
        } else {
            // Next question
            currentQuestionIndex++;
            renderQuestion(programType, currentQuestionIndex, questionContainer);
        }
    });

    backBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion(programType, currentQuestionIndex, questionContainer);
        }
    });
}

function renderQuestion(programType, questionIndex, container) {
    const config = SURVEY_CONFIG[programType];
    if (!config || !config.questions) {
        console.error('Survey configuration not found for program:', programType);
        return;
    }
    
    const question = config.questions[questionIndex];
    if (!question) {
        console.error('Question not found at index:', questionIndex);
        return;
    }
    
    container.innerHTML = `
        <div class="survey-question">${question.text}</div>
        <div class="survey-options">
            ${question.options.map(option => `
                <label class="survey-option">
                    <input type="radio" name="question" value="${option.value}">
                    <span class="option-text">${option.text}</span>
                </label>
            `).join('')}
        </div>
    `;
    
    // Update progress
    const modal = container.closest('.survey-modal');
    modal.querySelector('.current-question').textContent = questionIndex + 1;
    modal.querySelector('.total-questions').textContent = SURVEY_CONFIG[programType].questions.length;
    
    // Update navigation buttons
    const backBtn = modal.querySelector('.survey-back-btn');
    const nextBtn = modal.querySelector('.survey-next-btn');
    
    backBtn.style.display = questionIndex === 0 ? 'none' : 'block';
    nextBtn.textContent = questionIndex === SURVEY_CONFIG[programType].questions.length - 1 ? 'Finish' : 'Next';

    // Add click handlers for options
    container.querySelectorAll('.survey-option').forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected class from all options
            container.querySelectorAll('.survey-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            // Add selected class to clicked option
            option.classList.add('selected');
        });
    });
}

// Keep these functions outside since they're referenced by other code
function determineLevel(answers) {
    const counts = {
        elite: 0,
        advanced: 0,
        intermediate: 0
    };
    
    answers.forEach(answer => {
        counts[answer]++;
    });
    
    if (counts.elite >= 4) return 'Elite';
    if (counts.elite >= 2 || counts.advanced >= 3) return 'Advanced';
    return 'Intermediate';
}

function showResults(program, level, answers) {
    // Update contact capture modal with results
    const selectedProgramDisplay = document.querySelector('.selected-program-display');
    const selectedLevelDisplay = document.querySelector('.selected-level-display');
    const levelSelect = document.getElementById('directLevelSelect');
    
    selectedProgramDisplay.textContent = program.charAt(0).toUpperCase() + program.slice(1);
    selectedLevelDisplay.textContent = level;
    levelSelect.value = level;
    
    // Store the answers for submission
    window.surveyAnswers = answers;
    
    // Show contact capture modal
    const contactModal = document.querySelector('.contact-capture-modal');
    contactModal.classList.add('active');
} 