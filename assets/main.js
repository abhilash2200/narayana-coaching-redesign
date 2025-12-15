// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

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
  initCascadingDropdowns();
  initModalCascadingDropdowns();
  initModalOpenHandler();
});

// Navbar scroll behavior
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

// Mobile menu toggle
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
    if (mobileMenu.classList.contains('hidden')) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  menuLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
}

// Location selector
function initLocationSelector() {
  var select = document.getElementById('location-select');
  var locateBtn = document.getElementById('locate-btn');
  var centersContainer = document.getElementById('centers-container');

  if (!select || !locateBtn || !centersContainer) return;

  // Location data
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

      // Re-initialize icons
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    } else {
      centersContainer.classList.add('hidden');
    }
  });
}

// Initialize testimonials carousel with Splide
function initTestimonialsCarousel() {
  var container = document.getElementById('testimonials-carousel');
  if (!container) return;

  // Initialize Splide
  if (typeof Splide !== 'undefined') {
    var splide = new Splide('#testimonials-carousel', {
      type: 'loop',
      perPage: 3,
      perMove: 1,
      gap: '1.5rem',
      pagination: true,
      arrows: true,
      breakpoints: {
        1024: {
          perPage: 2,
        },
        640: {
          perPage: 1,
        },
      },
    });

    splide.mount();

    // Re-initialize icons after Splide mounts
    setTimeout(function () {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }, 100);
  }
}

// Form handlers
function initFormHandlers() {
  var heroForm = document.getElementById('hero-form');
  var demoForm = document.getElementById('demo-form');

  if (heroForm) {
    heroForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Thank you! We will contact you soon.');
      heroForm.reset();
      // Reset cascading dropdowns
      initCascadingDropdowns();
    });
  }

  if (demoForm) {
    demoForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Thank you! Your demo class request has been submitted.');
      demoForm.reset();
      // Reset modal cascading dropdowns
      initModalCascadingDropdowns();

      // Close modal
      var modal = document.getElementById('demo-modal');
      if (modal) {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }
}

// Cascading dropdowns validation
function initCascadingDropdowns() {
  var branchSelect = document.getElementById('branch-select');
  var streamSelect = document.getElementById('stream-select');
  var courseSelect = document.getElementById('course-select');

  if (!branchSelect || !streamSelect || !courseSelect) return;

  // Function to enable/disable and style dropdown
  function toggleDropdown(select, enable) {
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

  // Initialize: Stream and Course are disabled by default
  toggleDropdown(streamSelect, false);
  toggleDropdown(courseSelect, false);

  // Branch selection handler
  branchSelect.addEventListener('change', function () {
    var branchValue = this.value;

    if (branchValue) {
      // Enable stream dropdown when branch is selected
      toggleDropdown(streamSelect, true);
    } else {
      // Disable stream and course if branch is cleared
      toggleDropdown(streamSelect, false);
      toggleDropdown(courseSelect, false);
    }
  });

  // Stream selection handler
  streamSelect.addEventListener('change', function () {
    var streamValue = this.value;

    if (streamValue) {
      // Enable course dropdown when stream is selected
      toggleDropdown(courseSelect, true);
    } else {
      // Disable course if stream is cleared
      toggleDropdown(courseSelect, false);
    }
  });
}

// Modal cascading dropdowns validation
var modalDropdownsInitialized = false;
var modalBranchHandler = null;
var modalStreamHandler = null;

function initModalCascadingDropdowns() {
  var branchSelect = document.getElementById('modal-branch-select');
  var streamSelect = document.getElementById('modal-stream-select');
  var courseSelect = document.getElementById('modal-course-select');

  if (!branchSelect || !streamSelect || !courseSelect) return;

  // Function to enable/disable and style dropdown
  function toggleDropdown(select, enable) {
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

  // Initialize: Stream and Course are disabled by default
  toggleDropdown(streamSelect, false);
  toggleDropdown(courseSelect, false);

  // Remove existing listeners if already initialized
  if (modalDropdownsInitialized) {
    if (modalBranchHandler) {
      branchSelect.removeEventListener('change', modalBranchHandler);
    }
    if (modalStreamHandler) {
      streamSelect.removeEventListener('change', modalStreamHandler);
    }
  }

  // Branch selection handler
  modalBranchHandler = function () {
    var branchValue = branchSelect.value;

    if (branchValue) {
      // Enable stream dropdown when branch is selected
      toggleDropdown(streamSelect, true);
    } else {
      // Disable stream and course if branch is cleared
      toggleDropdown(streamSelect, false);
      toggleDropdown(courseSelect, false);
    }
  };

  // Stream selection handler
  modalStreamHandler = function () {
    var streamValue = streamSelect.value;

    if (streamValue) {
      // Enable course dropdown when stream is selected
      toggleDropdown(courseSelect, true);
    } else {
      // Disable course if stream is cleared
      toggleDropdown(courseSelect, false);
    }
  };

  branchSelect.addEventListener('change', modalBranchHandler);
  streamSelect.addEventListener('change', modalStreamHandler);
  modalDropdownsInitialized = true;
}

// Initialize modal dropdowns when modal opens
function initModalOpenHandler() {
  var modal = document.getElementById('demo-modal');
  var modalToggleButtons = document.querySelectorAll('[data-modal-toggle="demo-modal"]');

  if (modal && modalToggleButtons.length > 0) {
    modalToggleButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        // Re-initialize modal dropdowns when modal opens
        setTimeout(function () {
          initModalCascadingDropdowns();
        }, 200);
      });
    });
  }

  // Listen for modal visibility changes using MutationObserver
  if (modal) {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (!modal.classList.contains('hidden')) {
            // Modal is visible, re-initialize dropdowns
            setTimeout(function () {
              initModalCascadingDropdowns();
            }, 100);
          }
        }
      });
    });

    observer.observe(modal, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
}

