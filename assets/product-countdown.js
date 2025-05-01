document.addEventListener("DOMContentLoaded", function () {
  const countdownTimers = document.querySelectorAll(".product-countdown");

  countdownTimers.forEach((timer) => {
    const endTime = new Date(timer.getAttribute("data-count-time")).getTime();

    function updateCountdown() {
      const now = new Date().getTime();
      const timeLeft = endTime - now;

      if (timeLeft < 0) {
        timer.innerHTML = "<p>Countdown Ended</p>";
        return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      timer
        .querySelectorAll("#card-days")
        .forEach((el) => (el.textContent = days));
      timer
        .querySelectorAll("#card-hours")
        .forEach((el) => (el.textContent = hours));
      timer
        .querySelectorAll("#card-minutes")
        .forEach((el) => (el.textContent = minutes));
      timer
        .querySelectorAll("#card-seconds")
        .forEach((el) => (el.textContent = seconds));
    }

    // Update countdown every second
    setInterval(updateCountdown, 1000);
  });
});
