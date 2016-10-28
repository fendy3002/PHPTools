"use strict"

var Qz = Qz || {};
Qz.Confirmation = Qz.Confirmation || {};

// section Qz.Confirmation.modal
(function (root, $) {
    var innerModal = null;
    var modal = function (source) {
        if (arguments.length > 0) {
            innerModal = source;
        }
        else {
            if (innerModal == null) { return null; }
            else {
                return $(innerModal);
            }
        }
    };

    root.modal = modal;
}(Qz.Confirmation, jQuery));

// section Qz.Confirmation.generateModal
(function (root, $) {
    var generateModal = function (option) {

        if (root.Confirmation.modal() == null) {
            var $modal = $("<div class=\"modal fade\" role=\"dialog\" aria-hidden=\"true\"></div>");
            var modal = $modal.get(0);
            modal.currentState = BMG.Observable('default');

            // dialog
            var $modalDialog = $("<div class=\"modal-dialog\"></div>");
            $modalDialog.appendTo($modal);

            // content
            var $modalContent = $("<div class=\"modal-content panel-" + modal.currentState + "\"></div>");
            $modalContent.appendTo($modalDialog);

            // header
            var $modalHeader = $("<div class=\"modal-header panel-heading\">" +
                    "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>" +
                    "</div>");
            $modalHeader.appendTo($modalContent);
            var $modalTitle = $("<h4 class=\"modal-title\"></h4>");
            $modalTitle.appendTo($modalHeader);

            // body
            var $modalBody = $("<div class=\"modal-body\"></div>");
            $modalBody.appendTo($modalContent);

            var $spanContent = $("<span>Are you sure?</span>");
            $spanContent.appendTo($modalBody);

            // footer
            var $modalFooter = $("<div class=\"modal-footer\"></div>");
            $modalFooter.appendTo($modalContent);

            // footer buttons
            var $okButton = $("<button type='button' class='btn btn-primary'><span class='glyphicon glyphicon-ok'></span></button");
            var $cancelButton = $("<button type='button' class='btn btn-danger' data-dismiss='modal'><span class='glyphicon glyphicon-remove'></span></button");
            $okButton.appendTo($modalFooter);
            $cancelButton.appendTo($modalFooter);


            $okButton.one('click', function () {
                var $okButton = $(this);
                var $form = $(modal.form());
                if ($okButton.attr('name') && $okButton.val()) {
                    $form.append($("<input type='hidden' value='" + $okButton.val() + "' name='" + $okButton.attr('name') + "' />"));
                }
                modal.form().submit();
            });

            modal.setButton = function ($button) {
                $okButton.attr('name', $button.attr('name'));
                $okButton.attr('value', $button.attr('value'));
            };

            modal.form = BMG.Observable();

            modal.content = function (content) {
                if (arguments.length > 0) {
                    $spanContent.html(content);
                }
                else {
                    return $spanContent.html();
                }
            };
            modal.state = function (state) {
                if (arguments.length > 0) {
                    modal.currentState = state;
                    $modalContent.attr('class', 'modal-content panel-' + state);
                }
                else {
                    return modal.currentState;
                }
            };

            modal.modalTitle = function (title) {
                if (arguments.length > 0) {
                    $modalTitle.html(title);
                }
                else {
                    return $modalTitle.html();
                }
            };

            modal.showModal = function () {
                $modal = $(this);

                $modal.modal({
                    backdrop: 'static',
                    keyboard: true
                });
                setTimeout(function () {
                    $okButton.focus();
                }, 200);
            };

            $(document.body).append($modal);
            root.Confirmation.modal(modal);
        }
    };

    root.generateModal = generateModal;
}(Qz.Confirmation, jQuery));

// section Qz.Confirmation.initializeButton
(function (root, $) {
    var initializeButton = function (option) {
        var cur = $.extend({
            element: $('<div></div>')
        }, option);

        var $element = cur.element;
        var $form = $element.closest('form');
        var form = $form.get(0);
        $element.get(0).form = form;

        $element.on('click', function () {
            var $element = $(this);
            var $form = $(this.form);
            var showModal = true;
            var validate = $element.attr('data-confirmation-validate');
            if (validate != "false" && $form.length > 0) {
                showModal = $form.valid();
            }
            if (showModal) {
                var title = $element.attr('data-confirmation-title');
                var state = $element.attr('data-confirmation-state');
                var content = $element.attr('data-confirmation-content');
                var $confirmationModal = root.Confirmation.modal();
                var confirmationModal = $confirmationModal.get(0);
                if (content) {
                    $confirmationModal.content(content);
                }

                confirmationModal.setButton($element);
                confirmationModal.modalTitle(title);
                confirmationModal.state(state);
                confirmationModal.form(form);
                confirmationModal.showModal();
            }
        });
        $element.attr('data-confirmation-initialized', 'true');
    };

    root.initializeButton = initializeButton;
}(Qz.Confirmation, jQuery));

// section Qz.Confirmation.initialize
(function (root, $) {
    var primaryHandler = function () {
        if (root.Confirmation.modal()) {
            if (!root.Confirmation.modal().data('bs.modal') || !root.Confirmation.modal().data('bs.modal').isShown) {
                $("[data-confirmation-role='show-button'][data-confirmation-primary='true']").first().trigger("click");
            }
        }
    };
    var initialize = function () {
        var $buttons = $("[data-confirmation-role='show-button']:not([data-confirmation-initialized])");
        for (var i = 0; i < $buttons.length; i++) {
            root.Confirmation.initializeButton({
                element: $($buttons.get(i))
            });
        }
    };

    root.initialize = initialize;
}(Qz.Confirmation, jQuery));