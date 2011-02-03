var GoogleBlacklist = {
	blacklist: [],

	getBlackObject: function(uri) {
		var parsed = parseUri(uri);
		
    	if (parsed.host) {    	
			return validateUri(parsed.host);
    	} else if (parsed.queryKey && parsed.queryKey.url) {
			return GoogleBlacklist.getBlackObject(parsed.queryKey.url);
    	}
    	else {
        	return false;
    	}
	},

	checkBlacklist: function(uri) {
		var blackObject = GoogleBlacklist.getBlackObject(uri);
		if (blackObject) {
			for (b in GoogleBlacklist.blacklist){
				if (GoogleBlacklist.blacklist[b].host == blackObject.host){
					return GoogleBlacklist.blacklist[b].subdomain == "*" || 
					GoogleBlacklist.blacklist[b].subdomain == blackObject.subdomain;
				}
			}
		}
		return false;
	},

	removeBlacklisted: function(forced) {
		if (!forced && $("#ires ol li #blacklist_marker").length > 0) {
			//Nothing's changed since our last trimming
			return;
		}

		$("#ires ol li").each(function() {
        	var that = this;
        	$("a.l", this).each(function() {
            	if (GoogleBlacklist.checkBlacklist($(this).attr('href'))) {
					$(that).hide();
                	return false;
            	}
        	});
    	});
		
		if ($("#ires ol li #blacklist_marker").length <= 0) {
			GoogleBlacklist.addTooltip();
			$("#ires ol li:first").append("<div style='display:none;' id='blacklist_marker'></div>");
		}
	},

	addTooltip: function() {
		//Add buttons for the tooltip
		var imgURL = chrome.extension.getURL("google_remove.png");
		var button = $('<button>').addClass('se_blacklist_tool_remove').css("background-image", "url('" + imgURL + "')");
		$("#ires ol li").each(function() {
			$("button:last", this).after(button.clone());
		});
		
		$('.se_blacklist_tool_remove').live('click', function() {
			var li = $(this).closest('li');
			var url = GoogleBlacklist.getBlackObject($('a.l:first', li).attr('href'));
			if (confirm("Blacklist " + url.full + "?")) {
				chrome.extension.sendRequest({method: "addToBlacklist", site: url}, function(response) {
					GoogleBlacklist.blacklist.push(url);
					GoogleBlacklist.removeBlacklisted(true);
				});
			}
		});
	},

	init: function(blacklist) {
		GoogleBlacklist.blacklist = blacklist;
		GoogleBlacklist.removeBlacklisted();
		//For Google Instant
		setInterval(function() {
			GoogleBlacklist.removeBlacklisted();
		}, 100);
	}
};

$(document).ready(function() {
	if ($.inArray('google', document.location.hostname.split('.'))) {
		chrome.extension.sendRequest({method: "getBlacklist"}, function(response) {
			GoogleBlacklist.init(response);
		});
	}
});

