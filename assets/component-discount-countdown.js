document.addEventListener("DOMContentLoaded", function () {
  const countdownTimer = document.querySelector(".count-timer");
  if (!countdownTimer) return;

  const endTime = new Date(
    countdownTimer.getAttribute("data-end-time")
  ).getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = endTime - now;

    if (timeLeft < 0) {
      document.querySelector(".count-timer-content").innerHTML =
        "<p>Countdown Ended</p>";
      clearInterval(interval);
      return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    updateElement(".days", days);
    updateElement(".hours", hours);
    updateElement(".minutes", minutes);
    updateElement(".seconds", seconds);
  }

  function updateElement(selector, newValue) {
    const element = document.querySelector(selector);
    if (!element) return;

    const currentValue = parseInt(element.textContent, 10);

    if (currentValue !== newValue) {
      const newSpan = document.createElement("span");
      newSpan.textContent = newValue;
      newSpan.style.transform = "translateY(100%)";
      newSpan.style.position = "absolute";
      newSpan.style.width = "100%";
      newSpan.style.textAlign = "center";
      newSpan.style.transition = "transform 0.3s ease-in-out";
      element.appendChild(newSpan);

      setTimeout(() => {
        newSpan.style.transform = "translateY(0)";
        if (element.firstChild && element.firstChild.nodeType === 1) {
          element.firstChild.style.transform = "translateY(-100%)";
        }
      }, 50);

      setTimeout(() => {
        element.removeChild(element.firstChild);
      }, 300);
    }
  }

  const interval = setInterval(updateCountdown, 1000);
  updateCountdown();

  const copyToClipboard = document.querySelector(".copy-to-clipboard");

  function handleCopyAction(button) {
  const textToCopyElement = document.querySelector("#to-copy");
  const originalText = textToCopyElement.textContent;

    navigator.clipboard.writeText(originalText).then(() => {
      button.classList.add("copid");
      textToCopyElement.textContent = "Copied";
  
      setTimeout(() => {
        textToCopyElement.textContent = originalText;
        button.classList.remove("copid");
      }, 2000);
    }).catch(err => console.error("Failed to copy:", err));
  }
  
  copyToClipboard.addEventListener("click", function () {
      handleCopyAction(this);
  });

  copyToClipboard.addEventListener("keydown", function (e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault(); 
    handleCopyAction(this);
  }
});
  
});
