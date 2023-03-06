const Web3 = require('web3');

if (typeof web3 !== 'undefined') {this.web3 = new Web3(web3.currentProvider);
} else {
    this.web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:7545"));
}

const abi= [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "service",
				"type": "string"
			}
		],
		"name": "regester",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "service",
				"type": "string"
			}
		],
		"name": "getKey",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "number",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
const address = '0xd6530E435B6F1231d838a432E790Dc95c251A28b'
const regester = new this.web3.eth.Contract(abi,address)



function regesterService(){
    regester.methods.regester("picture").send({
        from: '0x3e987639Ae018b1172eBBfa2711bAa60Dc6D2006'
    });
}

function getService(){
    regester.methods.getKey("picture").call((err, res) => {
        console.log(res)
    }) 
}

regesterService();

getService();