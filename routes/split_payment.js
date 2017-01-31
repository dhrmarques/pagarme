/* Split Payment class - split_payment method */

var express = require('express');
var router = express.Router();
var https = require('https');

/* Chave de testes gerada para usuário d*******@gmail.com */
var api_key = "ak_test_xUswRAfvPdocrxli2Spza2yL44cMIa";
var api_host = "api.pagar.me";

var create_bank_account = function(data, callback) {
	var bank_account_options = {
		host: api_host,
		port: 443,
		path: '/1/bank_accounts',
		method: 'POST'
	};

	var bank_account_data = {
		"api_key": api_key,
		"bank_code": data.bank_code,
	    "agencia": data.agencia,
	    "agencia_dv": data.agencia_dv,
	    "conta": data.conta,
	    "conta_dv": data.conta_dv,
	    "type": data.type,
	    "document_number": data.document_number,
	    "legal_name": data.legal_name
	};

	var bank_account_req = https.request(bank_account_options, function(resp) {
		callback(resp);
		
		bank_account_req.write(bank_account_data);
		bank_account_req.end();
	});

};

var create_recipient = function(bank_id, data, callback) {
	var recipient_options = {
		host: api_host,
		port: 443,
		path: '/1/recipients',
		method: 'POST'
	};

	var recipient_data = {
		"api_key": api_key,
		"transfer_enabled": data.transfer_enabled,
	    "transfer_interval": data.transfer_interval,
	    "transfer_day": data.transfer_day,
	    "bank_account_id": bank_id
	};

	var recipient_req = https.request(recipient_options, function(resp) {
		callback(resp);

		recipient_req.write(recipient_data);
		recipient_req.end();
	});

};

var create_card = function(data, callback) {
	var card_options = {
		host: api_host,
		port: 443,
		path: '/1/cards',
		method: 'POST'
	};

	var card_data = {
		"api_key": api_key,
		"card_number": data.card_number,
	    "card_holder_name": data.card_holder_name,
	    "card_expiration_month": data.card_expiration_month,
	    "card_expiration_year": data.card_expiration_year,
	    "card_cvv": data.card_cvv
	};

	var card_req = https.request(card_options, function(resp) {
		callback(resp);

		card_req.write(card_data);
		card_req.end();
	});

}

var obtain_payables = function(transaction_id, callback) {
	var card_options = {
		host: api_host,
		port: 443,
		path: '/1/transactions/' + transaction_id + '/payables?api_key=' + api_key,
		method: 'GET'
	};

	var card_req = https.request(card_options, function(resp) {
		callback(resp);

		card_req.write(card_data);
		card_req.end();
	});

}

/* Steps to efectuate a split payment: 
	1. Authentication with the API from the Payment Origin - via Dashboard (obtaining valid code)
	2. Creating a new Transaction object
	3. Populating the Transaction object with the split payments
	4. Sending payment to the API
	5. If payment is okay, proceed; else, show the error to the Payment Origin
	6. Fetch the Payables using the Transaction ID (expected to be returned after step 4)
	7. Show the Payable objects and indicate to the Payment Origin that it has been successful */
router.post("/", function(req, res, next) {
	// Step 1: Creating Bank Agencies
	var bank_account_id_0 = "";
	var bank_account_id_1 = "";

	if(req.body.is_new_bankacc_0) {
		create_bank_account(req.body.bank_accounts[0], function(response) {
			bank_account_id_0 = response.id;
		});
	} else {
		bank_account_id_0 = req.body.bank_account_id_0;
	}

	if(req.body.is_new_bankacc_1) {
		create_bank_account(req.body.bank_accounts[1], function(response) {
			bank_account_id_1 = response.id;
		});
	} else {
		bank_account_id_1 = req.body.bank_account_id_1;
	}


	// Step 2: Creating Recipients
	var recipient_id_0 = "";
	var recipient_id_1 = "";

	if(req.body.is_new_recipient_0) {
		create_recipient(bank_account_id_0, req.body.recipients[0], function(response) {
			recipient_id_0 = response.id;
		});
	} else {
		recipient_id_0 = req.body.recipient_id_0;
	}

	if(req.body.is_new_recipient_1) {
		create_recipient(bank_account_id_1, req.body.recipients[1], function(response) {
			recipient_id_1 = response.id;
		});
	} else {
		recipient_id_1 = req.body.recipient_id_1;
	}


	// Step 3: Obtaining card hash
	var card_hash = "";
	if(req.body.is_new_card) {
		create_card(req.body.card, function(response) {
			card_hash = response.id;
		});
	} else {
		card_hash = req.body.card_hash;
	}


	// Step 4: Creating the Transaction
	var transaction_options = {
		host: api_host,
		port: 443,
		path: '/1/transactions',
		method: 'POST'
	};

	var transaction_data = {
		'api_key': api_key,
		'amount': 1000,
		'card_hash': card_hash,
		'split_rules': [
			{
				'recipient_id': recipient_id_0,
				'charge_processing_fee': true,
				'liable': true,
				'percentage': percentage_0
			},
			{
				'recipient_id': recipient_id_1,
				'charge_processing_fee': true,
				'liable': true,
				'percentage': 100 - percentage_0
			}
		]
	};

	var transaction_id = "";
	var transaction = https.request(transaction_options, function(response) {
		// Obtaining response body - logging it on console
		response.on('data', function (chunk) {
		  console.log('Response: ' + chunk);
		});
		// Obtaining transaction_id
		transaction_id = response.id;

		transaction.write(transaction_data);
		transaction.end();
	});

	// Step 4: Obtaining the Payables
	obtain_payables(transaction_id, function(response) {
		res.render('/split_payables', response); // Rendering the response from obtain_payables as a GET /split_payables
	});
});

module.exports = router;
