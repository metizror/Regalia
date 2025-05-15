document.addEventListener("DOMContentLoaded", function () {
  var videoElements = document.querySelectorAll(".video-section__media video");
  videoElements.forEach(function (videoEl) {
    var img = videoEl.querySelector("img");
    if (img) {
      img.setAttribute("alt", "Video preview image");
    }
  });

  let swiperInstance;

  function initializeSwiper() {
    if (window.innerWidth <= 767 && !swiperInstance) {
      swiperInstance = new Swiper(".vidpro-swiper", {
        slidesPerView: 2,
        spaceBetween: 10,
        loop: true,
        grabCursor: true,
        speed: 500,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
      });
    }
  }

  function destroySwiper() {
    if (window.innerWidth > 767 && swiperInstance) {
      swiperInstance.destroy(true, true);
      swiperInstance = null;
    }
  }

  initializeSwiper();

  window.addEventListener("resize", function () {
    initializeSwiper();
    destroySwiper();
  });
});








