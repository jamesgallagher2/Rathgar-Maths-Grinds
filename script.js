(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     Footer year
  --------------------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = primaryNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile nav when a link is clicked
    var navLinks = primaryNav.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        primaryNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------------------
     Smooth scroll for anchor links (with sticky header offset)
  --------------------------------------------------------------------- */
  var header = document.querySelector('.site-header');

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId.length < 2) return; // guard against bare "#"

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      var headerHeight = header ? header.offsetHeight : 0;
      var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  /* ---------------------------------------------------------------------
     FAQ accordion
  --------------------------------------------------------------------- */
  var accordionTriggers = document.querySelectorAll('.accordion-trigger');

  accordionTriggers.forEach(function (trigger) {
    var panel = trigger.parentElement.querySelector('.accordion-panel');
    if (!panel) return;

    trigger.addEventListener('click', function () {
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close all other panels (single-open accordion)
      accordionTriggers.forEach(function (otherTrigger) {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          var otherPanel = otherTrigger.parentElement.querySelector('.accordion-panel');
          if (otherPanel) otherPanel.style.maxHeight = null;
        }
      });

      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = isOpen ? null : panel.scrollHeight + 'px';
    });
  });

  /* ---------------------------------------------------------------------
     Expression of Interest form: validation + Formspree AJAX submission
  --------------------------------------------------------------------- */
  var form = document.getElementById('enquiryForm');
  if (!form) return;

  var statusEl = document.getElementById('formStatus');
  var submitBtn = form.querySelector('.btn-submit');
  var submitBtnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PHONE_PATTERN = /^[0-9+\s()-]{7,}$/;

  var validators = {
    fullName: function (value) {
      return value.trim().length > 0 ? '' : 'Please enter your full name.';
    },
    phone: function (value) {
      if (!value.trim()) return 'Please enter a phone number.';
      if (!PHONE_PATTERN.test(value.trim())) return 'Please enter a valid phone number.';
      return '';
    },
    email: function (value) {
      if (!value.trim()) return 'Please enter an email address.';
      if (!EMAIL_PATTERN.test(value.trim())) return 'Please enter a valid email address.';
      return '';
    },
    level: function (value) {
      return value ? '' : 'Please select your level of study.';
    }
  };

  function showFieldError(fieldName, message) {
    var field = form.querySelector('[name="' + fieldName + '"]');
    var errorEl = form.querySelector('[data-error-for="' + fieldName + '"]');

    if (field) field.classList.toggle('invalid', Boolean(message));
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.toggle('visible', Boolean(message));
    }
  }

  function validateField(fieldName) {
    var field = form.querySelector('[name="' + fieldName + '"]');
    if (!field || !validators[fieldName]) return true;

    var message = validators[fieldName](field.value);
    showFieldError(fieldName, message);
    return !message;
  }

  function validateForm() {
    var isValid = true;
    Object.keys(validators).forEach(function (fieldName) {
      if (!validateField(fieldName)) isValid = false;
    });
    return isValid;
  }

  // Live validation on blur
  Object.keys(validators).forEach(function (fieldName) {
    var field = form.querySelector('[name="' + fieldName + '"]');
    if (!field) return;
    field.addEventListener('blur', function () {
      validateField(fieldName);
    });
    field.addEventListener('input', function () {
      if (field.classList.contains('invalid')) validateField(fieldName);
    });
  });

  function setStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = 'form-status' + (type ? ' ' + type : '');
  }

  function setSubmitting(isSubmitting) {
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    if (submitBtnText) {
      submitBtnText.textContent = isSubmitting ? 'Sending…' : 'Send My Enquiry';
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    setStatus('', '');

    if (!validateForm()) {
      setStatus('Please fix the highlighted fields and try again.', 'error');
      return;
    }

    setSubmitting(true);

    // Browser autofill / password managers sometimes fill the hidden
    // honeypot field even though it's off-screen and non-focusable, which
    // trips Formspree's spam check for genuine users. Clear it right before
    // sending — real bots that skip this script entirely are unaffected.
    var honeypotField = form.querySelector('[name="_gotcha"]');
    if (honeypotField) honeypotField.value = '';

    var formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          form.reset();
          setStatus('Thanks, we\'ll be in touch within 24 hours.', 'success');
        } else {
          return response.json().then(function (data) {
            var message = (data && data.errors && data.errors.length)
              ? data.errors.map(function (err) { return err.message; }).join(', ')
              : 'Something went wrong sending your enquiry. Please try again or contact us directly.';
            setStatus(message, 'error');
          });
        }
      })
      .catch(function () {
        setStatus('Something went wrong sending your enquiry. Please check your connection and try again.', 'error');
      })
      .finally(function () {
        setSubmitting(false);
      });
  });
})();
