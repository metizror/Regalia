if (!customElements.get("quick-view")) {
  class quickView extends HTMLElement {
    constructor() {
      super();

      this.quickviewBtns = this.querySelectorAll("button");
      this.productJson = this.querySelector("script")
        ? JSON.parse(this.querySelector("script").textContent)
        : null;

      const closestContainer = this.closest(".quick-view__closest");
      this.quickViewEle = closestContainer
        ? closestContainer.querySelector("#quickViewModal")
        : null;

      if (
        this.quickviewBtns.length > 0 &&
        this.productJson &&
        this.quickViewEle
      ) {
        this.onClick();
        this.onClose();
      }
    }

    onClick = () => {
      this.quickviewBtns.forEach((quickBtn) => {
        quickBtn.addEventListener("click", () => {
          this.initQuickView();
        });
      });
    };

    onClose = () => {
      const closestContainer = this.closest(".quick-view__closest");
      if (!closestContainer) return;

      let quickviewClose = closestContainer.querySelector(".quick-view-close");
      let overlayclose = closestContainer.querySelector(".overlay-background");

      if (quickviewClose) {
        quickviewClose.addEventListener("click", () => {
          this.closeQuickView();
        });
        
        quickviewClose.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.closeQuickView();
          }
       });
        
      }
      if (overlayclose) {
        overlayclose.addEventListener("click", () => {
          this.closeQuickView();
        });
      }
    };

    initQuickView = () => {
      if (!this.productJson || !this.quickViewEle) return;
      this.quickViewEle.classList.add("active");
      console.log(this.quickViewEle);
      this.url = `/products/${this.productJson.handle}/?section_id=quick-view`;
      fetch(this.url)
        .then((res) => res.text())
        .then((body) => {
          const closestContainer = this.closest(".quick-view__closest");
          if (!closestContainer) return;

          let quickView = closestContainer.querySelector("#quickView");
          if (quickView) {
            this.quickViewEle.innerHTML = body;
            quickView.classList.add("active");
            document.body.classList.add("quick-view-popup");

            setTimeout(() => {
              this.initSwiper();
              this.initVariantSelection();
            }, 100);
          }
        });
    };

    closeQuickView = () => {
      const closestContainer = this.closest(".quick-view__closest");
      if (!closestContainer) return;

      let quickView = closestContainer.querySelector("#quickView");
      if (quickView) {
        quickView.classList.remove("active");
      }
      document.body.classList.remove("quick-view-popup");

      if (this.quickViewEle) {
        this.quickViewEle.classList.remove("active");
      }
    };

    initSwiper = () => {
      const thumbsContainer = document.querySelector(".gallery-thumbs");
      const mainContainer = document.querySelector(".gallery-main");

      if (!thumbsContainer || !mainContainer) return;

      const thumbsSwiper = new Swiper(thumbsContainer, {
        spaceBetween: 26,
        direction: "vertical",
        slidesPerView: 2.3,
        watchSlidesProgress: true,
      });

      new Swiper(mainContainer, {
        spaceBetween: 0,
        navigation: {
          nextEl: ".swiper--next",
          prevEl: ".swiper--prev",
        },
        thumbs: {
          swiper: thumbsSwiper,
        },
      });
    };

    initVariantSelection = () => {
      this.getCombinedVariant();
      document
        .querySelectorAll(
          "#quickViewModal .color-variant, #quickViewModal .multiple-option-variant"
        )
        .forEach((element) => {
          element.addEventListener("click", () => {
            const parentFieldset = element.closest("fieldset");
            if (parentFieldset) {
              parentFieldset
                .querySelectorAll(".checked")
                .forEach((el) => el.classList.remove("checked"));
            }
            element.classList.add("checked");
            this.getCombinedVariant();
          });
        });
    };

    getCombinedVariant = () => {
      const checkedColor =
          document.querySelector("#quickViewModal .color-variant.checked") ||
          document.querySelector(
            "#quickViewModal .multiple-option-variant.checked"
          ),
        productVariant = document.querySelector(
          "#quickViewModal .product-variant-id"
        ),
        atcBtnContent = document.querySelector(
          "#quickViewModal .atcbtn-content .atcbtn-text"
        ),
        atcButton = document.querySelector(
          "#quickViewModal .product-form__submit.atc-btn"
        ),
        setPricedetails = document.querySelector(
          "#quickViewModal .price__sale"
        ),
        setSkuContent = document.querySelector("#quickViewModal .sku-content"),
        stockText = document.querySelector(
          "#quickViewModal .stock-indicator p"
        ),
        stockCount = document.querySelector("#quickViewModal #stock-count"),
        stockContent = document.querySelector(
          "#quickViewModal .stock-indicator"
        ),
        stockBarContainer = document.querySelector(
          "#quickViewModal .stock-bar-container"
        ),
        checkoutBtn = document.querySelector(
          "#quickViewModal .checkoutbtn-text"
        );

      let quickselectedVariants = [];

      if (!checkedColor) return;
      const variantActive = checkedColor.getAttribute("data-variant-name");

      document
        .querySelectorAll("#quickViewModal .color-variant label")
        .forEach((label) => {
          label.style.backgroundColor = "";
        });
      const label = checkedColor.querySelector("label");
      label && (label.style.backgroundColor = variantActive);

      document
        .querySelectorAll("#quickViewModal .product-options-content fieldset")
        .forEach((fieldset) => {
          const checkedOption = fieldset.querySelector(".checked");

          if (checkedOption) {
            const variantName =
              checkedOption.getAttribute("data-variant-name") ||
              checkedOption.getAttribute("data-multiple-variant");
            if (variantName) {
              quickselectedVariants.push(variantName);

              const selectVariantElement = fieldset.querySelector(
                ".select-variant, .select-color-variant"
              );
              if (selectVariantElement) {
                selectVariantElement.textContent = variantName;
              }
            }
          }
        });

      if (quickselectedVariants.length === 0) return;

      const combinedVariant = quickselectedVariants.join(" / ");

      const matchingOption = document.querySelector(
        `#quickViewModal .combination_id option[data-variant-name="${combinedVariant}"]`
      );
      if (matchingOption) {
        const variantId = matchingOption.value;
        productVariant.value = variantId;
        const variantStock =
          parseInt(matchingOption.getAttribute("data-variant-left")) || 0;
        matchingOption.setAttribute("selectedVariant", "true");
        // ✅ **Update stock count**
        if (stockCount) {
          stockCount.textContent = variantStock;
        }
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
            // Update stock bar dynamically
          } else {
            atcBtnContent.textContent = "Add to Cart";
            atcBtnContent.classList.add("effect-text");
            atcButton.removeAttribute("disabled");
            stockText.style.display = "block";
            stockBarContainer.style.display = "block";
            checkoutBtn.style.display = "block";

            const outOfStockDiv = document.querySelector(
              ".out-of-stock-message"
            );
            if (outOfStockDiv) outOfStockDiv.remove();
          }
        }
        setPricedetails &&
          (setPricedetails.innerHTML = matchingOption.innerHTML);
        setSkuContent &&
          (setSkuContent.textContent =
            matchingOption.getAttribute("data-variant-sku") || "SKU: N/A");
        // Update stock bar dynamically

        updateStockBar(variantStock);
      } else {
        console.error(`No below side match found for: "${combinedVariant}"`);
      }
      // Apply .soldout class to unavailable options
      document
        .querySelectorAll("#quickViewModal .product-options-content fieldset")
        .forEach((fieldset) => {
          fieldset
            .querySelectorAll("#quickViewModal .variant-option")
            .forEach((option) => {
              const optionVariant =
                option.getAttribute("data-variant-name") ||
                option.getAttribute("data-multiple-variant");

              if (optionVariant) {
                // Declare variantKey before using it
                let variantKey = "";

                if (quickselectedVariants.length === 2) {
                  variantKey = `${quickselectedVariants[0]} / ${optionVariant}`;
                } else if (quickselectedVariants.length === 3) {
                  variantKey = [
                    quickselectedVariants[0],
                    quickselectedVariants[1],
                    optionVariant, // Use optionVariant for the third variant
                  ]
                    .filter(Boolean)
                    .join(" / ");
                }

                const stockOption = document.querySelector(
                  `#quickViewModal .combination_id option[data-variant-name="${variantKey}"]`
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
      // product-sold in 24hours

      const soldMessage = document.querySelector(
        "#quickViewModal #sold-message"
      );

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

      // stock-indaictor
      function updateStockBar(currentStock) {
        const maxStock = 50; // Set your maximum stock manually or dynamically
        const stockCountElement = document.querySelector(
          "#quickViewModal #stock-count"
        );
        const stockBarElement = document.querySelector(
          "#quickViewModal #stock-bar"
        ); // Ensure correct selection

        if (stockCountElement) {
          stockCountElement.textContent = currentStock;
        }
        console.log(stockCountElement);
        if (stockBarElement) {
          requestAnimationFrame(() => {
            // Ensure styles are applied properly
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

            console.log(
              `Updated stock bar width: ${stockBarElement.style.width}`
            );
          });
        }
      }

      document
        .querySelectorAll("#quickViewModal .product-form__submit.atc-btn")
        .forEach((button) => {
          button.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("hey clicked");
            let form = this.closest("form");
            let formData = new FormData(form);

            const quantityPicker = document.querySelector(
              "quantity-picker input[name='quantity']"
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
              .catch((error) => console.error("Error adding product:", error));
          });
        });

      // Function to open cart drawer
      function openCartDrawer() {
        const cartDrawer = document.getElementById("cart-drawer");
        document.documentElement.classList.add("js-drawer-open");
        cartDrawer.classList.add("open");
      }

      // Function to update the cart drawer dynamically
      function updateCartDrawer() {
        fetch("/?sections=cart-drawer")
          .then((response) => response.json())
          .then((data) => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(data["cart-drawer"], "text/html");

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
                if (cartItemCount > 0) {
                  openCartDrawer();
                }
              })
              .catch((error) =>
                console.error("Error fetching cart count:", error)
              );

            // attachRemoveItemEvents();
            // attachQuantityUpdateEvents();
            // addTocart();
            // openCartDrawer();
          })
          .catch((error) => console.error("Error updating cart:", error));
      }
    };
  }
  customElements.define("quick-view", quickView);
}

document.addEventListener("DOMContentLoaded", function () {
  const quickViewElement = document.querySelector("quick-view");
  if (quickViewElement) {
    quickViewElement.initSwiper();
  }
});

if (!customElements.get("quantity-picker")) {
  class QuantityPicker extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.incBtn = this.querySelector(".global-qty-picker .qnt-inc");
      this.decBtn = this.querySelector(".global-qty-picker .qnt-dec");
      this.inputField = this.querySelector(
        '.global-qty-picker input[type="number"]'
      );

      if (!this.incBtn || !this.decBtn || !this.inputField) {
        console.error("QuantityPicker: Required elements are missing.");
        return;
      }

      this.incBtn.addEventListener("click", this.onIncrease.bind(this));
      this.decBtn.addEventListener("click", this.onDecrease.bind(this));
      this.inputField.addEventListener(
        "change",
        this.handleNegativeInput.bind(this)
      );
    }

    onIncrease() {
      this.inputField.value = parseInt(this.inputField.value) + 1;
      this.inputField.dispatchEvent(new Event("change"));
    }

    onDecrease() {
      if (parseInt(this.inputField.value) > 1) {
        this.inputField.value = parseInt(this.inputField.value) - 1;
      }
      this.inputField.dispatchEvent(new Event("change"));
    }

    handleNegativeInput() {
      let parsedValue = parseFloat(this.inputField.value);
      if (isNaN(parsedValue) || parsedValue < 1) {
        this.inputField.value = 1;
      } else {
        this.inputField.value = Math.ceil(parsedValue);
      }
    }
  }

  customElements.define("quantity-picker", QuantityPicker);
}
