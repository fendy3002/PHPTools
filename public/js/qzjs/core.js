var Qz = Qz || {};
Qz.Object = Qz.Object || {};
Qz.Context = Qz.Context || {};
Qz.Collection = Qz.Collection || {};
Qz.Hooks = Qz.Hooks || {};
Qz.Commands = Qz.Commands || {};
Qz.Func = Qz.Func || {};
Qz.Linq = Qz.Linq || {};
Qz.Math = Qz.Math || {};
Qz.String = Qz.String || {};
Qz.Url = Qz.Url|| {};
Qz.Web = Qz.Web || {};

var Q = Q || {};
Q.Z = Q.Z || {};

// section Qz.Object
(function (root, $) {
    "use strict";
    // section Qz.Object.getFieldValue
    root.getFieldValue = function (field, fieldName) {
        if (!fieldName) {
            return field;
        }

        var fieldNames = fieldName.split('.');
        if (fieldNames.length > 1) {
            var subField = field;
            for (var i = 0; i < fieldNames.length; i++) {
                if (!subField) {
                    return null;
                }
                else {
                    subField = subField[fieldNames[i]];
                }
            }
            return subField;
        } else {
            return field[fieldName];
        }
    };

    // section Qz.Object.setFieldValue
    root.setFieldValue = function (field, fieldName, value) {
        if (!fieldName) {
            return;
        }

        var fieldNames = fieldName.split('.');
        if (fieldNames.length > 1) {
            var subField = field;
            var i = 0;
            for (i = 0; i < fieldNames.length - 1; i++) {
                if (!subField) {
                    subField = {};
                    subField[fieldNames[i]] = {};
                }
                else {
                    var currentSubField = subField[fieldNames[i]];
                    if (!currentSubField) {
                        subField[fieldNames[i]] = {};
                    }
                    subField = subField[fieldNames[i]];
                }
            }
            subField[fieldNames[i]] = value;
        } else {
            field[fieldName] = value;
        }
    };

    // section Qz.Object.resolveProperty
    root.resolveProperty = function (obj, propertyName) {
        var splittedPropertyName = propertyName.split('.');
        var result = obj;

        for (var i in splittedPropertyName) {
            var currentPropertyName = splittedPropertyName[i];
            result = result[currentPropertyName];
        }

        return result;
    };

    // section Qz.Object.property
    root.property = function (data) {
        var result = null;
        var observable = function (data) {
            if (arguments.length == 0) {
                return result.data;
            } else {
                result.data = data;
            }
        };

        result = observable;
        result(data);

        return result;
    };
}(Qz.Object, jQuery));

// section Qz.Context
(function (root, $) {
    "use strict";
	root.formatInfo = {
		dateFormat: Qz.Object.property("yyyy-MMM-dd"),
		decimalDigit: Qz.Object.property("2"),
		thousandSeparator: Qz.Object.property(","),
		decimalSeparator: Qz.Object.property(".")
	};
}(Qz.Context, jQuery));

// section Qz.Collection
(function (root, $) {
    // section Qz.Collection.array
    root.array = function (array) {
        var self = this;
        self.array = array;

        self.pushIfNotExists = function (item, validator) {
            var any = false;
            validator = validator || function (k, l) { return k == l; };

            for (var i = 0; i < self.Array.length; i++) {
                any = validator(self.Array[i], item);
                if (any) {
                    break;
                }
            }
            if (!any) {
                self.array.push(item);
            }
        }

        return self;
    };

    // section Qz.Collection.keyValueManager
    root.keyValueManager = function (jsonMap) {
        this.Map = jsonMap;
        return this;
    };
    root.keyValueManager.prototype.get = function (tableName, key) {
        var selectedTable = this.Map[tableName];
        if (selectedTable) {
            return selectedTable[key];
        }
        else {
            return null;
        }
    };
}(Qz.Collection, jQuery));

// section Qz.Hooks
(function (root, $) {
    "use strict";
    var hooks = [];
    // section Qz.Hooks.get
    root.get = function(){ return hooks; };
    // section Qz.Hooks.add
    root.add = function(param){
        for(var key in param){
            hooks.push({
                key : key,
                handler : param[key]
            });
        }
        root.run('qz-hooks-add', param);
    };
    // section Qz.Hooks.run
    root.run = function(query, param){
        var selectedHooks = Qz.Linq.where(hooks, function(k){
            return k.key == query;
        });
        for (var i = 0; i < selectedHooks.length; i++) {
            selectedHooks[i].handler(param);
        }
    };

    $(function(){
        Qz.Hooks.run('qz-load');
    });
}(Qz.Hooks, jQuery));

// section Qz.Commands
(function (root, $) {
    "use strict";
    var commands = [];
    // section Qz.Commands.get
    root.get = function(){
        return commands;
    };

    // section Qz.Commands.add
    root.add = function(command){
        for(var key in command){
            commands.push({
                command : key,
                handler : command[key]
            });
        }
        Qz.Hooks.run('qz-commands-add', command);
    };

    // section Qz.Commands.run
    root.run = function(query){
        var search = (query.split(':')[0] || "").trim();
        var value = (query.split(':')[1] || "").trim();
        var selectedCommands = Qz.Linq.where(commands, function(k){
            if(k.command.endsWith(':')){
                return k.command.split(':')[0] == search;
            }
            else{
                return k.command == search;
            }
        });

        for (var i = 0; i < selectedCommands.length; i++) {
            selectedCommands[i].handler(value);
        }
    };
}(Qz.Commands, jQuery));

// section Qz.Func
(function (root, $) {
    "use strict";

    // section Qz.Func.compare
    root.compare = function (funcA, funcB) {
		return '' + funcA == '' + funcB;
    };

    // section Qz.Func.executeFunction
    root.executeFunction = function (functionStr, param) {
        functionStr = (functionStr || "").trim();
        if (root.Web.Common.endsWith(functionStr, ';')) {
            functionStr = functionStr.substring(0, functionStr.length);
        };
        return new Function("param", "(" + functionStr + "(param));")(param);
    };

    // section Qz.Func.getFromString
    root.getFromString = function (functionName, context /*, args */) {
        var args = [].slice.call(arguments).splice(2);
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        return context[func];
    };

    // section Qz.Func.parseParam
    root.parseParam = function (str) {
        if (root.Web.Common.isJSONString(str)) {
            return $.parseJSON(str);
        }
        else {
            return new Function("return " + str)();
        }
    };
}(Qz.Func, jQuery));

// section Qz.Linq
(function (root, $) {
    "use strict";
    // section Qz.Linq.firstOrNull
    root.firstOrNull = function (stack, validation) {
        var result = null;
        for (var i = 0; i < stack.length; i++) {
            if (validation(stack[i])) {
                result = stack[i];
                break;
            }
        }
        return result;
    };
    // section Qz.Linq.firstOrDefault
    root.firstOrDefault = function (stack, validation, defaultValue) {
        var result = defaultValue;
        for (var i = 0; i < stack.length; i++) {
            if (validation(stack[i])) {
                result = stack[i];
                break;
            }
        }
        return result;
    };

    // section Qz.Linq.any
    root.any = function (stack, validation) {
        var isAny = false;
        for (var i = 0; i < stack.length; i++) {
            if (validation(stack[i])) {
                isAny = true;
                break;
            }
        }
        return isAny;
    };

    // section Qz.Linq.where
    root.where = function (stack, validation) {
        var resultArray = Array();
        for (var i = 0; i < stack.length; i++) {
            if (validation(stack[i])) {
                resultArray.push(stack[i]);
            }
        }
        return resultArray;
    };

    // section Qz.Linq.select
    root.select = function (stack, selection) {
        var resultArray = Array();
        for (var i = 0; i < stack.length; i++) {
            resultArray.push(selection(stack[i]));
        }
        return resultArray;
    };

    // section Qz.Linq.orderBy
    root.orderBy = function (stack, comparer) {
        if(stack == null || stack.length == 0){
            return null;
        }

        var result = stack.slice();
        var lastInsert = null;
        for (var i = 0; i < stack.length; i++) {
            var selectedIndex = i;
            for(var j = i; j < stack.length; j++) {
                if(comparer(result[j], result[selectedIndex])){
                    selectedIndex = j;
                }
            }
            var temp = result[i];
            result[i] = result[selectedIndex];
            result[selectedIndex] = temp;
        }
        return result;
    };

    // section Qz.Linq.groupBy
    root.groupBy = function (stack, field, comparer) {
        if(stack == null || stack.length == 0){
            return null;
        }

        var result = new Array();
        for (var i = 0; i < stack.length; i++) {
            var grouped = field(stack[i]);
            var isExists = false;
            for(var j = 0; j < result.length; j++){
                if(comparer(grouped, result[j].key)){
                    result[j].value.push(stack[i]);
                    isExists = true;
                    break;
                }
            }
            if(!isExists){
                var added = { 'key' : grouped, 'value' : [ stack[i] ] };
                result.push(added);
            }
        }

        return result;
    };

    // section Qz.Linq.sum
    root.sum = function (stack, field) {
        var result = 0;
		if(field == null){
			field = function(data){
				return data;
			};
		}
        for (var i = 0; i < stack.length; i++) {
            result += field(stack[i]);
        }
        return result;
    };

    // section Qz.Linq.max
    root.max = function (stack, field) {
        if(stack == null || stack.length == 0){
            return null;
        }

        if(field == null){
            field = function(data){
                return data;
            };
        }
        var result = null;
        for (var i = 0; i < stack.length; i++) {
            if(result == null){
                result = stack[i];
            }
            result = (result < stack[i]) ? stack[i] : result;
        }
        return result;
    };

    // section Qz.Linq.min
    root.min = function (stack, field) {
        if(stack == null || stack.length == 0){
            return null;
        }

        if(field == null){
            field = function(data){
                return data;
            };
        }
        var result = null;
        for (var i = 0; i < stack.length; i++) {
            if(result == null){
                result = stack[i];
            }
            result = (result > stack[i]) ? stack[i] : result;
        }
        return result;
    };

    // section Qz.Linq.mergeString
    root.mergeString = function (stack, field) {
        if(stack == null || stack.length == 0){
            return null;
        }

        if(field == null){
            field = function(data){
                return data;
            };
        }
        var result = '';
        for (var i = 0; i < stack.length; i++) {
            result += field(stack[i]);
        }
        return result;
    };

    // section Qz.Linq.enums
    root.enums = function(arr){
		var vm = {
			data: arr,
            commands: new Array(),
            result: function(){
                var data = vm.data;
                for(var i = 0; i < vm.commands.length; i++){
                    var command = vm.commands[i];
                    data = command(data);
                }
                return data;
            }
		};
		vm.sum = function(handler){
			vm.commands.push(function(data){
                return root.sum(data, handler);
            });
			return vm;
		};
		vm.max = function(field){
			vm.commands.push(function(data){
                return root.max(data, field);
            });
			return vm;
		};
		vm.min = function(field){
			vm.commands.push(function(data){
                return root.min(data, field);
            });
			return vm;
		};
		vm.where = function(handler){
			vm.commands.push(function(data){
                return root.where(data, handler);
            });
			return vm;
		};
		vm.select = function(handler){
			vm.commands.push(function(data){
                return root.select(data, handler);
            });
			return vm;
		};
		vm.orderBy = function(comparer){
			vm.commands.push(function(data){
                return root.orderBy(data, comparer);
            });
			return vm;
		};
		vm.groupBy = function(field, comparer){
			vm.commands.push(function(data){
                return root.groupBy(data, field, comparer);
            });
			return vm;
		};
		vm.any = function(handler){
			var data = vm.result();
			return root.any(data, handler);
		};
		vm.firstOrNull = function(handler){
            var data = vm.result();
			return root.firstOrNull(data, handler);
		};
		vm.firstOrDefault = function(handler, defaultValue){
            var data = vm.result();
			return root.firstOrDefault(data, handler, defaultValue);
		};

        vm.mergeString = function(field){
            var data = vm.result();
            return root.mergeString(data, field);
        };

		return vm;
	};
}(Qz.Linq, jQuery));

// section Qz.Math
(function (root, $) {
    "use strict";
    // section Qz.Math.randomInt
    // courtesy of: http://stackoverflow.com/questions/4959975/generate-random-value-between-two-numbers-in-javascript
    root.randomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
}(Qz.Math, jQuery));

// section Qz.String
(function (root, $) {
    "use strict";
    // section Qz.String.endsWith
    root.endsWith = function (str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };

    // section Qz.String.startsWith
    root.startsWith = function (str, suffix) {
        return str.indexOf(suffix) == 0;
    };

    // section Qz.String.isJSON
    root.isJSON = function (str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };

    // section Qz.String.isNullOrWhitespace
    root.isNullOrWhitespace = function (input) {
        if (input == null) return true;
        return input.replace(/\s/g, '').length < 1;
    };

    // section Qz.String.isNumeric
    root.isNumeric = function (str, decimalSeparator) {
		decimalSeparator = decimalSeparator || Qz.Context.formatInfo.decimalSeparator();
		if(decimalSeparator == "."){
        	return !isNaN(parseFloat(str)) && isFinite(str);
		}
		else{
			var num = src.replace(/\./g, '').replace(',', '.');
			return !isNaN(parseFloat(num)) && isFinite(num);
		}
    };
}(Qz.String, jQuery));



// section Qz.Url
(function (root, $) {
    "use strict";
    // section Qz.Url.rootUrl
    root.rootUrl = Qz.Object.property();
    // section Qz.Url.domainUrl
    root.domainUrl = Qz.Object.property();
}(Qz.Url, jQuery));

// section Qz.Web
(function (root, $) {
    "use strict";

    // source: http://stackoverflow.com/questions/2897155/get-cursor-position-in-characters-within-a-text-input-field
    // section Qz.Web.getCaretPosition
	root.getCaretPosition = function (oField) {
		// Initialize
		var iCaretPos = 0;

		// IE Support
		if (document.selection) {
			// Set focus on the element
			oField.focus();
			// To get cursor position, get empty selection range
			var oSel = document.selection.createRange();
			// Move selection start to 0 position
			oSel.moveStart('character', -oField.value.length);
			// The caret position is selection length
			iCaretPos = oSel.text.length;
		}

		// Firefox support
		else if (oField.selectionStart || oField.selectionStart == '0'){
			iCaretPos = oField.selectionStart;
		}

		// Return results
		return iCaretPos;
	}

    // section Qz.Web.isCaretPositionLast
	root.isCaretPositionLast = function (oField) {
		return root.getCaretPosition(oField) == oField.value.length;
	};

    // section Qz.Web.resolveTarget
    root.resolveTarget = function ($startElement, target) {
        var $computedTarget;
        if (target == 'this') {
            $computedTarget = $startElement;
        }
        else {
            try {
                $computedTarget = new Function('elem', "return $($(elem)." + target + ");")($startElement);
            } catch (ex) {
                $computedTarget = $startElement.find(target);
            }
        }
        return $computedTarget;
    };

    // section Qz.Web.lastKeyPress
    root.lastKeyPress = Qz.Object.property();

    // section Qz.Web.scopeTab
    (function (root, $) {
        var onKeyUp = function(e){
            root.lastKeyPress({
                keyCode : e.keyCode,
                shiftKey: e.shiftKey,
                ctrlKey: e.ctrlKey
            });
        };
        $(document).on("keyup", onKeyUp);

    	var focus = function($elem){
    		if($elem.is('.select2-hidden-accessible')){
    			var $focus = $elem.next('.select2-container').find('.select2-selection');
    			$focus.focus();
    			$focus.on('focus');
    		}
    		else{
    			$elem.focus();
    			$elem.on('focus');
    		}
    	};

    	var handleCrossForm = function($form, incremental){
    		var $allForm = $("form:has([data-tab-first])");
    		var nextIndex = $allForm.index($form);
    		if(nextIndex == $allForm.length - incremental){
    			nextIndex = 0;
    		}
    		else{
    			nextIndex += incremental;
    		}
    		var $focusElement = $("form").eq(nextIndex).find('[data-tab-first]');
    		focus($focusElement);
    	}
        root.scopeTab = function (elem) {
    		var $form = $(elem);
    		$form.on('keydown', '*', function(e){
                if (!e.ctrlKey && (e.keyCode == 9 || e.which == 9)) {
    				var lastKeyPress = Qz.Web.lastKeyPress();
    				if(lastKeyPress.keyCode == 120 && !e.shiftKey) // F9
    				{
    					e.preventDefault();
    					handleCrossForm($form, 1);
    				}
    				else if(lastKeyPress.keyCode == 120 && e.shiftKey) // F9
    				{
    					e.preventDefault();
    					handleCrossForm($form, -1);
    				}

    				var $this = $(this);
    				if($this.is('.select2.select2-container')){
    					$this = $this.prev('.select2-hidden-accessible');
    				}

    				if(!e.shiftKey && $this.is('[data-tab-last]')){
    					e.preventDefault();
    					focus($form.find('[data-tab-first]'));
    				}
    				else if(e.shiftKey && $this.is('[data-tab-first]')){
    					e.preventDefault();
    					focus($form.find('[data-tab-last]'));
    				}
    			}
    		});
    	};
    }(root, $));

    (function (root, $) {
        var prompt = null;
        var datalist = (function(){
            var datalist = $('<datalist id="QzCommands"></datalist>');
            $(document.body).append(datalist);
            return datalist.get(0);
        }());
        Qz.Hooks.add({
            'qz-commands-add': function(commands){
                for(var key in commands){
                    $(datalist).append("<option value='" + key + "'></option>");
                }
            }
        });

        var createPrompt = function(){
            var prompt = $('<div class="qz-command"><input class="form-control" list="QzCommands" /></div>');
            $(document.body).append(prompt);
            prompt.find("input[list='QzCommands']").after(datalist);

            prompt.find("input[list='QzCommands']").focus();
            prompt.find("input[list='QzCommands']").on('keyup', function(e){
                var enter = 13;
                if(e.keyCode == enter){
                    var value = $(this).val();
                    Qz.Commands.run(value);
                    prompt.hide();
                }
            });
            $(document).on('keyup', function(e){
                var escape = 27;
                var tab = 9;
                if(e.keyCode == escape ||
                    e.keyCode == tab){
                    prompt.hide();
                }
            });
            return prompt.get(0);
        };
        // section Qz.Web.openCommand
        root.openCommand = function(){
            if(!prompt){
                prompt = createPrompt();
            }
            else{
                $(prompt).find("input[list='QzCommands']").val('');
                $(prompt).show();
                $(prompt).find("input[list='QzCommands']").focus();
            }
        };
    }(root, $));

    root.Confirm = root.Confirm || {};
    (function (root, $) {
        var current = null;

        // section Qz.Web.Confirm.reset
        root.reset = function(ele){
            var $current = $(ele);
            var originalContent = $current.data('qz-confirm-button-original-content');
            $current.html(originalContent);
        };

        // section Qz.Web.Confirm.init
        root.init = function($element, param){
            var cur = $.extend({
                'submit' : function(){  },
                'content' : 'Confirm?'
            }, param);

            for(var i = 0; i < $element.length; i++){
                $element.eq(i).data('qz-confirm-button', cur);
            }
            $element.on('click', function(e){
                var $this = $(this);
                var param = $this.data('qz-confirm-button');

                if(current === this){
                    param.submit.apply(this, [e]);
                    current = null;
                }
                else{
                    root.reset(current);
                    current = this;
                    $this.data('qz-confirm-button-original-content', $this.html());
                    $this.html(param.content);
                }
                return false;
            });
        };

        Qz.Hooks.add({
            'qz-load' : function(){
                $(document.body).on('click', function(){
                    root.reset(current);
                    current = null;
                });
            }
        });
    }(root.Confirm, $));

    root.focus = function(key){
        var trimmed = key.trim();
        $("[data-qz-focus='" + trimmed + "']").focus();
    };

}(Qz.Web, jQuery));


// section Q.Z
(function (root, $) {
    "use strict";
    // section Q.Z.enums
	root.enums = function(data){
		return Qz.Linq.enums(data);
	};

    // section Q.Z.property
    root.property = function(){
		return Qz.Object.property;
	};

    // section Q.Z.html
	root.html = function(){
		return {
			encode: Qz.Format.escapeHtml,
			decode: Qz.Format.decodeHtml
		};
	};

    // section Q.Z.queryString
    root.queryString = function(){
		return {
			encode: Qz.Format.escapeQueryString,
			decode: Qz.Format.decodeQueryString
		};
	};
}(Q.Z, jQuery));
