function showPage(id) {
  console.log("Attempting to show page:", id);

  // Hide all pages
  $("[data-page]").removeClass("active");
  console.log("Hidden all pages");

  // Show target page and log if it exists; error if not found
  const $targetPage = $(`[data-page="${id}"]`);
  if ($targetPage.length === 0) {
    console.error("Page not found:", id);
    return;
  }
  $targetPage.addClass("active");
  console.log("Showing page:", id, "Elements found:", $targetPage.length);

  // Update active nav link
  $("nav a[data-target]").each(function () {
    $(this).toggleClass("nav-active", $(this).data("target") === id);
  });

  // Update page title
  const titles = {
    home: "Home - Pitch & Pixels",
    football: "Football - Pitch & Pixels",
    gaming: "Gaming - Pitch & Pixels",
    gallery: "Gallery - Pitch & Pixels",
    stories: "Stories - Pitch & Pixels",
    about: "About Me - Pitch & Pixels",
  };
  document.title = titles[id] || "Pitch & Pixels";

  // Push URL hash for back-button support
  try {
    history.pushState({ page: id }, "", `#${id}`);
  } catch (e) {}
  $(window).scrollTop(0);

  // Re-run fade-in animations for newly visible elements
  requestAnimationFrame(() => {
    // Target all elements within the active page for consistent animation
    const elements = $(`[data-page="${id}"] *`).filter(function () {
      // Only animate visible elements
      return this.nodeType === 1 && $(this).is("*");
    });

    elements.each(function (index) {
      const $el = $(this);
      $el.css({
        transition: "none",
        opacity: "0",
        transform: "translateY(20px)",
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          $el.css({
            transition: `opacity 0.3s ease-out ${index * 0.05}s, transform 0.3s ease-out ${index * 0.05}s`,
            opacity: "1",
            transform: "translateY(0)",
          });
        });
      });
    });
  });
}

$(document).ready(function () {
  // Wire up nav links
  $("nav a[data-target]").on("click", function (e) {
    e.preventDefault();
    showPage($(this).data("target"));
  });

  // Handle browser back/forward
  $(window).on("popstate", function () {
    const id = location.hash.slice(1) || "home";
    showPage(id);
  });

  // Scroll-to-top button visibility when scrolled at least 300px
  const $scrollBtn = $("#scroll-top");
  $(window).on("scroll", function () {
    if ($(window).scrollTop() > 300) {
      $scrollBtn.addClass("visible");
    } else {
      $scrollBtn.removeClass("visible");
    }
  });

  const initial = location.hash.slice(1) || "home";
  showPage(initial);
});

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document
      .querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

// Lightbox functionality
let currentImageIndex = 0;
let galleryImages = [];

// Initialize lightbox
function initLightbox() {
  // Create lightbox HTML
  const lightboxHTML = `
    <div id="lightbox" class="lightbox">
      <span class="lightbox-close">&times;</span>
      <img class="lightbox-content" src="" alt="">
      <span class="lightbox-nav lightbox-prev">&#10094;</span>
      <span class="lightbox-nav lightbox-next">&#10095;</span>
      <div class="lightbox-counter"></div>
    </div>
  `;

  // Add lightbox to body
  $("body").append(lightboxHTML);

  // Collect all gallery images
  updateGalleryImages();

  // Add click handlers to gallery images
  $(document).on("click", ".gallery-item img", function (e) {
    e.stopPropagation();
    const imgSrc = $(this).attr("src");
    currentImageIndex = galleryImages.indexOf(imgSrc);
    openLightbox(currentImageIndex);
  });

  // Close lightbox on close button click
  $(document).on("click", ".lightbox-close", function (e) {
    e.stopPropagation();
    closeLightbox();
  });

  // Close lightbox on background click
  $(document).on("click", ".lightbox", function (e) {
    if (e.target === this) {
      closeLightbox();
    }
  });

  // Navigation
  $(document).on("click", ".lightbox-prev", function (e) {
    e.stopPropagation();
    navigateLightbox(-1);
  });

  $(document).on("click", ".lightbox-next", function (e) {
    e.stopPropagation();
    navigateLightbox(1);
  });

  // Keyboard navigation
  $(document).on("keydown", function (e) {
    if ($("#lightbox").hasClass("active")) {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        navigateLightbox(-1);
      } else if (e.key === "ArrowRight") {
        navigateLightbox(1);
      }
    }
  });
}

// Update gallery images array
function updateGalleryImages() {
  galleryImages = [];
  $(".gallery-item img").each(function () {
    galleryImages.push($(this).attr("src"));
  });
}

// Open lightbox
function openLightbox(index) {
  const lightbox = $("#lightbox");
  const lightboxImg = $(".lightbox-content");
  const counter = $(".lightbox-counter");

  if (galleryImages.length === 0) return;

  currentImageIndex = index;
  const imgSrc = galleryImages[currentImageIndex];

  lightboxImg.attr("src", imgSrc);
  lightboxImg.attr("alt", `Gallery image ${currentImageIndex + 1}`);
  counter.text(`${currentImageIndex + 1} / ${galleryImages.length}`);

  lightbox.addClass("active");
  $("body").css("overflow", "hidden"); // Prevent background scrolling
}

// Close lightbox
function closeLightbox() {
  const lightbox = $("#lightbox");
  lightbox.removeClass("active");
  $("body").css("overflow", ""); // Restore scrolling
}

// Navigate lightbox
function navigateLightbox(direction) {
  currentImageIndex += direction;

  // Wrap around
  if (currentImageIndex < 0) {
    currentImageIndex = galleryImages.length - 1;
  } else if (currentImageIndex >= galleryImages.length) {
    currentImageIndex = 0;
  }

  openLightbox(currentImageIndex);
}

// Initialize lightbox when document is ready
$(document).ready(function () {
  initLightbox();
});
