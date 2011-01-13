function validateUri(uri) {
	var host = parseUri(uri);	
   
    host = host.host;
    if (host.host == "") {
        // Might have to grab source member depending
        // on what parseUri returns
        host = host.source; 
    }
	
	var parts = host.split(".");
    var numParts = parts.length-1; 
	var offset = 0;

    /* Catch any hosts with a tld of `.co.foo` */
    if (parts[numParts-1] == "co"){
		offset = 1;
    }
	var tld = parts.splice(numParts-offset, numParts).join(".");
	var host = parts.pop();
	var valid = false;
    /* Determine if this is a valid domain name
       for use by the validity checker in options.js */
    if (tld.length > 0 && (host+'.'+tld).match(/^([a-z0-9\-_]+\.)+[a-z0-9\-_]{1,4}$/i)) {
		valid = true;
	}
    // Grab whatever remains for the subdomain, if anything
	var subdomain = (numParts-(1+offset) > 0) ? parts.join(".") : "";
	(subdomain.indexOf("www") == 0) && (subdomain = subdomain.substring(4));
	var domain = (tld.length > 0) ? [host, tld].join(".") : host;
	var full = (subdomain.length > 0) ? [subdomain, domain].join(".") : domain;
    return {host: host,
			tld: tld,
			subdomain: subdomain,
			domain: domain,
			full: full,
			valid: valid
			};
}
