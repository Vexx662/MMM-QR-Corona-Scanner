/*
 * Copyright (c) Microsoft All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root of https://github.com/microsoftgraph/nodejs-apponlytoken-rest-sample for license information.
 */

var request = require('request');
var Q = require('q');

// The auth module object.
var auth = {};

var clientId = 'a98e550e-0a04-48ed-b034-80305ba26f35',
	clientSecret = '_pq3q8KJ/n42eU*TzPQffFzBzKwPqMs@',
	tokenEndpoint = 'https://login.microsoftonline.com/23f6f7f5-2008-4583-9180-a4a2a9d6e132/oauth2/v2.0/token';

// @name getAccessToken
// @desc Makes a request for a token using client credentials.
auth.getAccessToken = function () {
	var deferred = Q.defer();
	
	// These are the parameters necessary for the OAuth 2.0 Client Credentials Grant Flow.
	// For more information, see Service to Service Calls Using Client Credentials (https://msdn.microsoft.com/library/azure/dn645543.aspx).
	var requestParams = {
		grant_type: 'client_credentials',
		client_id: clientId,
		client_secret: clientSecret,
		scope: 'https://graph.microsoft.com/.default'
	};

	// Make a request to the token issuing endpoint.
	request.post({ url: tokenEndpoint, form: requestParams }, function (err, response, body) {
		console.log('token body: ' + body);
		
		var parsedBody = JSON.parse(body);

		if (err) {
			deferred.reject(err);
		} else if (parsedBody.error) {
			deferred.reject(parsedBody.error_description);
		} else {
			// If successful, return the access token.
			deferred.resolve(parsedBody.access_token);
		}
	});

	return deferred.promise;
};

module.exports = auth;
