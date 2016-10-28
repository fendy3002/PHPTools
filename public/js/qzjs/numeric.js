"use strict";

var Qz = Qz || {};
Qz.Numeric = Qz.Numeric || {};

// section Qz.Numeric.initInput
(function (root, $) {
	var setValue = function($element, $numElem){
		$numElem.removeClass("has-error");
		if(Qz.String.isNullOrWhitespace($element.val())){
			$numElem.val("0");
		}
		else if(!Qz.String.isNumeric($element.val())){
			$numElem.val("NaN");
			$numElem.addClass("has-error");
		}
		else {
		    var decimalLength = $element.attr("data-decimal-length");
		    var text = Qz.Format.numberWithCommas($element.val(), { decimalLength: decimalLength });
			$numElem.val(text);
		}
	};
	var initEach = function ($element){
		var $numElem = $element.clone();
		$element.data("numElem", $numElem);
		$numElem.data("elem", $element);

		$numElem.attr("name", "");
		$numElem.insertBefore($element);

		$element.removeClass("numeric-input");
		$element.addClass("numeric-input");
		$numElem.removeClass("numeric-input");
		$numElem.addClass("numeric-input");

		$element.on("blur", function(){
			setValue($element, $numElem);
			$element.hide();
			$numElem.show();
		});
		$element.on("change", function(){
			setValue($element, $numElem);
		});
		$element.on("keydown", function(e){
			if(e.keyCode == 46){
				if(Qz.Web.isCaretPositionLast(this)){
					this.value = this.value.slice(0, -1);
				}
			}
		});
		$numElem.on("focus", function(){
			$element.show();
			$element.focus();
			$numElem.hide();
		});

		setValue($element, $numElem);
		$element.hide();
	};
    var initInput = function (option) {
		var cur = $.extend(
			{
				element: $("<div></div>")
			}
			, option
		);
		if(cur.element.length > 1){
			for(var i = 0; i<cur.element.length; i++){
				initEach(cur.element.eq(i));
			}
		}
		else{
			initEach(cur.element);
		}
	};

    root.initInput = initInput;
}(Qz.Numeric, jQuery));
