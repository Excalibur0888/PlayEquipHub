// Cart page functionality
function displayCartItems() {
    const cartItems = document.querySelector('.cart-items');
    const subtotalElement = document.querySelector('.subtotal');
    const totalElement = document.querySelector('.total-amount');
    
    if (!cartItems) return;

    const items = cart.items;
    
    if (items.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (subtotalElement) subtotalElement.textContent = '₹0';
        if (totalElement) totalElement.textContent = '₹0';
        return;
    }

    cartItems.innerHTML = items.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="price">₹${item.price.toLocaleString()}</p>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');

    const subtotal = cart.getTotal();
    if (subtotalElement) subtotalElement.textContent = `₹${subtotal.toLocaleString()}`;
    if (totalElement) totalElement.textContent = `₹${subtotal.toLocaleString()}`;
}

function removeFromCart(itemId) {
    cart.removeItem(itemId);
    displayCartItems();
}

// Initialize cart page
document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();

    // Handle checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.items.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            alert('Thank you for your purchase!');
            cart.items = [];
            cart.saveCart();
            displayCartItems();
        });
    }
}); 