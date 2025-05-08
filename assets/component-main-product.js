// Utility Function: Adds event listeners to elements
function addEventListenerToElements(selector, event, handler) {
  document.querySelectorAll(selector).forEach((element) => {
    element.addEventListener(event, handler);
  });
}

// Function: Handles variant selection on base change
function handleVariantSelection() {
  const selectedVariants = [];
  
  // Loop through each fieldset for product options
  document.querySelectorAll(".product-options-content fieldset").forEach((fieldset) => {
    const selectedOption = fieldset.querySelector(".checked") || fieldset.querySelector("select, input:checked");

    if (selectedOption) {
      const variantName =
        selectedOption.getAttribute("data-variant-name") ||
        selectedOption.getAttribute("data-multiple-variant") ||
        selectedOption.value; // For dropdown or radio inputs

      if (variantName) {
        selectedVariants.push(variantName);

        // Update the visible variant display (e.g., dropdown text or color swatch)
        const selectVariantElement = fieldset.querySelector(".select-variant, .select-color-variant");
        const selectDropdownElement = fieldset.querySelector(".variant-options .select-variant, .variant-options .select-color-variant");

        if (selectVariantElement) {
          selectVariantElement.textContent = variantName;
        }

        if (selectDropdownElement) {
          selectDropdownElement.textContent = variantName;
        }
      }
    }
  });

  if (selectedVariants.length === 0) return;

  // Combine selected variants into a single string
  const combinedVariant = selectedVariants.join(" / ");
  
  // Match the combined variant with the corresponding option
  const matchingOption = document.querySelector(
    `.combination_id option[data-variant-name="${combinedVariant}"]`
  );

  if (matchingOption) {
    updateVariantDetails(matchingOption);
  } else {
    console.error(`No match found for: "${combinedVariant}"`);
  }
}

// Function: Updates variant details (price, stock, URL, etc.)
function updateVariantDetails(option) {
  const variantId = option.value;
  document.querySelectorAll(".product-variant-id").forEach((input) => {
    input.value = variantId;
  });

  const variantStock = parseInt(option.getAttribute("data-variant-left")) || 0;

  // Update displayed details (price, stock, etc.)
  const setPricedetails = document.querySelector(".price__sale");
  const setSkuContent = document.querySelector(".sku-content");
  const setStockCount = document.querySelector("#stock-count");

  if (setPricedetails) setPricedetails.innerHTML = option.innerHTML;
  if (setSkuContent) setSkuContent.textContent = option.getAttribute("data-variant-sku") || "SKU: N/A";
  if (setStockCount) setStockCount.textContent = variantStock ? `${variantStock}` : "Out of Stock";

  // Update stock bar dynamically
  updateStockBar(variantStock);

  // Update URL with selected variant
  if (window.location.pathname.includes("/products/")) {
    const newUrl = `${window.location.origin + window.location.pathname}?variant=${variantId}`;
    history.pushState(null, "", newUrl);
  }

  // Pickup content update
  pickupContent(variantId);

  // Update cart button states
  updateCartButtonStates(variantStock);
}

// Function: Attaches variant change listeners (base change)
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".color-variant, .multiple-option-variant")
    .forEach((element) => {
      element.addEventListener("change", handleVariantSelection);
    });

  document.querySelectorAll("select.variant-base-selector, input[type='radio'].variant-base-selector")
    .forEach((element) => {
      element.addEventListener("change", handleVariantSelection);
    });
});


// Utility Function: Fetches and parses HTML content
async function fetchHTML(url) {
  try {
    const response = await fetch(url);
    const text = await response.text();
    return new DOMParser().parseFromString(text, "text/html");
  } catch (error) {
    console.error(`Error fetching HTML from ${url}:`, error);
    return null;
  }
}

// Utility Function: Updates innerHTML of an element
function updateInnerHTML(selector, content) {
  const element = document.querySelector(selector);
  if (element) element.innerHTML = content;
}

// Function: Handles variant selection
function handleVariantSelection() {
  const selectedVariants = [];
  document.querySelectorAll(".product-options-content fieldset").forEach((fieldset) => {
    const checkedOption = fieldset.querySelector(".checked");
    if (checkedOption) {
      const variantName =
        checkedOption.getAttribute("data-variant-name") ||
        checkedOption.getAttribute("data-multiple-variant");
      if (variantName) selectedVariants.push(variantName);
    }
  });

  if (selectedVariants.length === 0) return;

  const combinedVariant = selectedVariants.join(" / ");
  const matchingOption = document.querySelector(
    `.combination_id option[data-variant-name="${combinedVariant}"]`
  );

  if (!matchingOption) {
    console.error(`No match found for: "${combinedVariant}"`);
    return;
  }

  updateVariantDetails(matchingOption);
}

// Function: Updates variant details (price, stock, URL, etc.)
function updateVariantDetails(option) {
  const variantId = option.value;
  document.querySelectorAll(".product-variant-id").forEach((input) => {
    input.value = variantId;
  });

  const variantStock = parseInt(option.getAttribute("data-variant-left")) || 0;

  updateInnerHTML(".price__sale", option.innerHTML);
  updateInnerHTML(".sku-content", option.getAttribute("data-variant-sku") || "SKU: N/A");
  updateInnerHTML("#stock-count", variantStock ? `${variantStock}` : "Out of Stock");

  // Update stock bar and state
  updateStockBar(variantStock);

  // Update URL
  if (window.location.pathname.includes("/products/")) {
    const newUrl = `${window.location.origin + window.location.pathname}?variant=${variantId}`;
    history.pushState(null, "", newUrl);
  }

  // Pickup content update
  pickupContent(variantId);

  // Update cart button states
  updateCartButtonStates(variantStock);
}

// Function: Updates stock bar dynamically
function updateStockBar(currentStock) {
  const maxStock = 50; // Static max stock
  const stockBar = document.getElementById("stock-bar");
  if (!stockBar) return;

  const stockPercentage = (currentStock / maxStock) * 100;
  stockBar.style.width = `${stockPercentage}%`;
  stockBar.style.backgroundColor =
    currentStock <= 10
      ? "#ff5f5f"
      : currentStock <= 20
      ? "#F44336"
      : "#4caf50"; // Red, Yellow, Green
}

// Function: Updates cart button states
function updateCartButtonStates(stock) {
  const atcButtons = document.querySelectorAll(".atc-btn");
  const isOutOfStock = stock === 0;

  atcButtons.forEach((button) => {
    const textElement = button.querySelector(".atcbtn-text");
    if (!textElement) return;

    if (isOutOfStock) {
      textElement.textContent = "Sold Out";
      button.setAttribute("disabled", "disabled");
    } else {
      textElement.textContent = "Add to Cart";
      button.removeAttribute("disabled");
    }
  });
}

// Function: Handles pickup content update
async function pickupContent(variantId) {
  const baseUrlElement = document.querySelector(".product-single__store-availability-container");
  const baseUrl = baseUrlElement?.getAttribute("data-base-url");
  if (!baseUrl) {
    console.error("Base URL not found.");
    return;
  }

  const variantSectionUrl = `${baseUrl}/variants/${variantId}/?section_id=pickup-availability`;
  const html = await fetchHTML(variantSectionUrl);

  const container = document.querySelector("[data-store-availability-container]");
  const pickupAvailabilityHTML = html?.querySelector(".shopify-section");

  if (container && pickupAvailabilityHTML) {
    container.innerHTML = "";
    container.appendChild(pickupAvailabilityHTML);
  } else {
    console.error("Error updating pickup content.");
  }
}

// Function: Updates cart drawer dynamically
async function updateCartDrawer() {
  try {
    const response = await fetch("/?sections=cart-drawer");
    const data = await response.json();
    const html = new DOMParser().parseFromString(data["cart-drawer"], "text/html");

    const cartDrawer = document.querySelector("#cart-drawer");
    const updatedCartDrawer = html.querySelector("#cart-drawer");

    if (cartDrawer && updatedCartDrawer) {
      cartDrawer.innerHTML = updatedCartDrawer.innerHTML;
    }

    const totalPrice = html.querySelector(".totals__total-value");
    if (totalPrice) {
      updateInnerHTML(".totals__total-value", totalPrice.innerHTML);
    }

    updateCartCount();
    attachRemoveItemEvents();
    attachQuantityUpdateEvents();
  } catch (error) {
    console.error("Error updating cart drawer:", error);
  }
}

// Function: Updates cart count in header and drawer
async function updateCartCount() {
  try {
    const response = await fetch("/cart.js");
    const cart = await response.json();

    const cartItemCount = cart.item_count;
    updateInnerHTML("[data-cart-count]", cartItemCount);
    updateInnerHTML("[data-cartdrawer-count]", `(${cartItemCount})`);
  } catch (error) {
    console.error("Error fetching cart count:", error);
  }
}

// Function: Attaches remove item events in the cart drawer
function attachRemoveItemEvents() {
  addEventListenerToElements(".cart-remove-link", "click", async function (event) {
    event.preventDefault();
    const lineIndex = this.getAttribute("data-line");
    if (!lineIndex) return;

    try {
      await fetch("/cart/change.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ line: parseInt(lineIndex), quantity: 0 }),
      });
      updateCartDrawer();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  });
}

// Function: Attaches quantity update events in the cart drawer
function attachQuantityUpdateEvents() {
  addEventListenerToElements("#cart-drawer .qnt-input", "click", function () {
    const quantityPicker = this.closest(".qnt-input-wrapper");
    if (!quantityPicker) return;

    const input = quantityPicker.querySelector("input[name='quantity']");
    const lineIndex = parseInt(input.closest("tr")?.getAttribute("data-index"));
    let quantity = parseInt(input.value);

    if (this.classList.contains("qnt-inc")) quantity++;
    if (this.classList.contains("qnt-dec") && quantity > 1) quantity--;

    updateCartItem(lineIndex, quantity);
  });
}

// Function: Updates cart item quantity
async function updateCartItem(lineIndex, quantity) {
  try {
    await fetch("/cart/change.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ line: lineIndex, quantity }),
    });
    updateCartDrawer();
  } catch (error) {
    console.error("Error updating cart item:", error);
  }
}

// Initialize Variant Selection
document.addEventListener("DOMContentLoaded", () => {
  handleVariantSelection();

  addEventListenerToElements(".color-variant, .multiple-option-variant", "change", handleVariantSelection);
});