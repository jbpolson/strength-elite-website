// Define URLs globally
window.PROGRAM_URLS = {
    'hyrox': 'https://share.newie.app/offerings/EFA35DBE-7FA3-42AA-8560-907EFDCA567B',
    'mass': 'https://share.newie.app/offerings/1C6A39F9-5200-4618-BD3C-1B7595C687A0',
    'competition': 'https://share.newie.app/offerings/YOUR_COMPETITION_ID', // Need new URL
    'lean': 'https://share.newie.app/offerings/YOUR_LEAN_ID' // Need new URL
};

window.GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxtawnh7ODv7G_p772156fion8IazSjec_Kr3_T07YL165-2sLI6XrC9EhjXHcsBNG_/exec';

// Move SURVEY_CONFIG to global scope
window.SURVEY_CONFIG = {
    hyrox: {
        title: "HYROX Level Assessment",
        description: "Let's determine your ideal HYROX program level based on your current fitness and experience.",
        questions: [
            {
                id: 'run_time',
                text: "What's your current 5km run time?",
                options: [
                    { text: 'Under 17 mins', value: 'elite' },
                    { text: 'Under 20 mins', value: 'advanced' },
                    { text: 'Under 35 mins', value: 'intermediate' }
                ]
            },
            {
                id: 'wall_balls',
                text: "How many unbroken wall balls (20/14 lbs) can you perform?",
                options: [
                    { text: '30+ reps', value: 'elite' },
                    { text: '15-30 reps', value: 'advanced' },
                    { text: 'Under 15 reps', value: 'intermediate' }
                ]
            },
            {
                id: 'farmers_carry',
                text: "Farmers carry (2x24kg/2x16kg) - How far can you go without stopping?",
                options: [
                    { text: '400m+', value: 'elite' },
                    { text: '200-400m', value: 'advanced' },
                    { text: 'Under 200m', value: 'intermediate' }
                ]
            },
            {
                id: 'sled_experience',
                text: "Sled push/pull experience level?",
                options: [
                    { text: 'Regular competitor', value: 'elite' },
                    { text: 'Some experience', value: 'advanced' },
                    { text: 'Beginner', value: 'intermediate' }
                ]
            },
            {
                id: 'competition_experience',
                text: "Previous HYROX competition experience?",
                options: [
                    { text: 'Multiple competitions', value: 'elite' },
                    { text: 'One competition', value: 'advanced' },
                    { text: 'Never competed', value: 'intermediate' }
                ]
            }
        ]
    },
    competition: {
        title: "Competition Program Focus",
        description: "Let's determine your ideal training focus based on your sport and season.",
        questions: [
            {
                id: 'sport_type',
                text: "What type of sport do you compete in?",
                options: [
                    { text: 'Endurance (running, triathlon)', value: 'endurance' },
                    { text: 'Strength/Power (team sports, powerlifting, CrossFit)', value: 'strength' }
                ]
            },
            {
                id: 'season_phase',
                text: "Which phase of your season are you in?",
                options: [
                    { text: 'Pre-Season (building block)', value: 'pre_season' },
                    { text: 'During-Season (maintenance/peak)', value: 'during_season' }
                ]
            }
        ]
    },
    mass: {
        title: "Mass Program Level Assessment",
        description: "Let's determine your ideal mass program level based on your experience and capabilities.",
        questions: [
            {
                id: 'bench_press',
                text: "What's your current bench press 1RM (relative to bodyweight)?",
                options: [
                    { text: 'More than 1.5x bodyweight', value: 'elite' },
                    { text: '1.2-1.5x bodyweight', value: 'advanced' },
                    { text: 'Less than 1.2x bodyweight', value: 'intermediate' }
                ]
            },
            {
                id: 'squat_experience',
                text: "Squat experience and form?",
                options: [
                    { text: 'Perfect form, heavy loads', value: 'elite' },
                    { text: 'Good form, moderate loads', value: 'advanced' },
                    { text: 'Learning proper form', value: 'intermediate' }
                ]
            },
            {
                id: 'training_experience',
                text: "Training experience with hypertrophy programs?",
                options: [
                    { text: '5+ years', value: 'elite' },
                    { text: '2-5 years', value: 'advanced' },
                    { text: '0-2 years', value: 'intermediate' }
                ]
            }
        ]
    },
    lean: {
        title: "Lean Program Focus",
        description: "Let's determine your ideal lean program focus based on your goals.",
        questions: [
            {
                id: 'gender_focus',
                text: "Which program focus interests you?",
                options: [
                    { text: "Men's Lean", value: 'mens' },
                    { text: "Women's Lean", value: 'womens' }
                ]
            },
            {
                id: 'program_emphasis',
                text: "What's your primary focus?",
                options: [
                    { text: 'Pure aesthetics', value: 'aesthetic' },
                    { text: 'Aesthetics with performance', value: 'performance' }
                ]
            }
        ]
    }
};

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

    // Program Modal Handling
    function initializeProgramModals() {
        console.log('=== Initialize Program Modals ===');
        
        // Remove any existing event listeners
        const findProgramTriggers = document.querySelectorAll('.find-program-trigger');
        console.log('Found Find Program triggers:', findProgramTriggers.length);
        
        findProgramTriggers.forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });
        
        // Log all program buttons found
        const programButtons = document.querySelectorAll('.program-button');
        console.log('Found program buttons:', programButtons.length);
        programButtons.forEach(button => {
            console.log('Program button:', button.dataset.program);
        });

        programButtons.forEach(button => {
            const programType = button.dataset.program;
            console.log('Setting up listener for:', programType);
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Program button clicked:', programType);
                
                const modal = document.getElementById(`${programType}-modal`);
                console.log('Found modal:', !!modal, `(${programType}-modal)`);
                
                if (modal) {
                    modal.classList.add('active');
                    
                    const findLevelBtn = modal.querySelector('.find-program-trigger');
                    console.log('Found Find Level button:', !!findLevelBtn);
                    
                    if (findLevelBtn) {
                        findLevelBtn.addEventListener('click', () => {
                            console.log('Find Level clicked for:', programType);
                            modal.classList.remove('active');
                            openProgramAssessment(programType);
                        });
                    }
                }
            });
        });
    }

    // Hide the Find Program button in the programs section
    const findProgramButton = document.querySelector('.programs-cta');
    if (findProgramButton) {
        findProgramButton.style.display = 'none';
    }

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
            const modal = document.querySelector('.contact-capture-modal');
            const nameInput = modal.querySelector('#nameInput');
            const emailInput = modal.querySelector('#emailInput');
            
            // Validate inputs exist and have values
            if (!nameInput || !emailInput) {
                console.error('Form inputs not found');
                return;
            }
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            
            // Validate input values
            if (!name || !email) {
                alert('Please fill in all fields');
                return;
            }
            
            try {
                // Add processing state
                submitBtn.classList.add('processing');
                submitBtn.disabled = true;
                
                // Get the program and level from data attributes
                const programType = modal.dataset.program;
                const programLevel = modal.dataset.level;
                
                console.log('Submitting data:', { programType, programLevel, name, email });
                
                const response = await fetch(window.GOOGLE_SHEET_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        program: programType,
                        level: programLevel,
                        timestamp: new Date().toISOString()
                    })
                });
                
                // Remove processing state
                submitBtn.classList.remove('processing');
                submitBtn.disabled = false;
                
                // Close contact modal
                modal.classList.remove('active');
                document.body.style.overflow = '';
                
                // Execute callback if exists
                const callback = window[modal.dataset.callback];
                if (typeof callback === 'function') {
                    callback();
                }
                
            } catch (error) {
                // Remove processing state on error
                submitBtn.classList.remove('processing');
                submitBtn.disabled = false;
                
                console.error('Submission error:', error);
                alert('There was an error submitting your information. Please try again.');
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

    // Remove any conflicting event listeners from survey.js
    const findProgramButtons = document.querySelectorAll('.find-program-trigger');
    findProgramButtons.forEach(button => {
        const newBtn = button.cloneNode(true);
        button.parentNode.replaceChild(newBtn, button);
    });

    // Update level selection handler
    const levelOptions = document.querySelectorAll('.level-adjust .option');
    if (levelOptions) {
        levelOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Update selected level
                const newLevel = this.textContent;
                
                // Update display text
                const levelDisplay = document.querySelector('.selected-level-display');
                if (levelDisplay) {
                    levelDisplay.textContent = newLevel;
                }
                
                // Update modal dataset
                const modal = document.querySelector('.contact-capture-modal');
                if (modal) {
                    modal.dataset.level = newLevel;
                }
                
                // Update visual selection state
                levelOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    }
});

// Add scroll event listener to verify scrolling
window.addEventListener('scroll', function() {
    console.log('Page scrolled to:', window.scrollY);
});

function renderAssessmentQuestion(questionIndex, container, programType) {
    const questions = window.SURVEY_CONFIG[programType].questions;
    const question = questions[questionIndex];
    
    container.innerHTML = `
        <div class="survey-question">${question.text}</div>
        <div class="survey-options">
            ${question.options.map(option => `
                <div class="option" data-value="${option.value}">
                    ${option.text}
                </div>
            `).join('')}
        </div>
    `;

    // Add click handlers for options
    container.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected class from all options
            container.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            // Add selected class to clicked option
            option.classList.add('selected');
        });
    });

    // Update progress and navigation
    const modal = container.closest('.survey-modal');
    modal.querySelector('.current-question').textContent = questionIndex + 1;
    modal.querySelector('.total-questions').textContent = questions.length;
    
    // Show/hide back button based on question index
    const backBtn = modal.querySelector('.survey-back-btn');
    backBtn.style.display = questionIndex === 0 ? 'none' : 'block';
}

function handleAssessmentNavigation(programType) {
    console.log('Handling assessment navigation for:', programType); // Debug log
    
    const modal = document.getElementById(`${programType}-assessment`);
    const selectedOption = modal.querySelector('.option.selected');
    
    if (!selectedOption) {
        alert('Please select an option to continue');
        return;
    }
    
    // Store answer
    if (!window.assessmentAnswers) window.assessmentAnswers = [];
    window.assessmentAnswers[window.currentQuestionIndex] = selectedOption.dataset.value;
    
    const questions = window.SURVEY_CONFIG[programType].questions;
    if (window.currentQuestionIndex === questions.length - 1) {
        console.log('Final question completed'); // Debug log
        
        // Determine level based on answers
        const level = determineLevel(window.assessmentAnswers);
        console.log('Determined level:', level); // Debug log
        
        // Close assessment modal
        modal.classList.remove('active');
        
        // Show contact capture
        showContactCapture(programType, level, () => {
            // After successful contact capture, show recommendation
            showAssessmentRecommendation({
                program: programType,
                level: level,
                programReason: getProgramSpecificReason(programType),
                levelReason: getAssessmentLevelReason(level, window.assessmentAnswers)
            });
        });
    } else {
        // Next question
        window.currentQuestionIndex++;
        renderAssessmentQuestion(
            window.currentQuestionIndex,
            modal.querySelector('.survey-question-container'),
            programType
        );
    }
}

function handleAssessmentBack(programType) {
    if (window.currentQuestionIndex > 0) {
        window.currentQuestionIndex--;
        const modal = document.getElementById(`${programType}-assessment`);
        renderAssessmentQuestion(
            window.currentQuestionIndex,
            modal.querySelector('.survey-question-container'),
            programType
        );
    }
}

function initializeProgramAssessment(programType) {
    const modal = document.getElementById(`${programType}-assessment`);
    if (!modal) return;

    console.log('Initializing assessment for:', programType); // Debug log

    // Reset assessment state
    window.currentQuestionIndex = 0;
    window.assessmentAnswers = [];
    
    // Get question container
    const questionContainer = modal.querySelector('.survey-question-container');
    
    // Show first question
    renderAssessmentQuestion(0, questionContainer, programType);
    
    // Add navigation handlers
    const nextBtn = modal.querySelector('.survey-next-btn');
    const backBtn = modal.querySelector('.survey-back-btn');
    
    if (nextBtn) {
        // Remove any existing listeners
        const newBtn = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newBtn, nextBtn);
        
        newBtn.addEventListener('click', () => {
            console.log('Next button clicked'); // Debug log
            handleAssessmentNavigation(programType);
        });
    }
    
    if (backBtn) {
        // Remove any existing listeners
        const newBackBtn = backBtn.cloneNode(true);
        backBtn.parentNode.replaceChild(newBackBtn, backBtn);
        
        newBackBtn.addEventListener('click', () => {
            handleAssessmentBack(programType);
        });
    }
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

function openGeneralSurvey() {
    // Show level choice modal
    const levelChoiceModal = document.querySelector('.level-choice-modal');
    if (levelChoiceModal) {
        levelChoiceModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function renderGeneralSurveyQuestion(questionIndex, container) {
    const question = GENERAL_SURVEY_QUESTIONS[questionIndex];
    
    // Update progress display
    const currentQuestion = document.querySelector('.current-question');
    const totalQuestions = document.querySelector('.total-questions');
    if (currentQuestion) currentQuestion.textContent = questionIndex + 1;
    if (totalQuestions) totalQuestions.textContent = GENERAL_SURVEY_QUESTIONS.length;
    
    // Update back button visibility
    const backBtn = document.querySelector('.survey-back-btn');
    if (backBtn) {
        backBtn.style.display = questionIndex === 0 ? 'none' : 'block';
    }
    
    // Update next button text
    const nextBtn = document.querySelector('.survey-next-btn');
    if (nextBtn) {
        nextBtn.textContent = questionIndex === GENERAL_SURVEY_QUESTIONS.length - 1 ? 'Finish' : 'Next';
    }
    
    // Create question HTML
    let questionHtml = `
        <div class="survey-question">
            <h3>${question.text}</h3>
            <div class="survey-options">
    `;
    
    question.options.forEach(option => {
        questionHtml += `
            <label class="survey-option">
                <input type="radio" name="question${questionIndex}" value="${option.value}">
                <span class="option-text">${option.text}</span>
            </label>
        `;
    });
    
    questionHtml += `
            </div>
        </div>
    `;
    
    container.innerHTML = questionHtml;
}

function handleGeneralSurveyNavigation() {
    const currentIndex = window.currentQuestionIndex || 0;
    const selectedOption = document.querySelector(`input[name="question${currentIndex}"]:checked`);
    
    if (!selectedOption) {
        alert('Please select an option to continue');
        return;
    }
    
    // Store answer
    if (!window.generalSurveyAnswers) window.generalSurveyAnswers = [];
    window.generalSurveyAnswers[currentIndex] = selectedOption.value;
    
    if (currentIndex === GENERAL_SURVEY_QUESTIONS.length - 1) {
        // Last question - determine program recommendation
        const recommendedProgram = determineRecommendedProgram(window.generalSurveyAnswers);
        
        // Close survey modal
        const surveyModal = document.getElementById('survey-modal');
        surveyModal.classList.remove('active');
        
        // Show program recommendation
        showProgramRecommendation(recommendedProgram);
    } else {
        // Show next question
        window.currentQuestionIndex = currentIndex + 1;
        const container = document.querySelector('.survey-question-container');
        renderGeneralSurveyQuestion(window.currentQuestionIndex, container);
    }
}

function handleGeneralSurveyBack() {
    if (window.currentQuestionIndex > 0) {
        window.currentQuestionIndex--;
        const modal = document.getElementById('survey-modal');
        renderGeneralSurveyQuestion(
            window.currentQuestionIndex,
            modal.querySelector('.survey-question-container')
        );
    }
}

function determineRecommendedProgram(answers) {
    const scores = {
        hyrox: 0,
        competition: 0,
        mass: 0,
        lean: 0
    };
    
    // Count votes for each program
    answers.forEach(answer => {
        if (answer) scores[answer]++;
    });
    
    // Find program with highest score
    let recommendedProgram = 'lean'; // Default
    let maxScore = -1;
    
    Object.entries(scores).forEach(([program, score]) => {
        if (score > maxScore) {
            maxScore = score;
            recommendedProgram = program;
        }
    });
    
    return recommendedProgram;
}

function showProgramRecommendation(program) {
    const modal = document.getElementById(`${program}-modal`);
    if (modal) {
        modal.classList.add('active');
    }
}

function determineRecommendation(answers) {
    const programCounts = {
        hyrox: 0,
        mass: 0,
        fit: 0
    };
    
    const levelCounts = {
        elite: 0,
        advanced: 0,
        intermediate: 0
    };
    
    // Process each answer
    answers.forEach((answer, index) => {
        // Update program counts
        programCounts[answer.program]++;
        
        // Update level counts based on question-specific logic
        switch(index) {
            case 0: // Primary goal
                if (answer.program === 'hyrox') levelCounts.elite++;
                else if (answer.program === 'mass') levelCounts.advanced++;
                else levelCounts.intermediate++;
                break;
            case 1: // Training style
                if (answer.program === 'hyrox' || answer.program === 'mass') levelCounts.advanced++;
                else levelCounts.intermediate++;
                break;
            case 2: // Time commitment
                if (answer.timeCommitment === 'high') levelCounts.elite++;
                else if (answer.timeCommitment === 'medium') levelCounts.advanced++;
                else levelCounts.intermediate++;
                break;
            case 3: // Results motivation
                if (answer.program === 'hyrox') {
                    Math.random() > 0.5 ? levelCounts.elite++ : levelCounts.advanced++;
                } else if (answer.program === 'mass') {
                    levelCounts.advanced++;
                }
                break;
            case 4: // Training environment
                if (answer.program !== 'fit') levelCounts.advanced++;
                break;
        }
    });
    
    // Determine program
    let recommendedProgram = 'fit';
    let maxCount = programCounts.fit;
    
    if (programCounts.hyrox > maxCount) {
        recommendedProgram = 'hyrox';
        maxCount = programCounts.hyrox;
    }
    if (programCounts.mass > maxCount) {
        recommendedProgram = 'mass';
    }
    
    // Determine level
    let recommendedLevel = 'intermediate';
    if (levelCounts.elite >= 2) recommendedLevel = 'elite';
    else if (levelCounts.advanced >= 3) recommendedLevel = 'advanced';
    
    return {
        program: recommendedProgram,
        level: recommendedLevel,
        programReason: getProgramReason(recommendedProgram, answers),
        levelReason: getLevelReason(recommendedLevel, levelCounts)
    };
}

function showRecommendation(recommendation) {
    const modal = document.getElementById('survey-modal');
    const container = modal.querySelector('.survey-question-container');
    
    container.innerHTML = `
        <div class="survey-question">Your Recommended Program</div>
        
        <div class="recommendation-section">
            <div class="recommendation-group">
                <h3>Program</h3>
                <div class="recommendation-value">${recommendation.program.toUpperCase()}</div>
                <p class="recommendation-reason">${recommendation.programReason}</p>
                <div class="survey-options">
                    <div class="option ${recommendation.program === 'Hyrox' ? 'selected' : ''}" data-value="Hyrox">
                        Hyrox
                    </div>
                    <div class="option ${recommendation.program === 'Mass' ? 'selected' : ''}" data-value="Mass">
                        Mass
                    </div>
                    <div class="option ${recommendation.program === 'Fit' ? 'selected' : ''}" data-value="Fit">
                        Fit
                    </div>
                </div>
            </div>
            
            <div class="recommendation-group">
                <h3>Level</h3>
                <div class="recommendation-value">${recommendation.level.toUpperCase()}</div>
                <p class="recommendation-reason">${recommendation.levelReason}</p>
                <div class="survey-options">
                    <div class="option ${recommendation.level === 'Elite' ? 'selected' : ''}" data-value="Elite">
                        Elite
                    </div>
                    <div class="option ${recommendation.level === 'Advanced' ? 'selected' : ''}" data-value="Advanced">
                        Advanced
                    </div>
                    <div class="option ${recommendation.level === 'Intermediate' ? 'selected' : ''}" data-value="Intermediate">
                        Intermediate
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add click handlers for both program and level options
    container.querySelectorAll('.survey-options').forEach(optionGroup => {
        optionGroup.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', () => {
                // Only remove selected from siblings in same group
                optionGroup.querySelectorAll('.option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');
            });
        });
    });

    // Update navigation
    const nextBtn = modal.querySelector('.survey-next-btn');
    if (nextBtn) {
        // Clear existing listeners
        const newBtn = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newBtn, nextBtn);
        
        // Update button text
        newBtn.textContent = 'Confirm & Continue';
        
        // Add new click handler
        newBtn.addEventListener('click', () => {
            const selectedProgram = container.querySelector('.recommendation-group:first-child .option.selected');
            const selectedLevel = container.querySelector('.recommendation-group:last-child .option.selected');
            
            if (!selectedProgram || !selectedLevel) {
                alert('Please select both a program and level to continue');
                return;
            }

            const finalProgram = selectedProgram.dataset.value;
            const finalLevel = selectedLevel.dataset.value;
            
            // Close survey modal
            modal.classList.remove('active');
            
            // Show contact capture
            showContactCapture(finalProgram, finalLevel, null, true);
        });
    }
    
    // Hide back button and progress on final slide
    const backBtn = modal.querySelector('.survey-back-btn');
    const progress = modal.querySelector('.survey-progress');
    
    if (backBtn) backBtn.style.display = 'none';
    if (progress) progress.style.display = 'none';
}

function getProgramReason(program, answers) {
    const reasons = {
        hyrox: [
            "Your focus on performance and endurance aligns with HYROX training",
            "You're interested in functional fitness competition",
            "Your time commitment matches HYROX training demands"
        ],
        mass: [
            "Your goals align with building muscle and strength",
            "You prefer traditional weight training",
            "You're focused on physical transformation"
        ],
        fit: [
            "You're looking for balanced, overall fitness",
            "You value flexibility in training location",
            "You want a well-rounded approach to health"
        ]
    };
    
    // Pick a relevant reason based on answers
    const reasonIndex = answers.filter(a => a.program === program).length - 1;
    return reasons[program][Math.min(reasonIndex, 2)];
}

function getLevelReason(level, counts) {
    const reasons = {
        elite: [
            "Your current training volume and experience",
            "Your performance-focused mindset",
            "Your advanced training background"
        ],
        advanced: [
            "Your consistent training history",
            "Your demonstrated commitment",
            "Your existing fitness foundation"
        ],
        intermediate: [
            "A balanced starting point for progression",
            "Room for sustainable growth",
            "Focus on proper form and technique"
        ]
    };
    
    // Pick reason based on counts distribution
    const totalCounts = counts.elite + counts.advanced + counts.intermediate;
    const reasonIndex = Math.floor((counts[level] / totalCounts) * 3);
    return reasons[level][Math.min(reasonIndex, 2)];
}

function getTimeCommitment(value, questionIndex) {
    // Only return time commitment for the relevant question
    if (questionIndex === 2) { // Time commitment question
        if (value === 'hyrox') return 'high';
        if (value === 'mass') return 'medium';
        return 'low';
    }
    return null;
}

function showAssessmentRecommendation(recommendation) {
    const modal = document.getElementById(`${recommendation.program}-assessment`);
    const container = modal.querySelector('.survey-question-container');
    
    container.innerHTML = `
        <div class="survey-question">Your Recommended Level</div>
        
        <div class="recommendation-section">
            <div class="recommendation-group">
                <h3>Program</h3>
                <div class="recommendation-value">${recommendation.program.toUpperCase()}</div>
                <p class="recommendation-reason">${recommendation.programReason}</p>
            </div>
            
            <div class="recommendation-group">
                <h3>Level</h3>
                <div class="recommendation-value">${recommendation.level.toUpperCase()}</div>
                <p class="recommendation-reason">${recommendation.levelReason}</p>
                <div class="survey-options">
                    <div class="option ${recommendation.level === 'elite' ? 'selected' : ''}" data-value="elite">
                        Elite
                    </div>
                    <div class="option ${recommendation.level === 'advanced' ? 'selected' : ''}" data-value="advanced">
                        Advanced
                    </div>
                    <div class="option ${recommendation.level === 'intermediate' ? 'selected' : ''}" data-value="intermediate">
                        Intermediate
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add click handlers for level options
    container.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
            container.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            option.classList.add('selected');
        });
    });

    // Update navigation
    const nextBtn = modal.querySelector('.survey-next-btn');
    if (nextBtn) {
        // Clear existing listeners
        const newBtn = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newBtn, nextBtn);
        
        // Update button text
        newBtn.textContent = 'Confirm & Continue';
        
        // Add new click handler
        newBtn.addEventListener('click', () => {
            const selectedOption = container.querySelector('.option.selected');
            if (selectedOption) {
                const finalLevel = selectedOption.dataset.value;
                
                // Close assessment modal
                modal.classList.remove('active');
                
                // Show contact capture
                showContactCapture(recommendation.program, finalLevel, null, true);
            } else {
                alert('Please select a level to continue');
            }
        });
    }
    
    // Hide back button and progress on final slide
    const backBtn = modal.querySelector('.survey-back-btn');
    const progress = modal.querySelector('.survey-progress');
    
    if (backBtn) backBtn.style.display = 'none';
    if (progress) progress.style.display = 'none';
}

function showContactCapture(programType, level, callback, isGeneralSurvey = false) {
    const modal = document.querySelector('.contact-capture-modal');
    if (!modal) {
        console.error('Contact capture modal not found');
        return;
    }
    
    // Store program and level info on the modal
    modal.dataset.program = programType || '';
    modal.dataset.level = level || '';
    
    // Update display text
    const programDisplay = modal.querySelector('.selected-program-display');
    const levelDisplay = modal.querySelector('.selected-level-display');
    const levelAdjust = modal.querySelector('.level-adjust');
    
    // Format program name - capitalize first letter
    const formattedProgram = programType.charAt(0).toUpperCase() + programType.slice(1).toLowerCase();
    
    // Format level display
    const formattedLevel = level ? level.charAt(0).toUpperCase() + level.slice(1).toLowerCase() : '';
    
    if (programDisplay) {
        programDisplay.textContent = formattedProgram;
    }
    if (levelDisplay) {
        levelDisplay.textContent = formattedLevel;
    }

    // Update level adjustment options based on program type
    if (levelAdjust) {
        const optionsContainer = levelAdjust.querySelector('.options');
        if (optionsContainer) {
            let optionsHtml = '';
            
            switch(programType.toLowerCase()) {
                case 'lean':
                    optionsHtml = `
                        <div class="option" data-value="mens">Men's</div>
                        <div class="option" data-value="womens">Women's</div>
                    `;
                    break;
                case 'competition':
                    optionsHtml = `
                        <div class="option" data-value="endurance">Endurance</div>
                        <div class="option" data-value="strength">Strength</div>
                    `;
                    break;
                case 'hyrox':
                case 'mass':
                    optionsHtml = `
                        <div class="option" data-value="elite">Elite</div>
                        <div class="option" data-value="advanced">Advanced</div>
                        <div class="option" data-value="intermediate">Intermediate</div>
                    `;
                    break;
            }
            
            optionsContainer.innerHTML = optionsHtml;
            
            // Add click handlers for new options
            const options = optionsContainer.querySelectorAll('.option');
            options.forEach(option => {
                option.addEventListener('click', function() {
                    const newLevel = this.textContent;
                    levelDisplay.textContent = newLevel;
                    modal.dataset.level = this.dataset.value;
                    options.forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');
                });
            });

            // Highlight the current selection
            const currentOption = optionsContainer.querySelector(`[data-value="${level.toLowerCase()}"]`);
            if (currentOption) {
                currentOption.classList.add('selected');
            }
        }
    }
    
    // Store callback name if provided
    if (callback) {
        const callbackName = 'contactCallback_' + Date.now();
        window[callbackName] = callback;
        modal.dataset.callback = callbackName;
    }
    
    // Clear any existing values
    const nameInput = modal.querySelector('#nameInput');
    const emailInput = modal.querySelector('#emailInput');
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    
    // Show the modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function initializeSurvey() {
    const surveyModal = document.getElementById('survey-modal');
    if (!surveyModal) return;

    // Reset survey state
    window.currentQuestionIndex = 0;
    window.surveyAnswers = [];
    
    // Get question container
    const questionContainer = surveyModal.querySelector('.survey-question-container');
    
    // Show first question
    renderGeneralSurveyQuestion(0, questionContainer);
    
    // Add navigation handlers
    const nextBtn = surveyModal.querySelector('.survey-next-btn');
    const backBtn = surveyModal.querySelector('.survey-back-btn');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', handleGeneralSurveyNavigation);
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', handleGeneralSurveyBack);
    }
}

function getProgramSpecificReason(programType) {
    const reasons = {
        hyrox: "Based on your answers, you're ready for HYROX-specific training",
        mass: "Your goals align with our structured mass building program",
        fit: "This program matches your fitness objectives and schedule"
    };
    return reasons[programType] || "This program matches your goals and experience level";
}

function getAssessmentLevelReason(level, answers) {
    const reasons = {
        elite: "Your assessment shows you're ready for elite-level training",
        advanced: "You have the foundation needed for advanced programming",
        intermediate: "This level will provide the right balance of challenge and progression"
    };
    return reasons[level] || "This level matches your current capabilities";
}

// Add new function to handle program assessment
window.openProgramAssessment = function(programType) {
    console.log('=== Opening Program Assessment ===');
    console.log('Program Type:', programType);
    
    const config = window.SURVEY_CONFIG[programType];
    console.log('Found config:', !!config);
    
    if (!config) {
        console.error('No survey config found for program:', programType);
        return;
    }

    const assessmentModal = document.getElementById('survey-modal');
    console.log('Found assessment modal:', !!assessmentModal);
    
    if (assessmentModal) {
        const titleEl = assessmentModal.querySelector('.survey-program-title');
        const descEl = assessmentModal.querySelector('.survey-program-desc');
        
        console.log('Found title element:', !!titleEl);
        console.log('Found description element:', !!descEl);
        
        if (titleEl) titleEl.textContent = config.title;
        if (descEl) descEl.textContent = config.description;
        
        console.log('Initializing first question');
        renderProgramQuestion(programType, 0);
        
        assessmentModal.classList.add('active');
    }
}

// Add these functions to handle program-specific surveys
function renderProgramQuestion(programType, questionIndex) {
    console.log('=== Rendering Program Question ===');
    console.log('Program:', programType);
    console.log('Question Index:', questionIndex);
    
    const config = window.SURVEY_CONFIG[programType];
    const question = config?.questions[questionIndex];
    
    console.log('Found question config:', !!question);
    
    if (!config || !question) {
        console.error('Invalid question configuration');
        return;
    }

    const surveyModal = document.getElementById('survey-modal');
    console.log('Found survey modal:', !!surveyModal);
    
    if (surveyModal) {
        const elements = {
            questionContainer: surveyModal.querySelector('.survey-question-container'),
            nextBtn: surveyModal.querySelector('.survey-next-btn'),
            backBtn: surveyModal.querySelector('.survey-back-btn'),
            currentQuestion: surveyModal.querySelector('.current-question'),
            totalQuestions: surveyModal.querySelector('.total-questions')
        };
        
        // Update progress display
        if (elements.currentQuestion) elements.currentQuestion.textContent = questionIndex + 1;
        if (elements.totalQuestions) elements.totalQuestions.textContent = config.questions.length;
        
        // Show/hide back button
        if (elements.backBtn) {
            elements.backBtn.style.display = questionIndex === 0 ? 'none' : 'block';
        }

        // Update next button text
        if (elements.nextBtn) {
            elements.nextBtn.textContent = questionIndex === config.questions.length - 1 ? 'Finish' : 'Next';
        }

        // Create question HTML
        let questionHtml = `
            <div class="survey-question">
                <h3>${question.text}</h3>
                <div class="survey-options">
        `;

        question.options.forEach(option => {
            questionHtml += `
                <label class="survey-option">
                    <input type="radio" name="q${questionIndex}" value="${option.value}">
                    <span class="option-text">${option.text}</span>
                </label>
            `;
        });

        questionHtml += `
                </div>
            </div>
        `;

        if (elements.questionContainer) {
            elements.questionContainer.innerHTML = questionHtml;
        }

        // Update navigation handlers
        if (elements.nextBtn) {
            elements.nextBtn.onclick = () => handleProgramQuestionNavigation(programType, questionIndex);
        }
        if (elements.backBtn) {
            elements.backBtn.onclick = () => handleProgramQuestionBack(programType, questionIndex);
        }
    }
}

function handleProgramQuestionNavigation(programType, currentIndex) {
    const surveyModal = document.getElementById('survey-modal');
    const selectedOption = surveyModal.querySelector('input[name="q' + currentIndex + '"]:checked');
    
    if (!selectedOption) {
        alert('Please select an option to continue');
        return;
    }

    // Store answer
    if (!window.programAnswers) window.programAnswers = [];
    window.programAnswers[currentIndex] = selectedOption.value;

    const config = window.SURVEY_CONFIG[programType];
    if (currentIndex === config.questions.length - 1) {
        // Last question - determine recommendation
        const recommendation = determineProgramRecommendation(programType, window.programAnswers);
        
        // Close survey modal
        surveyModal.classList.remove('active');
        
        // Show contact capture with program info
        const programInfo = {
            type: programType,
            level: recommendation.level || recommendation.focus,
            phase: recommendation.phase || null
        };
        
        showContactCapture(
            programInfo.type,
            programInfo.level,
            () => {
                // After successful contact capture, redirect to program URL
                const programUrl = window.PROGRAM_URLS[programType.toLowerCase()];
                if (programUrl) {
                    window.location.href = programUrl;
                }
            },
            false
        );
    } else {
        // Show next question
        renderProgramQuestion(programType, currentIndex + 1);
    }
}

function handleProgramQuestionBack(programType, currentIndex) {
    if (currentIndex > 0) {
        renderProgramQuestion(programType, currentIndex - 1);
    }
}

function determineProgramRecommendation(programType, answers) {
    // Handle different program types
    switch(programType) {
        case 'competition':
            return {
                focus: answers[0], // sport type
                phase: answers[1]  // season phase
            };
        case 'lean':
            return {
                focus: answers[0], // gender focus
                emphasis: answers[1] // program emphasis
            };
        default:
            // For programs with levels (Hyrox, Mass)
            return {
                level: determineLevel(answers)
            };
    }
}

function getProgramRecommendationReason(programType) {
    const reasons = {
        hyrox: "Based on your answers, you're interested in structured training for fitness racing events.",
        competition: "Your focus on sport-specific performance makes our Competition program ideal.",
        mass: "Your goals and experience align with our dedicated muscle-building program.",
        lean: "The Lean program will help you achieve the athletic physique you're looking for."
    };
    return reasons[programType] || "This program matches your goals and preferences";
}

function showGeneralRecommendation(programType) {
    const modal = document.getElementById('recommendation-modal');
    if (modal) {
        const content = modal.querySelector('.recommendation-content');
        content.innerHTML = `
            <h2>Your Recommended Program</h2>
            <div class="program-recommendation">
                <h3>${programType.toUpperCase()}</h3>
                <p>${getProgramRecommendationReason(programType)}</p>
            </div>
            <button class="button button-primary continue-to-program" data-program="${programType}">
                Continue to ${programType.toUpperCase()} Program
                <span class="button-arrow">→</span>
            </button>
        `;
        
        modal.classList.add('active');
    }
} 