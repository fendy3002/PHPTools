var Qz = Qz || {};
Qz.Format = Qz.Format || {};

(function (root, $) {
    "use strict";
    var context = Qz.Context.formatInfo;

    // section Qz.Format.pad
    root.pad = function (num, size, text) {
        var s = num + "";
        while (s.length < size) s = text + s;
        return s;
    };

    // section Qz.Format.yesNoFromBool
    root.yesNoFromBool = function (value) {
        if (value === true) return "YES";
        else if (value == "true") return "YES";
        else return "NO";
    };

    // section Qz.Format.numberWithComma
    root.numberWithComma = function (x, opt) {
        if (typeof (x) == typeof (undefined) ||
            x == null ||
            isNaN(x)) { return x; }

        var param = $.extend({
            decimalLength: null,
            thousandSeparator: null,
            decimalSeparator: null
        }, opt);

        var decimalLength = param.decimalLength != null && !isNaN(param.decimalLength) ? param.decimalLength : context.decimalDigit();
        var thousandSeparator = param.thousandSeparator || context.thousandSeparator();
        var decimalSeparator = param.decimalSeparator || context.decimalSeparator();

        var decimalText = x['toFixed'] ? x.toFixed(param.decimalLength).toString() : x.toString();
        var parts = decimalText.split(decimalSeparator);
        parts[0] = parts[0].trim().replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
        if (decimalLength && !Qz.String.isNullOrWhitespace(decimalText)) {
            parts[1] = root.pad((parts[1] || "").trim(), decimalLength, "0").substring(0, decimalLength);
        }

        if (parts[1]) {
            return parts.join(decimalSeparator);
        }
        else {
            return parts[0];
        }
    };

    // section Qz.Format.date
    root.date = function (dateText, format) {
        var dateValue = null;
        format = format || "%1$s-%4$s-%3$s";

        if (dateText instanceof Date) {
            dateValue = dateText;
        }
        else {
            if (Qz.String.isNullOrWhitespace(dateText)) {
                return "";
            }
            dateValue = new Date(dateText);
        }

        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        var fullMonthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        return sprintf(format, dateValue.getFullYear(),
            root.pad(dateValue.getMonth() + 1, 2, "0"),
            root.pad(dateValue.getDate(), 2, "0"),
            monthNames[dateValue.getMonth()],
            fullMonthNames[dateValue.getMonth()]);
    };
    // section Qz.Format.dynamicDate
    root.dynamicDate = function (dateText, formatDelegation) {
        if (Qz.Web.Common.isNullOrWhitespace(dateText)) {
            return "";
        };

        formatDelegation = formatDelegation || function (dateValue) {
            return dateValue.getFullYear() + "-" +
                root.pad(dateValue.getMonth() + 1, 2, "0") + "-" +
                root.pad(dateValue.getDate(), 2, "0")
        };

        var dateValue = new Date(dateText);
        return formatDelegation(dateValue);
    };

    // section Qz.Format.dateTime
    root.dateTime = function (dateText, format) {
        if (Qz.Web.Common.isNullOrWhitespace(dateText)) {
            return "";
        };

        format = format || "%1$s-%4$s-%3$s %6$s:%7$s:%8$s";
        var dateValue = new Date(dateText);

        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        var fullMonthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        return sprintf(
            format, dateValue.getFullYear(),
            root.pad(dateValue.getMonth() + 1, 2, "0"),
            root.pad(dateValue.getDate(), 2, "0"),
            monthNames[dateValue.getMonth()],
            fullMonthNames[dateValue.getMonth()],
            root.pad(dateValue.getHours(), 2, "0"),
            root.pad(dateValue.getMinutes(), 2, "0"),
            root.pad(dateValue.getSeconds(), 2, "0"),
            root.pad(dateValue.getMilliseconds(), 3, "0"));
    };

    // section Qz.Format.toLowerOnChange
    root.toLowerOnChange = function (elements) {
        elements.toLowerChangeDate = new Date();
        elements.on('change', function () {
            $(this).val($(this).val().toLowerCase());

            var currentDate = new Date();
            var diffTime = currentDate.getTime() - (this.toLowerChangeDate || (this.toLowerChangeDate = new Date(1900, 1, 1))).getTime();
            if (diffTime / 1000 > 0.5) {
                this.toLowerChangeDate = currentDate;
                $(this).trigger('change');
            }
        });
        elements.attr('data-format-case-initialized', 'true');
    };

    // section Qz.Format.toUpperOnChange
    root.toUpperOnChange = function (elements) {
        elements.toUpperChangeDate = new Date();
        elements.on('change', function () {
            $(this).val($(this).val().toUpperCase());

            var currentDate = new Date();
            var diffTime = currentDate.getTime() - (this.toUpperChangeDate || (this.toUpperChangeDate = new Date(1900, 1, 1))).getTime();
            if (diffTime / 1000 > 0.5) {
                this.toUpperChangeDate = currentDate;
                $(this).trigger('change');
            }
        });
        elements.attr('data-format-case-initialized', 'true');
    };

    // section Qz.Format.escapeHtml
    (function(root, $){
        var entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#x2F;'
        };
        root.escapeHtml = function (string) {
            return String(string).replace(/[&<>"'\/]/g, function (s) {
                return entityMap[s];
            });
        };
    }(root, $));

    // section Qz.Format.decodeHtml
    (function(root, $){
        var entityMap = {
            "&amp;" : "&",
            "&lt;" : "<",
            "&gt;" : ">",
            '&quot;' : '"',
            '&#39;' : "'",
            '&#x2F;' : "/"
        };
        root.decodeHtml = function (string) {
            return String(string).replace(/[&<>"'\/]/g, function (s) {
                return entityMap[s];
            });
        };
    }(root, $));

    // section Qz.Format.escapeQueryString
    (function(root, $){
        var entityMap = {
            "&": "%26",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#x2F;'
        };
        root.escapeQueryString = function (string) {
            return String(string).replace(/[&<>"'\/]/g, function (s) {
                return entityMap[s];
            });
        };
    }(root, $));

    // section Qz.Format.decodeQueryString
    (function(root, $){
        var entityMap = {
            "&amp;" : "&",
            "&lt;" : "<",
            "&gt;" : ">",
            '&quot;' : '"',
            '&#39;' : "'",
            '&#x2F;' : "/"
        };
        root.decodeQueryString = function (string) {
            return String(string).replace(/[&<>"'\/]/g, function (s) {
                return entityMap[s];
            });
        };
    }(root, $));

    // section Qz.Format.formatElement
    (function(root, $){
        var genericFormatElement = function (className, delegation) {
            var $input = $('.' + className + ':not([' + className + '-initialized])');
            if ($input.length > 0) {
                for (var i = 0; i < $input.length; i++) {
                    var $eachInput = $($input.get(i));

                    if ($eachInput.is('input') || $eachInput.is('select')) {
                        var text = $eachInput.val();
                        var formattedText = delegation($eachInput, text);
                        $eachInput.val(formattedText);
                    }
                    else {
                        var text = $eachInput.text();
                        var formattedText = delegation($eachInput, text);
                        $eachInput.text(formattedText);
                    }

                    $eachInput.attr(className + '-initialized', 'true');
                }
            }
        };

        var formatAccountingElement = function () {
            genericFormatElement('format-accounting',
                function ($ele, text) {
                    var format = $ele.attr('data-decimal-length');
                    if (format) {
                        return root.numberWithCommas(text, format);
                    }
                    else {
                        return root.numberWithCommas(text);
                    }
                });
        };

        var formatDateElement = function () {
            genericFormatElement('format-date',
                function ($ele, text) {
                    var format = $ele.attr('data-date-format');
                    if (format) {
                        return root.date(text, format);
                    }
                    else {
                        return root.date(text);
                    }
                });
        };

        var formatDateTimeElement = function () {
            genericFormatElement('format-date-time',
                function ($ele, text) {
                    var format = $ele.attr('data-date-time-format');
                    if (format) {
                        return root.dateTime(text, format);
                    }
                    else {
                        return root.dateTime(text);
                    }
                });
        };

        var formatDynamicDateElement = function () {
            genericFormatElement('format-dynamic-date',
                function ($ele, text) {
                    var format = $ele.attr('data-date-format');
                    if (format) {
                        return root.dynamicDate(text, new Function("return " + format + ";"));
                    }
                    else {
                        return root.dynamicDate(text);
                    }
                });
        };
        var formatCaseOnChange = function () {
            root.toUpperOnChange($('[data-format-toupper]:not([data-format-case-initialized])'));
            root.toLowerOnChange($('[data-format-tolower]:not([data-format-case-initialized])'));
        };

        root.formatElement = function () {
            formatAccountingElement();
            formatDateElement();
            formatDateTimeElement();
            formatDynamicDateElement();
            formatCaseOnChange();
        };
    }(root, $));

}(Qz.Format, jQuery));
