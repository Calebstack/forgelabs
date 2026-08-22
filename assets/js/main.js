'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Particle/Star Canvas Background
    // ==========================================
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none'; // so it doesn't block clicks
        
        // Ensure hero section acts as a positioning root if it isn't already
        if (window.getComputedStyle(heroSection).position === 'static') {
            heroSection.style.position = 'relative';
        }
        
        heroSection.insertBefore(canvas, heroSection.firstChild);

        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        const particleCount = 80;

        const resizeCanvas = () => {
            width = heroSection.clientWidth;
            height = heroSection.clientHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 1; // 1 to 3px
                this.speedX = (Math.random() - 0.5) * 0.5; // slow drift
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2; // 0.2 to 0.7
                this.color = `rgba(200, 150, 255, ${this.opacity})`; // Subtle purple/white
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Wrap around edges
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animateParticles = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        };

        animateParticles();
    }

    // ==========================================
    // 2. Navbar Scroll Effect & 11. Scroll-to-Top
    // ==========================================
    const navbar = document.querySelector('.navbar');
    const scrollTopBtn = document.querySelector('.scroll-top');

    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Navbar effect
        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Scroll to top button visibility
        if (scrollTopBtn) {
            if (scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
    };

    // Debounce wrapper isn't strictly necessary for these lightweight toggles, 
    // but using passive: true helps scrolling performance.
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger on load

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // 3. Mobile Navigation
    // ==========================================
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelectorAll('.navbar a');

    if (navToggle && navbar) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navbar.classList.toggle('nav-active');
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('nav-active');
            });
        });

        // Close menu on click outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target)) {
                navbar.classList.remove('nav-active');
            }
        });
    }

    // ==========================================
    // 4. Smooth Scroll
    // ==========================================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    const headerHeight = 70; // fixed navbar height ~70px

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 5. Active Nav Link Highlighting
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    
    const highlightActiveNav = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - headerHeight - 10;
            const sectionId = current.getAttribute('id');
            
            const correspondingLink = document.querySelector(`.navbar a[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            } else {
                if (correspondingLink) {
                    correspondingLink.classList.remove('active');
                }
            }
        });
    };

    window.addEventListener('scroll', highlightActiveNav, { passive: true });

    // ==========================================
    // 6. Typing Animation
    // ==========================================
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const phrases = [
            'Innovative Digital Solutions',
            'Cutting-Edge Technology',
            'Forging the Future',
            'Beautiful Digital Experiences'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const type = () => {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }

            let typingSpeed = 100; // default typing speed
            if (isDeleting) {
                typingSpeed = 50; // deleting speed
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                typingSpeed = 2000; // pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500; // pause before typing next
            }

            setTimeout(type, typingSpeed);
        };

        type();
    }

    // ==========================================
    // 7. Scroll Reveal Animations
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    el.classList.add('animate');
                }, delay);

                observer.unobserve(el);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 8. Counter Animation (About Section Stats)
    // ==========================================
    const counterElements = document.querySelectorAll('.counter');

    const animateCounter = (el) => {
        const target = +el.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        // Easing function: easeOutQuart
        const easeOutQuart = t => 1 - (--t) * t * t * t;

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);

            const currentVal = Math.floor(easedProgress * target);
            el.textContent = currentVal;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = target;
            }
        };

        requestAnimationFrame(updateCounter);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    counterElements.forEach(el => counterObserver.observe(el));

    // ==========================================
    // 9. Portfolio Filter
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('[data-category]');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || filterValue === category) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ==========================================
    // 10. Contact Form (Web3Forms AJAX Submission)
    // ==========================================
    const contactForm = document.querySelector('#contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            const requiredInputs = contactForm.querySelectorAll('[required]');
            
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });

            if (isValid) {
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="ph ph-circle-notch spinner animate-spin"></i> Sending...';

                // Helper to remove any existing alert message
                const removeAlert = () => {
                    const existingAlert = contactForm.querySelector('.form-alert-msg');
                    if (existingAlert) {
                        existingAlert.remove();
                    }
                };

                removeAlert();

                const formData = new FormData(contactForm);
                const json = JSON.stringify(Object.fromEntries(formData));

                fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                })
                .then(async (response) => {
                    let result = await response.json();
                    if (response.status == 200) {
                        // Success message
                        const successMsg = document.createElement('div');
                        successMsg.className = 'form-alert-msg form-success-msg';
                        successMsg.style.color = '#10b981'; // Emerald/Green text
                        successMsg.style.marginTop = '15px';
                        successMsg.style.padding = '10px 15px';
                        successMsg.style.border = '1px solid rgba(16, 185, 129, 0.2)';
                        successMsg.style.borderRadius = '8px';
                        successMsg.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                        successMsg.style.fontSize = '0.9rem';
                        successMsg.style.display = 'flex';
                        successMsg.style.alignItems = 'center';
                        successMsg.style.gap = '8px';
                        successMsg.innerHTML = '<i class="ph ph-check-circle"></i> Message sent successfully!';
                        contactForm.appendChild(successMsg);
                        
                        contactForm.reset();
                    } else {
                        // API failure
                        console.error(result);
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'form-alert-msg form-error-msg';
                        errorMsg.style.color = '#ef4444'; // Red text
                        errorMsg.style.marginTop = '15px';
                        errorMsg.style.padding = '10px 15px';
                        errorMsg.style.border = '1px solid rgba(239, 68, 68, 0.2)';
                        errorMsg.style.borderRadius = '8px';
                        errorMsg.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                        errorMsg.style.fontSize = '0.9rem';
                        errorMsg.style.display = 'flex';
                        errorMsg.style.alignItems = 'center';
                        errorMsg.style.gap = '8px';
                        errorMsg.innerHTML = `<i class="ph ph-warning-circle"></i> Error: ${result.message || 'Something went wrong.'}`;
                        contactForm.appendChild(errorMsg);
                    }
                })
                .catch((error) => {
                    // Network error
                    console.error(error);
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'form-alert-msg form-error-msg';
                    errorMsg.style.color = '#ef4444';
                    errorMsg.style.marginTop = '15px';
                    errorMsg.style.padding = '10px 15px';
                    errorMsg.style.border = '1px solid rgba(239, 68, 68, 0.2)';
                    errorMsg.style.borderRadius = '8px';
                    errorMsg.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                    errorMsg.style.fontSize = '0.9rem';
                    errorMsg.style.display = 'flex';
                    errorMsg.style.alignItems = 'center';
                    errorMsg.style.gap = '8px';
                    errorMsg.innerHTML = '<i class="ph ph-warning-circle"></i> Network error. Please try again later.';
                    contactForm.appendChild(errorMsg);
                })
                .then(() => {
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;

                    // Automatically clear the success/error message after 5 seconds
                    setTimeout(() => {
                        removeAlert();
                    }, 5000);
                });
            }
        });
    }
});

// ==========================================
// 11. Theme Toggle
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // One-time migration: clear any old saved theme so light is the fresh default.
    // Remove this block after first deployment if you want to persist user choices.
    if (!localStorage.getItem('fl_theme_v2')) {
        localStorage.removeItem('theme');
        localStorage.setItem('fl_theme_v2', '1');
    }

    // Light mode is the CSS default — only apply dark-mode class if user chose it.
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="ph ph-sun"></i>';
        }
    } else {
        // Default: light (no class needed). Show moon icon to switch to dark.
        localStorage.removeItem('theme'); // clear any stale 'light' value
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="ph ph-moon"></i>';
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('dark-mode')) {
                // Switch TO light
                body.classList.remove('dark-mode');
                themeToggle.innerHTML = '<i class="ph ph-moon"></i>';
                localStorage.removeItem('theme'); // no entry = light (default)
            } else {
                // Switch TO dark
                body.classList.add('dark-mode');
                themeToggle.innerHTML = '<i class="ph ph-sun"></i>';
                localStorage.setItem('theme', 'dark');
            }
        });
    }
});
