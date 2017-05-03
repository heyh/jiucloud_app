
var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec');


var QuickLook = function() {
};

QuickLook.prototype.openFile = function(fileUrl) {
    exec(null, null, "QuickLook", "openFile", [fileUrl]);
};

QuickLook.prototype.shareFile = function(fileUrl) {
    exec(null, null, "QuickLook", "shareFile", [fileUrl]);
};

if(!window.plugins){
	window.plugins = {};
}

if(!window.plugins.quickLookPlugIn){
	window.plugins.quickLookPlugIn = new QuickLook();
}  

module.exports = new QuickLook();



