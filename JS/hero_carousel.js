document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const slides = Array.from(track.children);
  const nextButton = document.querySelector(".carousel-button.next");
  const prevButton = document.querySelector(".carousel-button.prev");
  let currentIndex = 0;
  const cardWidth = 15; // Card width in rem
  const gapWidth = 1.25; // Gap width in rem (from CSS)
  let containerWidth = document.querySelector(
    ".carousel-container"
  ).offsetWidth;
  let slidesToShow = calculateSlidesToShow(containerWidth);

  function calculateSlidesToShow(width) {
    if (width < 576) return 1; // For mobile devices
    if (width < 768) return 2; // For tablets
    if (width < 992) return 3; // For small desktops
    if (width < 1200) return 4; // For medium desktops
    return 5; // For large desktops
  }

  function updateCarousel() {
    containerWidth = document.querySelector(".carousel-container").offsetWidth;
    slidesToShow = calculateSlidesToShow(containerWidth);

    const totalWidth = (cardWidth + gapWidth) * slides.length;
    const availableSpace = containerWidth / 16; // Convert px to rem
    const offset = (availableSpace - totalWidth) / 2;

    slides.forEach((slide) => {
      slide.style.flexBasis = `${cardWidth}rem`;
      slide.style.maxWidth = `${cardWidth}rem`;
      slide.style.marginRight = `${gapWidth}rem`;
    });

    track.style.paddingLeft = `${offset}rem`;
    track.style.paddingRight = `${offset}rem`;

    moveToSlide(currentIndex);
  }

  function moveToSlide(targetIndex) {
    currentIndex = targetIndex;
    const slideWidth = cardWidth + gapWidth;
    const totalSlides = slides.length;

    // Calculate the center offset
    const centerOffset = (containerWidth / 16 - slideWidth) / 2;

    // Calculate the translation to center the current slide
    const translation = -currentIndex * slideWidth + centerOffset;

    track.style.transition = "transform 1s ease-in-out";
    track.style.transform = `translateX(${translation}rem)`;
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    moveToSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    moveToSlide(currentIndex);
  }

  nextButton.addEventListener("click", nextSlide);
  prevButton.addEventListener("click", prevSlide);

  let autoSlideTimeout;

  function startAutoSlide() {
    clearTimeout(autoSlideTimeout);
    autoSlideTimeout = setTimeout(() => {
      nextSlide();
      startAutoSlide();
    }, 3000); // 3 seconds per slide
  }

  function stopAutoSlide() {
    clearTimeout(autoSlideTimeout);
  }

  track.addEventListener("mouseenter", stopAutoSlide);
  track.addEventListener("mouseleave", startAutoSlide);

  slides.forEach((slide) => {
    slide.addEventListener("mouseenter", stopAutoSlide);
    slide.addEventListener("mouseleave", startAutoSlide);
  });

  // Handle infinite loop
  track.addEventListener("transitionend", () => {
    if (currentIndex === slides.length - 1) {
      startAutoSlide(); // Ensure we wait 3 seconds on the last slide
    }
  });

  window.addEventListener("resize", updateCarousel);

  updateCarousel();
  startAutoSlide(); // Start the auto-slide when the page loads
});
