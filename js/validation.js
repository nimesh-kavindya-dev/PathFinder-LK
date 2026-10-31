/**
 * PathFinder LK - Contact Form Validation Script
 * Course: IS 1106 - Foundations of Web Technologies
 * Description: Client-side validation for required fields, email format,
 *              message length, accessible real-time feedback, and static site demonstration modal.
 */

document.addEventListener('DOMContentLoaded', () => {

  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('full-name');
  const emailInput = document.getElementById('student-email');
  const subjectInput = document.getElementById('subject-field');
  const messageInput = document.getElementById('message-field');
  const consentCheckbox = document.getElementById('terms-consent');
  const formFeedback = document.getElementById('form-feedback');
  const charCounter = document.getElementById('char-counter');

  if (!contactForm) return;

  // Validation Regular Expressions
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
  const NAME_REGEX = /^[a-zA-Z\s\.\-']{3,60}$/;

  /**
   * Helper: Show field error
   */
  const showError = (input, errorElement, message) => {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    input.setAttribute('aria-invalid', 'true');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('visible');
    }
  };

  /**
   * Helper: Clear field error
   */
  const clearError = (input, errorElement) => {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    input.setAttribute('aria-invalid', 'false');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('visible');
    }
  };

  /**
   * Individual Field Validators
   */
  const validateName = () => {
    const val = nameInput.value.trim();
    const errorEl = document.getElementById('name-error');
    if (!val) {
      showError(nameInput, errorEl, 'Full Name is required.');
      return false;
    }
    if (val.length < 3) {
      showError(nameInput, errorEl, 'Full Name must be at least 3 characters long.');
      return false;
    }
    if (!NAME_REGEX.test(val)) {
      showError(nameInput, errorEl, 'Please enter a valid name using letters only.');
      return false;
    }
    clearError(nameInput, errorEl);
    return true;
  };

  const validateEmail = () => {
    const val = emailInput.value.trim();
    const errorEl = document.getElementById('email-error');
    if (!val) {
      showError(emailInput, errorEl, 'Email Address is required.');
      return false;
    }
    if (!EMAIL_REGEX.test(val)) {
      showError(emailInput, errorEl, 'Please enter a valid email format (e.g., student@university.ac.lk).');
      return false;
    }
    clearError(emailInput, errorEl);
    return true;
  };

  const validateSubject = () => {
    const val = subjectInput.value.trim();
    const errorEl = document.getElementById('subject-error');
    if (!val) {
      showError(subjectInput, errorEl, 'Subject is required.');
      return false;
    }
    if (val.length < 5) {
      showError(subjectInput, errorEl, 'Subject must be at least 5 characters long.');
      return false;
    }
    clearError(subjectInput, errorEl);
    return true;
  };

  const validateMessage = () => {
    const val = messageInput.value.trim();
    const errorEl = document.getElementById('message-error');
    if (!val) {
      showError(messageInput, errorEl, 'Message cannot be empty.');
      return false;
    }
    if (val.length < 15) {
      showError(messageInput, errorEl, `Message must be at least 15 characters long (currently ${val.length}).`);
      return false;
    }
    clearError(messageInput, errorEl);
    return true;
  };

  const validateConsent = () => {
    const errorEl = document.getElementById('consent-error');
    if (consentCheckbox && !consentCheckbox.checked) {
      if (errorEl) {
        errorEl.textContent = 'You must acknowledge the educational project note before submitting.';
        errorEl.classList.add('visible');
      }
      return false;
    }
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
    return true;
  };

  // Real-time Input Listeners
  if (nameInput) nameInput.addEventListener('input', validateName);
  if (emailInput) emailInput.addEventListener('input', validateEmail);
  if (subjectInput) subjectInput.addEventListener('input', validateSubject);

  if (messageInput) {
    messageInput.addEventListener('input', () => {
      validateMessage();
      if (charCounter) {
        const len = messageInput.value.length;
        charCounter.textContent = `${len} / 1000 characters (minimum 15)`;
        charCounter.style.color = len < 15 ? '#dc2626' : 'var(--text-muted)';
      }
    });
  }

  if (consentCheckbox) {
    consentCheckbox.addEventListener('change', validateConsent);
  }

  /**
   * Form Submission Event Handler
   */
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isSubjectValid = validateSubject();
    const isMessageValid = validateMessage();
    const isConsentValid = validateConsent();

    // If any validation fails, focus the first failing element
    if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid || !isConsentValid) {
      if (formFeedback) {
        formFeedback.className = 'card';
        formFeedback.style.display = 'block';
        formFeedback.style.backgroundColor = '#fef2f2';
        formFeedback.style.borderColor = '#fecaca';
        formFeedback.style.color = '#991b1b';
        formFeedback.innerHTML = '<strong>Validation Error:</strong> Please correct the highlighted errors in the form before submitting.';
      }

      if (!isNameValid) nameInput.focus();
      else if (!isEmailValid) emailInput.focus();
      else if (!isSubjectValid) subjectInput.focus();
      else if (!isMessageValid) messageInput.focus();
      else if (!isConsentValid) consentCheckbox.focus();
      return;
    }

    // Success State - Escape HTML to prevent injection
    const escapeHTML = (str) => {
      const p = document.createElement('p');
      p.appendChild(document.createTextNode(str));
      return p.innerHTML;
    };

    const safeName = escapeHTML(nameInput.value.trim());
    const safeEmail = escapeHTML(emailInput.value.trim());
    const safeSubject = escapeHTML(subjectInput.value.trim());
    const safeMessage = escapeHTML(messageInput.value.trim());

    // Render Educational Demonstration Confirmation
    if (formFeedback) {
      formFeedback.className = 'card';
      formFeedback.style.display = 'block';
      formFeedback.style.backgroundColor = '#f0fdf4';
      formFeedback.style.borderColor = '#16a34a';
      formFeedback.style.color = '#14532d';
      formFeedback.style.padding = '2rem';
      formFeedback.innerHTML = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">&#9989;</div>
          <h3 style="color: #15803d; font-size: 1.5rem; margin-bottom: 0.25rem;">Form Successfully Validated!</h3>
          <p style="color: #166534; font-size: 0.95rem; margin: 0;">
            Thank you, <strong>${safeName}</strong>. Your inquiry has passed all frontend validation requirements.
          </p>
        </div>

        <div style="background-color: #ffffff; border: 1px solid #bbf7d0; border-radius: var(--radius-sm); padding: 1.25rem; margin-bottom: 1.5rem; font-size: 0.95rem; line-height: 1.7; color: var(--text-main);">
          <p style="margin-bottom: 0.5rem;"><strong>Summary of Submitted Information:</strong></p>
          <ul style="padding-left: 1.25rem; margin: 0;">
            <li><strong>Sender:</strong> ${safeName} (&lt;${safeEmail}&gt;)</li>
            <li><strong>Subject:</strong> ${safeSubject}</li>
            <li><strong>Message Preview:</strong> <em>"${safeMessage.substring(0, 100)}${safeMessage.length > 100 ? '...' : ''}"</em></li>
          </ul>
        </div>

        <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: var(--radius-sm); padding: 1rem 1.25rem; font-size: 0.875rem; color: #92400e; margin-bottom: 1.5rem;">
          <strong>Static Website Architecture Notice:</strong> PathFinder LK is an educational static website project hosted on GitHub Pages without a backend database or mail server. Therefore, this form demonstrates client-side JavaScript validation without delivering messages to a real email inbox.
        </div>

        <div style="text-align: center;">
          <button type="button" id="reset-inquiry-btn" class="btn btn-primary btn-sm">Send Another Inquiry</button>
        </div>
      `;

      // Hide the form while displaying confirmation
      contactForm.style.display = 'none';

      // Attach reset listener
      const resetInquiryBtn = document.getElementById('reset-inquiry-btn');
      if (resetInquiryBtn) {
        resetInquiryBtn.addEventListener('click', () => {
          contactForm.reset();
          if (charCounter) charCounter.textContent = '0 / 1000 characters (minimum 15)';
          const inputs = [nameInput, emailInput, subjectInput, messageInput];
          inputs.forEach(inp => {
            inp.classList.remove('is-valid', 'is-invalid');
            inp.removeAttribute('aria-invalid');
          });
          formFeedback.style.display = 'none';
          contactForm.style.display = 'block';
          nameInput.focus();
        });
      }

      formFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // Handle standard Reset button
  contactForm.addEventListener('reset', () => {
    setTimeout(() => {
      if (charCounter) charCounter.textContent = '0 / 1000 characters (minimum 15)';
      const inputs = [nameInput, emailInput, subjectInput, messageInput];
      inputs.forEach(inp => {
        inp.classList.remove('is-valid', 'is-invalid');
        inp.removeAttribute('aria-invalid');
      });
      const errors = document.querySelectorAll('.form-error');
      errors.forEach(err => err.classList.remove('visible'));
      if (formFeedback) formFeedback.style.display = 'none';
    }, 50);
  });

});
