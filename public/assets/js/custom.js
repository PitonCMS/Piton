// navbar hamburger toggler
$('.menu-toggle').click(function () {
  $('.site-nav').toggleClass('site-nav--open', 500);
  $(this).toggleClass('open');
});

const contactMessageDisplay = function(text) {
  let contactDiv = $('.jsContactForm');
  if (contactDiv) {
    contactDiv.slideUp(function() {
      $(this).html(text);
      $(this).slideDown();
    });
  }
};

// Contact form submission
$("#contact-form").on('submit', function(e) {
  e.preventDefault();
  let buttonText = {
    submit: "Submit",
    loading: "Sending..."
  }
  $(this).find('.jsContactSubmitButton').prop('disabled',true).html(buttonText.loading);
  let postData = $(this).serialize();
  $.ajax({
    url: pitonConfig.routes.submitMessage,
    method: "POST",
    data: postData,
    success: function (r) {
      if (r.status == "success") {
        contactMessageDisplay(r.response);
      } else {
        contactMessageDisplay("<strong>Whoops! There was an error submitting your message.</strong>");
      }
    },
    error: function(r) {
      contactMessageDisplay("<strong>Whoops! There was an error submitting your message.</strong>");
    }
  });
});
