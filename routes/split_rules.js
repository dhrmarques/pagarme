// Manages the split rules.
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var https = require('https');

/*POST Create split rules from transaction with recipients*/
router.post('/', function(req, res, next) {
	/* Retrieving data from request (which is an array) (and validating it):
			recipient_id_0
			recipient_id_1
			amount_0
			amount_1
			percentage_0
			percentage_1
			charge_processing_fee_0
			charge_processing_fee_1
			liable_0
			liable_1
			transaction (object)
	*/
	var https_options = {
		host: 'api.pagar.me',
		port: '443',
		path: '/1/transactions',
		method: 'POST',
		headers: {
		  'api_key': 'ak_test_grXijQ4GicOa2BLGZrDRTR5qNQxJW0'
		}
	};

	var split_rules = [
		{
		    "object": "split_rule",
		    "id": "sr_" + bcrypt.hashSync(new Date().getMilliseconds()), // Automatically generated
		    "recipient_id": req[0].recipient_id, // Comes from req
		    "charge_processing_fee": req[0].charge_processing_fee, // Comes from req
		    "liable": req[0].liable, // Comes from req
		    "percentage": req[0].percentage, // Comes from req
		    "amount": req[0].amount, // Comes from req
		    "date_created": new Date().toISOString(), // Automatically generated
		    "date_updated": new Date().toISOString() // Automatically generated
		},
		{
			"object": "split_rule",
		    "id": "sr_" + bcrypt.hashSync(new Date().getMilliseconds()), // Automatically generated
		    "recipient_id": req[1].recipient_id, // Comes from req
		    "charge_processing_fee": req[1].charge_processing_fee, // Comes from req
		    "liable": req[1].liable, // Comes from req
		    "percentage": req[1].percentage, // Comes from req
		    "amount": req[1].amount, // Comes from req
		    "date_created": new Date().toISOString(), // Automatically generated
		    "date_updated": new Date().toISOString() // Automatically generated
		}
	];

	req.transaction.split_rules = split_rules;

	https.request(https_options, function(response) {
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(response));
	});
});

/*GET Return split rule payables from transaction*/
router.get('/payables', function(req, res, next) {
	/* Requesting tansaction using transaction_id:
			req.transaction_id
	*/
	var https_options = {
		host: 'api.pagar.me',
		port: '443',
		path: '/1/transactions/' + req.transaction_id,
		method: 'GET',
		headers: {
		  'api_key': 'ak_test_grXijQ4GicOa2BLGZrDRTR5qNQxJW0'
		}
	};

	var https_options_2 = {
		host: 'api.pagar.me',
		port: '443',
		path: '/1/transactions/' + req.transaction_id + '/payables',
		method: 'GET',
		headers: {
		  'api_key': 'ak_test_grXijQ4GicOa2BLGZrDRTR5qNQxJW0'
		}
	};

	var transaction = null;
	var transactionGet = https.request(https_options, function(response) {
		transaction = JSON.stringify(response);
	})

	var payables = null;
	var payablesGet = https.request(https_options_2, function(response) {
		payables = JSON.stringify(response);
	})

	if (req.headers.api_key == "ak_test_grXijQ4GicOa2BLGZrDRTR5qNQxJW0" && transaction != null && payables != null) {
		// Returning created objects to requester
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({"status": transaction.status, "payables": payables}));
	}
});

module.exports = router;
