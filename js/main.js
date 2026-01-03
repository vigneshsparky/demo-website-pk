// Main JavaScript for PK Group Website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if(menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if(navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    // Initialize Swiper for testimonials
    if(document.querySelector('.testimonials-swiper')) {
        const swiper = new Swiper('.testimonials-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }
    
    // Form validation and submission for all forms
    initializeForms();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop();
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if(linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Initialize all forms on the page
function initializeForms() {
    const forms = document.querySelectorAll('form[id$="Form"]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if(validateForm(this)) {
                const formData = getFormData(this);
                const formType = this.id.replace('Form', '');
                
                // Send data to WhatsApp
                sendToWhatsApp(formData, formType);
                
                // Show success notification
                showNotification();
                
                // Reset form
                this.reset();
                
                // Close modal if open
                const modal = document.querySelector('.modal');
                if(modal && modal.style.display === 'block') {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            }
        });
    });
}

// Validate form inputs
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    // Reset error messages
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.style.display = 'none';
        error.textContent = '';
    });
    
    // Validate each required field
    requiredFields.forEach(field => {
        const fieldId = field.id;
        const errorElement = document.getElementById(`${fieldId}Error`) || field.parentNode.querySelector('.error-message');
        
        // Check if field is empty
        if(!field.value.trim()) {
            if(errorElement) {
                errorElement.textContent = 'This field is required';
                errorElement.style.display = 'block';
            }
            field.style.borderColor = '#e74c3c';
            isValid = false;
        } 
        // Validate phone number
        else if(field.type === 'tel' || field.id === 'phone') {
            const phoneRegex = /^[0-9]{10}$/;
            if(!phoneRegex.test(field.value.replace(/\D/g, ''))) {
                if(errorElement) {
                    errorElement.textContent = 'Please enter a valid 10-digit phone number';
                    errorElement.style.display = 'block';
                }
                field.style.borderColor = '#e74c3c';
                isValid = false;
            } else {
                field.style.borderColor = '#ddd';
            }
        }
        // Validate email if provided
        else if(field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(field.value.trim())) {
                if(errorElement) {
                    errorElement.textContent = 'Please enter a valid email address';
                    errorElement.style.display = 'block';
                }
                field.style.borderColor = '#e74c3c';
                isValid = false;
            } else {
                field.style.borderColor = '#ddd';
            }
        } 
        // Valid field
        else {
            field.style.borderColor = '#ddd';
        }
    });
    
    return isValid;
}

// Get form data as object
function getFormData(form) {
    const formData = {};
    const formElements = form.querySelectorAll('input, select, textarea');
    
    formElements.forEach(element => {
        if(element.name && element.type !== 'submit') {
            if(element.type === 'checkbox') {
                formData[element.name] = element.checked ? 'Yes' : 'No';
            } else {
                formData[element.name] = element.value.trim();
            }
        }
    });
    
    return formData;
}

// Send form data to WhatsApp
function sendToWhatsApp(formData, formType) {
    // Format message based on form type
    let message = `*New ${formType} Application*\n\n`;
    
    // Add form data to message
    for(const key in formData) {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        message += `*${label}:* ${formData[key]}\n`;
    }
    
    // Add timestamp
    message += `\n*Submitted:* ${new Date().toLocaleString()}`;
    message += `\n*Source:* PK Group Website`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp API URL
    const phoneNumber = '7010704215';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
}

// Show success notification
function showNotification() {
    const notification = document.getElementById('successNotification');
    if(notification) {
        notification.classList.add('show');
        
        // Auto hide after 8 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 8000);
    }
}