function calculateDeliveryDateRange(startOffset, endOffset) {
  const today = new Date();
  const startDate = new Date(today);
  const endDate = new Date(today);

  // Get values dynamically from the data attributes
  startDate.setDate(today.getDate() + startOffset);
  endDate.setDate(today.getDate() + endOffset);

  const options = { month: "short", day: "numeric" };
  const formattedStartDate = startDate.toLocaleDateString("en-US", options);
  const formattedEndDate = endDate.toLocaleDateString("en-US", options);

  return `${formattedStartDate} - ${formattedEndDate}`;
}

document.addEventListener("DOMContentLoaded", function () {
  const deliveryElement = document.getElementById("estimated-delivery");

  if (deliveryElement) {
    const startOffset =
      parseInt(deliveryElement.getAttribute("data-start")) || 2;
    const endOffset = parseInt(deliveryElement.getAttribute("data-end")) || 4;
    const deliveryDateRange = calculateDeliveryDateRange(
      startOffset,
      endOffset
    );

    const estimatedText =
      document.querySelector(".delivery-text").getAttribute("data-text") || "";

    // Create a span for estimatedText with a class
    const estimatedTextSpan = document.createElement("span");
    estimatedTextSpan.className = "estimated-text";
    estimatedTextSpan.textContent = estimatedText;

    // Create a span for deliveryDateRange with a class
    const deliveryDateSpan = document.createElement("span");
    deliveryDateSpan.className = "delivery-date-range";
    deliveryDateSpan.textContent = ` ${deliveryDateRange}`;

    // Clear content and append both spans
    deliveryElement.textContent = "";
    deliveryElement.appendChild(estimatedTextSpan);
    deliveryElement.appendChild(deliveryDateSpan);
  }
});

function openPopup() {
  document.getElementById("popupOverlay").style.display = "block";
  document.addEventListener("keydown", handleKeyPress);
  document.body.classList.add("popupOverlay-body");
}

function closePopup() {
  document.getElementById("popupOverlay").style.display = "none";
  document.removeEventListener("keydown", handleKeyPress);
  document.body.classList.remove("popupOverlay-body");
}

function handleKeyPress(e) {
  if (e.key === "Escape") {
    closePopup();
  }
}
// Close popup when clicking outside the content
window.onclick = function (event) {
  const overlay = document.getElementById("popupOverlay");
  if (event.target === overlay) {
    closePopup();
  }
};

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.open-popup').forEach((btn) => {
      btn.addEventListener("click", openPopup);
    });
});

//  Product page social-share
function CopyTolink(inputId) {
  var inputField = document.getElementById(inputId);
  var urlToCopy = inputField.getAttribute("data-url"); // Get the data-url attribute value

  navigator.clipboard
    .writeText(urlToCopy)
    .then(function () {
      inputField.value = "Link copied to clipboard!"; // Update input field text
      setTimeout(() => {
        inputField.value = urlToCopy; // Reset back to original URL after 2 seconds
      }, 2000);
    })
    .catch(function (err) {
      console.error("Failed to copy: ", err);
    });
}

// Pickupcontent
function pickupcontent() {
  const variantIdElement = document.querySelector(
    ".product-block.block-buy_button .product-variant-id"
  );
  if (!variantIdElement) {
    console.error("Variant ID element not found.");
    return;
  }
  const variantId = variantIdElement.value;

  const baseUrlElement = document.querySelector(
    ".product-single__store-availability-container"
  );
  const baseUrl = baseUrlElement.getAttribute("data-base-url");
  if (!baseUrl) {
    console.error("Base URL not found.");
    return;
  }

  const variantSectionUrl = `${baseUrl}/variants/${variantId}/?section_id=pickup-availability`;
  fetch(variantSectionUrl)
    .then((response) => response.text())
    .then((text) => {
      const container = document.querySelector(
        "[data-store-availability-container]"
      );
      if (!container) {
        console.error("Store availability container not found.");
        return;
      }
      const pickupAvailabilityHTML = new DOMParser()
        .parseFromString(text, "text/html")
        .querySelector(".shopify-section");
      if (!pickupAvailabilityHTML) {
        console.error("Pickup availability section not found in the response.");
        return;
      }
      container.innerHTML = "";
      container.appendChild(pickupAvailabilityHTML);

      const checkElement = document.querySelector(
        ".js-modal-open-pickup-availability-modal"
      );
      const popUpcontent = document.querySelector(
        ".pickup-availabilities-modal"
      );
      const closePopup = document.querySelector(
        ".pickup-availabilities-modal__close"
      );
      if (checkElement && popUpcontent && closePopup) {
        console.log("Both elements found. Adding event listener...");
        checkElement.addEventListener("click", function () {
          popUpcontent.classList.add("open");
        });
        closePopup.addEventListener("click", function () {
          popUpcontent.classList.remove("open");
        });
      } else {
        console.log("One or both elements not found!");
      }
    })
    .catch((e) => {
      console.error("Error fetching variant section:", e);
    });
}

// product option variant base change price,swatch color
document.addEventListener("DOMContentLoaded", function () {
  function getCombinedVariant() {
    const checkedColor =
        document.querySelector(".color-variant.checked") ||
        document.querySelector(".multiple-option-variant.checked"),
      productVariant = document.querySelector(".product-variant-id"),
      setPricedetails = document.querySelector(".price__sale"),
      setSkuContent = document.querySelector(".sku-content"),
      setStockCount = document.querySelector("#stock-count"),
      stockContent = document.querySelector(".stock-indicator"),
      atcBtnContent = document.querySelector(".atcbtn-content .atcbtn-text"),
      atcButton = document.querySelector(".product-form__submit.atc-btn"),
      stockBarContainer = document.querySelector(".stock-bar-container"),
      stockText = document.querySelector(".stock-indicator p"),
      stickyVariant = document.querySelector(
        ".sticky-details-wrapper .product-variant-id"
      ),
      stickyBtnContent = document.querySelector(
        ".sticky-details-wrapper .atcbtn-content .atcbtn-text"
      ),
      stickyButton = document.querySelector(
        ".sticky-details-wrapper .product-form__submit.atc-btn"
      ),
      stickyVariantchange = document.querySelector(
        ".sticky-details-wrapper .select-variant"
      ),
      checkoutBtn = document.querySelector(".checkoutbtn-text");

    let selectedVariants = [];

    document
      .querySelectorAll(".product-options-content fieldset")
      .forEach((fieldset) => {
        const checkedOption = fieldset.querySelector(".checked");
        if (checkedOption) {
          const variantName =
            checkedOption.getAttribute("data-variant-name") ||
            checkedOption.getAttribute("data-multiple-variant");

          if (variantName) {
            selectedVariants.push(variantName);
            const selectVariantElement = fieldset.querySelector(
              ".select-variant, .select-color-variant"
            );
            const selectDropdownElement = fieldset.querySelector(
              ".variant-options .select-variant, .variant-options .select-color-variant"
            );
            if (selectVariantElement) {
              selectVariantElement.textContent = variantName;
            }
            if(selectDropdownElement){
              selectDropdownElement.textContent = variantName;
            }
          }
        }
      });

    if (selectedVariants.length === 0) return;
    const combinedVariant = selectedVariants.join(" / ");
    const matchingOption = document.querySelector(
      `.combination_id option[data-variant-name="${combinedVariant}"]`
    );
    if (stickyVariantchange) {
      stickyVariantchange.textContent = combinedVariant;
    }
    if (matchingOption) {
      const variantId = matchingOption.value;
      productVariant.value = variantId;
      stickyVariant.value = variantId;
      pickupcontent();
      const variantStock =
        parseInt(matchingOption.getAttribute("data-variant-left")) || 0;
      matchingOption.setAttribute("selectedVariant", "true");
      if (atcBtnContent) {
        if (variantStock === 0) {
          atcBtnContent.textContent = "Sold Out";
          atcBtnContent.classList.remove("effect-text");
          atcButton.setAttribute("disabled", "disabled");
          stockText.style.display = "none";
          checkoutBtn.style.display = "none";
          stockBarContainer.style.display = "none";
          if (!document.querySelector(".out-of-stock-message")) {
            const outOfStockDiv = document.createElement("div");
            outOfStockDiv.className = "out-of-stock-message";
            outOfStockDiv.textContent = "Out of Stock";
            stockContent.appendChild(outOfStockDiv);
          }
        } else {
          atcBtnContent.textContent = "Add to Cart";
          atcBtnContent.classList.add("effect-text");
          atcButton.removeAttribute("disabled");
          stockText.style.display = "block";
          stockBarContainer.style.display = "block";
          checkoutBtn.style.display = "block";
          const outOfStockDiv = document.querySelector(".out-of-stock-message");
          if (outOfStockDiv) outOfStockDiv.remove();
        }
      }
      if (stickyBtnContent) {
        if (variantStock === 0) {
          stickyBtnContent.textContent = "Sold Out";
          stickyBtnContent.classList.remove("effect-text");
          stickyButton.setAttribute("disabled", "disabled");
        } else {
          stickyBtnContent.textContent = "Add to Cart";
          stickyBtnContent.classList.add("effect-text");
          stickyButton.removeAttribute("disabled");
        }
      }
      if (window.location.pathname.includes("/products/")) {
        const newUrl = `${
          window.location.origin + window.location.pathname
        }?variant=${variantId}`;
        history.pushState(null, "", newUrl);
      }
      setPricedetails && (setPricedetails.innerHTML = matchingOption.innerHTML);
      setSkuContent &&
        (setSkuContent.textContent =
          matchingOption.getAttribute("data-variant-sku") || "SKU: N/A");
      setStockCount &&
        (setStockCount.textContent = variantStock
          ? `${variantStock}`
          : "Out of Stock");

      // Update stock bar dynamically
      updateStockBar(variantStock);
    } else {
      console.error(`No match found for: "${combinedVariant}"`);
    }
    // Update sold message
    const soldMessage = document.getElementById("sold-message");

    if (soldMessage) {
      const minSold = parseInt(soldMessage.dataset.minSold, 10);
      const maxSold = parseInt(soldMessage.dataset.maxSold, 10);
      const hours = soldMessage.dataset.hours;

      // Generate a random number between minSold and maxSold
      const randomSold =
        Math.floor(Math.random() * (maxSold - minSold + 1)) + minSold;

      // Update the message
      soldMessage.innerHTML = `<span class="prosold-text">${randomSold} products sold</span><span class="lasthours-text"> in the last ${hours} hours.</span>`;
    }
  }

  function updateStockBar(currentStock) {
    const maxStock = 50; // Set your maximum stock manually or dynamically
    const stockCountElement = document.getElementById("stock-count");
    const stockBarElement = document.getElementById("stock-bar");

    if (stockCountElement) {
      stockCountElement.textContent = currentStock;
    }

    if (stockBarElement) {
      const stockPercentage = (currentStock / maxStock) * 100;
      stockBarElement.style.width = `${stockPercentage}%`;

      // Change bar color based on stock levels
      if (currentStock <= 10) {
        stockBarElement.style.backgroundColor = "#ff5f5f"; // Low stock (red)
      } else if (currentStock <= 20) {
        stockBarElement.style.backgroundColor = "#F44336"; // Medium stock (yellow)
      } else {
        stockBarElement.style.backgroundColor = "#4caf50"; // High stock (green)
      }
    }
  }

   const sideCart = document.querySelector(".side-cartdrawer");
        if (sideCart) {
          sideCart.addEventListener("click", function (event) {
            event.preventDefault();
            updateCartDrawer();
          });
        }
document.querySelectorAll(".mainproduct .product-form__submit.atc-btn").forEach((button) => {
  const handleAddToCart = function (event) {
    // Prevent default for both click and keydown
    event.preventDefault();

    // Only proceed if it's a click or Enter key
    if (event.type === "click" || (event.type === "keydown" && (event.key === "Enter" || event.keyCode === 13))) {
      console.log("hey clicked");
      let form = this.closest("form");
      let formData = new FormData(form);

      const quantityPicker = document.querySelector(
        ".mainproduct quantity-picker input[name='quantity']"
      );
      if (quantityPicker) {
        let quantity = quantityPicker.value;
        formData.set("quantity", quantity);
      }

      fetch("/cart/add.js", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Product Added:", data);
          updateCartDrawer();
        })
        .catch((error) =>
          console.error("Error adding product:", error)
        );
    }
  };

  button.addEventListener("click", handleAddToCart);
  button.addEventListener("keydown", handleAddToCart);
});



           // Function to open cart drawer
          function openCartDrawer() {
            const cartDrawer = document.getElementById("cart-drawer");
            document.documentElement.classList.add("js-drawer-open");
            cartDrawer.classList.add("open");

            attachCartDrawerOutsideClickListener();
          }

          function closeCartDrawer() {
            const cartDrawer = document.getElementById("cart-drawer");
            document.documentElement.classList.remove("js-drawer-open");
            cartDrawer.classList.remove("open");
          }


          function removeCartDrawer() {
            const cartDrawerIcon = document.querySelector(".cartdrawer-icon");
            if (cartDrawerIcon) {
                cartDrawerIcon.addEventListener("click", function () {
                    closeCartDrawer();
                });
            }
        }

          function attachCartDrawerOutsideClickListener() {
            document.addEventListener("click", function (event) {
              const cartDrawer = document.getElementById("cart-drawer");
              const isClickInside = cartDrawer.contains(event.target);
          
              // Close only if click is outside cart drawer
              if (!isClickInside && cartDrawer.classList.contains("open")) {
                document.documentElement.classList.remove("js-drawer-open");
                cartDrawer.classList.remove("open");
              }
            });
          }

          // Function to update the cart drawer dynamically
          function updateCartDrawer() {
            fetch("/?sections=cart-drawer")
              .then((response) => response.json())
              .then((data) => {
                let parser = new DOMParser();
                let doc = parser.parseFromString(
                  data["cart-drawer"],
                  "text/html"
                );

                // Update cart drawer content
                let updatedCartDrawer = doc.querySelector("#cart-drawer");
                let cartDrawer = document.querySelector("#cart-drawer");
                if (updatedCartDrawer && cartDrawer) {
                  cartDrawer.innerHTML = updatedCartDrawer.innerHTML;
                }

                // Update total price
                let updatedTotalPrice = doc.querySelector(".totals__total-value");
                if (updatedTotalPrice) {
                  document.querySelector(".totals__total-value").innerHTML =
                    updatedTotalPrice.innerHTML;
                }

                fetch("/cart.js")
                  .then((res) => res.json())
                  .then((cart) => {
                    let cartItemCount = cart.item_count; 
                    let headerCartCount =
                      document.querySelector("[data-cart-count]");
                    let drawerCartCount = document.querySelector(
                      "[data-cartdrawer-count]"
                    );

                    if (headerCartCount) {
                      headerCartCount.textContent = `${cartItemCount}`;
                    }
                    if (drawerCartCount) {
                      drawerCartCount.textContent = `(${cartItemCount})`;
                    }
                    if (cartItemCount > 0 && !document.getElementById("cart-drawer").classList.contains("open")) {
                      openCartDrawer();
                    }
                  })
                  .catch((error) =>
                    console.error("Error fetching cart count:", error)
                  );
                  
                attachRemoveItemEvents();
                attachQuantityUpdateEvents();
                addTocart();
                removeCartDrawer();
                // openCartDrawer(); 
              })
              .catch((error) => console.error("Error updating cart:", error));
          }


          function attachRemoveItemEvents() {
            document.querySelectorAll(".cart-remove-link").forEach((button) => {
              button.addEventListener("click", function (event) {
                event.preventDefault();
      
                let lineIndex = this.getAttribute("data-line");
                console.log("line", lineIndex);
                if (!lineIndex) {
                  console.error("Error: Line index not found!");
                  return;
                }
      
                // Remove item using AJAX
                fetch("/cart/change.js", {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    line: parseInt(lineIndex),
                    quantity: 0,
                  }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    console.log("Item removed:", data);
                    if (data.item_count === 0) {
                      document.querySelector(".cart-items").innerHTML = `
                        <div class="empty-cart">
                          <h1 class="h3">Hmm... looks like your bag is empty.</h1>
                          <a href="/collections/all" class="btn btn-secondary">
                            Continue shopping
                          </a>
                        </div>
                      `;
                    } else {
                      updateCartDrawer();
                    }
                  })
                  .catch((error) => console.error("Error removing item:", error));
              });
            });
          }
      
          function attachQuantityUpdateEvents() {
            document.querySelectorAll("#cart-drawer .qnt-input").forEach((button) => {
              button.addEventListener("click", function () {
                let quantityPicker = this.closest(".qnt-input-wrapper");
                if (!quantityPicker) {
                  console.error("Error: .quantity-picker not found!");
                  return;
                }
                let quantityInput = quantityPicker.querySelector(
                  "input[name='quantity']"
                );
                if (!quantityInput) {
                  console.error("Error: Quantity input not found!");
                  return;
                }
      
                let quantity = parseInt(quantityInput.value);
                let maxQuantity =
                  parseInt(quantityInput.getAttribute("data-max")) || Infinity;
                let lineIndex = parseInt(
                  quantityInput.closest("tr")?.getAttribute("data-index")
                );
      
                if (isNaN(lineIndex)) {
                  console.error("Error: Line index not found!");
                  return;
                }
      
                if (
                  this.classList.contains("qnt-inc") &&
                  quantity < maxQuantity
                ) {
                  quantity++;
                } else if (this.classList.contains("qnt-dec") && quantity > 1) {
                  quantity--;
                }
      
                updateCartItem(lineIndex, quantity);
              });
            });
          }
        
      
        function addTocart(){
            document.querySelectorAll(".productadd-drawer").forEach((button) => {
            button.addEventListener("click", function (event) {
              event.preventDefault();
      
              console.log("hey clicked");
              let form = this.closest("form");
              let formData = new FormData(form);
      
              const quantityPicker = document.querySelector(
                "input[name='quantity'].cart-drawer-col"
              );
              if (quantityPicker) {
                let quantity = quantityPicker.value;
                formData.set("quantity", quantity);
              }
      
              fetch("/cart/add.js", {
                method: "POST",
                body: formData,
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log("Product Added:", data);
                  updateCartDrawer();
                })
                .catch((error) =>
                  console.error("Error adding product:", error)
                );
            });
          });
          }

           // Function to update cart item quantity
        function updateCartItem(lineIndex, quantity) {
          fetch("/cart/change.js", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ line: lineIndex, quantity: quantity }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Cart Updated:", data);
              updateCartDrawer();
            })
            .catch((error) => console.error("Error updating cart:", error));
        }

  

  getCombinedVariant();

document.querySelectorAll(".color-variant, .multiple-option-variant")
  .forEach((element) => {
    const prodvariantHandle = (el) => {
      const parentFieldset = el.closest("fieldset");
      if (parentFieldset) {
        parentFieldset
          .querySelectorAll(".checked")
          .forEach((el) => el.classList.remove("checked"));
      }
      el.classList.add("checked");
      getCombinedVariant();
    };

    element.addEventListener("click", () => {
      prodvariantHandle(element);
    });

    element.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        prodvariantHandle(element);
      }
    });

  });
  
});
// 04/03/25 sticky-cart js
document.addEventListener("DOMContentLoaded", function () {
  const target = document.querySelector(".product-block.block-buy_button"),
    stickyCart = document.querySelector(".sticky-content"),
    stickyContent = document.querySelector("sticky-cart"),
    footerPrivacy = document.querySelector(".privacy-policy-text");
  if (target && stickyCart && footerPrivacy) {
    const observer = new IntersectionObserver(
      (entries) => {
        let isStickyHidden = !1;
        entries.forEach((entry) => {
          (entry.target === target || entry.target === footerPrivacy) &&
            entry.isIntersecting &&
            (isStickyHidden = !0);
        }),
          isStickyHidden? stickyCart.classList.remove("active"): stickyCart.classList.add("active");
          isStickyHidden? stickyContent.setAttribute('aria-hidden', 'false'): stickyContent.setAttribute('aria-hidden', 'true');
      },
      { threshold: 0.1 }
    );
    observer.observe(target), observer.observe(footerPrivacy);
  }
});

// add class when open pwsp popup

const pswpElement = document.querySelector(".pswp");

if (pswpElement) {
  const observer = new MutationObserver(() => {
    if (pswpElement.classList.contains("pswp--open")) {
      document.body.classList.add("pswp-popup-body");
    } else {
      document.body.classList.remove("pswp-popup-body");
    }
  });

  observer.observe(pswpElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const dropdowns = document.querySelectorAll(".dropdown-variant");

  dropdowns.forEach((dropdown) => {
    const selectedOption = dropdown.querySelector(".dropdownList");
    const optionsList = dropdown;
    const options = dropdown.querySelectorAll(".dropdown-swatch");

    if (!selectedOption || !optionsList) {
      console.error("Dropdown structure is incomplete!");
      return;
    }

    // Toggle dropdown on click
    selectedOption.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent event bubbling to document
      optionsList.classList.toggle("open");
    });

    // Handle option selection
    options.forEach((option) => {
      option.addEventListener("click", () => {
        optionsList.classList.remove("open");
      });
    });
  });

  // Close any open dropdown when clicking outside
  document.addEventListener("click", (event) => {
    dropdowns.forEach((dropdown) => {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove("open");
      }
    });
  });
});    
document.querySelectorAll(".product-block")
  .forEach((element) => {
    element.setAttribute("tabindex", "0");
});