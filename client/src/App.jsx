import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Bank from './artifacts/Bank.json'; // Make sure this path is correct
import './App.scss';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [depositAmount, setDepositAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferRecipient, setTransferRecipient] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [balance, setBalance] = useState('');
  const [queryAddress, setQueryAddress] = useState('');
  const [queryBalance, setQueryBalance] = useState('');
  const [depositResult, setDepositResult] = useState('');
  const [transferResult, setTransferResult] = useState('');
  const [withdrawResult, setWithdrawResult] = useState('');

  useEffect(() => {
    const loadWeb3AndContract = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Bank.networks[networkId];
        const contractInstance = new web3.eth.Contract(
          Bank.abi,
          deployedNetwork && deployedNetwork.address,
        );
        const accounts = await web3.eth.getAccounts();
        setWeb3(web3);
        setContract(contractInstance);
        setAccounts(accounts);
      }
    };
    loadWeb3AndContract();
  }, []);

  const handleDeposit = async () => {
    try {
      await contract.methods.deposit(accounts[0]).send({ from: accounts[0], value: web3.utils.toWei(depositAmount, 'ether') });
      setDepositResult('Deposit successful');
      setDepositAmount('');
    } catch (error) {
      setDepositResult('Deposit failed: ' + error.message);
    }
  };

  const handleTransfer = async () => {
    try {
      await contract.methods.transfer(web3.utils.toWei(transferAmount, 'ether'), transferRecipient).send({ from: accounts[0] });
      setTransferResult('Transfer successful');
      setTransferAmount('');
      setTransferRecipient('');
    } catch (error) {
      setTransferResult('Transfer failed: ' + error.message);
    }
  };

  const handleWithdraw = async () => {
    try {
      await contract.methods.withdraw(web3.utils.toWei(withdrawAmount, 'ether')).send({ from: accounts[0] });
      setWithdrawResult('Withdrawal successful');
      setWithdrawAmount('');
    } catch (error) {
      setWithdrawResult('Withdrawal failed: ' + error.message);
    }
  };

  const handleGetBalance = async () => {
    try {
      const result = await contract.methods.getBalance().call({ from: accounts[0] });
      setBalance(web3.utils.fromWei(result, 'ether'));
    } catch (error) {
      setBalance('Error fetching balance: ' + error.message);
    }
  };

  const handleQueryBalance = async () => {
    try {
      const result = await contract.methods.getBalance().call({ from: queryAddress });
      setQueryBalance(web3.utils.fromWei(result, 'ether'));
    } catch (error) {
      setQueryBalance('Error fetching balance: ' + error.message);
    }
  };

  return (
    <div className="app">
      <h1>dBanking Application</h1>

      <div className="section">
        <h2>Deposit</h2>
        <input
          type="text"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="Amount in ETH"
        />
        <button onClick={handleDeposit}>Deposit</button>
        <div>{depositResult}</div>
      </div>

      <div className="section">
        <h2>Transfer</h2>
        <input
          type="text"
          value={transferRecipient}
          onChange={(e) => setTransferRecipient(e.target.value)}
          placeholder="Recipient Address"
        />
        <input
          type="text"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          placeholder="Amount in ETH"
        />
        <button onClick={handleTransfer}>Transfer</button>
        <div>{transferResult}</div>
      </div>

      <div className="section">
        <h2>Withdraw</h2>
        <input
          type="text"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          placeholder="Amount in ETH"
        />
        <button onClick={handleWithdraw}>Withdraw</button>
        <div>{withdrawResult}</div>
      </div>

      <div className="section">
        <h2>Get Balance</h2>
        <button onClick={handleGetBalance}>Get Balance</button>
        <div>Balance: {balance} ETH</div>
      </div>

      <div className="section">
        <h2>Query Balance</h2>
        <input
          type="text"
          value={queryAddress}
          onChange={(e) => setQueryAddress(e.target.value)}
          placeholder="Address"
        />
        <button onClick={handleQueryBalance}>Query Balance</button>
        <div>Balance of {queryAddress}: {queryBalance} ETH</div>
      </div>
    </div>
  );
};

export default App;
