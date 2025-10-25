document.addEventListener('DOMContentLoaded', () => {
    
    // --- Initialize Lucide Icons ---
    lucide.createIcons();

    // Enhanced Header Scroll Effects
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollProgress = document.querySelector('.scroll-progress');

    // Scroll progress and header effects
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const viewportHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Scroll progress
        if (scrollProgress) {
            const totalScroll = documentHeight - viewportHeight;
            const progress = (scrolled / totalScroll) * 100;
            scrollProgress.style.width = `${progress}%`;
        }
        
        // Header shadow and transform
        if (scrolled > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active nav link highlighting
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrolled >= sectionTop && scrolled < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scrolling for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize active nav link on page load
    const initializeActiveNavLink = () => {
        const currentSection = window.location.hash || '#';
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    };

    // Call initialization
    initializeActiveNavLink();

    // --- Section Scroll Animations ---
    function initScrollAnimations() {
        const sections = document.querySelectorAll('.section-scroll');
        
        if (sections.length > 0) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        
                        // Add delay for staggered children
                        const staggeredChildren = entry.target.querySelectorAll('.section-stagger > *');
                        staggeredChildren.forEach((child, index) => {
                            child.style.transitionDelay = `${0.1 + (index * 0.1)}s`;
                        });
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            sections.forEach(section => {
                sectionObserver.observe(section);
            });
        }
    }

    // Initialize scroll animations
    initScrollAnimations();

    // --- Theme Toggling ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // Function to set theme (called on load and on toggle)
    const setTheme = (theme) => {
        if (theme === 'light') {
            htmlEl.classList.add('light');
            htmlEl.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            htmlEl.classList.add('dark');
            htmlEl.classList.remove('light');
            localStorage.setItem('theme', 'dark');
        }
    };

    
    // Function to set initial theme on page load - DARK MODE AS DEFAULT
    const setInitialTheme = () => {
        const storedTheme = localStorage.getItem('theme');
        // Always default to dark mode unless user explicitly chose light
        const initialTheme = storedTheme ? storedTheme : 'dark';
        setTheme(initialTheme);
    };

    // Set the initial theme
    setInitialTheme();

    // Add click listener for the toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlEl.classList.contains('dark') ? 'dark' : 'light';
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
            lucide.createIcons(); // Re-render icons if they change (sun/moon)
        });
    }

    // --- Reveal on Scroll ---
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    revealElements.forEach(el => observer.observe(el));
    
    // --- Copy to Clipboard ---
    const unsecuredCopyToClipboard = (text) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showToast('Copied to clipboard!', 'success');
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
        document.body.removeChild(textArea);
    };
    
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const valueToCopy = button.dataset.copyValue;
            if (valueToCopy) {
                unsecuredCopyToClipboard(valueToCopy);
            }
        });
    });

    // --- Show Toast Notification ---
    const toastContainer = document.getElementById('toast-container');
    const showToast = (message, type = 'success') => {
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = '';
        if (type === 'success') {
            icon = '<i data-lucide="check-circle" class="w-5 h-5"></i>';
        }
        
        toast.innerHTML = `${icon}<span>${message}</span>`;
        toastContainer.appendChild(toast);
        
        // Re-render lucide icon
        lucide.createIcons({
            nodes: [toast.querySelector('i')]
        });
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    };

    // --- Keyboard Shortcuts ---
    window.addEventListener('keydown', (e) => {
        // 'T' for Theme
        if (e.key === 't' && !e.metaKey && !e.ctrlKey) {
            if (document.activeElement.tagName.toLowerCase() !== 'input' && document.activeElement.tagName.toLowerCase() !== 'textarea') {
                themeToggle.click();
            }
        }
    });

    // --- Footer Dates ---
    document.getElementById('footer-year').textContent = new Date().getFullYear();
    document.getElementById('last-deploy').textContent = new Date().toISOString();

    // --- Filter Chips Logic ---
    const filterChips = document.querySelectorAll('.filter-chip');
    const projectGrid = document.getElementById('project-grid');
    
    // Gracefully handle if project grid doesn't exist
    if (projectGrid) {
        const projectCards = Array.from(projectGrid.querySelectorAll('.project-card'));

        if (projectCards.length > 0) {
            filterChips.forEach(chip => {
                chip.addEventListener('click', () => {
                    // Update active chip
                    filterChips.forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                    
                    const filter = chip.dataset.filter.toLowerCase();
                    
                    // Filter logic
                    projectCards.forEach(card => {
                        const tags = card.dataset.tags ? card.dataset.tags.split(',') : [];
                        
                        if (filter === 'all' || tags.includes(filter)) {
                            card.style.display = 'flex'; // Use flex as it's a flex column
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            });
        }
    }
});