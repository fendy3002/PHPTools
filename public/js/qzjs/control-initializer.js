var Qz = Qz || {};
Qz.Initializer = Qz.Initializer || {};

// section Qz.Initializer.setting
(function (root, $) {
    var setting = {};
    setting.confirmation = Qz.Object.property(true);

    root.setting = setting;
}(Qz.Initializer, jQuery));

// section Qz.Initializer.initialize
(function (root, $) {
	var initializeConfirmation = function(){
		var primaryHandler = function () {
			if (Qz.Confirmation.modal()) {
				if (!Qz.Confirmation.modal().data('bs.modal') || !Qz.Confirmation.modal().data('bs.modal').isShown) {
					$("[data-confirmation-role='show-button'][data-confirmation-primary='true']").first().trigger("click");
				}
			}
		};
		var initialize = function () {
			var $buttons = $("[data-confirmation-role='show-button']:not([data-confirmation-initialized])");
			for (var i = 0; i < $buttons.length; i++) {
				Qz.Confirmation.initializeButton({
					element: $($buttons.get(i))
				});
			}
		};
	};
	
    var initialize = function(){
		
	};

    root.initialize = initialize;
}(Qz.Initializer, jQuery));