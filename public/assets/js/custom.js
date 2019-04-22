// navbar hamburger toggler
$('.menu-toggle').click(function () {
  $('.site-nav').toggleClass('site-nav--open', 500);
  $(this).toggleClass('open');
});

// Contact form submission
$("#contact-form").on('submit', function(e) {
  e.preventDefault();
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
    }
  });
});
