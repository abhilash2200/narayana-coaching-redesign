// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Toggle dropdown enabled/disabled state with styling
 */
function toggleDropdown(select, enable) {
  if (!select) return;
  
  if (enable) {
    select.disabled = false;
    select.classList.remove('opacity-50', 'cursor-not-allowed');
    select.classList.add('cursor-pointer');
  } else {
    select.disabled = true;
    select.value = '';
    select.classList.add('opacity-50', 'cursor-not-allowed');
    select.classList.remove('cursor-pointer');
  }
}

/**
 * Initialize cascading dropdowns (Branch -> Stream -> Course)
 * @param {string} prefix - ID prefix for selects (e.g., '', 'modal-', 'contact-')
 * @param {Function} onReset - Optional callback when form is reset
 */
function initCascadingDropdowns(prefix, onReset) {
  prefix = prefix || '';
  var branchId = prefix ? prefix + 'branch-select' : 'branch-select';
  var streamId = prefix ? prefix + 'stream-select' : 'stream-select';
  var courseId = prefix ? prefix + 'course-select' : 'course-select';
  
  var branchSelect = document.getElementById(branchId);
  var streamSelect = document.getElementById(streamId);
  var courseSelect = document.getElementById(courseId);

  if (!branchSelect || !streamSelect || !courseSelect) return;

  // Initialize: Stream and Course are disabled by default
  toggleDropdown(streamSelect, false);
  toggleDropdown(courseSelect, false);

  // Branch selection handler
  function handleBranchChange() {
    var branchValue = branchSelect.value;
    if (branchValue) {
      toggleDropdown(streamSelect, true);
    } else {
      toggleDropdown(streamSelect, false);
      toggleDropdown(courseSelect, false);
    }
  }

  // Stream selection handler
  function handleStreamChange() {
    var streamValue = streamSelect.value;
    if (streamValue) {
      toggleDropdown(courseSelect, true);
    } else {
      toggleDropdown(courseSelect, false);
    }
  }

  branchSelect.addEventListener('change', handleBranchChange);
  streamSelect.addEventListener('change', handleStreamChange);

  // Return reset function
  return function() {
    toggleDropdown(streamSelect, false);
    toggleDropdown(courseSelect, false);
    if (onReset) onReset();
  };
}

/**
 * Re-initialize Lucide icons
 */
function refreshIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function () {
  refreshIcons();

  // Set current year
  var yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Initialize all features
  initNavbar();
  initMobileMenu();
  initLocationSelector();
  initTestimonialsCarousel();
  initFormHandlers();
  initFAQAccordion();
  initContactForm();
  initModalHandlers();
});

// ============================================================================
// NAVBAR
// ============================================================================

function initNavbar() {
  var navbar = document.getElementById('navbar');
  var logo = navbar ? navbar.querySelector('img') : null;

  if (!navbar) return;

  function handleScroll() {
    var isScrolled = window.scrollY > 10;

    if (isScrolled) {
      navbar.classList.remove('bg-white', 'py-4', 'lg:py-6');
      navbar.classList.add('bg-white/90', 'backdrop-blur-md', 'shadow-md', 'py-3');
      if (logo) {
        logo.classList.remove('w-56', 'lg:w-64');
        logo.classList.add('w-48');
      }
    } else {
      navbar.classList.remove('bg-white/90', 'backdrop-blur-md', 'shadow-md', 'py-3');
      navbar.classList.add('bg-white', 'py-4', 'lg:py-6');
      if (logo) {
        logo.classList.remove('w-48');
        logo.classList.add('w-56', 'lg:w-64');
      }
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check
}

// ============================================================================
// MOBILE MENU
// ============================================================================

function initMobileMenu() {
  var toggleBtn = document.getElementById('mobile-menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var backdrop = document.getElementById('mobile-menu-backdrop');
  var menuIcon = document.getElementById('menu-icon');
  var closeIcon = document.getElementById('close-icon');
  var menuLinks = document.querySelectorAll('.mobile-menu-link');

  if (!toggleBtn || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.remove('hidden');
    if (menuIcon) menuIcon.classList.add('hidden');
    if (closeIcon) closeIcon.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.add('hidden');
    if (menuIcon) menuIcon.classList.remove('hidden');
    if (closeIcon) closeIcon.classList.add('hidden');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', function () {
    mobileMenu.classList.contains('hidden') ? openMenu() : closeMenu();
  });

  if (backdrop) backdrop.addEventListener('click', closeMenu);
  menuLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
}

// ============================================================================
// LOCATION SELECTOR
// ============================================================================

function initLocationSelector() {
  var select = document.getElementById('location-select');
  var locateBtn = document.getElementById('locate-btn');
  var centersContainer = document.getElementById('centers-container');

  if (!select || !locateBtn || !centersContainer) return;

  var LOCATIONS = {
    'Madhya Pradesh': ['Bhopal Center 1: Zone-II, MP Nagar', 'Indore Center: Vijay Nagar', 'Jabalpur Center: Napier Town'],
    'Bhopal': ['Zone-II, MP Nagar', 'Kolar Road Branch'],
    'Indore': ['Vijay Nagar Branch', 'Bhawarkua Branch'],
    'Gwalior': ['City Center Branch']
  };

  // Populate location options
  Object.keys(LOCATIONS).forEach(function (location) {
    var option = document.createElement('option');
    option.value = location;
    option.textContent = location;
    select.appendChild(option);
  });

  locateBtn.addEventListener('click', function () {
    var selectedValue = select.value;

    if (selectedValue && LOCATIONS[selectedValue]) {
      var centers = LOCATIONS[selectedValue];
      centersContainer.innerHTML = '';

      centers.forEach(function (center) {
        var centerDiv = document.createElement('div');
        centerDiv.className = 'bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-start gap-3 hover:bg-white/20 transition-all';
        centerDiv.innerHTML = '<i data-lucide="map-pin" class="w-5 h-5 text-brand-yellow shrink-0 mt-0.5"></i><span class="font-medium">' + center + '</span>';
        centersContainer.appendChild(centerDiv);
      });

      centersContainer.classList.remove('hidden');
      refreshIcons();
    } else {
      centersContainer.classList.add('hidden');
    }
  });
}

// ============================================================================
// TESTIMONIALS CAROUSEL
// ============================================================================

function initTestimonialsCarousel() {
  var container = document.getElementById('testimonials-carousel');
  if (!container || typeof Splide === 'undefined') return;

  var splide = new Splide('#testimonials-carousel', {
    type: 'loop',
    perPage: 3,
    perMove: 1,
    gap: '1.5rem',
    pagination: true,
    arrows: true,
    breakpoints: {
      1024: { perPage: 2 },
      640: { perPage: 1 }
    }
  });

  splide.mount();
  setTimeout(refreshIcons, 100);
}

// ============================================================================
// FORM HANDLERS
// ============================================================================

function initFormHandlers() {
  var heroForm = document.getElementById('hero-form');
  var demoForm = document.getElementById('demo-form');

  if (heroForm) {
    var resetHeroDropdowns = initCascadingDropdowns('');
    heroForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Thank you! We will contact you soon.');
      heroForm.reset();
      resetHeroDropdowns();
    });
  }

  if (demoForm) {
    var resetModalDropdowns = initCascadingDropdowns('modal-');
    demoForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Thank you! Your demo class request has been submitted.');
      demoForm.reset();
      resetModalDropdowns();

      // Close modal
      var modal = document.getElementById('demo-modal');
      if (modal) {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }
}

// ============================================================================
// MODAL HANDLERS
// ============================================================================

var modalDropdownsInitialized = false;

function initModalHandlers() {
  var modal = document.getElementById('demo-modal');
  var modalToggleButtons = document.querySelectorAll('[data-modal-toggle="demo-modal"]');

  if (!modal) return;

  function reinitModalDropdowns() {
    if (!modalDropdownsInitialized) {
      initCascadingDropdowns('modal-');
      modalDropdownsInitialized = true;
    }
  }

  // Re-initialize when modal opens via buttons
  if (modalToggleButtons.length > 0) {
    modalToggleButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        setTimeout(reinitModalDropdowns, 200);
      });
    });
  }

  // Listen for modal visibility changes
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        if (!modal.classList.contains('hidden')) {
          setTimeout(reinitModalDropdowns, 100);
        }
      }
    });
  });

  observer.observe(modal, {
    attributes: true,
    attributeFilter: ['class']
  });
}

// ============================================================================
// FAQ ACCORDION
// ============================================================================

function initFAQAccordion() {
  var accordionButtons = document.querySelectorAll('[data-accordion-target]');
  if (accordionButtons.length === 0) return;

  // Initialize first accordion as expanded
  var firstButton = accordionButtons[0];
  if (firstButton) {
    var firstTargetId = firstButton.getAttribute('data-accordion-target');
    var firstTargetElement = document.querySelector(firstTargetId);
    var firstIcon = firstButton.querySelector('[data-accordion-icon]');

    if (firstTargetElement && firstButton.getAttribute('aria-expanded') === 'true') {
      firstTargetElement.classList.remove('hidden');
      if (firstIcon) {
        firstIcon.style.transform = 'rotate(180deg)';
      }
    }
  }

  accordionButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var targetId = this.getAttribute('data-accordion-target');
      var targetElement = document.querySelector(targetId);
      var icon = this.querySelector('[data-accordion-icon]');
      var isExpanded = this.getAttribute('aria-expanded') === 'true';

      // Close all other accordions
      accordionButtons.forEach(function (otherButton) {
        if (otherButton !== button) {
          var otherTargetId = otherButton.getAttribute('data-accordion-target');
          var otherTargetElement = document.querySelector(otherTargetId);
          var otherIcon = otherButton.querySelector('[data-accordion-icon]');

          if (otherTargetElement) {
            otherTargetElement.classList.add('hidden');
            otherButton.setAttribute('aria-expanded', 'false');
            if (otherIcon) {
              otherIcon.style.transform = 'rotate(0deg)';
            }
          }
        }
      });

      // Toggle current accordion
      if (targetElement) {
        if (isExpanded) {
          targetElement.classList.add('hidden');
          this.setAttribute('aria-expanded', 'false');
          if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
          targetElement.classList.remove('hidden');
          this.setAttribute('aria-expanded', 'true');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      }
    });
  });
}

// ============================================================================
// CONTACT FORM
// ============================================================================

function initContactForm() {
  var contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  var resetContactDropdowns = initCascadingDropdowns('contact-');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you within 24 hours.');
    contactForm.reset();
    resetContactDropdowns();
  });
}
