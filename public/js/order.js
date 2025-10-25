 document.addEventListener("DOMContentLoaded", function () {
            const cartItems = [];
            const cartList = document.getElementById("cartItems");
            const cartTotal = document.getElementById("cartTotal");
            const cartCount = document.getElementById("cartCount");

            function addToCart(name, price) {
                cartItems.push({ name, price });
                renderCart();
            }

            function renderCart() {
                cartList.innerHTML = "";
                let total = 0;

                cartItems.forEach(item => {
                    const li = document.createElement("li");
                    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
                    li.innerHTML = `${item.name} <span>₹${item.price}</span>`;
                    cartList.appendChild(li);
                    total += item.price;
                });

                cartTotal.textContent = "₹" + total;
                cartCount.textContent = cartItems.length;
            }
        });