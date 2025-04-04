/**
 * Bootstrap Tutorial - Main JavaScript File
 */

// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    initTooltips();
    
    // Initialize popovers
    initPopovers();
    
    // Setup smooth scrolling
    setupSmoothScrolling();
    
    // Highlight active sidebar item based on scroll position
    setupScrollSpy();
    
    // Setup code blocks with language tags and copy buttons
    setupCodeBlocks();
    
    // Initialize back to top button
    setupBackToTop();
    
    // Setup theme switcher
    setupThemeSwitcher();
    
    // Load all demo components
    loadDemos();
});

/**
 * Initialize Bootstrap tooltips
 */
function initTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

/**
 * Initialize Bootstrap popovers
 */
function initPopovers() {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
}

/**
 * Setup smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
    // Sélectionner tous les liens de navigation, à la fois dans la navbar et la sidebar
    document.querySelectorAll('.navbar .nav-link, .sidebar .nav-link').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Vérifier si c'est un lien avec ancre
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // S'assurer que la section cible est visible
                    targetElement.style.display = 'block';
                    
                    // Supprimer la classe active de tous les liens de la sidebar
                    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Ajouter la classe active au lien cliqué ou au lien correspondant dans la sidebar
                    if (this.classList.contains('sidebar-link')) {
                        this.classList.add('active');
                    } else {
                        // Si c'est un lien de la navbar, trouver le lien correspondant dans la sidebar
                        const sidebarLink = document.querySelector(`.sidebar .nav-link[href="${targetId}"]`);
                        if (sidebarLink) {
                            sidebarLink.classList.add('active');
                        }
                    }
                    
                    // Calculer la position de défilement
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const offsetTop = targetElement.offsetTop - navbarHeight - 20;
                    
                    // Faire défiler jusqu'à la section
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Mettre à jour l'URL sans provoquer de défilement
                    history.pushState(null, null, targetId);
                    
                    // Déclencher un événement personnalisé pour informer d'autres scripts
                    const event = new CustomEvent('sectionChanged', { 
                        detail: { 
                            targetId: targetId,
                            element: targetElement
                        } 
                    });
                    document.dispatchEvent(event);
                }
            }
        });
    });
}

/**
 * Setup scrollspy to highlight active sidebar items
 */
function setupScrollSpy() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            
            if (window.scrollY >= sectionTop - navbarHeight - 50) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Setup code blocks with language tags and copy buttons
 */
function setupCodeBlocks() {
    document.querySelectorAll('.code-display').forEach(codeBlock => {
        // Add language tag if not already present
        if (!codeBlock.hasAttribute('data-language')) {
            // Try to determine language from context or default to "html"
            let language = "html";
            const codeContent = codeBlock.textContent.trim();
            
            if (codeContent.startsWith('import') || codeContent.includes('function') || codeContent.includes('const ')) {
                language = "javascript";
            } else if (codeContent.includes('@media') || codeContent.includes(':root') || codeContent.includes('.class {')) {
                language = "css";
            } else if (codeContent.includes('npm install') || codeContent.includes('yarn add')) {
                language = "bash";
            }
            
            codeBlock.setAttribute('data-language', language);
        }
        
        // Add copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';
        copyButton.innerHTML = '<i class="bi bi-clipboard"></i>';
        copyButton.setAttribute('title', 'Copier le code');
        copyButton.setAttribute('data-bs-toggle', 'tooltip');
        copyButton.setAttribute('data-bs-placement', 'top');
        
        copyButton.addEventListener('click', function() {
            const codeText = codeBlock.textContent;
            navigator.clipboard.writeText(codeText).then(() => {
                copyButton.innerHTML = '<i class="bi bi-check2"></i>';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="bi bi-clipboard"></i>';
                }, 2000);
            });
        });
        
        codeBlock.appendChild(copyButton);
    });
}

/**
 * Setup back to top button
 */
function setupBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        });
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Setup theme switcher (dark/light mode)
 */
function setupThemeSwitcher() {
    const themeSwitcher = document.getElementById('theme-switcher');
    
    if (themeSwitcher) {
        // Check for saved theme preference or use preferred color scheme
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Set initial theme
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-theme');
            themeSwitcher.innerHTML = '<i class="bi bi-sun-fill"></i>';
        } else {
            themeSwitcher.innerHTML = '<i class="bi bi-moon-fill"></i>';
        }
        
        // Toggle theme on click
        themeSwitcher.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
                themeSwitcher.innerHTML = '<i class="bi bi-sun-fill"></i>';
            } else {
                localStorage.setItem('theme', 'light');
                themeSwitcher.innerHTML = '<i class="bi bi-moon-fill"></i>';
            }
        });
    }
}

/**
 * Load all interactive demos
 */
function loadDemos() {
    // Todo List Demo
    initTodoListDemo();
    
    // Shopping Cart Demo
    initShoppingCartDemo();
    
    // Dynamic Form Validation Demo
    initFormValidationDemo();
    
    // Bootstrap Carousel with Controls
    initCarouselDemo();
}

/**
 * Initialize Todo List Demo
 */
function initTodoListDemo() {
    const todoApp = document.getElementById('todoApp');
    
    if (todoApp) {
        const todoForm = document.getElementById('todoForm');
        const todoInput = document.getElementById('todoInput');
        const todoList = document.getElementById('todoList');
        const clearCompletedBtn = document.getElementById('clearCompletedBtn');
        const clearAllBtn = document.getElementById('clearAllBtn');
        const taskCount = document.getElementById('taskCount');
        
        // Add a new task
        todoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const taskText = todoInput.value.trim();
            
            if (taskText) {
                // Create a new list item
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                
                // Create the inner structure
                li.innerHTML = `
                    <div>
                        <input class="form-check-input me-2 todo-check" type="checkbox">
                        <span>${taskText}</span>
                    </div>
                    <button class="btn btn-sm btn-danger delete-btn">
                        <i class="bi bi-trash"></i>
                    </button>
                `;
                
                // Add the element to the list
                todoList.appendChild(li);
                
                // Reset the input field
                todoInput.value = '';
                
                // Update the task counter
                updateTaskCount();
            }
        });
        
        // Handle clicks on the list (event delegation)
        todoList.addEventListener('click', function(e) {
            // If clicking on a delete button
            if (e.target.classList.contains('delete-btn') || e.target.parentElement.classList.contains('delete-btn')) {
                const li = e.target.closest('li');
                todoList.removeChild(li);
                updateTaskCount();
            }
            
            // If clicking on a checkbox
            if (e.target.classList.contains('todo-check')) {
                const span = e.target.nextElementSibling;
                if (e.target.checked) {
                    span.style.textDecoration = 'line-through';
                    span.style.color = '#6c757d';
                } else {
                    span.style.textDecoration = 'none';
                    span.style.color = '';
                }
            }
        });
        
        // Clear completed tasks
        if (clearCompletedBtn) {
            clearCompletedBtn.addEventListener('click', function() {
                const completedTasks = document.querySelectorAll('.todo-check:checked');
                completedTasks.forEach(task => {
                    const li = task.closest('li');
                    todoList.removeChild(li);
                });
                updateTaskCount();
            });
        }
        
        // Clear all tasks
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', function() {
                todoList.innerHTML = '';
                updateTaskCount();
            });
        }
        
        // Update task counter
        function updateTaskCount() {
            const count = todoList.children.length;
            if (taskCount) {
                taskCount.textContent = count;
            }
        }
        
        // Initialize events for existing elements
        const checks = document.querySelectorAll('.todo-check');
        checks.forEach(check => {
            check.addEventListener('change', function() {
                const span = this.nextElementSibling;
                if (this.checked) {
                    span.style.textDecoration = 'line-through';
                    span.style.color = '#6c757d';
                } else {
                    span.style.textDecoration = 'none';
                    span.style.color = '';
                }
            });
        });
        
        const deleteBtns = document.querySelectorAll('.delete-btn');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const li = this.closest('li');
                todoList.removeChild(li);
                updateTaskCount();
            });
        });
    }
}

/**
 * Initialize Shopping Cart Demo
 */
function initShoppingCartDemo() {
    const shoppingCart = document.getElementById('shopping-cart-demo');
    
    if (shoppingCart) {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        const cartItems = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        const cartTotal = document.getElementById('cartTotal');
        const clearCartBtn = document.getElementById('clearCartBtn');
        
        let cart = [];
        
        // Add to cart
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = this.dataset.id;
                const name = this.dataset.name;
                const price = parseFloat(this.dataset.price);
                
                // Check if the product is already in the cart
                const existingItem = cart.find(item => item.id === id);
                
                if (existingItem) {
                    // Increment quantity
                    existingItem.quantity++;
                } else {
                    // Add a new item
                    cart.push({
                        id,
                        name,
                        price,
                        quantity: 1
                    });
                }
                
                // Update cart display
                updateCart();
                
                // Feedback animation
                this.textContent = 'Ajouté!';
                this.classList.remove('btn-primary');
                this.classList.add('btn-success');
                
                setTimeout(() => {
                    this.textContent = 'Ajouter au panier';
                    this.classList.remove('btn-success');
                    this.classList.add('btn-primary');
                }, 1000);
            });
        });
        
        // Clear cart
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', function() {
                cart = [];
                updateCart();
            });
        }
        
        // Update cart display
        function updateCart() {
            if (!cartItems) return;
            
            // Clear current cart content
            cartItems.innerHTML = '';
            
            if (cart.length === 0) {
                // Show empty cart message
                if (emptyCart) {
                    cartItems.appendChild(emptyCart);
                } else {
                    const emptyMessage = document.createElement('li');
                    emptyMessage.className = 'list-group-item text-center text-muted';
                    emptyMessage.id = 'emptyCart';
                    emptyMessage.textContent = 'Votre panier est vide';
                    cartItems.appendChild(emptyMessage);
                }
                
                if (cartTotal) {
                    cartTotal.textContent = '0,00 €';
                }
                return;
            }
            
            let total = 0;
            
            // Add each cart item
            cart.forEach((item, index) => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                li.innerHTML = `
                    <div>
                        <span>${item.name}</span>
                        <span class="badge bg-primary rounded-pill ms-2">${item.quantity}</span>
                    </div>
                    <div>
                        <span class="me-2">${itemTotal.toFixed(2)} €</span>
                        <button class="btn btn-sm btn-danger remove-item" data-index="${index}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
                
                cartItems.appendChild(li);
            });
            
            // Add remove item functionality
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    cart.splice(index, 1);
                    updateCart();
                });
            });
            
            // Update total
            if (cartTotal) {
                cartTotal.textContent = `${total.toFixed(2)} €`;
            }
        }
    }
}

/**
 * Initialize Form Validation Demo
 */
function initFormValidationDemo() {
    const formDemo = document.getElementById('validation-form-demo');
    
    if (formDemo) {
        const form = document.getElementById('advancedForm');
        
        if (form) {
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirmPassword');
            
            // Set custom error messages
            form.querySelectorAll('input').forEach(input => {
                const feedbackElement = input.nextElementSibling;
                if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
                    feedbackElement.textContent = input.dataset.errorMessage || 'Ce champ est requis.';
                }
            });
            
            // Check password match
            if (confirmPassword && password) {
                confirmPassword.addEventListener('input', function() {
                    if (this.value !== password.value) {
                        this.setCustomValidity('Les mots de passe ne correspondent pas.');
                    } else {
                        this.setCustomValidity('');
                    }
                });
            }
            
            // Form validation on submit
            form.addEventListener('submit', function(event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    // For this example, prevent actual submission
                    event.preventDefault();
                    
                    // Show success message
                    form.innerHTML = `
                        <div class="alert alert-success" role="alert">
                            Inscription réussie! Un email de confirmation a été envoyé.
                        </div>
                    `;
                }
                
                form.classList.add('was-validated');
            });
        }
    }
}

/**
 * Initialize Carousel Demo with Controls
 */
function initCarouselDemo() {
    const dynamicCarousel = document.getElementById('dynamicCarousel');
    
    if (dynamicCarousel) {
        const carouselInner = document.getElementById('carouselInner');
        const carouselIndicators = document.getElementById('carouselIndicators');
        
        if (!carouselInner || !carouselIndicators) return;
        
        // Sample image data (in a real app, this might come from an API)
        const images = [
            { url: 'https://via.placeholder.com/800x400/007bff/ffffff?text=Image+1', title: 'Titre 1', description: 'Description 1' },
            { url: 'https://via.placeholder.com/800x400/28a745/ffffff?text=Image+2', title: 'Titre 2', description: 'Description 2' },
            { url: 'https://via.placeholder.com/800x400/dc3545/ffffff?text=Image+3', title: 'Titre 3', description: 'Description 3' }
        ];
        
        // Generate slides and indicators
        images.forEach((image, index) => {
            // Create indicator
            const indicator = document.createElement('button');
            indicator.setAttribute('type', 'button');
            indicator.setAttribute('data-bs-target', '#dynamicCarousel');
            indicator.setAttribute('data-bs-slide-to', index.toString());
            
            if (index === 0) {
                indicator.classList.add('active');
                indicator.setAttribute('aria-current', 'true');
            }
            
            indicator.setAttribute('aria-label', `Slide ${index + 1}`);
            carouselIndicators.appendChild(indicator);
            
            // Create slide
            const slide = document.createElement('div');
            slide.classList.add('carousel-item');
            if (index === 0) {
                slide.classList.add('active');
            }
            
            slide.innerHTML = `
                <img src="${image.url}" class="d-block w-100" alt="${image.title}">
                <div class="carousel-caption d-none d-md-block">
                    <h5>${image.title}</h5>
                    <p>${image.description}</p>
                </div>
            `;
            
            carouselInner.appendChild(slide);
        });
    }
}

/**
 * Adds animation classes to elements when they enter the viewport
 */
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationClass = element.dataset.animation || 'fadeIn';
                element.classList.add(animationClass);
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
} 