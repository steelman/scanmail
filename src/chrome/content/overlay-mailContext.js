/**
 * Scan'Mail 
 * @version 2.0 (2012/06)
 * @author : Nassim KACHA <nassim.kacha@blueicefield.com>
 * @license : LICENSE MIT
 */ 


// Adding an event listner on DOM content loading
window.addEventListener("DOMContentLoaded",function(e) {Scanmail.linkEvent();}, false);

var Scanmail = new function() {
	
	/**
	 * Detects if the selection is a text  whose the length <= 600 chars
	 */
	var isTextSelected = function() {
		var result = false;
		if (gContextMenu.isContentSelected) {
			var selection = document.commandDispatcher.focusedWindow.getSelection().toString().replace(/(\n|\r|\t)+/g, " ").trim();
			result = (selection != "") && (selection.length <= 600);
		}
		return result;
	};


	/**
	 * Detects when to display the menu entries :
	 * - in an image popup menu
	 * - in a link popup menu
	 * - in a text selected popup menu
	 * - if a internet connexion is available 
	 */  
	var show = function() {
		ShowMenuItem("scanmail-menuseparator", gContextMenu.onLink || gContextMenu.onImage || isTextSelected());
		ShowMenuItem("scanmail-messagePaneContext", gContextMenu.onLink || gContextMenu.onImage || isTextSelected());
	};



	this.linkEvent = function() {
		if(document.getElementById("messagePaneContext")) {
			var menu = document.getElementById("messagePaneContext");
		}
		else {
			var menu = document.getElementById("mailContext");
			menu.addEventListener("popupshowing",function(e) {show();}, false);
		}
	};

	/**
	 * Displays the QR Code window passing it the selection content
	 */
	this.displayQRCode = function() {
		var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		if(gContextMenu.onLink == true)	{
			var content = gContextMenu.linkURL;
			if(gContextMenu.onMailtoLink == true) {
				content = content.replace('mailto:', '');
			}
		}
		else if(gContextMenu.onImage == true) {
			var content = gContextMenu.imageURL;
		}
		else if(isTextSelected()) {
			var content = window.content.getSelection();
		}
		window.openDialog('chrome://scanmail/content/scanmail.xul', '', '', content);
	};
};
