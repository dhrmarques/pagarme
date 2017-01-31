# Request: POST na URL 'https://localhost:3000/split_payment'
# Response a ser obtido via Redirect para 'https://localhost:3000/split_payables'

Exemplo de corpo do POST:
{
	"is_new_bankacc_0": true,
	"bank_account_id_0": null,
	"is_new_bankacc_1": true,
	"bank_account_id_1": null,
	"bank_accounts" : [
		{
			"bank_code": "341",
		    "agencia": "3333",
		    "agencia_dv": "6",
		    "conta": "12345",
		    "conta_dv": "6",
		    "type": "conta_corrente",
		    "document_number": "01234567890",
		    "legal_name": "Bank Account 1"
		},
		{
			"bank_code": "341",
		    "agencia": "4444",
		    "agencia_dv": "8",
		    "conta": "54321",
		    "conta_dv": "0",
		    "type": "conta_corrente",
		    "document_number": "98765432109",
		    "legal_name": "Bank Account 2"
		}
    ],
    "is_new_recipient_0": true,
    "recipient_id_0": null,
    "is_new_recipient_1": true,
    "recipient_id_1": null,
    "recipients": [
    	{
    		"transfer_enabled": true,
	    	"transfer_interval": "weekly",
	    	"transfer_day": 5
    	},
    	{
    		"transfer_enabled": true,
	    	"transfer_interval": "monthly",
	    	"transfer_day": 30
    	}
	],
	"card": {
		"card_number": 4123556678901111,
	    "card_holder_name": "Joao da Silva",
	    "card_expiration_month": "10",
	    "card_expiration_year": "20",
	    "card_cvv": "456"
	},
	"percentage_0": 30
}
