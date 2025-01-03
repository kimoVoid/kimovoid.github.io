console.clear();
const featuresEl = document.querySelector("body");
const featureEls = document.querySelectorAll(".container-border");

featuresEl.addEventListener("pointermove", (ev) => {
  featureEls.forEach((featureEl) => {
    const rect = featureEl.getBoundingClientRect();

    featureEl.style.setProperty("--x", ev.clientX - rect.left);
    featureEl.style.setProperty("--y", ev.clientY - rect.top);
  });
});