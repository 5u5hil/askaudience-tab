jQuery(function ($) {

    $("body").on("click", ".deleteOption", function () {
        $(this).parent().parent().parent().remove();
        indexOptions();
    })


});
jQuery(document).ready(function(){
    var notificationOpenedCallback = function (jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };


    window.plugins.OneSignal.init("575bde50-33c9-469b-8fa3-7988fbac18f3", {
        googleProjectNumber: "1000785893673",
        autoRegister: true
    },
    notificationOpenedCallback);
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


    jQuery(".createPoll ." + option + "Img").each(function (k, v) {
        jQuery(this).find("input[type='file']").attr("name", "image[" + k + "]");
        jQuery(this).find("input[type='hidden']").attr("name", "image[" + k + "]");
    });
}

