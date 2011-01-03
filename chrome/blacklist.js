var GoogleBlacklist = {
	blacklist: [],

	getDomain: function(uri) {
		var parsed = parseUri(uri);
    	if (parsed.host) {
        	return parsed.host;
    	}
    	else if (parsed.queryKey && parsed.queryKey.url) {
        	return GoogleBlacklist.getDomain(parsed.queryKey.url);
    	}
    	else {
        	return "";
    	}
	},

	checkBlacklist: function(uri) {
		var domain = GoogleBlacklist.getDomain(uri);
		if (domain != "") {
			if (domain.split(".").length <= 2) {
				domain = "www." + domain;
			}
			return $.inArray(domain, GoogleBlacklist.blacklist) != -1;
		}
		return false;
	},

	removeBlacklisted: function() {
		if ($("#ires ol li #blacklist_marker").length > 0) {
			//Nothing's changed since our last trimming
			return;
		}
		$("#ires ol li").each(function() {
        	var that = this;
        	$("a", this).each(function() {
            	if (GoogleBlacklist.checkBlacklist($(this).attr('href'))) {
					$(that).hide();
                	return false;
            	}
        	});
    	});
		$("#ires ol li:first").append("<div style='display:none;' id='blacklist_marker'></div>");
	},

	init: function(blacklist) {
		GoogleBlacklist.blacklist = blacklist;
		GoogleBlacklist.removeBlacklisted();
		//For Google Instant
		setInterval(function() {
			GoogleBlacklist.removeBlacklisted();
		}, 100)
	}
};

chrome.extension.sendRequest({method: "getBlacklist"}, function(response) {
	GoogleBlacklist.init(response);
});

