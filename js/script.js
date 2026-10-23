
/* =========================================
   AISTEMiQ — Main JavaScript
   ========================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------------------
  // 1. Current year in footer
  // -----------------------------------------

  const yearElement = document.getElementById("currentYear");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // -----------------------------------------
  // 2. Mobile navigation
  // -----------------------------------------

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navLinks.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Open navigation menu" : "Close navigation menu"
      );

      navLinks.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    // Close menu after clicking a navigation link.
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close menu with the Escape key.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Close the mobile menu if the viewport becomes desktop-sized.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) {
        closeMenu();
      }
    });
  }

  // -----------------------------------------
  // 3. Toast notification
  // -----------------------------------------

  const toast = document.getElementById("toast");
  let toastTimeout;

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    window.clearTimeout(toastTimeout);

    toastTimeout = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  }

  // -----------------------------------------
  // 4. Contact form: frontend demo only
  // -----------------------------------------

  const leadForm = document.getElementById("leadForm");
  const formStatus = document.getElementById("formStatus");

  if (leadForm) {
    leadForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!leadForm.checkValidity()) {
        leadForm.reportValidity();
        return;
      }

      const formData = new FormData(leadForm);

      const name = String(formData.get("name") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const email = String(formData.get("email") || "").trim();

      // Basic phone-number validation.
      // This checks common international formats, not ownership.
      const phoneDigits = phone.replace(/\D/g, "");

      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        if (formStatus) {
          formStatus.textContent =
            "Please enter a valid phone number with 10–15 digits.";
        }

        document.getElementById("phone")?.focus();
        return;
      }

      // The form is NOT connected to Firebase yet.
      // Do not tell visitors their lead has been submitted.
      if (formStatus) {
        formStatus.textContent =
          "Demo mode: your enquiry has not been sent or saved. Firebase will be connected in the next stage.";
      }

      showToast("Form tested successfully — no lead was saved.");

      console.info("AISTEMiQ form validation passed.", {
        nameProvided: Boolean(name),
        phoneProvided: Boolean(phone),
        emailProvided: Boolean(email)
      });
    });
  }

  // -----------------------------------------
  // 5. Smooth scrolling for same-page links
  // -----------------------------------------

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth",
        block: "start"
      });
    });
  });

  console.info("AISTEMiQ homepage scripts loaded.");
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("leadForm");
  const status = document.getElementById("formStatus");

  if (!form) {
    console.error("AISTEMiQ: leadForm was not found.");
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const interest = document.getElementById("interest").value;
    const message = document.getElementById("message").value.trim();

    const whatsappMessage = [
      "Hello AISTEMiQ! I would like to make an enquiry.",
      "",
      "Name: " + name,
      "Phone: " + phone,
      "Email: " + (email || "Not provided"),
      "Interested in: " + interest,
      "Requirements: " + (message || "I'd like to discuss my requirements."),
      "",
      "Please contact me regarding this enquiry."
    ].join("\n");

    const whatsappURL =
      "https://wa.me/919004130508?text=" +
      encodeURIComponent(whatsappMessage);

    if (status) {
      status.textContent = "Opening WhatsApp to complete your enquiry...";
    }

    const whatsappWindow = window.open(
      whatsappURL,
      "_blank"
    );

    // Fallback if the browser blocks the new tab.
    if (!whatsappWindow) {
      window.location.href = whatsappURL;
    }
  });
});



/* Mobile hamburger menu fix — append only */
(function () {
  function setupMobileMenu() {
    const header = document.querySelector(".main-nav");
    if (!header) return;

    const menuButton = header.querySelector(
      'button[aria-label*="menu" i], ' +
      'button[aria-label*="navigation" i], ' +
      '.menu-toggle, .nav-toggle, .hamburger, ' +
      '.mobile-menu-toggle, .mobile-nav-toggle, ' +
      '[aria-controls="nav-links"], [aria-controls="mobile-menu"]'
    );

    const nav = header.querySelector("nav");
    const links = header.querySelector(".nav-links");

    if (!menuButton || (!nav && !links)) {
      console.warn("Mobile menu: button or navigation selector not found.");
      return;
    }

    // Prevent duplicate listeners if this setup runs again.
    if (menuButton.dataset.mobileFixAttached === "true") return;
    menuButton.dataset.mobileFixAttached = "true";

    menuButton.setAttribute("aria-expanded", "false");

    menuButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const target = links || nav;
      const isOpen = target.classList.contains("mobile-menu-open");

      target.classList.toggle("mobile-menu-open", !isOpen);

      if (nav && links && nav !== links) {
        nav.classList.toggle("mobile-menu-open", !isOpen);
      }

      menuButton.setAttribute("aria-expanded", String(!isOpen));
    });

    (links || nav).querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        (links || nav).classList.remove("mobile-menu-open");

        if (nav && links && nav !== links) {
          nav.classList.remove("mobile-menu-open");
        }

        menuButton.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", function (event) {
      if (!header.contains(event.target)) {
        (links || nav).classList.remove("mobile-menu-open");

        if (nav && links && nav !== links) {
          nav.classList.remove("mobile-menu-open");
        }

        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupMobileMenu);
  } else {
    setupMobileMenu();
  }
})();
