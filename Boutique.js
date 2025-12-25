document.addEventListener('DOMContentLoaded', function () {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 1. ANIMATIONS ON CARDS
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top bottom-=100",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power2.out",
            delay: (index % 3) * 0.1 // Stagger effect
        });
    });

    // 2. CART MANAGEMENT
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCountElement = document.getElementById('cart-count');

    function updateCartCount() {
        if (cartCountElement) {
            cartCountElement.textContent = cart.length;
            // Pulse animation when count changes
            gsap.fromTo(cartCountElement, { scale: 1 }, { scale: 1.5, duration: 0.2, yoyo: true, repeat: 1 });
        }
    }

    function addToCart(product) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        showToast(`✅ ${product.name} ajouté !`);
    }

    window.removeItem = function (index) {
        const item = cart[index];
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        showCart(); // Refresh cart view
        showToast(`❌ ${item.name} retiré`);
    };

    // 3. EVENT LISTENERS FOR BUTTONS
    document.querySelectorAll(".card button").forEach((btn) => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".card");
            const product = {
                name: card.querySelector("h3").textContent,
                price: parseFloat(card.querySelector(".price").textContent),
                img: card.querySelector("img").src,
                id: Date.now() + Math.random()
            };

            addToCart(product);

            // Button feedback
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Ajouté';
            btn.style.backgroundColor = '#28a745';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.backgroundColor = '';
                btn.disabled = false;
            }, 2000);
        });
    });

    // 4. SHOW CART SIDEBAR / MODAL (DETAILED)
    const cartBtn = document.getElementById("cartBtn");
    if (cartBtn) {
        cartBtn.addEventListener("click", showCart);
    }

    function showCart() {
        // Remove existing cart if any
        const existingCart = document.getElementById('cart-sidebar-overlay');
        if (existingCart) existingCart.remove();

        let total = 0;
        let cartItemsHTML = '';

        if (cart.length === 0) {
            cartItemsHTML = `
                <div class="text-center py-20">
                    <i class="fas fa-shopping-basket text-5xl text-gray-700 mb-4"></i>
                    <p class="text-gray-400">Votre panier est vide</p>
                    <button onclick="closeCart()" class="mt-6 text-red-500 font-bold uppercase tracking-wider">Continuer mes achats</button>
                </div>
            `;
        } else {
            cart.forEach((item, i) => {
                total += item.price;
                cartItemsHTML += `
                    <div class="cart-item flex items-center gap-4 py-4 border-b border-gray-800 group hover:bg-white/5 px-2 transition-all duration-300">
                        <div class="relative overflow-hidden rounded-lg w-20 h-20">
                            <img src="${item.img}" class="w-full h-full object-cover">
                        </div>
                        <div class="flex-1">
                            <h4 class="text-white font-bold text-sm uppercase">${item.name}</h4>
                            <p class="text-red-500 font-black mt-1">${item.price.toFixed(2)} €</p>
                        </div>
                        <button onclick="removeItem(${i})" class="text-gray-600 hover:text-red-600 transition-colors p-2">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `;
            });
        }

        const cartHTML = `
        <div id="cart-sidebar-overlay" class="fixed inset-0 z-[9999] flex justify-end" style="background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);">
            <div id="cart-sidebar" class="w-full max-w-md bg-[#0a0a0a] h-full shadow-2xl flex flex-col transform translate-x-full transition-transform duration-500 ease-out">
                
                <!-- Cart Header -->
                <div class="p-6 border-b border-gray-800 flex items-center justify-between">
                    <h2 class="text-2xl font-black text-white uppercase tracking-tighter">
                        Détails de la <span class="text-red-600">Commande</span>
                    </h2>
                    <button onclick="closeCart()" class="text-white hover:rotate-90 transition-transform duration-300">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>

                <!-- Cart Content -->
                <div class="flex-1 overflow-y-auto p-6 scrollbar-thin">
                    ${cartItemsHTML}
                </div>

                <!-- Cart Footer -->
                ${cart.length > 0 ? `
                <div class="p-6 bg-[#111] border-t border-gray-800">
                    <div class="flex justify-between items-center mb-6">
                        <span class="text-gray-400 uppercase tracking-widest text-sm">Sous-total</span>
                        <span class="text-2xl font-black text-white">${total.toFixed(2)} €</span>
                    </div>
                    <button class="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl uppercase tracking-widest transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-600/20" onclick="alert('Braquage en cours... Paiement sécurisé par le Professeur.')">
                        Confirmer la Commande
                    </button>
                    <p class="text-center text-[10px] text-gray-600 mt-4 uppercase tracking-widest">
                        Livraison discrète par Marseille & Bogota
                    </p>
                </div>
                ` : ''}
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML("beforeend", cartHTML);

        // Animate in
        setTimeout(() => {
            const sidebar = document.getElementById('cart-sidebar');
            if (sidebar) sidebar.style.transform = 'translateX(0)';
        }, 10);
    }

    window.closeCart = function () {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-sidebar-overlay');
        if (sidebar) {
            sidebar.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (overlay) overlay.remove();
            }, 500);
        }
    };

    function showToast(message) {
        const toast = document.getElementById("toast") || createToastElement();
        toast.textContent = message;
        toast.className = "toast show";

        setTimeout(() => {
            toast.className = "toast";
        }, 3000);
    }

    function createToastElement() {
        const div = document.createElement('div');
        div.id = 'toast';
        div.className = 'toast';
        document.body.appendChild(div);
        return div;
    }

    // Initial count
    updateCartCount();

    console.log('Boutique Premium Engine Loaded 🚀');
});
