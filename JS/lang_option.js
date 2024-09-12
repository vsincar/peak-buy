// Store the selected language
let selectedLanguage = localStorage.getItem("selectedLanguage") || "en";

// Function to set the language
function setLanguage(lang) {
  selectedLanguage = lang;
  localStorage.setItem("selectedLanguage", lang);
  updateLanguageDisplay();
  translatePage(lang);
  // Dispatch a custom event to notify other parts of the application
  document.dispatchEvent(new CustomEvent("languageChanged", { detail: lang }));
}

// Function to update the language display in both dropdowns
function updateLanguageDisplay() {
  const mainLangText = document.querySelector(".lang-text");
  const formLangText = document.querySelector(".form-lang-text");
  const languageNames = {
    ar: "عر",
    de: "DE",
    en: "EN",
    es: "ES",
    fr: "FR",
    ku: "KU",
    tr: "TR",
  };

  if (mainLangText) mainLangText.textContent = languageNames[selectedLanguage];
  if (formLangText) formLangText.textContent = languageNames[selectedLanguage];

  // Update active state in dropdowns
  document
    .querySelectorAll(".dropdown-item, .form-dropdown-item")
    .forEach((item) => {
      item.classList.remove("active");
      item.classList.remove("selected-language");
      if (
        item.id === selectedLanguage ||
        item.id === `form-${selectedLanguage}`
      ) {
        item.classList.add("active");
        item.classList.add("selected-language");
      }
    });
}

// Function to toggle the main language dropdown
function toggleMainLanguageDropdown(event) {
  event.preventDefault();
  const dropdown = document.querySelector(".dropdown-menu");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

// Function to toggle the form language dropdown
function toggleFormLanguageDropdown(event) {
  event.preventDefault();
  const dropdown = document.getElementById("formLanguageDropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

// Function to change language from either dropdown
function changeLanguage(lang) {
  setLanguage(lang);
  document.querySelector(".dropdown-menu").style.display = "none";
  document.getElementById("formLanguageDropdown").style.display = "none";
}

// Close the dropdowns when clicking outside
document.addEventListener("click", function (event) {
  const mainDropdown = document.querySelector(".dropdown-menu");
  const mainToggle = document.getElementById("languageDropdown");
  const formDropdown = document.getElementById("formLanguageDropdown");
  const formToggle = document.querySelector(".form-language-toggle");

  if (
    !mainToggle.contains(event.target) &&
    !mainDropdown.contains(event.target)
  ) {
    mainDropdown.style.display = "none";
  }

  if (
    !formToggle.contains(event.target) &&
    !formDropdown.contains(event.target)
  ) {
    formDropdown.style.display = "none";
  }
});

// Function to translate the page
function translatePage(lang) {
  fetch("languages.json")
    .then((response) => response.json())
    .then((data) => {
      const translations = data[lang];
      document
        .querySelectorAll("[data-translate], [data-translate-placeholder]")
        .forEach((element) => {
          const key =
            element.getAttribute("data-translate") ||
            element.getAttribute("data-translate-placeholder");
          if (translations[key]) {
            if (element.hasAttribute("data-translate")) {
              element.textContent = translations[key];
            } else if (element.hasAttribute("data-translate-placeholder")) {
              element.placeholder = translations[key];
            }
          }
        });

      // Translate cart-related elements
      const emptyCart = document.querySelector(".empty-cart");
      if (emptyCart)
        emptyCart.textContent =
          translations.empty_cart || "Your cart is empty.";

      const removeButtons = document.querySelectorAll(".remove-button");
      removeButtons.forEach((button) => {
        button.textContent = translations.remove || "Remove";
      });

      const orderButton = document.querySelector(".order-button");
      if (orderButton)
        orderButton.textContent = translations.order_now || "Order Now";

      const cartTotalItems = document.querySelector(".cart-total-items");
      if (cartTotalItems) {
        const totalItemsText = translations.totalItems || "Total items:";
        cartTotalItems.innerHTML = `${totalItemsText}<span class="total-items-value">1</span>`;
      }

      const cartTotalPrice = document.querySelector(".cart-total-price");
      if (cartTotalPrice) {
        const totalText = translations.total || "Total:";
        cartTotalPrice.innerHTML = `${totalText} <span class="total-price-value">$79.99</span>`;
      }

      // Translate cart item names
      const cartItemNames = document.querySelectorAll(".cart-item-name");
      cartItemNames.forEach((nameElement) => {
        const translationKey = nameElement.getAttribute("data-translate");
        if (translationKey && translations[translationKey]) {
          nameElement.textContent = translations[translationKey];
        }
      });
    })
    .catch((error) => console.error("Error loading translations:", error));
}

// Initialize the language display and translation on page load
document.addEventListener("DOMContentLoaded", function () {
  updateLanguageDisplay();
  translatePage(selectedLanguage);

  // Add click event listener to main dropdown toggle
  const mainToggle = document.getElementById("languageDropdown");
  mainToggle.addEventListener("click", toggleMainLanguageDropdown);

  // Update onclick for all dropdown items
  document
    .querySelectorAll(".dropdown-item, .form-dropdown-item")
    .forEach((item) => {
      item.onclick = function () {
        changeLanguage(this.id.replace("form-", ""));
      };
    });
});
