// Delete confirm prompt
$('body').on('click', '.jsDeleteConfirm', function() {
  var reply = confirm('Are you sure you want to delete?');
  return reply;
});

// Add user row
$('.jsAddUserRow').on('click', function() {
    var $userRow = $(this).parent('.jsUserForm').find('div:last').clone();
    $userRow.find('input').val('');
    $userRow.find('a').attr('href', '#');
    $(this).before($userRow);
});

// Make sure element name is one word
$('form input.jsElementName').on('blur', function() {
    var elementName = $(this).val();
    if (elementName.match(/[^a-zA-Z0-9-]/g)) {
        elementName = elementName.replace(/[^a-z0-9]/g, '-');
        $(this).val(elementName);
    }
});
