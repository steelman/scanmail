/**
 * Scan'Mail 
 * @version 2.0 (2012/06)
 * @author : Nassim KACHA <nassim.kacha@blueicefield.com>
 * @license : LICENSE MIT
 */ 

var Scanmail = new function() {
	
	/**
	 * Builds the QR code as a canvas
	 * @param options	associative array
	 * @returns 
	 */
	var qrCode = function(options)
	{
			var qrcode	= new QRCode(options.typeNumber, options.correctLevel);
			qrcode.addData(options.text);
			qrcode.make();

			// Check if a canvas is not already displayed
			var canvas = document.getElementById('canvas');
			if (canvas == null) {
				canvas = document.createElementNS ("http://www.w3.org/1999/xhtml", "canvas");
			}
			canvas.id = 'canvas';
			canvas.className = 'canvas';
			canvas.width	= options.width;
			canvas.height	= options.height;
			
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
	
	
	/**
	 * Checks if the string passed as parameter is an email
	 * @param string
	 * @returns true if the given parameter is an email address
	 */
	var isEmailAddress = function(string)
	{
		var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;  
		return regex.test(string);
	}; 
	
	
	/**
	 * Returns the settings
	 * @returns settings as an associative array
	 */
	var getSettings = function()
	{
		var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		var use_mailto = prefManager.getBoolPref("extensions.scanmail.mailto-protocol");
		return {'use_mailto': use_mailto};
	};

	
	/** 
	 * Display the QR Code 
	 * @param content	Data to be inserted into the QR code
	 */
	this.displayQRCode = function(content)
	{
		var settings = getSettings();
		if(settings.use_mailto && isEmailAddress(content))
		{
			content = 'mailto:'+content;
		}
		var canvas = qrCode({ width: 200,
				 			  height: 200,
				 			  typeNumber	: -1,
				 			  correctLevel : QRErrorCorrectLevel.H,
				 			  background : "#ffffff",
				 			  foreground : "#000000",
				 			  text : content });
		document.getElementById('qrcode').insertBefore(canvas, null);
	};
	
	
	/**
	 * Copy the QR code into the clipboard 
	 */
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
	
	
	/**
	 * Displays a postal address as a geo-coordinates
	 */
	this.getGeoCoordinates = function(content)
	{
		var jsonResponse = null;
		var apikey = 'AIzaSyALbTK_ijFFAUTNiKDdrgIeXlkbfCPqs7M';
		var query = content.replace(/[\n]/gi, " ");
		var url = encodeURI('https://maps.googleapis.com/maps/api/place/textsearch/json?query='+query+'&sensor=false&key='+apikey);
		var req = new XMLHttpRequest;
		req.open('GET', url, false);
		req.onreadystatechange = function () {
			if (req.readyState == 4 && req.status == 200){
				  jsonResponse = JSON.parse(req.responseText);
			}
		};
		req.send(null);
		switch(jsonResponse.status) {
			case 'ZERO_RESULTS':
				// Google API can't localize the given postal address
//				alert('Address not found !');
				var bundle = document.getElementById("scanmail-stringbundle");
				var message = bundle.getString('aaa');
				alert(message);
				break;
			case 'OVER_QUERY_LIMIT':
				// Currently with a FREE account the quota is limited to 1000 requests/day
				alert('Google API : quota exceeded !');
				break;
			case 'REQUEST_DENIED':
				// should never appear for a user but useful for debugging
				alert('Google API : request denied !');
				break;
			case 'INVALID_REQUEST':
				// should never appear for a user but useful for debugging
				alert('Google API : Invalid request !');
				break;
			default:
				var lat = jsonResponse.results[0].geometry.location.lat;
				var lng = jsonResponse.results[0].geometry.location.lng;
				var tag = 'geo:' + lat + ',' + lng;
				this.displayQRCode(tag);
				break;
		}
	};
};
