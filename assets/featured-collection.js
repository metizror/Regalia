document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  if (tabButtons.length > 0) {
    tabButtons[0].classList.add("active");
    if (tabContents.length > 0) {
      tabContents[0].style.display = "grid";
    }
  }

  function tabChnage(button) {
    
    // Remove active class from all buttons and hide all tab contents
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => (content.style.display = "none"));
    
    // Add active class to the clicked button and show its content
    button.classList.add("active");
    const tabId = button.getAttribute("data-tab");
    document.getElementById(tabId).style.display = "grid";
  }

  tabButtons.forEach((button) => {
      button.addEventListener("click", function () {
      tabChnage(this);
    });

    button.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        tabChnage(this);
      }
    });
  });
});
