var Qz = Qz || {};
Qz.AdminLTE = Qz.AdminLTE || {};

// section Qz.AdminLTE
(function (root, $) {
	var menuCollapsed = localStorage.adminLTE_menuCollapsed === 'true' || false;
	var setFinalStatus = function(menuCollapsed){
		if(menuCollapsed){
            $("header.main-header").addClass("hideden-sm-md-lg");
			$("aside.main-sidebar").addClass("hideden-sm-md-lg");
			$("div.wrapper div.content-wrapper").addClass("nomargin-sm-md-lg");
		}
		else{
            $("header.main-header").removeClass("hideden-sm-md-lg");
			$("aside.main-sidebar").removeClass("hideden-sm-md-lg");
			$("div.wrapper div.content-wrapper").removeClass("nomargin-sm-md-lg");
		}
	};

	// section Qz.AdminLTE.toggleFull
	root.toggleFull = function(){
        menuCollapsed = !menuCollapsed;
        localStorage.setItem("adminLTE_menuCollapsed", menuCollapsed);
		setFinalStatus(menuCollapsed);
	};

    $(function(){
        setFinalStatus(menuCollapsed);
    })

	// section Qz.AdminLTE.toggleMini
	root.toggleMini = function(){
        $("nav a[data-toggle='offcanvas']").trigger('click');
	};
}(Qz.AdminLTE, jQuery));
