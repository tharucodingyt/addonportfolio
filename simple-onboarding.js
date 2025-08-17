// Simplified Onboarding Animation with GSAP
console.log('Simple onboarding script loaded');

// Wait for DOM and GSAP to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking GSAP...');
    
    if (typeof gsap === 'undefined') {
        console.error('GSAP not loaded!');
        return;
    }
    
    console.log('GSAP loaded, version:', gsap.version);
    
    // Simple onboarding data
    const questions = [
        {
            title: "What brings you here today?",
            text: "I'd love to know what you're looking for!",
            options: [
                "🚀 Looking to hire a developer",
                "💡 Exploring your projects", 
                "🤝 Potential collaboration",
                "📚 Learning and inspiration"
            ]
        },
        {
            title: "What interests you most?",
            text: "This helps me show you relevant work!",
            options: [
                "🌐 Web Applications",
                "📱 Mobile Development",
                "🎨 UI/UX Design", 
                "⚡ Full-Stack Solutions"
            ]
        },
        {
            title: "How would you like to connect?",
            text: "Let's make sure you get the best experience!",
            options: [
                "💼 Professional inquiry",
                "☕ Casual conversation",
                "📧 Email first",
                "🔍 Just browsing for now"
            ]
        }
    ];
    
    let currentQuestion = 0;
    let answers = [];
    
    // Show onboarding on every reload
    console.log('Onboarding will show on every page load');
    startOnboarding();
    
    function startOnboarding() {
        console.log('Starting onboarding...');
        
        // Get elements
        const overlay = document.getElementById('onboardingOverlay');
        const logo = document.querySelector('.logo img');
        const bulb = document.getElementById('lightBulb');
        const speechBubble = document.getElementById('speechBubble');
        
        if (!overlay || !logo || !bulb || !speechBubble) {
            console.error('Onboarding elements not found!');
            return;
        }
        
        // Show overlay
        overlay.style.display = 'flex';
        overlay.classList.add('active');
        
        // Create timeline
        const tl = gsap.timeline();
        
        // Step 1: Logo animation
        tl.to(logo, {
            duration: 0.5,
            y: -10,
            ease: "power2.inOut",
            repeat: 3,
            yoyo: true
        })
        // Step 2: Light bulb appears
        .to(bulb, {
            duration: 0.6,
            opacity: 1,
            scale: 1.2,
            ease: "back.out(1.7)",
            delay: 1
        })
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
            onComplete: function() {
                speechBubble.classList.add('active');
                showQuestion(0);
            }
        });
    }
    
    function showQuestion(index) {
        console.log('Showing question:', index + 1);
        
        if (index >= questions.length) {
            completeOnboarding();
            return;
        }
        
        const question = questions[index];
        const title = document.getElementById('questionTitle');
        const text = document.getElementById('questionText');
        const options = document.getElementById('questionOptions');
        const counter = document.getElementById('currentQuestion');
        const total = document.getElementById('totalQuestions');
        
        // Update content
        title.textContent = question.title;
        text.textContent = question.text;
        counter.textContent = index + 1;
        total.textContent = questions.length;
        
        // Clear and create options
        options.innerHTML = '';
        question.options.forEach((optionText, i) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = optionText;
            button.onclick = function() {
                selectOption(optionText, index);
            };
            options.appendChild(button);
        });
        
        // Animate in
        gsap.fromTo([title, text], {
            opacity: 0,
            y: 20
        }, {
            duration: 0.5,
            opacity: 1,
            y: 0,
            stagger: 0.2
        });
        
        gsap.fromTo(options.children, {
            opacity: 0,
            x: -30
        }, {
            duration: 0.4,
            opacity: 1,
            x: 0,
            stagger: 0.1,
            delay: 0.3
        });
    }
    
    function selectOption(optionText, questionIndex) {
        console.log('Selected:', optionText);
        
        // Store answer
        answers[questionIndex] = optionText;
        
        // Highlight selected button
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
            if (btn.textContent === optionText) {
                btn.classList.add('selected');
                gsap.to(btn, {
                    duration: 0.3,
                    scale: 1.05,
                    yoyo: true,
                    repeat: 1
                });
            }
        });
        
        // Move to next question
        setTimeout(() => {
            currentQuestion++;
            showQuestion(currentQuestion);
        }, 1000);
    }
    
    function completeOnboarding() {
        console.log('Completing onboarding with answers:', answers);
        
        const title = document.getElementById('questionTitle');
        const text = document.getElementById('questionText');
        const options = document.getElementById('questionOptions');
        
        title.textContent = "Perfect! 🎉";
        text.textContent = "Thanks for sharing! Let me show you around...";
        options.innerHTML = '';
        
        // Store completion
        localStorage.setItem('onboarding_shown', Date.now().toString());
        localStorage.setItem('onboarding_answers', JSON.stringify(answers));
        
        // Fade out after 2 seconds
        setTimeout(() => {
            const overlay = document.getElementById('onboardingOverlay');
            gsap.to(overlay, {
                duration: 0.8,
                opacity: 0,
                onComplete: function() {
                    overlay.style.display = 'none';
                    overlay.classList.remove('active');
                    
                    // Scroll to relevant section
                    const targetSection = answers[0]?.includes('hire') ? '#contact' : 
                                        answers[0]?.includes('projects') ? '#projects' : '#home';
                    
                    if (typeof gsap.to !== 'undefined') {
                        gsap.to(window, {
                            duration: 1.5,
                            scrollTo: targetSection,
                            ease: "power2.inOut"
                        });
                    }
                }
            });
        }, 2000);
    }
});
