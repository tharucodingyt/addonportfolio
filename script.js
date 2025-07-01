// Ensure content is visible regardless of JavaScript execution
document.documentElement.style.setProperty('--content-visibility', 'visible');

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('theme') || 'light';

    // Set initial theme based on stored preference
    document.documentElement.setAttribute('data-theme', storedTheme);
    
    // Function to toggle theme
    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Update theme attribute
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Store theme preference
        localStorage.setItem('theme', newTheme);
        
        // Animate theme change
        animateThemeChange(newTheme);
    };
    
    // Add click event listener to desktop toggle
    themeToggle.addEventListener('click', toggleTheme);
}

// Animate theme change
function animateThemeChange(theme) {
    // Create a full-screen overlay for transition effect
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = theme === 'dark' ? '#1a1a2e' : '#ffffff';
    overlay.style.zIndex = '9999';
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    overlay.style.transition = 'opacity 0.3s ease';
    
    document.body.appendChild(overlay);
    
    // Fade in and out for smooth transition
    setTimeout(() => {
        overlay.style.opacity = '0.3';
        
        setTimeout(() => {
            overlay.style.opacity = '0';
            
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 300);
        }, 300);
    }, 0);
}

// Enhanced Navbar Functionality
function enhanceNavbar() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const nav = document.querySelector('nav');
    
    // Add hover effect for desktop
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('nav-ripple');
            link.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Add click event for active state
        link.addEventListener('click', function(e) {
            const targetHref = this.getAttribute('href');
            
            // Handle admin navigation differently
            if (targetHref === '/admin') {
                // Don't prevent default - allow normal navigation
                return;
            }
            
            // For other links, prevent default and use smooth scroll
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to section
            const targetSection = document.querySelector(targetHref);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });}
    
    // Highlight active section on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // Shrink nav on scroll
        if (scrollPosition > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Highlight active section
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const id = section.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Enhanced Mobile Menu
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuToggle || !navLinks) return;
    
    // Initialize menu state
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    // Toggle menu when clicking the menu button
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        // Toggle the active class for the menu
        navLinks.classList.toggle('active');
        
        // Toggle the menu icon between bars and X
        if (navLinks.classList.contains('active')) {
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && 
            !navLinks.contains(e.target) && 
            navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Close mobile menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.nav-links a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active')) {
                // Get the target section before closing menu
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                // Close the menu
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                
                // Wait a moment for the menu to close then scroll
                if (targetSection) {
                    e.preventDefault();
                    setTimeout(() => {
                        window.scrollTo({
                            top: targetSection.offsetTop - 70,
                            behavior: 'smooth'
                        });
                    }, 300);
                }
            }
        });
    });
}

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme toggle
    initThemeToggle();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Enhance navbar
    enhanceNavbar();
    
    // Force skill bars to show their appropriate widths
    document.querySelectorAll('.skill-progress').forEach(bar => {
        const percentage = bar.parentElement.previousElementSibling.lastElementChild.textContent;
        bar.style.width = percentage;
    });
    
    // Ensure testimonials and contact section visibility
    const testimonialsSection = document.querySelector('.testimonials');
    const contactSection = document.querySelector('.contact');
    
    if (testimonialsSection) {
        testimonialsSection.style.display = 'block';
        testimonialsSection.style.visibility = 'visible';
        testimonialsSection.style.opacity = '1';
        
        // Make testimonials container visible
        const testimonialsContainer = document.querySelector('.testimonials-container');
        if (testimonialsContainer) {
            testimonialsContainer.style.display = 'flex';
            testimonialsContainer.style.visibility = 'visible';
            testimonialsContainer.style.opacity = '1';
        }
    }
    
    if (contactSection) {
        contactSection.style.display = 'block';
        contactSection.style.visibility = 'visible';
        contactSection.style.opacity = '1';
        
        // Make contact container visible
        const contactContainer = document.querySelector('.contact-container');
        if (contactContainer) {
            contactContainer.style.display = 'grid';
            contactContainer.style.visibility = 'visible';
            contactContainer.style.opacity = '1';
        }
    }
    
    // Initialize GSAP and ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Page Loader
    const loaderWrapper = document.querySelector('.loader-wrapper');
    window.addEventListener('load', function() {
        setTimeout(() => {
            loaderWrapper.classList.add('fade-out');
            // Enable scrolling
            document.body.style.overflow = 'visible';
            // Play intro animations
            playIntroAnimations();
        }, 500);
    });
    
    // Disable scrolling until the page is loaded
    document.body.style.overflow = 'hidden';
    
    // Initialize Particles.js
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#0fbcf9"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#0fbcf9",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
    
    // Highlight active navigation item on scroll
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        // Shrink nav on scroll
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Add 'active' class to navigation links when clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Form submission (prevent default for demo)
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // You would typically send the form data to a server here
            // For demo purposes, we'll just show a success message
            
            const formData = new FormData(this);
            const name = formData.get('name');
            
            // Animate the submit button
            const submitBtn = this.querySelector('button[type="submit"]');
            gsap.to(submitBtn, {
                scale: 1.1,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
            
            // Show a success message or feedback
            alert(`Thank you for your message, ${name || 'friend'}! I'll get back to you soon.`);
            this.reset();
        });
    }
    
    // Typed text animation for the hero section
    function initTypedText() {
        const typed = document.querySelector('.typed-text');
        const cursorSpan = document.querySelector('.cursor');
        
        const textArray = ["Full Stack Developer", "UI/UX Designer", "Mobile App Developer", "Tech Enthusiast"];
        const typingDelay = 100;
        const erasingDelay = 50;
        const newTextDelay = 2000; // Delay between current and next text
        let textArrayIndex = 0;
        let charIndex = 0;
        
        function type() {
            if (charIndex < textArray[textArrayIndex].length) {
                if (!cursorSpan.classList.contains('typing')) cursorSpan.classList.add('typing');
                typed.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingDelay);
            } else {
                cursorSpan.classList.remove('typing');
                setTimeout(erase, newTextDelay);
            }
        }
        
        function erase() {
            if (charIndex > 0) {
                if (!cursorSpan.classList.contains('typing')) cursorSpan.classList.add('typing');
                typed.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
                charIndex--;
                setTimeout(erase, erasingDelay);
            } else {
                cursorSpan.classList.remove('typing');
                textArrayIndex++;
                if (textArrayIndex >= textArray.length) textArrayIndex = 0;
                setTimeout(type, typingDelay + 1100);
            }
        }
        
        if (textArray.length) setTimeout(type, newTextDelay + 250);
    }
    
    // Initialize the typed text effect
    initTypedText();
    
    // Hero section animations
    function animateHero() {
        // Animate hero content with GSAP
        gsap.from('.hero-greeting', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: 0.2
        });
        
        gsap.from('.hero-text h1', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: 0.4
        });
        
        gsap.from('.animated-text', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: 0.6
        });
        
        gsap.from('.subtitle', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: 0.8
        });
        
        gsap.from('.hero-cta', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: 1
        });
        
        gsap.from('.hero-stats', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: 1.2
        });
        
        gsap.from('.profile-circle', {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            delay: 0.5,
            ease: 'back.out(1.7)'
        });
        
        // Remove the opacity animation for tech icons to keep them visible permanently
        gsap.from('.tech-orbit .tech-icon', {
            scale: 0,
            duration: 0.8,
            stagger: 0.1,
            delay: 1.3,
            ease: 'back.out(1.7)'
        });
    }
    
    // About section animations
    function animateAbout() {
        gsap.from('.section-subtitle', {
            scrollTrigger: {
                trigger: '.about',
                start: 'top 80%'
            },
            opacity: 0,
            y: 30,
            duration: 0.8
        });
        
        gsap.from('.section-header h2', {
            scrollTrigger: {
                trigger: '.about',
                start: 'top 80%'
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: 0.2
        });
        
        gsap.from('.section-description', {
            scrollTrigger: {
                trigger: '.about',
                start: 'top 80%'
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: 0.4
        });
        
        gsap.from('.about-image', {
            scrollTrigger: {
                trigger: '.about-container',
                start: 'top 80%'
            },
            opacity: 0,
            x: -50,
            duration: 1,
            delay: 0.2
        });
        
        gsap.from('.experience-badge', {
            scrollTrigger: {
                trigger: '.about-container',
                start: 'top 80%'
            },
            opacity: 0,
            scale: 0,
            duration: 0.8,
            delay: 0.6,
            ease: 'back.out(1.7)'
        });
        
        gsap.from('.about-social .social-btn', {
            scrollTrigger: {
                trigger: '.about-container',
                start: 'top 80%'
            },
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.8
        });
        
        gsap.from('.about-text-block', {
            scrollTrigger: {
                trigger: '.about-content-column',
                start: 'top 80%'
            },
            opacity: 0,
            x: 50,
            duration: 1,
            delay: 0.2
        });
        
        gsap.from('.about-details', {
            scrollTrigger: {
                trigger: '.about-content-column',
                start: 'top 70%'
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: 0.4
        });
        
        // Explicitly animate the services section
        gsap.from('.services-title', {
            scrollTrigger: {
                trigger: '.services-container',
                start: 'top 85%'
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            onComplete: () => {
                // Make sure the title is visible
                document.querySelector('.services-title').style.opacity = 1;
                document.querySelector('.services-title').style.visibility = 'visible';
            }
        });
        
        gsap.from('.service-card', {
            scrollTrigger: {
                trigger: '.services-grid',
                start: 'top 85%'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.2,
            onComplete: () => {
                // Make sure all service cards are visible
                document.querySelectorAll('.service-card').forEach(card => {
                    card.style.opacity = 1;
                    card.style.visibility = 'visible';
                });
            }
        });
    }
    
    function playIntroAnimations() {
        // Animate navigation
        gsap.from('nav', {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
        
        // Animate hero section elements
        animateHero();
        
        // Initialize ScrollTrigger animations
        animateAbout();
        animateSkillBars();
        
        // More section animations...
    }
    
    // Scroll animations for sections
    
    // About section
    gsap.from('.about-info', {
        scrollTrigger: {
            trigger: '.about-info',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    gsap.from('.interests, .achievements', {
        scrollTrigger: {
            trigger: '.interests',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: 'power3.out'
    });
    
    // Skills section
    gsap.from('.skills-category', {
        scrollTrigger: {
            trigger: '.skills',
            start: 'top 70%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: 'power3.out',
        onComplete: animateSkillBars
    });
    
    // Skills section heading animation
    gsap.from('.skills h2', {
        scrollTrigger: {
            trigger: '.skills',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
    });
    
    function animateSkillBars() {
        // Animate skill bars
        const skillBars = document.querySelectorAll('.skill-progress');
        
        // Force all skill bars to be visible
        skillBars.forEach(bar => {
            // Make sure the bar is visible with the correct width from HTML
            const targetWidth = bar.parentElement.previousElementSibling.lastElementChild.textContent;
            // Set width immediately for initial display
            bar.style.width = targetWidth;
        });

        // Then handle animation if ScrollTrigger is working
        if (typeof ScrollTrigger !== 'undefined') {
            skillBars.forEach((bar, index) => {
                // Get the width from inline style or data attribute
                const targetWidth = bar.parentElement.previousElementSibling.lastElementChild.textContent;
                
                // Create animation with GSAP
                gsap.fromTo(bar, 
                    { width: '0%' }, 
                    {
                        width: targetWidth,
                        duration: 1.5,
                        ease: 'power2.out',
                        delay: index * 0.1,
                        scrollTrigger: {
                            trigger: bar,
                            start: 'top bottom-=100',
                            toggleActions: 'play none none none'
                        },
                        onStart: () => {
                            // Add a pulse animation to the percentage text
                            const percentText = bar.parentElement.previousElementSibling.lastElementChild;
                            gsap.to(percentText, {
                                scale: 1.2,
                                duration: 0.3,
                                yoyo: true,
                                repeat: 1
                            });
                        }
                    }
                );
            });
        }
    }
    
    // Call animation function immediately to ensure skills are visible
    setTimeout(animateSkillBars, 100);
    
    // Projects section
    // Ensure projects are visible even without scroll trigger
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.style.opacity = 1;
        card.style.transform = 'translateY(0)';
    });
    
    // Add scroll trigger animation
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects',
            start: 'top 70%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        onComplete: () => {
            // Ensure projects are visible after animation
            projectCards.forEach(card => {
                card.style.opacity = 1;
                card.style.transform = 'translateY(0)';
            });
        }
    });
    
    // Testimonials section animations
    gsap.from('.testimonial-card', {
        scrollTrigger: {
            trigger: '.testimonials',
            start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
    });

    // Animate testimonial quotes
    gsap.from('.testimonial-quote', {
        scrollTrigger: {
            trigger: '.testimonials',
            start: 'top 75%',
        },
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.15,
        delay: 0.3
    });

    // Animate testimonial text
    gsap.from('.testimonial-text', {
        scrollTrigger: {
            trigger: '.testimonials',
            start: 'top 75%',
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.15,
        delay: 0.5
    });

    // Animate testimonial authors
    gsap.from('.testimonial-author', {
        scrollTrigger: {
            trigger: '.testimonials',
            start: 'top 70%',
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.15,
        delay: 0.7
    });

    // Animate testimonial ratings with a staggered effect
    gsap.from('.testimonial-rating i', {
        scrollTrigger: {
            trigger: '.testimonials',
            start: 'top 70%',
        },
        scale: 0,
        opacity: 0,
        duration: 0.3,
        stagger: 0.1,
        delay: 1
    });

    // Animate testimonial CTA
    gsap.from('.testimonial-cta', {
        scrollTrigger: {
            trigger: '.testimonials',
            start: 'top 70%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 1.2
    });

    // Contact section animations
    gsap.from('.contact-info', {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 70%',
            toggleActions: 'play none none none'
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.from('.contact-item', {
        scrollTrigger: {
            trigger: '.contact-details',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power3.out'
    });

    gsap.from('form', {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 70%',
            toggleActions: 'play none none none'
        },
        x: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.from('.social-links a', {
        scrollTrigger: {
            trigger: '.social-links',
            start: 'top 90%',
            toggleActions: 'play none none none'
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out'
    });

    // Supabase Contact Form
    function initContactForm() {
        // Get contact form elements
        const contactForm = document.getElementById('contactForm');
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const formStatus = document.getElementById('form-status');
        
        // Define function to check if Supabase is ready
        const initSupabaseWhenReady = function(retries = 0, maxRetries = 5) {
            if (retries >= maxRetries) {
                console.error('Failed to initialize Supabase after multiple retries');
                if (formStatus) {
                    formStatus.textContent = 'Service temporarily unavailable. Please try again later.';
                    formStatus.className = 'form-status error';
                }
                return;
            }
            
            // Check if supabase and config are available
            if (!window.supabase) {
                console.log(`Supabase not available yet, retrying... (${retries + 1}/${maxRetries})`);
                setTimeout(() => initSupabaseWhenReady(retries + 1, maxRetries), 1000);
                return;
            }
            
            if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
                console.log(`Supabase config not available yet, retrying... (${retries + 1}/${maxRetries})`);
                setTimeout(() => initSupabaseWhenReady(retries + 1, maxRetries), 1000);
                return;
            }
            
            console.log('Initializing Supabase client with:', {
                url: window.SUPABASE_URL,
                key: window.SUPABASE_ANON_KEY ? 'Key available' : 'Key missing'
            });
            
            try {
                const supabaseClient = window.supabase.createClient(
                    window.SUPABASE_URL,
                    window.SUPABASE_ANON_KEY,
                    {
                        auth: {
                            persistSession: false
                        }
                    }
                );
                
                if (!supabaseClient) {
                    throw new Error('Failed to initialize Supabase client');
                }
                
                // Successfully initialized, now setup the form
                setupContactForm(supabaseClient);
            } catch (error) {
                console.error('Error initializing Supabase:', error);
                if (formStatus) {
                    formStatus.textContent = 'Service temporarily unavailable. Please try again later.';
                    formStatus.className = 'form-status error';
                }
            }
        };
        
        // Function to setup the contact form with Supabase client
        function setupContactForm(supabaseClient) {
            if (!contactForm) return;
            
            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                try {
                    // Validate inputs
                    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                        throw new Error('Please fill out all fields');
                    }
                    
                    console.log('Sending message to Supabase:', {
                        name: nameInput.value,
                        email: emailInput.value,
                        message: messageInput.value.substring(0, 10) + '...' // Log only start of message for privacy
                    });
                    
                    // Insert data into Supabase using direct fetch as backup method
                    let data, error;
                    
                    try {
                        // Primary method: Supabase client
                        const result = await supabaseClient
                            .from('messages')
                            .insert([
                                { 
                                    name: nameInput.value, 
                                    email: emailInput.value, 
                                    message: messageInput.value 
                                }
                            ]);
                        
                        data = result.data;
                        error = result.error;
                    } catch (supabaseError) {
                        console.error('Supabase client error, trying fetch fallback:', supabaseError);
                        
                        // Fallback to direct fetch
                        try {
                            const response = await fetch(`${window.SUPABASE_URL}/rest/v1/messages`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'apikey': window.SUPABASE_ANON_KEY,
                                    'Authorization': `Bearer ${window.SUPABASE_ANON_KEY}`,
                                    'Prefer': 'return=minimal'
                                },
                                body: JSON.stringify({ 
                                    name: nameInput.value, 
                                    email: emailInput.value, 
                                    message: messageInput.value 
                                })
                            });
                            
                            if (!response.ok) {
                                const errorData = await response.json().catch(() => ({}));
                                console.error('Fetch fallback error details:', errorData);
                                throw new Error(`Failed to send message: ${response.status}`);
                            }
                            
                            // Success with fetch method
                            data = { success: true };
                            error = null;
                        } catch (fetchError) {
                            console.error('Fetch fallback also failed:', fetchError);
                            throw fetchError;
                        }
                    }
                    
                    if (error) {
                        console.error('Supabase error details:', error);
                        throw error;
                    }
                    
                    console.log('Message sent successfully:', data);
                    
                    // Show success message
                    formStatus.textContent = 'Message sent successfully! Thank you for reaching out.';
                    formStatus.className = 'form-status success';
                    formStatus.style.display = 'block';
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 5000);
                    
                } catch (error) {
                    // Show error message
                    const errorMessage = error.message || 'Failed to send message. Please try again later.';
                    formStatus.textContent = errorMessage;
                    formStatus.className = 'form-status error';
                    formStatus.style.display = 'block';
                    console.error('Error submitting form:', error);
                } finally {
                    // Restore button state
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }
            });
        }
        
        // Start initialization process
        initSupabaseWhenReady();
    }
    
    // Initialize contact form
    initContactForm();
});