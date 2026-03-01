// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CharityConnectLedger {
    
    struct Donation {
        uint256 donationId;
        string ngoId;
        string action; // "received" or "distributed"
        uint256 timestamp;
        string notes; // optional
    }

    Donation[] public donations;

    address public admin;

    event DonationLogged(
        uint256 donationId,
        string ngoId,
        string action,
        uint256 timestamp,
        string notes
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can log donations");
        _;
    }

    constructor() {
        admin = msg.sender; // deployer is admin
    }

    function logDonation(
        uint256 _donationId,
        string memory _ngoId,
        string memory _action,
        string memory _notes
    ) public onlyAdmin {
        donations.push(
            Donation({
                donationId: _donationId,
                ngoId: _ngoId,
                action: _action,
                timestamp: block.timestamp,
                notes: _notes
            })
        );

        emit DonationLogged(_donationId, _ngoId, _action, block.timestamp, _notes);
    }

    function getDonationCount() public view returns (uint256) {
        return donations.length;
    }

    function getDonation(uint256 index) public view returns (Donation memory) {
        require(index < donations.length, "Index out of bounds");
        return donations[index];
    }
}
