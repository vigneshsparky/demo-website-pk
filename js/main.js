// Main JavaScript for PK Group Website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle - FIXED
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if(menuToggle && navMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if(!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
    
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
    
    // Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if(linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
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
});

// Initialize all forms on the page
function initializeForms() {
    const forms = document.querySelectorAll('form[id$="Form"], form[id$="Form"]');
    
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
                const modal = document.querySelector('.modal[style*="block"]');
                if(modal) {
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
    
    // Reset field borders
    const allFields = form.querySelectorAll('input, select, textarea');
    allFields.forEach(field => {
        field.style.borderColor = '#ddd';
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
            const phoneNumber = field.value.replace(/\D/g, '');
            if(!phoneRegex.test(phoneNumber)) {
                if(errorElement) {
                    errorElement.textContent = 'Please enter a valid 10-digit phone number';
                    errorElement.style.display = 'block';
                }
                field.style.borderColor = '#e74c3c';
                isValid = false;
            } else {
                field.value = phoneNumber; // Format the number
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

// Send form data to WhatsApp - FIXED FUNCTION
function sendToWhatsApp(formData, formType) {
    // Format message based on form type
    let message = '';
    
    switch(formType) {
        case 'jobApplication':
            message = `*🔔 New Job Application - PK Group*\n\n`;
            message += `*👤 Name:* ${formData.fullName || 'Not provided'}\n`;
            message += `*📍 Address:* ${formData.address || 'Not provided'}\n`;
            message += `*📞 Phone:* ${formData.phone || 'Not provided'}\n`;
            message += `*📧 Email:* ${formData.email || 'Not provided'}\n`;
            message += `*🎓 Education:* ${formData.education || 'Not provided'}\n`;
            message += `*💼 Experience:* ${formData.experience || 'Not provided'}\n`;
            message += `*📍 Preferred Location:* ${formData.location || 'Not provided'}\n`;
            break;
            
        case 'franchiseApplication':
            message = `*🏪 New Franchise Application - Ungal Nanpan*\n\n`;
            message += `*👤 Name:* ${formData.fullName || 'Not provided'}\n`;
            message += `*📍 Address:* ${formData.address || 'Not provided'}\n`;
            message += `*📞 Phone:* ${formData.phone || 'Not provided'}\n`;
            message += `*📧 Email:* ${formData.email || 'Not provided'}\n`;
            message += `*📍 Pincode:* ${formData.pincode || 'Not provided'}\n`;
            message += `*🏙️ City:* ${formData.city || 'Not provided'}\n`;
            message += `*💰 Investment Capacity:* ${formData.investment || 'Not provided'}\n`;
            message += `*💼 Business Experience:* ${formData.businessExp || 'Not provided'}\n`;
            message += `*🏬 Store Type:* ${formData.storeType || 'Not provided'}\n`;
            if(formData.message) message += `*💭 Additional Info:* ${formData.message}\n`;
            break;
            
        case 'investorInterest':
            message = `*💰 New Investor Interest - PK Group*\n\n`;
            message += `*👤 Name:* ${formData.fullName || 'Not provided'}\n`;
            message += `*📍 Address:* ${formData.address || 'Not provided'}\n`;
            message += `*📞 Phone:* ${formData.phone || 'Not provided'}\n`;
            message += `*📧 Email:* ${formData.email || 'Not provided'}\n`;
            message += `*💼 Profession:* ${formData.profession || 'Not provided'}\n`;
            message += `*💰 Investment Amount:* ${formData.investmentAmount || 'Not provided'}\n`;
            message += `*📊 Interest Vertical:* ${formData.interestVertical || 'Not provided'}\n`;
            message += `*🤝 Investment Type:* ${formData.investmentType || 'Not provided'}\n`;
            if(formData.previousExp) message += `*📈 Previous Experience:* ${formData.previousExp}\n`;
            message += `*⏰ Timeline:* ${formData.timeline || 'Not provided'}\n`;
            break;
            
        default:
            message = `*📋 New Form Submission - PK Group*\n\n`;
            for(const key in formData) {
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                message += `*${label}:* ${formData[key]}\n`;
            }
    }
    
    // Add timestamp and source
    message += `\n*📅 Submitted:* ${new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'})}`;
    message += `\n*🌐 Source:* PK Group Website`;
    
    // WhatsApp API URL with Indian phone number format
    // Format: +91XXXXXXXXXX (11 digit international format for India)
    const phoneNumber = '917010704215'; // Office number in international format
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    // wa.me URL format: https://wa.me/911234567890?text=Hello
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // Return true to indicate successful submission
    return true;
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

// Function to open modal (for pages without inline JS)
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Function to close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}
