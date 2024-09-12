document.addEventListener("DOMContentLoaded", function () {
  let cart = [];
  let translations = {};

  const cartNotification = document.querySelector(".cart-notification");
  const addToCartButtons = document.querySelectorAll(
    ".add-to-cart, .hot-add-card-btn"
  );
  const cartIcon = document.querySelector(".nav-item a[href='']");
  const cartDropdown = document.querySelector(".cart-dropdown");

  function initializeCart() {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCart();
  }

  function getCurrentLanguage() {
    return localStorage.getItem("selectedLanguage") || "en";
  }

  function updateLanguage() {
    const lang = getCurrentLanguage();
    fetch("languages.json")
      .then((response) => response.json())
      .then((data) => {
        translations = data[lang];
        updateCartDropdown();
        updateProductTranslations();
      })
      .catch((error) => console.error("Error loading translations:", error));
  }

  function updateProductTranslations() {
    cart.forEach((item) => {
      item.translatedName = translations[item.id] || item.name;
    });
    updateCartDropdown();
  }

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productCard = this.closest(".product-card, .card");
      const isHotDeal = productCard.classList.contains("card");
      const product = {
        id: isHotDeal
          ? productCard.id
          : productCard
              .querySelector(".product-name")
              .getAttribute("data-translate"),
        name: productCard.querySelector(".product-name, .hot-product-name")
          .textContent,
        price: parseFloat(
          productCard
            .querySelector(".product-price, .hot-product-price")
            .textContent.replace("$", "")
        ),
        image: productCard.querySelector(".product-image, img").src,
        quantity: 1,
      };

      if (isHotDeal) {
        product.originalPrice = parseFloat(
          productCard
            .querySelector(".hot-previous-price")
            .textContent.replace("$", "")
        );
      }

      const existingProductIndex = cart.findIndex(
        (item) => item.id === product.id
      );
      if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity++;
      } else {
        product.translatedName = translations[product.id] || product.name;
        cart.push(product);
      }
      updateCart();
    });
  });

  cartIcon.addEventListener("click", function (e) {
    e.preventDefault();
    cartDropdown.style.display =
      cartDropdown.style.display === "none" ? "block" : "none";
  });

  function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartNotification();
    updateCartDropdown();
  }

  function updateCartNotification() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartNotification.style.display = totalItems > 0 ? "flex" : "none";
    cartNotification.textContent = totalItems;
  }

  function updateCartDropdown() {
    cartDropdown.innerHTML = "";
    const lang = getCurrentLanguage();

    let cartHTML = "";

    if (cart.length === 0) {
      cartHTML += `
        <div class="empty-cart">
          <button class="close-button">${
            translations.close || "&times;"
          }</button>
          <div class="empty-cart-message">${
            translations.emptyCart || "Your cart is empty."
          }</div>
        </div>`;
    } else {
      cartHTML += `<button class="close-button">${
        translations.close || "&times;"
      }</button>`;
      cartHTML += `
        <div class="cart-items-container">
          ${cart
            .map(
              (item) => `
            <div class="cart-item">
              <img src="${item.image}" alt="${
                item.translatedName
              }" class="cart-item-image">
              <span class="cart-item-name" data-translate="${item.id}">${
                item.translatedName
              }</span>
              <input type="number" value="${
                item.quantity
              }" min="1" class="cart-item-quantity">
              <div class="price-container">
                ${
                  item.originalPrice
                    ? `<span class="cart-item-previous-price">$${(
                        item.originalPrice * item.quantity
                      ).toFixed(2)}</span>`
                    : ""
                }
                <span class="cart-item-price">$${(
                  item.price * item.quantity
                ).toFixed(2)}</span>
              </div>
              <button class="remove-button">${
                translations.remove || "Remove"
              }</button>
            </div>
          `
            )
            .join("")}
        </div>
        <div class="cart-total-items">${
          translations.totalItems || "Total items:"
        } <span class="total-items-value">${cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      )}</span></div>
        <div class="cart-total-price">${
          translations.total || "Total:"
        } <span class="total-price-value">$${cart
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2)}</span></div>
        <button class="order-button">${
          translations.orderNow || "Order Now"
        }</button>
      `;
    }
    cartDropdown.innerHTML = cartHTML;

    cartDropdown
      .querySelector(".close-button")
      .addEventListener("click", () => {
        cartDropdown.style.display = "none";
      });

    cartDropdown
      .querySelectorAll(".cart-item-quantity")
      .forEach((input, index) => {
        input.addEventListener("change", (e) => {
          cart[index].quantity = parseInt(e.target.value);
          updateCart();
        });
      });

    cartDropdown.querySelectorAll(".remove-button").forEach((button, index) => {
      button.addEventListener("click", () => {
        cart.splice(index, 1);
        updateCart();
      });
    });

    if (cart.length > 0) {
      cartDropdown
        .querySelector(".order-button")
        .addEventListener("click", () => {
          console.log("Order placed!");
        });
    }
  }

  initializeCart();
  updateLanguage();

  document.addEventListener("languageChanged", updateLanguage);

  window.addEventListener("load", updateLanguage);
  window.addEventListener("storage", function (e) {
    if (e.key === "selectedLanguage") {
      updateLanguage();
    }
  });
});
