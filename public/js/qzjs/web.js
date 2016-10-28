"use strict";

var Qz = Qz || {};
Qz.Web = Qz.Web || {};

// section Qz.Web.sbAdminCollapsible
(function (root, $) {
	var menuCollapsed = localStorage.sbadmin2_menuCollapsed === 'true' || false;
	var setFinalStatus = function(menuCollapsed){
		if(menuCollapsed){
			$(".sidebar").addClass("hideden-sm-md-lg");
			$("#page-wrapper").addClass("nomargin-sm-md-lg");
		}
		else{
			$(".sidebar").removeClass("hideden-sm-md-lg");
			$("#page-wrapper").removeClass("nomargin-sm-md-lg");
		}
	};

	var sbAdminCollapsible = function(element){
		$(element).off("click.sbadmin2collapse");
		$(element).on("click.sbadmin2collapse", function(){
			menuCollapsed = !menuCollapsed;
			localStorage.setItem("sbadmin2_menuCollapsed", menuCollapsed);
			if(menuCollapsed){
				$(".sidebar").add("#page-wrapper").animate({ marginLeft: "-=250px"}, 500, "swing",
					function(){ setFinalStatus(menuCollapsed); }
				);
				$(".sidebar").css("margin-left", "");
				$("#page-wrapper").css("margin-left", "250px");

			}
			else{
				setFinalStatus(menuCollapsed);
				$(".sidebar").css("margin-left", "-250px");
				$("#page-wrapper").css("margin-left", "0px");
				$(".sidebar").add("#page-wrapper").animate({ marginLeft: "+=250px"}, 500);
			}
		});
		setFinalStatus(menuCollapsed);
	};
    root.sbAdminCollapsible = sbAdminCollapsible;
}(Qz.Web, jQuery));

// section Qz.Web.getLabelFromTemplate
(function (root, $) {
    var getLabelFromTemplate = function ($element) {
        return $element.closest("div.form-group").find("label");
    };
    root.getLabelFromTemplate = getLabelFromTemplate;
}(Qz.Web, jQuery));

// section Qz.Web.openLinkAndRefresh
(function (root, $) {
    var openLinkAndRefresh = function (link) {
        window.open(link, '_blank');
        setTimeout(function () { location.reload(); }, 1000);
    };
    root.openLinkAndRefresh = openLinkAndRefresh;
}(Qz.Web, jQuery));
