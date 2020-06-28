
import { postXHRPromise } from '/admin/js/modules/xhrPromise.js';

const contactDisplayResponse = function(text) {
  let form = document.querySelector(`[data-contact-form="1"]`);
  if (form) {
    form.innerHTML = text;
  }
};

const contactSubmitMessage = function(event) {
  if (event.target.matches(`[type="submit"]`) && event.target.closest(`[data-contact-form="1"]`)) {
    event.preventDefault();
    let form = document.querySelector(`[data-contact-form="1"] form`);

    if (form) {
      // Set indicator of work in progress
      form.querySelector(`button[type="submit"]`).innerHTML = "Sending...";
      postXHRPromise(pitonConfig.routes.submitMessage, new FormData(form))
        .then(text => {
          contactDisplayResponse(`<p>${text}</p>`);
        })
        .catch(error => {
          contactDisplayResponse(`<p>${error}</p>`);
        });
    }
  }
}

document.addEventListener("click", contactSubmitMessage, false);
