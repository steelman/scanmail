/**
 * Scan'Mail 
 * @version 2.0 (2012/06)
 * @author : Nassim KACHA <nassim.kacha@blueicefield.com>
 * @license : LICENSE MIT
 */ 


// Detect if a text was selected  
function isTextSelected() {
	var isTextSelected = false;
	if (gContextMenu.isContentSelected) {
		var selection = document.commandDispatcher.focusedWindow.getSelection().toString().replace(/(\n|\r|\t)+/g, " ").trim();
		isTextSelected = (selection != "") && (selection.length <= 600);
	}
	return isTextSelected;
}


/* show()
 * Detect when to display the menu entries :
 * - in an image popup menu
 * - in a link popup menu
 * - in a text selected popup menu
 * - if a internet connexion is available 
 */  
function show() {
	ShowMenuItem("scanmail-menuseparator", (gContextMenu.onLink || gContextMenu.onImage || isTextSelected()) && window.navigator.onLine);
	ShowMenuItem("scanmail-messagePaneContext", (gContextMenu.onLink || gContextMenu.onImage || isTextSelected()) && window.navigator.onLine);
}



function linkEvent() {
	if(document.getElementById("messagePaneContext")) {
		var menu = document.getElementById("messagePaneContext");
	}
	else {
		var menu = document.getElementById("mailContext");
		menu.addEventListener("popupshowing",function(e) {show();}, false);
	}
}

// Get the QR Code if the content is an email address, or a website or a selected text
function getQRCode() {
	var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	if(gContextMenu.onLink == true)	{
		// Sorry for the underscore at the beginning of variable name, it's a habit of python developer ;-)
		var _content = gContextMenu.linkURL;
		if(gContextMenu.onMailtoLink == true) {
			_content = _content.replace('mailto:', '');
		}
	}
	else if(gContextMenu.onImage == true) {
		var _content = gContextMenu.imageURL;
	}
	else if(isTextSelected()) {
		var _content = content.window.getSelection();
	}
	window.openDialog('chrome://scanmail/content/qrcode.xul', '', '', _content);
}

window.addEventListener("DOMContentLoaded",function(e) {linkEvent();}, false);
