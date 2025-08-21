// We wrap our code in a DOMContentLoaded event listener to ensure
// the HTML is fully loaded before the script tries to find elements.
document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // 1. ELEMENT SELECTORS
    // ===================================================================
    // We select all the interactive elements from the HTML file at once for efficiency.
    
    // Modal elements
    const loginModal = document.getElementById('login-modal');
    const cartModal = document.getElementById('cart-modal');
    const loginBtn = document.getElementById('login-btn');
    const cartBtn = document.getElementById('cart-btn');
    const closeBtns = document.querySelectorAll('.close-btn');

    // Cart functionality elements
    const productGrid = document.querySelector('.product-section');
    const cartCountSpan = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalSpan = document.getElementById('subtotal');
    const taxesSpan = document.getElementById('taxes');
    const totalBillSpan = document.getElementById('total-bill');
    
    // Search functionality elements
    const searchBar = document.getElementById('search-bar');
    const allProductCards = document.querySelectorAll('.product-card');
    
    // Admin login form
    const loginForm = document.getElementById('login-form');

    // ===================================================================
    // 2. STATE MANAGEMENT (The website's memory)
    // ===================================================================
    // This is where we will store the items in our shopping cart.
    // It's an array of objects.
    let cart = [];


    // ===================================================================
    // 3. MODAL HANDLING LOGIC
    // ===================================================================

    // Function to open a modal
    const openModal = (modal) => {
        modal.style.display = 'block';
    };

    // Function to close a modal
    const closeModal = (modal) => {
        modal.style.display = 'none';
    };

    // Event listeners to open modals
    loginBtn.addEventListener('click', () => openModal(loginModal));
    cartBtn.addEventListener('click', () => openModal(cartModal));

    // Event listeners to close modals using the 'X' button
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(loginModal);
            closeModal(cartModal);
        });
    });

    // Event listener to close modal by clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            closeModal(loginModal);
        }
        if (event.target === cartModal) {
            closeModal(cartModal);
        }
    });

    // ===================================================================
    // 4. SHOPPING CART LOGIC
    // ===================================================================

    // Add event listener to the entire product section using event delegation
    productGrid.addEventListener('click', (event) => {
        // We only care about clicks on buttons with the class 'add-to-cart-btn'
        if (event.target.classList.contains('add-to-cart-btn')) {
            const card = event.target.closest('.product-card');
            
            // Extract product info from the clicked card
            const productName = card.querySelector('h3').textContent;
            const productPriceText = card.querySelector('.product-price').textContent;
            // Clean up the price text to get a number
            const productPrice = parseFloat(productPriceText.replace('₹', '').split(' ')[0]);
            
            // For items with a weight selector
            const weightSelector = card.querySelector('select');
            const weight = weightSelector ? weightSelector.value : 'unit'; // Default if no weight selector

            // Create a unique ID for each product variant (e.g., Rice-1kg)
            const productId = `${productName}-${weight}`;

            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                weight: weight
            });
        }
    });

    // Function to add an item to the cart or update its quantity
    const addToCart = (product) => {
        // Check if the item (with the same unique ID) is already in the cart
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            // If it exists, just increase the quantity
            existingItem.quantity++;
        } else {
            // If it's a new item, add it to the cart with quantity 1
            cart.push({ ...product, quantity: 1 });
        }

        // Update the display every time an item is added
        updateCartDisplay();
    };
    
    // Function to update everything related to the cart display
    const updateCartDisplay = () => {
        // Clear the current cart display
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is currently empty. Start shopping to add items!</p>';
        } else {
            // Loop through each item in the cart and create an HTML element for it
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item'); // For styling
                cartItemElement.innerHTML = `
                    <p><strong>${item.name}</strong> (${item.weight !== 'unit' ? item.weight : ''})</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: ₹${(item.price * item.quantity).toFixed(2)}</p>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });
        }
        
        // Update the cart count in the navbar
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
        
        // Recalculate and display the final bill
        calculateTotals();
    };

    // Function to calculate and display subtotal, taxes, and total
    const calculateTotals = () => {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const taxRate = 0.05; // 5% tax
        const taxes = subtotal * taxRate;
        const total = subtotal + taxes;

        subtotalSpan.textContent = `₹${subtotal.toFixed(2)}`;
        taxesSpan.textContent = `₹${taxes.toFixed(2)}`;
        totalBillSpan.textContent = `₹${total.toFixed(2)}`;
    };

    // ===================================================================
    // 5. SEARCH FUNCTIONALITY LOGIC
    // ===================================================================

    searchBar.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();

        allProductCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            // If product name includes the search term, show the card, otherwise hide it
            if (productName.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
    
    // ===================================================================
    // 6. ADMIN LOGIN LOGIC (DEMO)
    // ===================================================================
    
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the form from actually submitting/reloading the page
        
        const username = event.target.username.value;
        const password = event.target.password.value;
        
        // IMPORTANT: This is for demonstration only. 
        // Real-world login must be handled securely on a server, not in JavaScript!
        if (username === 'admin' && password === 'password123') {
            alert('Login successful! Welcome, Admin.');
            closeModal(loginModal);
            loginForm.reset();
        } else {
            alert('Invalid username or password. Please try again.');
        }
    });

});
      
