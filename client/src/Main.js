import React from 'react';
import {useState} from 'react'
import NavBar from './Navbar';
import MainVerify from './Mainverify'

function Main({accounts,setAccounts}) {
    return (
    <div className="container-fluid mx-auto  mt-10 flex">
      <br></br><br></br>
      <h1 class="mx-auto text-center">DeCert</h1>
      <NavBar accounts={accounts} setAccounts={setAccounts} />
      <MainVerify accounts={accounts} setAccounts={setAccounts} />
    </div>
    );
}

export default Main;