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
    url: pitonConfig.routes.submitMessage,
    method: "POST",
    data: postData,
    success: function (r) {
      $('#contact-thankyou').find('.modal-body').html(r.response);
      $('#contact-thankyou').modal('show');
      $parentDiv.find('input').not('.alt-email').not('input[name="'+pitonConfig.csrfTokenName+'"]').val('');
      $parentDiv.find('textarea').val('');
      $button.html(buttonText.submit).prop('disabled',false);
    },
    error: function(r) {
      console.log('PitonCMS: There was an error submitting the form. Contact your administrator.')
      $button.html(buttonText.submit).prop('disabled',false);
    }
  });
});
