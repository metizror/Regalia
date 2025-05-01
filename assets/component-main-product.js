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
            if (selectVariantElement) {
              selectVariantElement.textContent = variantName;
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

  getCombinedVariant();

  document
    .querySelectorAll(".color-variant, .multiple-option-variant")
    .forEach((element) => {
      element.addEventListener("click", function () {
        const parentFieldset = this.closest("fieldset");
        if (parentFieldset) {
          parentFieldset
            .querySelectorAll(".checked")
            .forEach((el) => el.classList.remove("checked"));
        }
        this.classList.add("checked");
        getCombinedVariant();
      });
    });
});
// 04/03/25 sticky-cart js
document.addEventListener("DOMContentLoaded", function () {
  const target = document.querySelector(".product-block.block-buy_button"),
    stickyCart = document.querySelector(".sticky-content"),
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
          isStickyHidden
            ? stickyCart.classList.remove("active")
            : stickyCart.classList.add("active");
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
