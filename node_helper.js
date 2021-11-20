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
				var ret = self.getCheckCert();

				this.sendSocketNotification("USER-SCANNED-RETURN", ret);
				break;
		}
    },
	getCheckCert: function () {
		var self = this;
		console.log('BLABLA');
		const dcc = DCC.fromImage('./modules/metafinanz/MMM-QR-Corona-Scanner/QR-Code/1.png');
		
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
		
	},
	getTest: function (){

		var self = this;
		console.log('test');
		return 'bla';
	}
});
