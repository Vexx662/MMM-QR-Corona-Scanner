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
		
		setInterval(function() {
			self.updateDom();
		}, 1000);
		
		this.sendSocketNotification("INITIALIZE", {
			'getApiInterval': self.config.getApiInterval
		});
	},
	notificationReceived: function (notification, payload, sender) {
		var self = this;
		
		switch(notification) {
			case "MMM-Meta-Kiosk-USER-SCANNED":
				self.sendSocketNotification("USER-SCANNED", payload);
				break;
			case "MMM-Meta-Kiosk-CLEAR-KIOSK":
				self.userFields = null;
				break;
		}
	},
	socketNotificationReceived: function (notification, payload) {		
		var self = this;
		
		console.log(this.name, " --- Notification: ", notification, "; Payload: ", payload);
		
		switch(notification) {
			case "USER-SCANNED-RETURN":
				self.userFields = payload;
				
				
				break;
		}
	},
	getDom: function() {
		var self = this;

		var wrapper = document.createElement("div");
		
		if (null !== this.userFields) {
			wrapper.className = "box full";
			
			var wrapperDataRequest = document.createElement("div");
			wrapperDataRequest.innerHTML = this.userFields.floor + ' - ' + this.userFields.seatNumber;
			wrapper.appendChild(wrapperDataRequest);
		} else {
			wrapper.className = "box";
			
			var wrapperDataRequest = document.createElement("div");
			wrapperDataRequest.innerHTML = '&nbsp;';
			wrapper.appendChild(wrapperDataRequest);
		}

		return wrapper;
	},
	getScripts: function() {
		return [];
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
