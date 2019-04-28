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
let confirmDeletePrompt = function(msg) {
    let message = msg || 'Are you sure you want to delete?';
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
    let $userRow = $(this).parent('.jsUserForm').find('div:last').clone();
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
    let blockElementId = $(this).data('element-id') || 'x';
    let $element = $(this).parents('.jsElementParent');
    let $blockParent = $(this).parents('.jsBlockParent');
    let elementLimit = $blockParent.find('.jsAddElement').data('element-count-limit') || 100;
    let removeElement = function() {
        $element.slideUp('normal', function () {
            $element.remove();
        });

        // If element count is now within limits for this block, enable add element button
        if ($blockParent.children('.jsElementParent').length >= elementLimit) {
            $blockParent.find('.jsAddElement').prop('disabled', false);
        }
    }
    let postData = {id: blockElementId}
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
    let selectedTypeOption = $(this).data('enable-input');
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

// Clear media input and remove image from page editor
$('.block-element-wrapper').on('change', 'input[name^=element_image_path]', function() {
    if ($(this).val() === '') {
    $(this).parents('.jsMediaInput').find('img').attr('src','');
    }
});

// Select media for page
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

// --------------------------------------------------------
// Message management
// --------------------------------------------------------
// +/- Message count
let changeMessageCount = (sign) => {
    let count = parseInt($('.jsMessageCount').html() || 0);
    if ('+' === sign) {
        count++
    } else {
        if (--count == 0) count = null;
    }
    $('.jsMessageCount').html(count);
}
let removeMessage = ($message, sign) => {
    $message.slideUp(() => {
        $message.remove();
    });
    changeMessageCount(sign);
}
let messageStates = {
    read: {
        button: "Mark as Unread",
        class: "btn-outline-primary",
        isRead: "Y"
    },
    unread: {
        button: "Mark as Read",
        class: "btn-primary",
        isRead: "N"
    }
}
$('.jsAllMessagesWrap').on('click', 'button', (e) => {
    e.preventDefault();
    let request = $(e.target).attr('value');
    if ('delete' === request && !confirmDeletePrompt()) {
        return false;
    }
    let isRead = $(e.target).data('isRead');
    let $message = $(e.target).parents('.jsMessageWrap');
    // jQuery ignores the button value, so append that to post data
    let postData = $message.find('form').serialize() + '&button=' + encodeURI($(e.target).attr('value'));
    $.ajax({
        url: '/admin/message/save',
        method: "POST",
        data: postData,
        success: (r) => {
            console.log(r)
            if (r.status === "success" && 'delete' === request) {
                removeMessage($message);
            } else if (r.status === "success" && "toggle" === request) {
                $clonedMessage = $message.clone();
                if (isRead === 'Y') {
                    $clonedMessage.find('button[value=toggle]')
                        .data('isRead', messageStates.unread.isRead)
                        .html(messageStates.unread.button)
                        .toggleClass(messageStates.read.class+' '+messageStates.unread.class);
                    $('.jsUnreadMessages').prepend($clonedMessage);
                    removeMessage($message, '+');
                } else {
                    $clonedMessage.find('button[value=toggle]')
                        .data('isRead', messageStates.read.isRead)
                        .html(messageStates.read.button)
                        .toggleClass(messageStates.unread.class+' '+messageStates.read.class);
                        $('.jsReadMessages').prepend($clonedMessage);
                        removeMessage($message);
                }
            }
        },
        error: (r) => {
            console.log('There was an error submitting the form. Contact your administrator.')
        }
    });
});
