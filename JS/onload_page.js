document.addEventListener("DOMContentLoaded", function () {
  // Select all elements that we want to animate
  const elementsToAnimate = document.querySelectorAll(
    ".category-card, .review-card, .newsletter-signup, .footer-column, .product-card, .show-all-btn"
  );

  // Create an Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Make the element visible when it enters the viewport
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        } else {
          // Make the element invisible when it's out of the viewport
          entry.target.style.opacity = "0";
          entry.target.style.transform = "translateY(20px)";
        }
      });
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 0.1, // Trigger when 10% of the element is visible
    }
  );

  // Observe each element and set initial styles
  elementsToAnimate.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(element);
  });
});
