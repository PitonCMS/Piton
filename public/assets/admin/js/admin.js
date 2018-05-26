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
    if (elementName.match(/\s/g)) {
        elementName = elementName.replace(/\s/g, '-');
        console.log(elementName)
        $(this).val(elementName);
    }
});
