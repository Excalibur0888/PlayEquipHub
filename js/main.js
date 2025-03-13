// Cart functionality
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
    }

    addItem(product) {
        // Check if product already exists in cart
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            product.quantity = 1;
            this.items.push(product);
        }
        
        this.saveCart();
        this.updateCartCount();
        this.showAddedToCartMessage(product.name);
        
        // Если мы на странице корзины, обновляем её
        if (window.location.pathname.includes('/cart')) {
            setupCartPage();
        }
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        
        // Если мы на странице корзины, обновляем её
        if (window.location.pathname.includes('/cart')) {
            setupCartPage();
        }
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.updateCartCount();
                
                // Если мы на странице корзины, обновляем её
                if (window.location.pathname.includes('/cart')) {
                    setupCartPage();
                }
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItems() {
        return this.items;
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
        
        // Если мы на странице корзины, обновляем её
        if (window.location.pathname.includes('/cart')) {
            setupCartPage();
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    showAddedToCartMessage(productName) {
        // Create toast message
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.innerHTML = `
            <div class="toast-content">
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="#00B894" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span>${productName} added to cart!</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Show the toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Hide and remove the toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

// Initialize cart
const cart = new Cart();

// Load featured products on the home page
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация корзины
    const cart = new Cart();
    cart.updateCartCount();

    // Настройка слайдера отзывов
    if (document.querySelector('.testimonials-slider')) {
        setupTestimonialSlider();
    }

    // Настройка страницы корзины
    if (document.querySelector('.cart-page')) {
        setupCartPage();
    }

    // Настройка аккордеона FAQ
    if (document.querySelector('.faq-container')) {
        setupFaqAccordion();
    }

    // Настройка карты офисов
    if (document.querySelector('.locations-map')) {
        setupLocationMap();
    }

    // Анимация счетчиков
    if (document.querySelectorAll('.stat-number, .achievement-number, .csr-stat .stat-number').length > 0) {
        animateCounters();
    }

    // Мобильное меню
    mobileMenuToggle();

    // Initialize navigation handling
    handleNavigation();
    
    // Добавляем обработчики событий для кнопок "Add to Cart"
    setupAddToCartButtons();
});

// Функция для настройки обработчиков событий для кнопок "Add to Cart"
function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.product-card button, .catalog-product-card button');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card, .catalog-product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseInt(productCard.querySelector('.price').textContent.replace(/[^\d]/g, ''));
            const productImage = productCard.querySelector('img').getAttribute('src');
            const productDescription = productCard.querySelector('.description') ? 
                                      productCard.querySelector('.description').textContent : '';
            
            const product = {
                id: Math.floor(Math.random() * 1000) + 1, // Генерируем случайный ID
                name: productName,
                price: productPrice,
                image: productImage,
                description: productDescription
            };
            
            cart.addItem(product);
        });
    });
}

// Setup testimonial slider
function setupTestimonialSlider() {
    const slider = document.querySelector('.testimonials-slider');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    
    if (!slider || !dots.length) return;
    
    const cards = slider.querySelectorAll('.testimonial-card');
    if (!cards.length) return;
    
    // Обработчики для точек
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // Обновляем положение слайдера
            const cardWidth = slider.clientWidth;
            slider.scrollTo({
                left: index * cardWidth,
                behavior: 'smooth'
            });
            
            // Обновляем активную точку
            dots.forEach((d) => d.classList.remove('active'));
            dot.classList.add('active');
        });
    });
    
    // Отслеживаем скролл для обновления активной точки
    slider.addEventListener('scroll', () => {
        const scrollPosition = slider.scrollLeft;
        const cardWidth = slider.clientWidth;
        
        // Определяем активную карточку
        const activeIndex = Math.round(scrollPosition / cardWidth);
        
        // Обновляем активную точку
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIndex);
        });
    });
}

// Setup cart page
function setupCartPage() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) return;

    const cartItems = cart.getItems();
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        // Не скрываем блок с итогами, только обнуляем суммы
        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('total');
        if (subtotalElement) subtotalElement.textContent = '₹0';
        if (totalElement) totalElement.textContent = '₹0';
    } else {
        // Display cart items
        cartItemsContainer.innerHTML = '';
        cartItems.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="price">₹${item.price.toLocaleString()}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus-btn">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus-btn">+</button>
                    </div>
                </div>
                <div class="cart-item-total">
                    <p>₹${(item.price * item.quantity).toLocaleString()}</p>
                    <button class="remove-btn">Remove</button>
                </div>
            `;
            
            // Добавляем обработчики событий для кнопок
            const minusBtn = cartItem.querySelector('.minus-btn');
            const plusBtn = cartItem.querySelector('.plus-btn');
            const removeBtn = cartItem.querySelector('.remove-btn');
            
            minusBtn.addEventListener('click', () => {
                cart.updateQuantity(item.id, item.quantity - 1);
            });
            
            plusBtn.addEventListener('click', () => {
                cart.updateQuantity(item.id, item.quantity + 1);
            });
            
            removeBtn.addEventListener('click', () => {
                cart.removeItem(item.id);
            });
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Update summary
        document.getElementById('subtotal').textContent = `₹${cart.getTotal().toLocaleString()}`;
        document.getElementById('total').textContent = `₹${cart.getTotal().toLocaleString()}`;
    }
  
}

// Setup FAQ accordion on App page
function setupFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Закрываем все остальные элементы
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Переключаем активный элемент
            item.classList.toggle('active');
        });
    });
}

// Setup interactive map on About page
function setupLocationMap() {
    const mapMarkers = document.querySelectorAll('.map-marker');
    const locationCards = document.querySelectorAll('.location-card');
    
    if (!mapMarkers.length || !locationCards.length) return;
    
    mapMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            const city = marker.getAttribute('data-city');
            
            // Скрываем все карточки
            locationCards.forEach(card => {
                card.classList.remove('active');
            });
            
            // Показываем выбранную карточку
            const activeCard = document.getElementById(`${city}-info`);
            if (activeCard) {
                activeCard.classList.add('active');
            }
            
            // Добавляем активный класс маркеру
            mapMarkers.forEach(m => {
                m.classList.remove('active');
            });
            marker.classList.add('active');
        });
    });
}

// Animate counters on App and About pages
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number, .achievement-number, .csr-stat .stat-number');
    
    if (counters.length === 0) return;
    
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-count'));
                const duration = 2000; // 2 seconds
                let startTime = null;
                const suffix = counter.getAttribute('data-suffix') || '';
                
                function updateCounter(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const progress = timestamp - startTime;
                    const percentage = Math.min(progress / duration, 1);
                    
                    let currentCount;
                    if (Number.isInteger(target)) {
                        currentCount = Math.floor(percentage * target);
                    } else {
                        currentCount = (percentage * target).toFixed(1);
                    }
                    
                    counter.textContent = currentCount + suffix;
                    
                    if (percentage < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target + suffix;
                    }
                }
                
                requestAnimationFrame(updateCounter);
                observer.unobserve(counter);
            }
        });
    }, options);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Mobile menu toggle
const mobileMenuToggle = () => {
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    
    const navMenu = document.querySelector('.nav-menu');
    const headerContainer = document.querySelector('.header-container');
    
    headerContainer.insertBefore(menuToggle, navMenu);
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
};

// Add header scroll animation
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scrolled');
        header.classList.remove('visible');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scrolled')) {
        // Scrolling down
        header.classList.add('scrolled');
        header.classList.remove('visible');
    } else if (currentScroll < lastScroll && header.classList.contains('scrolled')) {
        // Scrolling up
        header.classList.add('visible');
    }
    
    lastScroll = currentScroll;
});

// Handle navigation to preserve URL parameters
function handleNavigation() {
    // Не применяем на странице каталога
    if (window.location.pathname.includes('/catalog')) {
        return;
    }
    
    const catalogLinks = document.querySelectorAll('a[href="/catalog"]');
    catalogLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // If we already have category parameter in URL, preserve it
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get('category');
            if (category) {
                e.preventDefault();
                window.location.href = `/catalog?category=${category}`;
            }
        });
    });
} 