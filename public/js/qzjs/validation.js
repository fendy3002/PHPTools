var Qz = Qz || {};
Qz.Validation = Qz.Validation || {};


// section Qz.Validation.any
(function (root, $) {
    root.any = root.Linq.any;
}(Qz.Validation, jQuery));

$(function () {
    var dynamicMessage = "";
    var dynamicMessageFunc = function () { return dynamicMessage; };
    jQuery.validator.addMethod("custom", function (value, element, params) {
        dynamicMessage = params.dynamicMessage;
        return this.optional(element) || params.validation(value, element, params);
    }, dynamicMessageFunc);

    jQuery.validator.addMethod("customNotOptional", function (value, element, params) {
        dynamicMessage = params.dynamicMessage;
        return params.validation(value, element, params);
    }, dynamicMessageFunc);

    //jQuery.validator.addMethod("dateLessThanOrEqualsTo", function (value, element, params) {
    //    dynamicMessage = params.dynamicMessage;
    //    return params.validation(value, element, params);
    //}, "{0} must lesst than or equals to {1}");

    jQuery.validator.setDefaults({
        ignore: ".ignore-validation",
        focusInvalid: false,
        errorElement: "span",
        errorClass: "help-block",
        highlight: function (element, errorClass, validClass) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).closest('.form-group').removeClass('has-error');
        },
        errorPlacement: function (error, element) {
            $(error).attr("data-role", "error-placement");
            if (element.parent('.input-group').length || element.prop('type') === 'radio') {
                error.insertAfter(element.parent());
            } else if(element.prop("type") === "file"){
                error.insertAfter(element.closest("div.input-group"));
            }else {
                error.insertAfter(element);
            }
        }
    });

    $(function () {
        $("form[data-validation='jquery']").validate();
    });
});