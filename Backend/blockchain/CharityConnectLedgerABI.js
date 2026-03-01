// Backend/blockchain/CharityConnectLedgerABI.js

module.exports = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "donationId", "type": "uint256" },
      { "internalType": "string", "name": "story", "type": "string" },
      { "internalType": "string", "name": "action", "type": "string" },
      { "internalType": "string", "name": "notes", "type": "string" }
    ],
    "name": "logDonation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
