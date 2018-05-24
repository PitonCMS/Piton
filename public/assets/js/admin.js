// Delete confirm prompt
$('body').on('click', '.delete-confirm', function() {
  var reply = confirm('Are you sure you want to delete?');
  return reply;
});

// Add user row
$('#user-emails .add-user-row').on('click', function() {
    var $userRow = $(this).parent('#user-emails').find('div:last').clone();
    $userRow.find('input').val('');
    $userRow.find('a').attr('href', '#');
    $(this).before($userRow);
});

// Make sure element name is one word
$('form input.element-name').on('blur', function() {
    var elementName = $(this).val();
    if (elementName.match(/\s/g)) {
        elementName = elementName.replace(/\s/g, '-');
        console.log(elementName)
        $(this).val(elementName);
    }
});
