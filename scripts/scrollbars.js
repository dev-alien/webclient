$(function() {
    $('.conversation_box_container').perfectScrollbar();
    $('.conversation_box_textarea').perfectScrollbar();
    $('#contacts_container').perfectScrollbar();
});

var unFocus = function () {
    if (document.selection) {
        document.selection.empty()
    } else {
        window.getSelection().removeAllRanges()
    }

}