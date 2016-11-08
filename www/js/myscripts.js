jQuery(function ($) {

    $("body").on("click", ".deleteOption", function () {
        $(this).parent().parent().parent().remove();
        indexOptions();
    })
});

function indexOptions() {
    jQuery(".createPoll .option").each(function (k, v) {
        console.log(k);
        jQuery(this).find("input[type='file']").attr("name", "image[" + k + "]");
        jQuery(this).find("input[type='hidden']").attr("name", "image[" + k + "]");

        jQuery(this).find("input[type='text']").attr("name", "option[" + k + "][text]");
        jQuery(this).find(".deleteOptionWrap").remove();

    });
}

function indexOptionsMultiChoice(option) {
    jQuery(".createPoll ." + option).each(function (k, v) {
        jQuery(this).find("input[type='text']").attr("name", "option[" + k + "][text]");
        jQuery(this).find(".deleteOptionWrap").remove();
    });


    jQuery(".createPoll ." + option+"Img").each(function (k, v) {
        jQuery(this).find("input[type='file']").attr("name", "image[" + k + "]");
        jQuery(this).find("input[type='hidden']").attr("name", "image[" + k + "]");
    });
}

