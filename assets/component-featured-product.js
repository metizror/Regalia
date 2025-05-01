// Product sold message
document.addEventListener("DOMContentLoaded", function () {
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
});

theme.featuredProduct = () => {
  const featureproEle = document.querySelector(".featureProduct");
  if (!featureproEle) return;
  const swiperOptions = JSON.parse(featureproEle.dataset.sliderData);
  const swiper = new Swiper(featureproEle, swiperOptions);

  //Pause/stop the slider when new block/announcement added
  if (Shopify.designMode) {
    document.addEventListener("shopify:block:select", (e) => {
      let targetEle = e.target,
        sliderIndex = 1 + parseInt(targetEle.dataset.swiperSlideIndex);
      swiper.slideTo(sliderIndex);
      swiper.autoplay.paused();
    });
    const customizationEvents = [
      "shopify:inspector:activate",
      "shopify:inspector:deactivate",
      "shopify:section:load",
      "shopify:block:deselect",
      "shopify:section:reorder",
      "shopify:section:select",
      "shopify:section:deselect",
      "shopify:inspector:activate",
      "shopify:inspector:deactivate",
    ];

    customizationEvents.forEach((event) => {
      document.addEventListener(event, () => swiper.init(swiperOptions));
    });
  }
};

window.addEventListener("DOMContentLoaded", () => {
  theme.featuredProduct();
});

document.addEventListener("DOMContentLoaded", function () {
  function getCombinedVariant() {
    const checkedColor = document.querySelector(
        ".featured-product .color-variant.checked"
      ),
      productVariant = document.querySelector(
        ".featured-product .product-variant-id"
      ),
      setPricedetails = document.querySelector(
        ".featured-product .price__sale"
      ),
      setSkuContent = document.querySelector(".featured-product .sku-content"),
      setStockCount = document.querySelector(".featured-product #stock-count"),
      stockContent = document.querySelector(
        ".featured-product .stock-indicator"
      ),
      atcBtnContent = document.querySelector(
        ".featured-product .atcbtn-content .atcbtn-text"
      ),
      atcButton = document.querySelector(
        ".featured-product .product-form__submit.atc-btn"
      ),
      stockBarContainer = document.querySelector(
        ".featured-product .stock-bar-container"
      ),
      stockText = document.querySelector(
        ".featured-product .stock-indicator p"
      ),
      checkoutBtn = document.querySelector(
        ".featured-product .checkoutbtn-text"
      );

    const selectedVariants = [];

    if (!checkedColor) return;
    const variantActive = checkedColor.getAttribute("data-variant-name");

    document
      .querySelectorAll(".featured-product .color-variant label")
      .forEach((label) => {
        label.style.backgroundColor = "";
      });
    const label = checkedColor.querySelector("label");
    label && (label.style.backgroundColor = variantActive);

    // Find all selected variant options dynamically
    document
      .querySelectorAll(".featured-product .product-options-content fieldset")
      .forEach((fieldset) => {
        const checkedOption = fieldset.querySelector(".checked");

        if (checkedOption) {
          const variantName =
            checkedOption.getAttribute("data-variant-name") ||
            checkedOption.getAttribute("data-multiple-variant");

          if (variantName) {
            selectedVariants.push(variantName);

            // Update UI text
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

    // Combine variants dynamically in the same order as Shopify
    const combinedVariant = selectedVariants.join(" / ");

    // Find the matching variant in the select dropdown
    const matchingOption = document.querySelector(
      `.featured-product .combination_id option[data-variant-name="${combinedVariant}"]`
    );
    if (matchingOption) {
      const variantId = matchingOption.value;
      productVariant.value = variantId;
      const variantStock =
        parseInt(matchingOption.getAttribute("data-variant-left")) || 0;
      matchingOption.setAttribute("selectedVariant", "true");
      // Update ATC button based on stock count
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

      // Update URL only on the product page
      if (window.location.pathname.includes("/products/")) {
        const newUrl = `${
          window.location.origin + window.location.pathname
        }?variant=${variantId}`;
        history.pushState(null, "", newUrl);
      }

      // Update price details
      setPricedetails && (setPricedetails.innerHTML = matchingOption.innerHTML);
      setSkuContent &&
        (setSkuContent.textContent =
          matchingOption.getAttribute("data-variant-sku") || "SKU: N/A");
      setStockCount &&
        (setStockCount.textContent = variantStock
          ? `${variantStock}`
          : "Out of Stock");
      updateStockBar(variantStock);
    } else {
      console.error(`No match found for: "${combinedVariant}"`);
    }

    // Apply .soldout class to unavailable options
    document
      .querySelectorAll(".featured-product .product-options-content fieldset")
      .forEach((fieldset) => {
        fieldset
          .querySelectorAll(".featured-product .variant-option")
          .forEach((option) => {
            const optionVariant =
              option.getAttribute("data-variant-name") ||
              option.getAttribute("data-multiple-variant");

            if (optionVariant) {
              // let variantKey = "";
              console.log(selectedVariants.length);
              if (selectedVariants.length === 2) {
                variantKey = `${selectedVariants[0]} / ${optionVariant}`;
              } else if (selectedVariants.length === 3) {
                variantKey = [
                  selectedVariants[0],
                  selectedVariants[1],
                  selectedVariants[2],
                ]
                  .filter(Boolean)
                  .join(" / ");
              }
              const stockOption = document.querySelector(
                `.featured-product .combination_id option[data-variant-name="${variantKey}"]`
              );
              if (
                stockOption &&
                parseInt(stockOption.getAttribute("data-variant-left")) === 0
              ) {
                option.classList.add("soldout");
              } else {
                option.classList.remove("soldout");
              }
            }
          });
      });
  }

  function updateStockBar(currentStock) {
    const maxStock = 50;
    const stockBarElement = document.querySelector(
      ".featured-product #stock-bar"
    );

    if (stockBarElement) {
      const stockPercentage = (currentStock / maxStock) * 100;
      stockBarElement.style.width = `${stockPercentage}%`;

      stockBarElement.style.backgroundColor =
        currentStock <= 10
          ? "#ff5f5f"
          : currentStock <= 20
          ? "#F44336"
          : "#4caf50";
    }
  }

  // Initialize
  getCombinedVariant();

  // Event listener for all variant selections
  document
    .querySelectorAll(
      ".featured-product .color-variant,.featured-product .multiple-option-variant"
    )
    .forEach((element) => {
      element.addEventListener("click", function () {
        const parentFieldset = this.closest("fieldset");
        if (parentFieldset) {
          parentFieldset
            .querySelectorAll(".product-options-content .checked")
            .forEach((el) => el.classList.remove("checked"));
        }
        this.classList.add("checked");
        getCombinedVariant();
      });
    });
});

if (!customElements.get("quantity-picker")) {
  class quantityPicker extends HTMLElement {
    constructor() {
      super();
      this.incBtn = this.querySelector(".featured-product .qnt-inc");
      this.decBtn = this.querySelector(".featured-product .qnt-dec");
      this.inputField = this.querySelector(
        '.featured-product input[type="number"]'
      );
      if (this.incBtn && this.decBtn && this.inputField) {
        this.onIncrease();
        this.onDecrease();
        this.handleNegativeInput();
      }
    }

    onIncrease = () => {
      this.incBtn?.addEventListener("click", () => {
        this.inputField.value = parseInt(this.inputField.value) + 1;
        this.inputField.dispatchEvent(new Event("change"));
      });
    };

    onDecrease = () => {
      this.decBtn?.addEventListener("click", () => {
        if (parseInt(this.inputField.value) > 1) {
          this.inputField.value = parseInt(this.inputField.value) - 1;
        }
        this.inputField.dispatchEvent(new Event("change"));
      });
    };

    handleNegativeInput = () => {
      this.inputField?.addEventListener("change", () => {
        let parsedValue = parseFloat(this.inputField.value);
        if (isNaN(parsedValue) || parsedValue < 1) {
          this.inputField.value = 1;
        } else {
          this.inputField.value = Math.ceil(parsedValue);
        }
      });
    };
  }

  customElements.define("quantity-picker", quantityPicker);
}
