// navbar hamburger toggler
$('.menu-toggle').click(function () {
  $('.site-nav').toggleClass('site-nav--open', 500);
  $(this).toggleClass('open');
});

// Contact form submission
$("#contact-form").on('submit', function(e) {
  e.preventDefault();
  let $button = $(this).find('button');
  let buttonText = {
    submit: "Submit",
    loading: `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span class="sr-only">Sending...</span>Sending...`
  }
  $button.prop('disabled',true).html(buttonText.loading);
  let $parentDiv = $(this).parent('div');
  let postData = $(this).serialize();
  $.ajax({
    url: '/contact',
    method: "POST",
    data: postData,
    success: function (r) {
      $parentDiv.fadeOut().empty();
      $parentDiv.append(r.response).fadeIn();
    },
    error: function(r) {
      console.log('There was an error submitting the form. Contact your administrator.')
      $button.html(buttonText.submit).prop('disabled',false);
    }
  });
});
