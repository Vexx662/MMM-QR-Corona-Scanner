/* global Module */

/* Magic Mirror
 * Module: MMM-QR-Corona-Scanner
 *
 * By 
 * MIT Licensed.
 */

Module.register("MMM-QR-Corona-Scanner", {
	defaults: {
		getApiInterval: 60000
	},
	start: function() {
		var self = this;
		
		self.userFields = null;
		self.cert_valid = null;
		self.camera = 0;
		
		//setInterval(function() {
		//	self.updateDom();
		//}, 1000);
		
		this.sendSocketNotification("INITIALIZE", {
			'getApiInterval': self.config.getApiInterval
		});
	},
	notificationReceived: function (notification, payload, sender) {
		var self = this;
		
		switch(notification) {
			case "MMM-Meta-Kiosk-USER-SCANNED":
				self.sendSocketNotification("USER-SCANNED", payload);
				self.startCamera();
				break;
			case "MMM-Meta-Kiosk-CLEAR-KIOSK":
				self.userFields = null;
				self.cert_valid = null;
				self.camera=0;
				self.updateDom();
				break;
		}
	},
	startCamera: function()  {
		var self = this;
		console.log('Start Camera Stuff')
	//	let html5QrcodeScanner = new Html5QrcodeScanner(
	//	"reader",
	//	{ fps: 45, qrbox: {width: 250, height: 250} },
	//	/* verbose= */ false);
	//html5QrcodeScanner.render(self.onScanSuccess, self.onScanFailure);
		
//  const html5QrCode = new Html5Qrcode("reader");
//  const config = { fps: 30, qrbox: { width: 350, height: 350 } };
//  const qrCodeSuccessCallback = (decodedText, decodedResult) => {
//	/* handle success */
//	console.log(decodedText)
//	self.sendSocketNotification("CERT-SCANNED", decodedText);
//	html5QrCode.stop().then((ignore) => {
//		// QR Code scanning is stopped.
//	  }).catch((err) => {
//		// Stop failed, handle it.
//	  });
//};
//  html5QrCode.start({ facingMode: "user" }, config, qrCodeSuccessCallback);
//
if(self.camera === 0){
self.camera = 1;
// This method will trigger user permissions
Html5Qrcode.getCameras().then(devices => {
	/**
	 * devices would be an array of objects of type:
	 * { id: "id", label: "label" }
	 */
	if (devices && devices.length) {
	  var cameraId = devices[0].id;
	  // .. use this to start scanning.
	  const html5QrCode = new Html5Qrcode(/* element id */ "reader");
	  html5QrCode.start(
		cameraId, 
		{
		  fps: 30,    // Optional, frame per seconds for qr code scanning
		  qrbox: { width: 350, height: 350 }  // Optional, if you want bounded box UI
		},
		(decodedText, decodedResult) => {
		  // do something when code is read
		  console.log(decodedText)
		  self.sendSocketNotification("CERT-SCANNED", decodedText);
		  html5QrCode.stop().then((ignore) => {
			// QR Code scanning is stopped.
			self.camera = 0;
		  }).catch((err) => {
			// Stop failed, handle it.
		  });
		},
		(errorMessage) => {
		  // parse error, ignore it.
		})
	  .catch((err) => {
		// Start failed, handle it.
	  });
	}
  }).catch(err => {
	// handle err
  });


} 
	  

		console.log('Stop Camera Stuff')
	},
	socketNotificationReceived: function (notification, payload) {		
		var self = this;
		
		console.log(this.name, " --- Notification: ", notification, "; Payload: ", payload);
		
		switch(notification) {
			case "USER-SCANNED-RETURN":
				self.userFields = payload;
				
				
				break;
			case "CERT-SCANNED-RETURN":
				self.cert_valid = payload;
				self.updateDom();
				break;
		}
	},
	onScanFailure: function(error) {
		// handle scan failure, usually better to ignore and keep scanning.
		// for example:
		console.warn(`Code scan error = ${error}`);
	  },
	  onScanSuccess: function(decodedText, decodedResult) {
		// handle the scanned code as you like, for example:
		console.log(`Code matched = ${decodedText}`, decodedResult);
	  },
	getDom: function() {
		var self = this;
		
		var wrapper = document.createElement("div");
		if(self.cert_valid === null){
			wrapper.style.width = "500px";
			wrapper.style.height = "500px";
			wrapper.id = "reader"
		} else if (self.cert_valid === true){
			var image = document.createElement("img");
			image.src = "https://findicons.com/files/icons/1008/quiet/256/valid.png";
			wrapper.appendChild(image);
		} else{
			var image = document.createElement("img");
			image.src = "https://findicons.com/files/icons/1008/quiet/256/valid.png";
			wrapper.appendChild(image);
		} 
		
			return wrapper;
	},
	getScripts: function() {
		return [
			'https://unpkg.com/html5-qrcode@2.1.3/html5-qrcode.min.js'
		];
	},
	getStyles: function () {
		return [
			"MMM-QR-Corona-Scanner.css",
		];
	},
	getTranslations: function() {
		//FIXME: This can be load a one file javascript definition
		return {
			en: "translations/en.json",
			es: "translations/es.json"
		};
	},	
});
