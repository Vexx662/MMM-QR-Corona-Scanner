/* 
 * Magic Mirror
 * Node Helper: MMM-QR-Corona-Scanner 
 *
 */

var NodeHelper = require("node_helper");
var request = require('request');
const https = require('https');
const { DCC, Rule } = require('dcc-utils');
const valueSets = require('./data/valueSets.json');

const opts = {
	retry: true,                // keep checking until a QR is found, default: false
	retryUntilTimeout: 10000    // milliseconds until giving up, default: never give up
  }

module.exports = NodeHelper.create({
    start: function() {
		console.log('--- QR Corona Scanner: ' + this.name + ': Node Helper Start');
		
		this.sitagoList = [];        
    },
    socketNotificationReceived: function(notification, payload) {
		var self = this;
		
		console.log(this.name, "--- SocketedNotification: ", notification, "; Payload: ", payload);
		
		switch(notification) {
			case "INITIALIZE":
			
				break;
			case "USER-SCANNED":
				console.log(payload);

				this.sendSocketNotification("USER-SCANNED-RETURN", ret);
				break;
			case "CERT-SCANNED":
				console.log("Cert Scanned")
				var ret = self.getCheckCert(payload);
				this.sendSocketNotification("CERT-SCANNED-RETURN", ret);
		}
    },
	getCheckCert: function (cert) {
		var self = this;
		
		const dcc = DCC.fromRaw(cert);
		
		const rule = Rule.fromFile(
		  './modules/metafinanz/MMM-QR-Corona-Scanner/data/de_v_rule.json',
		  {
			valueSets,
			validationClock: new Date().toISOString(),
		  },
		);
		const result = rule.evaluateDCC(dcc);
		console.log(result);
		console.log(dcc.payload);
		if (result === false) {
		  console.log(rule.getDescription());
		  console.log(`This certificate has ${dcc.payload.v[0].dn}/${dcc.payload.v[0].sd}.`);
		}
		return result;
	},
	getTest: function (){

		var self = this;
		console.log('test');
		return 'bla';
	}
});
