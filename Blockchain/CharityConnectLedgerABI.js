module.exports = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "donationId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "storyId",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "action",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "notes",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "DonationLogged",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_donationId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_storyId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_action",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_notes",
        "type": "string"
      }
    ],
    "name": "logDonation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "donations",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "donationId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "storyId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "action",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "notes",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
