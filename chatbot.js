// AI Chatbot with OpenRouter API
class PortfolioChatbot {
    constructor() {
        this.apiKey = 'YOUR_OPENROUTER_API_KEY_HERE'; // Replace with your valid API key from openrouter.ai
        this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
        this.model = 'microsoft/phi-3-mini-128k-instruct:free'; // Using reliable free model
        this.isOpen = false;
        this.conversationHistory = [];
        
        // Portfolio context for the AI
        this.portfolioContext = `
        You are Tharu's AI assistant. Keep responses very short and simple (1-2 sentences max).
        
        About Tharu: Full-stack developer skilled in React, Node.js, Python, and modern web technologies.
        Services: Web apps, mobile apps, UI/UX design, and API development.
        
        For projects, say "Check out the projects section below!"
        For contact, say "Use the contact form to get in touch!"
        Be friendly and helpful but keep it brief.
        `;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.addWelcomeMessage();
        console.log('Portfolio Chatbot initialized');
    }
    
    bindEvents() {
        const toggle = document.getElementById('chatbotToggle');
        const minimize = document.getElementById('chatbotMinimize');
        const input = document.getElementById('chatbotInput');
        const sendBtn = document.getElementById('chatbotSend');
        const suggestions = document.querySelectorAll('.suggestion-btn');
        
        // Toggle chatbot
        toggle.addEventListener('click', () => this.toggleChatbot());
        minimize.addEventListener('click', () => this.closeChatbot());
        
        // Input handling
        input.addEventListener('input', () => this.handleInputChange());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Send button
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Suggestion buttons
        suggestions.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.dataset.message;
                this.sendSuggestion(message);
            });
        });
    }
    
    toggleChatbot() {
        const window = document.getElementById('chatbotWindow');
        const badge = document.getElementById('chatbotBadge');
        
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            window.classList.add('active');
            badge.style.display = 'none';
            this.isOpen = true;
            
            // Focus input
            setTimeout(() => {
                document.getElementById('chatbotInput').focus();
            }, 300);
        }
    }
    
    closeChatbot() {
        const window = document.getElementById('chatbotWindow');
        window.classList.remove('active');
        this.isOpen = false;
    }
    
    handleInputChange() {
        const input = document.getElementById('chatbotInput');
        const sendBtn = document.getElementById('chatbotSend');
        
        sendBtn.disabled = input.value.trim().length === 0;
    }
    
    async sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Clear input and disable send button
        input.value = '';
        document.getElementById('chatbotSend').disabled = true;
        
        // Hide suggestions after first user message
        this.hideSuggestions();
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Show typing indicator
        this.showTyping();
        
        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            this.hideTyping();
            this.addMessage(response, 'bot');
        } catch (error) {
            console.error('Chatbot error:', error);
            this.hideTyping();
            
            let errorMessage = 'Sorry, I\'m having trouble connecting right now. Please try again in a moment!';
            
            // Provide more specific error messages
            if (error.message.includes('CORS')) {
                errorMessage = 'There seems to be a connection issue. Please make sure you\'re running this site on a web server (not opening the HTML file directly).';
            } else if (error.message.includes('API request failed: 401')) {
                errorMessage = 'Authentication error with the AI service. Please check the API configuration.';
            } else if (error.message.includes('API request failed: 429')) {
                errorMessage = 'Too many requests. Please wait a moment before trying again.';
            } else if (error.message.includes('Network error')) {
                errorMessage = error.message;
            }
            
            this.addMessage(errorMessage, 'bot');
        }
    }
    
    sendSuggestion(message) {
        const input = document.getElementById('chatbotInput');
        input.value = message;
        this.handleInputChange();
        this.sendMessage();
    }
    
    async getAIResponse(userMessage) {
        try {
            // Simple fallback responses for common queries
            const message = userMessage.toLowerCase();
            
            if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
                return "Hi! I'm Tharu's AI assistant. Ask me about his skills, projects, or services!";
            }
            
            if (message.includes('skill') || message.includes('technology') || message.includes('tech')) {
                return "Tharu is skilled in React, Node.js, Python, and modern web technologies. Check out the projects section below!";
            }
            
            if (message.includes('project') || message.includes('work') || message.includes('portfolio')) {
                return "Check out the projects section below to see Tharu's amazing work!";
            }
            
            if (message.includes('contact') || message.includes('hire') || message.includes('email')) {
                return "Use the contact form to get in touch with Tharu for collaborations!";
            }
            
            if (message.includes('service') || message.includes('what do') || message.includes('offer')) {
                return "Tharu offers web apps, mobile apps, UI/UX design, and API development services.";
            }
            
            if (message.includes('experience') || message.includes('background')) {
                return "Tharu is a full-stack developer passionate about creating innovative digital solutions.";
            }
            
            // Default response
            return "I'm here to help! Ask me about Tharu's skills, projects, or how to get in touch.";
            
        } catch (error) {
            console.error('Error in getAIResponse:', error);
            return "Thanks for your message! Feel free to explore the portfolio and use the contact form.";
        }
    }
    
    addMessage(content, type) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = type === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageText = document.createElement('p');
        messageText.textContent = content;
        
        const messageTime = document.createElement('span');
        messageTime.className = 'message-time';
        messageTime.textContent = this.getCurrentTime();
        
        messageContent.appendChild(messageText);
        messageContent.appendChild(messageTime);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Animate message in
        gsap.fromTo(messageDiv, {
            opacity: 0,
            y: 20
        }, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out"
        });
    }
    
    addWelcomeMessage() {
        // The welcome message is already in HTML, so we just need to animate it
        const welcomeMessage = document.querySelector('.bot-message');
        if (welcomeMessage) {
            gsap.fromTo(welcomeMessage, {
                opacity: 0,
                y: 20
            }, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out",
                delay: 0.5
            });
        }
    }
    
    showTyping() {
        const typing = document.getElementById('chatbotTyping');
        typing.style.display = 'flex';
        
        // Scroll to show typing indicator
        const messagesContainer = document.getElementById('chatbotMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    hideTyping() {
        const typing = document.getElementById('chatbotTyping');
        typing.style.display = 'none';
    }
    
    hideSuggestions() {
        const suggestions = document.getElementById('chatbotSuggestions');
        gsap.to(suggestions, {
            opacity: 0,
            height: 0,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
                suggestions.style.display = 'none';
            }
        });
    }
    
    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Method to add context about specific portfolio sections
    addPortfolioContext(section, details) {
        this.portfolioContext += `\n\n${section.toUpperCase()}:\n${details}`;
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        window.portfolioChatbot = new PortfolioChatbot();
        console.log('Chatbot ready!');
    }, 1000);
});

// Add some portfolio-specific context based on the page content
window.addEventListener('load', () => {
    if (window.portfolioChatbot) {
        // You can dynamically add more context about projects, skills, etc.
        // This would be populated from the actual portfolio content
        window.portfolioChatbot.addPortfolioContext('RECENT_PROJECTS', 
            'Portfolio includes various web applications, mobile apps, and design projects showcasing modern development practices.'
        );
    }
});
