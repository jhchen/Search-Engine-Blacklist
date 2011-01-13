$(document).ready(function(){
    test("Parsing Uris", function() {
    	var testData = {
    	    //Should all be good, parseUri should do all this for us
    		"http://www.google.com": {host: 'google', tld: 'com', subdomain: '', domain: 'google.com', full: 'google.com', valid: true},
    		"https://www.google.com/": {host: 'google', tld: 'com', subdomain: '', domain: 'google.com', full: 'google.com', valid: true},
    		"http://www.google.com/path": {host: 'google', tld: 'com', subdomain: '', domain: 'google.com', full: 'google.com', valid: true},
    		"http://google.com": {host: 'google', tld: 'com', subdomain: '', domain: 'google.com', full: 'google.com', valid: true},
    		"http://sub.google.com": {host: 'google', tld: 'com', subdomain: 'sub', domain: 'google.com', full: 'sub.google.com', valid: true}
    	
    		//And now for our parser
    	};
    	
    	for (var key in testData) {
    		var result = validateUri(key);
    		deepEqual(result, testData[key], key);
    	}
    });
});