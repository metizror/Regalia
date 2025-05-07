theme.slideShow = () => {
  const collectionlistEle = document.querySelector(".slidercontent");
  if (!collectionlistEle) return;

  // Parse the slider options from the data attribute
  const swiperOptions = JSON.parse(collectionlistEle.dataset.sliderOptions);

  // Define the renderBullet function separately
  swiperOptions.pagination.renderBullet = renderPaginationBullet;

  // Initialize the Swiper instance with the options
  const swiper = new Swiper(collectionlistEle, swiperOptions);

  // Handle Shopify block select and other customization events in design mode
  if (Shopify.designMode) {
    document.addEventListener("shopify:block:select", (e) => {
      let targetEle = e.target;
      let sliderIndex = 1 + parseInt(targetEle.dataset.swiperSlideIndex);
      swiper.slideTo(sliderIndex);
      swiper.autoplay.stop(); // Assuming autoplay might be used and pausing it
    });

    const customizationEvents = [
      "shopify:inspector:activate",
      "shopify:inspector:deactivate",
      "shopify:section:load",
      "shopify:block:deselect",
      "shopify:section:reorder",
      "shopify:section:select",
      "shopify:section:deselect",
    ];

    customizationEvents.forEach((event) => {
      document.addEventListener(event, () => swiper.update());
    });
  }
};

// Wait for the DOM content to load before initializing the slider
window.addEventListener("DOMContentLoaded", () => {
  theme.slideShow();
});

// Function to render custom pagination bullets
function renderPaginationBullet(index, className) {
  const slide = document.querySelectorAll(".sliderimg")[index];
  const image = slide.getAttribute("data-image");

  // Render the bullet with a background image based on the data-image attribute
  return `<div class="${className}"><img src="${image}" alt="Slide thumbnail" /></div>`;
}
