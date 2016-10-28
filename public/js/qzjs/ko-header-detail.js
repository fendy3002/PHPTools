var Qz = Qz || {};
Qz.HeaderDetail = Qz.HeaderDetail || {};

// the detail, used as record model
// section Qz.HeaderDetail.Detail
(function (root, $) {
    var detail = function (newDetail) {
        var self = this;
        //populate our model with the initial data

        self.update(newDetail);
    };
    detail.prototype.header = ko.observable();
    detail.prototype.updateFieldMapper = [];
    detail.prototype.clone = function () {
        return new this.constructor(ko.toJS(this));
    };
    detail.prototype.update = function (newDetail) {
        for (var i = 0; i < this.updateFieldMapper.length; i++) {
            var fieldName = this.updateFieldMapper[i];
            if (typeof (Qz.GetFieldValue(this, fieldName)) == 'function') {
                Qz.GetFieldValue(this, fieldName)(
                    Qz.GetFieldValue(newDetail, fieldName)
                );
            }
            else {
                Qz.SetFieldValue(
                    this,
                    fieldName,
                    Qz.GetFieldValue(newDetail, fieldName)
                );
                this[fieldName] = newDetail[fieldName];
            }
        }
    };
    detail.prototype.addField = function (fieldName, fieldValue) {
        if (fieldValue) {
            Qz.Object.SetFieldValue(this, fieldName, fieldValue);
        }
        else {
            Qz.Object.SetFieldValue(this, fieldName, ko.observable());
        }
        this.updateFieldMapper.push(fieldName);
    };
    detail.prototype.addFields = function (fields) {
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            if (typeof (field == 'string')) {
                this.addField(field);
            }
            else {
                this.addField(field[0], field[1]);
            }
        }
    };

    root.detail = detail;
}(Qz.HeaderDetail, jQuery));


// the header, used to be bounded to view
// section Qz.HeaderDetail.Header
(function (root, $) {
    var header = function (typeOfDetail) {
        var self = this;
        self.details = ko.observableArray();
        self.current = ko.observable(); // current edited detail (non-committed)

        self.emptyDetailParameter = {};
        self.typeOfDetail = typeOfDetail;
        self.setCurrent = function (d) {
            self.current(d);
        };
        self.remove = function (d) {
            self.details.remove(d);
        };
        self.addEmpty = function () {
            var model = new self.typeOfDetail(self.emptyDetailParameter);
            model.header(self);
            self.setCurrent(model);
        };
        self.pushEmpty = function () {
            var model = new self.typeOfDetail(self.emptyDetailParameter);
            model.header(self);
            self.details.push(model);
        };
        self.pushIfEmpty = function () {
            if (self.details().length <= 0) {
                var model = new self.typeOfDetail(self.emptyDetailParameter);
                model.header(self);
                self.details.push(model);
            }
        };
        self.saveAdded = function () {
            self.details.push(self.current());
        };
        self.removeAllDetail = function () {
            self.details.removeAll();
        };
        self.initializeDetail = function (data) {
            self.removeAllDetail();
            for (var i = 0; i < data.length; i++) {
                var model = new self.typeOfDetail(data[i]);
                model.header(self);
                self.details.push(model);
            }
        };
        self.addMany = function (data) {
            if (!$.isArray(data)) {
                return;
            }
            var primitiveArray = self.details();
            for (var i = 0; i < data.length; i++) {
                var model = new self.typeOfDetail(data[i]);
                model.header(self);
                primitiveArray.push(model);
            }
            self.details.valueHasMutated();
        };

        self.detailTrigger = function (changes) {
        };
        self.details.subscribe(function (changes) {
            self.detailTrigger(changes);
        }, null, "arrayChange");
    };
    root.header = header;
}(Qz.HeaderDetail, jQuery));

// to change requiry in draft mode
// section Qz.HeaderDetail.toggleRequired
(function (root, $) {
    var toggleRequired = function (isEnabled) {
        if (!isEnabled) {
            $("label.required").removeClass("required").attr("data-required-disabled", true);
            $("select[required]").removeAttr("required").attr("data-required-disabled", true);
            $("input[required]").removeAttr("required").attr("data-required-disabled", true);
            $("textarea[required]").removeAttr("required").attr("data-required-disabled", true);
        }
        else {
            $("label[data-required-disabled]").addClass("required").removeAttr("data-required-disabled");
            $("input[data-required-disabled]").attr("required", true).removeAttr("data-required-disabled");
            $("select[data-required-disabled]").attr("required", true).removeAttr("data-required-disabled");
            $("textarea[data-required-disabled]").attr("required", true).removeAttr("data-required-disabled");
        }
    }
    root.toggleRequired = toggleRequired;
}(Qz.HeaderDetail, jQuery));


// section Qz.HeaderDetail.uploadDetailModal
(function (root, $) {
    var uploadDetailModal = function (options) {
        var cur = $.extend({
            modal: $("<div></div>"),
            url: "",
            templateUrl: "",
            viewModel: {},
            postFileName: "postedFile"
        }, options);

        var templateLinkTemplate = "";
        if (cur.templateUrl) {
            templateLinkTemplate =
                "                    <div class=\"row pad\">" +
                "                        <label class=\"control-label col-sm-4\">Template</label>" +
                "                        <div class=\"col-sm-8\">" +
                "                            <a class=\"btn btn-default\" href=\"" + cur.templateUrl + "\"><span class=\"glyphicon glyphicon-save\"></span> Click to download</a>" +
                "                        </div>" +
                "                    </div>";
        }

        var template = 
            "<div class=\"modal-dialog modal-lg\">" +
            "    <div class=\"modal-content\">" +
            "        <div class=\"modal-header\">" +
            "            <button type=\"button\" class=\"close\" data-modal-role=\"dismiss\" aria-hidden=\"true\">&times;</button>" +
            "            <h4 class=\"modal-title\">Import</h4>" +
            "        </div>" +
            "        <div class=\"modal-body\">" +
            "            <div class=\"container\">" +
            "                <form class=\"form-horizontal\" role=\"form\" action=\""+ cur.url +"\"" +
            "                        method=\"post\"" +
            "                        enctype=\"multipart/form-data\">" +
            templateLinkTemplate +
            "                    <div class=\"row pad\">" +
            "                        <label class=\"control-label col-sm-4\">File</label>" +
            "                        <div class=\"col-sm-8\">" +
            "                            <input type=\"file\" name=\"" + cur.postFileName + "\" style=\"margin-top: 8px;\" />" +
            "                        </div>" +
            "                    </div>" +
            "                    <div class=\"row pad\">" +
            "                        <label class=\"control-label col-sm-4\">Message</label>" +
            "                        <div class=\"col-sm-8\">" +
            "                            <textarea name=\"Message\" class=\"form-control\" rows=\"5\" readonly></textarea>" +
            "                        </div>" +
            "                    </div>" +
            "                    <div class=\"row text-right\">" +
            "                        <button class=\"btn btn-primary\" type=\"button\" data-role=\"upload-line-button\">" +
            "                            <span class=\"glyphicon glyphicon-ok\"></span>" +
            "                        </button>" +
            "                        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">" +
            "                            <span class=\"glyphicon glyphicon-remove\"></span>" +
            "                        </button>" +
            "                    </div>" +
            "                </form>" +
            "            </div>" +
            "        </div>" +
            "    </div>" +
            "</div>";

        var $template = $(template);
        var $modal = cur.modal;
        var viewModel = cur.viewModel;
                
        var $uploadLineButton = $template.find("button[data-role='upload-line-button']");
        $uploadLineButton.on("click", function () {
            var $form = $(this).closest("form");
            var $message = $form.find("textarea[name='Message']");
            var formData = new FormData($form.get(0));
            $.ajax({
                url: $form.attr("action"),  //server script to process data
                type: 'POST',
                datatype: 'json',
                success: function (data) {
                    var jsonData = data;
                    var detailsData = JSON.parse(jsonData.Data);
                    viewModel.addMany(detailsData);
                    $form.get(0).reset();
                    $form.closest(".modal").modal('hide');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status == 500 && jqXHR.responseJSON) {
                        var jsonResult = jqXHR.responseJSON;
                        $message.val(jsonResult.Message);
                    }
                    else {
                        $message.val(jqXHR.status + " - " + jqXHR.responseText);
                    }
                },
                // Form data
                data: formData,
                //Options to tell JQuery not to process data or worry about content-type
                cache: false,
                contentType: false,
                processData: false
            });
        });

        $modal.append($template);
    }
    root.uploadDetailModal = uploadDetailModal;
}(Qz.HeaderDetail, jQuery));