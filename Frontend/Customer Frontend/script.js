// Policy Bazar - Custom JavaScript

// Authentication Check - Run first before anything else
function checkAuthAndInitialize() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        // User is not logged in, redirect to login page
        window.location.href = 'login.html';
        return false;
    }
    
    // User is logged in, update user display
    const user = JSON.parse(currentUser);
    const userNameDisplay = document.getElementById('userNameDisplay');
    if (userNameDisplay && user.name) {
        userNameDisplay.textContent = user.name.split(' ')[0]; // Display first name
    }
    
    return true;
}

// Logout function
function logoutUser(event) {
    event.preventDefault();
    
    if (confirm('Are you sure you want to logout?')) {
        // Clear user data from localStorage
        localStorage.removeItem('currentUser');
        
        // Redirect to login page
        window.location.href = 'login.html';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    if (!checkAuthAndInitialize()) {
        return; // Stop further execution if not logged in
    }
    
    // Initialize all components
    initNavbar();
    initSearch();
    initAnimations();
    initButtons();
    initServiceCards();
    initFooter();
    initSmoothScroll();
    initPageSpecific();
});

// Navbar functionality
function initNavbar() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // Close navbar when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = navbarCollapse.contains(event.target) || 
                             navbarToggler.contains(event.target);
        
        if (!isClickInside && navbarCollapse.classList.contains('show')) {
            bootstrap.Collapse.getInstance(navbarCollapse)?.hide();
        }
    });
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-lg');
            navbar.style.padding = '0.5rem 0';
        } else {
            navbar.classList.remove('shadow-lg');
            navbar.style.padding = '0.75rem 0';
        }
    });
}

// Search functionality
function initSearch() {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-form input[type="search"]');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm.length > 0) {
                // Simulate search functionality
                showNotification(`Searching for: "${searchTerm}"`, 'success');
                console.log('Search term:', searchTerm);
                
                // Redirect to policies page with search query
                setTimeout(() => {
                    window.location.href = `policies.html?search=${encodeURIComponent(searchTerm)}`;
                }, 1000);
            } else {
                showNotification('Please enter a search term', 'warning');
                searchInput.focus();
            }
        });
        
        // Add live search feedback
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            if (searchTerm.length > 0) {
                this.style.backgroundColor = '#fff';
            }
        });
    }
}

// Animation on scroll
function initAnimations() {
    // Fade in elements on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe cards and sections
    const animatedElements = document.querySelectorAll('.card, .feature-icon');
    animatedElements.forEach(function(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Button interactions
function initButtons() {
    // Login button
    const loginBtn = document.querySelector('a[href="account.html"].btn-outline-primary');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(event) {
            event.preventDefault();
            showModal('Login', 'login-modal');
        });
    }
    
    // Sign up button
    const signupBtn = document.querySelector('a[href="account.html"].btn-primary');
    if (signupBtn) {
        signupBtn.addEventListener('click', function(event) {
            event.preventDefault();
            showModal('Sign Up', 'signup-modal');
        });
    }
    
    // CTA buttons
    const ctaButtons = document.querySelectorAll('.hero-section .btn, .cta-section .btn');
    ctaButtons.forEach(function(btn) {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Service card buttons
    const serviceCardButtons = document.querySelectorAll('.service-card .btn');
    serviceCardButtons.forEach(function(btn) {
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            const href = this.closest('.service-card').getAttribute('href');
            const cardTitle = this.closest('.card-body').querySelector('.card-title').textContent;
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                showNotification(`Navigating to ${cardTitle}...`, 'info');
                
                // Simulate navigation after delay
                setTimeout(() => {
                    if (href && href !== '#') {
                        window.location.href = href;
                    }
                }, 500);
            }, 150);
        });
    });
}

// Service Cards functionality
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0)';
            }
        });
        
        card.addEventListener('click', function(event) {
            event.preventDefault();
            const href = this.getAttribute('href');
            const cardTitle = this.querySelector('.card-title').textContent;
            
            // Add ripple effect
            addRippleEffect(event, this);
            
            // Show notification
            setTimeout(() => {
                showNotification(`Opening ${cardTitle}...`, 'info');
            }, 300);
            
            // Navigate after delay
            setTimeout(() => {
                if (href) {
                    window.location.href = href;
                }
            }, 800);
        });
    });
}

// Ripple effect for cards
function addRippleEffect(event, element) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation if not exists
if (!document.querySelector('#ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Footer functionality
function initFooter() {
    // Update current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Footer link interactions
    const footerLinks = document.querySelectorAll('.footer-link');
    footerLinks.forEach(function(link) {
        link.addEventListener('mouseenter', function() {
            this.style.paddingLeft = '5px';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.paddingLeft = '';
        });
    });
    
    // Social media links
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(function(link) {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const icon = this.querySelector('i');
            let platform = 'Social Media';
            
            if (icon.classList.contains('fa-facebook-f')) platform = 'Facebook';
            else if (icon.classList.contains('fa-twitter')) platform = 'Twitter';
            else if (icon.classList.contains('fa-instagram')) platform = 'Instagram';
            else if (icon.classList.contains('fa-linkedin-in')) platform = 'LinkedIn';
            
            showNotification(`Opening ${platform} page...`, 'info');
        });
    });
    
    // Contact links
    const contactLinks = document.querySelectorAll('.contact-item a');
    contactLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const href = this.getAttribute('href');
            
            if (href.startsWith('mailto:')) {
                showNotification(`Opening email client...`, 'info');
            } else if (href.startsWith('tel:')) {
                showNotification(`Initiating call to ${href.replace('tel:', '')}...`, 'info');
            } else {
                showNotification('Opening contact information...', 'info');
            }
        });
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                // Add smooth scrolling animation
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Highlight the section temporarily
                target.style.transition = 'background-color 0.5s ease';
                const originalBg = target.style.backgroundColor;
                target.style.backgroundColor = 'rgba(0, 102, 204, 0.05)';
                
                setTimeout(() => {
                    target.style.backgroundColor = originalBg;
                }, 1500);
            }
        });
    });
}

// Page specific initialization
function initPageSpecific() {
    // Check which page we're on
    const path = window.location.pathname;
    const pageName = path.split('/').pop() || 'index.html';
    
    // Initialize policies page
    if (pageName === 'policies.html') {
        initPoliciesPage();
    }
    
    // Initialize agents page
    if (pageName === 'agents.html') {
        initAgentsPage();
    }
    
    // Initialize claims page
    if (pageName === 'claims.html') {
        initClaimsPage();
    }
    
    // Initialize support page
    if (pageName === 'support.html') {
        initSupportPage();
    }
    
    // Initialize quote page
    if (pageName === 'quote.html') {
        initQuotePage();
    }
    
    // Initialize account page
    if (pageName === 'account.html') {
        initAccountPage();
    }
}

// Policies Page Functions
function initPoliciesPage() {
    // Check for search query
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
        showNotification(`Showing results for: "${searchQuery}"`, 'info');
        filterPolicies(searchQuery);
    }
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.policy-filter-btn');
    filterButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter policies
            filterPolicies(filter);
        });
    });
    
    // Buy Now buttons
    const buyButtons = document.querySelectorAll('.buy-now-btn');
    buyButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const policyName = this.getAttribute('data-policy');
            showNotification(`Added ${policyName} to cart!`, 'success');
        });
    });
}

function filterPolicies(filter) {
    const policyCards = document.querySelectorAll('.policy-card');
    
    policyCards.forEach(function(card) {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// Agents Page Functions
function initAgentsPage() {
    // Search agents
    const searchForm = document.querySelector('.agents-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input[type="search"]');
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                showNotification(`Searching for agents: "${searchTerm}"`, 'info');
                filterAgents(searchTerm);
            }
        });
    }
    
    // Filter by specialty
    const specialtyFilter = document.getElementById('specialty-filter');
    if (specialtyFilter) {
        specialtyFilter.addEventListener('change', function() {
            filterAgentsBySpecialty(this.value);
        });
    }
    
    // Consult buttons
    const consultButtons = document.querySelectorAll('.consult-btn');
    consultButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const agentName = this.getAttribute('data-agent');
            showNotification(`Contacting ${agentName}...`, 'info');
        });
    });
}

function filterAgents(searchTerm) {
    const agentCards = document.querySelectorAll('.agent-card');
    const term = searchTerm.toLowerCase();
    
    agentCards.forEach(function(card) {
        const name = card.querySelector('.agent-name').textContent.toLowerCase();
        const location = card.querySelector('.agent-location').textContent.toLowerCase();
        
        if (name.includes(term) || location.includes(term)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterAgentsBySpecialty(specialty) {
    const agentCards = document.querySelectorAll('.agent-card');
    
    agentCards.forEach(function(card) {
        const specialties = card.getAttribute('data-specialties');
        
        if (specialty === 'all' || specialties.includes(specialty)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Claims Page Functions
function initClaimsPage() {
    // Claim form submission
    const claimForm = document.getElementById('claim-form');
    if (claimForm) {
        claimForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateClaimForm()) {
                showNotification('Submitting your claim...', 'info');
                
                // Simulate form submission
                setTimeout(() => {
                    showNotification('Claim submitted successfully! Reference: CLM-' + Math.random().toString(36).substr(2, 9).toUpperCase(), 'success');
                    claimForm.reset();
                }, 2000);
            }
        });
    }
    
    // File upload
    const fileInput = document.getElementById('claim-documents');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const files = this.files;
            if (files.length > 0) {
                showNotification(`${files.length} file(s) selected`, 'success');
            }
        });
    }
    
    // Track claim button
    const trackBtn = document.getElementById('track-claim-btn');
    if (trackBtn) {
        trackBtn.addEventListener('click', function() {
            const claimId = document.getElementById('track-claim-id').value;
            if (claimId) {
                showNotification(`Tracking claim: ${claimId}`, 'info');
                // Show claim status
                showClaimStatus(claimId);
            } else {
                showNotification('Please enter a claim ID', 'warning');
            }
        });
    }
}

function validateClaimForm() {
    const requiredFields = ['policy-number', 'claim-type', 'incident-date', 'claim-amount', 'description'];
    let isValid = true;
    
    requiredFields.forEach(function(fieldId) {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else if (field) {
            field.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

function showClaimStatus(claimId) {
    // Simulate claim status
    const statuses = ['Pending Review', 'Under Investigation', 'Approved - Processing Payment', 'Documents Required'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    setTimeout(() => {
        showNotification(`Claim ${claimId}: ${randomStatus}`, 'info');
    }, 1000);
}

// Support Page Functions
function initSupportPage() {
    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function(item) {
        item.addEventListener('click', function() {
            const question = this.querySelector('.accordion-button').textContent;
            console.log('FAQ viewed:', question);
        });
    });
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateContactForm()) {
                showNotification('Sending your message...', 'info');
                
                setTimeout(() => {
                    showNotification('Message sent successfully! We\'ll respond within 24 hours.', 'success');
                    contactForm.reset();
                }, 1500);
            }
        });
    }
    
    // Live chat button
    const chatBtn = document.getElementById('live-chat-btn');
    if (chatBtn) {
        chatBtn.addEventListener('click', function() {
            showNotification('Connecting to live chat...', 'info');
            
            setTimeout(() => {
                showNotification('Live chat is available! An agent will be with you shortly.', 'success');
            }, 2000);
        });
    }
}

function validateContactForm() {
    const requiredFields = ['contact-name', 'contact-email', 'contact-subject', 'contact-message'];
    let isValid = true;
    
    requiredFields.forEach(function(fieldId) {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else if (field) {
            field.classList.remove('is-invalid');
        }
    });
    
    // Validate email format
    const emailField = document.getElementById('contact-email');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.classList.add('is-invalid');
            isValid = false;
        }
    }
    
    return isValid;
}

// Quote Page Functions
function initQuotePage() {
    // Quote form
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateQuoteForm()) {
                calculateQuote();
            }
        });
    }
    
    // Calculate button
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            if (validateQuoteForm()) {
                calculateQuote();
            }
        });
    }
    
    // Policy type change
    const policyType = document.getElementById('policy-type');
    if (policyType) {
        policyType.addEventListener('change', function() {
            updateCoverageOptions(this.value);
        });
    }
}

function validateQuoteForm() {
    const requiredFields = ['policy-type', 'coverage-amount', 'policy-term', 'age'];
    let isValid = true;
    
    requiredFields.forEach(function(fieldId) {
        const field = document.getElementById(fieldId);
        if (field && !field.value) {
            field.classList.add('is-invalid');
            isValid = false;
        } else if (field) {
            field.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

function calculateQuote() {
    showNotification('Calculating your quote...', 'info');
    
    // Get form values
    const policyType = document.getElementById('policy-type').value;
    const coverage = parseFloat(document.getElementById('coverage-amount').value);
    const term = parseInt(document.getElementById('policy-term').value);
    const age = parseInt(document.getElementById('age').value);
    
    // Calculate premium (simplified calculation)
    let baseRate = 0;
    switch(policyType) {
        case 'health':
            baseRate = 0.003;
            break;
        case 'life':
            baseRate = 0.002;
            break;
        case 'motor':
            baseRate = 0.004;
            break;
        case 'home':
            baseRate = 0.0015;
            break;
        case 'travel':
            baseRate = 0.005;
            break;
    }
    
    const ageMultiplier = age > 45 ? 1.5 : 1;
    const termMultiplier = term > 1 ? term * 0.9 : 1;
    const annualPremium = coverage * baseRate * ageMultiplier * termMultiplier;
    
    // Show result
    setTimeout(() => {
        showQuoteResult(annualPremium, coverage, policyType);
    }, 1500);
}

function showQuoteResult(premium, coverage, type) {
    const resultContainer = document.getElementById('quote-result-container');
    if (resultContainer) {
        resultContainer.style.display = 'block';
        
        document.getElementById('premium-amount').textContent = '₹' + Math.round(premium).toLocaleString();
        document.getElementById('coverage-display').textContent = '₹' + coverage.toLocaleString();
        document.getElementById('policy-type-display').textContent = type.charAt(0).toUpperCase() + type.slice(1) + ' Insurance';
        
        // Scroll to result
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    showNotification('Quote calculated successfully!', 'success');
}

function updateCoverageOptions(policyType) {
    const coverageSelect = document.getElementById('coverage-amount');
    if (!coverageSelect) return;
    
    let minCoverage, maxCoverage;
    
    switch(policyType) {
        case 'health':
            minCoverage = 500000;
            maxCoverage = 10000000;
            break;
        case 'life':
            minCoverage = 1000000;
            maxCoverage = 50000000;
            break;
        case 'motor':
            minCoverage = 500000;
            maxCoverage = 20000000;
            break;
        case 'home':
            minCoverage = 1000000;
            maxCoverage = 100000000;
            break;
        case 'travel':
            minCoverage = 100000;
            maxCoverage = 5000000;
            break;
        default:
            minCoverage = 500000;
            maxCoverage = 10000000;
    }
    
    // Rebuild options
    coverageSelect.innerHTML = '';
    const amounts = [minCoverage, minCoverage * 2, minCoverage * 5, minCoverage * 10, maxCoverage];
    const labels = ['Basic', 'Standard', 'Premium', 'Super Premium', 'Maximum'];
    
    amounts.forEach((amount, index) => {
        const option = document.createElement('option');
        option.value = amount;
        option.textContent = labels[index] + ' - ₹' + (amount / 100000).toFixed(0) + ' Lakhs';
        coverageSelect.appendChild(option);
    });
}

// Account Page Functions
function initAccountPage() {
    // Tab switching
    const navTabs = document.querySelectorAll('.dashboard-sidebar .nav-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navTabs.forEach(function(tab) {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active tab
            navTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show target content
            tabContents.forEach(content => {
                content.classList.remove('show', 'active');
            });
            document.getElementById(targetId).classList.add('show', 'active');
        });
    });
    
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            if (email && password) {
                showNotification('Logging in...', 'info');
                
                setTimeout(() => {
                    showNotification('Login successful!', 'success');
                    // Show dashboard
                    document.getElementById('login-section').style.display = 'none';
                    document.getElementById('dashboard-section').style.display = 'block';
                }, 1500);
            } else {
                showNotification('Please fill all fields', 'warning');
            }
        });
    }
    
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const phone = document.getElementById('register-phone').value;
            const password = document.getElementById('register-password').value;
            
            if (name && email && phone && password) {
                showNotification('Creating your account...', 'info');
                
                setTimeout(() => {
                    showNotification('Account created successfully!', 'success');
                    // Switch to login
                    document.querySelector('[data-bs-target="#login-tab"]').click();
                }, 1500);
            } else {
                showNotification('Please fill all fields', 'warning');
            }
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            showNotification('Logging out...', 'info');
            
            setTimeout(() => {
                document.getElementById('dashboard-section').style.display = 'none';
                document.getElementById('login-section').style.display = 'block';
                showNotification('Logged out successfully', 'success');
            }, 1000);
        });
    }
    
    // Edit profile button
    const editProfileBtn = document.getElementById('edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            showNotification('Opening profile editor...', 'info');
        });
    }
    
    // Renew policy buttons
    const renewButtons = document.querySelectorAll('.renew-policy-btn');
    renewButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const policyId = this.getAttribute('data-policy-id');
            showNotification(`Initiating renewal for policy ${policyId}...`, 'info');
        });
    });
}

// Notification system
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(function(notification) {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
        max-width: 350px;
        background-color: ${type === 'success' ? '#d4edda' : type === 'warning' ? '#fff3cd' : '#cce5ff'};
        color: ${type === 'success' ? '#155724' : type === 'warning' ? '#856404' : '#004085'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'warning' ? '#ffeeba' : '#b8daff'};
    `;
    
    const icon = type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle';
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${icon} me-2" style="font-size: 1.25rem;"></i>
            <span style="font-weight: 500;">${message}</span>
        </div>
    `;
    
    // Add animation keyframes if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            .notification:hover {
                transform: scale(1.02);
                transition: transform 0.2s ease;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(function() {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 3000);
}

// Modal placeholder function
function showModal(title, modalId) {
    console.log(`Opening ${title} modal`);
    showNotification(`${title} functionality coming soon!`, 'info');
}

// Add active state to current page in navbar
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(function(link) {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

// Initialize active nav link
setActiveNavLink();

// Intersection Observer for service cards animation
const serviceCardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe service cards
document.querySelectorAll('.service-card-inner').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    serviceCardObserver.observe(card);
});

// Footer link hover effects with tracking
const footerLinks = document.querySelectorAll('.footer-links .footer-link');
footerLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const linkText = this.textContent.trim();
        console.log(`Footer link clicked: ${linkText}`);
    });
});

// Policy type links tracking
const policyTypeLinks = document.querySelectorAll('.footer-links li:nth-child(-n+5) .footer-link');
policyTypeLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const policyType = this.textContent.trim();
        console.log(`Policy type selected: ${policyType}`);
    });
});

// Console welcome message
console.log('%cWelcome to Policy Bazar!', 'color: #0066cc; font-size: 24px; font-weight: bold;');
console.log('%cInsurance Made Simple', 'color: #666; font-size: 14px;');
console.log('%cServices loaded successfully!', 'color: #28a745; font-size: 12px;');

// Add page load performance tracking
window.addEventListener('load', function() {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    console.log(`%cPage loaded in ${loadTime}ms`, 'color: #0066cc; font-size: 12px;');
});

// Add number formatting utility
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

// Add scroll to top button
function createScrollToTopButton() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'scroll-to-top-btn';
    btn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #0066cc;
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0, 102, 204, 0.3);
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        font-size: 1.25rem;
    `;
    
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
    
    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.body.appendChild(btn);
    
    // Show/hide button based on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
        } else {
            btn.style.opacity = '0';
            btn.style.visibility = 'hidden';
        }
    });
}

// Initialize scroll to top button
createScrollToTopButton();

