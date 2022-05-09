import './App.css';
import {useState} from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './Navbar';
import MainVerify from './Mainverify'
import Main from './Main'
import Verify from './Verify';

function App() {
  const [accounts,setAccounts] = useState([])
  return (
    <div>
      <Routes>
          <Route path="/" element={<Main accounts={accounts} setAccounts={setAccounts}/>} />
          <Route path=":SerialNumber" element={<Verify accounts={accounts} setAccounts={setAccounts}/>} />
          <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
          {/* <Route path="/login" component={Login} /> */}
      </Routes>
    </div>
    
    
  );
}

export default App;
