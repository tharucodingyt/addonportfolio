// Onboarding Animation with GSAP
class OnboardingFlow {
    constructor() {
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.timeline = gsap.timeline();
        
        // Questions data
        this.questions = [
            {
                title: "What brings you here today?",
                text: "I'd love to know what you're looking for!",
                options: [
                    { text: "🚀 Looking to hire a developer", value: "hire" },
                    { text: "💡 Exploring your projects", value: "explore" },
                    { text: "🤝 Potential collaboration", value: "collaborate" },
                    { text: "📚 Learning and inspiration", value: "learn" }
                ]
            },
            {
                title: "What type of projects interest you most?",
                text: "This helps me show you the most relevant work!",
                options: [
                    { text: "🌐 Web Applications", value: "web" },
                    { text: "📱 Mobile Development", value: "mobile" },
                    { text: "🎨 UI/UX Design", value: "design" },
                    { text: "⚡ Full-Stack Solutions", value: "fullstack" }
                ]
            },
            {
                title: "How would you like to connect?",
                text: "Let's make sure you get the best experience!",
                options: [
                    { text: "💼 Professional inquiry", value: "professional" },
                    { text: "☕ Casual conversation", value: "casual" },
                    { text: "📧 Email first", value: "email" },
                    { text: "🔍 Just browsing for now", value: "browse" }
                ]
            }
        ];
        
        this.init();
    }
    
    init() {
        // Wait for page to load, then start the sequence
        window.addEventListener('load', () => {
            // Small delay to ensure everything is loaded
            setTimeout(() => {
                this.startOnboarding();
            }, 1000);
        });
    }
    
    startOnboarding() {
        const overlay = document.getElementById('onboardingOverlay');
        const logo = document.querySelector('.logo img');
        const bulb = document.getElementById('lightBulb');
        const speechBubble = document.getElementById('speechBubble');
        
        // Show overlay
        overlay.classList.add('active');
        
        // Create master timeline
        this.timeline = gsap.timeline();
        
        // Step 1: Logo thinking animation (bounce/nod)
        this.timeline
            .to(logo, {
                duration: 0.5,
                y: -10,
                ease: "power2.inOut",
                repeat: 3,
                yoyo: true
            })
            .to(logo, {
                duration: 0.3,
                rotation: 5,
                ease: "power2.inOut",
                repeat: 1,
                yoyo: true
            })
            // Step 2: Light bulb appears after 2 seconds
            .to(bulb, {
                duration: 0.6,
                opacity: 1,
                scale: 1.2,
                ease: "back.out(1.7)",
                delay: 0.5
            }, "+=1")
            .to(bulb, {
                duration: 0.3,
                scale: 1,
                ease: "power2.out"
            })
            // Step 3: Speech bubble appears
            .to(speechBubble, {
                duration: 0.8,
                opacity: 1,
                scale: 1,
                y: 0,
                ease: "back.out(1.7)",
                delay: 0.5,
                onComplete: () => {
                    speechBubble.classList.add('active');
                    this.showQuestion(0);
                }
            });
    }
    
    showQuestion(index) {
        console.log(`Showing question ${index + 1} of ${this.questions.length}`);
        
        if (index >= this.questions.length) {
            console.log('All questions completed, starting completion flow');
            this.completeOnboarding();
            return;
        }
        
        const question = this.questions[index];
        const questionTitle = document.getElementById('questionTitle');
        const questionText = document.getElementById('questionText');
        const questionOptions = document.getElementById('questionOptions');
        const currentQuestionSpan = document.getElementById('currentQuestion');
        const totalQuestionsSpan = document.getElementById('totalQuestions');
        
        // Update question counter
        currentQuestionSpan.textContent = index + 1;
        totalQuestionsSpan.textContent = this.questions.length;
        
        // Animate out current content if not first question
        if (index > 0) {
            gsap.to([questionTitle, questionText, questionOptions], {
                duration: 0.3,
                opacity: 0,
                y: -20,
                stagger: 0.1,
                onComplete: () => {
                    this.updateQuestionContent(question, index);
                }
            });
        } else {
            this.updateQuestionContent(question, index);
        }
    }
    
    updateQuestionContent(question, index) {
        const questionTitle = document.getElementById('questionTitle');
        const questionText = document.getElementById('questionText');
        const questionOptions = document.getElementById('questionOptions');
        
        // Update content
        questionTitle.textContent = question.title;
        questionText.textContent = question.text;
        
        // Clear and populate options
        questionOptions.innerHTML = '';
        question.options.forEach((option, optionIndex) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option.text;
            button.dataset.value = option.value;
            
            button.addEventListener('click', () => {
                this.selectOption(button, option, index);
            });
            
            questionOptions.appendChild(button);
        });
        
        // Animate in new content
        gsap.fromTo([questionTitle, questionText], {
            opacity: 0,
            y: 20
        }, {
            duration: 0.5,
            opacity: 1,
            y: 0,
            stagger: 0.2,
            ease: "power2.out"
        });
        
        gsap.fromTo(questionOptions.children, {
            opacity: 0,
            x: -30
        }, {
            duration: 0.4,
            opacity: 1,
            x: 0,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.3
        });
    }
    
    selectOption(button, option, questionIndex) {
        console.log(`Selected option "${option.text}" for question ${questionIndex + 1}`);
        
        // Remove previous selections
        const allButtons = button.parentNode.querySelectorAll('.option-btn');
        allButtons.forEach(btn => btn.classList.remove('selected'));
        
        // Mark current selection
        button.classList.add('selected');
        
        // Store answer
        this.userAnswers[questionIndex] = option;
        console.log('Current answers:', this.userAnswers);
        
        // Animate selection
        gsap.to(button, {
            duration: 0.3,
            scale: 1.05,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
        });
        
        // Move to next question after delay
        setTimeout(() => {
            const nextQuestionIndex = questionIndex + 1;
            this.currentQuestionIndex = nextQuestionIndex;
            console.log(`Moving to question ${nextQuestionIndex + 1}`);
            this.showQuestion(nextQuestionIndex);
        }, 1000);
    }
    
    completeOnboarding() {
        const overlay = document.getElementById('onboardingOverlay');
        const speechBubble = document.getElementById('speechBubble');
        const bulb = document.getElementById('lightBulb');
        
        // Show completion message
        const questionTitle = document.getElementById('questionTitle');
        const questionText = document.getElementById('questionText');
        const questionOptions = document.getElementById('questionOptions');
        
        questionTitle.textContent = "Perfect! 🎉";
        questionText.textContent = "Thanks for sharing! Let me show you around...";
        questionOptions.innerHTML = '';
        
        // Animate completion
        gsap.to([questionTitle, questionText], {
            duration: 0.5,
            opacity: 1,
            y: 0,
            stagger: 0.2
        });
        
        // Fade out everything after 2 seconds
        setTimeout(() => {
            gsap.to([speechBubble, bulb], {
                duration: 0.6,
                opacity: 0,
                scale: 0.8,
                y: -20,
                stagger: 0.2,
                ease: "power2.in"
            });
            
            gsap.to(overlay, {
                duration: 0.8,
                opacity: 0,
                ease: "power2.inOut",
                delay: 0.4,
                onComplete: () => {
                    overlay.classList.remove('active');
                    overlay.style.display = 'none';
                    this.navigateToContent();
                }
            });
        }, 2000);
    }
    
    navigateToContent() {
        // Analyze user answers and navigate accordingly
        const firstAnswer = this.userAnswers[0]?.value;
        const secondAnswer = this.userAnswers[1]?.value;
        
        // Smooth scroll to relevant section based on answers
        let targetSection = '#home';
        
        if (firstAnswer === 'hire' || firstAnswer === 'collaborate') {
            targetSection = '#contact';
        } else if (firstAnswer === 'explore' || secondAnswer === 'web' || secondAnswer === 'mobile') {
            targetSection = '#projects';
        } else if (secondAnswer === 'design') {
            targetSection = '#about';
        }
        
        // Smooth scroll to target section
        gsap.to(window, {
            duration: 1.5,
            scrollTo: targetSection,
            ease: "power2.inOut"
        });
        
        // Store user preferences for potential use
        localStorage.setItem('userPreferences', JSON.stringify({
            answers: this.userAnswers,
            timestamp: new Date().toISOString()
        }));
        
        // Optional: Show a subtle welcome message
        this.showWelcomeMessage();
    }
    
    showWelcomeMessage() {
        // Create a subtle notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 1000;
            opacity: 0;
            transform: translateX(100px);
        `;
        notification.textContent = "Welcome! Enjoy exploring my work 🚀";
        
        document.body.appendChild(notification);
        
        // Animate in and out
        gsap.to(notification, {
            duration: 0.5,
            opacity: 1,
            x: 0,
            ease: "power2.out"
        });
        
        setTimeout(() => {
            gsap.to(notification, {
                duration: 0.5,
                opacity: 0,
                x: 100,
                ease: "power2.in",
                onComplete: () => {
                    document.body.removeChild(notification);
                }
            });
        }, 3000);
    }
}

// Initialize onboarding when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if user has already completed onboarding recently
    const userPreferences = localStorage.getItem('userPreferences');
    
    // For testing purposes, you can add ?onboarding=true to the URL to force show onboarding
    const urlParams = new URLSearchParams(window.location.search);
    const forceOnboarding = urlParams.get('onboarding') === 'true';
    
    const shouldShowOnboarding = forceOnboarding || !userPreferences || 
        (Date.now() - new Date(JSON.parse(userPreferences).timestamp).getTime()) > 24 * 60 * 60 * 1000; // 24 hours
    
    console.log('Should show onboarding:', shouldShowOnboarding);
    console.log('Force onboarding:', forceOnboarding);
    console.log('User preferences:', userPreferences);
    
    if (shouldShowOnboarding) {
        console.log('Initializing onboarding flow...');
        new OnboardingFlow();
    } else {
        console.log('Onboarding skipped - user has seen it recently');
    }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OnboardingFlow;
}
