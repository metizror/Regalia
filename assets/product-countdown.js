document.addEventListener("DOMContentLoaded", function () {
  const countdownTimers = document.querySelectorAll(".product-countdown");

  countdownTimers.forEach((timer) => {
    const endTime = new Date(timer.getAttribute("data-count-time")).getTime();

    // Cache querySelectorAll results once to avoid redundant DOM queries
    const dayEls = timer.querySelectorAll("#card-days");
    const hourEls = timer.querySelectorAll("#card-hours");
    const minuteEls = timer.querySelectorAll("#card-minutes");
    const secondEls = timer.querySelectorAll("#card-seconds");

    function updateCountdown() {
      const now = Date.now(); // Slightly faster than new Date().getTime()
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

      // Use cached node lists to avoid querying the DOM repeatedly
      dayEls.forEach((el) => (el.textContent = days));
      hourEls.forEach((el) => (el.textContent = hours));
      minuteEls.forEach((el) => (el.textContent = minutes));
      secondEls.forEach((el) => (el.textContent = seconds));
    }

    setInterval(updateCountdown, 1000);
  });
});
