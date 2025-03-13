// Extended product data
var catalogProducts = [
    {
        id: 1,
        name: 'Premium Running Shoes',
        price: 4999,
        image: '/images/shoes.jpg',
        category: 'Shoes',
        description: 'Professional running shoes with advanced cushioning technology.'
    },
    {
        id: 2,
        name: 'Professional Tennis Racket',
        price: 7999,
        image: '/images/rackets.jpg',
        category: 'Rackets',
        description: 'High-performance tennis racket for professional players.'
    },
    {
        id: 3,
        name: 'Football Ball',
        price: 1999,
        image: '/images/balls.jpg',
        category: 'Balls',
        description: 'Official size and weight football for competitive play.'
    },
    {
        id: 4,
        name: 'Training Shoes',
        price: 2999,
        image: '/images/shoes1.jpg',
        category: 'Shoes',
        description: 'Versatile training shoes for various sports activities.'
    },
    {
        id: 5,
        name: 'Badminton Racket',
        price: 3999,
        image: '/images/rackets1.jpg',
        category: 'Rackets',
        description: 'Lightweight badminton racket for quick movements.'
    },
    {
        id: 6,
        name: 'Basketball',
        price: 2499,
        image: '/images/balls1.jpg',
        category: 'Balls',
        description: 'Indoor/outdoor basketball with superior grip.'
    },
    {
        id: 7,
        name: 'Elite Running Shoes',
        price: 5999,
        image: '/images/shoes2.jpg',
        category: 'Shoes',
        description: 'Elite-level running shoes with carbon fiber plate.'
    },
    {
        id: 8,
        name: 'Table Tennis Racket',
        price: 2999,
        image: '/images/rackets2.jpg',
        category: 'Rackets',
        description: 'Professional table tennis racket with premium rubber.'
    },
    {
        id: 9,
        name: 'Volleyball',
        price: 1799,
        image: '/images/balls2.jpg',
        category: 'Balls',
        description: 'Competition-grade volleyball with soft touch technology.'
    },
    {
        id: 10,
        name: 'Cross Training Shoes',
        price: 4499,
        image: '/images/shoes3.jpg',
        category: 'Shoes',
        description: 'Versatile shoes perfect for CrossFit and gym training.'
    },
    {
        id: 11,
        name: 'Squash Racket',
        price: 4599,
        image: '/images/rackets3.jpg',
        category: 'Rackets',
        description: 'Professional squash racket with balanced weight distribution.'
    },
    {
        id: 12,
        name: 'Cricket Ball',
        price: 899,
        image: '/images/balls3.jpg',
        category: 'Balls',
        description: 'Premium leather cricket ball for match play.'
    },
    {
        id: 13,
        name: 'Basketball Shoes',
        price: 6999,
        image: '/images/shoes4.jpg',
        category: 'Shoes',
        description: 'High-top basketball shoes with ankle support.'
    },
    {
        id: 14,
        name: 'Tennis Racket Pro',
        price: 8999,
        image: '/images/rackets4.jpg',
        category: 'Rackets',
        description: 'Tournament-grade tennis racket with power frame.'
    },
    {
        id: 15,
        name: 'Rugby Ball',
        price: 2299,
        image: '/images/balls4.jpg',
        category: 'Balls',
        description: 'Official rugby ball with enhanced grip pattern.'
    },
    {
        id: 16,
        name: 'Indoor Court Shoes',
        price: 3799,
        image: '/images/shoes5.jpg',
        category: 'Shoes',
        description: 'Specialized shoes for indoor court sports.'
    },
    {
        id: 17,
        name: 'Kids Tennis Racket',
        price: 1999,
        image: '/images/rackets5.jpg',
        category: 'Rackets',
        description: 'Lightweight tennis racket designed for young players.'
    },
    {
        id: 18,
        name: 'Training Ball Set',
        price: 3499,
        image: '/images/balls5.jpg',
        category: 'Balls',
        description: 'Set of training balls for multiple sports.'
    },
    {
        id: 19,
        name: 'Trail Running Shoes',
        price: 5499,
        image: '/images/shoes6.jpg',
        category: 'Shoes',
        description: 'Durable trail running shoes with rock protection.'
    },
    {
        id: 20,
        name: 'Badminton Pro Racket',
        price: 6999,
        image: '/images/rackets6.jpg',
        category: 'Rackets',
        description: 'Professional-grade badminton racket for tournament play.'
    }
];

// Filter products based on category and price
function filterProducts() {
    const categoryFilter = document.getElementById('category-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    
    const productCards = document.querySelectorAll('.catalog-product-card');
    
    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent;
        const productPrice = parseInt(card.querySelector('.price').textContent.replace(/[^\d]/g, ''));
        
        // Находим соответствующий продукт в массиве для определения категории
        const product = catalogProducts.find(p => p.name === productName);
        const category = product ? product.category : '';
        
        let showByCategory = true;
        let showByPrice = true;
        
        // Фильтрация по категории
        if (categoryFilter && category !== categoryFilter) {
            showByCategory = false;
        }
        
        // Фильтрация по цене
        if (priceFilter) {
            switch(priceFilter) {
                case '0-2000':
                    showByPrice = productPrice < 2000;
                    break;
                case '2000-5000':
                    showByPrice = productPrice >= 2000 && productPrice <= 5000;
                    break;
                case '5000+':
                    showByPrice = productPrice > 5000;
                    break;
            }
        }
        
        // Показываем или скрываем карточку
        if (showByCategory && showByPrice) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Set filter from localStorage or URL parameters
function setFilterFromStorage() {
    // Сначала проверяем localStorage для категории
    const storedCategory = localStorage.getItem('selectedCategory');
    
    if (storedCategory) {
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            // Capitalize first letter to match the format in the select options
            const formattedCategory = storedCategory.charAt(0).toUpperCase() + storedCategory.slice(1).toLowerCase();
            
            // Check if this category exists in options
            const exists = Array.from(categoryFilter.options).some(option => 
                option.value === formattedCategory
            );
            
            if (exists) {
                categoryFilter.value = formattedCategory;
                // Очищаем localStorage после использования
                localStorage.removeItem('selectedCategory');
                filterProducts(); // Применяем фильтр
                return; // Если нашли категорию, дальше не проверяем
            }
        }
    }
    
    // Проверяем localStorage для спорта
    const storedSport = localStorage.getItem('selectedSport');
    
    if (storedSport) {
        // Здесь можно добавить логику для фильтрации по спорту
        // Например, можно установить соответствующую категорию в зависимости от спорта
        
        // Для примера, сопоставим спорты с категориями
        let category = '';
        switch(storedSport.toLowerCase()) {
            case 'cricket':
            case 'baseball':
            case 'football':
            case 'basketball':
                category = 'Balls';
                break;
            case 'tennis':
            case 'badminton':
            case 'squash':
                category = 'Rackets';
                break;
            case 'running':
            case 'basketball':
                category = 'Shoes';
                break;
        }
        
        if (category) {
            const categoryFilter = document.getElementById('category-filter');
            if (categoryFilter) {
                categoryFilter.value = category;
                // Очищаем localStorage после использования
                localStorage.removeItem('selectedSport');
                filterProducts(); // Применяем фильтр
                return; // Если нашли спорт, дальше не проверяем
            }
        }
    }
    
    // Если в localStorage ничего нет, проверяем URL параметры
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            // Capitalize first letter to match the format in the select options
            const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
            
            // Check if this category exists in options
            const exists = Array.from(categoryFilter.options).some(option => 
                option.value === formattedCategory
            );
            
            if (exists) {
                categoryFilter.value = formattedCategory;
                filterProducts(); // Применяем фильтр
            }
        }
    }
}

// Create product card for catalog
function createCatalogProductCard(product) {
    const card = document.createElement('div');
    card.className = 'catalog-product-card';
    
    // Создаем HTML-структуру карточки
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="description">${product.description}</p>
            <p class="price">₹${product.price.toLocaleString()}</p>
            <button>Add to Cart</button>
        </div>
    `;
    
    // Добавляем обработчик события для кнопки
    const button = card.querySelector('button');
    button.addEventListener('click', () => {
        cart.addItem(product);
    });
    
    return card;
}

// Update catalog display
function updateCatalogDisplay(isInitialLoad = false) {
    const catalogGrid = document.querySelector('.catalog-grid');
    if (!catalogGrid) return;

    catalogGrid.innerHTML = '';
    const filteredProducts = filterProducts();

    filteredProducts.forEach(product => {
        const productCard = createCatalogProductCard(product);
        catalogGrid.appendChild(productCard);
    });
    
    // Не обновляем URL при изменении фильтра
}

// Initialize catalog page
document.addEventListener('DOMContentLoaded', () => {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');

    if (categoryFilter && priceFilter) {
        // Set initial filter from localStorage or URL parameters
        setFilterFromStorage();
        
        // Add event listeners
        categoryFilter.addEventListener('change', filterProducts);
        priceFilter.addEventListener('change', filterProducts);
    }
}); 