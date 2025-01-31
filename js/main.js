// Define URLs globally
window.PROGRAM_URLS = {
    'hyrox': 'https://share.newie.app/offerings/EFA35DBE-7FA3-42AA-8560-907EFDCA567B',
    'mass': 'https://share.newie.app/offerings/1C6A39F9-5200-4618-BD3C-1B7595C687A0',
    'fit': 'https://share.newie.app/offerings/5582A194-23C4-46BD-A061-2143F4D1ABBA'
};

window.GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxtawnh7ODv7G_p772156fion8IazSjec_Kr3_T07YL165-2sLI6XrC9EhjXHcsBNG_/exec';

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
                    
                    // Find and initialize the "Find My Level" button
                    const findLevelBtn = modal.querySelector('.find-program-trigger');
                    if (findLevelBtn) {
                        findLevelBtn.addEventListener('click', () => {
                            modal.classList.remove('active');
                            const assessmentModal = document.getElementById(`${programType}-assessment`);
                            if (assessmentModal) {
                                assessmentModal.classList.add('active');
                                initializeProgramAssessment(programType);
                            }
                        });
                    }
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
        
        // Get the survey modal
        const surveyModal = document.getElementById('survey-modal');
        if (surveyModal) {
            // Reset survey state
            window.currentQuestionIndex = 0;
            window.surveyAnswers = [];
            
            // Get question container
            const questionContainer = surveyModal.querySelector('.survey-question-container');
            
            // Show first question
            renderGeneralSurveyQuestion(0, questionContainer);
            
            // Show the modal
            surveyModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Add navigation handlers
            const nextBtn = surveyModal.querySelector('.survey-next-btn');
            const backBtn = surveyModal.querySelector('.survey-back-btn');
            
            nextBtn.addEventListener('click', handleGeneralSurveyNavigation);
            backBtn.addEventListener('click', handleGeneralSurveyBack);
        }
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
                const response = await fetch(window.GOOGLE_SHEET_URL, {
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
                const programUrl = window.PROGRAM_URLS[programName];
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

    // Remove any conflicting event listeners from survey.js
    const findProgramButtons = document.querySelectorAll('.find-program-trigger');
    findProgramButtons.forEach(button => {
        const newBtn = button.cloneNode(true);
        button.parentNode.replaceChild(newBtn, button);
    });
});

// Add scroll event listener to verify scrolling
window.addEventListener('scroll', function() {
    console.log('Page scrolled to:', window.scrollY);
});

function renderAssessmentQuestion(questionIndex, container, programType) {
    const questions = SURVEY_CONFIG[programType].questions;
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
    
    const questions = SURVEY_CONFIG[programType].questions;
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
    modal.querySelector('.total-questions').textContent = GENERAL_SURVEY_QUESTIONS.length;
    
    // Show/hide back button based on question index
    const backBtn = modal.querySelector('.survey-back-btn');
    backBtn.style.display = questionIndex === 0 ? 'none' : 'block';
}

function handleGeneralSurveyNavigation() {
    const modal = document.getElementById('survey-modal');
    const selectedOption = modal.querySelector('.option.selected');
    
    if (!selectedOption) {
        alert('Please select an option to continue');
        return;
    }
    
    // Store answer using the data-value attribute
    window.surveyAnswers[window.currentQuestionIndex] = {
        program: selectedOption.dataset.value,
        timeCommitment: getTimeCommitment(selectedOption.dataset.value, window.currentQuestionIndex)
    };
    
    if (window.currentQuestionIndex === GENERAL_SURVEY_QUESTIONS.length - 1) {
        // Get initial recommendation
        const recommendation = determineRecommendation(window.surveyAnswers);
        
        // Close survey modal
        modal.classList.remove('active');
        
        // Show contact capture first, then show recommendation
        showContactCapture(recommendation.program, recommendation.level, () => {
            showRecommendation(recommendation);
        }, true);
    } else {
        // Next question
        window.currentQuestionIndex++;
        renderGeneralSurveyQuestion(
            window.currentQuestionIndex,
            modal.querySelector('.survey-question-container')
        );
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

function determineProgram(answers) {
    const counts = {
        hyrox: 0,
        mass: 0,
        fit: 0
    };
    
    answers.forEach(answer => {
        counts[answer]++;
    });
    
    let recommendedProgram = 'Fit'; // Default to Fit
    let maxVotes = counts.fit;
    
    if (counts.hyrox > maxVotes) {
        recommendedProgram = 'Hyrox';
        maxVotes = counts.hyrox;
    }
    
    if (counts.mass > maxVotes) {
        recommendedProgram = 'Mass';
    }
    
    return recommendedProgram;
}

function showProgramRecommendation(program) {
    // Show the program modal for the recommended program
    const programModal = document.getElementById(`${program.toLowerCase()}-modal`);
    if (programModal) {
        programModal.classList.add('active');
        document.body.style.overflow = 'hidden';
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

function showContactCapture(program, level, onSuccess, isGeneralSurvey = false) {
    console.log('=== Contact Capture Debug ===');
    console.log('Attempting to show contact capture for:', program, level);
    
    const contactModal = document.querySelector('.contact-capture-modal');
    if (!contactModal) {
        console.error('CRITICAL ERROR: Contact modal not found in DOM');
        return;
    }

    // Set the survey type to control program options visibility
    contactModal.setAttribute('data-survey-type', isGeneralSurvey ? 'general' : 'assessment');

    // Force modal to be visible
    contactModal.style.cssText = `
        display: flex !important;
        visibility: visible !important;
        opacity: 1 !important;
        z-index: 2000 !important;
    `;
    contactModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Get form elements
    const programDisplay = contactModal.querySelector('.selected-program-display');
    const levelDisplay = contactModal.querySelector('.selected-level-display');
    const programOptions = contactModal.querySelector('.program-options');
    const levelOptions = contactModal.querySelector('.level-options');

    // Show/hide program options based on flow
    if (programOptions) {
        programOptions.style.display = isGeneralSurvey ? 'block' : 'none';
    }

    // Update displays with proper case
    const displayProgram = program.charAt(0).toUpperCase() + program.slice(1).toLowerCase();
    if (programDisplay) programDisplay.textContent = displayProgram;
    if (levelDisplay) levelDisplay.textContent = level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();

    // Set initial selections
    if (programOptions) {
        programOptions.querySelectorAll('.option').forEach(opt => {
            opt.classList.toggle('selected', opt.dataset.value.toLowerCase() === program.toLowerCase());
        });
    }
    if (levelOptions) {
        levelOptions.querySelectorAll('.option').forEach(opt => {
            opt.classList.toggle('selected', opt.dataset.value.toLowerCase() === level.toLowerCase());
        });
    }

    // Add click handlers for options
    contactModal.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
            const parent = option.closest('.program-options, .level-options');
            parent.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            option.classList.add('selected');
            
            // Update display text with proper case
            const value = option.dataset.value;
            const displayValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            
            if (parent.classList.contains('program-options')) {
                programDisplay.textContent = displayValue;
            } else {
                levelDisplay.textContent = displayValue;
            }
        });
    });

    // Handle form submission
    const submitBtn = contactModal.querySelector('.contact-submit-btn');
    const nameInput = contactModal.querySelector('#directNameInput');
    const emailInput = contactModal.querySelector('#directEmailInput');

    submitBtn.addEventListener('click', async () => {
        if (!nameInput?.value || !emailInput?.value) {
            alert('Please fill in both name and email');
            return;
        }

        try {
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;

            // Get selected values (ensure lowercase for URL lookup)
            const selectedProgram = (programOptions?.querySelector('.option.selected')?.dataset.value || program).toLowerCase();
            const selectedLevel = (levelOptions?.querySelector('.option.selected')?.dataset.value || level).toLowerCase();

            const submissionData = {
                name: nameInput.value,
                email: emailInput.value,
                program: selectedProgram,
                level: selectedLevel,
                answers: window.assessmentAnswers || [],
                timestamp: new Date().toISOString()
            };

            // Submit to Google Sheet
            try {
                await fetch(window.GOOGLE_SHEET_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(submissionData)
                });
            } catch (error) {
                console.warn('Sheet submission failed but continuing:', error);
            }

            // Close contact modal
            contactModal.classList.remove('active');
            
            // Get the program URL (using lowercase)
            const programUrl = window.PROGRAM_URLS[selectedProgram];
            if (programUrl) {
                window.location.href = programUrl;
            } else {
                throw new Error(`No URL found for program: ${selectedProgram}`);
            }

        } catch (error) {
            console.error('Submission error:', error);
            alert('There was an error submitting your information. Please try again.');
            submitBtn.textContent = 'Continue to Program';
            submitBtn.disabled = false;
        }
    });
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