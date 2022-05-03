import './App.css';
import {useState} from 'react'
import NavBar from './Navbar';
import MainVerify from './Mainverify'

function App() {

  const [accounts,setAccounts] = useState([])

  return (
    <div className="App">
      DeCert
      <NavBar accounts={accounts} setAccounts={setAccounts} />
      <MainVerify accounts={accounts} setAccounts={setAccounts} />
    </div>
  );
}

export default App;
