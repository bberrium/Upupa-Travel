// Shared client-side form handling: validation, submission, status messages.
//
// Before this, both forms on the site were plain <form> elements with no
// action and no handler — pressing "Send" did nothing and the enquiry was
// lost. Now a form either posts to the configured endpoint, or falls back to
// opening the visitor's mail client with the message pre-filled.

function fieldError(input) {
  const wrapper = input.closest("[data-field]");
  return wrapper ? wrapper.querySelector("[data-error]") : null;
}

function showError(input, message) {
  input.classList.add("is-invalid");
  input.setAttribute("aria-invalid", "true");
  const error = fieldError(input);
  if (error) {
    error.textContent = message;
    error.classList.add("is-visible");
  }
}

function clearError(input) {
  input.classList.remove("is-invalid");
  input.removeAttribute("aria-invalid");
  const error = fieldError(input);
  if (error) error.classList.remove("is-visible");
}

function validate(form) {
  let firstInvalid = null;
  form.querySelectorAll("input, select, textarea").forEach((input) => {
    if (input.type === "hidden" || input.disabled) return;
    clearError(input);
    if (input.checkValidity()) return;
    const message =
      input.dataset.errorMessage ||
      (input.validity.valueMissing ? "This field is required." : "Please check this field.");
    showError(input, message);
    if (!firstInvalid) firstInvalid = input;
  });
  if (firstInvalid) firstInvalid.focus();
  return !firstInvalid;
}

function setStatus(form, type, message) {
  const status = form.querySelector("[data-form-status]");
  if (!status) return;
  status.textContent = message;
  status.classList.remove("is-ok", "is-error");
  status.classList.add("is-visible", type === "ok" ? "is-ok" : "is-error");
}

function mailtoFallback(form, { email, subject }) {
  const data = new FormData(form);
  const lines = [];
  data.forEach((value, key) => {
    if (String(value).trim()) lines.push(`${key}: ${value}`);
  });
  const href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  window.location.href = href;
  setStatus(form, "ok", "Your email app is opening with the message ready to send.");
}

export function initForm(form, { endpoint, email, subject, netlify = false }) {
  if (!form) return;

  form.setAttribute("novalidate", "novalidate");
  form.querySelectorAll("input, select, textarea").forEach((input) => {
    input.addEventListener("input", () => clearError(input));
    input.addEventListener("change", () => clearError(input));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validate(form)) {
      setStatus(form, "error", "Please fix the highlighted fields.");
      return;
    }

    // Honeypot: bots fill every field, people never see this one.
    if (form.querySelector("[name='company']")?.value) return;

    const button = form.querySelector("[type='submit']");
    const originalLabel = button ? button.textContent : "";
    if (button) {
      button.disabled = true;
      button.textContent = "Sending…";
    }

    try {
      if (netlify) {
        const body = new URLSearchParams(new FormData(form)).toString();
        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        });
        if (!response.ok) throw new Error("Netlify rejected the submission");
      } else if (endpoint) {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        if (!response.ok) throw new Error("Endpoint rejected the submission");
      } else {
        mailtoFallback(form, { email, subject });
        return;
      }

      form.reset();
      setStatus(form, "ok", "Thank you — we've got it. We reply within a few hours.");
    } catch (error) {
      setStatus(
        form,
        "error",
        `Sorry, that didn't send. Please email ${email} or message us on WhatsApp.`
      );
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = originalLabel;
      }
    }
  });
}
