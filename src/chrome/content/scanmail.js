/* Scan'Mail 
 * version 2.0 (2012/06)
 * Author : Nassim KACHA <nassim.kacha@blueicefield.com>
 * License : GNU AFFERO GENERAL PUBLIC LICENSE
 *                      Version 3
 */ 

//http://www.phpied.com/3-ways-to-define-a-javascript-class/
//http://www.crockford.com/javascript/private.html
	
var Scanmail = new function() {
	
	var qrCode = function(options){
			// create the qrcode itself
			var qrcode	= new QRCode(options.typeNumber, options.correctLevel);
			qrcode.addData(options.text);
			qrcode.make();
			var canvas = document.createElementNS ("http://www.w3.org/1999/xhtml", 
			"canvas");
			canvas.id = 'canvas';
			canvas.className = 'canvas';
			document.getElementById(options.node).insertBefore(canvas, null);
			
			canvas.width	= options.width;
			canvas.height	= options.height;
			Application.console.log('test');
			Application.console.log(canvas);
			
			var ctx = canvas.getContext('2d');
			
			// compute tileW/tileH based on options.width/options.height
			var tileW	= options.width  / qrcode.getModuleCount();
			var tileH	= options.height / qrcode.getModuleCount();

			// draw in the canvas
			for( var row = 0; row < qrcode.getModuleCount(); row++ ){
				for( var col = 0; col < qrcode.getModuleCount(); col++ ){
					ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
					var w = (Math.ceil((col+1)*tileW) - Math.floor(col*tileW));
					var h = (Math.ceil((row+1)*tileW) - Math.floor(row*tileW));
					ctx.fillRect(Math.round(col*tileW),Math.round(row*tileH), w, h);  
				}	
			}
			// return just built canvas
			return canvas;
	};
	
	var _isEmailAddress = function(string)
	{
		var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;  
		return regex.test(string);
	}; 
	
	var getSettings = function()
	{
		var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		var use_mailto = prefManager.getBoolPref("extensions.scanmail.mailto-protocol");
		return {'use_mailto': use_mailto};
	};
	
	// Méthode publique
	this.displayQRCode = function(content)
	{
		var settings = getSettings();
		if(settings.use_mailto && _isEmailAddress(content))
		{
			content = 'mailto:'+content;
		}
		qrCode({ width: 200,
				 height: 200,
				 node: 'qrcode',
				 typeNumber	: -1,
				 correctLevel : QRErrorCorrectLevel.H,
				 background : "#ffffff",
				 foreground : "#000000",
				 text : content });
	};
	
	this.copyToClipboard = function()
	{
		var canvas = document.getElementById("canvas");
		var imagedata = canvas.toDataURL("image/png");
		var io = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
		var channel = io.newChannel(imagedata, null, null);
		var input = channel.open();
		var imgTools = Components.classes["@mozilla.org/image/tools;1"].getService(Components.interfaces.imgITools);

		var container  = {};
		imgTools.decodeImageData(input, channel.contentType, container);

		var wrapped = Components.classes["@mozilla.org/supports-interface-pointer;1"].createInstance(Components.interfaces.nsISupportsInterfacePointer);
		wrapped.data = container.value;

		var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
		trans.addDataFlavor(channel.contentType);
		trans.setTransferData(channel.contentType, wrapped, channel.contentLength);

		var clipid = Components.interfaces.nsIClipboard;
		var clip   = Components.classes["@mozilla.org/widget/clipboard;1"].getService(clipid);
		clip.setData(trans, null, clipid.kGlobalClipboard);
	};
};
