window.addEventListener("DOMContentLoaded", function () {
  const inlineMenu = document.querySelector(".header__inline-menu");
  const menuItem = document.querySelector(".header__menu-item.list-menu__item");
  const detailsItems = inlineMenu.querySelectorAll("details");

  detailsItems.forEach((item) => {
    const summaryElement = item.querySelector("summary");
    const ulElement = item.querySelector("ul");
    let closeTimeout;

    item.addEventListener("mouseover", () => {
      clearTimeout(closeTimeout);
      item.setAttribute("open", true);
      summaryElement.classList.add("countryactive");
    });

    ulElement.addEventListener("mouseleave", () => {
        item.removeAttribute("open");
        summaryElement.classList.remove("countryactive");
      // closeTimeout = setTimeout(() => {
      //   item.removeAttribute("open");
      //   summaryElement.classList.remove("countryactive");
      // }, 90);
    });

    item.addEventListener("mouseleave", () => {
        item.removeAttribute("open");
        summaryElement.classList.remove("countryactive");
      // closeTimeout = setTimeout(() => {
      //   item.removeAttribute("open");
      //   summaryElement.classList.remove("countryactive");
      // }, 90);
    });
  });

  // init predictive search
  let searchTriggers = document.querySelectorAll(".action-search");
  let searchPopEle = document.querySelector("#predictiveSearchModal");

  if (searchTriggers.length > 0) {
    searchTriggers.forEach((searchTrigger) => {
      searchTrigger.addEventListener("click", (e) => {
        console.log("click");
        e.preventDefault();
        searchPopEle.classList.add("active");

        setTimeout(() => {
          document.querySelector("#predictive-search").focus();
        }, 250);

        document.body.classList.toggle("search-wrapper-open");
      });
    });
  }

  // close predictive search
  let searchCloseTrigger = document.querySelector("#closeSearchModal");
  searchCloseTrigger.addEventListener("click", () => {
    searchPopEle.classList.remove("active");
    searchTrigger.focus();
    document.querySelector("#predictive-search").value = "";
    document
      .querySelector("#predictive-search")
      .dispatchEvent(new Event("input"));
    document.body.classList.toggle("search-warpper-open");
  });
});

// header sticky
let lastScrollTop = 0;
const header = document.querySelector(".section-main-header");
const headerHeight = header.offsetHeight; // Get header height

window.addEventListener("scroll", function () {
  let currentScroll = window.scrollY;
  if (currentScroll > lastScrollTop) {
    // Scrolling down
    header.classList.add("headerhidden");
    header.style.top = `-${headerHeight}px`; // Apply dynamic height
  } else {
    // Scrolling up
    header.classList.remove("headerhidden");
    header.style.top = "0px"; // Reset to default position
  }
  lastScrollTop = currentScroll;
});

// Menu-drawer

document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.getElementById("drawer-menu-btn");
  const menuList = document.getElementById("drawer-menu-list");
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const closeIcon = document.getElementById("close-icon");
  const drawerMenu = document.querySelector(".menu-drawer-container");
  const body = document.body;

  function updateMenuHeight() {
    const announcementBar = document.querySelector(".section-announcement-bar");
    const headerHeight =
      document.querySelector(".section-main-header")?.offsetHeight || 0;

    let announcementBarHeight = 0;

    if (
      announcementBar &&
      announcementBar.offsetHeight > 0 &&
      isElementVisible(announcementBar)
    ) {
      announcementBarHeight = announcementBar.offsetHeight;
    }

    if (menuList) {
      const totalHeight = announcementBarHeight + headerHeight;
      menuList.style.height = `calc(100vh - ${totalHeight}px)`;
    }
  }

  function isElementVisible(el) {
    const rect = el.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  }

  function updateDrawerMenuHeight() {
    const drawerFooter = document.querySelector(".drawer-footer-items");

    if (drawerFooter) {
      // Make the element temporarily visible to get its height
      drawerFooter.style.display = "block"; // Ensures visibility to get correct height
      const drawerFooterHeight = drawerFooter.offsetHeight || 0;

      if (drawerMenu) {
        drawerMenu.style.height = `calc(100vh - ${drawerFooterHeight}px - 30px)`;
      }

      // Hide it back if necessary (optional, only if it was initially hidden)
      drawerFooter.style.display = "";
    }
  }

  menuBtn.addEventListener("click", function () {
    // Open menu before measuring `.drawer-footer-items`
    menuList.classList.toggle("active");

    // Small delay to ensure visibility before calculating height
    setTimeout(() => {
      updateMenuHeight();
      updateDrawerMenuHeight();
    }, 10);

    // Toggle icon visibility
    const isMenuOpen = menuList.classList.contains("active");
    hamburgerIcon.style.display = isMenuOpen ? "none" : "inline-block";
    closeIcon.style.display = isMenuOpen ? "inline-block" : "none";

    if (isMenuOpen) {
      body.classList.add("no-scroll");
    } else {
      body.classList.remove("no-scroll");
    }
  });

  // Initial height update
  updateMenuHeight();

  // Update on resize
  window.addEventListener("resize", updateMenuHeight);
  window.addEventListener("scroll", updateMenuHeight);
});
