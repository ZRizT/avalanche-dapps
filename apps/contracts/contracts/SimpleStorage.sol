// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    address public owner; //task 1 ownership

    // data stage
    uint256 private storedValue;
    string private storedMessage; //variabel buat nama dan nim untuk task4

    // track event
    event OwnerSet(address indexed oldOwner, address indexed newOwner);
    event ValueUpdated(uint256 newValue);
    event MessageUpdated(string newMessage);

    // task 4 modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    // Constructor: Set Owner saat deploy
    constructor() {
        owner = msg.sender;
        emit OwnerSet(address(0), owner);
    }

    // 1. Set Value (Angka) - Pakai onlyOwner
    function setValue(uint256 _value) public onlyOwner {
        storedValue = _value;
        emit ValueUpdated(_value);
    }

    function getValue() public view returns (uint256) {
        return storedValue;
    }

    // 2. Set Message (String/Nama) - Pakai onlyOwner
    function setMessage(string memory _message) public onlyOwner {
        storedMessage = _message;
        emit MessageUpdated(_message);
    }

    function getMessage() public view returns (string memory) {
        return storedMessage;
    }
}
