theme.slideShow = () => {
  const collectionlistEle = document.querySelector(".slidercontent");
  if (!collectionlistEle) return;

  const swiperOptions = JSON.parse(collectionlistEle.dataset.sliderOptions);
  swiperOptions.pagination.renderBullet = renderPaginationBullet;

  const swiper = new Swiper(collectionlistEle, swiperOptions);

  if (Shopify.designMode) {
    document.addEventListener("shopify:block:select", (e) => {
      let targetEle = e.target;
      let sliderIndex = 1 + parseInt(targetEle.dataset.swiperSlideIndex);
      swiper.slideTo(sliderIndex);
      swiper.autoplay.stop(); 
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
