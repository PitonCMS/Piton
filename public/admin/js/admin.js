// --------------------------------------------------------
// Misc Statements
// --------------------------------------------------------

$('.jsDatePicker').datepicker({
    format: pitonConfig.dateFormat,
    weekStart: pitonConfig.weekStart,
    todayHighlight: true,
    orientation: 'bottom'
});

// Delete confirm prompt
var confirmDeletePrompt = function(msg) {
    var message = msg || 'Are you sure you want to delete?';
    return confirm(message);
}

$('body').on('click', '.jsDeleteConfirm', function() {
  return confirmDeletePrompt();
});

// --------------------------------------------------------
// User Management
// --------------------------------------------------------

// Add user row
$('.jsAddUserRow').on('click', function() {
    var $userRow = $(this).parent('.jsUserForm').find('div:last').clone();
    $userRow.find('input').val('');
    $userRow.find('a').attr('href', '#');
    $(this).before($userRow);
});

// --------------------------------------------------------
// Page Management
// --------------------------------------------------------
// Add Page Block Element
$('.jsAddElement').on('click', function() {
    let $addButton = $(this);
    let buttonText = {
        addElement: "Add Element",
        loading: `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span class="sr-only">Loading...</span>Loading...`
    }
    $addButton.prop('disabled',true).html(buttonText.loading);
    let $blockParent = $(this).parents('.jsBlockParent');
    let elementType = $(this).data('element-type');
    let blockKey = $(this).data('block-key');
    let elementTypeOptions = $(this).data('element-type-options');
    let elementLimit = $(this).data('element-count-limit') || 100;
    let postData = {
            blockKey: blockKey,
            elementType: elementType,
            elementTypeOptions: elementTypeOptions
    }
    postData[pitonConfig.csrfTokenName] = pitonConfig.csrfTokenValue;

    $.ajax({
        url: '/admin/page/element/new',
        method: "POST",
        data: postData,
        success: function (r) {
            let $newElement = $(r.html);

            // Increment element sort value
            let lastElementSortValue = $blockParent.find('.jsElementParent:last-child .jsElementSortValue').val();

            if (!isNaN(lastElementSortValue)) {
                lastElementSortValue++;
            } else {
                lastElementSortValue = 1;
            }

            $newElement.appendTo($blockParent);
            $newElement.find('.jsElementSortValue').val(lastElementSortValue);
            $newElement.find('.jsMDE').each(function() {
                simplemde = new SimpleMDE({
                    element: this,
                    forceSync: true
                });
            });

            // If number of elements matches or exceeds the limit, disable the button
            if ($blockParent.children('.jsElementParent').length >= elementLimit) {
                $addButton.prop('disabled', true);
            }

            // Scroll to new element and add to navigation
            let newElementID = $newElement.attr('id');
            window.location.hash = newElementID;
            $addButton.html(buttonText.addElement).prop('disabled',false);
            let $el = $('#page-edit-nav').find('.jsPageSubBlock-'+blockKey).append(
                '<a class="nav-link ml-3 my-1" href="#'+newElementID+'">New (Element)</a>'
                );
        }
    });
});

// Delete page element
$('.jsBlockParent').on('click', '.jsDeleteBlockElement', function (e) {
    e.preventDefault();
    if (!confirmDeletePrompt('Are you sure you want to delete this element?')) {
        return;
    }
    var blockElementId = $(this).data('element-id') || 'x';
    var $element = $(this).parents('.jsElementParent');
    let $blockParent = $(this).parents('.jsBlockParent');
    let elementLimit = $blockParent.find('.jsAddElement').data('element-count-limit') || 100;
    var removeElement = function() {
        $element.slideUp('normal', function () {
            $element.remove();
        });

        // If element count is now within limits for this block, enable add element button
        if ($blockParent.children('.jsElementParent').length >= elementLimit) {
            $blockParent.find('.jsAddElement').prop('disabled', false);
        }
    }
    var postData = {id: blockElementId}
    postData[pitonConfig.csrfTokenName] = pitonConfig.csrfTokenValue;

    if (!isNaN(blockElementId)) {
        $.ajax({
            url: '/admin/page/element/delete',
            method: "POST",
            data: postData,
            success: function (r) {
                if (r.status === 'success') {
                    removeElement();
                }
            },
            error: function(r) {
                console.log('error')
                console.log(r)
            }
        });
    } else {
        removeElement();
    }
});

// Toggle element selector
$('.jsBlockParent').on('click', '.jsElementType input[type="radio"]', function() {
    var selectedTypeOption = $(this).data('enable-input');
    $('.jsElementOption.d-block').toggleClass('d-block d-none');

    if (selectedTypeOption === 'image' || selectedTypeOption === 'hero') {
        $(this).parents('.jsElementType').siblings('.jsMediaInput').toggleClass('d-none d-block');
        return;
    }
    if (selectedTypeOption === 'embedded') {
        $(this).parents('.jsElementType').siblings('.jsEmbeddedInput').toggleClass('d-none d-block');
        return;
    }
    if (selectedTypeOption === 'gallery' || selectedTypeOption === 'collection') {
        $(this).parents('.jsElementType').siblings('.jsCollectionInput').toggleClass('d-none d-block');
        return;
    }
});

$('.block-element-wrapper').on('change', 'input[name^=element_image_path]', function() {
    if ($(this).val() === '') {
    $(this).parents('.jsMediaInput').find('img').attr('src','');
    }
});

$('.block-element-wrapper').on('click', '.jsSelectMediaFile', function() {
    let $input = $(this).parents('.input-group').find('input');
    let $img = $(this).parents('.jsMediaInput').find('img');

    $('#mediaModal').on('click', 'img', function() {
        $input.val($(this).attr('src'));
        $img.attr('src', $(this).attr('src')).removeClass('d-none');
        $('#mediaModal').modal('hide');
    });

    $.ajax({
        url: '/admin/media/get',
        method: "GET",
        success: function (r) {
            $('#mediaModal').find('.modal-body').html(r.html).end().modal();
        }
    });
});