// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
/*
    In public functions, Solidity immediately copies array arguments to memory, 
    while external functions can read directly from calldata. Memory allocation is expensive, 
    whereas reading from calldata is cheap. 
    Therefore we gonna use external ones as we dont want to spent a whole tranfer of funds in gas
    (Proof of work PTSD)

    https://ethereum.stackexchange.com/questions/19380/external-vs-public-best-practices
*/

contract Bank {
    //getBalance wouldnt work on thirdweb, made this public
    mapping(address=>uint) public balances;

    fallback() external payable {
        balances[msg.sender]+=msg.value;
    }

    receive() external payable {
    balances[msg.sender] += msg.value;
    }

    function getBalance() external view returns (uint) {
        return balances[msg.sender];
    }

    function deposit(address _receiver) payable external {
        balances[_receiver]+=msg.value;
    }

    function withdraw(uint _amount) external {
/*      We gotta verify if sender has enough money to send
        Then update balances and then transfer
        Then we zero'ing sender's balance
        so we avoid reentrancy exploit
        https://medium.com/coinmonks/reentrancy-exploit-ac5417086750
        https://consensys.io/diligence/blog/2019/09/stop-using-soliditys-transfer-now/
        */

        require (balances[msg.sender] >= _amount, "Insufficient funds");
        balances[msg.sender]-=_amount;
        (bool success, ) = msg.sender.call{value:_amount}("");
        require(success, "Failed to send funds");
    }

    function transfer(uint _amount, address _receiver) external{
        require(balances[msg.sender]>=_amount, "Insufficent funds");
        balances[msg.sender]-=_amount;
        balances[_receiver]+=_amount;
    }
}