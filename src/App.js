import './App.css';
import web3 from './web3';
import lottery from './lottery';
import { useEffect, useState } from 'react';

function App() {

  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function getManager() {
      console.log('get manager');
      const result = await lottery.methods.manager().call();
      setManager(result);
    }
    async function getPlayers() {
      console.log('get players');
      const result = await lottery.methods.getPlayers().call();
      setPlayers(result);
    }
    async function getBalance() {
      console.log('get balance');
      const result = await web3.eth.getBalance(lottery.options.address);
      setBalance(result);
    }

    getManager();
    getPlayers();
    getBalance();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log('submit');

    setMessage('Waiting on transaction success...');

    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(`${amount}`, 'ether')
    });

    setMessage('You have been entered!!');
  }

  const pickWinner = async () => {
    console.log('pick winner');
    setMessage('picking a winner...');
    
    const accounts = await web3.eth.getAccounts();
    
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    setMessage('A winner has been picked!!');
  }

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {manager} <br></br>
        There are currently {players.length} people enterd,
        competing to win {web3.utils.fromWei(balance, 'ether')} ether!
      </p>
      <hr></hr>
      <form onSubmit={onSubmit}>
        <h3>Want to try your luck?</h3>
        <div>
          <label>
            Amount of ether to enter
          </label>
          <input type='number' value={amount} onChange={event => {
            setAmount(event.target.value);
          }}></input>
        </div>
        <button>Enter</button>
      </form>

      <div>
        <h3>Time to pick a Winner?</h3>
        <button onClick={pickWinner}>Pick Winner</button>
      </div>

      <hr></hr>
      <h>{message}</h>
    </div>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
