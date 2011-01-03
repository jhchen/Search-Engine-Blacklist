$(document).ready(function() {
	DEFAULT_NUM_ROWS = 6;
	parseUri.options.strictMode = true;

    restoreOptions();
   
	//Ensure at least one empty textbox 
	do {
		addBlacklistItem();
	} while ($(".blacklist_item:not(.template)").length < DEFAULT_NUM_ROWS);


	$(".save_button").click(saveOptions);

	$(".add_button").click(function() {
		addBlacklistItem();
	});

    $(".blacklist_item").live('mouseover', function() {
        $(".remove_button", this).show();
    }).live('mouseout', function() {
        $(".remove_button", this).hide();
    });

	$(".blacklist_item .site_text").live('keyup', function() {
		ensureOneExtraTextbox();
	}).live('blur', function() {
		validateSites();
		$(this).siblings(".remove_button").hide();
	});

	$(".blacklist_item > .remove_button").live('click', function() {
		//If this is the only textbox, clear it instead of removing it
		if ($(".blacklist_item:not(.template)").length <= 1) {
			$(this).siblings(".site_text").val("");
			return;
		}
        $(this).parent().addClass("terminating").slideUp(function() {
            $(this).remove();
        });
    });

	function ensureOneExtraTextbox() {
		var empty = false;
		$(".blacklist_item:not(.terminating) .site_text").each(function() {
			if ($(this).val() == "" && !$(this).parent().hasClass('template')) {
				empty = true;
				return false;
			}
		});
		if (!empty) {
			addBlacklistItem();
		}
	}

    function saveOptions() {
        sites = [];
        $(".blacklist_item:not(.terminating)").each(function() {
            if ($(".site_text", this).val()) {
				var domain = parseUri($(".site_text", this).val());
				if (domain && domain.host) {
					sites.push(domain.host);
				}
				else {
                	sites.push($(".site_text", this).val());
            	}
			}
        });
        localStorage["blacklisted_sites"] = JSON.stringify(sites);

        $("#save_status").slideDown();
		setTimeout(function() {
			$("#save_status").slideUp('slow');
		}, 1500);
    }

	function addBlacklistItem() {
		var item = $("#blacklist_container .template:first").clone().hide().removeClass('template');
		$("#blacklist_container").append(item);
		$(item).slideDown();
		return item;
	}

    function restoreOptions() {
        var sites = localStorage["blacklisted_sites"];
        if (!sites) {
            return;
        }
		sites = JSON.parse(sites);
	
        for (i in sites) {
        	var item = addBlacklistItem();
			$(".site_text", item).val(sites[i]);
		}

        validateSites();
    }

	function validateRow(elem) {
		var uri = $.trim($(".site_text", elem).val());
		if (uri) {
			var validated = validateUri(uri);
			if (!validated) {
				$(".site_text", elem).addClass("warning");
            	return false;
			}
			$(".site_text", elem).val(validated);
		}
		
		$(".site_text", elem).removeClass("warning");
		return true;
	}

	function validateUri(uri) {
		if (uri.indexOf("http") != 0) {
			uri = "http://" + uri;
		}
		
		var host = parseUri(uri).host;
		if (host.match(/^([a-z0-9\-_]+\.)+[a-z0-9\-_]{1,4}$/i)) {
			parts = host.split(".");
			if (parts.length == 2) {
				return "www." + host;
			}
			return host;
		}
		return false;
	}
	
	function validateSites() {
        var validated = true;
        $(".blacklist_item:not(.terminating)").each(function() {
            if (!validateRow(this)) {
			    validated = false;
				return false;
			}
        });
        if (validated) {
            $("#validation_status").hide();
        }
        else {
            $("#validation_status").show();
        }
    }
});
