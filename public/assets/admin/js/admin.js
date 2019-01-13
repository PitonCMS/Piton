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
// Add Page Section Element
$('.jsAddElement').on('click', function() {
    var $sectionParent = $(this).parent('.jsSectionParent');
    var elementType = $(this).data('element-type');
    var sectionKey = $(this).data('section-key');
    var elementTypeOptions = $(this).data('element-type-options');
    var postData = {
            sectionKey: sectionKey,
            elementType: elementType,
            elementTypeOptions: elementTypeOptions
    }
    postData[pitonConfig.csrfTokenName] = pitonConfig.csrfTokenValue;

    $.ajax({
        url: '/admin/page/element/new',
        method: "POST",
        data: postData,
        success: function (r) {
            var $newElement = $(r.html);

            // Increment element sort value
            var lastElementSortValue = $sectionParent.find('.jsElementParent:last-child .jsElementSortValue').val();

            if (!isNaN(lastElementSortValue)) {
                lastElementSortValue++;
            } else {
                lastElementSortValue = 1;
            }

            $newElement.appendTo($sectionParent);
            $newElement.find('.jsElementSortValue').val(lastElementSortValue);
            $newElement.find('.jsMDE').each(function() {
                simplemde = new SimpleMDE({
                    element: this,
                    forceSync: true
                });
            });

            // Scroll to new element and add to navigation
            var newElementID = $newElement.attr('id');
            window.location.hash = newElementID;

            var $el = $('#page-edit-nav').find('.jsPageSubSection-'+sectionKey).append(
                '<a class="nav-link ml-3 my-1" href="#'+newElementID+'">New (Element)</a>'
                );
        }
    });
});

// Delete page section element
$('.jsSectionParent').on('click', '.jsDeleteSectionElement', function (e) {
    e.preventDefault();
    if (!confirmDeletePrompt('Are you sure you want to delete this element?')) {
        return;
    }
    var sectionElementId = $(this).data('element-id') || 'x';
    var $element = $(this).parents('.jsElementParent');
    var removeElement = function() {
        $element.slideUp('normal', function () {
            $element.remove();
        });
    }
    var postData = {id: sectionElementId}
    postData[pitonConfig.csrfTokenName] = pitonConfig.csrfTokenValue;

    if (!isNaN(sectionElementId)) {
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
$('.jsSectionParent').on('click', '.jsElementType input[type="radio"]', function() {
    var selectedTypeOption = $(this).val();
    $('.jsElementOptional.d-block').toggleClass('d-block d-none');

    if (selectedTypeOption === 'image' || selectedTypeOption === 'hero') {
        $(this).parents('.jsElementType').siblings('.jsElementMediaPath').toggleClass('d-none d-block');
        return;
    }
    if (selectedTypeOption === 'video') {
        $(this).parents('.jsElementType').siblings('.jsElementVideoPath').toggleClass('d-none d-block');
        return;
    }
    if (selectedTypeOption === 'gallery') {
        $(this).parents('.jsElementType').siblings('.jsElementGallery').toggleClass('d-none d-block');
        return;
    }
    if (selectedTypeOption === 'collection') {
        $(this).parents('.jsElementType').siblings('.jsElementCollection').toggleClass('d-none d-block');
        return;
    }
});

// --------------------------------------------------------
// Setting Management
// --------------------------------------------------------
// Delete theme setting
$('.jsDeleteThemeSetting').on('click', function (e) {
    e.preventDefault();
    if (!confirmDeletePrompt('Are you sure you want to delete this setting?')) {
        return;
    }
    var settingId = $(this).data('setting-id') || 'x';
    var $setting = $(this).parents('.jsSettingParent');
    var removeElement = function() {
        $setting.slideUp('normal', function () {
            $setting.remove();
        });
    }
    var postData = { id: settingId }
    postData[pitonConfig.csrfTokenName] = pitonConfig.csrfTokenValue;

    if (!isNaN(settingId)) {
        $.ajax({
            url: '/admin/settings/theme/delete',
            method: "POST",
            data: postData,
            success: function (r) {
                if (r.status == 'success') {
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
