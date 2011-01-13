$(document).ready(function(){
    test("Parsing Uris", function() {
    	var testData = {
    		"http://www.google.com": {host: 'google', tld: 'com', subdomain: '', domain: 'google.com', full: 'google.com', valid: true},
    		"https://www.google.com/": {host: 'google', tld: 'com', subdomain: '', domain: 'google.com', full: 'google.com', valid: true},
    		"http://www.google.com/path": {host: 'google', tld: 'com', subdomain: '', domain: 'google.com', full: 'google.com', valid: true},
    		"http://google.com": {host: 'google', tld: 'com', subdomain: '', domain: 'google.com', full: 'google.com', valid: true},
    		"http://sub.google.com": {host: 'google', tld: 'com', subdomain: 'sub', domain: 'google.com', full: 'sub.google.com', valid: true},
    		"google.com": {host: 'google', tld: 'com', subdomain: '', domain: 'google.com', full: 'google.com', valid: true},
    		"http://*.google.com": {host: 'google', tld: 'com', subdomain: '*', domain: 'google.com', full: '*.google.com', valid: true},
    		
    		"foobar": {valid: false},
    		"http://www.goog$le.com/": {valid: false}
    	};
    	
    	for (var key in testData) {
    		var result = validateUri(key);
    		if (testData[key].valid) {
    			deepEqual(result, testData[key], key);
    		}
    		else {
    			equal(result.valid, testData[key].valid, key);
    		}
    	}
    });
});