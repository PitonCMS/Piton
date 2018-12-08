$('.datepicker').datepicker();

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

// Add Page Section Element
$('.jsAddElement').on('click', function() {
    var $sectionParent = $(this).parent('.jsSectionParent');
    var elementType = $(this).data('element-type');
    var sectionCodeName = $(this).data('section-code-name');

    $.ajax({
        url: '/admin/page/element/fetch',
        method: "POST",
        data: {
            sectionCodeName: sectionCodeName,
            elementType: elementType
        },
        success: function (r) {
            var $newElement = $(r.html);
            $newElement.appendTo($sectionParent);
            $newElement.find('.jsMDE').each(function() {
                simplemde = new SimpleMDE({
                    element: this,
                    forceSync: true
                });
            });
        }
    });
});

// Delete page section element
$('.jsSectionParent').on('click', '.jsDeleteSectionElement', function () {
    var sectionElementId = $(this).data('section-element-id') || 'x';
    var physicalDelete = true;

    if (!isNaN(sectionElementId)) {
        $.ajax({
            url: '/admin/page/section/deleteelement/' + sectionElementId,
            method: "GET",
            success: function (r) {
                if (r.status != 'success') {
                    physicalDelete = false;
                }
            }
        });
    }

    // Remove element HTML
    if (physicalDelete) {
        $(this).parents('.jsElementParent').slideUp('normal', function () {
            $(this).remove();
        });
    }
});

// Toggle element selector
$('.jsElementType').on('click', 'input[type="radio"]', function() {
    var selectedTypeOption = $(this).val();
    $('.jsElementOptional.d-block').toggleClass('d-block d-none');

    if (selectedTypeOption === 'media' || selectedTypeOption === 'hero') {
        $(this).parents('.jsElementType').siblings('.jsElementMediaPath').toggleClass('d-none d-block');
        return;
    }
    if (selectedTypeOption === 'mediaGroup') {
        $(this).parents('.jsElementType').siblings('.jsElementMediaGroup').toggleClass('d-none d-block');
        return;
    }
    if (selectedTypeOption === 'collection') {
        $(this).parents('.jsElementType').siblings('.jsElementCollection').toggleClass('d-none d-block');
        return;
    }
});
