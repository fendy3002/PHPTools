"use strict";

/*
=====
string
=====
*/
(function ($) {
    String.prototype.toFixed = function (decimalLength) {
        var number = Number(this);

        if (isNaN(number)) {
            return 0;
        }
        else {
            return number.toFixed(decimalLength);
        }
    };
    String.prototype.round = function (decimalLength) {
        var number = Number(this);

        if (isNaN(number)) {
            return 0;
        }
        else {
            return Number(number.toFixed(decimalLength));
        }
    };
    Number.prototype.round = function (decimalLength) {
        return Number(this.toFixed(decimalLength));
    };
    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
})(jQuery);





/*
=====
JQuery
=====
*/
(function ($) {
    $.fn.hasScrollBar = function () {
        return this.get(0).scrollHeight > this.height();
    }

    $.fn.quickOuterWidth = function () {
        var elem = this.get(0);
        if (window.getComputedStyle) {
            var computedStyle = window.getComputedStyle(elem, null);
            return elem.offsetWidth + (parseInt(computedStyle.getPropertyValue('margin-left'), 10) || 0) + (parseInt(computedStyle.getPropertyValue('margin-right'), 10) || 0);
        } else {
            return elem.offsetWidth + (parseInt(elem.currentStyle["marginLeft"]) || 0) + (parseInt(elem.currentStyle["marginRight"]) || 0);
        }
    };

})(jQuery);


/*
=====
Knockout
=====
*/

(function ($) {
    //deprecated
    ko.bindingHandlers.select2 = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var val = valueAccessor();
            $(element).select2(val);
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).select2('destroy');
            });
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            $(element).trigger('change');
        }
    };
})(jQuery);