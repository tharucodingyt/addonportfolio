// AI Chatbot with OpenRouter API
class PortfolioChatbot {
    constructor() {
        this.apiKey = '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';
        this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
        this.model = 'openai/gpt-4o';
        this.isOpen = false;
        this.conversationHistory = [];
        
        // Portfolio context for the AI
        this.portfolioContext = `
        You are Tharu's AI assistant on his portfolio website. You are knowledgeable about:
        
        ABOUT THARU:
        - Full-stack developer with expertise in web development
        - Skilled in modern technologies and frameworks
        - Passionate about creating innovative digital solutions
        - Available for freelance projects and collaborations
        
        TECHNICAL SKILLS:
        - Frontend: HTML5, CSS3, JavaScript, React, Vue.js, Angular
        - Backend: Node.js, Python, PHP, Express.js
        - Databases: MySQL, MongoDB, PostgreSQL
        - Tools: Git, Docker, AWS, Firebase
        - Design: UI/UX, Figma, Adobe Creative Suite
        
        SERVICES:
        - Web Application Development
        - Mobile App Development
        - UI/UX Design
        - E-commerce Solutions
        - API Development
        - Database Design
        
        CONTACT INFO:
        - Available for hire and collaborations
        - Professional inquiries welcome
        - Portfolio showcases various projects
        
        Keep responses helpful, professional, and focused on Tharu's work and capabilities. 
        If asked about specific projects, mention that visitors can explore the projects section.
        For contact inquiries, direct them to the contact section of the portfolio.
        Be conversational but concise - aim for 1-3 sentences unless more detail is specifically requested.
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
            this.addMessage('Sorry, I\'m having trouble connecting right now. Please try again in a moment!', 'bot');
        }
    }
    
    sendSuggestion(message) {
        const input = document.getElementById('chatbotInput');
        input.value = message;
        this.handleInputChange();
        this.sendMessage();
    }
    
    async getAIResponse(userMessage) {
        // Add user message to conversation history
        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });
        
        // Prepare messages for API
        const messages = [
            {
                role: 'system',
                content: this.portfolioContext
            },
            ...this.conversationHistory.slice(-10) // Keep last 10 messages for context
        ];
        
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Tharu\'s Portfolio',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: this.model,
                messages: messages,
                max_tokens: 300,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        
        // Add AI response to conversation history
        this.conversationHistory.push({
            role: 'assistant',
            content: aiResponse
        });
        
        return aiResponse;
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
