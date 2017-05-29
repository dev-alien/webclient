jQuery(function($){
    $(".placholder_div").focusout(function(){
        var element = $(this);
        if (!element.text().replace(" ", "").length) {
            element.empty();
        }
    });
});