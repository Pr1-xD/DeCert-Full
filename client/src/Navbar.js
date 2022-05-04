import React from 'react';

function Navbar({accounts,setAccounts}) {
    const isConnected= Boolean(accounts[0])
    
    async function connectAccount(){
        if(window.ethereum){
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            })
            setAccounts(accounts)
        }
    }

    return (
        <div class="container mx-auto text-center">
            {isConnected?<p>Connected</p>:<button class="btn btn-primary " onClick={connectAccount}>Connect</button>}
        </div>
    );
}

export default Navbar;