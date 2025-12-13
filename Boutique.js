        // Attendre que le DOM soit chargé
        document.addEventListener('DOMContentLoaded', function() {
            // Sélectionner tous les boutons
            const buttons = document.querySelectorAll('.card button');
            const cartCount = document.getElementById('cart-count');
            let count = 0;

            console.log('Nombre de boutons trouvés:', buttons.length);

            // Fonction de notification
            function showNotification(message) {
                const notification = document.createElement('div');
                notification.textContent = message;
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%) translateY(-100px);
                    background: #28a745;
                    color: white;
                    padding: 15px 25px;
                    border-radius: 5px;
                    z-index: 1000;
                    font-family: Arial, sans-serif;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    transition: transform 0.5s ease;
                `;

                document.body.appendChild(notification);

                // Animation d'entrée
                setTimeout(() => {
                    notification.style.transform = 'translateX(-50%) translateY(0)';
                }, 8000);

                // Disparition
                setTimeout(() => {
                    notification.style.transform = 'translateX(-50%) translateY(-100px)';
                    setTimeout(() => {
                        if (notification.parentNode) {
                            document.body.removeChild(notification);
                        }
                    }, 5000);
                }, 9000);
            }

            // Ajouter les événements aux boutons
            buttons.forEach((button, index) => {
                button.addEventListener('click', function() {
                    console.log('Bouton cliqué:', index);
                    
                    const card = this.closest('.card');
                    const productName = card.querySelector('h3').textContent;
                    
                    // Incrémenter le compteur
                    count++;
                    cartCount.textContent = count;
                    
                    // Animation du compteur
                    cartCount.style.transform = 'scale(1.5)';
                    setTimeout(() => {
                        cartCount.style.transform = 'scale(1)';
                    }, 9000);

                    // Notification
                    showNotification(`✅ ${productName} ajouté au panier !`);

                    // Feedback bouton
                    const originalText = this.textContent;
                    const originalBg = this.style.backgroundColor;
                    
                    this.textContent = '✓ Ajouté !';
                    this.style.backgroundColor = '#28a745';
                    this.disabled = true;
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.backgroundColor = originalBg;
                        this.disabled = false;
                    }, 9000);
                });
            });

            console.log('Script chargé avec succès!');
        });


        


        // ----------------------------
// GESTION DU PANIER
// ----------------------------

// Récupération du panier (localStorage)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Mise à jour du compteur panier
function updateCartCount() {
    document.getElementById("cart-count").textContent = cart.length;
}
updateCartCount();


// Ajouter un produit
function addToCart(product) {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}


// Gestion du clic sur les boutons "Ajouter au panier"
document.querySelectorAll(".card button").forEach((btn, index) => {
    btn.addEventListener("click", () => {
        const card = btn.closest(".card");
        const product = {
            name: card.querySelector("h3").textContent,
            price: parseFloat(card.querySelector(".price").textContent),
            img: card.querySelector("img").src
        };

        addToCart(product);
        showToast("Produit ajouté au panier 🛒");
    });
});


// ----------------------------
// AFFICHAGE DU PANIER POPUP
// ----------------------------

document.getElementById("cartBtn").addEventListener("click", showCart);

function showCart() {
    let total = 0;

    let cartHTML = `
    <div style="position:fixed; top:0; left:0; width:100%; height:100%;
                background:#000000d2; backdrop-filter:blur(4px);
                display:flex; justify-content:center; align-items:center; z-index:9999;">
        <div style="background:white; width:380px; max-height:80%; overflow-y:auto;
                    border-radius:12px; padding:20px; box-shadow:0 0 20px black;">

            <h2 style="text-align:center;">🛒 Votre Panier</h2>
            <hr>
    `;

    if (cart.length === 0) {
        cartHTML += `<p style="text-align:center;">Votre panier est vide.</p>`;
    } else {
        cart.forEach((item, i) => {
            total += item.price;

            cartHTML += `
                <div style="display:flex; align-items:center; margin-bottom:12px;">
                    <img src="${item.img}" style="width:60px; height:60px; object-fit:cover; border-radius:8px; margin-right:10px;">
                    <div style="flex:1;">
                        <strong>${item.name}</strong><br>
                        <span>${item.price} €</span>
                    </div>
                    <button onclick="removeItem(${i})" 
                        style="background:red; color:white; border:none; padding:5px 10px; border-radius:5px;">
                        Supprimer
                    </button>
                </div>
            `;
        });
    }

    cartHTML += `
            <hr>
            <h4>Total : ${total.toFixed(2)} €</h4>
            <button onclick="closeCart()" 
                style="width:100%; margin-top:10px; background:black; color:white;
                       padding:10px; border:none; border-radius:8px;">
                Fermer
            </button>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", cartHTML);
}


// Fermer le panier
function closeCart() {
    document.body.lastElementChild.remove();
}


// Supprimer un produit
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    closeCart();
    showCart();
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}
