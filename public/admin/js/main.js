// --------------------------------------------------------
// Misc Statements
// --------------------------------------------------------

$('.jsDatePicker').datepicker({
    format: pitonConfig.dateFormat,
    weekStart: pitonConfig.weekStart,
    todayHighlight: true,
    orientation: 'bottom',
    autoclose: true,
    clearBtn: true
});

// Delete confirm prompt
let confirmDeletePrompt = function (msg) {
    let message = msg || 'Are you sure you want to delete?';
    return confirm(message);
}

$('body').on('click', '.jsDeleteConfirm', function () {
    return confirmDeletePrompt();
});

// --------------------------------------------------------
// User Management
// --------------------------------------------------------

// Add user row
let userIdx = 0;
$('.jsAddUserRow').on('click', function () {
    let $userRow = $('.jsUserForm').find('.jsUser:first').clone();
    $userRow.find('input[name^=user_id], input[name^=email]').val('').prop('required',false);
    $userRow.find('input[type="checkbox"]').attr('checked',false).attr('id', function(i, val) {
        return val + '-' + userIdx;
    });
    $userRow.find('input').each(function() {
        $(this).attr('name', function(i, val) {
            return val.slice(0, -1) + '-' + userIdx + val.slice(-1);
        });
    });
    $userRow.find('label').attr('for', function(i, val) {
        return val + '-' + userIdx;
    });
    userIdx++;
    $('.jsUser').parent().append($userRow);
});

// --------------------------------------------------------
// Page Management
// --------------------------------------------------------
// Add Page Block Element
$('.jsAddElement').on('click', function () {
    let $addButton = $(this);
    let buttonText = {
        addElement: "Add Element",
        loading: `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span class="sr-only">Loading...</span>Loading...`
    }
    $addButton.prop('disabled', true).html(buttonText.loading);
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
        url: pitonConfig.routes.adminNewElement,
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
            $newElement.find('.jsMDE').each(function () {
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
            $addButton.html(buttonText.addElement).prop('disabled', false);
            let $el = $('#page-edit-nav').find('.jsPageSubBlock-' + blockKey).append(
                '<a class="nav-link small-sidebar-text" href="#' + newElementID + '">New</a>'
            );
        }
    });
});

// Delete page element
$('.jsBlockParent').on('click', '.jsDeleteBlockElement', function (e) {
    e.preventDefault();
    if (!confirmDeletePrompt('Are you sure you want to delete this element?')) {
        return false;
    }
    let blockElementId = $(this).data('element-id');
    let $element = $(this).parents('.jsElementParent');
    let $blockParent = $(this).parents('.jsBlockParent');
    let elementLimit = $blockParent.find('.jsAddElement').data('element-count-limit') || 100;
    let removeElement = function () {
        $element.slideUp('normal', function () {
            $('#page-edit-nav').find('a[href="#page-element-'+blockElementId+'"]').remove();
            $element.remove();
        });

        // If element count is now within limits for this block, enable add element button
        if ($blockParent.children('.jsElementParent').length >= elementLimit) {
            $blockParent.find('.jsAddElement').prop('disabled', false);
        }
    }
    let postData = {
        id: blockElementId
    }
    postData[pitonConfig.csrfTokenName] = pitonConfig.csrfTokenValue;

    if (!isNaN(blockElementId)) {
        $.ajax({
            url: pitonConfig.routes.adminDeleteElement,
            method: "POST",
            data: postData,
            success: function (r) {
                if (r.status === 'success') {
                    removeElement();
                }
            },
            error: function (r) {
                console.log('PitonCMS: There was an error deleting this element. Contact your administrator.')
            }
        });
    } else {
        removeElement();
    }
});

// Toggle element selector
$('.jsBlockParent').on('click', '.jsElementType input[type="radio"]', function () {
    let selectedTypeOption = $(this).data('enable-input');
    let $elementParent = $(this).parents('.jsElementParent');
    $elementParent
        .find('.jsElementOption.d-block').toggleClass('d-block d-none')
        .find('select').prop('required', false);

    if (selectedTypeOption === 'image' || selectedTypeOption === 'hero') {
        $(this).parents('.jsElementType').siblings('.jsMediaInput').toggleClass('d-none d-block');
        return;
    }
    if (selectedTypeOption === 'embedded') {
        $(this).parents('.jsElementType').siblings('.jsEmbeddedInput').toggleClass('d-none d-block');
        return;
    }
    if (selectedTypeOption === 'collection') {
        $(this).parents('.jsElementType').siblings('.jsCollectionInput').toggleClass('d-none d-block').find('select').prop('required', true);
        return;
    }
    if (selectedTypeOption === 'gallery') {
        $(this).parents('.jsElementType').siblings('.jsGalleryInput').toggleClass('d-none d-block').find('select').prop('required', true);
        return;
    }
});

// --------------------------------------------------------
// Media Management
// --------------------------------------------------------

// Clear media input and remove image display
$('.jsEditPageContainer').on('click', '.jsMediaClear', function () {
    $(this).parents('.jsMediaInput').find('.jsMediaInputField').val('').trigger("input");
});

// Listen for media input changes by user to update media img display
$('.jsEditPageContainer').on('input', '.jsMediaInputField', function() {
    let src = $(this).val();
    let $img = $(this).parents('.jsMediaInput').find('img');
    $img.attr('src', src);
    if (src.length > 0) {
        $img.removeClass('d-none').addClass('d-block');
    } else {
        $img.removeClass('d-block').addClass('d-none');
    }
})

// Select media for page element
$('.jsEditPageContainer').on('click', '.jsSelectMediaFile', function () {
    let $input = $(this).parents('.jsMediaInput').find('input.jsMediaInputField');

    $('#mediaModal').on('click', 'img', function () {
        $input.val($(this).data('source')).trigger("input");
        $('#mediaModal').modal('hide');
    });

    $.ajax({
        url: pitonConfig.routes.adminGetMedia,
        method: "GET",
        success: function (r) {
            $('#mediaModal').find('.modal-body').html(r.html).end().modal();
        }
    });
});

// --------------------------------------------------------
// Message management
// --------------------------------------------------------
// +/- Message count
let changeMessageCount = (sign) => {
    if (sign) {
        let count = parseInt($('.jsMessageCount').html() || 0);
        if ('+' === sign) {
            count++
        } else if ('-' === sign) {
            if (--count == 0) count = null;
        }
        $('.jsMessageCount').html(count);
    }
}
let removeMessage = ($message, sign) => {
    $message.slideUp(function () {
        $message.remove();
    });
    changeMessageCount(sign);
}
$('.jsMessageWrap').on('click', 'button', function (e) {
    e.preventDefault();
    let request = $(e.target).attr('value');
    if ('delete' === request && !confirmDeletePrompt()) {
        return false;
    }
    let isRead = $(e.target).data('isRead');
    let $message = $(e.target).parents('.jsMessageWrap');
    let postData = $message.find('form').serialize();
    $.ajax({
        url: (request == 'delete') ? pitonConfig.routes.adminDeleteMessage : pitonConfig.routes.adminSaveMessage,
        method: "POST",
        data: postData,
        success: function (r) {
            if (r.status === "success") {
                if ('toggle' === request) {
                    let updown = (isRead === 'Y') ? '+' : '-';
                    removeMessage($message, updown);
                } else if ('delete' === request) {
                    let updown = (isRead === 'N') ? '-' : undefined;
                    removeMessage($message, updown);
                }
            }
        },
        error: function (r) {
            console.log('PitonCMS: There was an error submitting the form. Contact your administrator.')
        }
    });
});

// --------------------------------------------------------
// Media management
// --------------------------------------------------------
// Append category input to media categories form
$('form.jsEditMediaCategory').on('focus', 'input[name^=category]:last', function () {
    let $newInputRow = $(this).parents('.jsMediaCategory').clone();
    $newInputRow.find('input[name^=category]').val('');
    $(this).parents('form.jsEditMediaCategory').append($newInputRow);
});

// Delete category from media categories form
$('.jsMediaCategory').on('click', 'button[type=button]', function (e) {
    e.preventDefault();
    if (!confirmDeletePrompt()) {
        return false;
    }
    let $category = $(e.target).parents('.jsMediaCategory');
    let postData = {
        "id": $(e.target).attr('value')
    }
    postData[pitonConfig.csrfTokenName] = pitonConfig.csrfTokenValue;
    $.ajax({
        url: pitonConfig.routes.adminDeleteMediaCategory,
        method: "POST",
        data: postData,
        success: function (r) {
            if (r.status === "success") {
                $category.fadeOut(function () {
                    $(this).remove();
                });
            }
        },
        error: function (r) {
            console.log('PitonCMS: There was an error submitting the form. Contact your administrator.')
        }
    });
});

// Show user that a media input changed and needs to be saved
$('.jsMediaCard form').each(function (i) {
    let $form = $(this);
    let $saveButton = $form.find('button[value=save]');
    $form.on('input', function () {
        if ($saveButton.hasClass('btn-primary')) return;
        $saveButton.removeClass('btn-outline-primary').addClass('btn-primary');
    });
});

// Save media form edits when viewing all media
$('.jsMediaCard').on('click', 'button', function (e) {
    e.preventDefault();
    let $button = $(e.target);
    let $medium = $(e.target).parents('.jsMediaCard');
    if ('delete' === $button.attr('value') && !confirmDeletePrompt()) {
        return false;
    }
    // jQuery ignores the button value, so append that to post data
    let postData = $button.parents('form').serialize();
    $.ajax({
        url: ('delete' === $button.attr('value')) ? pitonConfig.routes.adminDeleteMedia : pitonConfig.routes.adminSaveMedia,
        method: "POST",
        data: postData,
        success: function (r) {
            if ('delete' === $button.attr('value') && r.status === "success") {
                $medium.fadeOut(function () {
                    $(this).remove();
                });
            } else if ("save" === $button.attr('value') && r.status === "success") {
                $button.removeClass('btn-primary').addClass('btn-outline-primary');
            }
        },
        error: function (r) {
            console.log('PitonCMS: There was an error submitting the form. Contact your administrator.')
        }
    });
});



// Upload media action
$('.jsMediaUploadForm').on('submit', function (e) {
    let processingText = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    <span class="sr-only">Loading...</span>Uploading and optimizing media...`;
    $(this).find('button').prop('disabled', true).html(processingText);
});

// Enable Popovers
$(function () {
    $('[data-toggle="popover"]').popover({
        container: 'html',
    })
})
$('.popover-dismiss').popover({
    trigger: 'focus',

})